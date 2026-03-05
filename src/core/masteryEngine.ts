import type { A1Lesson } from './a1Content';

export type MasterySkill = A1Lesson['category'];

export interface RemediationPlan {
  id: string;
  skill: MasterySkill;
  title: string;
  reason: string;
  aiScenario: 'daily' | 'travel' | 'work' | 'migration';
  aiPrompt: string;
  triggeredByLessonId: string;
  createdAt: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface MasteryLevelDef {
  level: number;
  name: string;
  description: string;
  minScore: number;
}

export const MASTERY_LEVELS: MasteryLevelDef[] = [
  { level: 0, name: 'Not Started', description: 'No practice', minScore: 0 },
  { level: 10, name: 'Beginner', description: 'Basic understanding', minScore: 40 },
  { level: 25, name: 'Developing', description: 'Growing competence', minScore: 60 },
  { level: 50, name: 'Proficient', description: 'Good understanding', minScore: 70 },
  { level: 75, name: 'Advanced', description: 'Excellent understanding', minScore: 85 },
  { level: 90, name: 'Expert', description: 'Mastery with teaching capabilities', minScore: 95 },
];

export function getMasteryLevelDetails(score: number): MasteryLevelDef {
  let matched = MASTERY_LEVELS[0];
  for (const level of MASTERY_LEVELS) {
    if (score >= level.minScore) {
      matched = level;
    }
  }
  return matched;
}

export interface MasteryState {
  lessonMastery: Record<string, number>;
  lessonAttempts: Record<string, number>;
  skillMastery: Record<MasterySkill, number>;
  weakSkillStreak: Record<MasterySkill, number>;
  remediationPlans: RemediationPlan[];
  updatedAt: string;
}

export interface LessonAttemptInput {
  lessonId: string;
  lessonCategory: MasterySkill;
  totalExercises: number;
  correctExercises: number;
  weakSkills: MasterySkill[];
}

export interface UnitRoadmapEntry {
  unit: number;
  total: number;
  unlocked: number;
  mastered: number;
}

const STORAGE_KEY = 'lisan_mastery_state_v1';
const UPDATE_EVENT = 'lisan:mastery-updated';
const MASTERY_THRESHOLD = 70;

const skillDefaults: Record<MasterySkill, number> = {
  vocabulary: 45,
  grammar: 45,
  reading: 45,
  listening: 45,
  speaking: 45,
};

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function nowIso() {
  return new Date().toISOString();
}

function uid(prefix: string) {
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${randomPart}_${Date.now()}`;
}

function createDefaultState(): MasteryState {
  return {
    lessonMastery: {},
    lessonAttempts: {},
    skillMastery: { ...skillDefaults },
    weakSkillStreak: {
      vocabulary: 0,
      grammar: 0,
      reading: 0,
      listening: 0,
      speaking: 0,
    },
    remediationPlans: [],
    updatedAt: nowIso(),
  };
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function sanitizeLoadedState(raw: Partial<MasteryState>): MasteryState {
  const defaults = createDefaultState();
  return {
    lessonMastery: { ...defaults.lessonMastery, ...(raw.lessonMastery || {}) },
    lessonAttempts: { ...defaults.lessonAttempts, ...(raw.lessonAttempts || {}) },
    skillMastery: {
      vocabulary: clamp(Number(raw.skillMastery?.vocabulary ?? defaults.skillMastery.vocabulary)),
      grammar: clamp(Number(raw.skillMastery?.grammar ?? defaults.skillMastery.grammar)),
      reading: clamp(Number(raw.skillMastery?.reading ?? defaults.skillMastery.reading)),
      listening: clamp(Number(raw.skillMastery?.listening ?? defaults.skillMastery.listening)),
      speaking: clamp(Number(raw.skillMastery?.speaking ?? defaults.skillMastery.speaking)),
    },
    weakSkillStreak: {
      vocabulary: Math.max(0, Number(raw.weakSkillStreak?.vocabulary ?? defaults.weakSkillStreak.vocabulary)),
      grammar: Math.max(0, Number(raw.weakSkillStreak?.grammar ?? defaults.weakSkillStreak.grammar)),
      reading: Math.max(0, Number(raw.weakSkillStreak?.reading ?? defaults.weakSkillStreak.reading)),
      listening: Math.max(0, Number(raw.weakSkillStreak?.listening ?? defaults.weakSkillStreak.listening)),
      speaking: Math.max(0, Number(raw.weakSkillStreak?.speaking ?? defaults.weakSkillStreak.speaking)),
    },
    remediationPlans: Array.isArray(raw.remediationPlans) ? raw.remediationPlans : [],
    updatedAt: raw.updatedAt || defaults.updatedAt,
  };
}

export function getMasteryState(): MasteryState {
  if (!isBrowser()) {
    return createDefaultState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultState();
    }
    return sanitizeLoadedState(JSON.parse(raw) as Partial<MasteryState>);
  } catch {
    return createDefaultState();
  }
}

function saveMasteryState(state: MasteryState) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function resetMasteryState() {
  const fresh = createDefaultState();
  saveMasteryState(fresh);
  return fresh;
}

export function subscribeToMasteryUpdates(onUpdate: () => void) {
  if (!isBrowser()) return () => undefined;
  window.addEventListener(UPDATE_EVENT, onUpdate);
  return () => window.removeEventListener(UPDATE_EVENT, onUpdate);
}

function remediationTemplate(skill: MasterySkill) {
  switch (skill) {
    case 'grammar':
      return {
        title: 'Grammar Recovery Sprint',
        reason: 'Repeated grammar mistakes detected.',
        aiScenario: 'daily' as const,
        aiPrompt: 'Please train me on beginner grammar errors with short Arabic explanations and mini exercises.',
      };
    case 'vocabulary':
      return {
        title: 'Vocabulary Recall Drill',
        reason: 'Weak word recall and usage pattern detected.',
        aiScenario: 'daily' as const,
        aiPrompt: 'Give me a 5-minute vocabulary drill with sentence completion and Arabic feedback.',
      };
    case 'reading':
      return {
        title: 'Reading Clarity Boost',
        reason: 'Reading comprehension confidence dropped.',
        aiScenario: 'work' as const,
        aiPrompt: 'Give me a short A1 reading text with 3 comprehension checks and instant corrections.',
      };
    case 'listening':
      return {
        title: 'Listening Focus Session',
        reason: 'Listening interpretation became unstable.',
        aiScenario: 'daily' as const,
        aiPrompt: 'Train me with short listening-like prompts and ask me to rewrite what I understood.',
      };
    case 'speaking':
      return {
        title: 'Speaking Confidence Builder',
        reason: 'Frequent speaking formulation errors detected.',
        aiScenario: 'travel' as const,
        aiPrompt: 'Act as speaking coach and fix my short spoken-style sentences with clear Arabic notes.',
      };
    default:
      return {
        title: 'Focused Skill Practice',
        reason: 'Skill needs reinforcement.',
        aiScenario: 'daily' as const,
        aiPrompt: 'Give me a focused micro-practice session with corrections in Arabic.',
      };
  }
}

function ensureRemediationPlan(state: MasteryState, skill: MasterySkill, lessonId: string) {
  const hasActiveForSkill = state.remediationPlans.some((p) => p.skill === skill && !p.resolved);
  if (hasActiveForSkill) {
    return;
  }

  const template = remediationTemplate(skill);
  state.remediationPlans.unshift({
    id: uid(`remed_${skill}`),
    skill,
    title: template.title,
    reason: template.reason,
    aiScenario: template.aiScenario,
    aiPrompt: template.aiPrompt,
    triggeredByLessonId: lessonId,
    createdAt: nowIso(),
    resolved: false,
  });
  state.remediationPlans = state.remediationPlans.slice(0, 8);
}

function updatePrimarySkillMastery(state: MasteryState, skill: MasterySkill, score: number) {
  const delta = score >= 85 ? 8 : score >= 70 ? 5 : score >= 50 ? 1 : -5;
  state.skillMastery[skill] = clamp(state.skillMastery[skill] + delta);
  if (score >= MASTERY_THRESHOLD) {
    state.weakSkillStreak[skill] = 0;
  } else {
    state.weakSkillStreak[skill] += 1;
  }
}

function updateWeakSkills(state: MasteryState, weakSkills: MasterySkill[], lessonId: string) {
  const uniqueWeakSkills = [...new Set(weakSkills)];
  uniqueWeakSkills.forEach((skill) => {
    state.skillMastery[skill] = clamp(state.skillMastery[skill] - 4);
    state.weakSkillStreak[skill] += 1;

    if (state.weakSkillStreak[skill] >= 2 || state.skillMastery[skill] < 55) {
      ensureRemediationPlan(state, skill, lessonId);
    }
  });
}

function resolveRecoveredSkillPlans(state: MasteryState, skill: MasterySkill, score: number) {
  if (score < 80) return;
  state.remediationPlans = state.remediationPlans.map((plan) => {
    if (!plan.resolved && plan.skill === skill) {
      return {
        ...plan,
        resolved: true,
        resolvedAt: nowIso(),
      };
    }
    return plan;
  });
}

export function recordLessonAttempt(input: LessonAttemptInput) {
  const state = getMasteryState();
  const total = Math.max(1, input.totalExercises);
  const scorePercent = Math.round((input.correctExercises / total) * 100);
  const previousLessonMastery = state.lessonMastery[input.lessonId];

  // Consistency bonus: If doing it multiple times and improving
  const attemptCount = state.lessonAttempts[input.lessonId] || 0;
  const consistencyBonus = attemptCount > 0 && scorePercent > (previousLessonMastery || 0) ? 5 : 0;

  const updatedLessonMastery =
    typeof previousLessonMastery === 'number'
      ? Math.round(previousLessonMastery * 0.6 + scorePercent * 0.4) + consistencyBonus
      : scorePercent;

  state.lessonMastery[input.lessonId] = clamp(updatedLessonMastery);
  state.lessonAttempts[input.lessonId] = (state.lessonAttempts[input.lessonId] || 0) + 1;

  updatePrimarySkillMastery(state, input.lessonCategory, scorePercent);
  updateWeakSkills(state, input.weakSkills, input.lessonId);
  resolveRecoveredSkillPlans(state, input.lessonCategory, scorePercent);

  state.updatedAt = nowIso();
  saveMasteryState(state);

  return {
    scorePercent,
    lessonMastery: state.lessonMastery[input.lessonId],
    attempts: state.lessonAttempts[input.lessonId],
    activeRemediationPlan: getActiveRemediationPlan(state),
  };
}

export function getActiveRemediationPlan(state = getMasteryState()) {
  return state.remediationPlans.find((plan) => !plan.resolved) || null;
}

export function markRemediationPlanDone(planId: string, performanceBoost: number = 10) {
  const state = getMasteryState();
  const plan = state.remediationPlans.find((plan) => plan.id === planId && !plan.resolved);

  if (plan) {
    plan.resolved = true;
    plan.resolvedAt = nowIso();

    // Re-evaluate mastery upon completion of remediation loop
    // Give a significant boost to the skill to reflect AI tutor help
    state.skillMastery[plan.skill] = clamp(state.skillMastery[plan.skill] + performanceBoost);

    // Reset the weak streak since they successfully completed recovery
    state.weakSkillStreak[plan.skill] = 0;

    state.updatedAt = nowIso();
    saveMasteryState(state);
  }
}

export function getUnlockedLessonIds(lessons: A1Lesson[], state = getMasteryState()) {
  return lessons
    .filter((_, index) => {
      if (index === 0) return true;
      const previousLessonId = lessons[index - 1].id;
      const previousMastery = state.lessonMastery[previousLessonId] || 0;
      // STRICT MASTERY GATING: Must cross the mastery threshold to unlock the next item
      return previousMastery >= MASTERY_THRESHOLD;
    })
    .map((lesson) => lesson.id);
}

export function isLessonUnlocked(lessonId: string, lessons: A1Lesson[], state = getMasteryState()) {
  return getUnlockedLessonIds(lessons, state).includes(lessonId);
}

export function getNextRecommendedLesson(lessons: A1Lesson[], state = getMasteryState()) {
  const unlockedIds = new Set(getUnlockedLessonIds(lessons, state));
  return (
    lessons.find((lesson) => unlockedIds.has(lesson.id) && (state.lessonMastery[lesson.id] || 0) < MASTERY_THRESHOLD) ||
    lessons.find((lesson) => unlockedIds.has(lesson.id)) ||
    lessons[0] ||
    null
  );
}

export function getSkillMasterySummary(state = getMasteryState()) {
  return [
    { key: 'vocabulary' as const, label: 'Vocabulary', score: state.skillMastery.vocabulary },
    { key: 'grammar' as const, label: 'Grammar', score: state.skillMastery.grammar },
    { key: 'reading' as const, label: 'Reading', score: state.skillMastery.reading },
    { key: 'listening' as const, label: 'Listening', score: state.skillMastery.listening },
    { key: 'speaking' as const, label: 'Speaking', score: state.skillMastery.speaking },
  ];
}

export function getOverallMastery(state = getMasteryState()) {
  const values = Object.values(state.skillMastery);
  const average = values.reduce((acc, value) => acc + value, 0) / Math.max(1, values.length);
  return Math.round(average);
}

export function getUnitRoadmap(lessons: A1Lesson[], state = getMasteryState()): UnitRoadmapEntry[] {
  const unlocked = new Set(getUnlockedLessonIds(lessons, state));
  const byUnit = new Map<number, UnitRoadmapEntry>();

  lessons.forEach((lesson) => {
    const current = byUnit.get(lesson.unit) || { unit: lesson.unit, total: 0, unlocked: 0, mastered: 0 };
    current.total += 1;
    if (unlocked.has(lesson.id)) current.unlocked += 1;
    if ((state.lessonMastery[lesson.id] || 0) >= MASTERY_THRESHOLD) current.mastered += 1;
    byUnit.set(lesson.unit, current);
  });

  return [...byUnit.values()].sort((a, b) => a.unit - b.unit);
}

export function getMasteryThreshold() {
  return MASTERY_THRESHOLD;
}
