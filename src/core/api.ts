import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './auth';

import { saveCurrentUser } from './auth';

export interface AuthPayload {
  email: string;
  password: string;
  displayName?: string;
  country?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    displayName: string;
    status: string;
    roles?: string[];
  };
}

export interface PlacementOption {
  id: string;
  optionText: string;
  sortOrder: number;
}

export interface PlacementQuestion {
  id: string;
  prompt: string;
  sort_order: number;
  options: PlacementOption[];
}

export interface PlacementTestResponse {
  test: {
    id: string;
    title: string;
    languageCode: string;
    totalQuestions: number;
    version: number;
    questions: PlacementQuestion[];
  };
}

export interface LearningPathResponse {
  userId: string;
  languageCode: string;
  goalType: string;
  cefr: string;
  recommendedTrackCodes: string[];
  lessons: Array<{
    track_code: string;
    track_name: string;
    unit_title: string;
    lesson_id: string;
    lesson_title: string;
    lesson_type: string;
    est_minutes: number;
  }>;
}

export interface LessonContentResponse {
  lesson: {
    lessonId: string;
    lessonTitle: string;
    lessonType: string;
    estMinutes: number;
    unitId: string;
    unitTitle: string;
    cefrLevel: string;
    trackCode: string;
    trackName: string;
    languageCode: string;
    qaStatus: string;
    qaNotes: string | null;
  };
  body: Record<string, unknown>;
}

export interface GamificationStatus {
  totalXp: number;
  level: number;
  nextLevelXp: number;
  currentStreakDays: number;
  bestStreakDays: number;
  lastActiveDate: string | null;
  aiTutor?: {
    dailyCap: number;
    awardedToday: number;
    remainingToday: number;
    cooldownRemainingSeconds: number;
  };
}

export interface AiTutorResponse {
  scenario: string;
  correctionAr?: string;
  tutorReply?: string;
  nextStep?: string;
  reply?: string;
  correction?: string | null;
  safety: {
    blocked: boolean;
    reason: string | null;
  };
}

export interface VisionConsent {
  allowVision: boolean;
  guardianName: string;
  policyVersion: string;
  updatedAt: string | null;
}

export interface SafetyPolicy {
  version: string;
  title: string;
  summary: string;
  rules: string[];
}

export interface LessonPathStatus {
  lessonId: string;
  unlocked: boolean;
  completed: boolean;
  mastered: boolean;
  masteryScore: number;
}

export interface LessonCatalogEntry {
  lessonId: string;
  lessonTitle: string;
  lessonType: string;
  estMinutes: number;
  unitId: string;
  unitTitle: string;
  unitNumber: number;
  cefrLevel: string;
  trackCode: string;
  trackName: string;
  languageCode: string;
  qaStatus: string;
  objective: string;
}

export interface GeneratedContent {
  cached: boolean;
  content: {
    title?: string;
    text?: string;
    questions?: Array<{
      question: string;
      options: string[];
      answer: number;
    }>;
  };
}

export type AiTutorEventName =
  | 'ai_tutor_submitted'
  | 'ai_tutor_success'
  | 'ai_tutor_retry'
  | 'ai_tutor_cooldown_hit'
  | 'ai_tutor_daily_cap_hit';
export type VoiceSocketEventName =
  | 'voice_socket_connect_error'
  | 'voice_socket_disconnected'
  | 'voice_socket_reconnected'
  | 'voice_stream_start_failed';
export type AnalyticsEventName = AiTutorEventName | VoiceSocketEventName;

export type AiScenarioFilter = 'all' | 'daily' | 'travel' | 'work' | 'migration';

export interface AnalyticsSummaryResponse {
  windowHours: number;
  scenario: AiScenarioFilter;
  counts: Record<AiTutorEventName, number>;
  kpis: {
    submitted: number;
    success: number;
    successRate: number;
  };
  topScenarios: Array<{
    scenario: string;
    count: number;
  }>;
}

export interface AnalyticsTrendPoint {
  hour_start: string;
  total: number;
  ai_tutor_submitted: number;
  ai_tutor_success: number;
  ai_tutor_retry: number;
  ai_tutor_cooldown_hit: number;
  ai_tutor_daily_cap_hit: number;
  voice_socket_connect_error: number;
  voice_socket_disconnected: number;
  voice_socket_reconnected: number;
  voice_stream_start_failed: number;
  success_rate: number;
}

export interface AnalyticsTrendResponse {
  windowHours: number;
  scenario: AiScenarioFilter;
  points: AnalyticsTrendPoint[];
}

export interface OpsDashboardPoint {
  hour_start: string;
  request_count: number;
  error_count: number;
  retry_count: number;
  circuit_open_count: number;
  avg_latency_ms: number;
  error_rate: number;
}

export interface OpsDashboardResponse {
  windowHours: number;
  kpis: {
    totalRequests: number;
    totalErrors: number;
    errorRate: number;
    avgLatencyMs: number;
    p95LatencyMs: number;
    retryCount: number;
    circuitOpenEvents: number;
  };
  circuit: {
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failures: number;
    threshold: number;
    reopenInMs: number;
  };
  points: OpsDashboardPoint[];
}

export interface OpsRouteSlo {
  method: string;
  path: string;
  requestCount: number;
  errors5xx: number;
  errorRate: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
}

export interface OpsTopFailingRoute {
  method: string;
  path: string;
  errors5xx: number;
  requestCount: number;
}

export interface OpsRoutesResponse {
  windowHours: number;
  limit: number;
  routes: OpsRouteSlo[];
  topFailingRoutes: OpsTopFailingRoute[];
}
export interface ApiHealthResponse {
  status: 'healthy';
  ts: string;
  version: string;
  ai?: {
    configured: boolean;
    mode: 'openai' | 'fallback';
  };
}

export interface UserSettingsPayload {
  profile: {
    name: string;
    email: string;
    avatar: string;
    level: number;
    xp: number;
    language: 'ar' | 'en';
  };
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
    vibration: boolean;
    desktop: boolean;
  };
  audio: {
    microphone: boolean;
    speaker: boolean;
    volume: number;
    inputDevice: string;
    outputDevice: string;
  };
  video: {
    camera: boolean;
    quality: 'low' | 'medium' | 'high';
    device: string;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    language: 'ar' | 'en';
    fontSize: 'small' | 'medium' | 'large';
    compactMode: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showProgress: boolean;
    showAchievements: boolean;
    dataCollection: boolean;
  };
  performance: {
    autoPlay: boolean;
    preloadContent: boolean;
    reduceAnimations: boolean;
    offlineMode: boolean;
  };
}

export interface UserSettingsResponse {
  settings: UserSettingsPayload;
  updatedAt: string | null;
}

export interface PracticeExerciseResponse {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  type: 'pronunciation' | 'listening' | 'speaking' | 'grammar' | 'vocabulary';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  completed: boolean;
  score: number;
  bestScore: number;
  attempts: number;
  category: string;
}

export interface PracticeCatalogResponse {
  exercises: PracticeExerciseResponse[];
  updatedAt: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number;
  streak: number;
  league: 'Bronze' | 'Silver' | 'Gold';
  isCurrentUser?: boolean;
  rank: number;
}

export interface LeaderboardResponse {
  league: 'Bronze' | 'Silver' | 'Gold';
  entries: LeaderboardEntry[];
  currentUser: LeaderboardEntry | null;
  generatedAt: string;
}

export interface ReadingQuestParagraph {
  text: string;
  dictionary: Record<string, string>;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
  };
}

export interface ReadingQuestSummary {
  id: string;
  title: string;
  titleAr: string;
  image: string;
  paragraphCount: number;
  completed: boolean;
  bestScore: number;
}

export interface ReadingQuestDetailResponse {
  quest: {
    id: string;
    title: string;
    titleAr: string;
    image: string;
    paragraphs: ReadingQuestParagraph[];
  };
  progress: {
    completed: boolean;
    bestScore: number;
    completedAt: string | null;
  };
}

export interface TestingCatalogItem {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  type: 'placement' | 'progress' | 'final' | 'practice';
  category: 'grammar' | 'vocabulary' | 'listening' | 'reading' | 'speaking' | 'pronunciation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  questions: number;
  completed: boolean;
  score: number;
  bestScore: number;
  attempts: number;
  passingScore: number;
  status: 'available' | 'locked' | 'completed' | 'in_progress';
  iconKey: 'assessment' | 'pronunciation' | 'listening' | 'speaking' | 'grammar' | 'vocabulary' | 'reading';
}

export interface TestingResultItem {
  id: string;
  testId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpentMinutes: number;
  completedAt: string | null;
  feedback: string;
  recommendations: string[];
}

export interface TestingCatalogResponse {
  tests: TestingCatalogItem[];
  results: TestingResultItem[];
  summary: {
    totalTests: number;
    completedTests: number;
    averageScore: number;
    totalTimeMinutes: number;
  };
  generatedAt: string;
}

// Progress & SRS (server-backed)
export interface RemoteProgress {
  vocabularyCompleted: number[];
  grammarCompleted: number[];
  storiesCompleted: number[];
  quizScores: { date: string; score: number; total: number }[];
  stars: number;
  level: number;
  username?: string;
}

export interface RemoteSrsItem {
  id: string;
  type: 'vocabulary' | 'grammar';
  level: number;
  nextReviewAt: string;
  easeFactor: number;
  interval: number;
  history: boolean[];
}

const API_HOSTNAME =
  typeof window !== 'undefined' ? window.location.hostname : 'localhost';
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || `http://${API_HOSTNAME}:4000/api/v1`;

export class ApiError extends Error {
  status: number;
  details: Record<string, unknown>;

  constructor(status: number, message: string, details: Record<string, unknown> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = {
  auth?: boolean;
  retryOn401?: boolean;
};

let refreshInFlight: Promise<string | null> | null = null;

function buildHeaders(token?: string, extra?: HeadersInit): Headers {
  const headers = new Headers(extra || {});
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}

async function parseError(response: Response): Promise<{ message: string; details: Record<string, unknown> }> {
  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  const message = String(body.error || body.message || body.reason || `Request failed with status ${response.status}`);
  return { message, details: body };
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    // Legacy hooks kept as no-ops after moving tokens into httpOnly cookies.
    const legacyRefreshToken = getRefreshToken();
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: buildHeaders(),
      credentials: 'include',
      body: legacyRefreshToken ? JSON.stringify({ refreshToken: legacyRefreshToken }) : undefined,
    });

    if (!response.ok) {
      clearTokens();
      return null;
    }

    const payload = (await response.json()) as AuthResponse;
    saveTokens();
    saveCurrentUser(payload.user);
    return 'cookie-session-restored';
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  options: RequestOptions = {}
): Promise<T> {
  const auth = options.auth ?? true;
  const retryOn401 = options.retryOn401 ?? true;

  const token = auth ? getAccessToken() : null;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: buildHeaders(token || undefined, init.headers),
  });

  if (response.status === 401 && auth && retryOn401) {
    const renewedToken = await refreshAccessToken();
    if (renewedToken) {
      const retry = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        credentials: 'include',
        headers: buildHeaders(renewedToken, init.headers),
      });

      if (!retry.ok) {
        const parsed = await parseError(retry);
        throw new ApiError(retry.status, parsed.message, parsed.details);
      }

      if (retry.status === 204) {
        return undefined as T;
      }

      return retry.json() as Promise<T>;
    }
  }

  if (!response.ok) {
    const parsed = await parseError(response);
    throw new ApiError(response.status, parsed.message, parsed.details);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function register(payload: AuthPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, { auth: false, retryOn401: false });
}

export async function login(payload: AuthPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, { auth: false, retryOn401: false });
}

export async function logout() {
  await apiRequest<void>('/auth/logout', {
    method: 'POST',
  }, { auth: false, retryOn401: false });
}

export async function restoreSession(): Promise<AuthResponse | null> {
  try {
    const session = await apiRequest<AuthResponse>('/auth/session', {
      method: 'GET',
    }, { auth: false, retryOn401: false });
    saveCurrentUser(session.user);
    return session;
  } catch {
    try {
      const refreshed = await refreshAccessToken();
      if (!refreshed) {
        clearTokens();
        return null;
      }
      const session = await apiRequest<AuthResponse>('/auth/session', {
        method: 'GET',
      }, { auth: false, retryOn401: false });
      saveCurrentUser(session.user);
      return session;
    } catch {
      clearTokens();
      return null;
    }
  }
}

// ---------------- Progress & SRS ----------------
export async function fetchProgress(): Promise<RemoteProgress> {
  return apiRequest<RemoteProgress>('/progress');
}

export async function saveProgressRemote(progress: RemoteProgress) {
  return apiRequest<{ ok: boolean; updatedAt: string }>('/progress', {
    method: 'PUT',
    body: JSON.stringify(progress),
  });
}

export async function getDueSrsItems(): Promise<RemoteSrsItem[]> {
  const resp = await apiRequest<{ items: RemoteSrsItem[] }>('/srs/due');
  return resp.items;
}

export async function reviewSrsItem(payload: {
  itemId: string;
  itemType: 'vocabulary' | 'grammar';
  isCorrect: boolean;
  timeTakenSeconds: number;
}) {
  const resp = await apiRequest<{ item: RemoteSrsItem }>('/srs/review', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return resp.item;
}

export async function getPlacementTest(languageCode: 'en' | 'el'): Promise<PlacementTestResponse> {
  return apiRequest<PlacementTestResponse>(`/placement/tests/${languageCode}`);
}

export async function submitPlacement(
  testId: string,
  answers: Array<{ questionId: string; optionId: string }>
) {
  return apiRequest<{ placementResult: { estimatedCefr: string; scorePercent: number } }>('/placement/submit', {
    method: 'POST',
    body: JSON.stringify({ testId, answers }),
  });
}

export async function getLearningPath(
  languageCode: 'en' | 'el',
  goalType: 'daily' | 'travel' | 'work' | 'study' | 'migration'
): Promise<LearningPathResponse> {
  return apiRequest<LearningPathResponse>(`/learning-path?languageCode=${languageCode}&goalType=${goalType}`);
}

export async function getLessonContent(lessonId: string) {
  return apiRequest<LessonContentResponse>(`/lessons/${lessonId}/content`);
}

export async function getGamificationStatus(): Promise<GamificationStatus> {
  return apiRequest<GamificationStatus>('/gamification/status');
}

export async function awardXp(source: string, points: number) {
  return apiRequest<{ ok: boolean }>('/gamification/award', {
    method: 'POST',
    body: JSON.stringify({ source, points }),
  });
}

export async function askAiTutor(payload: {
  message?: string;
  userMessage?: string;
  scenario: 'daily' | 'travel' | 'work' | 'migration' | 'free' | 'restaurant' | 'airport' | 'shopping' | 'vision';
  proficiency?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  history?: Array<{ role: 'user' | 'bot'; text: string; imageBase64?: string }>;
  langCode?: string;
  imageBase64?: string;
}): Promise<AiTutorResponse> {
  const rawMessage = payload.userMessage || payload.message || '';
  const mappedScenario: 'daily' | 'travel' | 'work' | 'migration' =
    payload.scenario === 'airport' || payload.scenario === 'restaurant'
      ? 'travel'
      : payload.scenario === 'shopping' || payload.scenario === 'free'
        ? 'daily'
      : payload.scenario === 'vision'
          ? 'daily'
          : (payload.scenario as 'daily' | 'travel' | 'work' | 'migration');

  return apiRequest<{
    reply: string;
    correction: string | null;
    safety: { blocked: boolean; reason: string | null };
  }>('/ai/tutor/reply', {
    method: 'POST',
    body: JSON.stringify({
      message: rawMessage,
      userMessage: rawMessage,
      scenario: mappedScenario,
      scenarioRaw: payload.scenario,
      proficiency: payload.proficiency || 'A1',
      langCode: payload.langCode || 'en-US',
      history: payload.history || [],
      imageBase64: payload.imageBase64,
    }),
  }).then((resp) => ({
    scenario: payload.scenario,
    reply: resp.reply,
    correction: resp.correction,
    safety: resp.safety,
  }));
}

export async function getVisionConsent() {
  return apiRequest<VisionConsent>('/safety/consent');
}

export async function getSafetyPolicy() {
  return apiRequest<SafetyPolicy>('/safety/policy');
}

export async function saveVisionConsent(payload: { allowVision: boolean; guardianName?: string }) {
  return apiRequest<{ ok: boolean; allowVision: boolean; updatedAt: string; policyVersion: string }>('/safety/consent', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function trackAnalyticsEvent(payload: {
  eventName: AnalyticsEventName;
  source?: string;
  metadata?: Record<string, unknown>;
}) {
  return apiRequest<{ ok: true }>('/analytics/events', {
    method: 'POST',
    body: JSON.stringify({
      eventName: payload.eventName,
      source: payload.source || 'web',
      metadata: payload.metadata || {},
    }),
  });
}

export async function getApiHealth() {
  return apiRequest<ApiHealthResponse>('/health', {}, { auth: false, retryOn401: false });
}

export async function getAnalyticsSummary(hours = 24, scenario: AiScenarioFilter = 'all') {
  return apiRequest<AnalyticsSummaryResponse>(`/analytics/summary?hours=${hours}&scenario=${scenario}`);
}

export async function getAnalyticsTrend(hours = 24, scenario: AiScenarioFilter = 'all') {
  return apiRequest<AnalyticsTrendResponse>(`/analytics/trend?hours=${hours}&scenario=${scenario}`);
}

export async function getOpsDashboard(hours = 24) {
  return apiRequest<OpsDashboardResponse>(`/analytics/ops/dashboard?hours=${hours}`);
}

export async function getOpsRoutes(hours = 24, limit = 20) {
  return apiRequest<OpsRoutesResponse>(`/analytics/ops/routes?hours=${hours}&limit=${limit}`);
}

export async function getLessonPathStatuses(lessonIds: string[]) {
  return apiRequest<{ statuses: LessonPathStatus[] }>('/lessons/path', {
    method: 'POST',
    body: JSON.stringify({ lessonIds }),
  });
}

export async function getLessonCatalog(goalType: 'daily' | 'travel' | 'work' | 'study' = 'daily') {
  return apiRequest<{ lessons: LessonCatalogEntry[] }>(`/lessons/catalog?goalType=${goalType}`);
}

export async function updateLessonProgress(lessonId: string, masteryScore: number, completed: boolean) {
  return apiRequest<{ ok: boolean }>(`/lessons/${lessonId}/progress`, {
    method: 'PATCH',
    body: JSON.stringify({ masteryScore, completed }),
  });
}

export async function generateDynamicContent(payload: { topic: string; level?: string; mode?: string }) {
  return apiRequest<GeneratedContent>('/content/generate', {
    method: 'POST',
    body: JSON.stringify({
      topic: payload.topic,
      level: payload.level || 'A1',
      mode: payload.mode || 'story',
    }),
  });
}

export async function getUserSettings() {
  return apiRequest<UserSettingsResponse>('/settings');
}

export async function saveUserSettings(settings: UserSettingsPayload) {
  return apiRequest<{ ok: boolean; settings: UserSettingsPayload; updatedAt: string }>('/settings', {
    method: 'PUT',
    body: JSON.stringify({ settings }),
  });
}

export async function getPracticeCatalog() {
  return apiRequest<PracticeCatalogResponse>('/practice/catalog');
}

export async function completePracticeExercise(exerciseId: string, payload: { score: number; completed: boolean }) {
  return apiRequest<{ ok: boolean; exercise: PracticeExerciseResponse }>(`/practice/exercises/${exerciseId}/complete`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getLeaderboard(league?: 'Bronze' | 'Silver' | 'Gold') {
  const query = league ? `?league=${league}` : '';
  return apiRequest<LeaderboardResponse>(`/leaderboard${query}`);
}

export async function getReadingQuestSummaries() {
  return apiRequest<{ quests: ReadingQuestSummary[] }>('/reading-quests');
}

export async function getReadingQuest(questId: string) {
  return apiRequest<ReadingQuestDetailResponse>(`/reading-quests/${questId}`);
}

export async function completeReadingQuest(questId: string, bestScore = 100) {
  return apiRequest<{ ok: boolean; completedAt: string; bestScore: number }>(`/reading-quests/${questId}/complete`, {
    method: 'POST',
    body: JSON.stringify({ bestScore }),
  });
}

export async function getTestingCatalog() {
  return apiRequest<TestingCatalogResponse>('/testing/catalog');
}
