import { config } from "../config.js";

const bucket = new Map();

function hashMessage(text) {
  return String(text || "").trim().toLowerCase().slice(0, 220);
}

function nowMs() {
  return Date.now();
}

function getRecord(key) {
  let record = bucket.get(key);
  if (!record) {
    record = {
      hits: [],
      messageHits: new Map()
    };
    bucket.set(key, record);
  }
  return record;
}

function prune(record, currentMs) {
  const windowStart = currentMs - config.aiAbuseWindowMs;
  record.hits = record.hits.filter((t) => t >= windowStart);

  const duplicateWindowStart = currentMs - config.aiDuplicateWindowMs;
  for (const [messageKey, timestamps] of record.messageHits.entries()) {
    const next = timestamps.filter((t) => t >= duplicateWindowStart);
    if (next.length === 0) {
      record.messageHits.delete(messageKey);
    } else {
      record.messageHits.set(messageKey, next);
    }
  }
}

export function aiAbuseGuard(req, res, next) {
  const identity = req.user?.sub ? `u:${req.user.sub}` : `ip:${req.ip}`;
  const messageKey = hashMessage(req.validatedBody?.message || req.body?.message);
  const currentMs = nowMs();
  const record = getRecord(identity);

  prune(record, currentMs);

  if (record.hits.length >= config.aiAbuseMaxHits) {
    return res.status(429).json({
      error: "Too many tutor attempts in short time",
      code: "AI_ABUSE_BURST"
    });
  }

  record.hits.push(currentMs);

  const messageTimestamps = record.messageHits.get(messageKey) || [];
  messageTimestamps.push(currentMs);
  record.messageHits.set(messageKey, messageTimestamps);

  if (messageTimestamps.length > config.aiDuplicateMaxHits) {
    return res.status(429).json({
      error: "Repeated identical tutor prompts detected",
      code: "AI_ABUSE_DUPLICATE"
    });
  }

  return next();
}
