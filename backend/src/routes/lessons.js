import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { query } from "../db/pool.js";

export const lessonsRouter = Router();

lessonsRouter.get("/:lessonId/content", requireAuth, async (req, res, next) => {
  try {
    const { lessonId } = req.params;

    const result = await query(
      `SELECT
         ls.id AS lesson_id,
         ls.title AS lesson_title,
         ls.lesson_type,
         ls.est_minutes,
         u.id AS unit_id,
         u.title AS unit_title,
         lv.cefr_level,
         t.code AS track_code,
         t.name AS track_name,
         lang.code AS language_code,
         lb.qa_status,
         lb.qa_notes,
         lb.body_json
       FROM lessons ls
       JOIN units u ON u.id = ls.unit_id
       JOIN levels lv ON lv.id = u.level_id
       JOIN tracks t ON t.id = u.track_id
       JOIN languages lang ON lang.id = t.language_id
       LEFT JOIN lesson_bodies lb ON lb.lesson_id = ls.id
       WHERE ls.id = $1
       LIMIT 1`,
      [lessonId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    const row = result.rows[0];
    if (!row.body_json) {
      return res.status(404).json({ error: "Lesson content not available yet" });
    }

    return res.json({
      lesson: {
        lessonId: row.lesson_id,
        lessonTitle: row.lesson_title,
        lessonType: row.lesson_type,
        estMinutes: row.est_minutes,
        unitId: row.unit_id,
        unitTitle: row.unit_title,
        cefrLevel: row.cefr_level,
        trackCode: row.track_code,
        trackName: row.track_name,
        languageCode: row.language_code,
        qaStatus: row.qa_status,
        qaNotes: row.qa_notes
      },
      body: row.body_json
    });
  } catch (error) {
    return next(error);
  }
});
