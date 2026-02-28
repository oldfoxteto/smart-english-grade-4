import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../core/ProgressContext';
import { useNotification } from '../core/NotificationContext';
import { getOnboardingProfile, isAdminUser } from '../core/auth';
import {
  getGamificationStatus,
  getLearningPath,
  type GamificationStatus,
  type LearningPathResponse,
} from '../core/api';
import { grammarLessons, quizQuestions, readingStories, vocabularyWords } from '../core/data';
import { getAllA1Lessons } from '../core/a1Content';
import {
  getActiveRemediationPlan,
  getMasteryThreshold,
  getNextRecommendedLesson,
  getOverallMastery,
  getSkillMasterySummary,
  getUnitRoadmap,
  subscribeToMasteryUpdates,
} from '../core/masteryEngine';
import { playClick } from '../core/sounds';

const GamificationPanel = lazy(() => import('../components/GamificationPanel'));
const DailyMissionsPanel = lazy(() => import('../components/DailyMissionsPanel'));
const MicrolearningSession = lazy(() => import('../components/MicrolearningSession'));

const HomePage = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { notifyError } = useNotification();
  const onboarding = getOnboardingProfile();
  const isAdmin = isAdminUser();

  const [backendPath, setBackendPath] = useState<LearningPathResponse | null>(null);
  const [gamification, setGamification] = useState<GamificationStatus | null>(null);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(true);
  const [masteryRevision, setMasteryRevision] = useState(0);

  const allLessons = useMemo(() => getAllA1Lessons(), []);
  const masteryThreshold = getMasteryThreshold();
  const skillMastery = useMemo(
    () => getSkillMasterySummary(),
    // This state update is triggered by mastery engine update events.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [masteryRevision]
  );
  const overallMastery = useMemo(
    () => getOverallMastery(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [masteryRevision]
  );
  const nextLesson = useMemo(
    () => getNextRecommendedLesson(allLessons),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allLessons, masteryRevision]
  );
  const activeRemediation = useMemo(
    () => getActiveRemediationPlan(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [masteryRevision]
  );
  const roadmap = useMemo(
    () => getUnitRoadmap(allLessons),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allLessons, masteryRevision]
  );

  useEffect(() => {
    const unsubscribe = subscribeToMasteryUpdates(() => {
      setMasteryRevision((value) => value + 1);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!apiError) return;
    notifyError(apiError);
    setApiError('');
  }, [apiError, notifyError]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const languageCode = onboarding?.languageCode || 'en';
        const goalType = onboarding?.goalType || 'work';
        const [path, game] = await Promise.all([getLearningPath(languageCode, goalType), getGamificationStatus()]);
        setBackendPath(path);
        setGamification(game);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load dashboard data.';
        setApiError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, [onboarding?.goalType, onboarding?.languageCode]);

  const totalXp = gamification?.totalXp ?? progress.stars;
  const level = gamification?.level ?? progress.level;
  const streak = gamification?.currentStreakDays ?? 1;
  const nextLevelXp = level * 100;
  const currentLevelXp = (level - 1) * 100;
  const levelProgress = Math.max(
    0,
    Math.min(100, ((totalXp - currentLevelXp) / Math.max(1, nextLevelXp - currentLevelXp)) * 100)
  );

  const localModules = [
    {
      title: 'Vocabulary',
      subtitle: 'Daily words and usage',
      path: '/vocabulary',
      total: vocabularyWords.length,
      completed: progress.vocabularyCompleted.length,
    },
    {
      title: 'Grammar',
      subtitle: 'Core rules and patterns',
      path: '/grammar',
      total: grammarLessons.length,
      completed: progress.grammarCompleted.length,
    },
    {
      title: 'Reading',
      subtitle: 'Short stories + checks',
      path: '/reading',
      total: readingStories.length,
      completed: progress.storiesCompleted.length,
    },
    {
      title: 'Quiz',
      subtitle: 'Quick level snapshot',
      path: '/quiz',
      total: quizQuestions.length,
      completed:
        progress.quizScores.length > 0
          ? Math.round(
              (progress.quizScores[progress.quizScores.length - 1].score /
                Math.max(1, progress.quizScores[progress.quizScores.length - 1].total)) *
                quizQuestions.length
            )
          : 0,
    },
  ];

  return (
    <Box sx={{ pb: 6, minHeight: '100vh' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0B4B88 0%, #0C7FA0 60%, #7BC8A4 100%)',
          py: { xs: 3, md: 4 },
          px: { xs: 2, md: 3 },
          mb: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, mb: 1 }}>
          Mission Control
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
          Welcome back, {progress.username}. Keep momentum with one focused mission.
        </Typography>
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
        {apiError && <Alert severity="warning" sx={{ mb: 2 }}>{apiError}</Alert>}

        <Suspense fallback={<Box sx={{ mb: 3 }} />}>
          <GamificationPanel totalXp={totalXp} level={level} streak={streak} levelProgress={levelProgress} />
        </Suspense>

        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
                  Next Recommended Lesson
                </Typography>
                {nextLesson ? (
                  <>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                      {nextLesson.titleAr}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      {nextLesson.description}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
                      <Chip label={`Unit ${nextLesson.unit}`} />
                      <Chip label={nextLesson.category} color="primary" />
                      <Chip label={`${nextLesson.duration} min`} />
                      <Chip label={`Unlock target ${masteryThreshold}%`} color="warning" />
                    </Stack>
                    <Button
                      variant="contained"
                      onClick={() => {
                        playClick();
                        navigate(`/lesson/${nextLesson.id}`);
                      }}
                      sx={{ mr: 1 }}
                    >
                      Continue Learning
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        playClick();
                        navigate('/lessons');
                      }}
                    >
                      Open Lesson Map
                    </Button>
                  </>
                ) : (
                  <Alert severity="info">No lesson recommendation yet.</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 1.5 }}>
                  Skill Mastery
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Overall mastery: <strong>{overallMastery}%</strong>
                </Typography>
                <Stack spacing={1.25}>
                  {skillMastery.map((entry) => (
                    <Box key={entry.key}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption">{entry.label}</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                          {entry.score}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={entry.score}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          background: '#EEF3FA',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background:
                              entry.score >= 75
                                ? 'linear-gradient(90deg, #2E7D32, #66BB6A)'
                                : entry.score >= 55
                                  ? 'linear-gradient(90deg, #EF6C00, #FFA726)'
                                  : 'linear-gradient(90deg, #C62828, #EF5350)',
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {activeRemediation && (
          <Alert
            severity="warning"
            sx={{ mb: 3 }}
            action={
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  playClick();
                  const query = new URLSearchParams({
                    scenario: activeRemediation.aiScenario,
                    message: activeRemediation.aiPrompt,
                    remediationPlanId: activeRemediation.id,
                  });
                  navigate(`/ai-tutor?${query.toString()}`);
                }}
              >
                Start AI Recovery
              </Button>
            }
          >
            <strong>{activeRemediation.title}</strong> - {activeRemediation.reason}
          </Alert>
        )}

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 1.5 }}>
              Learning Roadmap
            </Typography>
            <Grid container spacing={1.5}>
              {roadmap.map((unit) => {
                const unlockedPct = Math.round((unit.unlocked / Math.max(1, unit.total)) * 100);
                const masteryPct = Math.round((unit.mastered / Math.max(1, unit.total)) * 100);
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={unit.unit}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.75 }}>
                          Unit {unit.unit}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Unlocked {unit.unlocked}/{unit.total}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={unlockedPct}
                          sx={{ mt: 0.75, mb: 1, height: 7, borderRadius: 4 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Mastered {unit.mastered}/{unit.total}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={masteryPct}
                          sx={{
                            mt: 0.75,
                            height: 7,
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': { background: '#2E7D32' },
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>

        <Suspense fallback={<Box sx={{ mb: 2.5 }} />}>
          <DailyMissionsPanel />
        </Suspense>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
            7-Minute Smart Sessions
          </Typography>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Suspense fallback={<Box />}>
                <MicrolearningSession
                  title="Word Recall Sprint"
                  description="Learn and use 10 practical words with sentence context."
                  duration={5}
                  difficulty="easy"
                  type="vocabulary"
                />
              </Suspense>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Suspense fallback={<Box />}>
                <MicrolearningSession
                  title="Grammar Precision"
                  description="One grammar rule + instant corrective examples."
                  duration={7}
                  difficulty="medium"
                  type="grammar"
                />
              </Suspense>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Suspense fallback={<Box />}>
                <MicrolearningSession
                  title="Reading Quick Check"
                  description="Short text with immediate understanding checks."
                  duration={6}
                  difficulty="easy"
                  type="reading"
                />
              </Suspense>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 900, mb: 1.5 }}>
          Quick Modules
        </Typography>
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {localModules.map((module) => {
            const pct = Math.round((module.completed / Math.max(1, module.total)) * 100);
            return (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={module.title}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>
                      {module.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.25 }}>
                      {module.subtitle}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {module.completed}/{module.total}
                    </Typography>
                    <LinearProgress variant="determinate" value={pct} sx={{ mt: 0.75, mb: 1.25, height: 7, borderRadius: 4 }} />
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      onClick={() => {
                        playClick();
                        navigate(module.path);
                      }}
                    >
                      Open
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {backendPath && (
          <Card sx={{ mb: 1.5 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                Backend Learning Path Snapshot
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                CEFR {backendPath.cefr} | Goal {backendPath.goalType} | Lessons {backendPath.lessons.length}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {backendPath.recommendedTrackCodes.slice(0, 6).map((code) => (
                  <Chip key={code} label={code} size="small" />
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}

        {isAdmin && (
          <Button variant="text" onClick={() => navigate('/analytics-dashboard')}>
            Open Admin Analytics
          </Button>
        )}

        {loading && <Typography variant="caption" color="text.secondary">Loading dashboard data...</Typography>}
      </Box>
    </Box>
  );
};

export default HomePage;

