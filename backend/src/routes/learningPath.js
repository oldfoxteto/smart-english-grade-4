import { Router } from "express";
import { query } from "../db/pool.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { buildPathRules } from "../services/learningPathService.js";

export const learningPathRouter = Router();

learningPathRouter.get("/learning-path", requireAuth, async (req, res, next) => {
  try {
    const goalType = String(req.query.goalType || "daily");
    const languageCode = String(req.query.languageCode || "en");

    const latestPlacement = await query(
      `SELECT pr.estimated_cefr, pr.score_percent
       FROM placement_results pr
       JOIN placement_tests pt ON pt.id = pr.test_id
       JOIN languages l ON l.id = pt.language_id
       WHERE pr.user_id = $1 AND l.code = $2
       ORDER BY pr.created_at DESC
       LIMIT 1`,
      [req.user.sub, languageCode]
    );

    const cefr = latestPlacement.rowCount > 0 ? latestPlacement.rows[0].estimated_cefr : "A1";
    const recommendedTrackCodes = buildPathRules({ cefr, goalType });

    const lessons = await query(
      `SELECT t.code AS track_code, t.name AS track_name,
              u.title AS unit_title, ls.id AS lesson_id, ls.title AS lesson_title, ls.lesson_type, ls.est_minutes
       FROM tracks t
       JOIN units u ON u.track_id = t.id
       JOIN lessons ls ON ls.unit_id = u.id
       JOIN levels lv ON lv.id = u.level_id
       JOIN languages lang ON lang.id = t.language_id
       WHERE lang.code = $1
         AND lv.cefr_level = $2
         AND t.code = ANY($3::text[])
       ORDER BY t.sort_order, u.sort_order, ls.sort_order
       LIMIT 20`,
      [languageCode, cefr, recommendedTrackCodes]
    );

    let finalCefr = cefr;
    let finalLessons = lessons.rows;

    if (finalLessons.length === 0 && cefr !== "A1") {
      const fallback = await query(
        `SELECT t.code AS track_code, t.name AS track_name,
                u.title AS unit_title, ls.id AS lesson_id, ls.title AS lesson_title, ls.lesson_type, ls.est_minutes
         FROM tracks t
         JOIN units u ON u.track_id = t.id
         JOIN lessons ls ON ls.unit_id = u.id
         JOIN levels lv ON lv.id = u.level_id
         JOIN languages lang ON lang.id = t.language_id
         WHERE lang.code = $1
           AND lv.cefr_level = 'A1'
           AND t.code = ANY($2::text[])
         ORDER BY t.sort_order, u.sort_order, ls.sort_order
         LIMIT 20`,
        [languageCode, recommendedTrackCodes]
      );
      finalCefr = "A1";
      finalLessons = fallback.rows;
    }

    await query(
      `INSERT INTO user_learning_paths (user_id, language_code, goal_type, current_cefr, generated_lessons_json)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, language_code)
       DO UPDATE SET
         goal_type = EXCLUDED.goal_type,
         current_cefr = EXCLUDED.current_cefr,
         generated_lessons_json = EXCLUDED.generated_lessons_json,
         updated_at = NOW()`,
      [req.user.sub, languageCode, goalType, finalCefr, JSON.stringify(finalLessons)]
    );

    return res.json({
      userId: req.user.sub,
      languageCode,
      goalType,
      cefr: finalCefr,
      recommendedTrackCodes,
      lessons: finalLessons
    });
  } catch (error) {
    return next(error);
  }
});
