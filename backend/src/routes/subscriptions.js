import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { query } from "../db/pool.js";

export const subscriptionsRouter = Router();

subscriptionsRouter.get("/plans", async (_req, res, next) => {
  try {
    const plans = await query(
      `SELECT id, code, name, billing_cycle, price_usd, features_json
       FROM plans
       ORDER BY price_usd ASC`
    );

    return res.json({ plans: plans.rows });
  } catch (error) {
    return next(error);
  }
});

subscriptionsRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const current = await query(
      `SELECT s.id, s.status, s.started_at, s.renews_at, s.canceled_at,
              p.code AS plan_code, p.name AS plan_name, p.price_usd, p.billing_cycle
       FROM subscriptions s
       JOIN plans p ON p.id = s.plan_id
       WHERE s.user_id = $1
       ORDER BY s.started_at DESC
       LIMIT 1`,
      [req.user.sub]
    );

    if (current.rowCount === 0) {
      return res.json({ subscription: null });
    }

    return res.json({ subscription: current.rows[0] });
  } catch (error) {
    return next(error);
  }
});

subscriptionsRouter.post("/subscribe", requireAuth, async (req, res, next) => {
  try {
    const planCode = String(req.body?.planCode || "").trim();
    if (!planCode) {
      return res.status(400).json({ error: "planCode is required" });
    }

    const planResult = await query("SELECT id, billing_cycle FROM plans WHERE code = $1", [planCode]);
    if (planResult.rowCount === 0) {
      return res.status(404).json({ error: "Plan not found" });
    }

    const plan = planResult.rows[0];

    await query(
      `UPDATE subscriptions
       SET status = 'canceled', canceled_at = NOW()
       WHERE user_id = $1 AND status = 'active'`,
      [req.user.sub]
    );

    const renewalInterval = plan.billing_cycle === "yearly" ? "1 year" : "1 month";

    const subscription = await query(
      `INSERT INTO subscriptions (user_id, plan_id, status, renews_at)
       VALUES ($1, $2, 'active', NOW() + $3::interval)
       RETURNING id, status, started_at, renews_at`,
      [req.user.sub, plan.id, renewalInterval]
    );

    return res.status(201).json({ subscription: subscription.rows[0] });
  } catch (error) {
    return next(error);
  }
});
