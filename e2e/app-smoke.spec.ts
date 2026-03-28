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

  await page.route(/\/api\/v1\/testing\/catalog$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        tests: [
          {
            id: 'placement-en-v1',
            title: 'English Placement Test',
            arabicTitle: 'اختبار تحديد المستوى',
            description: 'Find the learner starting point.',
            arabicDescription: 'يحدد نقطة البداية المناسبة للمتعلم.',
            type: 'placement',
            category: 'grammar',
            difficulty: 'intermediate',
            duration: 12,
            questions: 5,
            completed: true,
            score: 80,
            bestScore: 80,
            attempts: 1,
            passingScore: 60,
            status: 'completed',
            iconKey: 'assessment',
          },
        ],
        results: [
          {
            id: 'result-placement-en-v1',
            testId: 'placement-en-v1',
            score: 80,
            totalQuestions: 5,
            correctAnswers: 4,
            timeSpentMinutes: 12,
            completedAt: new Date().toISOString(),
            feedback: 'Estimated level: A2. Good progress.',
            recommendations: ['Repeat one similar task tomorrow.'],
          },
        ],
        summary: {
          totalTests: 1,
          completedTests: 1,
          averageScore: 80,
          totalTimeMinutes: 12,
        },
        generatedAt: new Date().toISOString(),
      }),
    });
  });
}

async function mockGuestAuthApi(page: Page) {
  await page.route(/\/api\/v1\/auth\/session$/, async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'UNAUTHENTICATED' }),
    });
  });

  await page.route(/\/api\/v1\/auth\/refresh$/, async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'UNAUTHENTICATED' }),
    });
  });

  await page.route(/\/api\/v1\/auth\/firebase$/, async (route) => {
    const payload = route.request().postDataJSON() as { idToken?: string };
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          id: 'u-google',
          email: 'google.user@example.com',
          displayName: 'Google Learner',
          status: 'active',
          roles: ['user'],
        },
        token: `app-access-${payload.idToken || 'missing'}`,
      }),
    });
  });

  await page.route(/\/api\/v1\/progress$/, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          vocabularyCompleted: [],
          grammarCompleted: [],
          storiesCompleted: [],
          quizScores: [],
          stars: 0,
          level: 1,
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, updatedAt: new Date().toISOString() }),
    });
  });

  await page.route(/\/api\/v1\/practice\/catalog$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ exercises: [], updatedAt: new Date().toISOString() }),
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

test('Testing page renders live assessment summary', async ({ page }) => {
  await bootstrapAuthenticatedUser(page);
  await mockApi(page);

  await page.goto('/testing');
  await expect(page.locator('body')).toContainText('Live assessment center');
  await expect(page.locator('body')).toContainText('اختبار تحديد المستوى');
});

test('Google sign-in completes app session without looping back to login', async ({ page }) => {
  await page.addInitScript(() => {
    (window as Window & { __E2E_FIREBASE_AUTH__?: unknown }).__E2E_FIREBASE_AUTH__ = {
      popupUser: {
        uid: 'google-popup-user',
        email: 'google.user@example.com',
        displayName: 'Google Learner',
        providerId: 'google.com',
        idToken: 'firebase-google-popup-token',
      },
    };
  });
  await mockGuestAuthApi(page);

  await page.goto('/login');
  await page.getByRole('button', { name: /continue with google/i }).click();

  await page.waitForURL('**/onboarding');
  await expect(page).not.toHaveURL(/\/login$/);
});

test('Google redirect restore resumes session and leaves login page', async ({ page }) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem('beefluent_google_redirect_pending', '1');
    (window as Window & { __E2E_FIREBASE_AUTH__?: unknown }).__E2E_FIREBASE_AUTH__ = {
      redirectUser: {
        uid: 'google-redirect-user',
        email: 'google.redirect@example.com',
        displayName: 'Redirect Learner',
        providerId: 'google.com',
        idToken: 'firebase-google-redirect-token',
      },
    };
  });
  await mockGuestAuthApi(page);

  await page.goto('/login');

  await page.waitForURL('**/onboarding');
  await expect(page).not.toHaveURL(/\/login$/);
});
