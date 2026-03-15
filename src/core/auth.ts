const USER_KEY = "lisan_current_user";
const ONBOARDING_KEY = "lisan_onboarding_v1";
const AUTH_CHANGE_EVENT = "lisan-auth-change";

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

export function saveTokens(_token?: string, _refreshToken?: string) {
  // Tokens are stored in httpOnly cookies on the server.
}

function emitAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

export function saveCurrentUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  emitAuthChange();
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

export function setAccessToken(_token: string) {
  // Access tokens are stored in httpOnly cookies on the server.
}

export function getAccessToken() {
  return null;
}

export function getRefreshToken() {
  return null;
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
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ONBOARDING_KEY);
  emitAuthChange();
}

export function isAuthenticated() {
  return Boolean(getCurrentUser());
}

export function subscribeAuthChange(listener: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener(AUTH_CHANGE_EVENT, listener);
  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, listener);
  };
}
