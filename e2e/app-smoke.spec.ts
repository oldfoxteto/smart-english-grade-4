import { expect, test, type Page } from '@playwright/test';

async function bootstrapAuthenticatedUser(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      'lisan_current_user',
      JSON.stringify({ id: 'u-test', email: 'student@example.com', displayName: 'Student', roles: ['user'] })
    );
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
  });
}

async function mockApi(page: Page) {
  await page.route(/\/api\/v1\/auth\/session$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: { id: 'u-test', email: 'student@example.com', displayName: 'Student', status: 'active', roles: ['user'] },
      }),
    });
  });

  await page.route(/\/api\/v1\/auth\/refresh$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: { id: 'u-test', email: 'student@example.com', displayName: 'Student', status: 'active', roles: ['user'] },
      }),
    });
  });

  await page.route(/\/api\/v1\/analytics\/events$/, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });

  await page.route(/\/api\/v1\/safety\/policy$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        version: 'test',
        title: 'Policy',
        summary: 'Summary',
        rules: ['No faces', 'No private screens'],
      }),
    });
  });

  await page.route(/\/api\/v1\/safety\/consent$/, async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, allowVision: true, updatedAt: new Date().toISOString(), policyVersion: 'test' }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ allowVision: true, guardianName: 'Guardian', policyVersion: 'test', updatedAt: new Date().toISOString() }),
    });
  });

  await page.route(/\/api\/v1\/ai\/tutor\/reply$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        reply: 'Great job! Keep practicing.',
        correction: null,
        safety: { blocked: false, reason: null },
      }),
    });
  });

  await page.route(/\/api\/v1\/lessons\/path$/, async (route) => {
    const req = route.request().postDataJSON() as { lessonIds?: string[] };
    const lessonIds = req.lessonIds || [];
    const statuses = lessonIds.map((lessonId, index) => ({
      lessonId,
      unlocked: index < 3,
      completed: index < 2,
      mastered: index < 2,
      masteryScore: index < 2 ? 85 : 0,
    }));

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ statuses }),
    });
  });
}

test('AI tutor page sends message via backend proxy', async ({ page }) => {
  await bootstrapAuthenticatedUser(page);
  await mockApi(page);

  await page.goto('/ai-tutor');
  await expect(page.getByText('LISAN Tutor')).toBeVisible();

  await page.getByPlaceholder('Type or speak...').fill('Hello teacher');
  await page.keyboard.press('Enter');

  await expect(page.getByText('Great job! Keep practicing.')).toBeVisible();
});

test('Lessons map renders with server-driven unlock state', async ({ page }) => {
  await bootstrapAuthenticatedUser(page);
  await mockApi(page);

  await page.goto('/lessons');
  await expect(page.getByText('Learning path')).toBeVisible();
  await expect(page.getByText('Unit 1', { exact: true })).toBeVisible();
});
