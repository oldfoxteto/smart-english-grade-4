import { config } from "../config.js";
import { logger } from "../observability/logger.js";
import { recordOpsEvent } from "../observability/opsAnalytics.js";

const BLOCK_PATTERNS = [
  /how\s+to\s+make\s+(a\s+)?bomb/i,
  /self[-\s]?harm|suicide|kill myself/i,
  /hate\s+speech|racial slur/i,
  /bypass\s+law|forge\s+documents/i
];

const DEFAULT_TUTOR_PAYLOAD = {
  correctionAr: "المعنى مفهوم، لكن هناك أخطاء بسيطة في الترتيب أو الزمن.",
  tutorReply:
    "Feedback: Good effort.\nNatural Alternative: I am going to the airport tomorrow.\nPractice Prompt: Say the sentence again with the correct order.",
  nextStep: "Try one more sentence related to this scenario."
};

const circuit = {
  state: "CLOSED",
  failures: 0,
  openedAt: 0
};

function sanitizeText(input) {
  return input.replace(/[\u0000-\u001F\u007F]/g, " ").trim();
}

export function evaluatePromptSafety(message) {
  const clean = sanitizeText(message).slice(0, 1000);
  const blocked = BLOCK_PATTERNS.some((pattern) => pattern.test(clean));

  if (blocked) {
    return {
      blocked: true,
      reason: "unsafe_content",
      cleanMessage: clean
    };
  }

  return {
    blocked: false,
    reason: null,
    cleanMessage: clean
  };
}

function extractOutputText(payload) {
  if (typeof payload?.output_text === "string" && payload.output_text.trim().length > 0) {
    return payload.output_text.trim();
  }

  const output = Array.isArray(payload?.output) ? payload.output : [];
  const parts = [];

  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const piece of content) {
      if (piece?.type === "output_text" && typeof piece?.text === "string") {
        parts.push(piece.text);
      }
    }
  }

  return parts.join("\n").trim();
}

function buildStructuredCorrectionAr(correctionText) {
  const text = String(correctionText || DEFAULT_TUTOR_PAYLOAD.correctionAr).trim();
  if (text.includes("الخطأ:") && text.includes("السبب:") && text.includes("مثال مصحح:")) {
    return text;
  }
  return [
    `الخطأ: ${text}`,
    "السبب: ترتيب الكلمات أو اختيار الزمن غير دقيق في الجملة.",
    "مثال مصحح: I am going to the airport tomorrow."
  ].join("\n");
}

function buildStructuredTutorReply(tutorText) {
  const text = String(tutorText || DEFAULT_TUTOR_PAYLOAD.tutorReply).trim();
  if (text.includes("Feedback:") && text.includes("Natural Alternative:") && text.includes("Practice Prompt:")) {
    return text;
  }
  return [
    `Feedback: ${text || "Good effort."}`,
    "Natural Alternative: I am going to the airport tomorrow.",
    "Practice Prompt: Say the sentence again using the corrected structure."
  ].join("\n");
}

function clampPayload(payload) {
  return {
    correctionAr: buildStructuredCorrectionAr(payload.correctionAr).slice(0, 500),
    tutorReply: buildStructuredTutorReply(payload.tutorReply).slice(0, 500),
    nextStep: String(payload.nextStep || DEFAULT_TUTOR_PAYLOAD.nextStep).slice(0, 300)
  };
}

function unescapeJsonString(value) {
  return String(value || "")
    .replace(/\\"/g, "\"")
    .replace(/\\n/g, "\n")
    .replace(/\\\\/g, "\\");
}

function extractField(raw, field) {
  const pattern = new RegExp(`"${field}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`, "i");
  const match = String(raw || "").match(pattern);
  return match ? unescapeJsonString(match[1]) : "";
}

export function parseTutorPayload(raw) {
  const normalize = (value) => String(value || "").trim();
  const attemptParse = (value) => {
    const parsed = JSON.parse(value);
    return clampPayload(parsed);
  };

  const cleaned = normalize(raw).replace(/^```json\s*/i, "").replace(/^```/i, "").replace(/```$/i, "").trim();

  try {
    return attemptParse(cleaned);
  } catch {
    try {
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace >= 0 && lastBrace > firstBrace) {
        return attemptParse(cleaned.slice(firstBrace, lastBrace + 1));
      }
    } catch {
      // Continue to regex recovery.
    }
  }

  const variants = [cleaned, unescapeJsonString(cleaned)];
  let recovered = null;

  for (const value of variants) {
    const candidate = clampPayload({
      correctionAr: extractField(value, "correctionAr"),
      tutorReply: extractField(value, "tutorReply"),
      nextStep: extractField(value, "nextStep")
    });

    if (
      candidate.correctionAr !== DEFAULT_TUTOR_PAYLOAD.correctionAr ||
      candidate.tutorReply !== DEFAULT_TUTOR_PAYLOAD.tutorReply ||
      candidate.nextStep !== DEFAULT_TUTOR_PAYLOAD.nextStep
    ) {
      recovered = candidate;
      break;
    }
  }

  if (recovered) {
    return recovered;
  }

  return clampPayload({
    ...DEFAULT_TUTOR_PAYLOAD,
    tutorReply: cleaned.slice(0, 500) || DEFAULT_TUTOR_PAYLOAD.tutorReply
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(error) {
  if (!error) {
    return false;
  }
  const status = Number(error.status || 0);
  if (status === 408 || status === 429) {
    return true;
  }
  if (status >= 500) {
    return true;
  }
  const message = String(error.message || "").toLowerCase();
  return message.includes("timed out") || message.includes("abort") || message.includes("network");
}

function normalizeHttpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function timeoutSignal(ms) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, done: () => clearTimeout(timeout) };
}

function canHalfOpen() {
  if (circuit.state !== "OPEN") {
    return true;
  }
  return Date.now() - circuit.openedAt >= config.aiCircuitOpenMs;
}

function onSuccess() {
  const wasOpen = circuit.state !== "CLOSED" || circuit.failures > 0;
  circuit.state = "CLOSED";
  circuit.failures = 0;
  circuit.openedAt = 0;
  if (wasOpen) {
    void recordOpsEvent({
      eventName: "ops_ai_circuit_closed",
      metadata: {}
    });
  }
}

function onFailure(error) {
  circuit.failures += 1;
  if (circuit.failures >= config.aiCircuitFailureThreshold) {
    circuit.state = "OPEN";
    circuit.openedAt = Date.now();
    logger.warn("ai.circuit.opened", {
      failures: circuit.failures,
      reason: error instanceof Error ? error.message : String(error)
    });
    void recordOpsEvent({
      eventName: "ops_ai_circuit_open",
      metadata: {
        failures: circuit.failures,
        reason: error instanceof Error ? error.message : String(error)
      }
    });
  }
}

async function withRetry(operation) {
  const maxAttempts = Math.max(1, config.aiRetryCount + 1);
  let attempt = 0;
  let lastError = null;

  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const retryable = isRetryable(error);
      if (!retryable || attempt >= maxAttempts) {
        throw error;
      }
      const backoff = config.aiRetryBaseMs * 2 ** (attempt - 1);
      logger.warn("ai.retry", {
        attempt,
        backoffMs: backoff,
        reason: error instanceof Error ? error.message : String(error)
      });
      void recordOpsEvent({
        eventName: "ops_ai_retry",
        metadata: {
          attempt,
          backoffMs: backoff,
          reason: error instanceof Error ? error.message : String(error)
        }
      });
      await delay(backoff);
    }
  }

  throw lastError || new Error("Unknown AI retry failure");
}

async function executeWithResilience(operation) {
  if (!canHalfOpen()) {
    const remainingMs = config.aiCircuitOpenMs - (Date.now() - circuit.openedAt);
    void recordOpsEvent({
      eventName: "ops_ai_circuit_reject",
      metadata: {
        remainingMs: Math.max(0, remainingMs)
      }
    });
    const err = new Error(`AI circuit breaker open. Retry in ${Math.max(0, remainingMs)}ms`);
    err.status = 503;
    throw err;
  }

  if (circuit.state === "OPEN") {
    circuit.state = "HALF_OPEN";
    logger.warn("ai.circuit.half_open", {});
  }

  try {
    const result = await withRetry(operation);
    onSuccess();
    return result;
  } catch (error) {
    onFailure(error);
    throw error;
  }
}

async function callGoogleAiStudio({ message, scenario, proficiency }) {
  if (!config.googleAiStudioApiKey) {
    throw new Error("GOOGLE_AI_STUDIO_API_KEY is not configured");
  }

  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${config.googleAiStudioModel}:generateContent?key=${config.googleAiStudioApiKey}`;

  const prompt = [
    "You are LISAN AI Tutor for Arabic-speaking learners.",
    "Return valid JSON only:",
    '{"correctionAr":"...","tutorReply":"...","nextStep":"..."}',
    "Rules:",
    "- correctionAr must be Arabic and strictly include exactly these lines:",
    "  1) الخطأ: ...",
    "  2) السبب: ...",
    "  3) مثال مصحح: ...",
    "- Keep correctionAr concise and practical.",
    "- tutorReply must be in English and strictly include exactly these lines:",
    "  1) Feedback: ...",
    "  2) Natural Alternative: ...",
    "  3) Practice Prompt: ...",
    "- nextStep one actionable task in English.",
    `Scenario: ${scenario}`,
    `Proficiency: ${proficiency}`,
    `Learner message: ${message}`
  ].join("\n");

  const { signal, done } = timeoutSignal(config.aiTimeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 450,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              correctionAr: { type: "STRING" },
              tutorReply: { type: "STRING" },
              nextStep: { type: "STRING" }
            },
            required: ["correctionAr", "tutorReply", "nextStep"]
          }
        }
      }),
      signal
    });

    if (!response.ok) {
      const errText = await response.text();
      throw normalizeHttpError(
        response.status,
        `Google AI Studio request failed (${response.status}): ${errText.slice(0, 300)}`
      );
    }

    const data = await response.json();
    const rawText =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join("\n")?.trim() || "";
    return parseTutorPayload(rawText);
  } finally {
    done();
  }
}

async function callOpenAIResponses({ message, scenario, proficiency }) {
  if (!config.openaiApiKey) {
    throw new Error("No AI provider key configured");
  }

  const systemPrompt = [
    "You are LISAN AI Tutor for Arabic-speaking learners.",
    "You teach English/Greek with short, practical coaching.",
    "Always respond in valid JSON only:",
    '{"correctionAr":"...","tutorReply":"...","nextStep":"..."}',
    "Rules:",
    "- correctionAr must be Arabic and strictly include exactly these lines:",
    "  1) الخطأ: ...",
    "  2) السبب: ...",
    "  3) مثال مصحح: ...",
    "- tutorReply must be in English and strictly include exactly these lines:",
    "  1) Feedback: ...",
    "  2) Natural Alternative: ...",
    "  3) Practice Prompt: ...",
    "- nextStep should be one actionable micro-task in English.",
    "- Refuse harmful/illegal requests and redirect to safe language-learning content."
  ].join("\n");

  const userPrompt = [`Scenario: ${scenario}`, `Proficiency: ${proficiency}`, `Learner message: ${message}`].join("\n");
  const { signal, done } = timeoutSignal(config.aiTimeoutMs);

  try {
    const response = await fetch(`${config.openaiApiBase}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.openaiApiKey}`
      },
      body: JSON.stringify({
        model: config.openaiModel,
        input: [
          { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
          { role: "user", content: [{ type: "input_text", text: userPrompt }] }
        ],
        temperature: 0.3,
        max_output_tokens: 450
      }),
      signal
    });

    if (!response.ok) {
      const errText = await response.text();
      throw normalizeHttpError(response.status, `LLM request failed (${response.status}): ${errText.slice(0, 300)}`);
    }

    const data = await response.json();
    const rawText = extractOutputText(data);
    return parseTutorPayload(rawText);
  } finally {
    done();
  }
}

export async function generateTutorReply({ message, scenario, proficiency }) {
  return executeWithResilience(async () => {
    if (config.googleAiStudioApiKey) {
      return callGoogleAiStudio({ message, scenario, proficiency });
    }
    return callOpenAIResponses({ message, scenario, proficiency });
  });
}

export function getAiCircuitState() {
  const now = Date.now();
  const reopenInMs =
    circuit.state === "OPEN" ? Math.max(0, config.aiCircuitOpenMs - (now - circuit.openedAt)) : 0;
  return {
    state: circuit.state,
    failures: circuit.failures,
    threshold: config.aiCircuitFailureThreshold,
    reopenInMs
  };
}
