import { Router } from "express";
import { pool, query } from "../db/pool.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";

export const contentManagementRouter = Router();

/**
 * GET /api/v1/content/units
 * List all units with lesson counts
 */
contentManagementRouter.get("/units", async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        u.id,
        u.name,
        u.description,
        u.display_order,
        u.level_id,
        COUNT(l.id) as lesson_count,
        u.created_at
      FROM units u
      LEFT JOIN lessons l ON u.id = l.unit_id
      GROUP BY u.id, u.name, u.description, u.display_order, u.level_id, u.created_at
      ORDER BY u.display_order ASC
    `);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error("List units error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch units" });
  }
});

/**
 * GET /api/v1/content/lessons
 * List lessons with filters
 */
contentManagementRouter.get("/lessons", async (req, res) => {
  try {
    const { unitId, levelId, limit = 50, offset = 0 } = req.query;

    let sql = `
      SELECT 
        l.id,
        l.unit_id,
        l.level_id,
        l.title,
        l.description,
        l.display_order,
        l.created_at,
        u.name as unit_name,
        lv.title as level_name
      FROM lessons l
      LEFT JOIN units u ON l.unit_id = u.id
      LEFT JOIN levels lv ON l.level_id = lv.id
      WHERE 1=1
    `;

    const params = [];

    if (unitId) {
      sql += ` AND l.unit_id = $${params.length + 1}`;
      params.push(unitId);
    }

    if (levelId) {
      sql += ` AND l.level_id = $${params.length + 1}`;
      params.push(levelId);
    }

    sql += ` ORDER BY l.display_order ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error("List lessons error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch lessons" });
  }
});

/**
 * GET /api/v1/content/lessons/:lessonId
 * Get lesson details with content
 */
contentManagementRouter.get("/lessons/:lessonId", async (req, res) => {
  try {
    const lessonId = req.params.lessonId;

    const result = await query(`
      SELECT 
        l.id,
        l.unit_id,
        l.level_id,
        l.title,
        l.description,
        l.display_order,
        l.created_at,
        lb.content as lesson_body,
        u.name as unit_name
      FROM lessons l
      LEFT JOIN lesson_bodies lb ON l.id = lb.lesson_id
      LEFT JOIN units u ON l.unit_id = u.id
      WHERE l.id = $1
    `, [lessonId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Get lesson error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch lesson" });
  }
});

/**
 * POST /api/v1/content/lessons
 * Create a new lesson (admin only)
 */
contentManagementRouter.post("/lessons", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { unit_id, level_id, title, description, display_order, lesson_body } = req.body;

    if (!unit_id || !level_id || !title) {
      return res.status(400).json({ 
        success: false, 
        message: "unit_id, level_id, and title are required" 
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Create lesson
      const lessonResult = await client.query(`
        INSERT INTO lessons (unit_id, level_id, title, description, display_order)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, unit_id, level_id, title, description, display_order, created_at
      `, [unit_id, level_id, title, description || null, display_order || 0]);

      const lessonId = lessonResult.rows[0].id;

      // Create lesson body if provided
      if (lesson_body) {
        await client.query(`
          INSERT INTO lesson_bodies (lesson_id, content)
          VALUES ($1, $2)
          ON CONFLICT (lesson_id) DO UPDATE SET content = $2
        `, [lessonId, lesson_body]);
      }

      await client.query("COMMIT");

      res.status(201).json({
        success: true,
        data: lessonResult.rows[0]
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Create lesson error:", error);
    res.status(500).json({ success: false, message: "Failed to create lesson" });
  }
});

/**
 * PUT /api/v1/content/lessons/:lessonId
 * Update lesson (admin only)
 */
contentManagementRouter.put("/lessons/:lessonId", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const lessonId = req.params.lessonId;
    const { title, description, display_order, lesson_body } = req.body;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Update lesson
      const updateQuery = [];
      const params = [];
      let paramCount = 1;

      if (title) {
        updateQuery.push(`title = $${paramCount++}`);
        params.push(title);
      }
      if (description !== undefined) {
        updateQuery.push(`description = $${paramCount++}`);
        params.push(description);
      }
      if (display_order !== undefined) {
        updateQuery.push(`display_order = $${paramCount++}`);
        params.push(display_order);
      }

      if (updateQuery.length > 0) {
        params.push(lessonId);
        const result = await client.query(`
          UPDATE lessons
          SET ${updateQuery.join(", ")}
          WHERE id = $${paramCount}
          RETURNING id, title, description, display_order
        `, params);

        if (result.rows.length === 0) {
          await client.query("ROLLBACK");
          return res.status(404).json({ success: false, message: "Lesson not found" });
        }
      }

      // Update lesson body if provided
      if (lesson_body) {
        await client.query(`
          INSERT INTO lesson_bodies (lesson_id, content)
          VALUES ($1, $2)
          ON CONFLICT (lesson_id) DO UPDATE SET content = $2
        `, [lessonId, lesson_body]);
      }

      await client.query("COMMIT");

      const result = await query("SELECT * FROM lessons WHERE id = $1", [lessonId]);

      res.json({
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
    console.error("Update lesson error:", error);
    res.status(500).json({ success: false, message: "Failed to update lesson" });
  }
});

/**
 * DELETE /api/v1/content/lessons/:lessonId
 * Delete lesson (admin only)
 */
contentManagementRouter.delete("/lessons/:lessonId", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const lessonId = req.params.lessonId;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Delete lesson body
      await client.query("DELETE FROM lesson_bodies WHERE lesson_id = $1", [lessonId]);

      // Delete lesson
      const result = await client.query(`
        DELETE FROM lessons
        WHERE id = $1
        RETURNING id, title
      `, [lessonId]);

      if (result.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ success: false, message: "Lesson not found" });
      }

      await client.query("COMMIT");

      res.json({
        success: true,
        message: "Lesson deleted successfully",
        data: result.rows[0]
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Delete lesson error:", error);
    res.status(500).json({ success: false, message: "Failed to delete lesson" });
  }
});

/**
 * GET /api/v1/content/stats
 * Content management statistics
 */
contentManagementRouter.get("/stats", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        (SELECT COUNT(*) FROM units) as total_units,
        (SELECT COUNT(*) FROM lessons) as total_lessons,
        (SELECT COUNT(*) FROM lesson_bodies) as total_lesson_bodies,
        (SELECT COUNT(DISTINCT unit_id) FROM lessons) as units_with_lessons,
        (SELECT COUNT(DISTINCT level_id) FROM lessons) as levels_with_lessons
    `);

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
});

export default contentManagementRouter;
