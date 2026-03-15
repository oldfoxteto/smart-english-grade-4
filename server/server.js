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
const MAX_VOICE_FRAME_BYTES = Number(process.env.MAX_VOICE_FRAME_BYTES || 512 * 1024);

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

  db.run(`CREATE TABLE IF NOT EXISTS user_settings (
    userId TEXT PRIMARY KEY,
    settingsJson TEXT NOT NULL,
    updatedAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS practice_progress (
    userId TEXT NOT NULL,
    exerciseId TEXT NOT NULL,
    attempts INTEGER DEFAULT 0,
    completed INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0,
    bestScore INTEGER DEFAULT 0,
    updatedAt TEXT,
    PRIMARY KEY (userId, exerciseId)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS reading_quest_progress (
    userId TEXT NOT NULL,
    questId TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    bestScore INTEGER DEFAULT 0,
    completedAt TEXT,
    PRIMARY KEY (userId, questId)
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
const voiceRuntimeStatus = () => ({
  configured: Boolean(OPENAI_API_KEY),
  mode: OPENAI_API_KEY ? 'openai-realtime-proxy' : 'mock-transcript',
  maxFramesPerMinute: MAX_FRAMES_PER_MIN,
  maxFrameBytes: MAX_VOICE_FRAME_BYTES,
  supportsRealtimeTranscription: Boolean(OPENAI_API_KEY),
  fallbackTranscript: !OPENAI_API_KEY,
});
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

const DEFAULT_USER_SETTINGS = {
  notifications: {
    email: true,
    push: true,
    sound: true,
    vibration: true,
    desktop: true,
  },
  audio: {
    microphone: true,
    speaker: true,
    volume: 75,
    inputDevice: 'default',
    outputDevice: 'default',
  },
  video: {
    camera: true,
    quality: 'medium',
    device: 'default',
  },
  appearance: {
    theme: 'light',
    language: 'ar',
    fontSize: 'medium',
    compactMode: false,
  },
  privacy: {
    profileVisibility: 'public',
    showProgress: true,
    showAchievements: true,
    dataCollection: true,
  },
  performance: {
    autoPlay: true,
    preloadContent: true,
    reduceAnimations: false,
    offlineMode: false,
  },
};

const GENERATED_LESSON_THEMES = [
  'Classroom Items',
  'Daily Routine',
  'Food and Drinks',
  'Clothes',
  'Rooms in the House',
  'Weather',
  'School Subjects',
  'Days and Months',
  'Jobs',
  'Places in Town',
  'Animals',
  'Body and Feelings',
  'Hobbies',
  'Transport',
  'Shopping and Money',
];

function resolveTrackForGoal(goalType) {
  if (goalType === 'travel') return { trackCode: 'travel_core', trackName: 'Travel Track' };
  if (goalType === 'work') return { trackCode: 'work_core', trackName: 'Work Track' };
  if (goalType === 'study') return { trackCode: 'study_core', trackName: 'Study Track' };
  return { trackCode: 'daily_core', trackName: 'Core Track' };
}

function getUnitNumberForLesson(lessonNumber) {
  if (lessonNumber <= 0) return 1;
  if (lessonNumber <= 2) return 1;
  if (lessonNumber <= 4) return 2;
  if (lessonNumber <= 5) return 3;
  return 4 + Math.floor((lessonNumber - 6) / 3);
}

function inferLessonContent(lessonId) {
  const match = /^a1-(\d{3})$/i.exec(String(lessonId || ''));
  if (!match) {
    return {
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
        objective: 'Build one small English habit with short guided practice.',
        tasks: ['Listen', 'Repeat', 'Quiz'],
        supportTips: ['Say the words aloud.', 'Match meaning before answering.', 'Review mistakes once.'],
        reviewPrompt: 'Can you say one sentence from this lesson on your own?',
        source: 'server-fallback',
      },
    };
  }

  const lessonNumber = Number(match[1]);
  const unitNumber = getUnitNumberForLesson(lessonNumber);
  const generatedIndex = lessonNumber >= 6 ? Math.floor((lessonNumber - 6) / 3) : -1;
  const generatedTheme = GENERATED_LESSON_THEMES[generatedIndex] || 'English Basics';

  const curatedLessons = {
    1: {
      title: 'Hello and Goodbye',
      type: 'vocabulary',
      objective: 'Use greetings and farewells in short daily conversations.',
      intro: 'This lesson helps learners greet others with confidence.',
      tasks: ['Listen to greetings', 'Repeat key words', 'Answer two quick questions'],
    },
    2: {
      title: 'Introducing Yourself',
      type: 'speaking',
      objective: 'Introduce yourself and ask for names using short sentences.',
      intro: 'This lesson focuses on saying your name and understanding simple introductions.',
      tasks: ['Practice "I am..."', 'Ask for a name', 'Complete the mini quiz'],
    },
    3: {
      title: 'Numbers 1-20',
      type: 'vocabulary',
      objective: 'Recognize, say, and use numbers from 1 to 20.',
      intro: 'This lesson builds confidence with counting and simple number use.',
      tasks: ['Count aloud', 'Match numbers to words', 'Fill in the blank'],
    },
    4: {
      title: 'Colors',
      type: 'vocabulary',
      objective: 'Name basic colors and describe everyday objects.',
      intro: 'This lesson connects color words to common objects around the learner.',
      tasks: ['Review the color words', 'Describe objects', 'Solve the quick quiz'],
    },
    5: {
      title: 'Family Members',
      type: 'vocabulary',
      objective: 'Talk about close family using simple English.',
      intro: 'This lesson introduces family words that are useful in daily speaking.',
      tasks: ['Review family words', 'Say one sentence about your family', 'Finish the quiz'],
    },
  };

  const curated = curatedLessons[lessonNumber];
  const cycle = lessonNumber >= 6 ? (lessonNumber - 6) % 3 : 0;
  const inferredType = curated?.type || (cycle === 0 ? 'vocabulary' : cycle === 1 ? 'grammar' : 'reading');
  const inferredTitle = curated?.title
    || (cycle === 0
      ? `${generatedTheme}: Key Words`
      : cycle === 1
        ? `${generatedTheme}: Sentence Builder`
        : `${generatedTheme}: Read and Speak`);
  const inferredObjective = curated?.objective
    || (cycle === 0
      ? `Learn the key words for ${generatedTheme.toLowerCase()}.`
      : cycle === 1
        ? `Build short sentences about ${generatedTheme.toLowerCase()}.`
        : `Read and speak about ${generatedTheme.toLowerCase()} in simple English.`);
  const inferredIntro = curated?.intro
    || `This lesson is part of Unit ${unitNumber} and focuses on ${generatedTheme.toLowerCase()}.`;
  const inferredTasks = curated?.tasks
    || (cycle === 0
      ? ['Learn the vocabulary', 'Say each word aloud', 'Complete the quiz']
      : cycle === 1
        ? ['Review the sentence pattern', 'Choose the correct form', 'Practice one example']
        : ['Read the short text', 'Answer two questions', 'Speak one short idea']);

  return {
    lesson: {
      lessonId,
      lessonTitle: inferredTitle,
      lessonType: inferredType,
      estMinutes: cycle === 2 ? 10 : cycle === 1 ? 9 : 8,
      unitId: `unit-${unitNumber}`,
      unitTitle: `Unit ${unitNumber}`,
      cefrLevel: lessonNumber <= 8 ? 'A1.1' : lessonNumber <= 32 ? 'A1.2' : 'A1.3',
      trackCode: 'daily_core',
      trackName: 'Core Track',
      languageCode: 'en',
      qaStatus: 'approved',
      qaNotes: lessonNumber > 40 ? 'Generated lesson with validated structure.' : null,
    },
    body: {
      intro: inferredIntro,
      objective: inferredObjective,
      tasks: inferredTasks,
      supportTips: [
        'Read the prompt once before answering.',
        'Say the answer aloud when possible.',
        'Retry the lesson if your score is below the mastery target.',
      ],
      reviewPrompt: `After this lesson, say one sentence about ${generatedTheme.toLowerCase()}.`,
      source: 'server-derived',
    },
  };
}

function buildLessonCatalog(goalType = 'daily') {
  const track = resolveTrackForGoal(goalType);
  return Array.from({ length: 50 }, (_, index) => {
    const lessonId = `a1-${String(index + 1).padStart(3, '0')}`;
    const payload = inferLessonContent(lessonId);
    return {
      lessonId,
      lessonTitle: payload.lesson.lessonTitle,
      lessonType: payload.lesson.lessonType,
      estMinutes: payload.lesson.estMinutes,
      unitId: payload.lesson.unitId,
      unitTitle: payload.lesson.unitTitle,
      unitNumber: getUnitNumberForLesson(index + 1),
      cefrLevel: payload.lesson.cefrLevel,
      trackCode: track.trackCode,
      trackName: track.trackName,
      languageCode: payload.lesson.languageCode,
      qaStatus: payload.lesson.qaStatus,
      objective: payload.body.objective,
    };
  });
}

const PRACTICE_EXERCISES = [
  {
    id: 'practice-pronunciation-1',
    title: 'Pronunciation Practice',
    arabicTitle: 'تدريب النطق',
    description: 'Practice English pronunciation with AI feedback',
    arabicDescription: 'تدرّب على النطق الإنجليزي مع ملاحظات ذكية تساعدك على التحسن.',
    type: 'pronunciation',
    difficulty: 'intermediate',
    duration: 15,
    category: 'Speaking',
  },
  {
    id: 'practice-listening-1',
    title: 'Listening Comprehension',
    arabicTitle: 'فهم الاستماع',
    description: 'Test your listening skills with audio exercises',
    arabicDescription: 'اختبر مهارة الاستماع عبر مقاطع صوتية قصيرة وأسئلة ممتعة.',
    type: 'listening',
    difficulty: 'beginner',
    duration: 20,
    category: 'Listening',
  },
  {
    id: 'practice-speaking-1',
    title: 'Speaking Practice',
    arabicTitle: 'تدريب المحادثة',
    description: 'Practice speaking with conversation scenarios',
    arabicDescription: 'تحدّث في مواقف يومية قصيرة لتقوية الثقة والطلاقة.',
    type: 'speaking',
    difficulty: 'advanced',
    duration: 25,
    category: 'Speaking',
  },
  {
    id: 'practice-grammar-1',
    title: 'Grammar Exercises',
    arabicTitle: 'تمارين القواعد',
    description: 'Improve grammar with interactive exercises',
    arabicDescription: 'تعلم القواعد من خلال تدريبات بسيطة وتغذية راجعة سريعة.',
    type: 'grammar',
    difficulty: 'intermediate',
    duration: 30,
    category: 'Grammar',
  },
  {
    id: 'practice-vocabulary-1',
    title: 'Vocabulary Builder',
    arabicTitle: 'مفردات جديدة',
    description: 'Expand your vocabulary with word games',
    arabicDescription: 'زد حصيلتك اللغوية بألعاب كلمات وأمثلة سهلة الحفظ.',
    type: 'vocabulary',
    difficulty: 'beginner',
    duration: 18,
    category: 'Vocabulary',
  },
];

const READING_QUESTS = [
  {
    id: 'quest-1',
    title: 'The Magic Forest',
    titleAr: 'الغابة السحرية',
    image: '🌲',
    paragraphs: [
      {
        text: 'Once upon a time, there was a small boy named Ali. He lived near a big, dark forest. Everyone said the forest was magic. Ali wanted to see the magic.',
        dictionary: {
          Once: 'في قديم الزمان',
          time: 'وقت',
          small: 'صغير',
          boy: 'ولد',
          named: 'اسمه',
          lived: 'عاش',
          near: 'بالقرب من',
          big: 'كبير',
          dark: 'مظلم',
          forest: 'غابة',
          Everyone: 'الجميع',
          said: 'قال',
          magic: 'سحر',
          wanted: 'أراد',
          see: 'يرى',
        },
        quiz: {
          question: 'Where did Ali live?',
          options: ['Near a big forest', 'In a city', 'On a mountain', 'Under the sea'],
          correctIndex: 0,
        },
      },
      {
        text: 'One day, Ali walked into the forest. He saw a blue bird. The bird talked to him! Hello, Ali, said the bird. Ali was very surprised.',
        dictionary: {
          One: 'واحد',
          day: 'يوم',
          walked: 'مشى',
          into: 'إلى داخل',
          saw: 'رأى',
          blue: 'أزرق',
          bird: 'طائر',
          talked: 'تحدث',
          Hello: 'مرحبًا',
          very: 'جدًا',
          surprised: 'متفاجئ',
        },
        quiz: {
          question: 'What color was the bird?',
          options: ['Red', 'Blue', 'Yellow', 'Green'],
          correctIndex: 1,
        },
      },
    ],
  },
];

function mergeSettings(user, progressRow, savedSettings) {
  const parsed = savedSettings ? parseJSON(savedSettings, {}) : {};
  return {
    profile: {
      name: user?.displayName || 'Learner',
      email: user?.email || '',
      avatar: '/avatars/user.jpg',
      level: progressRow?.level || 1,
      xp: (progressRow?.stars || 0) * 10,
      language: parsed?.profile?.language || parsed?.appearance?.language || DEFAULT_USER_SETTINGS.appearance.language,
    },
    notifications: { ...DEFAULT_USER_SETTINGS.notifications, ...(parsed.notifications || {}) },
    audio: { ...DEFAULT_USER_SETTINGS.audio, ...(parsed.audio || {}) },
    video: { ...DEFAULT_USER_SETTINGS.video, ...(parsed.video || {}) },
    appearance: { ...DEFAULT_USER_SETTINGS.appearance, ...(parsed.appearance || {}) },
    privacy: { ...DEFAULT_USER_SETTINGS.privacy, ...(parsed.privacy || {}) },
    performance: { ...DEFAULT_USER_SETTINGS.performance, ...(parsed.performance || {}) },
  };
}

function deriveLeagueFromXp(xp) {
  if (xp >= 6000) return 'Gold';
  if (xp >= 3000) return 'Silver';
  return 'Bronze';
}

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
  const track = resolveTrackForGoal(goalType);
  const catalog = buildLessonCatalog(goalType);
  res.json({
    userId: req.userId,
    languageCode,
    goalType,
    cefr: mockCefr,
    recommendedTrackCodes: [track.trackCode],
    lessons: catalog.map((lesson) => ({
      track_code: lesson.trackCode,
      track_name: lesson.trackName,
      unit_title: lesson.unitTitle,
      lesson_id: lesson.lessonId,
      lesson_title: lesson.lessonTitle,
      lesson_type: lesson.lessonType,
      est_minutes: lesson.estMinutes,
    })),
  });
});

app.get('/api/v1/lessons/catalog', authMiddleware, (req, res) => {
  const goalType = String(req.query.goalType || 'daily');
  res.json({
    lessons: buildLessonCatalog(goalType),
  });
});

app.get('/api/v1/lessons/:lessonId/content', authMiddleware, (req, res) => {
  const lessonId = String(req.params.lessonId);
  res.json(inferLessonContent(lessonId));
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
// Settings / practice / leaderboard / reading quests
// ---------------------------------------------------------------------------
app.get('/api/v1/settings', authMiddleware, async (req, res) => {
  try {
    const [user, progressRow, savedSettings] = await Promise.all([
      dbGet(`SELECT id, email, displayName FROM users WHERE id = ?`, [req.userId]),
      dbGet(`SELECT stars, level FROM progress WHERE userId = ?`, [req.userId]),
      dbGet(`SELECT settingsJson FROM user_settings WHERE userId = ?`, [req.userId]),
    ]);

    res.json({
      settings: mergeSettings(user, progressRow, savedSettings?.settingsJson),
      updatedAt: savedSettings?.updatedAt || null,
    });
  } catch {
    res.status(500).json({ error: 'DB_ERROR' });
  }
});

app.put('/api/v1/settings', authMiddleware, async (req, res) => {
  const incoming = req.body?.settings || req.body || {};
  const nextName = String(incoming?.profile?.name || '').trim() || 'Learner';
  const nextEmail = String(incoming?.profile?.email || '').trim().toLowerCase();

  try {
    const currentUser = await dbGet(`SELECT id, email FROM users WHERE id = ?`, [req.userId]);
    if (!currentUser) return res.status(404).json({ error: 'USER_NOT_FOUND' });

    if (nextEmail && nextEmail !== currentUser.email) {
      const existing = await dbGet(`SELECT id FROM users WHERE email = ? AND id != ?`, [nextEmail, req.userId]);
      if (existing) return res.status(409).json({ error: 'EMAIL_EXISTS' });
    }

    await dbRun(`UPDATE users SET displayName = ?, email = ? WHERE id = ?`, [
      nextName,
      nextEmail || currentUser.email,
      req.userId,
    ]);

    const progressRow = await dbGet(`SELECT stars, level FROM progress WHERE userId = ?`, [req.userId]);
    const merged = mergeSettings(
      { id: req.userId, email: nextEmail || currentUser.email, displayName: nextName },
      progressRow,
      JSON.stringify(incoming),
    );

    const updatedAt = nowIso();
    await dbRun(
      `INSERT INTO user_settings (userId, settingsJson, updatedAt)
       VALUES (?, ?, ?)
       ON CONFLICT(userId) DO UPDATE SET
         settingsJson = excluded.settingsJson,
         updatedAt = excluded.updatedAt`,
      [req.userId, JSON.stringify(merged), updatedAt]
    );

    res.json({ ok: true, settings: merged, updatedAt });
  } catch {
    res.status(500).json({ error: 'DB_ERROR' });
  }
});

app.get('/api/v1/practice/catalog', authMiddleware, async (req, res) => {
  try {
    const rows = await dbAll(`SELECT * FROM practice_progress WHERE userId = ?`, [req.userId]);
    const progressMap = new Map(rows.map((row) => [row.exerciseId, row]));
    const exercises = PRACTICE_EXERCISES.map((exercise) => {
      const row = progressMap.get(exercise.id);
      return {
        ...exercise,
        completed: Boolean(row?.completed),
        score: row?.score || 0,
        bestScore: row?.bestScore || 0,
        attempts: row?.attempts || 0,
      };
    });
    res.json({ exercises, updatedAt: nowIso() });
  } catch {
    res.status(500).json({ error: 'DB_ERROR' });
  }
});

app.post('/api/v1/practice/exercises/:exerciseId/complete', authMiddleware, async (req, res) => {
  const exerciseId = String(req.params.exerciseId);
  const score = Math.max(0, Math.min(100, Number(req.body?.score || 0)));
  const completed = req.body?.completed ? 1 : 0;
  const exercise = PRACTICE_EXERCISES.find((item) => item.id === exerciseId);
  if (!exercise) return res.status(404).json({ error: 'EXERCISE_NOT_FOUND' });

  try {
    const current = await dbGet(
      `SELECT attempts, bestScore FROM practice_progress WHERE userId = ? AND exerciseId = ?`,
      [req.userId, exerciseId]
    );
    const attempts = Number(current?.attempts || 0) + 1;
    const bestScore = Math.max(Number(current?.bestScore || 0), score);
    const updatedAt = nowIso();

    await dbRun(
      `INSERT INTO practice_progress (userId, exerciseId, attempts, completed, score, bestScore, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(userId, exerciseId) DO UPDATE SET
         attempts = excluded.attempts,
         completed = excluded.completed,
         score = excluded.score,
         bestScore = excluded.bestScore,
         updatedAt = excluded.updatedAt`,
      [req.userId, exerciseId, attempts, completed, score, bestScore, updatedAt]
    );

    res.json({
      ok: true,
      exercise: {
        ...exercise,
        completed: Boolean(completed),
        score,
        bestScore,
        attempts,
      },
    });
  } catch {
    res.status(500).json({ error: 'DB_ERROR' });
  }
});

app.get('/api/v1/leaderboard', authMiddleware, async (req, res) => {
  const requestedLeague = String(req.query.league || '').trim();
  try {
    const [rows, currentUser] = await Promise.all([
      dbAll(
        `SELECT users.id, users.displayName, users.email, COALESCE(progress.stars, 0) AS stars
         FROM users
         LEFT JOIN progress ON progress.userId = users.id`
      ),
      dbGet(
        `SELECT users.id, users.displayName, users.email, COALESCE(progress.stars, 0) AS stars
         FROM users
         LEFT JOIN progress ON progress.userId = users.id
         WHERE users.id = ?`,
        [req.userId]
      ),
    ]);

    const mapped = rows.map((row) => {
      const xp = Number(row.stars || 0) * 10;
      return {
        id: row.id,
        name: row.displayName || row.email || 'Learner',
        xp,
        streak: Math.max(1, Math.floor(xp / 500) + 1),
        league: deriveLeagueFromXp(xp),
        isCurrentUser: row.id === req.userId,
      };
    });

    const effectiveLeague = requestedLeague || deriveLeagueFromXp(Number(currentUser?.stars || 0) * 10);
    let entries = mapped.filter((entry) => entry.league === effectiveLeague);
    if (entries.length === 0 && mapped.length > 0) {
      entries = mapped;
    }

    entries = entries
      .sort((a, b) => b.xp - a.xp)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    const currentEntry = entries.find((entry) => entry.isCurrentUser)
      || mapped.find((entry) => entry.isCurrentUser)
      || null;

    res.json({
      league: effectiveLeague,
      entries,
      currentUser: currentEntry,
      generatedAt: nowIso(),
    });
  } catch {
    res.status(500).json({ error: 'DB_ERROR' });
  }
});

app.get('/api/v1/reading-quests', authMiddleware, async (req, res) => {
  try {
    const rows = await dbAll(`SELECT * FROM reading_quest_progress WHERE userId = ?`, [req.userId]);
    const progressMap = new Map(rows.map((row) => [row.questId, row]));
    const quests = READING_QUESTS.map((quest) => ({
      id: quest.id,
      title: quest.title,
      titleAr: quest.titleAr,
      image: quest.image,
      paragraphCount: quest.paragraphs.length,
      completed: Boolean(progressMap.get(quest.id)?.completed),
      bestScore: Number(progressMap.get(quest.id)?.bestScore || 0),
    }));
    res.json({ quests });
  } catch {
    res.status(500).json({ error: 'DB_ERROR' });
  }
});

app.get('/api/v1/reading-quests/:questId', authMiddleware, async (req, res) => {
  const questId = String(req.params.questId);
  const quest = READING_QUESTS.find((item) => item.id === questId);
  if (!quest) return res.status(404).json({ error: 'QUEST_NOT_FOUND' });

  try {
    const row = await dbGet(
      `SELECT completed, bestScore, completedAt FROM reading_quest_progress WHERE userId = ? AND questId = ?`,
      [req.userId, questId]
    );
    res.json({
      quest,
      progress: {
        completed: Boolean(row?.completed),
        bestScore: Number(row?.bestScore || 0),
        completedAt: row?.completedAt || null,
      },
    });
  } catch {
    res.status(500).json({ error: 'DB_ERROR' });
  }
});

app.post('/api/v1/reading-quests/:questId/complete', authMiddleware, async (req, res) => {
  const questId = String(req.params.questId);
  const quest = READING_QUESTS.find((item) => item.id === questId);
  if (!quest) return res.status(404).json({ error: 'QUEST_NOT_FOUND' });
  const bestScore = Math.max(0, Math.min(100, Number(req.body?.bestScore || 100)));
  const completedAt = nowIso();

  try {
    await dbRun(
      `INSERT INTO reading_quest_progress (userId, questId, completed, bestScore, completedAt)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(userId, questId) DO UPDATE SET
         completed = excluded.completed,
         bestScore = CASE
           WHEN reading_quest_progress.bestScore > excluded.bestScore THEN reading_quest_progress.bestScore
           ELSE excluded.bestScore
         END,
         completedAt = excluded.completedAt`,
      [req.userId, questId, 1, bestScore, completedAt]
    );
    res.json({ ok: true, completedAt, bestScore });
  } catch {
    res.status(500).json({ error: 'DB_ERROR' });
  }
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
  res.json({ status: 'healthy', ts: nowIso(), version: 'v1', ai: aiRuntimeStatus(), voice: voiceRuntimeStatus() });
});

// ---------------------------------------------------------------------------
// Realtime voice placeholder (Socket.IO)
// ---------------------------------------------------------------------------
const voiceUsage = new Map(); // userId -> { start: number, count: number }
const emitVoiceError = (socket, code, message, extra = {}) => {
  socket.emit('voice:error', { code, message, ...extra, ts: Date.now() });
};

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
    const usage = voiceUsage.get(socket.userId) || { start: Date.now(), count: 0 };
    socket.emit('voice:status', {
      ...voiceRuntimeStatus(),
      joined: true,
      roomId: safeRoom,
      usageCount: usage.count,
      remainingFrames: Math.max(0, MAX_FRAMES_PER_MIN - usage.count),
      busy: false,
    });
    socket.to(safeRoom).emit('voice:peer-joined', { peerId: socket.id, userId: socket.userId });
  });

  socket.on('voice:leave', (roomId) => {
    const safeRoom = roomId || `room-${socket.userId || 'anon'}`;
    socket.leave(safeRoom);
    socket.emit('voice:status', { ...voiceRuntimeStatus(), joined: false, roomId: safeRoom, busy: false });
  });

  socket.on('voice:ping', (payload) => {
    socket.emit('voice:pong', { ts: payload?.ts || Date.now() });
  });

  // Placeholder for audio frames (expect base64 or ArrayBuffer)
  socket.on('voice:frame', ({ roomId, frame }) => {
    if (!socket.userId) return;
    const safeRoom = roomId || `room-${socket.userId}`;
    if (typeof frame !== 'string' || frame.length === 0) {
      emitVoiceError(socket, 'INVALID_FRAME', 'Voice frame payload is empty.');
      return;
    }

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
      emitVoiceError(socket, 'VOICE_RATE_LIMIT', 'Voice frame limit reached for this minute.', { resetInMs });
      return;
    }

    const estimatedBytes = Math.ceil((frame.length * 3) / 4);
    if (estimatedBytes > MAX_VOICE_FRAME_BYTES) {
      emitVoiceError(socket, 'VOICE_FRAME_TOO_LARGE', 'Voice frame is too large for processing.', {
        estimatedBytes,
        maxFrameBytes: MAX_VOICE_FRAME_BYTES,
      });
      return;
    }

    // Broadcast raw frame to other peers (for future decoding)
    socket.to(safeRoom).emit('voice:frame', { peerId: socket.id, frame });

    // STT/TTS integration (best-effort, throttled per socket)
    if (!openai) {
      const transcript = 'I heard your voice... (mock STT - set OPENAI_API_KEY for real transcription)';
      socket.emit('voice:status', {
        ...voiceRuntimeStatus(),
        joined: true,
        roomId: safeRoom,
        usageCount: usage.count,
        remainingFrames: Math.max(0, MAX_FRAMES_PER_MIN - usage.count),
        busy: false,
      });
      io.to(safeRoom).emit('voice:transcript', {
        peerId: socket.id,
        text: transcript,
        ts: Date.now(),
      });
      return;
    }

    // Avoid overlap per socket
    if (socket.sttInFlight) {
      socket.emit('voice:status', { ...voiceRuntimeStatus(), joined: true, roomId: safeRoom, busy: true });
      return;
    }
    socket.sttInFlight = true;

    let buf;
    try {
      buf = Buffer.from(frame, 'base64');
    } catch {
      emitVoiceError(socket, 'VOICE_FRAME_DECODE_FAILED', 'Voice frame could not be decoded.');
      socket.sttInFlight = false;
      return;
    }
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
      emitVoiceError(socket, 'VOICE_UPSTREAM_FAILED', 'Realtime voice service is temporarily unavailable.', {
        detail: String(e.message || 'unknown'),
      });
    }).finally(() => {
      socket.sttInFlight = false;
      socket.emit('voice:status', {
        ...voiceRuntimeStatus(),
        joined: true,
        roomId: safeRoom,
        usageCount: usage.count,
        remainingFrames: Math.max(0, MAX_FRAMES_PER_MIN - usage.count),
        busy: false,
      });
    });
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected', socket.id);
    if (socket.userId) {
      voiceUsage.delete(socket.userId);
    }
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
