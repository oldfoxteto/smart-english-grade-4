import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useTranslation } from 'react-i18next';
import { useProgress } from '../core/ProgressContext';
import { login, loginWithFirebase, register, type AuthResponse } from '../core/api';
import { isOnboardingCompleted, saveCurrentUser, saveTokens } from '../core/auth';
import {
  beginTotpEnrollment,
  consumeGoogleRedirectSignIn,
  completeTotpSignIn,
  confirmTotpEnrollment,
  firebaseAuthEnabled,
  getFirebaseIdToken,
  getSignedInFirebaseUser,
  hasPendingGoogleRedirect,
  isLanDevelopmentHost,
  loginWithFirebaseEmail,
  registerWithFirebaseEmail,
  sendFirebasePasswordReset,
  signOutFirebaseSession,
  signInWithGoogle,
  type CompletedFirebaseAuth,
  type PendingMfaSignIn,
  type TotpEnrollment,
} from '../core/firebaseAuth';
import { AuthLoginForm, type SocialProvider } from '../components/auth/AuthLoginForm';
import { LoginReferenceOverlay } from '../components/auth/LoginReferenceOverlay';
import { AuthTotpPanel } from '../components/auth/AuthTotpPanel';
import { authCardSx, authInputSx } from '../components/auth/authStyles';

const firebaseEnabled = firebaseAuthEnabled();
const lanDevelopmentMode = isLanDevelopmentHost();
const firebaseTotpEnabled = import.meta.env.VITE_FIREBASE_TOTP_MFA === 'true';
const FIREBASE_BRIDGE_TIMEOUT_MS = 15000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string) {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => reject(new Error(message)), timeoutMs);

    promise
      .then((value) => {
        window.clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        window.clearTimeout(timeoutId);
        reject(error);
      });
  });
}

export default function LoginPage() {
  const { setUsername } = useProgress();
  const { i18n } = useTranslation();
  const overlayEnabled =
    typeof window !== 'undefined'
    && new URLSearchParams(window.location.search).get('overlay') === '1';
  const [role, setRole] = useState<'student' | 'parent'>('parent');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentPin, setStudentPin] = useState('');
  const [mode, setMode] = useState<'register' | 'login'>('login');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [enableTwoFactor, setEnableTwoFactor] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [pendingEnrollment, setPendingEnrollment] = useState<TotpEnrollment | null>(null);
  const [pendingAuth, setPendingAuth] = useState<CompletedFirebaseAuth | null>(null);
  const [pendingMfaSignIn, setPendingMfaSignIn] = useState<PendingMfaSignIn | null>(null);

  const emailAuthMode: 'firebase' | 'local' = firebaseEnabled ? 'firebase' : 'local';
  const canUseTotpMfa = firebaseEnabled && firebaseTotpEnabled;
  const inSecondaryStep = Boolean(pendingEnrollment || pendingMfaSignIn);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    if (lanDevelopmentMode) {
      setInfo('Firebase sign-in is disabled on LAN IP addresses. Open the app on localhost or continue with local email/password login.');
      return;
    }

    if (!firebaseEnabled) {
      setInfo('Firebase web settings are incomplete, so the app will use local email/password login only.');
      return;
    }

    if (import.meta.env.DEV) {
      setInfo('Firebase sign-in is enabled for localhost development.');
    }
  }, []);

  useEffect(() => {
    if (!firebaseEnabled) {
      return;
    }

    let active = true;

    const restoreGoogleRedirect = async () => {
      try {
        const redirectPending = hasPendingGoogleRedirect();
        const authResult = await consumeGoogleRedirectSignIn();
        const fallbackFirebaseUser = authResult || !redirectPending ? null : getSignedInFirebaseUser();

        if (!active || (!authResult && !fallbackFirebaseUser)) {
          return;
        }

        setLoading(true);
        const resolvedAuthResult: CompletedFirebaseAuth = authResult || {
          kind: 'complete',
          user: fallbackFirebaseUser!,
          providerId: 'google.com',
          mfaCompleted: false,
        };
        await finalizeFirebaseSession(resolvedAuthResult, {
          fallbackName: resolvedAuthResult.user.displayName || resolvedAuthResult.user.email || 'Student',
        });
      } catch (err) {
        await signOutFirebaseSession().catch(() => undefined);
        if (!active) {
          return;
        }

        const message = err instanceof Error ? err.message : '';
        if (message && message !== 'Redirecting to Google sign-in...') {
          setError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void restoreGoogleRedirect();

    return () => {
      active = false;
    };
  }, []);

  const clearSecondaryFlow = () => {
    setPendingEnrollment(null);
    setPendingAuth(null);
    setPendingMfaSignIn(null);
    setTotpCode('');
  };

  const resetMessages = () => {
    setError('');
    setInfo('');
  };

  const completeAppSession = (response: AuthResponse, fallbackName?: string) => {
    saveTokens(response.token, undefined, rememberMe);
    saveCurrentUser(response.user);
    setUsername(response.user.displayName || fallbackName || 'Student');
    window.location.replace(isOnboardingCompleted() ? '/home' : '/onboarding');
  };

  const finalizeFirebaseSession = async (
    authResult: CompletedFirebaseAuth,
    options?: { mfaCompleted?: boolean; fallbackName?: string }
  ) => {
    const idToken = await withTimeout(
      getFirebaseIdToken(authResult.user),
      FIREBASE_BRIDGE_TIMEOUT_MS,
      'Timed out while reading your Firebase session. Please try signing in again.'
    );
    const response = await withTimeout(
      loginWithFirebase({
        idToken,
        displayName: authResult.user.displayName || displayName.trim(),
        country: 'SA',
        requestedProvider: authResult.providerId,
        mfaCompleted: options?.mfaCompleted ?? authResult.mfaCompleted,
      }),
      FIREBASE_BRIDGE_TIMEOUT_MS,
      'Timed out while creating your app session. Please try again.'
    );
    completeAppSession(
      response,
      options?.fallbackName || authResult.user.displayName || displayName.trim()
    );
  };

  const maybeStartTwoFactorEnrollment = async (
    authResult: CompletedFirebaseAuth,
    fallbackName?: string
  ) => {
    if (!canUseTotpMfa || !enableTwoFactor || emailAuthMode !== 'firebase' || authResult.providerId !== 'password') {
      await finalizeFirebaseSession(authResult, { fallbackName });
      return;
    }

    const enrollment = await beginTotpEnrollment(authResult.user);
    setPendingAuth(authResult);
    setPendingEnrollment(enrollment);
    setPendingMfaSignIn(null);
    setTotpCode('');
    setInfo('Scan the QR code, then enter your authenticator code to finish 2FA setup.');
  };

  const handleLegacyAction = async (targetMode: 'login' | 'register') => {
    const payload = {
      email: email.trim().toLowerCase(),
      password,
      displayName: displayName.trim(),
      country: 'SA',
    };

    const response = targetMode === 'register' ? await register(payload) : await login(payload);
    completeAppSession(response, displayName.trim());
  };

  const tryLegacyLoginFallback = async () => {
    try {
      await handleLegacyAction('login');
      return true;
    } catch {
      return false;
    }
  };

  const handleForgotPassword = async () => {
    resetMessages();
    clearSecondaryFlow();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError('Please enter your email address first.');
      return;
    }

    if (emailAuthMode !== 'firebase') {
      setInfo('Password reset is currently available through Firebase accounts only.');
      return;
    }

    setLoading(true);

    try {
      await sendFirebasePasswordReset(normalizedEmail);
      setInfo('We sent a password reset link to your email address. Check inbox and spam.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send a password reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAction = async (targetMode: 'login' | 'register') => {
    setMode(targetMode);
    resetMessages();
    clearSecondaryFlow();
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail || !password) {
        throw new Error('Please enter your email and password first.');
      }

      if (targetMode === 'register' && !displayName.trim()) {
        throw new Error('Please enter your name to create an account.');
      }

      if (emailAuthMode === 'local') {
        await handleLegacyAction(targetMode);
        return;
      }

      if (targetMode === 'register') {
        await registerWithFirebaseEmail(
          normalizedEmail,
          password,
          displayName.trim()
        );
        await signOutFirebaseSession();
        setMode('login');
        clearSecondaryFlow();
        setInfo('Your account was created successfully. A verification email was also sent to your inbox.');
        return;
      }

      let signedIn;

      try {
        signedIn = await loginWithFirebaseEmail(normalizedEmail, password);
      } catch (firebaseError) {
        const usedLegacyFallback = await tryLegacyLoginFallback();
        if (usedLegacyFallback) {
          return;
        }

        throw firebaseError;
      }

      if (signedIn.kind === 'mfa-required') {
        setPendingMfaSignIn(signedIn);
        setInfo(`Enter the code from ${signedIn.factorLabel} to continue.`);
        return;
      }

      if (canUseTotpMfa && enableTwoFactor && signedIn.providerId === 'password' && !signedIn.mfaCompleted) {
        await maybeStartTwoFactorEnrollment(signedIn);
        return;
      }

      await finalizeFirebaseSession(signedIn, { fallbackName: displayName.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to complete authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (_provider: SocialProvider) => {
    resetMessages();
    clearSecondaryFlow();
    setLoading(true);

    try {
      const authResult = await signInWithGoogle();

      await finalizeFirebaseSession(authResult, {
        fallbackName: authResult.user.displayName || authResult.user.email || 'Student',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Social sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleTotpConfirm = async () => {
    setError('');
    setLoading(true);

    try {
      if (pendingMfaSignIn) {
        const signedIn = await completeTotpSignIn(
          pendingMfaSignIn.resolver,
          totpCode.trim()
        );
        clearSecondaryFlow();
        await finalizeFirebaseSession(signedIn, { mfaCompleted: true });
      } else if (pendingEnrollment && pendingAuth) {
        const enrolled = await confirmTotpEnrollment(
          pendingAuth.user,
          pendingEnrollment,
          totpCode.trim()
        );
        clearSecondaryFlow();
        await finalizeFirebaseSession(enrolled, {
          mfaCompleted: true,
          fallbackName: pendingAuth.user.displayName || displayName.trim(),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to complete two-factor verification.');
    } finally {
      setLoading(false);
    }
  };

  const showParentLogin = () => {
    setRole('parent');
    resetMessages();
    clearSecondaryFlow();
  };

  const showStudentAccess = () => {
    setRole('student');
    resetMessages();
    clearSecondaryFlow();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
        position: 'relative',
        overflow: 'hidden',
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 5 },
        backgroundImage:
          'url(https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <LoginReferenceOverlay enabled={overlayEnabled} />

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 460,
          textAlign: 'center',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              position: 'relative',
              width: 72,
              height: 72,
              mx: 'auto',
              mb: 2.2,
              borderRadius: '18px',
              bgcolor: 'rgba(255,255,255,0.1)',
              display: 'grid',
              placeItems: 'center',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
            }}
          >
            <Typography sx={{ fontSize: '2.2rem', lineHeight: 1 }}>🐝</Typography>
          </Box>

          <Typography
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.2rem', sm: '2.5rem' },
              lineHeight: 1,
              letterSpacing: '-0.04em',
              textShadow: '0 5px 20px rgba(0,0,0,0.28)',
            }}
          >
            <Box component="span" sx={{ color: '#f2bc21' }}>
              Bee
            </Box>
            <Box component="span" sx={{ color: '#ffffff' }}>
              Fluent
            </Box>
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              color: '#cbd5e1',
              fontWeight: 500,
              fontSize: '0.95rem',
              textShadow: '0 4px 18px rgba(0,0,0,0.32)',
            }}
          >
            English Learning Academy
          </Typography>
        </Box>

        <Box sx={{ ...authCardSx, px: { xs: 2.2, sm: 3 }, py: { xs: 2.8, sm: 3.2 } }}>
          {role === 'student' ? (
            <Stack spacing={2.4} dir="ltr">
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <IconButton onClick={showParentLogin} sx={{ color: '#ffffff' }}>
                  <ArrowBackRoundedIcon sx={{ transform: i18n.language === 'ar' ? 'rotate(180deg)' : 'none' }} />
                </IconButton>
              </Box>

              <Box sx={{ textAlign: 'center', mt: -1 }}>
                <SchoolRoundedIcon sx={{ fontSize: 42, color: '#ffffff', mb: 0.5 }} />
                <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: '1.6rem' }}>
                  Student Access
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.95rem', mt: 0.5 }}>
                  Continue with your nickname and classroom PIN.
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ mb: 0.8, fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', textAlign: 'left' }}>
                  Nickname
                </Typography>
                <TextField
                  fullWidth
                  placeholder="e.g. Noor_4A"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  sx={authInputSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonRoundedIcon sx={{ color: 'rgba(255,255,255,0.82)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ mb: 0.8, fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', textAlign: 'left' }}>
                  PIN
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  placeholder="Enter your classroom PIN"
                  value={studentPin}
                  onChange={(event) => setStudentPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
                  sx={authInputSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon sx={{ color: 'rgba(255,255,255,0.82)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Button
                fullWidth
                variant="contained"
                disabled={loading || !displayName || studentPin.length < 1}
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    saveCurrentUser({
                      id: 'student',
                      email: 'student@beefluent.com',
                      displayName,
                      roles: ['student'],
                    });
                    saveTokens('dev-token', 'dev-refresh', true);
                    setUsername(displayName);
                    window.location.replace('/home');
                  }, 1200);
                }}
                sx={{
                  minHeight: 54,
                  borderRadius: '999px',
                  fontSize: '1rem',
                  fontWeight: 900,
                  background: 'linear-gradient(180deg, #4d90ff 0%, #2f6dff 54%, #1f54d7 100%)',
                  boxShadow: '0 12px 24px rgba(19,56,166,0.38), 0 2px 0 rgba(255,255,255,0.3) inset',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Start Learning'}
              </Button>
            </Stack>
          ) : inSecondaryStep ? (
            <AuthTotpPanel
              loading={loading}
              totpCode={totpCode}
              pendingEnrollment={pendingEnrollment}
              onCodeChange={(value) => setTotpCode(value.replace(/\D/g, '').slice(0, 6))}
              onConfirm={() => void handleTotpConfirm()}
              onBack={clearSecondaryFlow}
            />
          ) : (
            <AuthLoginForm
              mode={mode}
              googleEnabled={firebaseEnabled}
              showPassword={showPassword}
              rememberMe={rememberMe}
              displayName={displayName}
              email={email}
              password={password}
              loading={loading}
              enableTwoFactor={enableTwoFactor}
              showTwoFactor={canUseTotpMfa}
              error={error}
              info={info}
              onDisplayNameChange={setDisplayName}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onRememberMeChange={setRememberMe}
              onShowPasswordToggle={() => setShowPassword(!showPassword)}
              onEnableTwoFactorChange={setEnableTwoFactor}
              onForgotPassword={() => void handleForgotPassword()}
              onEmailAction={handleEmailAction}
              onSocialSignIn={handleSocialSignIn}
            />
          )}
        </Box>

        {role === 'parent' ? (
          <Button
            onClick={showStudentAccess}
            sx={{
              mt: 1.8,
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.98rem',
              textTransform: 'none',
              textShadow: '0 4px 18px rgba(0,0,0,0.32)',
            }}
          >
            Student access
          </Button>
        ) : (
          <Button
            onClick={showParentLogin}
            sx={{
              mt: 1.8,
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.98rem',
              textTransform: 'none',
              textShadow: '0 4px 18px rgba(0,0,0,0.32)',
            }}
          >
            Back to parent login
          </Button>
        )}
      </Box>
    </Box>
  );
}
