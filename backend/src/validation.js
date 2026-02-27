import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  displayName: z.string().min(1).max(40),
  country: z.string().min(2).max(2).optional().nullable()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(20)
});

export const placementSubmitSchema = z.object({
  testId: z.string().uuid(),
  answers: z.array(
    z.object({
      questionId: z.string().uuid(),
      optionId: z.string().uuid()
    })
  ).min(1)
});

export const aiTutorSchema = z.object({
  message: z.string().min(1).max(1000),
  scenario: z.enum(["daily", "travel", "work", "migration"]).default("daily"),
  proficiency: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).default("A2")
});

export const analyticsEventSchema = z.object({
  eventName: z.enum([
    "ai_tutor_submitted",
    "ai_tutor_success",
    "ai_tutor_retry",
    "ai_tutor_cooldown_hit",
    "ai_tutor_daily_cap_hit"
  ]),
  source: z.string().min(2).max(40).default("web"),
  metadata: z.record(z.any()).optional().default({})
});
