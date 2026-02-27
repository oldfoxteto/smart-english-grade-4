import { Router } from "express";
import { query } from "../db/pool.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const leaderboardRouter = Router();

/**
 * GET /api/v1/leaderboard
 * Global leaderboard - top 100 users
 */
leaderboardRouter.get("/", async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        rank,
        user_id,
        display_name,
        total_xp,
        level,
        streak_days
      FROM v_leaderboard
      LIMIT 100
    `);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch leaderboard" });
  }
});

/**
 * GET /api/v1/leaderboard/friends
 * Leaderboard among current user's friends
 */
leaderboardRouter.get("/friends", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(`
      SELECT 
        l.rank,
        l.user_id,
        l.display_name,
        l.total_xp,
        l.level,
        l.streak_days,
        CASE WHEN l.user_id = $1 THEN true ELSE false END as is_me
      FROM v_leaderboard l
      WHERE l.user_id = $1 
         OR l.user_id IN (
           SELECT 
             CASE 
               WHEN user_a = $1 THEN user_b
               ELSE user_a
             END as friend_id
           FROM friends
           WHERE status = 'accepted' AND (user_a = $1 OR user_b = $1)
         )
      ORDER BY l.rank ASC
      LIMIT 50
    `, [userId]);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error("Friends leaderboard error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch friends leaderboard" });
  }
});

/**
 * GET /api/v1/leaderboard/me
 * Current user's rank and position
 */
leaderboardRouter.get("/me", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(`
      SELECT 
        rank,
        user_id,
        display_name,
        total_xp,
        level,
        streak_days
      FROM v_leaderboard
      WHERE user_id = $1
      LIMIT 1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found in leaderboard" });
    }

    const userData = result.rows[0];

    // Get next rank user
    const nextRankResult = await query(`
      SELECT 
        rank,
        total_xp,
        display_name
      FROM v_leaderboard
      WHERE rank = $1 - 1
      LIMIT 1
    `, [userData.rank]);

    res.json({
      success: true,
      data: {
        ...userData,
        nextRank: nextRankResult.rows[0] || null,
        xpToNextRank: nextRankResult.rows[0] 
          ? nextRankResult.rows[0].total_xp - userData.total_xp 
          : 0
      }
    });
  } catch (error) {
    console.error("User rank error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user rank" });
  }
});

/**
 * GET /api/v1/leaderboard/around-me
 * Users ranked around current user (for context)
 */
leaderboardRouter.get("/around-me", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    // First get user's rank
    const userRankResult = await query(`
      SELECT rank FROM v_leaderboard WHERE user_id = $1
    `, [userId]);

    if (userRankResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userRank = userRankResult.rows[0].rank;

    // Get users 5 ranks above and below
    const result = await query(`
      SELECT 
        rank,
        user_id,
        display_name,
        total_xp,
        level,
        CASE WHEN user_id = $1 THEN true ELSE false END as is_me
      FROM v_leaderboard
      WHERE rank BETWEEN ($2 - 5) AND ($2 + 5)
      ORDER BY rank ASC
    `, [userId, userRank]);

    res.json({
      success: true,
      data: result.rows,
      userRank: userRank,
      count: result.rows.length
    });
  } catch (error) {
    console.error("Around me leaderboard error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch leaderboard context" });
  }
});

export default leaderboardRouter;
