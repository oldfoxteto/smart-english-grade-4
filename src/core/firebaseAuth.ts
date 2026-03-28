import QRCode from 'qrcode';
import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseError } from 'firebase/app';
import {
  GoogleAuthProvider,
  TotpMultiFactorGenerator,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  getRedirectResult,
  getMultiFactorResolver,
  multiFactor,
  reload,
  sendPasswordResetEmail,
  sendEmailVerification,
  setPersistence,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  updateProfile,
  type Auth,
  type MultiFactorResolver,
  type TotpSecret,
  type User,
} from 'firebase/auth';

function resolveFirebaseAuthDomain() {
  const configuredAuthDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;

  if (typeof window === 'undefined') {
    return configuredAuthDomain;
  }

  const host = window.location.hostname;
  if (host.endsWith('.web.app') || host.endsWith('.firebaseapp.com')) {
    return host;
  }

  return configuredAuthDomain;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: resolveFirebaseAuthDomain(),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const requiredFirebaseKeys = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId,
];

const isFirebaseConfigured = requiredFirebaseKeys.every(Boolean);

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
const GOOGLE_REDIRECT_PENDING_KEY = 'beefluent_google_redirect_pending';

function isFirebaseInternalError(error: unknown) {
  const firebaseError = error as FirebaseError | undefined;
  return firebaseError?.code === 'auth/internal-error';
}

function deleteIndexedDb(name: string) {
  if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    try {
      const request = indexedDB.deleteDatabase(name);
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
      request.onblocked = () => resolve();
    } catch {
      resolve();
    }
  });
}

async function resetFirebaseBrowserState() {
  try {
    const auth = ensureFirebaseAuth();
    await signOut(auth).catch(() => undefined);
  } catch {
    // Ignore partially initialized auth instances.
  }

  if (typeof window === 'undefined') {
    return;
  }

  try {
    const storageTargets = [window.localStorage, window.sessionStorage];
    for (const storage of storageTargets) {
      const keysToRemove: string[] = [];
      for (let index = 0; index < storage.length; index += 1) {
        const key = storage.key(index);
        if (key?.startsWith('firebase:')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => storage.removeItem(key));
    }
  } catch {
    // Ignore storage access failures and continue with IndexedDB cleanup.
  }

  await Promise.all([
    deleteIndexedDb('firebaseLocalStorageDb'),
    deleteIndexedDb('firebase-heartbeat-database'),
    deleteIndexedDb('firebase-installations-database'),
  ]);
}

async function retryOnInternalError<T>(operation: () => Promise<T>) {
  try {
    return await operation();
  } catch (error) {
    if (!isFirebaseInternalError(error)) {
      throw error;
    }

    await resetFirebaseBrowserState();
    return operation();
  }
}

function getHostName() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.location.hostname;
}

export function isLocalDevelopmentHost() {
  const host = getHostName();
  return host === '127.0.0.1' || host === 'localhost' || host === '::1';
}

export function isLanDevelopmentHost() {
  const host = getHostName();
  return Boolean(
    host
    && !isLocalDevelopmentHost()
    && (
      /^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)
      || /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)
      || /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host)
    )
  );
}

function getLoopbackHint() {
  return 'افتح التطبيق عبر localhost بدلاً من 127.0.0.1 أو أضف 127.0.0.1 إلى Authorized domains في Firebase Authentication.';
}

function getFirebaseErrorMessage(error: unknown) {
  const firebaseError = error as FirebaseError | undefined;

  switch (firebaseError?.code) {
    case 'auth/account-exists-with-different-credential':
      return 'هذا البريد مرتبط بطريقة دخول مختلفة. استخدم مزود الدخول الأصلي لهذا الحساب.';
    case 'auth/email-already-in-use':
      return 'هذا البريد الإلكتروني مستخدم بالفعل.';
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'بيانات تسجيل الدخول غير صحيحة.';
    case 'auth/popup-closed-by-user':
      return 'تم إغلاق نافذة تسجيل الدخول قبل الإكمال.';
    case 'auth/popup-blocked':
      return 'المتصفح حظر نافذة تسجيل الدخول. اسمح بالنوافذ المنبثقة ثم أعد المحاولة.';
    case 'auth/unauthorized-domain':
      return isLocalDevelopmentHost()
        ? `هذا العنوان غير مصرح به حالياً في Firebase. ${getLoopbackHint()}`
        : 'هذا العنوان غير مصرح به حالياً في Firebase Authentication.';
    case 'auth/network-request-failed':
      return isLocalDevelopmentHost()
        ? `تعذر الاتصال بخدمة Firebase من هذا العنوان. ${getLoopbackHint()}`
        : 'تعذر الاتصال بخدمة Firebase. تحقق من الشبكة ثم أعد المحاولة.';
    case 'auth/internal-error':
      return 'Firebase browser state was reset after an internal error. Please try again. If it still fails, use Forgot Password.';
    case 'auth/multi-factor-auth-required':
      return 'هذا الحساب يتطلب رمز تحقق ثنائي.';
    case 'auth/invalid-verification-code':
      return 'رمز التحقق الثنائي غير صحيح.';
    case 'auth/code-expired':
      return 'انتهت صلاحية رمز التحقق. أعد المحاولة.';
    case 'auth/operation-not-allowed':
      return 'طريقة تسجيل الدخول هذه غير مفعلة حالياً في Firebase.';
    default:
      return firebaseError?.message || 'تعذر إكمال المصادقة عبر Firebase.';
  }
}

function ensureFirebaseAuth() {
  if (!isFirebaseConfigured) {
    throw new Error('إعداد Firebase للويب غير مكتمل بعد.');
  }

  if (!firebaseApp) {
    firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }

  if (!firebaseAuth) {
    firebaseAuth = getAuth(firebaseApp);
    void setPersistence(firebaseAuth, browserLocalPersistence);
  }

  return firebaseAuth;
}

export type AuthProviderId = 'password' | 'google.com';

type E2eFirebaseUser = {
  uid?: string;
  email?: string;
  displayName?: string;
  providerId?: AuthProviderId;
  idToken?: string;
};

type E2eFirebaseHarness = {
  popupUser?: E2eFirebaseUser;
  redirectUser?: E2eFirebaseUser;
  currentUser?: E2eFirebaseUser;
};

export type CompletedFirebaseAuth = {
  kind: 'complete';
  user: User;
  providerId: AuthProviderId;
  mfaCompleted: boolean;
};

export type PendingMfaSignIn = {
  kind: 'mfa-required';
  resolver: MultiFactorResolver;
  factorLabel: string;
};

export type FirebaseSignInResult = CompletedFirebaseAuth | PendingMfaSignIn;

export type TotpEnrollment = {
  secret: TotpSecret;
  secretKey: string;
  qrCodeDataUrl: string;
  qrCodeUrl: string;
};

function getE2eFirebaseHarness(): E2eFirebaseHarness | null {
  if (!import.meta.env.DEV || typeof window === 'undefined') {
    return null;
  }

  return (window as Window & { __E2E_FIREBASE_AUTH__?: E2eFirebaseHarness }).__E2E_FIREBASE_AUTH__ || null;
}

function createE2eFirebaseUser(user: E2eFirebaseUser): User {
  return {
    uid: user.uid || 'e2e-firebase-user',
    email: user.email || 'e2e@example.com',
    displayName: user.displayName || 'E2E Learner',
    providerData: [{ providerId: user.providerId || 'google.com' }],
    getIdToken: async () => user.idToken || 'e2e-firebase-id-token',
  } as unknown as User;
}

function resolveProviderId(user: User, fallback: AuthProviderId): AuthProviderId {
  const provider = user.providerData.find(
    (entry) => entry.providerId && entry.providerId !== 'firebase'
  )?.providerId;

  if (provider === 'google.com' || provider === 'password') {
    return provider;
  }

  return fallback;
}

function mapCompleted(
  user: User,
  providerId: AuthProviderId,
  mfaCompleted = false
): CompletedFirebaseAuth {
  return {
    kind: 'complete',
    user,
    providerId: resolveProviderId(user, providerId),
    mfaCompleted,
  };
}

function mapMfaChallenge(resolver: MultiFactorResolver): PendingMfaSignIn {
  const hint =
    resolver.hints.find((candidate) => candidate.factorId === TotpMultiFactorGenerator.FACTOR_ID) ||
    resolver.hints[0];

  return {
    kind: 'mfa-required',
    resolver,
    factorLabel: hint?.displayName || 'تطبيق المصادقة',
  };
}

export function firebaseAuthEnabled() {
  if (!isFirebaseConfigured) {
    return false;
  }

  if (isLanDevelopmentHost()) {
    return false;
  }

  if (import.meta.env.VITE_ENABLE_FIREBASE_AUTH === 'false') {
    return false;
  }

  return true;
}

export async function registerWithFirebaseEmail(
  email: string,
  password: string,
  displayName: string
) {
  try {
    const auth = ensureFirebaseAuth();
    const credential = await retryOnInternalError(
      () => createUserWithEmailAndPassword(auth, email, password)
    );
    await updateProfile(credential.user, { displayName });
    await sendEmailVerification(credential.user);
    return mapCompleted(credential.user, 'password', false);
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

export async function loginWithFirebaseEmail(
  email: string,
  password: string
): Promise<FirebaseSignInResult> {
  try {
    const auth = ensureFirebaseAuth();
    const credential = await retryOnInternalError(
      () => signInWithEmailAndPassword(auth, email, password)
    );
    return mapCompleted(
      credential.user,
      'password',
      multiFactor(credential.user).enrolledFactors.length > 0
    );
  } catch (error) {
    const firebaseError = error as FirebaseError | undefined;
    if (firebaseError?.code === 'auth/multi-factor-auth-required') {
      const auth = ensureFirebaseAuth();
      return mapMfaChallenge(getMultiFactorResolver(auth, error as never));
    }

    throw new Error(getFirebaseErrorMessage(error));
  }
}

export async function signInWithGoogle() {
  try {
    const e2eHarness = getE2eFirebaseHarness();
    if (e2eHarness?.popupUser) {
      return mapCompleted(createE2eFirebaseUser(e2eHarness.popupUser), 'google.com', false);
    }

    const auth = ensureFirebaseAuth();
    await signOut(auth).catch(() => undefined);

    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(GOOGLE_REDIRECT_PENDING_KEY);
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    let credential;

    try {
      credential = await retryOnInternalError(() => signInWithPopup(auth, provider));
    } catch (error) {
      const firebaseError = error as FirebaseError | undefined;
      const shouldUseRedirect =
        firebaseError?.code === 'auth/popup-blocked'
        || firebaseError?.code === 'auth/cancelled-popup-request';

      if (!shouldUseRedirect) {
        throw error;
      }

      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(GOOGLE_REDIRECT_PENDING_KEY, '1');
      }
      await retryOnInternalError(() => signInWithRedirect(auth, provider));
      throw new Error('Redirecting to Google sign-in...');
    }

    return mapCompleted(credential.user, 'google.com', false);
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

export async function consumeGoogleRedirectSignIn() {
  const e2eHarness = getE2eFirebaseHarness();
  if (e2eHarness?.redirectUser) {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(GOOGLE_REDIRECT_PENDING_KEY);
    }
    return mapCompleted(createE2eFirebaseUser(e2eHarness.redirectUser), 'google.com', false);
  }

  const auth = ensureFirebaseAuth();
  const credential = await retryOnInternalError(() => getRedirectResult(auth));

  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(GOOGLE_REDIRECT_PENDING_KEY);
  }

  if (!credential) {
    return null;
  }

  return mapCompleted(credential.user, 'google.com', false);
}

export async function sendFirebasePasswordReset(email: string) {
  try {
    const auth = ensureFirebaseAuth();
    await sendPasswordResetEmail(auth, email.trim().toLowerCase());
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

export async function resendFirebaseEmailVerification(email: string, password: string) {
  try {
    const auth = ensureFirebaseAuth();
    const credential = await signInWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      password
    );

    await reload(credential.user);

    if (credential.user.emailVerified) {
      await signOut(auth);
      throw new Error('هذا البريد الإلكتروني مفعل بالفعل. يمكنك تسجيل الدخول مباشرة.');
    }

    await sendEmailVerification(credential.user);
    await signOut(auth);
  } catch (error) {
    if (error instanceof Error && !('code' in (error as object))) {
      throw error;
    }

    throw new Error(getFirebaseErrorMessage(error));
  }
}

export async function checkFirebaseEmailVerification(email: string, password: string) {
  const auth = ensureFirebaseAuth();

  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      password
    );

    await reload(credential.user);
    return credential.user.emailVerified;
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  } finally {
    await signOut(auth).catch(() => undefined);
  }
}

export async function signOutFirebaseSession() {
  const auth = ensureFirebaseAuth();
  await signOut(auth);
}

export async function ensureFirebaseEmailVerified(user: User) {
  await reload(user);
  return user.emailVerified;
}

export async function beginTotpEnrollment(user: User, issuer = 'LISAN') {
  try {
    const session = await multiFactor(user).getSession();
    const secret = await TotpMultiFactorGenerator.generateSecret(session);
    const qrCodeUrl = secret.generateQrCodeUrl(user.email || 'talib', issuer);
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, { width: 220, margin: 1 });

    return {
      secret,
      secretKey: secret.secretKey,
      qrCodeDataUrl,
      qrCodeUrl,
    } satisfies TotpEnrollment;
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

export async function confirmTotpEnrollment(
  user: User,
  enrollment: TotpEnrollment,
  verificationCode: string
) {
  try {
    const assertion = TotpMultiFactorGenerator.assertionForEnrollment(
      enrollment.secret,
      verificationCode
    );
    await multiFactor(user).enroll(assertion, 'تطبيق المصادقة');
    return mapCompleted(user, 'password', true);
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

export async function completeTotpSignIn(
  resolver: MultiFactorResolver,
  verificationCode: string
) {
  try {
    const totpHint = resolver.hints.find(
      (hint) => hint.factorId === TotpMultiFactorGenerator.FACTOR_ID
    );

    if (!totpHint) {
      throw new Error('هذا الحساب لا يملك عاملاً مدعوماً من نوع TOTP.');
    }

    const assertion = TotpMultiFactorGenerator.assertionForSignIn(
      totpHint.uid,
      verificationCode
    );
    const credential = await resolver.resolveSignIn(assertion);
    return mapCompleted(credential.user, 'password', true);
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

export async function getFirebaseIdToken(user: User) {
  return user.getIdToken(true);
}

export function getSignedInFirebaseUser() {
  const e2eHarness = getE2eFirebaseHarness();
  if (e2eHarness?.currentUser) {
    return createE2eFirebaseUser(e2eHarness.currentUser);
  }

  const auth = ensureFirebaseAuth();
  return auth.currentUser;
}

export function hasPendingGoogleRedirect() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.sessionStorage.getItem(GOOGLE_REDIRECT_PENDING_KEY) === '1';
}
