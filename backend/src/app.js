import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authRouter } from "./routes/auth.js";
import { placementRouter } from "./routes/placement.js";
import { learningPathRouter } from "./routes/learningPath.js";
import { gamificationRouter } from "./routes/gamification.js";
import { subscriptionsRouter } from "./routes/subscriptions.js";
import { aiRouter } from "./routes/ai.js";
import { analyticsRouter } from "./routes/analytics.js";
import { lessonsRouter } from "./routes/lessons.js";
import friendsRouter from "./routes/friends.js";
import { leaderboardRouter } from "./routes/leaderboard.js";
import { socialRouter } from "./routes/social.js";
import { contentManagementRouter } from "./routes/contentManagement.js";
import {
  authLimiter,
  globalLimiter
} from "./middleware/rateLimiters.js";
import { requestLoggingMiddleware, requestTracingMiddleware } from "./observability/logger.js";
import { reportError } from "./observability/errorMonitor.js";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(requestTracingMiddleware);
app.use(requestLoggingMiddleware);
app.use(express.json({ limit: "1mb" }));
app.use(globalLimiter);

app.get("/health", (_, res) => {
  res.json({ ok: true, service: "lisan-backend-mvp" });
});

app.use("/api/v1/auth", authLimiter, authRouter);
app.use("/api/v1/placement", placementRouter);
app.use("/api/v1", learningPathRouter);
app.use("/api/v1/gamification", gamificationRouter);
app.use("/api/v1/subscriptions", subscriptionsRouter);
app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/lessons", lessonsRouter);
app.use("/api/v1/friends", friendsRouter);
app.use("/api/v1/leaderboard", leaderboardRouter);
app.use("/api/v1/social", socialRouter);
app.use("/api/v1/content", contentManagementRouter);

app.use((err, req, res, _next) => {
  reportError(err, {
    path: req.originalUrl,
    method: req.method,
    userId: req.user?.sub || null,
    requestId: req.requestId,
    traceId: req.traceId
  }).catch(() => {});

  res.status(500).json({
    error: "Internal server error",
    requestId: req.requestId || null
  });
});
