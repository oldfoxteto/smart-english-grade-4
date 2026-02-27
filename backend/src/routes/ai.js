import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateBody } from "../middleware/validateBody.js";
import { aiTutorSchema } from "../validation.js";
import { evaluatePromptSafety, generateTutorReply } from "../services/aiTutorService.js";
import { aiLimiter } from "../middleware/rateLimiters.js";
import { aiAbuseGuard } from "../middleware/abuseProtection.js";
import { logger } from "../observability/logger.js";

export const aiRouter = Router();

aiRouter.post("/tutor/reply", requireAuth, aiLimiter, validateBody(aiTutorSchema), aiAbuseGuard, async (req, res) => {
  const { message, scenario, proficiency } = req.validatedBody;

  const safety = evaluatePromptSafety(message);
  if (safety.blocked) {
    logger.warn("ai.tutor.blocked_prompt", {
      userId: req.user.sub,
      scenario,
      reason: safety.reason
    });
    return res.status(200).json({
      scenario,
      correctionAr: "لا أستطيع المساعدة في هذا النوع من الطلبات. يمكنني مساعدتك بتدريب لغوي آمن.",
      tutorReply: "Let's continue with a safe language-learning exercise related to your scenario.",
      nextStep: "Write one polite sentence about daily communication.",
      safety: { blocked: true, reason: safety.reason }
    });
  }

  try {
    const result = await generateTutorReply({
      message: safety.cleanMessage,
      scenario,
      proficiency
    });
    logger.info("ai.tutor.success", {
      userId: req.user.sub,
      scenario,
      proficiency
    });

    return res.json({
      scenario,
      ...result,
      safety: { blocked: false, reason: null }
    });
  } catch (error) {
    logger.error("ai.tutor.failed", {
      userId: req.user.sub,
      scenario,
      error
    });
    return res.status(503).json({
      error: "AI tutor is temporarily unavailable",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
