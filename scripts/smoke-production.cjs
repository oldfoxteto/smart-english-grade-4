/* eslint-disable no-console */
const crypto = require('crypto');

const API_BASE_URL = process.env.SMOKE_API_BASE_URL || 'https://smart-english-api.onrender.com/api/v1';
const FRONTEND_URL = process.env.SMOKE_FRONTEND_URL || 'https://beefluent-7ae36.web.app';
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || 30000);

async function requestJson(url, init = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    const text = await response.text();
    let payload = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = text;
    }

    return { response, payload };
  } finally {
    clearTimeout(timeout);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  console.log(`[smoke] API: ${API_BASE_URL}`);
  console.log(`[smoke] Frontend: ${FRONTEND_URL}`);

  const health = await requestJson(`${API_BASE_URL}/health`);
  assert(health.response.ok, `health failed with status ${health.response.status}`);
  assert(health.payload && health.payload.status === 'healthy', 'health payload is not healthy');

  const cors = await requestJson(`${API_BASE_URL}/health`, {
    headers: { Origin: FRONTEND_URL },
  });
  const allowOrigin = cors.response.headers.get('access-control-allow-origin');
  const corsOk = allowOrigin === FRONTEND_URL || allowOrigin === '*';
  if (!corsOk) {
    console.warn(
      `[smoke] WARN CORS header is "${allowOrigin || 'null'}". Verify in browser DevTools Network tab.`
    );
  }

  const id = crypto.randomUUID().slice(0, 8);
  const email = `smoke-${id}@example.com`;
  const password = 'Test1234!';

  const register = await requestJson(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role: 'student', grade: '4' }),
  });
  assert(register.response.ok, `register failed with status ${register.response.status}`);
  assert(register.payload && register.payload.token, 'register did not return token');

  const ai = await requestJson(`${API_BASE_URL}/ai/tutor/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${register.payload.token}`,
    },
    body: JSON.stringify({
      userMessage: 'Hello teacher',
      scenario: 'daily',
      langCode: 'en-US',
      history: [],
    }),
  });
  assert(ai.response.ok, `ai tutor failed with status ${ai.response.status}`);
  assert(ai.payload && typeof ai.payload.reply === 'string' && ai.payload.reply.trim().length > 0, 'ai tutor empty reply');

  console.log('[smoke] PASS');
  console.log(
    JSON.stringify(
      {
        health: health.payload,
        corsAllowOrigin: allowOrigin,
        corsVerified: corsOk,
        aiDegraded: Boolean(ai.payload?.degraded),
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error('[smoke] FAIL', error.message);
  process.exit(1);
});
