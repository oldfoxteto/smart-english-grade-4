import { query, pool } from "../src/db/pool.js";

const REQUIRED_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_SCENARIOS = {
  travel: ["travel-core", "airport-simulation", "hotel-simulation", "emergency-travel"],
  work: ["work-communication", "meeting-simulation", "job-interview-simulation", "email-writing"],
  migration: ["immigration-interview", "housing-utilities", "healthcare-visit"]
};
const DISALLOWED_TITLES = new Set(["Quick Lesson 1", "Listening Drill", "Speaking Drill"]);

function fail(message, violations) {
  violations.push(message);
}

async function runQa() {
  const violations = [];

  const levelsRes = await query(
    `SELECT lang.code AS language_code, lv.cefr_level, COUNT(u.id)::int AS units_count
     FROM levels lv
     JOIN languages lang ON lang.id = lv.language_id
     LEFT JOIN units u ON u.level_id = lv.id
     GROUP BY lang.code, lv.cefr_level`
  );

  const levelMap = new Map();
  for (const row of levelsRes.rows) {
    levelMap.set(`${row.language_code}:${row.cefr_level}`, row.units_count);
  }

  for (const language of ["en", "el"]) {
    for (const level of REQUIRED_LEVELS) {
      const count = levelMap.get(`${language}:${level}`) || 0;
      if (count < 1) {
        fail(`Missing required unit coverage for ${language} ${level}`, violations);
      }
    }
  }

  const scenarioRes = await query(
    `SELECT lang.code AS language_code, t.code AS track_code, COUNT(u.id)::int AS units_count
     FROM tracks t
     JOIN languages lang ON lang.id = t.language_id
     LEFT JOIN units u ON u.track_id = t.id
     GROUP BY lang.code, t.code`
  );

  const scenarioMap = new Map();
  for (const row of scenarioRes.rows) {
    scenarioMap.set(`${row.language_code}:${row.track_code}`, row.units_count);
  }

  for (const language of ["en", "el"]) {
    for (const [scenario, tracks] of Object.entries(REQUIRED_SCENARIOS)) {
      const total = tracks.reduce((sum, track) => sum + (scenarioMap.get(`${language}:${track}`) || 0), 0);
      if (total < 1) {
        fail(`Missing scenario coverage for ${language} -> ${scenario}`, violations);
      }
    }
  }

  const badTitleRes = await query(
    `SELECT COUNT(*)::int AS count
     FROM lessons
     WHERE title = ANY($1::text[])`,
    [Array.from(DISALLOWED_TITLES)]
  );
  if ((badTitleRes.rows[0]?.count || 0) > 0) {
    fail("Found placeholder lesson titles that violate QA policy", violations);
  }

  const lessonDepthRes = await query(
    `SELECT u.id, COUNT(l.id)::int AS lesson_count
     FROM units u
     LEFT JOIN lessons l ON l.unit_id = u.id
     GROUP BY u.id`
  );
  const shallowUnits = lessonDepthRes.rows.filter((r) => r.lesson_count < 3).length;
  if (shallowUnits > 0) {
    fail(`${shallowUnits} unit(s) have fewer than 3 lessons`, violations);
  }

  const missingBodyRes = await query(
    `SELECT COUNT(*)::int AS count
     FROM lessons ls
     LEFT JOIN lesson_bodies lb ON lb.lesson_id = ls.id
     WHERE lb.lesson_id IS NULL`
  );
  if ((missingBodyRes.rows[0]?.count || 0) > 0) {
    fail("Some lessons are missing lesson bodies", violations);
  }

  const nonApprovedRes = await query(
    `SELECT COUNT(*)::int AS count
     FROM lesson_bodies
     WHERE qa_status <> 'approved'`
  );
  if ((nonApprovedRes.rows[0]?.count || 0) > 0) {
    fail("Some lesson bodies are not QA approved", violations);
  }

  const report = {
    checkedAt: new Date().toISOString(),
    summary: {
      levelsChecked: REQUIRED_LEVELS.length * 2,
      scenariosChecked: Object.keys(REQUIRED_SCENARIOS).length * 2,
      violations: violations.length
    },
    violations
  };

  console.log(JSON.stringify(report, null, 2));

  if (violations.length > 0) {
    process.exitCode = 1;
  }
}

runQa()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
