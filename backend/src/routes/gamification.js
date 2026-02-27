import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { query } from "../db/pool.js";

export const gamificationRouter = Router();

const sourceRules = {
  ai_tutor_session: {
    cooldownSeconds: 60,
    dailyCap: 120
  }
};

gamificationRouter.get("/status", requireAuth, async (req, res, next) => {
  try {
    const [xpResult, streakResult, aiDailyResult, aiCooldownResult] = await Promise.all([
      query(
        `SELECT COALESCE(SUM(points), 0)::int AS xp
         FROM xp_ledger
         WHERE user_id = $1`,
        [req.user.sub]
      ),
      query(
        `SELECT current_days, best_days, last_active_date
         FROM streaks
         WHERE user_id = $1`,
        [req.user.sub]
      ),
      query(
        `SELECT COALESCE(SUM(points), 0)::int AS daily_points
         FROM xp_ledger
         WHERE user_id = $1
           AND source = 'ai_tutor_session'
           AND created_at::date = CURRENT_DATE`,
        [req.user.sub]
      ),
      query(
        `SELECT EXTRACT(EPOCH FROM (NOW() - MAX(created_at)))::int AS seconds_since_last
         FROM xp_ledger
         WHERE user_id = $1 AND source = 'ai_tutor_session'`,
        [req.user.sub]
      )
    ]);

    const totalXp = xpResult.rows[0].xp;
    const level = Math.floor(totalXp / 100) + 1;
    const nextLevelXp = level * 100;

    if (streakResult.rowCount === 0) {
      await query(
        `INSERT INTO streaks (user_id, current_days, best_days)
         VALUES ($1, 0, 0)
         ON CONFLICT (user_id) DO NOTHING`,
        [req.user.sub]
      );
    }

    const streak = streakResult.rowCount > 0
      ? streakResult.rows[0]
      : { current_days: 0, best_days: 0, last_active_date: null };

    const aiDailyCap = sourceRules.ai_tutor_session.dailyCap;
    const aiDailyPoints = aiDailyResult.rows[0]?.daily_points ?? 0;
    const aiRemainingToday = Math.max(0, aiDailyCap - aiDailyPoints);
    const secondsSinceLast = aiCooldownResult.rows[0]?.seconds_since_last;
    const aiCooldownRemainingSeconds =
      secondsSinceLast === null
        ? 0
        : Math.max(0, sourceRules.ai_tutor_session.cooldownSeconds - secondsSinceLast);

    return res.json({
      totalXp,
      level,
      nextLevelXp,
      currentStreakDays: streak.current_days,
      bestStreakDays: streak.best_days,
      lastActiveDate: streak.last_active_date,
      aiTutor: {
        dailyCap: aiDailyCap,
        awardedToday: aiDailyPoints,
        remainingToday: aiRemainingToday,
        cooldownRemainingSeconds: aiCooldownRemainingSeconds
      }
    });
  } catch (error) {
    return next(error);
  }
});

gamificationRouter.post("/award", requireAuth, async (req, res, next) => {
  try {
    const source = String(req.body?.source || "manual");
    const points = Number(req.body?.points || 0);
    const rule = sourceRules[source];

    if (!Number.isInteger(points) || points <= 0 || points > 500) {
      return res.status(400).json({ error: "points must be an integer between 1 and 500" });
    }

    if (rule) {
      const cooldownCheck = await query(
        `SELECT EXTRACT(EPOCH FROM (NOW() - MAX(created_at)))::int AS seconds_since_last
         FROM xp_ledger
         WHERE user_id = $1 AND source = $2`,
        [req.user.sub, source]
      );

      const secondsSinceLast = cooldownCheck.rows[0]?.seconds_since_last;
      if (secondsSinceLast !== null && secondsSinceLast < rule.cooldownSeconds) {
        const retryAfterSeconds = rule.cooldownSeconds - secondsSinceLast;
        return res.status(429).json({
          error: "Cooldown active for this activity",
          retryAfterSeconds
        });
      }

      const dailyProgress = await query(
        `SELECT COALESCE(SUM(points), 0)::int AS daily_points
         FROM xp_ledger
         WHERE user_id = $1
           AND source = $2
           AND created_at::date = CURRENT_DATE`,
        [req.user.sub, source]
      );

      const dailyPoints = dailyProgress.rows[0]?.daily_points ?? 0;
      if (dailyPoints + points > rule.dailyCap) {
        const remainingToday = Math.max(0, rule.dailyCap - dailyPoints);
        return res.status(429).json({
          error: "Daily XP cap reached for this activity",
          dailyCap: rule.dailyCap,
          awardedToday: dailyPoints,
          remainingToday
        });
      }
    }

    await query(
      `INSERT INTO xp_ledger (user_id, source, points)
       VALUES ($1, $2, $3)`,
      [req.user.sub, source, points]
    );

    await query(
      `INSERT INTO streaks (user_id, current_days, best_days, last_active_date)
       VALUES ($1, 1, 1, CURRENT_DATE)
       ON CONFLICT (user_id)
       DO UPDATE SET
         current_days = CASE
           WHEN streaks.last_active_date = CURRENT_DATE THEN streaks.current_days
           WHEN streaks.last_active_date = CURRENT_DATE - INTERVAL '1 day' THEN streaks.current_days + 1
           ELSE 1
         END,
         best_days = GREATEST(streaks.best_days, CASE
           WHEN streaks.last_active_date = CURRENT_DATE THEN streaks.current_days
           WHEN streaks.last_active_date = CURRENT_DATE - INTERVAL '1 day' THEN streaks.current_days + 1
           ELSE 1
         END),
         last_active_date = CURRENT_DATE`,
      [req.user.sub]
    );

    return res.status(201).json({ ok: true });
  } catch (error) {
    return next(error);
  }
});
