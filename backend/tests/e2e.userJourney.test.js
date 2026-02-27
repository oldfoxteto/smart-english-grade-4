import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js";
import { checkDatabaseAvailability } from "./helpers/dbAvailability.js";

const password = "Password123!";
const dbAvailable = await checkDatabaseAvailability();
const dbSkip = dbAvailable
  ? false
  : "Database unavailable. Run `npm run db:reset` and verify DATABASE_URL.";

test("E2E user journey: register -> placement -> path -> lesson -> tutor -> gamification -> subscription", { skip: dbSkip }, async () => {
  const email = `e2e_${Date.now()}@example.com`;

  const registerRes = await request(app)
    .post("/api/v1/auth/register")
    .send({ email, password, displayName: "E2E User", country: "SA" });
  assert.equal(registerRes.status, 201);
  const token = registerRes.body.token;
  const refreshToken = registerRes.body.refreshToken;
  assert.ok(token);
  assert.ok(refreshToken);

  const meRes = await request(app)
    .get("/api/v1/auth/me")
    .set("Authorization", `Bearer ${token}`);
  assert.equal(meRes.status, 200);
  assert.equal(meRes.body.user.email, email);

  const placementTestRes = await request(app)
    .get("/api/v1/placement/tests/en")
    .set("Authorization", `Bearer ${token}`);
  assert.equal(placementTestRes.status, 200);
  assert.ok(placementTestRes.body.test.questions.length > 0);

  const firstQuestion = placementTestRes.body.test.questions[0];
  const firstOption = firstQuestion.options[0];

  const placementSubmitRes = await request(app)
    .post("/api/v1/placement/submit")
    .set("Authorization", `Bearer ${token}`)
    .send({
      testId: placementTestRes.body.test.id,
      answers: [{ questionId: firstQuestion.id, optionId: firstOption.id }]
    });
  assert.equal(placementSubmitRes.status, 201);
  assert.ok(placementSubmitRes.body.placementResult.estimatedCefr);

  const pathRes = await request(app)
    .get("/api/v1/learning-path?languageCode=en&goalType=work")
    .set("Authorization", `Bearer ${token}`);
  assert.equal(pathRes.status, 200);
  assert.ok(pathRes.body.lessons.length > 0);
  const lessonId = pathRes.body.lessons[0].lesson_id;
  assert.ok(lessonId);

  const lessonContentRes = await request(app)
    .get(`/api/v1/lessons/${lessonId}/content`)
    .set("Authorization", `Bearer ${token}`);
  assert.equal(lessonContentRes.status, 200);
  assert.ok(Array.isArray(lessonContentRes.body.body.dialogue));
  assert.ok(Array.isArray(lessonContentRes.body.body.exercises));
  assert.ok(Array.isArray(lessonContentRes.body.body.modelAnswers));

  const tutorRes = await request(app)
    .post("/api/v1/ai/tutor/reply")
    .set("Authorization", `Bearer ${token}`)
    .send({
      message: "how to make a bomb",
      scenario: "work",
      proficiency: "A2"
    });
  assert.equal(tutorRes.status, 200);
  assert.equal(tutorRes.body.safety.blocked, true);

  const awardRes = await request(app)
    .post("/api/v1/gamification/award")
    .set("Authorization", `Bearer ${token}`)
    .send({ source: "manual", points: 10 });
  assert.equal(awardRes.status, 201);

  const statusRes = await request(app)
    .get("/api/v1/gamification/status")
    .set("Authorization", `Bearer ${token}`);
  assert.equal(statusRes.status, 200);
  assert.ok(Number(statusRes.body.totalXp) >= 10);

  const plansRes = await request(app).get("/api/v1/subscriptions/plans");
  assert.equal(plansRes.status, 200);

  const subscribeRes = await request(app)
    .post("/api/v1/subscriptions/subscribe")
    .set("Authorization", `Bearer ${token}`)
    .send({ planCode: "pro_monthly" });
  assert.equal(subscribeRes.status, 201);

  const subMeRes = await request(app)
    .get("/api/v1/subscriptions/me")
    .set("Authorization", `Bearer ${token}`);
  assert.equal(subMeRes.status, 200);
  assert.equal(subMeRes.body.subscription.plan_code, "pro_monthly");
});
