import { Router } from "express";
import { query } from "../db/pool.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { scoreToCefr } from "../services/learningPathService.js";
import { validateBody } from "../middleware/validateBody.js";
import { placementSubmitSchema } from "../validation.js";

export const placementRouter = Router();

placementRouter.get("/tests/:languageCode", requireAuth, async (req, res, next) => {
  try {
    const { languageCode } = req.params;

    const testResult = await query(
      `SELECT pt.id, pt.title, pt.total_questions, pt.version, l.code AS language_code
       FROM placement_tests pt
       JOIN languages l ON l.id = pt.language_id
       WHERE l.code = $1 AND pt.is_active = TRUE
       ORDER BY pt.version DESC
       LIMIT 1`,
      [languageCode]
    );

    if (testResult.rowCount === 0) {
      return res.status(404).json({ error: "No active placement test found" });
    }

    const test = testResult.rows[0];

    const questions = await query(
      `SELECT pq.id, pq.prompt, pq.sort_order,
              json_agg(
                json_build_object(
                  'id', po.id,
                  'optionText', po.option_text,
                  'sortOrder', po.sort_order
                ) ORDER BY po.sort_order
              ) AS options
       FROM placement_questions pq
       JOIN placement_options po ON po.question_id = pq.id
       WHERE pq.test_id = $1
       GROUP BY pq.id
       ORDER BY pq.sort_order`,
      [test.id]
    );

    return res.json({
      test: {
        id: test.id,
        title: test.title,
        languageCode: test.language_code,
        totalQuestions: test.total_questions,
        version: test.version,
        questions: questions.rows
      }
    });
  } catch (error) {
    return next(error);
  }
});

placementRouter.post("/submit", requireAuth, validateBody(placementSubmitSchema), async (req, res, next) => {
  try {
    const { testId, answers } = req.validatedBody;

    const questionIds = answers.map((a) => a.questionId);
    const selectedOptionIds = answers.map((a) => a.optionId);

    const scoreResult = await query(
      `SELECT
         COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE po.is_correct = TRUE)::int AS correct
       FROM placement_options po
       WHERE po.question_id = ANY($1::uuid[])
         AND po.id = ANY($2::uuid[])
         AND po.test_id = $3`,
      [questionIds, selectedOptionIds, testId]
    );

    const { total, correct } = scoreResult.rows[0];
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const estimatedCefr = scoreToCefr(score);

    const saveResult = await query(
      `INSERT INTO placement_results (user_id, test_id, score_percent, estimated_cefr)
       VALUES ($1, $2, $3, $4)
       RETURNING id, created_at`,
      [req.user.sub, testId, score, estimatedCefr]
    );

    return res.status(201).json({
      placementResult: {
        id: saveResult.rows[0].id,
        scorePercent: score,
        estimatedCefr,
        correct,
        total,
        createdAt: saveResult.rows[0].created_at
      }
    });
  } catch (error) {
    return next(error);
  }
});
