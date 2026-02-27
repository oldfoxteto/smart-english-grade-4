import { query } from "../db/pool.js";

export async function recordOpsEvent({ eventName, metadata = {}, userId = null, source = "backend_obs" }) {
  try {
    await query(
      `INSERT INTO analytics_events (user_id, event_name, source, metadata_json)
       VALUES ($1, $2, $3, $4::jsonb)`,
      [userId, eventName, source, JSON.stringify(metadata || {})]
    );
  } catch {
    // Best-effort observability write; never break request flow.
  }
}
