import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js";
import { query } from "../src/db/pool.js";
import { checkDatabaseAvailability } from "./helpers/dbAvailability.js";

const email = `integration_${Date.now()}@example.com`;
const password = "Password123!";
let accessToken = "";
let refreshToken = "";
const dbAvailable = await checkDatabaseAvailability();
const dbSkip = dbAvailable
  ? false
  : "Database unavailable. Run `npm run db:reset` and verify DATABASE_URL.";

test("Integration flow: Auth, Placement, Learning Path, Subscriptions", { skip: dbSkip }, async () => {
  const dbCheck = await query("SELECT 1");
  assert.equal(dbCheck.rowCount, 1);

  const plansCheck = await query("SELECT code FROM plans WHERE code = 'pro_monthly'");
  assert.ok(plansCheck.rowCount > 0, "Seeded plan pro_monthly is required");

  const registerRes = await request(app)
    .post("/api/v1/auth/register")
    .send({ email, password, displayName: "Integration User", country: "SA" });

  assert.equal(registerRes.status, 201);
  assert.ok(registerRes.body.token);
  assert.ok(registerRes.body.refreshToken);
  accessToken = registerRes.body.token;
  refreshToken = registerRes.body.refreshToken;

  const refreshRes = await request(app)
    .post("/api/v1/auth/refresh")
    .send({ refreshToken });

  assert.equal(refreshRes.status, 200);
  assert.ok(refreshRes.body.token);
  assert.ok(refreshRes.body.refreshToken);
  accessToken = refreshRes.body.token;

  const placementTestRes = await request(app)
    .get("/api/v1/placement/tests/en")
    .set("Authorization", `Bearer ${accessToken}`);

  assert.equal(placementTestRes.status, 200);
  assert.ok(placementTestRes.body.test.id);
  assert.ok(Array.isArray(placementTestRes.body.test.questions));
  assert.ok(placementTestRes.body.test.questions.length > 0);

  const firstQuestion = placementTestRes.body.test.questions[0];
  const firstOption = firstQuestion.options[0];

  const placementSubmitRes = await request(app)
    .post("/api/v1/placement/submit")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      testId: placementTestRes.body.test.id,
      answers: [{ questionId: firstQuestion.id, optionId: firstOption.id }]
    });

  assert.equal(placementSubmitRes.status, 201);
  assert.ok(placementSubmitRes.body.placementResult.estimatedCefr);

  const pathRes = await request(app)
    .get("/api/v1/learning-path?languageCode=en&goalType=work")
    .set("Authorization", `Bearer ${accessToken}`);

  assert.equal(pathRes.status, 200);
  assert.ok(Array.isArray(pathRes.body.lessons));
  assert.ok(pathRes.body.lessons.length > 0);
  assert.ok(pathRes.body.lessons[0].lesson_id);

  const lessonContentRes = await request(app)
    .get(`/api/v1/lessons/${pathRes.body.lessons[0].lesson_id}/content`)
    .set("Authorization", `Bearer ${accessToken}`);

  assert.equal(lessonContentRes.status, 200);
  assert.ok(lessonContentRes.body.lesson.lessonId);
  assert.ok(Array.isArray(lessonContentRes.body.body.vocabulary));
  assert.ok(Array.isArray(lessonContentRes.body.body.exercises));
  assert.ok(Array.isArray(lessonContentRes.body.body.modelAnswers));

  const plansRes = await request(app).get("/api/v1/subscriptions/plans");
  assert.equal(plansRes.status, 200);
  assert.ok(plansRes.body.plans.length > 0);

  const subscribeRes = await request(app)
    .post("/api/v1/subscriptions/subscribe")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({ planCode: "pro_monthly" });

  assert.equal(subscribeRes.status, 201);
  assert.equal(subscribeRes.body.subscription.status, "active");

  const meSubRes = await request(app)
    .get("/api/v1/subscriptions/me")
    .set("Authorization", `Bearer ${accessToken}`);

  assert.equal(meSubRes.status, 200);
  assert.equal(meSubRes.body.subscription.plan_code, "pro_monthly");

  await query("DELETE FROM users WHERE email = $1", [email]);
});

test("Gamification: AI tutor source enforces cooldown and daily cap", { skip: dbSkip }, async () => {
  const email2 = `integration_gamification_${Date.now()}@example.com`;

  const registerRes = await request(app)
    .post("/api/v1/auth/register")
    .send({ email: email2, password, displayName: "Gamification User", country: "SA" });

  assert.equal(registerRes.status, 201);
  const token = registerRes.body.token;
  const userId = registerRes.body.user.id;

  const firstAward = await request(app)
    .post("/api/v1/gamification/award")
    .set("Authorization", `Bearer ${token}`)
    .send({ source: "ai_tutor_session", points: 12 });

  assert.equal(firstAward.status, 201);

  const cooldownAward = await request(app)
    .post("/api/v1/gamification/award")
    .set("Authorization", `Bearer ${token}`)
    .send({ source: "ai_tutor_session", points: 12 });

  assert.equal(cooldownAward.status, 429);
  assert.equal(cooldownAward.body.error, "Cooldown active for this activity");
  assert.ok(Number(cooldownAward.body.retryAfterSeconds) > 0);

  // Move previous ledger entries back in time to bypass cooldown for the cap scenario.
  await query(
    `UPDATE xp_ledger
     SET created_at = NOW() - INTERVAL '2 minutes'
     WHERE user_id = $1 AND source = 'ai_tutor_session'`,
    [userId]
  );

  // Force today's awarded points near cap.
  await query(
    `INSERT INTO xp_ledger (user_id, source, points, created_at)
     VALUES ($1, 'ai_tutor_session', 108, NOW() - INTERVAL '3 minutes')`,
    [userId]
  );

  const capAward = await request(app)
    .post("/api/v1/gamification/award")
    .set("Authorization", `Bearer ${token}`)
    .send({ source: "ai_tutor_session", points: 12 });

  assert.equal(capAward.status, 429);
  assert.equal(capAward.body.error, "Daily XP cap reached for this activity");
  assert.equal(capAward.body.dailyCap, 120);
  assert.ok(capAward.body.remainingToday <= 0);

  await query("DELETE FROM users WHERE email = $1", [email2]);
});

test("Analytics: AI tutor events are stored", { skip: dbSkip }, async () => {
  const email3 = `integration_analytics_${Date.now()}@example.com`;

  const registerRes = await request(app)
    .post("/api/v1/auth/register")
    .send({ email: email3, password, displayName: "Analytics User", country: "SA" });

  assert.equal(registerRes.status, 201);
  const token = registerRes.body.token;
  const userId = registerRes.body.user.id;

  await query(
    `INSERT INTO user_roles (user_id, role_id)
     SELECT $1, r.id
     FROM roles r
     WHERE r.code = 'admin'
     ON CONFLICT DO NOTHING`,
    [userId]
  );

  const eventRes = await request(app)
    .post("/api/v1/analytics/events")
    .set("Authorization", `Bearer ${token}`)
    .send({
      eventName: "ai_tutor_submitted",
      source: "web_ai_tutor_page",
      metadata: { scenario: "travel", proficiency: "A2" }
    });

  assert.equal(eventRes.status, 201);
  assert.equal(eventRes.body.ok, true);

  const stored = await query(
    `SELECT event_name, source
     FROM analytics_events
     WHERE user_id = $1
       AND event_name = 'ai_tutor_submitted'
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  );

  assert.equal(stored.rowCount, 1);
  assert.equal(stored.rows[0].event_name, "ai_tutor_submitted");
  assert.equal(stored.rows[0].source, "web_ai_tutor_page");

  const summaryRes = await request(app)
    .get("/api/v1/analytics/summary?hours=24")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(summaryRes.status, 200);
  assert.equal(summaryRes.body.windowHours, 24);
  assert.ok(summaryRes.body.counts.ai_tutor_submitted >= 1);
  assert.ok(summaryRes.body.kpis.successRate >= 0);
  assert.ok(Array.isArray(summaryRes.body.topScenarios));

  const filteredSummaryRes = await request(app)
    .get("/api/v1/analytics/summary?hours=24&scenario=travel")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(filteredSummaryRes.status, 200);
  assert.equal(filteredSummaryRes.body.scenario, "travel");
  assert.ok(filteredSummaryRes.body.counts.ai_tutor_submitted >= 1);

  const trendRes = await request(app)
    .get("/api/v1/analytics/trend?hours=24")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(trendRes.status, 200);
  assert.equal(trendRes.body.windowHours, 24);
  assert.ok(Array.isArray(trendRes.body.points));
  assert.ok(trendRes.body.points.length > 0);
  assert.ok(typeof trendRes.body.points[0].success_rate === "number");

  const filteredTrendRes = await request(app)
    .get("/api/v1/analytics/trend?hours=24&scenario=travel")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(filteredTrendRes.status, 200);
  assert.equal(filteredTrendRes.body.scenario, "travel");
  assert.ok(Array.isArray(filteredTrendRes.body.points));

  const opsDashboardRes = await request(app)
    .get("/api/v1/analytics/ops/dashboard?hours=24")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(opsDashboardRes.status, 200);
  assert.equal(opsDashboardRes.body.windowHours, 24);
  assert.ok(typeof opsDashboardRes.body.kpis.avgLatencyMs === "number");
  assert.ok(typeof opsDashboardRes.body.kpis.errorRate === "number");
  assert.ok(typeof opsDashboardRes.body.kpis.retryCount === "number");
  assert.ok(typeof opsDashboardRes.body.circuit.state === "string");
  assert.ok(Array.isArray(opsDashboardRes.body.points));

  const opsRoutesRes = await request(app)
    .get("/api/v1/analytics/ops/routes?hours=24&limit=10")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(opsRoutesRes.status, 200);
  assert.equal(opsRoutesRes.body.windowHours, 24);
  assert.equal(opsRoutesRes.body.limit, 10);
  assert.ok(Array.isArray(opsRoutesRes.body.routes));
  assert.ok(Array.isArray(opsRoutesRes.body.topFailingRoutes));

  await query("DELETE FROM users WHERE email = $1", [email3]);
});
