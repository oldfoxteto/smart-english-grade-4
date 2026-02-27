import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import { validateBody } from "../middleware/validateBody.js";
import { analyticsEventSchema } from "../validation.js";
import { query } from "../db/pool.js";
import { adminReadLimiter, analyticsWriteLimiter } from "../middleware/rateLimiters.js";
import { getAiCircuitState } from "../services/aiTutorService.js";

export const analyticsRouter = Router();
const allowedScenarios = new Set(["all", "daily", "travel", "work", "migration"]);

analyticsRouter.post("/events", requireAuth, analyticsWriteLimiter, validateBody(analyticsEventSchema), async (req, res, next) => {
  try {
    const { eventName, source, metadata } = req.validatedBody;

    await query(
      `INSERT INTO analytics_events (user_id, event_name, source, metadata_json)
       VALUES ($1, $2, $3, $4::jsonb)`,
      [req.user.sub, eventName, source, JSON.stringify(metadata || {})]
    );

    return res.status(201).json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

analyticsRouter.get("/summary", requireAuth, requireRole("admin"), adminReadLimiter, async (req, res, next) => {
  try {
    const hoursRaw = Number(req.query.hours || 24);
    const hours = Number.isFinite(hoursRaw) ? Math.max(1, Math.min(168, Math.floor(hoursRaw))) : 24;
    const scenarioRaw = String(req.query.scenario || "all").toLowerCase();
    const scenario = allowedScenarios.has(scenarioRaw) ? scenarioRaw : "all";

    const [result, topScenariosResult] = await Promise.all([
      query(
      `SELECT event_name, COUNT(*)::int AS count
       FROM analytics_events
       WHERE created_at >= NOW() - ($1::int * INTERVAL '1 hour')
         AND ($2 = 'all' OR COALESCE(metadata_json->>'scenario', 'unknown') = $2)
       GROUP BY event_name`,
      [hours, scenario]
      ),
      query(
        `SELECT
           COALESCE(metadata_json->>'scenario', 'unknown') AS scenario,
           COUNT(*)::int AS count
         FROM analytics_events
         WHERE created_at >= NOW() - ($1::int * INTERVAL '1 hour')
           AND event_name = 'ai_tutor_submitted'
           AND ($2 = 'all' OR COALESCE(metadata_json->>'scenario', 'unknown') = $2)
         GROUP BY COALESCE(metadata_json->>'scenario', 'unknown')
         ORDER BY count DESC
         LIMIT 5`,
        [hours, scenario]
      )
    ]);

    const counts = {
      ai_tutor_submitted: 0,
      ai_tutor_success: 0,
      ai_tutor_retry: 0,
      ai_tutor_cooldown_hit: 0,
      ai_tutor_daily_cap_hit: 0
    };

    for (const row of result.rows) {
      if (row.event_name in counts) {
        counts[row.event_name] = row.count;
      }
    }

    const submitted = counts.ai_tutor_submitted;
    const success = counts.ai_tutor_success;
    const successRate = submitted > 0 ? Number(((success / submitted) * 100).toFixed(1)) : 0;

    return res.json({
      windowHours: hours,
      scenario,
      counts,
      kpis: {
        submitted,
        success,
        successRate
      },
      topScenarios: topScenariosResult.rows
    });
  } catch (error) {
    return next(error);
  }
});

analyticsRouter.get("/trend", requireAuth, requireRole("admin"), adminReadLimiter, async (req, res, next) => {
  try {
    const hoursRaw = Number(req.query.hours || 24);
    const hours = Number.isFinite(hoursRaw) ? Math.max(1, Math.min(168, Math.floor(hoursRaw))) : 24;
    const scenarioRaw = String(req.query.scenario || "all").toLowerCase();
    const scenario = allowedScenarios.has(scenarioRaw) ? scenarioRaw : "all";

    const result = await query(
      `WITH series AS (
         SELECT generate_series(
           date_trunc('hour', NOW()) - (($1::int - 1) * INTERVAL '1 hour'),
           date_trunc('hour', NOW()),
           INTERVAL '1 hour'
         ) AS hour_start
       ),
       events AS (
         SELECT
           date_trunc('hour', created_at) AS hour_start,
           event_name,
           COUNT(*)::int AS count
         FROM analytics_events
         WHERE created_at >= NOW() - ($1::int * INTERVAL '1 hour')
           AND ($2 = 'all' OR COALESCE(metadata_json->>'scenario', 'unknown') = $2)
         GROUP BY 1, 2
       )
       SELECT
         s.hour_start,
         COALESCE(SUM(e.count), 0)::int AS total,
         COALESCE(SUM(CASE WHEN e.event_name = 'ai_tutor_submitted' THEN e.count ELSE 0 END), 0)::int AS ai_tutor_submitted,
         COALESCE(SUM(CASE WHEN e.event_name = 'ai_tutor_success' THEN e.count ELSE 0 END), 0)::int AS ai_tutor_success,
         COALESCE(SUM(CASE WHEN e.event_name = 'ai_tutor_retry' THEN e.count ELSE 0 END), 0)::int AS ai_tutor_retry,
         COALESCE(SUM(CASE WHEN e.event_name = 'ai_tutor_cooldown_hit' THEN e.count ELSE 0 END), 0)::int AS ai_tutor_cooldown_hit,
         COALESCE(SUM(CASE WHEN e.event_name = 'ai_tutor_daily_cap_hit' THEN e.count ELSE 0 END), 0)::int AS ai_tutor_daily_cap_hit
       FROM series s
       LEFT JOIN events e ON e.hour_start = s.hour_start
       GROUP BY s.hour_start
       ORDER BY s.hour_start ASC`,
      [hours, scenario]
    );

    const points = result.rows.map((row) => {
      const submitted = row.ai_tutor_submitted ?? 0;
      const success = row.ai_tutor_success ?? 0;
      const successRate = submitted > 0 ? Number(((success / submitted) * 100).toFixed(1)) : 0;
      return {
        ...row,
        success_rate: successRate
      };
    });

    return res.json({
      windowHours: hours,
      scenario,
      points
    });
  } catch (error) {
    return next(error);
  }
});

analyticsRouter.get("/ops/dashboard", requireAuth, requireRole("admin"), adminReadLimiter, async (req, res, next) => {
  try {
    const hoursRaw = Number(req.query.hours || 24);
    const hours = Number.isFinite(hoursRaw) ? Math.max(1, Math.min(168, Math.floor(hoursRaw))) : 24;

    const [kpiRes, trendRes] = await Promise.all([
      query(
        `WITH req AS (
           SELECT
             COUNT(*)::int AS total_requests,
             COALESCE(AVG((metadata_json->>'durationMs')::numeric), 0)::numeric AS avg_latency_ms,
             COALESCE(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY (metadata_json->>'durationMs')::numeric), 0)::numeric AS p95_latency_ms
           FROM analytics_events
           WHERE source = 'backend_obs'
             AND event_name = 'ops_request_completed'
             AND created_at >= NOW() - ($1::int * INTERVAL '1 hour')
         ),
         errs AS (
           SELECT COUNT(*)::int AS total_errors
           FROM analytics_events
           WHERE source = 'backend_obs'
             AND event_name = 'ops_request_error'
             AND created_at >= NOW() - ($1::int * INTERVAL '1 hour')
         ),
         retries AS (
           SELECT COUNT(*)::int AS total_retries
           FROM analytics_events
           WHERE source = 'backend_obs'
             AND event_name = 'ops_ai_retry'
             AND created_at >= NOW() - ($1::int * INTERVAL '1 hour')
         ),
         opens AS (
           SELECT COUNT(*)::int AS total_circuit_open_events
           FROM analytics_events
           WHERE source = 'backend_obs'
             AND event_name = 'ops_ai_circuit_open'
             AND created_at >= NOW() - ($1::int * INTERVAL '1 hour')
         )
         SELECT
           req.total_requests,
           errs.total_errors,
           retries.total_retries,
           opens.total_circuit_open_events,
           ROUND(req.avg_latency_ms, 1) AS avg_latency_ms,
           ROUND(req.p95_latency_ms, 1) AS p95_latency_ms
         FROM req, errs, retries, opens`,
        [hours]
      ),
      query(
        `WITH series AS (
           SELECT generate_series(
             date_trunc('hour', NOW()) - (($1::int - 1) * INTERVAL '1 hour'),
             date_trunc('hour', NOW()),
             INTERVAL '1 hour'
           ) AS hour_start
         ),
         req AS (
           SELECT
             date_trunc('hour', created_at) AS hour_start,
             COUNT(*)::int AS request_count,
             COALESCE(AVG((metadata_json->>'durationMs')::numeric), 0)::numeric AS avg_latency_ms
           FROM analytics_events
           WHERE source = 'backend_obs'
             AND event_name = 'ops_request_completed'
             AND created_at >= NOW() - ($1::int * INTERVAL '1 hour')
           GROUP BY 1
         ),
         errs AS (
           SELECT date_trunc('hour', created_at) AS hour_start, COUNT(*)::int AS error_count
           FROM analytics_events
           WHERE source = 'backend_obs'
             AND event_name = 'ops_request_error'
             AND created_at >= NOW() - ($1::int * INTERVAL '1 hour')
           GROUP BY 1
         ),
         retries AS (
           SELECT date_trunc('hour', created_at) AS hour_start, COUNT(*)::int AS retry_count
           FROM analytics_events
           WHERE source = 'backend_obs'
             AND event_name = 'ops_ai_retry'
             AND created_at >= NOW() - ($1::int * INTERVAL '1 hour')
           GROUP BY 1
         ),
         opens AS (
           SELECT date_trunc('hour', created_at) AS hour_start, COUNT(*)::int AS circuit_open_count
           FROM analytics_events
           WHERE source = 'backend_obs'
             AND event_name = 'ops_ai_circuit_open'
             AND created_at >= NOW() - ($1::int * INTERVAL '1 hour')
           GROUP BY 1
         )
         SELECT
           s.hour_start,
           COALESCE(req.request_count, 0)::int AS request_count,
           COALESCE(errs.error_count, 0)::int AS error_count,
           COALESCE(retries.retry_count, 0)::int AS retry_count,
           COALESCE(opens.circuit_open_count, 0)::int AS circuit_open_count,
           ROUND(COALESCE(req.avg_latency_ms, 0), 1) AS avg_latency_ms
         FROM series s
         LEFT JOIN req ON req.hour_start = s.hour_start
         LEFT JOIN errs ON errs.hour_start = s.hour_start
         LEFT JOIN retries ON retries.hour_start = s.hour_start
         LEFT JOIN opens ON opens.hour_start = s.hour_start
         ORDER BY s.hour_start ASC`,
        [hours]
      )
    ]);

    const k = kpiRes.rows[0] || {};
    const totalRequests = Number(k.total_requests || 0);
    const totalErrors = Number(k.total_errors || 0);
    const errorRate = totalRequests > 0 ? Number(((totalErrors / totalRequests) * 100).toFixed(2)) : 0;
    const trend = trendRes.rows.map((row) => {
      const reqCount = Number(row.request_count || 0);
      const errCount = Number(row.error_count || 0);
      return {
        hour_start: row.hour_start,
        request_count: reqCount,
        error_count: errCount,
        retry_count: Number(row.retry_count || 0),
        circuit_open_count: Number(row.circuit_open_count || 0),
        avg_latency_ms: Number(row.avg_latency_ms || 0),
        error_rate: reqCount > 0 ? Number(((errCount / reqCount) * 100).toFixed(2)) : 0
      };
    });

    return res.json({
      windowHours: hours,
      kpis: {
        totalRequests,
        totalErrors,
        errorRate,
        avgLatencyMs: Number(k.avg_latency_ms || 0),
        p95LatencyMs: Number(k.p95_latency_ms || 0),
        retryCount: Number(k.total_retries || 0),
        circuitOpenEvents: Number(k.total_circuit_open_events || 0)
      },
      circuit: getAiCircuitState(),
      points: trend
    });
  } catch (error) {
    return next(error);
  }
});

analyticsRouter.get("/ops/routes", requireAuth, requireRole("admin"), adminReadLimiter, async (req, res, next) => {
  try {
    const hoursRaw = Number(req.query.hours || 24);
    const hours = Number.isFinite(hoursRaw) ? Math.max(1, Math.min(168, Math.floor(hoursRaw))) : 24;
    const limitRaw = Number(req.query.limit || 20);
    const limit = Number.isFinite(limitRaw) ? Math.max(5, Math.min(100, Math.floor(limitRaw))) : 20;

    const [routesRes, topFailingRes] = await Promise.all([
      query(
        `WITH base AS (
           SELECT
             COALESCE(metadata_json->>'path', 'unknown') AS path,
             COALESCE(metadata_json->>'method', 'GET') AS method,
             COALESCE((metadata_json->>'statusCode')::int, 0) AS status_code,
             COALESCE((metadata_json->>'durationMs')::numeric, 0) AS duration_ms
           FROM analytics_events
           WHERE source = 'backend_obs'
             AND event_name = 'ops_request_completed'
             AND created_at >= NOW() - ($1::int * INTERVAL '1 hour')
         )
         SELECT
           method,
           path,
           COUNT(*)::int AS request_count,
           COUNT(*) FILTER (WHERE status_code >= 500)::int AS errors_5xx,
           ROUND(
             CASE WHEN COUNT(*) > 0
               THEN (COUNT(*) FILTER (WHERE status_code >= 500)::numeric / COUNT(*)::numeric) * 100
               ELSE 0
             END,
             2
           ) AS error_rate,
           ROUND(AVG(duration_ms), 1) AS avg_latency_ms,
           ROUND((PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration_ms))::numeric, 1) AS p95_latency_ms
         FROM base
         GROUP BY method, path
         ORDER BY errors_5xx DESC, p95_latency_ms DESC, request_count DESC
         LIMIT $2`,
        [hours, limit]
      ),
      query(
        `WITH base AS (
           SELECT
             COALESCE(metadata_json->>'path', 'unknown') AS path,
             COALESCE(metadata_json->>'method', 'GET') AS method,
             COALESCE((metadata_json->>'statusCode')::int, 0) AS status_code
           FROM analytics_events
           WHERE source = 'backend_obs'
             AND event_name = 'ops_request_completed'
             AND created_at >= NOW() - ($1::int * INTERVAL '1 hour')
         )
         SELECT
           method,
           path,
           COUNT(*) FILTER (WHERE status_code >= 500)::int AS errors_5xx,
           COUNT(*)::int AS request_count
         FROM base
         GROUP BY method, path
         HAVING COUNT(*) FILTER (WHERE status_code >= 500) > 0
         ORDER BY errors_5xx DESC, request_count DESC
         LIMIT 5`,
        [hours]
      )
    ]);

    const routes = routesRes.rows.map((row) => ({
      method: row.method,
      path: row.path,
      requestCount: Number(row.request_count || 0),
      errors5xx: Number(row.errors_5xx || 0),
      errorRate: Number(row.error_rate || 0),
      avgLatencyMs: Number(row.avg_latency_ms || 0),
      p95LatencyMs: Number(row.p95_latency_ms || 0)
    }));

    const topFailingRoutes = topFailingRes.rows.map((row) => ({
      method: row.method,
      path: row.path,
      errors5xx: Number(row.errors_5xx || 0),
      requestCount: Number(row.request_count || 0)
    }));

    return res.json({
      windowHours: hours,
      limit,
      routes,
      topFailingRoutes
    });
  } catch (error) {
    return next(error);
  }
});
