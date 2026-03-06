const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const { createServer } = require('http');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OpenAI } = require('openai');
require('dotenv').config();

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 4000;
const CLIENT_URLS = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'data.db');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;
const MAX_FRAMES_PER_MIN = Number(process.env.MAX_FRAMES_PER_MIN || 20);

// ---------------------------------------------------------------------------
// DB setup (SQLite)
// ---------------------------------------------------------------------------
const db = new sqlite3.Database(DB_FILE);
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    displayName TEXT,
    createdAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS progress (
    userId TEXT PRIMARY KEY,
    stars INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    vocabCompleted TEXT DEFAULT '[]',
    grammarCompleted TEXT DEFAULT '[]',
    storiesCompleted TEXT DEFAULT '[]',
    quizScores TEXT DEFAULT '[]',
    updatedAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS srs_items (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    itemType TEXT NOT NULL,
    level INTEGER,
    nextReviewAt TEXT,
    easeFactor REAL,
    interval INTEGER,
    history TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    userId TEXT,
    eventName TEXT NOT NULL,
    source TEXT,
    scenario TEXT,
    metadata TEXT,
    createdAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS request_metrics (
    id TEXT PRIMARY KEY,
    method TEXT NOT NULL,
    path TEXT NOT NULL,
    statusCode INTEGER NOT NULL,
    latencyMs INTEGER NOT NULL,
    retryCount INTEGER DEFAULT 0,
    circuitOpenCount INTEGER DEFAULT 0,
    errorCount INTEGER DEFAULT 0,
    createdAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS safety_consents (
    userId TEXT PRIMARY KEY,
    allowVision INTEGER DEFAULT 0,
    guardianName TEXT,
    policyVersion TEXT,
    updatedAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS lesson_progress (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    lessonId TEXT NOT NULL,
    masteryScore REAL DEFAULT 0,
    completed INTEGER DEFAULT 0,
    updatedAt TEXT,
    UNIQUE(userId, lessonId)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS content_cache (
    cacheKey TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    createdAt TEXT
  )`);
});

// Helpers
const nowIso = () => new Date().toISOString();
const generateId = () => Math.random().toString(36).slice(2, 10);
const parseJSON = (value, fallback) => {
  try { return JSON.parse(value); } catch { return fallback; }
};
const classifyAiError = (error) => {
  const status = Number(error?.status || 0);
  const code = String(error?.code || error?.type || '').toLowerCase();
  const message = String(error?.message || '').toLowerCase();

  if (
    code.includes('insufficient_quota')
    || message.includes('insufficient_quota')
    || (status === 429 && message.includes('quota'))
  ) {
    return 'OPENAI_QUOTA_EXCEEDED';
  }
  if (
    code.includes('invalid_api_key')
    || message.includes('invalid api key')
    || status === 401
  ) {
    return 'OPENAI_INVALID_KEY';
  }
  if (status === 429) {
    return 'OPENAI_RATE_LIMITED';
  }
  if (status >= 500 || message.includes('timed out') || message.includes('network')) {
    return 'OPENAI_UPSTREAM_ERROR';
  }
  return 'OPENAI_REQUEST_FAILED';
};
const aiRuntimeStatus = () => {
  if (!OPENAI_API_KEY) {
    return { configured: false, mode: 'fallback' };
  }
  return { configured: true, mode: 'openai' };
};
const tutorFallbackReply = (hasImage) => (
  hasImage
    ? 'Vision mode is temporarily unavailable. Please continue with text chat.'
    : "AI tutor is temporarily unavailable right now. Let's continue with short practice."
);
const policyVersion = '2026-03-child-safe-v1';
const safetyPolicy = {
  version: policyVersion,
  title: 'Child Vision Safety Policy',
  summary: 'Vision mode accepts object-only photos after guardian consent.',
  rules: [
    'No faces or people in frame.',
    'No IDs, cards, documents, addresses, phone numbers, or private screens.',
    'Images may be analyzed by AI moderation before tutoring reply.',
    'Vision is disabled by default and requires guardian name + consent.',
  ],
};

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}
function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });
}
function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

const PLACEMENT_TESTS = {
  en: {
    id: 'placement-en-v1',
    title: 'English Placement Test',
    languageCode: 'en',
    totalQuestions: 5,
    version: 1,
    questions: [
      {
        id: 'q1',
        prompt: 'Choose the correct sentence.',
        sort_order: 1,
        options: [
          { id: 'q1o1', optionText: 'She go to school every day.', sortOrder: 1 },
          { id: 'q1o2', optionText: 'She goes to school every day.', sortOrder: 2 },
          { id: 'q1o3', optionText: 'She going to school every day.', sortOrder: 3 },
        ],
        answer: 'q1o2',
      },
      {
        id: 'q2',
        prompt: 'What is the plural of "child"?',
        sort_order: 2,
        options: [
          { id: 'q2o1', optionText: 'childs', sortOrder: 1 },
          { id: 'q2o2', optionText: 'children', sortOrder: 2 },
          { id: 'q2o3', optionText: 'childes', sortOrder: 3 },
        ],
        answer: 'q2o2',
      },
      {
        id: 'q3',
        prompt: 'Choose the best response: "How are you?"',
        sort_order: 3,
        options: [
          { id: 'q3o1', optionText: 'I am fine, thank you.', sortOrder: 1 },
          { id: 'q3o2', optionText: 'I am ten years old.', sortOrder: 2 },
          { id: 'q3o3', optionText: 'My name is Ali.', sortOrder: 3 },
        ],
        answer: 'q3o1',
      },
      {
        id: 'q4',
        prompt: 'Complete: "There ___ two apples on the table."',
        sort_order: 4,
        options: [
          { id: 'q4o1', optionText: 'is', sortOrder: 1 },
          { id: 'q4o2', optionText: 'are', sortOrder: 2 },
          { id: 'q4o3', optionText: 'am', sortOrder: 3 },
        ],
        answer: 'q4o2',
      },
      {
        id: 'q5',
        prompt: 'Choose the correct preposition: "I am good ___ English."',
        sort_order: 5,
        options: [
          { id: 'q5o1', optionText: 'in', sortOrder: 1 },
          { id: 'q5o2', optionText: 'at', sortOrder: 2 },
          { id: 'q5o3', optionText: 'on', sortOrder: 3 },
        ],
        answer: 'q5o2',
      },
    ],
  },
};

function scoreToCefr(scorePercent) {
  if (scorePercent >= 90) return 'B2';
  if (scorePercent >= 75) return 'B1';
  if (scorePercent >= 55) return 'A2';
  return 'A1';
}

function signTokens(userId) {
  const token = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ sub: userId, type: 'refresh' }, JWT_SECRET, { expiresIn: '7d' });
  return { token, refreshToken };
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'UNAUTHENTICATED' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'INVALID_TOKEN' });
  }
}

// ---------------------------------------------------------------------------
// Express app
// ---------------------------------------------------------------------------
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: CLIENT_URLS, methods: ['GET', 'POST'] }
});

app.use(helmet());
app.use(compression());
app.use(cors({ origin: CLIENT_URLS, credentials: true }));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Request-level metrics for ops dashboard
app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on('finish', () => {
    if (!req.path.startsWith('/api/v1')) return;
    const latencyMs = Date.now() - startedAt;
    const statusCode = res.statusCode;
    const errorCount = statusCode >= 500 ? 1 : 0;
    db.run(
      `INSERT INTO request_metrics (id, method, path, statusCode, latencyMs, retryCount, circuitOpenCount, errorCount, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [generateId(), req.method, req.path, statusCode, latencyMs, 0, 0, errorCount, nowIso()]
    );
  });
  next();
});

// Rate limit for API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use('/api/v1/', limiter);

// ---------------------------------------------------------------------------
// Auth routes
// ---------------------------------------------------------------------------
app.post('/api/v1/auth/register', (req, res) => {
  const { email, password, displayName } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'EMAIL_PASSWORD_REQUIRED' });

  const id = generateId();
  const hash = bcrypt.hashSync(password, 10);
  const createdAt = nowIso();

  db.run(
    `INSERT INTO users (id, email, passwordHash, displayName, createdAt) VALUES (?,?,?,?,?)`,
    [id, email.toLowerCase(), hash, displayName || 'Learner', createdAt],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'EMAIL_EXISTS' });
        return res.status(500).json({ error: 'DB_ERROR' });
      }
      db.run(`INSERT OR IGNORE INTO progress (userId, updatedAt) VALUES (?,?)`, [id, createdAt]);
      const tokens = signTokens(id);
      res.json({ user: { id, email, displayName: displayName || 'Learner', status: 'active', roles: ['user'] }, ...tokens });
    }
  );
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'EMAIL_PASSWORD_REQUIRED' });

  db.get(`SELECT * FROM users WHERE email = ?`, [email.toLowerCase()], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB_ERROR' });
    if (!row || !bcrypt.compareSync(password, row.passwordHash)) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    }
    const tokens = signTokens(row.id);
    res.json({ user: { id: row.id, email: row.email, displayName: row.displayName, status: 'active', roles: ['user'] }, ...tokens });
  });
});

app.post('/api/v1/auth/refresh', (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: 'REFRESH_REQUIRED' });
  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET);
    if (payload.type !== 'refresh') throw new Error('bad token');
    const tokens = signTokens(payload.sub);
    return res.json(tokens);
  } catch {
    return res.status(401).json({ error: 'INVALID_REFRESH' });
  }
});

// ---------------------------------------------------------------------------
// AI tutor proxy + content generation + safety consent
// ---------------------------------------------------------------------------
app.get('/api/v1/safety/policy', (_req, res) => {
  res.json(safetyPolicy);
});

app.get('/api/v1/safety/consent', authMiddleware, async (req, res) => {
  try {
    const row = await dbGet(`SELECT * FROM safety_consents WHERE userId = ?`, [req.userId]);
    res.json({
      allowVision: Boolean(row?.allowVision),
      guardianName: row?.guardianName || '',
      policyVersion: row?.policyVersion || policyVersion,
      updatedAt: row?.updatedAt || null,
    });
  } catch {
    res.status(500).json({ error: 'DB_ERROR' });
  }
});

app.post('/api/v1/safety/consent', authMiddleware, async (req, res) => {
  const allowVision = req.body?.allowVision ? 1 : 0;
  const guardianName = String(req.body?.guardianName || '').slice(0, 120);
  const updatedAt = nowIso();
  try {
    await dbRun(
      `INSERT INTO safety_consents (userId, allowVision, guardianName, policyVersion, updatedAt)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(userId) DO UPDATE SET
         allowVision=excluded.allowVision,
         guardianName=excluded.guardianName,
         policyVersion=excluded.policyVersion,
         updatedAt=excluded.updatedAt`,
      [req.userId, allowVision, guardianName, policyVersion, updatedAt]
    );
    res.json({ ok: true, allowVision: Boolean(allowVision), updatedAt, policyVersion });
  } catch {
    res.status(500).json({ error: 'DB_ERROR' });
  }
});

app.post('/api/v1/ai/tutor/reply', authMiddleware, async (req, res) => {
  const {
    history = [],
    userMessage = '',
    langCode = 'en-US',
    scenario = 'free',
    imageBase64,
  } = req.body || {};

  const safeBlocked = { blocked: false, reason: null };
  try {
    if (imageBase64) {
      const consent = await dbGet(`SELECT allowVision FROM safety_consents WHERE userId = ?`, [req.userId]);
      if (!consent?.allowVision) {
        return res.json({
          reply: 'Vision mode is locked until guardian consent is enabled in Safety Settings.',
          correction: null,
          safety: { blocked: true, reason: 'NO_GUARDIAN_CONSENT' },
        });
      }

      const normalizedImage = String(imageBase64).trim();
      const estimatedBytes = Math.round((normalizedImage.length * 3) / 4);
      if (estimatedBytes > 3_000_000) {
        return res.json({
          reply: 'Image is too large. Please capture a closer object photo.',
          correction: null,
          safety: { blocked: true, reason: 'IMAGE_TOO_LARGE' },
        });
      }

      // If safety scanner is unavailable, fail closed for child accounts.
      if (!openai) {
        return res.json({
          reply: 'Vision mode is temporarily unavailable. Please try text chat now.',
          correction: null,
          safety: { blocked: true, reason: 'SAFETY_SCANNER_UNAVAILABLE' },
        });
      }

      // Image safety scan: detect face/PII-like content by model policy prompt.
      const safetyCheck = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text:
                  'Return strict JSON only: {"safe":boolean,"reason":string}. Mark unsafe if image has person/face, IDs, documents, address, phone, email, plates, screens, or private info.',
              },
              { type: 'input_image', image_url: normalizedImage },
            ],
          },
        ],
      });
      const raw = safetyCheck.output_text || '{"safe":false,"reason":"UNKNOWN"}';
      const cleaned = raw.substring(raw.indexOf('{'), raw.lastIndexOf('}') + 1);
      const parsed = parseJSON(cleaned, { safe: false, reason: 'SAFETY_PARSE_FAILED' });
      if (!parsed.safe) {
        return res.json({
          reply: 'I cannot analyze this image for child safety reasons. Please capture an object-only photo.',
          correction: null,
          safety: { blocked: true, reason: parsed.reason || 'UNSAFE_IMAGE' },
        });
      }
    }

    if (!openai) {
      return res.json({
        reply: imageBase64
          ? 'I can see the image, but AI proxy is offline right now.'
          : "Great! Let's practice more. Tell me another sentence.",
        correction: null,
        safety: safeBlocked,
      });
    }

    const system = `You are LISAN, a child-safe English tutor.
Scenario: ${scenario}
Language mode: ${langCode}
Rules:
- Keep response very short (max 2 sentences).
- If student English grammar has a mistake, add exactly one line: [CORRECTION: ...]
- No markdown.`;

    const compactHistory = Array.isArray(history) ? history.slice(-8) : [];
    const textPayload = compactHistory.map((m) => `${m.role === 'bot' ? 'Tutor' : 'Student'}: ${m.text}`).join('\n');
    const userText = String(userMessage || '').slice(0, 1000);

    const response = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'system',
          content: [{ type: 'input_text', text: system }],
        },
        {
          role: 'user',
          content: [
            { type: 'input_text', text: `${textPayload}\nStudent: ${userText}` },
            ...(imageBase64 ? [{ type: 'input_image', image_url: imageBase64 }] : []),
          ],
        },
      ],
    });

    let reply = response.output_text || "Let's keep learning together.";
    let correction = null;
    const match = reply.match(/\[CORRECTION:\s*(.+?)\]/i);
    if (match) {
      correction = match[1];
      reply = reply.replace(/\[CORRECTION:\s*.+?\]/ig, '').trim();
    }

    res.json({ reply, correction, safety: safeBlocked });
  } catch (error) {
    const reason = classifyAiError(error);
    console.error('ai/tutor/reply error', {
      reason,
      status: error?.status || null,
      code: error?.code || error?.type || null,
      message: error?.message || String(error),
    });
    res.json({
      reply: tutorFallbackReply(Boolean(imageBase64)),
      correction: null,
      safety: safeBlocked,
      degraded: true,
      reason,
    });
  }
});

app.post('/api/v1/content/generate', authMiddleware, async (req, res) => {
  const topic = String(req.body?.topic || 'daily life').slice(0, 120);
  const level = String(req.body?.level || 'A1').slice(0, 10);
  const mode = String(req.body?.mode || 'story').slice(0, 20);
  const cacheKey = `${mode}:${level}:${topic}`.toLowerCase();

  try {
    const cached = await dbGet(`SELECT content FROM content_cache WHERE cacheKey = ?`, [cacheKey]);
    if (cached?.content) {
      return res.json({ cached: true, content: parseJSON(cached.content, { text: cached.content }) });
    }

    if (!openai) {
      const fallback = { text: `Topic: ${topic}. Practice simple ${level} ${mode} tasks.` };
      await dbRun(`INSERT OR REPLACE INTO content_cache (cacheKey, content, createdAt) VALUES (?, ?, ?)`, [cacheKey, JSON.stringify(fallback), nowIso()]);
      return res.json({ cached: false, content: fallback });
    }

    const out = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: `Generate child-safe English ${mode} content at ${level} about "${topic}". Return compact JSON with fields: title,text,questions[].`,
    });
    const content = parseJSON(out.output_text || '{}', { text: out.output_text || '' });
    await dbRun(`INSERT OR REPLACE INTO content_cache (cacheKey, content, createdAt) VALUES (?, ?, ?)`, [cacheKey, JSON.stringify(content), nowIso()]);
    return res.json({ cached: false, content });
  } catch (error) {
    console.error('content/generate error', error?.message || error);
    res.status(500).json({ error: 'CONTENT_GENERATION_FAILED' });
  }
});

// ---------------------------------------------------------------------------
// Placement + Learning path routes
// ---------------------------------------------------------------------------
app.get('/api/v1/placement/tests/:languageCode', authMiddleware, (req, res) => {
  const languageCode = String(req.params.languageCode || 'en').toLowerCase();
  const test = PLACEMENT_TESTS[languageCode] || PLACEMENT_TESTS.en;
  const safeQuestions = test.questions.map(({ answer, ...q }) => q);
  res.json({
    test: {
      id: test.id,
      title: test.title,
      languageCode: test.languageCode,
      totalQuestions: test.totalQuestions,
      version: test.version,
      questions: safeQuestions,
    },
  });
});

app.post('/api/v1/placement/submit', authMiddleware, (req, res) => {
  const { testId, answers } = req.body || {};
  const test = Object.values(PLACEMENT_TESTS).find((t) => t.id === testId) || PLACEMENT_TESTS.en;
  const answerMap = new Map((answers || []).map((a) => [a.questionId, a.optionId]));
  let correct = 0;
  for (const q of test.questions) {
    if (answerMap.get(q.id) === q.answer) correct += 1;
  }
  const total = test.questions.length || 1;
  const scorePercent = Math.round((correct / total) * 100);
  const estimatedCefr = scoreToCefr(scorePercent);
  res.json({
    placementResult: {
      estimatedCefr,
      scorePercent,
    },
  });
});

app.get('/api/v1/learning-path', authMiddleware, (req, res) => {
  const languageCode = String(req.query.languageCode || 'en');
  const goalType = String(req.query.goalType || 'daily');
  const mockCefr = 'A1';
  const track = goalType === 'travel' ? 'travel_core' : goalType === 'work' ? 'work_core' : 'daily_core';
  res.json({
    userId: req.userId,
    languageCode,
    goalType,
    cefr: mockCefr,
    recommendedTrackCodes: [track],
    lessons: [
      {
        track_code: track,
        track_name: 'Core Track',
        unit_title: 'Starter Unit',
        lesson_id: 'lesson-hello-1',
        lesson_title: 'Greetings and Introductions',
        lesson_type: 'dialogue',
        est_minutes: 10,
      },
      {
        track_code: track,
        track_name: 'Core Track',
        unit_title: 'Starter Unit',
        lesson_id: 'lesson-daily-1',
        lesson_title: 'Daily Routine Basics',
        lesson_type: 'practice',
        est_minutes: 12,
      },
    ],
  });
});

app.get('/api/v1/lessons/:lessonId/content', authMiddleware, (req, res) => {
  const lessonId = String(req.params.lessonId);
  res.json({
    lesson: {
      lessonId,
      lessonTitle: 'Sample Lesson',
      lessonType: 'practice',
      estMinutes: 10,
      unitId: 'unit-1',
      unitTitle: 'Starter Unit',
      cefrLevel: 'A1',
      trackCode: 'daily_core',
      trackName: 'Core Track',
      languageCode: 'en',
      qaStatus: 'approved',
      qaNotes: null,
    },
    body: {
      intro: 'Welcome to your lesson.',
      objective: 'Use simple present tense in daily context.',
      tasks: ['listen', 'repeat', 'quiz'],
    },
  });
});

// ---------------------------------------------------------------------------
// Progress routes
// ---------------------------------------------------------------------------
app.get('/api/v1/progress', authMiddleware, (req, res) => {
  db.get(`SELECT * FROM progress WHERE userId = ?`, [req.userId], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB_ERROR' });
    if (!row) return res.json({
      vocabularyCompleted: [],
      grammarCompleted: [],
      storiesCompleted: [],
      quizScores: [],
      stars: 0,
      level: 1,
      username: 'Learner',
    });
    res.json({
      vocabularyCompleted: parseJSON(row.vocabCompleted, []),
      grammarCompleted: parseJSON(row.grammarCompleted, []),
      storiesCompleted: parseJSON(row.storiesCompleted, []),
      quizScores: parseJSON(row.quizScores, []),
      stars: row.stars || 0,
      level: row.level || 1,
      username: 'Learner',
    });
  });
});

app.put('/api/v1/progress', authMiddleware, (req, res) => {
  const { vocabularyCompleted, grammarCompleted, storiesCompleted, quizScores, stars, level } = req.body || {};
  const updatedAt = nowIso();
  db.run(
    `INSERT INTO progress (userId, vocabCompleted, grammarCompleted, storiesCompleted, quizScores, stars, level, updatedAt)
     VALUES (?,?,?,?,?,?,?,?)
     ON CONFLICT(userId) DO UPDATE SET
       vocabCompleted=excluded.vocabCompleted,
       grammarCompleted=excluded.grammarCompleted,
       storiesCompleted=excluded.storiesCompleted,
       quizScores=excluded.quizScores,
       stars=excluded.stars,
       level=excluded.level,
       updatedAt=excluded.updatedAt`,
    [
      req.userId,
      JSON.stringify(vocabularyCompleted || []),
      JSON.stringify(grammarCompleted || []),
      JSON.stringify(storiesCompleted || []),
      JSON.stringify(quizScores || []),
      stars || 0,
      level || 1,
      updatedAt
    ],
    (err) => {
      if (err) return res.status(500).json({ error: 'DB_ERROR' });
      res.json({ ok: true, updatedAt });
    }
  );
});

// ---------------------------------------------------------------------------
// Gamification (simple derived XP/streaks)
// ---------------------------------------------------------------------------
app.get('/api/v1/gamification/status', authMiddleware, (req, res) => {
  db.get(`SELECT * FROM progress WHERE userId = ?`, [req.userId], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB_ERROR' });
    const stars = row?.stars || 0;
    const level = row?.level || 1;
    const totalXp = stars * 10;
    const currentStreakDays = 1;
    const bestStreakDays = 1;
    res.json({
      totalXp,
      level,
      nextLevelXp: (level + 1) * 200,
      currentStreakDays,
      bestStreakDays,
      lastActiveDate: nowIso(),
    });
  });
});

app.post('/api/v1/gamification/award', authMiddleware, (req, res) => {
  const { points } = req.body || {};
  const numericPoints = Number(points) || 0;
  const starsToAdd = Math.max(1, Math.round(numericPoints / 10));
  db.run(
    `INSERT INTO progress (userId, stars, level, updatedAt)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(userId) DO UPDATE SET
       stars = progress.stars + excluded.stars,
       level = CASE
         WHEN CAST(((progress.stars + excluded.stars) / 20) AS INT) + 1 > 50 THEN 50
         ELSE CAST(((progress.stars + excluded.stars) / 20) AS INT) + 1
       END,
       updatedAt = excluded.updatedAt`,
    [req.userId, starsToAdd, 1, nowIso()],
    (err) => {
      if (err) return res.status(500).json({ error: 'DB_ERROR' });
      res.json({ ok: true });
    }
  );
});

// ---------------------------------------------------------------------------
// Lessons dynamic path/progress
// ---------------------------------------------------------------------------
app.post('/api/v1/lessons/path', authMiddleware, async (req, res) => {
  const lessonIds = Array.isArray(req.body?.lessonIds) ? req.body.lessonIds.map(String) : [];
  if (lessonIds.length === 0) {
    return res.json({ statuses: [] });
  }
  try {
    const placeholders = lessonIds.map(() => '?').join(',');
    const rows = await dbAll(
      `SELECT lessonId, masteryScore, completed FROM lesson_progress
       WHERE userId = ? AND lessonId IN (${placeholders})`,
      [req.userId, ...lessonIds]
    );
    const byId = new Map(rows.map((r) => [r.lessonId, r]));
    const completedCount = rows.filter((r) => Number(r.completed) === 1).length;
    const statuses = lessonIds.map((lessonId, index) => {
      const row = byId.get(lessonId);
      const unlocked = index < 2 || index <= completedCount + 1;
      const masteryScore = Number(row?.masteryScore || 0);
      return {
        lessonId,
        unlocked,
        completed: Boolean(row?.completed),
        masteryScore,
        mastered: masteryScore >= 80,
      };
    });
    res.json({ statuses });
  } catch {
    res.status(500).json({ error: 'DB_ERROR' });
  }
});

app.patch('/api/v1/lessons/:lessonId/progress', authMiddleware, async (req, res) => {
  const lessonId = String(req.params.lessonId);
  const masteryScore = Math.max(0, Math.min(100, Number(req.body?.masteryScore || 0)));
  const completed = req.body?.completed ? 1 : 0;
  try {
    await dbRun(
      `INSERT INTO lesson_progress (id, userId, lessonId, masteryScore, completed, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(userId, lessonId) DO UPDATE SET
         masteryScore=excluded.masteryScore,
         completed=excluded.completed,
         updatedAt=excluded.updatedAt`,
      [generateId(), req.userId, lessonId, masteryScore, completed, nowIso()]
    );
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'DB_ERROR' });
  }
});

// ---------------------------------------------------------------------------
// Analytics routes
// ---------------------------------------------------------------------------
app.post('/api/v1/analytics/events', authMiddleware, async (req, res) => {
  const eventName = String(req.body?.eventName || '');
  const source = String(req.body?.source || 'web');
  const metadata = req.body?.metadata || {};
  const scenario = String(metadata?.scenario || 'all');
  if (!eventName) return res.status(400).json({ error: 'EVENT_NAME_REQUIRED' });
  try {
    await dbRun(
      `INSERT INTO analytics_events (id, userId, eventName, source, scenario, metadata, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [generateId(), req.userId, eventName, source, scenario, JSON.stringify(metadata), nowIso()]
    );
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'DB_ERROR' });
  }
});

app.get('/api/v1/analytics/summary', authMiddleware, async (req, res) => {
  const hours = Math.max(1, Math.min(24 * 30, Number(req.query.hours || 24)));
  const scenario = String(req.query.scenario || 'all');
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  const names = [
    'ai_tutor_submitted',
    'ai_tutor_success',
    'ai_tutor_retry',
    'ai_tutor_cooldown_hit',
    'ai_tutor_daily_cap_hit',
    'voice_socket_connect_error',
    'voice_socket_disconnected',
    'voice_socket_reconnected',
    'voice_stream_start_failed',
  ];
  const counts = Object.fromEntries(names.map((n) => [n, 0]));

  try {
    const rows = await dbAll(
      `SELECT eventName, COUNT(*) as c FROM analytics_events
       WHERE createdAt >= ? AND (? = 'all' OR scenario = ?)
       GROUP BY eventName`,
      [since, scenario, scenario]
    );
    rows.forEach((r) => {
      if (counts[r.eventName] !== undefined) counts[r.eventName] = Number(r.c || 0);
    });

    const topScenarios = await dbAll(
      `SELECT scenario, COUNT(*) as count FROM analytics_events
       WHERE createdAt >= ?
       GROUP BY scenario
       ORDER BY count DESC
       LIMIT 5`,
      [since]
    );

    const submitted = counts.ai_tutor_submitted || 0;
    const success = counts.ai_tutor_success || 0;
    const successRate = submitted > 0 ? Math.round((success / submitted) * 1000) / 10 : 0;
    res.json({
      windowHours: hours,
      scenario,
      counts,
      kpis: { submitted, success, successRate },
      topScenarios: topScenarios.map((s) => ({ scenario: s.scenario || 'unknown', count: Number(s.count || 0) })),
    });
  } catch {
    res.status(500).json({ error: 'DB_ERROR' });
  }
});

app.get('/api/v1/analytics/trend', authMiddleware, async (req, res) => {
  const hours = Math.max(1, Math.min(24 * 30, Number(req.query.hours || 24)));
  const scenario = String(req.query.scenario || 'all');
  const sinceDate = new Date(Date.now() - hours * 60 * 60 * 1000);
  const since = sinceDate.toISOString();
  try {
    const rows = await dbAll(
      `SELECT strftime('%Y-%m-%dT%H:00:00Z', createdAt) as bucket, eventName, COUNT(*) as c
       FROM analytics_events
       WHERE createdAt >= ? AND (?='all' OR scenario = ?)
       GROUP BY bucket, eventName`,
      [since, scenario, scenario]
    );
    const map = new Map();
    for (let i = 0; i < hours; i++) {
      const d = new Date(sinceDate.getTime() + i * 60 * 60 * 1000);
      const key = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours())).toISOString().slice(0, 19) + 'Z';
      map.set(key, {
        hour_start: key,
        total: 0,
        ai_tutor_submitted: 0,
        ai_tutor_success: 0,
        ai_tutor_retry: 0,
        ai_tutor_cooldown_hit: 0,
        ai_tutor_daily_cap_hit: 0,
        voice_socket_connect_error: 0,
        voice_socket_disconnected: 0,
        voice_socket_reconnected: 0,
        voice_stream_start_failed: 0,
        success_rate: 0,
      });
    }
    rows.forEach((r) => {
      const row = map.get(r.bucket);
      if (!row) return;
      const count = Number(r.c || 0);
      row.total += count;
      if (row[r.eventName] !== undefined) row[r.eventName] += count;
    });
    const points = Array.from(map.values()).map((p) => ({
      ...p,
      success_rate: p.ai_tutor_submitted > 0 ? Math.round((p.ai_tutor_success / p.ai_tutor_submitted) * 1000) / 10 : 0,
    }));
    res.json({ windowHours: hours, scenario, points });
  } catch {
    res.status(500).json({ error: 'DB_ERROR' });
  }
});

app.get('/api/v1/analytics/ops/dashboard', authMiddleware, async (req, res) => {
  const hours = Math.max(1, Math.min(24 * 30, Number(req.query.hours || 24)));
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  try {
    const rows = await dbAll(
      `SELECT * FROM request_metrics WHERE createdAt >= ? ORDER BY createdAt ASC`,
      [since]
    );
    const totalRequests = rows.length;
    const totalErrors = rows.filter((r) => Number(r.statusCode) >= 500).length;
    const retryCount = rows.reduce((s, r) => s + Number(r.retryCount || 0), 0);
    const circuitOpenEvents = rows.reduce((s, r) => s + Number(r.circuitOpenCount || 0), 0);
    const latencies = rows.map((r) => Number(r.latencyMs || 0)).sort((a, b) => a - b);
    const avgLatencyMs = totalRequests ? Math.round(latencies.reduce((a, b) => a + b, 0) / totalRequests) : 0;
    const p95LatencyMs = latencies.length ? latencies[Math.min(latencies.length - 1, Math.floor(latencies.length * 0.95))] : 0;
    const errorRate = totalRequests ? Math.round((totalErrors / totalRequests) * 1000) / 10 : 0;

    const grouped = {};
    rows.forEach((r) => {
      const b = String(r.createdAt).slice(0, 13) + ':00:00.000Z';
      grouped[b] = grouped[b] || {
        hour_start: b, request_count: 0, error_count: 0, retry_count: 0, circuit_open_count: 0, avg_latency_ms: 0, error_rate: 0,
      };
      const g = grouped[b];
      g.request_count += 1;
      g.error_count += Number(r.statusCode) >= 500 ? 1 : 0;
      g.retry_count += Number(r.retryCount || 0);
      g.circuit_open_count += Number(r.circuitOpenCount || 0);
      g.avg_latency_ms += Number(r.latencyMs || 0);
    });
    const points = Object.values(grouped).map((g) => {
      g.avg_latency_ms = g.request_count ? Math.round(g.avg_latency_ms / g.request_count) : 0;
      g.error_rate = g.request_count ? Math.round((g.error_count / g.request_count) * 1000) / 10 : 0;
      return g;
    });

    res.json({
      windowHours: hours,
      kpis: { totalRequests, totalErrors, errorRate, avgLatencyMs, p95LatencyMs, retryCount, circuitOpenEvents },
      circuit: { state: 'CLOSED', failures: 0, threshold: 5, reopenInMs: 0 },
      points,
    });
  } catch {
    res.status(500).json({ error: 'DB_ERROR' });
  }
});

app.get('/api/v1/analytics/ops/routes', authMiddleware, async (req, res) => {
  const hours = Math.max(1, Math.min(24 * 30, Number(req.query.hours || 24)));
  const limit = Math.max(1, Math.min(100, Number(req.query.limit || 20)));
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  try {
    const rows = await dbAll(
      `SELECT method, path, statusCode, latencyMs FROM request_metrics WHERE createdAt >= ?`,
      [since]
    );
    const map = new Map();
    rows.forEach((r) => {
      const key = `${r.method} ${r.path}`;
      if (!map.has(key)) {
        map.set(key, { method: r.method, path: r.path, requestCount: 0, errors5xx: 0, errorRate: 0, avgLatencyMs: 0, p95LatencyMs: 0, latencies: [] });
      }
      const x = map.get(key);
      x.requestCount += 1;
      if (Number(r.statusCode) >= 500) x.errors5xx += 1;
      const lat = Number(r.latencyMs || 0);
      x.avgLatencyMs += lat;
      x.latencies.push(lat);
    });
    const routes = Array.from(map.values()).map((x) => {
      const sorted = x.latencies.sort((a, b) => a - b);
      return {
        method: x.method,
        path: x.path,
        requestCount: x.requestCount,
        errors5xx: x.errors5xx,
        errorRate: x.requestCount ? Math.round((x.errors5xx / x.requestCount) * 1000) / 10 : 0,
        avgLatencyMs: x.requestCount ? Math.round(x.avgLatencyMs / x.requestCount) : 0,
        p95LatencyMs: sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))] : 0,
      };
    }).sort((a, b) => b.requestCount - a.requestCount).slice(0, limit);
    const topFailingRoutes = [...routes]
      .sort((a, b) => b.errors5xx - a.errors5xx)
      .slice(0, Math.min(5, routes.length))
      .map((r) => ({ method: r.method, path: r.path, errors5xx: r.errors5xx, requestCount: r.requestCount }));
    res.json({ windowHours: hours, limit, routes, topFailingRoutes });
  } catch {
    res.status(500).json({ error: 'DB_ERROR' });
  }
});

// ---------------------------------------------------------------------------
// SRS routes (server-side SM-2 style)
// ---------------------------------------------------------------------------
function reviewLogic(item, isCorrect, timeTakenSeconds) {
  // Defaults
  item.level ??= 0;
  item.interval ??= 0;
  item.easeFactor ??= 2.5;
  item.history ??= [];

  // Quality score
  let quality = 0;
  if (isCorrect) quality = timeTakenSeconds < 3 ? 5 : timeTakenSeconds < 6 ? 4 : 3;
  else quality = 2;

  item.history.push(isCorrect);
  if (item.history.length > 20) item.history.shift();

  if (quality >= 3) {
    if (item.level === 0) item.interval = 1;
    else if (item.level === 1) item.interval = 6;
    else item.interval = Math.round(item.interval * item.easeFactor);
    item.level += 1;
  } else {
    item.level = 0;
    item.interval = 1;
  }

  item.easeFactor = item.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (item.easeFactor < 1.3) item.easeFactor = 1.3;

  const next = new Date();
  next.setDate(next.getDate() + item.interval);
  item.nextReviewAt = next.toISOString();
  return item;
}

app.get('/api/v1/srs/due', authMiddleware, (req, res) => {
  const now = new Date().toISOString();
  db.all(
    `SELECT * FROM srs_items WHERE userId = ? AND nextReviewAt <= ? ORDER BY datetime(nextReviewAt) ASC`,
    [req.userId, now],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB_ERROR' });
      const items = rows.map(r => ({
        id: r.id,
        type: r.itemType,
        level: r.level,
        nextReviewAt: r.nextReviewAt,
        easeFactor: r.easeFactor,
        interval: r.interval,
        history: parseJSON(r.history, [])
      }));
      res.json({ items });
    }
  );
});

app.post('/api/v1/srs/review', authMiddleware, (req, res) => {
  const { itemId, itemType, isCorrect, timeTakenSeconds } = req.body || {};
  if (!itemId || !itemType) return res.status(400).json({ error: 'ITEM_REQUIRED' });

  db.get(`SELECT * FROM srs_items WHERE id = ?`, [itemId], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB_ERROR' });

    const base = row ? {
      id: row.id,
      userId: row.userId,
      itemType: row.itemType,
      level: row.level,
      nextReviewAt: row.nextReviewAt,
      easeFactor: row.easeFactor,
      interval: row.interval,
      history: parseJSON(row.history, [])
    } : {
      id: itemId,
      userId: req.userId,
      itemType,
      level: 0,
      nextReviewAt: nowIso(),
      easeFactor: 2.5,
      interval: 0,
      history: []
    };

    const updated = reviewLogic(base, !!isCorrect, Number(timeTakenSeconds) || 0);
    db.run(
      `INSERT INTO srs_items (id, userId, itemType, level, nextReviewAt, easeFactor, interval, history)
       VALUES (?,?,?,?,?,?,?,?)
       ON CONFLICT(id) DO UPDATE SET
         level=excluded.level,
         nextReviewAt=excluded.nextReviewAt,
         easeFactor=excluded.easeFactor,
         interval=excluded.interval,
         history=excluded.history`,
      [
        updated.id,
        req.userId,
        updated.itemType,
        updated.level,
        updated.nextReviewAt,
        updated.easeFactor,
        updated.interval,
        JSON.stringify(updated.history)
      ],
      (writeErr) => {
        if (writeErr) return res.status(500).json({ error: 'DB_ERROR' });
        res.json({ item: updated });
      }
    );
  });
});

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'healthy', ts: nowIso(), version: 'v1', ai: aiRuntimeStatus() });
});

// ---------------------------------------------------------------------------
// Realtime voice placeholder (Socket.IO)
// ---------------------------------------------------------------------------
const voiceUsage = new Map(); // userId -> { start: number, count: number }

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error('UNAUTHORIZED'));
    const payload = jwt.verify(token, JWT_SECRET);
    socket.userId = payload.sub;
    return next();
  } catch {
    return next(new Error('UNAUTHORIZED'));
  }
});

io.on('connection', (socket) => {
  console.log('🔌 Socket connected', socket.id);
  socket.on('voice:join', (roomId) => {
    const safeRoom = roomId || `room-${socket.userId || 'anon'}`;
    socket.join(safeRoom);
    socket.to(safeRoom).emit('voice:peer-joined', { peerId: socket.id, userId: socket.userId });
  });

  socket.on('voice:ping', (payload) => {
    socket.emit('voice:pong', { ts: payload?.ts || Date.now() });
  });

  // Placeholder for audio frames (expect base64 or ArrayBuffer)
  socket.on('voice:frame', ({ roomId, frame }) => {
    if (!socket.userId) return;
    const safeRoom = roomId || `room-${socket.userId}`;

    // Per-user simple rate limit (frames/minute)
    const now = Date.now();
    const usage = voiceUsage.get(socket.userId) || { start: now, count: 0 };
    if (now - usage.start > 60_000) {
      usage.start = now;
      usage.count = 0;
    }
    usage.count += 1;
    voiceUsage.set(socket.userId, usage);
    if (usage.count > MAX_FRAMES_PER_MIN) {
      const resetInMs = Math.max(0, 60_000 - (now - usage.start));
      socket.emit('voice:limit', { resetInMs, maxPerMinute: MAX_FRAMES_PER_MIN });
      return;
    }

    // Broadcast raw frame to other peers (for future decoding)
    socket.to(safeRoom).emit('voice:frame', { peerId: socket.id, frame });

    // STT/TTS integration (best-effort, throttled per socket)
    if (!openai) {
      const transcript = 'I heard your voice... (mock STT - set OPENAI_API_KEY for real transcription)';
      io.to(safeRoom).emit('voice:transcript', {
        peerId: socket.id,
        text: transcript,
        ts: Date.now(),
      });
      return;
    }

    // Avoid overlap per socket
    if (socket.sttInFlight) return;
    socket.sttInFlight = true;

    const buf = Buffer.from(frame, 'base64');
    openai.audio.transcriptions.create({
      file: buf,
      model: 'whisper-1',
      response_format: 'json',
    }).then(async (resp) => {
      const text = resp?.text || '';
      if (text) {
        io.to(safeRoom).emit('voice:transcript', {
          peerId: socket.id,
          text,
          ts: Date.now(),
        });

        // Generate short TTS reply
        const tts = await openai.audio.speech.create({
          model: 'gpt-4o-mini-tts',
          voice: 'alloy',
          input: 'Great job! Keep talking.',
        });
        const audioBuffer = Buffer.from(await tts.arrayBuffer());
        const audioBase64 = audioBuffer.toString('base64');
        io.to(safeRoom).emit('voice:tts', {
          peerId: 'bot',
          text: 'Great job! Keep talking.',
          audioBase64,
        });
      }
    }).catch((e) => {
      console.error('STT/TTS error', e.message);
    }).finally(() => {
      socket.sttInFlight = false;
    });
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected', socket.id);
  });
});

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------
app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'SERVER_ERROR' });
});

app.use('*', (_req, res) => {
  res.status(404).json({ error: 'NOT_FOUND' });
});

server.listen(PORT, () => {
  console.log(`🚀 API ready on http://localhost:${PORT}/api/v1`);
  console.log(`🌐 CORS clients: ${CLIENT_URLS.join(', ')}`);
});

module.exports = { app, server, io, db };
