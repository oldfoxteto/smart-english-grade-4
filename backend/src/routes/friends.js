import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { query } from "../db/pool.js";

export const friendsRouter = Router();

// ============================================================
// GET FRIENDS LIST
// ============================================================
friendsRouter.get("/list", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id;

    // Get all friends (both directions)
    const result = await query(
      `SELECT 
        u.id,
        p.display_name,
        u.email,
        (SELECT COUNT(*) FROM xp_ledger WHERE user_id = u.id) as total_xp,
        CASE 
          WHEN u.id = $1 THEN 'self'
          WHEN EXISTS (SELECT 1 FROM friends WHERE (user_id_1 = $1 AND user_id_2 = u.id) OR (user_id_1 = u.id AND user_id_2 = $1))
          THEN 'friend'
          ELSE 'not_friend'
        END as relationship
      FROM users u
      JOIN profiles p ON u.id = p.user_id
      WHERE u.id != $1
      AND NOT EXISTS (SELECT 1 FROM blocked_users WHERE blocker_id = $1 AND blocked_id = u.id)
      AND NOT EXISTS (SELECT 1 FROM blocked_users WHERE blocker_id = u.id AND blocked_id = $1)
      ORDER BY 
        CASE 
          WHEN EXISTS (SELECT 1 FROM friends WHERE (user_id_1 = $1 AND user_id_2 = u.id) OR (user_id_1 = u.id AND user_id_2 = $1))
          THEN 0
          ELSE 1
        END,
        p.display_name ASC
      LIMIT 100`,
      [userId]
    );

    return res.json({
      success: true,
      friends: result.rows.filter(r => r.relationship === 'friend'),
      others: result.rows.filter(r => r.relationship === 'not_friend'),
      count: result.rows.filter(r => r.relationship === 'friend').length,
    });
  } catch (error) {
    return next(error);
  }
});

// ============================================================
// SEND FRIEND REQUEST
// ============================================================
friendsRouter.post("/request/:userId", requireAuth, async (req, res, next) => {
  try {
    const requesterId = req.user?.id;
    const { userId: targetUserId } = req.params;

    // Check if already friends
    const existingFriendship = await query(
      `SELECT id FROM friends 
       WHERE (user_id_1 = $1 AND user_id_2 = $2) 
       OR (user_id_1 = $2 AND user_id_2 = $1)`,
      [requesterId, targetUserId]
    );

    if (existingFriendship.rowCount > 0) {
      return res.status(400).json({ error: "Already friends" });
    }

    // Check for pending requests
    const pendingRequest = await query(
      `SELECT id FROM friend_requests 
       WHERE (requester_id = $1 AND requestee_id = $2 AND status = 'pending')
       OR (requester_id = $2 AND requestee_id = $1 AND status = 'pending')`,
      [requesterId, targetUserId]
    );

    if (pendingRequest.rowCount > 0) {
      return res.status(400).json({ error: "Request already pending" });
    }

    // Send friend request
    await query(
      `INSERT INTO friend_requests (requester_id, requestee_id, status)
       VALUES ($1, $2, 'pending')`,
      [requesterId, targetUserId]
    );

    return res.json({ success: true, message: "Friend request sent" });
  } catch (error) {
    return next(error);
  }
});

// ============================================================
// RESPOND TO FRIEND REQUEST
// ============================================================
friendsRouter.post("/request/:requestId/respond", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { requestId } = req.params;
    const { accept } = req.body;

    // Get request details
    const requestResult = await query(
      `SELECT requester_id, requestee_id FROM friend_requests 
       WHERE id = $1 AND requestee_id = $2`,
      [requestId, userId]
    );

    if (requestResult.rowCount === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    const { requester_id, requestee_id } = requestResult.rows[0];

    if (accept) {
      // Accept: update request and create friendship
      await query("BEGIN");
      try {
        await query(
          `UPDATE friend_requests SET status = 'accepted', responded_at = NOW()
           WHERE id = $1`,
          [requestId]
        );

        // Create friendship (always store with smaller ID first)
        const user1 = requester_id < requestee_id ? requester_id : requestee_id;
        const user2 = requester_id < requestee_id ? requestee_id : requester_id;

        await query(
          `INSERT INTO friends (user_id_1, user_id_2)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [user1, user2]
        );
        await query("COMMIT");

        return res.json({ success: true, message: "Friend request accepted" });
      } catch (error) {
        await query("ROLLBACK");
        throw error;
      }
    } else {
      // Reject
      await query(
        `UPDATE friend_requests SET status = 'rejected', responded_at = NOW()
         WHERE id = $1`,
        [requestId]
      );
      return res.json({ success: true, message: "Friend request rejected" });
    }
  } catch (error) {
    return next(error);
  }
});

// ============================================================
// GET FRIEND REQUESTS
// ============================================================
friendsRouter.get("/requests", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const result = await query(
      `SELECT 
        fr.id,
        fr.requester_id,
        p.display_name,
        u.email,
        fr.requested_at
      FROM friend_requests fr
      JOIN users u ON fr.requester_id = u.id
      JOIN profiles p ON u.id = p.user_id
      WHERE fr.requestee_id = $1 AND fr.status = 'pending'
      ORDER BY fr.requested_at DESC`,
      [userId]
    );

    return res.json({
      success: true,
      requests: result.rows,
      count: result.rowCount,
    });
  } catch (error) {
    return next(error);
  }
});

// ============================================================
// CREATE CHALLENGE
// ============================================================
friendsRouter.post("/challenges/:friendId", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { friendId } = req.params;
    const { type } = req.body; // 'daily_xp', 'lesson_race', 'quiz_battle'

    // Check if they are friends
    const friendship = await query(
      `SELECT id FROM friends 
       WHERE (user_id_1 = $1 AND user_id_2 = $2) 
       OR (user_id_1 = $2 AND user_id_2 = $1)`,
      [userId, friendId]
    );

    if (friendship.rowCount === 0) {
      return res.status(400).json({ error: "Must be friends to challenge" });
    }

    // Get user profiles
    const profileResult = await query(
      `SELECT user_id, display_name FROM profiles WHERE user_id IN ($1, $2)`,
      [userId, friendId]
    );

    const userProfile = profileResult.rows.find(p => p.user_id === userId);
    const friendProfile = profileResult.rows.find(p => p.user_id === friendId);

    // Create challenge
    await query(
      `INSERT INTO friend_challenges (challenger_id, challenger_nickname, challenged_id, challenged_nickname, challenge_type)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT DO NOTHING`,
      [userId, userProfile.display_name, friendId, friendProfile.display_name, type]
    );

    return res.json({ success: true, message: "Challenge created" });
  } catch (error) {
    return next(error);
  }
});

// ============================================================
// GET ACTIVE CHALLENGES
// ============================================================
friendsRouter.get("/challenges", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const result = await query(
      `SELECT 
        id,
        challenger_id,
        challenger_nickname,
        challenged_id,
        challenged_nickname,
        challenge_type,
        challenge_date,
        challenger_xp,
        challenged_xp,
        status,
        created_at
      FROM friend_challenges
      WHERE (challenger_id = $1 OR challenged_id = $1)
      AND status = 'active'
      ORDER BY created_at DESC`,
      [userId]
    );

    return res.json({
      success: true,
      challenges: result.rows,
      count: result.rowCount,
    });
  } catch (error) {
    return next(error);
  }
});

// ============================================================
// BLOCK USER
// ============================================================
friendsRouter.post("/block/:userId", requireAuth, async (req, res, next) => {
  try {
    const blockerId = req.user?.id;
    const { userId: blockedId } = req.params;

    await query(
      `INSERT INTO blocked_users (blocker_id, blocked_id) VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [blockerId, blockedId]
    );

    // Remove as friend if they were friends
    await query(
      `DELETE FROM friends 
       WHERE (user_id_1 = $1 AND user_id_2 = $2)
       OR (user_id_1 = $2 AND user_id_2 = $1)`,
      [blockerId, blockedId]
    );

    return res.json({ success: true, message: "User blocked" });
  } catch (error) {
    return next(error);
  }
});

// ============================================================
// UNBLOCK USER
// ============================================================
friendsRouter.post("/unblock/:userId", requireAuth, async (req, res, next) => {
  try {
    const blockerId = req.user?.id;
    const { userId: blockedId } = req.params;

    await query(
      `DELETE FROM blocked_users WHERE blocker_id = $1 AND blocked_id = $2`,
      [blockerId, blockedId]
    );

    return res.json({ success: true, message: "User unblocked" });
  } catch (error) {
    return next(error);
  }
});

export default friendsRouter;
