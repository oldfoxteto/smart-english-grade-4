import test from "node:test";
import assert from "node:assert/strict";
import { parseTutorPayload } from "../src/services/aiTutorService.js";

test("parseTutorPayload handles valid JSON", () => {
  const payload = parseTutorPayload('{"correctionAr":"تصحيح","tutorReply":"رد","nextStep":"Task"}');
  assert.match(payload.correctionAr, /الخطأ:/);
  assert.match(payload.correctionAr, /السبب:/);
  assert.match(payload.correctionAr, /مثال مصحح:/);
  assert.match(payload.tutorReply, /Feedback:/);
  assert.match(payload.tutorReply, /Natural Alternative:/);
  assert.match(payload.tutorReply, /Practice Prompt:/);
  assert.equal(payload.nextStep, "Task");
});

test("parseTutorPayload handles fenced JSON", () => {
  const raw = "```json\n{\"correctionAr\":\"شرح\",\"tutorReply\":\"رد قصير\",\"nextStep\":\"Try again\"}\n```";
  const payload = parseTutorPayload(raw);
  assert.match(payload.correctionAr, /الخطأ:/);
  assert.match(payload.correctionAr, /السبب:/);
  assert.match(payload.correctionAr, /مثال مصحح:/);
  assert.match(payload.tutorReply, /Feedback:/);
  assert.match(payload.tutorReply, /Natural Alternative:/);
  assert.match(payload.tutorReply, /Practice Prompt:/);
  assert.equal(payload.nextStep, "Try again");
});

test("parseTutorPayload recovers fields from truncated JSON", () => {
  const raw = '{"correctionAr":"هذا تصحيح مفيد","tutorReply":"هذه إجابة عملية","nextStep":"Write one sentence"';
  const payload = parseTutorPayload(raw);
  assert.match(payload.correctionAr, /الخطأ:/);
  assert.match(payload.correctionAr, /السبب:/);
  assert.match(payload.correctionAr, /مثال مصحح:/);
  assert.match(payload.tutorReply, /Feedback:/);
  assert.match(payload.tutorReply, /Natural Alternative:/);
  assert.match(payload.tutorReply, /Practice Prompt:/);
  assert.equal(payload.nextStep, "Write one sentence");
});
