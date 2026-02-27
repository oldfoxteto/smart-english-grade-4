import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './auth';

export interface AuthPayload {
  email: string;
  password: string;
  displayName?: string;
  country?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
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
  correctionAr: string;
  tutorReply: string;
  nextStep: string;
  safety: {
    blocked: boolean;
    reason: string | null;
  };
}

export type AiTutorEventName =
  | 'ai_tutor_submitted'
  | 'ai_tutor_success'
  | 'ai_tutor_retry'
  | 'ai_tutor_cooldown_hit'
  | 'ai_tutor_daily_cap_hit';

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

const API_HOSTNAME =
  typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE_URL =
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
  const message = String(body.error || `Request failed with status ${response.status}`);
  return { message, details: body };
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      return null;
    }

    const payload = (await response.json()) as { token: string; refreshToken: string };
    saveTokens(payload.token, payload.refreshToken);
    return payload.token;
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
    headers: buildHeaders(token || undefined, init.headers),
  });

  if (response.status === 401 && auth && retryOn401) {
    const renewedToken = await refreshAccessToken();
    if (renewedToken) {
      const retry = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
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
  return apiRequest<AuthResponse>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    { auth: false, retryOn401: false }
  );
}

export async function login(payload: AuthPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email: payload.email, password: payload.password }),
    },
    { auth: false, retryOn401: false }
  );
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
  message: string;
  scenario: 'daily' | 'travel' | 'work' | 'migration';
  proficiency: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}) {
  return apiRequest<AiTutorResponse>('/ai/tutor/reply', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function trackAnalyticsEvent(payload: {
  eventName: AiTutorEventName;
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
