import { config } from "../config.js";
import { logger } from "./logger.js";
import { recordOpsEvent } from "./opsAnalytics.js";

function timeoutSignal(ms) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, done: () => clearTimeout(timeout) };
}

export async function reportError(error, context = {}) {
  logger.error("error.captured", { error, context });
  void recordOpsEvent({
    eventName: "ops_error_captured",
    metadata: {
      origin: context.origin || "request",
      path: context.path || null
    },
    userId: context.userId || null
  });

  if (!config.errorWebhookUrl) {
    return;
  }

  const body = {
    occurredAt: new Date().toISOString(),
    service: "lisan-backend-mvp",
    environment: config.nodeEnv,
    context,
    error: {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }
  };

  const { signal, done } = timeoutSignal(3500);

  try {
    await fetch(config.errorWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal
    });
  } catch (webhookError) {
    logger.warn("error.webhook_failed", {
      reason: webhookError instanceof Error ? webhookError.message : String(webhookError)
    });
  } finally {
    done();
  }
}
