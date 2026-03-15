import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { CssBaseline } from '@mui/material';
import './core/i18n';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const VocabularyPage = lazy(() => import('./pages/VocabularyPage'));
const GrammarPage = lazy(() => import('./pages/GrammarPage'));
const ReadingPage = lazy(() => import('./pages/ReadingPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const AITutorPage = lazy(() => import('./pages/AITutorPage'));
const PlacementTestPage = lazy(() => import('./pages/PlacementTestPage'));
const AnalyticsDashboardPage = lazy(() => import('./pages/AnalyticsDashboardPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const LessonsPage = lazy(() => import('./pages/LessonsPage'));
const SpeedRushPage = lazy(() => import('./pages/SpeedRushPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const ReadingQuestPage = lazy(() => import('./pages/ReadingQuestPage'));
const PracticePage = lazy(() =>
  import('./pages/PracticePage').then((module) => ({ default: module.PracticePage }))
);
const TestingPage = lazy(() =>
  import('./pages/TestingPage').then((module) => ({ default: module.TestingPage }))
);
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage }))
);
const AdvancedLearningHub = lazy(() => import('./pages/AdvancedLearningHub'));

import { getCurrentUser, isOnboardingCompleted, subscribeAuthChange } from './core/auth';
import { restoreSession } from './core/api';
import { NotificationProvider } from './core/NotificationContext';

function App() {
  const { i18n } = useTranslation();
  const [authReady, setAuthReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const onboarded = isOnboardingCompleted();

  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const appTheme = createTheme({
    direction,
    palette: {
      primary: { main: '#4CAF50', contrastText: '#FFFFFF' },
      secondary: { main: '#2196F3', contrastText: '#FFFFFF' },
      background: { default: '#F4F9F4', paper: '#FFFFFF' },
      text: { primary: '#2E3D49', secondary: '#546E7A' },
      success: { main: '#81C784' },
      warning: { main: '#FFB74D' },
      info: { main: '#4FC3F7' },
      error: { main: '#E57373' }
    },
    typography: {
      fontFamily: '"Nunito", "Tajawal", "Cairo", sans-serif',
      h1: { fontWeight: 900, color: '#1B5E20' },
      h2: { fontWeight: 800, color: '#1B5E20' },
      h3: { fontWeight: 800, color: '#1B5E20' },
      h4: { fontWeight: 800, color: '#1B5E20' },
      h5: { fontWeight: 800, color: '#1B5E20' },
      h6: { fontWeight: 800, color: '#1B5E20' },
      button: { textTransform: 'none', fontWeight: 700 },
    },
    shape: { borderRadius: 16 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 24, padding: '10px 24px', boxShadow: 'none' }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #E8F5E9' }
        }
      }
    }
  });
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;
    document.body.dir = direction;
    document.body.style.textAlign = direction === 'rtl' ? 'right' : 'left';
  }, [direction, i18n.language]);

  useEffect(() => {
    let active = true;
    const syncFromStorage = () => {
      const user = getCurrentUser();
      setAuthed(Boolean(user));
      setIsAdmin(Boolean(user?.roles?.includes('admin')));
    };

    const unsubscribe = subscribeAuthChange(() => {
      if (!active) return;
      syncFromStorage();
    });

    void restoreSession()
      .then((session) => {
        if (!active) return;
        const user = session?.user || getCurrentUser();
        setAuthed(Boolean(user));
        setIsAdmin(Boolean(user?.roles?.includes('admin')));
      })
      .catch(() => {
        if (!active) return;
        const user = getCurrentUser();
        setAuthed(Boolean(user));
        setIsAdmin(Boolean(user?.roles?.includes('admin')));
      })
      .finally(() => {
        if (active) {
          setAuthReady(true);
        }
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  if (!authReady) {
    return null;
  }

  const defaultRedirect = authed ? (onboarded ? '/home' : '/onboarding') : '/login';

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <NotificationProvider>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/" element={<Navigate to={defaultRedirect} replace />} />
            <Route element={authed && onboarded ? <MainLayout /> : <Navigate to="/login" replace />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/lessons" element={<LessonsPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/testing" element={<TestingPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/advanced-learning" element={<AdvancedLearningHub />} />
              <Route path="/placement-test" element={<PlacementTestPage />} />
              <Route path="/vocabulary" element={<VocabularyPage />} />
              <Route path="/grammar" element={<GrammarPage />} />
              <Route path="/reading" element={<ReadingPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/ai-tutor" element={<AITutorPage />} />
              <Route
                path="/analytics-dashboard"
                element={isAdmin ? <AnalyticsDashboardPage /> : <Navigate to="/home" replace />}
              />
              <Route path="/lesson/:lessonId" element={<LessonPage />} />
              <Route path="/speed-rush" element={<SpeedRushPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/reading-quest" element={<ReadingQuestPage />} />
              <Route path="*" element={<Navigate to={authed ? '/home' : '/login'} replace />} />
            </Route>
          </Routes>
        </Suspense>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
