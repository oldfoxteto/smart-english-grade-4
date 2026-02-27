import dotenv from "dotenv";
import { initializeSecrets } from "./secrets/secretManager.js";

dotenv.config();
await initializeSecrets();

function asNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const required = ["DATABASE_URL", "JWT_SECRET"];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || `${process.env.JWT_SECRET}_refresh`,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiModel: process.env.OPENAI_MODEL || "gpt-4.1-mini",
  openaiApiBase: process.env.OPENAI_API_BASE || "https://api.openai.com/v1",
  googleAiStudioApiKey: process.env.GOOGLE_AI_STUDIO_API_KEY || "",
  googleAiStudioModel: process.env.GOOGLE_AI_STUDIO_MODEL || "gemini-2.5-flash",
  logLevel: (process.env.LOG_LEVEL || "info").toLowerCase(),
  requestLogEnabled: process.env.REQUEST_LOG_ENABLED !== "false",
  errorWebhookUrl: process.env.ERROR_MONITOR_WEBHOOK_URL || "",
  globalRateLimitMax: asNumber(process.env.RATE_LIMIT_GLOBAL_MAX, 300),
  authRateLimitMax: asNumber(process.env.RATE_LIMIT_AUTH_MAX, 60),
  aiRateLimitMax: asNumber(process.env.RATE_LIMIT_AI_MAX, 100),
  analyticsWriteRateLimitMax: asNumber(process.env.RATE_LIMIT_ANALYTICS_WRITE_MAX, 120),
  adminReadRateLimitMax: asNumber(process.env.RATE_LIMIT_ADMIN_READ_MAX, 300),
  aiAbuseWindowMs: asNumber(process.env.AI_ABUSE_WINDOW_MS, 60_000),
  aiAbuseMaxHits: asNumber(process.env.AI_ABUSE_MAX_HITS, 15),
  aiDuplicateWindowMs: asNumber(process.env.AI_DUPLICATE_WINDOW_MS, 10 * 60_000),
  aiDuplicateMaxHits: asNumber(process.env.AI_DUPLICATE_MAX_HITS, 6),
  aiRetryCount: asNumber(process.env.AI_RETRY_COUNT, 2),
  aiRetryBaseMs: asNumber(process.env.AI_RETRY_BASE_MS, 350),
  aiTimeoutMs: asNumber(process.env.AI_TIMEOUT_MS, 15_000),
  aiCircuitFailureThreshold: asNumber(process.env.AI_CIRCUIT_FAILURE_THRESHOLD, 5),
  aiCircuitOpenMs: asNumber(process.env.AI_CIRCUIT_OPEN_MS, 30_000),
  adminEmails: (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean)
};
