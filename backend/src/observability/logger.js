import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { config } from "../config.js";
import { recordOpsEvent } from "./opsAnalytics.js";

const requestContext = new AsyncLocalStorage();
const levelOrder = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

function shouldLog(level) {
  const current = levelOrder[config.logLevel] ?? levelOrder.info;
  const target = levelOrder[level] ?? levelOrder.info;
  return target >= current;
}

function serializeError(error) {
  if (!(error instanceof Error)) {
    return { message: String(error) };
  }

  return {
    name: error.name,
    message: error.message,
    stack: error.stack
  };
}

function emit(level, message, meta = {}) {
  if (!shouldLog(level)) {
    return;
  }

  const ctx = requestContext.getStore() || {};
  const payload = {
    ts: new Date().toISOString(),
    level,
    message,
    requestId: ctx.requestId,
    traceId: ctx.traceId,
    ...meta
  };

  const out = JSON.stringify(payload);
  if (level === "error") {
    console.error(out);
  } else if (level === "warn") {
    console.warn(out);
  } else {
    console.log(out);
  }
}

export const logger = {
  debug(message, meta) {
    emit("debug", message, meta);
  },
  info(message, meta) {
    emit("info", message, meta);
  },
  warn(message, meta) {
    emit("warn", message, meta);
  },
  error(message, meta) {
    const normalized = { ...meta };
    if (meta?.error) {
      normalized.error = serializeError(meta.error);
    }
    emit("error", message, normalized);
  }
};

export function requestTracingMiddleware(req, res, next) {
  const requestId = req.get("x-request-id") || randomUUID();
  const traceId = req.get("x-trace-id") || requestId;
  req.requestId = requestId;
  req.traceId = traceId;
  res.setHeader("x-request-id", requestId);

  requestContext.run({ requestId, traceId }, next);
}

export function requestLoggingMiddleware(req, res, next) {
  if (!config.requestLogEnabled) {
    return next();
  }

  const startedAt = process.hrtime.bigint();
  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    const durationRounded = Number(durationMs.toFixed(1));
    logger.info("request.completed", {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: durationRounded,
      ip: req.ip,
      userId: req.user?.sub || null
    });

    void recordOpsEvent({
      eventName: "ops_request_completed",
      userId: req.user?.sub || null,
      metadata: {
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: durationRounded
      }
    });

    if (res.statusCode >= 500) {
      void recordOpsEvent({
        eventName: "ops_request_error",
        userId: req.user?.sub || null,
        metadata: {
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode
        }
      });
    }
  });

  next();
}
