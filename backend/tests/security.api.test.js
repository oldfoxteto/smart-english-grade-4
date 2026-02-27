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

async function registerUser(emailPrefix = "security") {
  const email = `${emailPrefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`;
  const response = await request(app)
    .post("/api/v1/auth/register")
    .send({ email, password, displayName: "Security User", country: "SA" });
  assert.equal(response.status, 201);
  return response.body;
}

test("Security: protected routes reject missing token", async () => {
  const res = await request(app).get("/api/v1/learning-path?languageCode=en&goalType=daily");
  assert.equal(res.status, 401);
});

test("Security: non-admin cannot access admin analytics", { skip: dbSkip }, async () => {
  const auth = await registerUser("non_admin");
  const res = await request(app)
    .get("/api/v1/analytics/summary?hours=24")
    .set("Authorization", `Bearer ${auth.token}`);
  assert.equal(res.status, 403);
});

test("Security: invalid refresh token is rejected", async () => {
  const res = await request(app)
    .post("/api/v1/auth/refresh")
    .send({ refreshToken: "not-a-valid-refresh-token-string-at-all" });
  assert.equal(res.status, 401);
});

test("Security: revoked refresh token cannot be reused after logout", { skip: dbSkip }, async () => {
  const auth = await registerUser("logout_revoke");

  const logoutRes = await request(app)
    .post("/api/v1/auth/logout")
    .send({ refreshToken: auth.refreshToken });
  assert.equal(logoutRes.status, 204);

  const refreshRes = await request(app)
    .post("/api/v1/auth/refresh")
    .send({ refreshToken: auth.refreshToken });
  assert.equal(refreshRes.status, 401);
});

test("Security: malformed input is blocked by validation", { skip: dbSkip }, async () => {
  const auth = await registerUser("validation");
  const res = await request(app)
    .post("/api/v1/placement/submit")
    .set("Authorization", `Bearer ${auth.token}`)
    .send({
      testId: "not-uuid",
      answers: [{ questionId: "x", optionId: "y" }]
    });
  assert.equal(res.status, 400);
});

test("Security: AI abuse protection blocks repeated identical prompts", { skip: dbSkip }, async () => {
  const auth = await registerUser("abuse_guard");
  const payload = {
    message: "Please help me write a polite work sentence",
    scenario: "work",
    proficiency: "A2"
  };

  let blocked = false;
  for (let i = 0; i < 8; i += 1) {
    const res = await request(app)
      .post("/api/v1/ai/tutor/reply")
      .set("Authorization", `Bearer ${auth.token}`)
      .send(payload);

    if (res.status === 429 && res.body.code === "AI_ABUSE_DUPLICATE") {
      blocked = true;
      break;
    }
  }

  assert.equal(blocked, true);
});
