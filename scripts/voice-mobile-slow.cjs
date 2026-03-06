/* eslint-disable no-console */
const { chromium, devices } = require('playwright');
const crypto = require('crypto');

const API_BASE_URL = process.env.SMOKE_API_BASE_URL || 'https://smart-english-api.onrender.com/api/v1';
const FRONTEND_URL = process.env.SMOKE_FRONTEND_URL || 'https://smart-english-grade-4.vercel.app';

async function registerUser() {
  const id = crypto.randomUUID().slice(0, 8);
  const email = `voice-mobile-${id}@example.com`;
  const password = 'Test1234!';

  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role: 'student', grade: '4' }),
  });
  if (!response.ok) {
    throw new Error(`register failed with status ${response.status}`);
  }
  return response.json();
}

async function main() {
  const auth = await registerUser();
  const token = auth.token;
  const refreshToken = auth.refreshToken;
  const user = auth.user;

  const browser = await chromium.launch({
    headless: true,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
  });
  const context = await browser.newContext({
    ...devices['Pixel 7'],
    permissions: ['microphone', 'camera'],
  });
  const page = await context.newPage();

  const client = await context.newCDPSession(page);
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 450,
    downloadThroughput: 350 * 1024 / 8,
    uploadThroughput: 250 * 1024 / 8,
  });

  await page.addInitScript((payload) => {
    localStorage.setItem('lisan_access_token', payload.token);
    localStorage.setItem('lisan_refresh_token', payload.refreshToken);
    localStorage.setItem('lisan_current_user', JSON.stringify(payload.user));
    localStorage.setItem(
      'lisan_onboarding_v1',
      JSON.stringify({
        languageCode: 'en',
        goalType: 'daily',
        proficiency: 'A1',
        dailyMinutes: 20,
        completedAt: new Date().toISOString(),
      })
    );
  }, { token, refreshToken, user });

  await page.goto(`${FRONTEND_URL}/ai-tutor`, { waitUntil: 'domcontentloaded' });
  await page.getByText('LISAN Tutor').waitFor({ timeout: 30000 });

  const textBox = page.getByPlaceholder('Type or speak...');
  await textBox.fill('Hello from mobile slow network');

  const started = Date.now();
  const aiResponsePromise = page.waitForResponse((resp) => (
    resp.url().includes('/api/v1/ai/tutor/reply') && resp.request().method() === 'POST'
  ), { timeout: 45000 });

  await page.keyboard.press('Enter');
  const aiResponse = await aiResponsePromise;
  const aiPayload = await aiResponse.json();
  const aiLatencyMs = Date.now() - started;

  await page.getByRole('button', { name: 'Voice Call' }).click();
  const statusChip = page.locator('span').filter({ hasText: /Offline|Ready|Live/ }).first();
  await statusChip.waitFor({ timeout: 20000 });
  let statusText = (await statusChip.textContent() || '').trim();
  const waitUntil = Date.now() + 35000;
  while (statusText === 'Offline' && Date.now() < waitUntil) {
    await page.waitForTimeout(1200);
    statusText = (await statusChip.textContent() || '').trim();
  }

  const alertText = await page.locator('[role="alert"]').first().textContent().catch(() => null);
  const voiceConnected = statusText !== 'Offline';

  console.log(
    JSON.stringify(
      {
        ok: true,
        aiRequestStatus: aiResponse.status(),
        aiReplySnippet: String(aiPayload?.reply || '').slice(0, 100),
        aiLatencyMs,
        voiceStatus: statusText,
        voiceConnected,
        voiceAlert: alertText,
      },
      null,
      2
    )
  );

  if (!voiceConnected) {
    throw new Error(`voice remained offline${alertText ? ` (${alertText})` : ''}`);
  }

  await context.close();
  await browser.close();
}

main().catch((error) => {
  console.error('[voice-mobile-slow] FAIL', error.message);
  process.exit(1);
});
