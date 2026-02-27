import { useEffect, useMemo, useState, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Box, Button, Card, CardContent, Chip, Grid, LinearProgress, Typography } from "@mui/material";
import { useNotification } from "../core/NotificationContext";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../core/ProgressContext";
import { grammarLessons, quizQuestions, readingStories, vocabularyWords } from "../core/data";
import { getGamificationStatus, getLearningPath, type GamificationStatus, type LearningPathResponse } from "../core/api";
import { getOnboardingProfile, isAdminUser } from "../core/auth";
import { playClick } from '../core/sounds';
const GamificationPanel = lazy(() => import('../components/GamificationPanel'))
import MicrolearningSession from "../components/MicrolearningSession";
const DailyMissionsPanel = lazy(() => import('../components/DailyMissionsPanel'))

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { progress } = useProgress();
  const isAdmin = isAdminUser();
  const onboarding = getOnboardingProfile();

  const [backendPath, setBackendPath] = useState<LearningPathResponse | null>(null);
  const [gamification, setGamification] = useState<GamificationStatus | null>(null);
  const [apiError, setApiError] = useState("");
  const { notifyError } = useNotification();

  useEffect(() => {
    if (apiError) {
      notifyError(apiError);
      setApiError('');
    }
  }, [apiError, notifyError]);
  const [loading, setLoading] = useState(true);

  const localModules = useMemo(
    () => [
      {
        title: t("lessons.vocabulary"),
        subtitle: "تعلم كلمات جديدة",
        path: "/vocabulary",
        gradient: "linear-gradient(135deg, #1D7AFC 0%, #33B1FF 100%)",
        total: vocabularyWords.length,
        completed: progress.vocabularyCompleted.length
      },
      {
        title: t("lessons.grammar"),
        subtitle: "أتقن الأساسيات",
        path: "/grammar",
        gradient: "linear-gradient(135deg, #EF5350 0%, #FF8A80 100%)",
        total: grammarLessons.length,
        completed: progress.grammarCompleted.length
      },
      {
        title: "القراءة",
        subtitle: t("lessons.exercises"),
        path: "/reading",
        gradient: "linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)",
        total: readingStories.length,
        completed: progress.storiesCompleted.length
      },
      {
        title: t("quiz.title"),
        subtitle: "قياس مستوى سريع",
        path: "/quiz",
        gradient: "linear-gradient(135deg, #FB8C00 0%, #FFB74D 100%)",
        total: quizQuestions.length,
        completed:
          progress.quizScores.length > 0
            ? Math.round((progress.quizScores[progress.quizScores.length - 1].score / progress.quizScores[progress.quizScores.length - 1].total) * quizQuestions.length)
            : 0
      },
      {
        title: t("aiTutor.title"),
        subtitle: "تصحيح وتدريب فوري",
        path: "/ai-tutor",
        gradient: "linear-gradient(135deg, #5E35B1 0%, #7E57C2 100%)",
        total: 1,
        completed: 0
      },
      ...(isAdmin
        ? [
            {
              title: t("analytics.title"),
              subtitle: "مراقبة الأداء",
              path: "/analytics-dashboard",
              gradient: "linear-gradient(135deg, #263238 0%, #455A64 100%)",
              total: 1,
              completed: 0
            }
          ]
        : [])
    ],
    [isAdmin, progress, t]
  );

  useEffect(() => {
    const loadBackendData = async () => {
      try {
        setApiError("");
        const languageCode = onboarding?.languageCode || "en";
        const goalType = onboarding?.goalType || "work";

        const [path, game] = await Promise.all([getLearningPath(languageCode, goalType), getGamificationStatus()]);
        setBackendPath(path);
        setGamification(game);
      } catch (error) {
        const message = error instanceof Error ? error.message : "تعذر تحميل بيانات الخطة التعليمية";
        setApiError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadBackendData();
  }, [onboarding?.goalType, onboarding?.languageCode]);

  const totalXp = gamification?.totalXp ?? progress.stars;
  const level = gamification?.level ?? progress.level;
  const streak = gamification?.currentStreakDays ?? 1;
  const nextLevelXp = level * 100;
  const currentLevelXp = (level - 1) * 100;
  const levelProgress = Math.max(0, Math.min(100, ((totalXp - currentLevelXp) / Math.max(1, nextLevelXp - currentLevelXp)) * 100));

  return (
    <Box sx={{ pb: 6, minHeight: '100vh' }}>
      <Box
        sx={{
          background: "linear-gradient(135deg, #0B4B88 0%, #0C7FA0 60%, #7BC8A4 100%)",
          py: { xs: 2, sm: 3, md: 5 },
          px: { xs: 1.5, sm: 2, md: 3 },
          mb: { xs: 2, sm: 3, md: 4 },
          textAlign: "center",
          borderRadius: { xs: 0, md: '0 0 30px 30px' },
          boxShadow: '0 4px 20px rgba(11, 75, 136, 0.15)'
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: "white", 
            fontWeight: 900, 
            mb: 0.8, 
            fontSize: { xs: "1.4rem", sm: "1.7rem", md: "2.2rem" },
            lineHeight: 1.2
          }}
        >
          أهلاً {progress.username} 👋
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: "rgba(255,255,255,0.9)", 
            mb: 2,
            fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" }
          }}
        >
          مسارك التعليمي الذكي جاهز 🎯
        </Typography>

        <Box sx={{ maxWidth: { xs: 320, sm: 400, md: 460 }, mx: "auto" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, gap: 1, flexWrap: "wrap" }}>
            <Chip 
              label={`المستوى ${level}`} 
              sx={{ 
                background: "rgba(255,255,255,0.22)", 
                color: "white", 
                fontWeight: 700,
                fontSize: { xs: "0.8rem", sm: "0.9rem" }
              }} 
            />
            <Chip 
              label={`XP ${totalXp}`} 
              sx={{ 
                background: "rgba(255,200,0,0.28)", 
                color: "white", 
                fontWeight: 700,
                fontSize: { xs: "0.8rem", sm: "0.9rem" }
              }} 
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={levelProgress}
            sx={{
              height: { xs: 8, sm: 10, md: 11 },
              borderRadius: 6,
              background: "rgba(255,255,255,0.22)",
              "& .MuiLinearProgress-bar": { 
                background: "linear-gradient(90deg, #FFD54F, #FFA000)", 
                borderRadius: 6 
              }
            }}
          />
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)", mt: 0.5, display: "block" }}>
            {Math.round(levelProgress)}% إلى المستوى التالي
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        {apiError && <Alert severity="warning" sx={{ mb: 2 }}>{apiError}</Alert>}

        {/* Gamification Panel */}
        <Suspense fallback={<Box sx={{ mb: 3 }} /> }>
          <GamificationPanel
            totalXp={totalXp}
            level={level}
            streak={streak}
            levelProgress={levelProgress}
          />
        </Suspense>

        {onboarding && (
          <Card sx={{ mb: 2.5 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>ملفك التعليمي</Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip label={`اللغة: ${onboarding.languageCode === "en" ? "الإنجليزية" : "اليونانية"}`} />
                <Chip label={`الهدف: ${onboarding.goalType}`} />
                <Chip label={`المستوى: ${onboarding.proficiency}`} />
                <Chip label={`الوقت اليومي: ${onboarding.dailyMinutes} دقيقة`} />
              </Box>
            </CardContent>
          </Card>
        )}

        {backendPath && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>الخطة المقترحة من النظام</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                CEFR: {backendPath.cefr} | الهدف: {backendPath.goalType} | عدد الدروس: {backendPath.lessons.length}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {backendPath.recommendedTrackCodes.slice(0, 6).map((code) => <Chip key={code} label={code} size="small" />)}
              </Box>
            </CardContent>
          </Card>
        )}

        <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.8, textAlign: "center" }}>
          اختر نشاطك الآن
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 3 }}>
          {loading ? "جاري تحميل التوصيات..." : "تقدم يوميا بخطوات قصيرة ومركزة"}
        </Typography>

        {/* Daily Missions Panel (lazy) */}
        <Suspense fallback={<Box sx={{ mb: 2.5 }} />}>
          <DailyMissionsPanel />
        </Suspense>

        {/* Microlearning Sessions */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, textAlign: "center" }}>
            ⚡ جلسات سريعة (3-7 دقائق)
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 2 
          }}>
            <MicrolearningSession
              title="مفردات اليوم"
              description="تعلم 10 كلمات جديدة بالإنجليزية مع أمثلة عملية"
              duration={5}
              difficulty="easy"
              type="vocabulary"
              onComplete={() => console.log('Vocabulary session completed')}
            />
            <MicrolearningSession
              title="قاعدة اليوم"
              description="أتقن قاعدة نحوية مهمة مع تمارين سريعة"
              duration={7}
              difficulty="medium"
              type="grammar"
              onComplete={() => console.log('Grammar session completed')}
            />
            <MicrolearningSession
              title="قراءة سريعة"
              description="نص قصير مع أسئلة فهم واستيعاب"
              duration={6}
              difficulty="easy"
              type="reading"
              onComplete={() => console.log('Reading session completed')}
            />
          </Box>
        </Box>

        <Grid container spacing={{ xs: 1.5, sm: 2, md: 2 }} justifyContent="center">
          {localModules.map((mod) => {
            const pct = Math.round((mod.completed / Math.max(1, mod.total)) * 100);
            return (
              <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }} key={mod.title}>
                <Card 
                  sx={{ 
                    height: "100%", 
                    border: "2px solid transparent", 
                    "&:hover": { 
                      borderColor: "#0B4B88",
                      transform: { xs: 'translateY(-2px)', sm: 'translateY(-4px)' }
                    },
                    transition: 'all 0.3s ease',
                    borderRadius: { xs: 16, sm: 20 }
                  }}
                >
                  <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.2 } }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 900,
                        fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" }
                      }}
                    >
                      {mod.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 1.5,
                        fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.95rem" }
                      }}
                    >
                      {mod.subtitle}
                    </Typography>
                    <Box sx={{ mb: 1.6 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.6 }}>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" } }}
                        >
                          التقدم
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: 700,
                            fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" }
                          }}
                        >
                          {mod.completed}/{mod.total}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                          height: { xs: 6, sm: 7, md: 8 },
                          borderRadius: 4,
                          background: "#EEF3FA",
                          "& .MuiLinearProgress-bar": { 
                            background: mod.gradient, 
                            borderRadius: 4 
                          }
                        }}
                      />
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: "text.secondary",
                          display: "block",
                          mt: 0.5,
                          fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" }
                        }}
                      >
                        {pct}% مكتمل
                      </Typography>
                    </Box>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      sx={{ 
                        fontWeight: 800, 
                        background: mod.gradient,
                        fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                        py: { xs: 0.8, sm: 1, md: 1.2 },
                        borderRadius: { xs: 10, sm: 12, md: 16 }
                      }} 
                      onClick={() => { playClick(); navigate(mod.path); }}
                    >
                      {mod.completed === 0 ? "ابدأ" : mod.completed === mod.total ? "مراجعة" : "متابعة"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;
