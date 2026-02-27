const TOKEN_KEY = "lisan_access_token";
const REFRESH_TOKEN_KEY = "lisan_refresh_token";
const USER_KEY = "lisan_current_user";
const ONBOARDING_KEY = "lisan_onboarding_v1";

export type AuthUser = {
  id: string;
  email: string;
  displayName?: string;
  status?: string;
  roles?: string[];
};

export type OnboardingProfile = {
  languageCode: "en" | "el";
  goalType: "daily" | "travel" | "work" | "study" | "migration";
  proficiency: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  dailyMinutes: number;
  completedAt: string;
};

export function saveTokens(token: string, refreshToken: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function saveCurrentUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function isAdminUser() {
  const user = getCurrentUser();
  return Boolean(user?.roles?.includes("admin"));
}

export function setAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function saveOnboardingProfile(profile: OnboardingProfile) {
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify(profile));
}

export function getOnboardingProfile(): OnboardingProfile | null {
  try {
    const raw = localStorage.getItem(ONBOARDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OnboardingProfile;
  } catch {
    return null;
  }
}

export function isOnboardingCompleted() {
  return Boolean(getOnboardingProfile());
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ONBOARDING_KEY);
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}
