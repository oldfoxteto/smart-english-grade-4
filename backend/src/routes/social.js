import { Router } from "express";
import { pool, query } from "../db/pool.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const socialRouter = Router();

/**
 * GET /api/v1/social/feed
 * Get social feed - posts from friends and own
 */
socialRouter.get("/feed", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;

    const result = await query(`
      SELECT 
        p.id,
        p.user_id,
        (SELECT display_name FROM profiles WHERE user_id = p.user_id LIMIT 1) as display_name,
        p.content,
        p.post_type,
        p.likes_count,
        p.comments_count,
        p.created_at,
        EXISTS(
          SELECT 1 FROM post_likes 
          WHERE post_id = p.id AND user_id = $1
        ) as liked_by_me
      FROM posts p
      WHERE p.user_id = $1
         OR p.user_id IN (
           SELECT CASE WHEN user_a = $1 THEN user_b ELSE user_a END
           FROM friends
           WHERE status = 'accepted' AND (user_a = $1 OR user_b = $1)
         )
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
      offset: offset
    });
  } catch (error) {
    console.error("Feed error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch feed" });
  }
});

/**
 * POST /api/v1/social/posts
 * Create a new post
 */
socialRouter.post("/posts", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, post_type, metadata_json } = req.body;

    if (!content || !post_type) {
      return res.status(400).json({ 
        success: false, 
        message: "Content and post_type are required" 
      });
    }

    const validTypes = ["general", "achievement", "lesson_completed"];
    if (!validTypes.includes(post_type)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid post_type" 
      });
    }

    const result = await query(`
      INSERT INTO posts (user_id, content, post_type, metadata_json)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, content, post_type, created_at
    `, [userId, content, post_type, metadata_json || null]);

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ success: false, message: "Failed to create post" });
  }
});

/**
 * POST /api/v1/social/posts/:postId/like
 * Like a post
 */
socialRouter.post("/posts/:postId/like", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insert like
      const likeResult = await client.query(`
        INSERT INTO post_likes (post_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING id
      `, [postId, userId]);

      // Update post likes count
      if (likeResult.rows.length > 0) {
        await client.query(`
          UPDATE posts 
          SET likes_count = likes_count + 1
          WHERE id = $1
        `, [postId]);
      }

      await client.query("COMMIT");

      res.json({
        success: true,
        data: { post_id: postId, liked: likeResult.rows.length > 0 }
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({ success: false, message: "Failed to like post" });
  }
});

/**
 * DELETE /api/v1/social/posts/:postId/like
 * Unlike a post
 */
socialRouter.delete("/posts/:postId/like", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Remove like
      const result = await client.query(`
        DELETE FROM post_likes
        WHERE post_id = $1 AND user_id = $2
        RETURNING id
      `, [postId, userId]);

      // Update post likes count
      if (result.rows.length > 0) {
        await client.query(`
          UPDATE posts 
          SET likes_count = GREATEST(likes_count - 1, 0)
          WHERE id = $1
        `, [postId]);
      }

      await client.query("COMMIT");

      res.json({
        success: true,
        data: { post_id: postId, unliked: result.rows.length > 0 }
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Unlike post error:", error);
    res.status(500).json({ success: false, message: "Failed to unlike post" });
  }
});

/**
 * GET /api/v1/social/posts/:postId/comments
 * Get comments on a post
 */
socialRouter.get("/posts/:postId/comments", async (req, res) => {
  try {
    const postId = req.params.postId;
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const offset = parseInt(req.query.offset) || 0;

    const result = await query(`
      SELECT 
        c.id,
        c.post_id,
        c.user_id,
        (SELECT display_name FROM profiles WHERE user_id = c.user_id LIMIT 1) as display_name,
        c.content,
        c.likes_count,
        c.created_at
      FROM comments c
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC
      LIMIT $2 OFFSET $3
    `, [postId, limit, offset]);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch comments" });
  }
});

/**
 * POST /api/v1/social/posts/:postId/comments
 * Add a comment to a post
 */
socialRouter.post("/posts/:postId/comments", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Comment content is required" 
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insert comment
      const result = await client.query(`
        INSERT INTO comments (post_id, user_id, content)
        VALUES ($1, $2, $3)
        RETURNING id, post_id, user_id, content, created_at
      `, [postId, userId, content.trim()]);

      // Update post comments count
      await client.query(`
        UPDATE posts
        SET comments_count = comments_count + 1
        WHERE id = $1
      `, [postId]);

      await client.query("COMMIT");

      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({ success: false, message: "Failed to create comment" });
  }
});

/**
 * POST /api/v1/social/comments/:commentId/like
 * Like a comment
 */
socialRouter.post("/comments/:commentId/like", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.commentId;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insert like
      const result = await client.query(`
        INSERT INTO comment_likes (comment_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING id
      `, [commentId, userId]);

      // Update comment likes count
      if (result.rows.length > 0) {
        await client.query(`
          UPDATE comments
          SET likes_count = likes_count + 1
          WHERE id = $1
        `, [commentId]);
      }

      await client.query("COMMIT");

      res.json({
        success: true,
        data: { comment_id: commentId, liked: result.rows.length > 0 }
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Like comment error:", error);
    res.status(500).json({ success: false, message: "Failed to like comment" });
  }
});

export default socialRouter;
