import rateLimit from "express-rate-limit";
import { config } from "../config.js";

function buildLimiter({ windowMs, max, keyPrefix }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      const userPart = req.user?.sub ? `u:${req.user.sub}` : `ip:${req.ip}`;
      return `${keyPrefix}:${userPart}`;
    },
    handler: (req, res) => {
      return res.status(429).json({
        error: "Too many requests",
        code: "RATE_LIMITED",
        path: req.originalUrl
      });
    }
  });
}

export const globalLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: config.globalRateLimitMax,
  keyPrefix: "global"
});

export const authLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: config.authRateLimitMax,
  keyPrefix: "auth"
});

export const aiLimiter = buildLimiter({
  windowMs: 10 * 60 * 1000,
  max: config.aiRateLimitMax,
  keyPrefix: "ai"
});

export const analyticsWriteLimiter = buildLimiter({
  windowMs: 10 * 60 * 1000,
  max: config.analyticsWriteRateLimitMax,
  keyPrefix: "analytics-write"
});

export const adminReadLimiter = buildLimiter({
  windowMs: 10 * 60 * 1000,
  max: config.adminReadRateLimitMax,
  keyPrefix: "admin-read"
});
