import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "ai-english-master";
const CONFIG_PATH =
  process.env.FIREBASE_TOOLS_CONFIG ||
  join(homedir(), ".config", "configstore", "firebase-tools.json");

const LESSON_TYPE_SEQUENCE = ["vocabulary", "listening", "conversation", "grammar", "reading"];
const LESSON_TYPE_META = {
  vocabulary: { title: "Core Vocabulary", duration: 12, xpBoost: 0 },
  listening: { title: "Listening in Context", duration: 14, xpBoost: 5 },
  conversation: { title: "Guided Conversation", duration: 15, xpBoost: 8 },
  grammar: { title: "Grammar in Use", duration: 14, xpBoost: 6 },
  reading: { title: "Reading and Response", duration: 16, xpBoost: 10 }
};
const LEVEL_META = {
  A1: { difficulty: "beginner", xpBase: 45 },
  A2: { difficulty: "beginner", xpBase: 55 },
  B1: { difficulty: "intermediate", xpBase: 70 },
  B2: { difficulty: "intermediate", xpBase: 85 },
  C1: { difficulty: "advanced", xpBase: 100 },
  C2: { difficulty: "advanced", xpBase: 115 }
};

const TRACK_BLUEPRINTS = [
  {
    code: "general",
    name: "General Communication",
    scenario: "daily",
    units: [
      { level: "A1", title: "Introductions and Daily Routines", focus: "personal introductions and routines" },
      { level: "A2", title: "Daily Tasks and Appointments", focus: "daily planning and simple appointments" },
      { level: "B1", title: "Community and Public Services", focus: "community issues and public service requests" },
      { level: "B2", title: "Problem Solving in Real Life", focus: "practical problem solving and negotiation" },
      { level: "C1", title: "Persuasive Everyday Communication", focus: "persuasion with evidence and nuance" },
      { level: "C2", title: "High-Precision Expression", focus: "precise, concise and strategic communication" }
    ],
    keywordBank: [
      "introduce", "routine", "schedule", "habit", "weekday",
      "appointment", "confirm", "reschedule", "location", "available",
      "community", "service", "request", "approval", "process",
      "priority", "option", "solution", "constraint", "timeline",
      "argument", "evidence", "counterpoint", "impact", "outcome",
      "precision", "register", "nuance", "clarity", "coherence"
    ]
  },
  {
    code: "travel",
    name: "Travel and Mobility",
    scenario: "travel",
    units: [
      { level: "A1", title: "Airport Check-in Basics", focus: "airport check-in and boarding flow" },
      { level: "A2", title: "Hotel Requests and Complaints", focus: "hotel requests and issue resolution" },
      { level: "B1", title: "Transport Disruptions", focus: "delays, rerouting, and rebooking conversations" },
      { level: "B2", title: "Complex Travel Coordination", focus: "multi-city plans and constraints" },
      { level: "C1", title: "Travel Risk Management", focus: "high-stakes travel incidents and escalation" },
      { level: "C2", title: "Executive Travel Negotiation", focus: "strategic negotiation in travel operations" }
    ],
    keywordBank: [
      "passport", "boarding", "gate", "baggage", "security",
      "reservation", "amenities", "checkout", "upgrade", "complaint",
      "delay", "reroute", "voucher", "refund", "connection",
      "itinerary", "transfer", "constraint", "alternative", "capacity",
      "incident", "escalation", "consulate", "documentation", "compliance",
      "concession", "nonstop", "allocation", "contingency", "resolution"
    ]
  },
  {
    code: "business",
    name: "Professional English",
    scenario: "work",
    units: [
      { level: "A1", title: "Simple Workplace Interactions", focus: "basic workplace greetings and updates" },
      { level: "A2", title: "Task Updates and Messaging", focus: "task updates and clear messaging" },
      { level: "B1", title: "Meetings and Action Items", focus: "meeting participation and action tracking" },
      { level: "B2", title: "Interview and Performance Narratives", focus: "interview stories and impact narratives" },
      { level: "C1", title: "Stakeholder Alignment", focus: "alignment across teams and priorities" },
      { level: "C2", title: "Executive Briefings and Negotiation", focus: "high-level briefings and deal negotiation" }
    ],
    keywordBank: [
      "colleague", "update", "deadline", "task", "manager",
      "followup", "blocker", "priority", "deliverable", "status",
      "agenda", "minutes", "owner", "risk", "milestone",
      "challenge", "impact", "stakeholder", "metric", "outcome",
      "alignment", "roadmap", "dependency", "governance", "escalation",
      "negotiation", "tradeoff", "commitment", "baseline", "approval"
    ]
  },
  {
    code: "migration",
    name: "Migration and Public Life",
    scenario: "migration",
    units: [
      { level: "A1", title: "First Week Essentials", focus: "basic survival tasks in a new city" },
      { level: "A2", title: "Housing and Utilities", focus: "rent, bills, and maintenance requests" },
      { level: "B1", title: "Healthcare and Appointments", focus: "clinic calls and healthcare logistics" },
      { level: "B2", title: "School and Family Services", focus: "education and family service procedures" },
      { level: "C1", title: "Legal and Administrative Communication", focus: "formal legal and administrative language" },
      { level: "C2", title: "Policy and Civic Participation", focus: "policy discussions and civic participation" }
    ],
    keywordBank: [
      "address", "document", "office", "application", "form",
      "deposit", "contract", "utility", "invoice", "maintenance",
      "coverage", "referral", "appointment", "prescription", "insurance",
      "enrollment", "eligibility", "verification", "guardian", "assessment",
      "compliance", "regulation", "affidavit", "representation", "jurisdiction",
      "policy", "advocacy", "consultation", "amendment", "implementation"
    ]
  }
];

function toFirestoreValue(value) {
  if (value === null) {
    return { nullValue: null };
  }

  if (value instanceof Date) {
    return { timestampValue: value.toISOString() };
  }

  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map((item) => toFirestoreValue(item))
      }
    };
  }

  const valueType = typeof value;
  if (valueType === "string") {
    return { stringValue: value };
  }
  if (valueType === "boolean") {
    return { booleanValue: value };
  }
  if (valueType === "number") {
    if (Number.isInteger(value)) {
      return { integerValue: String(value) };
    }
    return { doubleValue: value };
  }
  if (valueType === "object") {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(value).map(([key, nestedValue]) => [key, toFirestoreValue(nestedValue)])
        )
      }
    };
  }

  throw new Error(`Unsupported Firestore value type: ${valueType}`);
}

function encodeDocPath(pathParts) {
  return pathParts.map((part) => encodeURIComponent(part)).join("/");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function toVocabularyEntry(word, focus) {
  return {
    word,
    meaningAr: `Keyword used in ${focus}.`,
    example: `Use "${word}" when discussing ${focus}.`
  };
}

function buildDialogue({ focus, lessonType, scenario, keywords }) {
  const [k1, k2] = keywords;
  return [
    { speaker: "Tutor", text: `Today we practice ${focus} in a ${scenario} context.` },
    { speaker: "Learner", text: `I want to communicate clearly using ${k1} and ${k2}.` },
    { speaker: "Tutor", text: `Great. Build a concise response and keep the tone appropriate.` }
  ];
}

function buildExercises({ lessonType, focus, keywords }) {
  const [k1, k2] = keywords;

  if (lessonType === "vocabulary") {
    return [
      {
        type: "fill_blank",
        prompt: `Complete the sentence with "${k1}" in a ${focus} situation.`,
        answer: k1
      },
      {
        type: "usage_task",
        prompt: `Write one practical sentence using "${k2}".`
      }
    ];
  }

  if (lessonType === "listening") {
    return [
      {
        type: "listening_check",
        prompt: `Identify the key action related to "${k1}" from the audio.`
      },
      {
        type: "note_task",
        prompt: `Take brief notes and include one sentence with "${k2}".`
      }
    ];
  }

  if (lessonType === "conversation") {
    return [
      {
        type: "roleplay",
        prompt: `Roleplay a short exchange about ${focus} using "${k1}".`
      },
      {
        type: "repair",
        prompt: `Rewrite an unclear line to make it polite and specific with "${k2}".`
      }
    ];
  }

  if (lessonType === "grammar") {
    return [
      {
        type: "rewrite",
        prompt: `Rewrite the sentence to improve structure in a ${focus} context.`
      },
      {
        type: "fill_blank",
        prompt: `Use "${k1}" correctly in a grammatically complete sentence.`
      }
    ];
  }

  return [
    {
      type: "summary",
      prompt: `Read the short text and summarize the main point about ${focus}.`
    },
    {
      type: "inference",
      prompt: `Infer the next action and include "${k2}" in your response.`
    }
  ];
}

function buildModelAnswers({ focus, lessonType, keywords }) {
  const [k1, k2] = keywords;
  return [
    `In this ${lessonType} lesson, I can explain ${focus} with ${k1}.`,
    `A clear response uses ${k2} with the right tone and context.`
  ];
}

function buildGrammarFocus(lessonType, level) {
  if (lessonType === "grammar") {
    if (level === "A1" || level === "A2") {
      return "Sentence order, core verb forms, and polite requests.";
    }
    if (level === "B1" || level === "B2") {
      return "Complex sentences, connectors, and conditionals in context.";
    }
    return "Nuanced register, precision, and advanced discourse control.";
  }

  return "Apply grammar in meaningful context with clarity and confidence.";
}

function buildCurriculum() {
  const lessons = {};
  const units = {};
  const learningPlans = {};
  let globalUnlockOrder = 1;

  for (const track of TRACK_BLUEPRINTS) {
    let previousLessonId = null;
    const unitRefs = [];
    const trackLessonIds = [];

    for (let unitIndex = 0; unitIndex < track.units.length; unitIndex += 1) {
      const unit = track.units[unitIndex];
      const unitOrder = unitIndex + 1;
      const unitId = `${track.code}_${unit.level.toLowerCase()}_u${pad2(unitOrder)}`;
      const unitSlug = slugify(unit.title);
      const levelMeta = LEVEL_META[unit.level];
      const keywordStart = unitIndex * 5;
      const unitKeywords = track.keywordBank.slice(keywordStart, keywordStart + 5);
      const lessonIds = [];

      for (let lessonIndex = 0; lessonIndex < LESSON_TYPE_SEQUENCE.length; lessonIndex += 1) {
        const lessonType = LESSON_TYPE_SEQUENCE[lessonIndex];
        const lessonOrder = lessonIndex + 1;
        const lessonMeta = LESSON_TYPE_META[lessonType];
        const lessonId = `${track.code}_${unit.level.toLowerCase()}_${unitSlug}_l${lessonOrder}`;
        const lessonKeywords = [
          unitKeywords[lessonIndex % unitKeywords.length],
          unitKeywords[(lessonIndex + 1) % unitKeywords.length],
          unitKeywords[(lessonIndex + 2) % unitKeywords.length]
        ];
        const vocabulary = lessonKeywords.map((word) => toVocabularyEntry(word, unit.focus));

        lessons[lessonId] = {
          title: `${unit.title}: ${lessonMeta.title}`,
          type: lessonType,
          level: unit.level,
          duration: lessonMeta.duration + (unitIndex % 2),
          content: `Practice ${unit.focus} through structured ${lessonType} tasks and real-world language use.`,
          xp: levelMeta.xpBase + lessonMeta.xpBoost,
          track: track.code,
          trackCode: track.code,
          trackName: track.name,
          difficulty: levelMeta.difficulty,
          scenario: track.scenario,
          unitId,
          unitTitle: unit.title,
          unitOrder,
          lessonOrder,
          unlockOrder: globalUnlockOrder,
          unlockOrderInTrack: trackLessonIds.length + 1,
          isLocked: previousLessonId !== null,
          prerequisites: previousLessonId ? [previousLessonId] : [],
          nextLessonId: null,
          vocabulary,
          dialogue: buildDialogue({
            focus: unit.focus,
            lessonType,
            scenario: track.scenario,
            keywords: lessonKeywords
          }),
          exercises: buildExercises({
            lessonType,
            focus: unit.focus,
            keywords: lessonKeywords
          }),
          modelAnswers: buildModelAnswers({
            focus: unit.focus,
            lessonType,
            keywords: lessonKeywords
          }),
          grammarFocus: buildGrammarFocus(lessonType, unit.level),
          teacherNotesAr: `Coach the learner to apply ${unit.focus} with concise and natural phrasing.`,
          estimatedOutcomeAr: `Learner can handle ${unit.focus} confidently in a ${track.scenario} setting.`,
          updatedAt: new Date()
        };

        if (previousLessonId) {
          lessons[previousLessonId].nextLessonId = lessonId;
        }

        previousLessonId = lessonId;
        lessonIds.push(lessonId);
        trackLessonIds.push(lessonId);
        globalUnlockOrder += 1;
      }

      units[unitId] = {
        unitId,
        trackCode: track.code,
        trackName: track.name,
        level: unit.level,
        unitTitle: unit.title,
        focus: unit.focus,
        scenario: track.scenario,
        unitOrder,
        lessonCount: lessonIds.length,
        lessonIds,
        firstLessonId: lessonIds[0],
        lastLessonId: lessonIds[lessonIds.length - 1],
        updatedAt: new Date()
      };

      unitRefs.push({
        unitId,
        level: unit.level,
        unitTitle: unit.title,
        unitOrder,
        firstLessonId: lessonIds[0],
        lastLessonId: lessonIds[lessonIds.length - 1],
        lessonIds
      });
    }

    learningPlans[track.code] = {
      trackCode: track.code,
      trackName: track.name,
      scenario: track.scenario,
      totalUnits: unitRefs.length,
      totalLessons: trackLessonIds.length,
      units: unitRefs,
      lessonSequence: trackLessonIds,
      updatedAt: new Date()
    };
  }

  learningPlans.master = {
    planVersion: "2026.02.27",
    totalTracks: TRACK_BLUEPRINTS.length,
    totalUnits: Object.keys(units).length,
    totalLessons: Object.keys(lessons).length,
    tracks: TRACK_BLUEPRINTS.map((track) => ({
      trackCode: track.code,
      trackName: track.name
    })),
    updatedAt: new Date()
  };

  return { lessons, units, learningPlans };
}

async function loadFirebaseAccessToken() {
  const raw = await readFile(CONFIG_PATH, "utf8");
  const parsed = JSON.parse(raw);
  const accessToken = parsed?.tokens?.access_token;
  const expiresAt = parsed?.tokens?.expires_at || 0;

  if (!accessToken) {
    throw new Error("No Firebase access token found. Run `npx firebase-tools login` first.");
  }

  if (Date.now() > expiresAt - 60_000) {
    throw new Error(
      "Firebase access token is expired. Run `npx firebase-tools projects:list` to refresh your session."
    );
  }

  return accessToken;
}

async function firestoreRequest(accessToken, method, path, body) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${path}`;
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Firestore request failed (${response.status}): ${text}`);
  }

  return response.json();
}

async function setDoc(accessToken, collectionName, docId, payload) {
  const path = encodeDocPath([collectionName, docId]);
  const body = {
    fields: Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [key, toFirestoreValue(value)])
    )
  };

  await firestoreRequest(accessToken, "PATCH", path, body);
}

async function countCollectionDocs(accessToken, collectionName) {
  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: collectionName }],
          select: { fields: [{ fieldPath: "__name__" }] },
          limit: 5000
        }
      })
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to count collection ${collectionName}: ${text}`);
  }

  const rows = await response.json();
  return rows.filter((item) => item.document).length;
}

const achievements = {
  first_lesson: {
    name: "First Lesson",
    description: "Complete your first lesson.",
    xp: 50,
    reward: "Unlock next content",
    icon: "graduation_cap",
    category: "milestone",
    isUnlocked: false
  },
  week_streak: {
    name: "Week Streak",
    description: "Study for 7 consecutive days.",
    xp: 100,
    reward: "Streak badge",
    icon: "fire",
    category: "streak",
    isUnlocked: false
  },
  month_streak: {
    name: "Month Streak",
    description: "Study for 30 consecutive days.",
    xp: 300,
    reward: "Legend badge",
    icon: "trophy",
    category: "streak",
    isUnlocked: false
  },
  xp_100: {
    name: "XP 100",
    description: "Reach 100 XP.",
    xp: 25,
    reward: "Starter badge",
    icon: "bolt",
    category: "xp",
    isUnlocked: false
  },
  xp_500: {
    name: "XP 500",
    description: "Reach 500 XP.",
    xp: 50,
    reward: "Intermediate badge",
    icon: "bolt",
    category: "xp",
    isUnlocked: false
  },
  xp_1000: {
    name: "XP 1000",
    description: "Reach 1000 XP.",
    xp: 100,
    reward: "Master badge",
    icon: "diamond",
    category: "xp",
    isUnlocked: false
  },
  level_a2: {
    name: "Level A2",
    description: "Reach CEFR level A2.",
    xp: 30,
    reward: "Level badge",
    icon: "level_up",
    category: "level",
    isUnlocked: false
  },
  level_b1: {
    name: "Level B1",
    description: "Reach CEFR level B1.",
    xp: 50,
    reward: "Level badge",
    icon: "level_up",
    category: "level",
    isUnlocked: false
  },
  level_b2: {
    name: "Level B2",
    description: "Reach CEFR level B2.",
    xp: 75,
    reward: "Level badge",
    icon: "level_up",
    category: "level",
    isUnlocked: false
  },
  level_c1: {
    name: "Level C1",
    description: "Reach CEFR level C1.",
    xp: 100,
    reward: "Advanced badge",
    icon: "level_up",
    category: "level",
    isUnlocked: false
  },
  level_c2: {
    name: "Level C2",
    description: "Reach CEFR level C2.",
    xp: 150,
    reward: "Elite badge",
    icon: "crown",
    category: "level",
    isUnlocked: false
  }
};

const demoUser = {
  uid: "demo-user",
  email: "demo@ai-english-master.app",
  displayName: "Demo User",
  level: "A1",
  xp: 0,
  streak: 0,
  goal: "general",
  track: "general",
  joinedDate: new Date(),
  lastActive: new Date()
};

const demoUserProgress = {
  userId: "demo-user",
  currentLevel: "A1",
  totalXP: 0,
  streak: 0,
  lessonsCompleted: 0,
  averageScore: 0,
  timeSpent: 0,
  lastStudyDate: new Date(),
  achievements: []
};

async function seedCollection(accessToken, collectionName, docs) {
  const entries = Object.entries(docs);
  for (const [docId, docPayload] of entries) {
    await setDoc(accessToken, collectionName, docId, docPayload);
  }
}

async function main() {
  const accessToken = await loadFirebaseAccessToken();
  const curriculum = buildCurriculum();

  console.log(`Seeding Firestore for project: ${PROJECT_ID}`);
  await seedCollection(accessToken, "lessons", curriculum.lessons);
  await seedCollection(accessToken, "units", curriculum.units);
  await seedCollection(accessToken, "learningPlans", curriculum.learningPlans);
  await seedCollection(accessToken, "achievements", achievements);
  await seedCollection(accessToken, "users", { "demo-user": demoUser });
  await seedCollection(accessToken, "userProgress", { "demo-user": demoUserProgress });

  const counts = {
    lessons: await countCollectionDocs(accessToken, "lessons"),
    units: await countCollectionDocs(accessToken, "units"),
    learningPlans: await countCollectionDocs(accessToken, "learningPlans"),
    achievements: await countCollectionDocs(accessToken, "achievements"),
    users: await countCollectionDocs(accessToken, "users"),
    userProgress: await countCollectionDocs(accessToken, "userProgress"),
    progress: await countCollectionDocs(accessToken, "progress")
  };

  console.log("Firestore seed completed.");
  console.log(JSON.stringify(counts, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
