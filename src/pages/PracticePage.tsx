import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import RecordVoiceOverRoundedIcon from "@mui/icons-material/RecordVoiceOverRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import HeadphonesRoundedIcon from "@mui/icons-material/HeadphonesRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CenterFocusStrongRoundedIcon from "@mui/icons-material/CenterFocusStrongRounded";
import GraphicEqRoundedIcon from "@mui/icons-material/GraphicEqRounded";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import { playfulPalette } from "../theme/playfulPalette";
import {
  completePracticeExercise,
  getPracticeCatalog,
  type PracticeExerciseResponse,
} from "../core/api";

type ExerciseType = "pronunciation" | "listening" | "speaking" | "grammar" | "vocabulary";
type Difficulty = "beginner" | "intermediate" | "advanced";

interface PracticeExercise {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  type: ExerciseType;
  difficulty: Difficulty;
  duration: number;
  completed: boolean;
  score?: number;
  bestScore?: number;
  attempts: number;
  category: string;
  icon: React.ReactNode;
}

const MotionCard = motion(Card);

const glassCardSx = {
  borderRadius: 5,
  border: `1px solid ${playfulPalette.line}`,
  background: playfulPalette.glass,
  boxShadow: playfulPalette.glow,
  backdropFilter: "blur(14px)",
};

const tabLabels = ["الكل", "التحدث والنطق", "الاستماع", "القواعد والمفردات"];

const typeVisuals: Record<
  ExerciseType,
  { bg: string; color: string; chip: string; chipText: string; label: string }
> = {
  pronunciation: {
    bg: playfulPalette.softBlue,
    color: playfulPalette.ink,
    chip: "#D6F3FF",
    chipText: "#2D6E8F",
    label: "Pronunciation",
  },
  listening: {
    bg: playfulPalette.softMint,
    color: "#2A8B6C",
    chip: "#DDFBF0",
    chipText: "#2A8B6C",
    label: "Listening",
  },
  speaking: {
    bg: playfulPalette.softPink,
    color: "#B84A72",
    chip: "#FFE1EA",
    chipText: "#A24468",
    label: "Speaking",
  },
  grammar: {
    bg: playfulPalette.softPeach,
    color: "#A96324",
    chip: "#FFE8CF",
    chipText: "#A96324",
    label: "Grammar",
  },
  vocabulary: {
    bg: playfulPalette.softLilac,
    color: "#5F65C7",
    chip: "#E7E0FF",
    chipText: "#5F65C7",
    label: "Vocabulary",
  },
};

const difficultyVisuals: Record<Difficulty, { bg: string; color: string; label: string }> = {
  beginner: { bg: playfulPalette.softMint, color: "#2A8B6C", label: "Beginner" },
  intermediate: { bg: playfulPalette.softPeach, color: "#A96324", label: "Intermediate" },
  advanced: { bg: playfulPalette.softPink, color: "#A24468", label: "Advanced" },
};

const getScoreAccent = (score: number) => {
  if (score >= 80) return { track: "#DDFBF0", bar: "#38B889" };
  if (score >= 60) return { track: "#FFF1D8", bar: "#F0A93A" };
  return { track: "#FFE3EB", bar: "#E66B93" };
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const getExerciseIcon = (type: ExerciseType) => {
  switch (type) {
    case "pronunciation":
      return <RecordVoiceOverRoundedIcon />;
    case "listening":
      return <HeadphonesRoundedIcon />;
    case "speaking":
      return <MicRoundedIcon />;
    case "grammar":
      return <MenuBookRoundedIcon />;
    case "vocabulary":
      return <PsychologyRoundedIcon />;
    default:
      return <PsychologyRoundedIcon />;
  }
};

const decorateExercise = (exercise: PracticeExerciseResponse): PracticeExercise => ({
  ...exercise,
  score: exercise.score || undefined,
  bestScore: exercise.bestScore || undefined,
  icon: getExerciseIcon(exercise.type),
});

export const PracticePage: React.FC = () => {
  const [exercises, setExercises] = useState<PracticeExercise[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<PracticeExercise | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncMessage, setSyncMessage] = useState("");

  useEffect(() => {
    let active = true;
    getPracticeCatalog()
      .then((response) => {
        if (!active) return;
        setExercises(response.exercises.map(decorateExercise));
        setError("");
      })
      .catch(() => {
        if (!active) return;
        setError("Could not load live practice data right now.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      switch (activeTab) {
        case 1:
          return exercise.type === "pronunciation" || exercise.type === "speaking";
        case 2:
          return exercise.type === "listening";
        case 3:
          return exercise.type === "grammar" || exercise.type === "vocabulary";
        default:
          return true;
      }
    });
  }, [activeTab, exercises]);

  const completedCount = exercises.filter((exercise) => exercise.completed).length;
  const totalAttempts = exercises.reduce((acc, exercise) => acc + exercise.attempts, 0);
  const completedExercises = exercises.filter((exercise) => exercise.completed && exercise.bestScore);
  const averageScore = completedExercises.length
    ? Math.round(
        completedExercises.reduce((acc, exercise) => acc + (exercise.bestScore ?? 0), 0) /
          completedExercises.length,
      )
    : 0;

  const stats = [
    {
      label: "إجمالي التمارين",
      value: exercises.length,
      icon: <PsychologyRoundedIcon />,
      bg: playfulPalette.softBlue,
      color: playfulPalette.ink,
    },
    {
      label: "تمارين مكتملة",
      value: completedCount,
      icon: <CheckCircleRoundedIcon />,
      bg: playfulPalette.softMint,
      color: "#2A8B6C",
    },
    {
      label: "كل المحاولات",
      value: totalAttempts,
      icon: <TrendingUpRoundedIcon />,
      bg: playfulPalette.softPeach,
      color: "#A96324",
    },
    {
      label: "متوسط الأداء",
      value: `${averageScore}%`,
      icon: <StarRoundedIcon />,
      bg: playfulPalette.softLilac,
      color: "#5F65C7",
    },
  ];

  const handleStartExercise = (exercise: PracticeExercise) => {
    setSyncMessage("");
    setSelectedExercise(exercise);
    setIsPlaying(true);
    setIsRecording(false);
    setSessionTime(0);
  };

  const handleStopExercise = () => {
    const currentExercise = selectedExercise;
    const elapsedSeconds = sessionTime;
    setSelectedExercise(null);
    setIsPlaying(false);
    setIsRecording(false);
    setSessionTime(0);

    if (!currentExercise) return;

    const completionRatio = currentExercise.duration > 0 ? elapsedSeconds / (currentExercise.duration * 60) : 0;
    const score = elapsedSeconds > 0 ? Math.max(60, Math.min(100, Math.round(55 + completionRatio * 45))) : 0;

    void completePracticeExercise(currentExercise.id, {
      score,
      completed: elapsedSeconds > 0,
    })
      .then((response) => {
        setExercises((prev) =>
          prev.map((exercise) =>
            exercise.id === currentExercise.id ? decorateExercise(response.exercise) : exercise
          )
        );
        setSyncMessage("Practice progress was saved to the backend.");
      })
      .catch(() => {
        setSyncMessage("The exercise stopped, but syncing the result failed.");
      });
  };

  const handleRecording = () => {
    setIsRecording((prev) => !prev);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "70vh", display: "grid", placeItems: "center", px: 2 }}>
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <CircularProgress sx={{ color: playfulPalette.coral }} />
          <Typography sx={{ color: playfulPalette.ink, fontWeight: 800 }}>
            جاري تجهيز التمارين الممتعة...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", pb: 10 }}>
      <AnimatedBackground />

      <Box sx={{ position: "relative", zIndex: 1, px: { xs: 0.5, sm: 1.5 }, pt: { xs: 1, md: 2 } }}>
        <MotionCard initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} sx={{ ...glassCardSx, overflow: "hidden", mb: 3 }}>
          <CardContent sx={{ p: { xs: 2.2, sm: 3.2 } }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" }, gap: 2.5, alignItems: "center" }}>
              <Box>
                <Chip
                  icon={<BoltRoundedIcon />}
                  label="وقت التدريب"
                  sx={{
                    bgcolor: playfulPalette.lemon,
                    color: playfulPalette.ink,
                    fontWeight: 900,
                    borderRadius: 999,
                    mb: 2,
                  }}
                />
                <Typography
                  sx={{
                    color: playfulPalette.ink,
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.04,
                    fontSize: { xs: "1.9rem", md: "2.8rem" },
                    maxWidth: 560,
                  }}
                >
                  تدريب مرح يساعد الطفل على النطق، الاستماع، وفهم الكلمات خطوة بخطوة.
                </Typography>
                <Typography sx={{ color: playfulPalette.inkSoft, mt: 1.4, maxWidth: 580, lineHeight: 1.75 }}>
                  اختر التمرين المناسب وابدأ جلسة صغيرة، وسيعرض لك التطبيق الوقت والتقدم بشكل واضح ومبهج.
                </Typography>
              </Box>

              <Box
                sx={{
                  ...glassCardSx,
                  p: 2.2,
                  background: playfulPalette.heroGradient,
                }}
              >
                <Typography sx={{ color: "rgba(40,75,99,0.72)", fontSize: "0.9rem", mb: 0.5 }}>
                  خطة اليوم
                </Typography>
                <Typography sx={{ color: playfulPalette.ink, fontWeight: 900, fontSize: "1.42rem" }}>
                  {completedCount}/{exercises.length} تمارين مكتملة
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap", gap: 1 }}>
                  <Chip label={`${totalAttempts} محاولة`} sx={{ bgcolor: "rgba(255,255,255,0.56)", color: playfulPalette.ink, fontWeight: 800 }} />
                  <Chip label={`${averageScore}% أفضل متوسط`} sx={{ bgcolor: "rgba(255,255,255,0.56)", color: playfulPalette.ink, fontWeight: 800 }} />
                </Stack>
              </Box>
            </Box>
          </CardContent>
        </MotionCard>

        {selectedExercise && (
          <MotionCard initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} sx={{ ...glassCardSx, mb: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.05fr 0.95fr" }, gap: 2.2, alignItems: "center" }}>
                <Stack spacing={1.4}>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 3,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: typeVisuals[selectedExercise.type].bg,
                        color: typeVisuals[selectedExercise.type].color,
                      }}
                    >
                      {selectedExercise.icon}
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: playfulPalette.ink, fontWeight: 900, fontSize: "1.22rem" }}>
                        {selectedExercise.arabicTitle}
                      </Typography>
                      <Typography sx={{ color: playfulPalette.inkSoft, lineHeight: 1.7 }}>
                        {selectedExercise.arabicDescription}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <IconButton
                        onClick={() => setSessionTime(0)}
                        sx={{ bgcolor: playfulPalette.softBlue, color: playfulPalette.ink }}
                      >
                        <RefreshRoundedIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => console.log("focus mode")}
                        sx={{ bgcolor: playfulPalette.softLilac, color: "#5F65C7" }}
                      >
                        <CenterFocusStrongRoundedIcon />
                      </IconButton>
                    </Stack>
                  </Stack>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <Chip
                      label={`${selectedExercise.duration} دقيقة`}
                      icon={<TimerRoundedIcon />}
                      sx={{ bgcolor: playfulPalette.softPeach, color: "#A96324", fontWeight: 800 }}
                    />
                    <Chip
                      label={typeVisuals[selectedExercise.type].label}
                      sx={{
                        bgcolor: typeVisuals[selectedExercise.type].chip,
                        color: typeVisuals[selectedExercise.type].chipText,
                        fontWeight: 800,
                      }}
                    />
                    <Chip
                      label={difficultyVisuals[selectedExercise.difficulty].label}
                      sx={{
                        bgcolor: difficultyVisuals[selectedExercise.difficulty].bg,
                        color: difficultyVisuals[selectedExercise.difficulty].color,
                        fontWeight: 800,
                      }}
                    />
                  </Stack>
                </Stack>

                <Box
                  sx={{
                    borderRadius: 4,
                    p: { xs: 2, sm: 2.2 },
                    background: playfulPalette.candyGradient,
                    color: playfulPalette.snow,
                    boxShadow: "0 18px 32px rgba(179,157,255,0.26)",
                  }}
                >
                  <Stack spacing={1.8} sx={{ alignItems: { xs: "stretch", sm: "center" } }}>
                    <Typography sx={{ fontWeight: 800, opacity: 0.92 }}>الجلسة الحالية</Typography>
                    <Typography sx={{ fontWeight: 900, fontSize: { xs: "2.2rem", sm: "2.8rem" }, fontFamily: "monospace", lineHeight: 1 }}>
                      {formatTime(sessionTime)}
                    </Typography>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                      <Button
                        variant="contained"
                        startIcon={isRecording ? <StopRoundedIcon /> : <GraphicEqRoundedIcon />}
                        onClick={handleRecording}
                        sx={{
                          bgcolor: isRecording ? "#F05E8A" : "rgba(255,255,255,0.18)",
                          color: playfulPalette.snow,
                          borderRadius: 999,
                          px: 2.2,
                          py: 1.1,
                          fontWeight: 900,
                          boxShadow: "none",
                          "&:hover": {
                            bgcolor: isRecording ? "#E14D79" : "rgba(255,255,255,0.24)",
                            boxShadow: "none",
                          },
                        }}
                      >
                        {isRecording ? "إيقاف التسجيل" : "بدء التسجيل"}
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<StopRoundedIcon />}
                        onClick={handleStopExercise}
                        sx={{
                          bgcolor: playfulPalette.snow,
                          color: playfulPalette.ink,
                          borderRadius: 999,
                          px: 2.2,
                          py: 1.1,
                          fontWeight: 900,
                          boxShadow: "none",
                          "&:hover": {
                            bgcolor: "#FFF7EA",
                            boxShadow: "none",
                          },
                        }}
                      >
                        إنهاء التمرين
                      </Button>
                    </Stack>

                    <Box sx={{ width: "100%" }}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: "0.92rem" }}>التقدم</Typography>
                        <Typography sx={{ fontWeight: 900, fontSize: "0.92rem" }}>
                          {Math.min(100, Math.round((sessionTime / (selectedExercise.duration * 60)) * 100))}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(100, (sessionTime / (selectedExercise.duration * 60)) * 100)}
                        sx={{
                          height: 10,
                          borderRadius: 999,
                          bgcolor: "rgba(255,255,255,0.28)",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 999,
                            bgcolor: playfulPalette.snow,
                          },
                        }}
                      />
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>
        )}

        <MotionCard initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} sx={{ ...glassCardSx, mb: 3 }}>
          <CardContent sx={{ p: { xs: 1, sm: 1.2 } }}>
            <Tabs
              value={activeTab}
              onChange={(_event, newValue: number) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: 999,
                  background: playfulPalette.candyGradient,
                },
              }}
            >
              {tabLabels.map((label) => (
                <Tab key={label} label={label} sx={{ fontWeight: 800 }} />
              ))}
            </Tabs>
          </CardContent>
        </MotionCard>

        {error && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        {syncMessage && (
          <Alert severity={syncMessage.includes("failed") ? "warning" : "success"} sx={{ mb: 3, borderRadius: 3 }}>
            {syncMessage}
          </Alert>
        )}

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(4, 1fr)" }, gap: 2.2, mb: 3 }}>
          {stats.map((stat, index) => (
            <MotionCard key={stat.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <CardContent
                sx={{
                  ...glassCardSx,
                  p: 2,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.4,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: stat.bg,
                    color: stat.color,
                    flexShrink: 0,
                  }}
                >
                  {stat.icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ color: playfulPalette.ink, fontWeight: 900, fontSize: "1.18rem" }}>{stat.value}</Typography>
                  <Typography sx={{ color: playfulPalette.inkSoft, fontSize: "0.92rem" }}>{stat.label}</Typography>
                </Box>
              </CardContent>
            </MotionCard>
          ))}
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }, gap: 2.2 }}>
          {filteredExercises.map((exercise, index) => {
            const typeStyle = typeVisuals[exercise.type];
            const difficultyStyle = difficultyVisuals[exercise.difficulty];
            const scoreAccent = getScoreAccent(exercise.score ?? 0);
            const locked = selectedExercise !== null && selectedExercise.id !== exercise.id;

            return (
              <MotionCard
                key={exercise.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                sx={{
                  ...glassCardSx,
                  opacity: locked ? 0.62 : 1,
                  pointerEvents: locked ? "none" : "auto",
                }}
              >
                <CardContent sx={{ p: 2.2 }}>
                  <Stack spacing={1.6}>
                    <Stack direction="row" justifyContent="space-between" spacing={1.2}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 3.5,
                          display: "grid",
                          placeItems: "center",
                          bgcolor: typeStyle.bg,
                          color: typeStyle.color,
                          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.55)",
                        }}
                      >
                        {exercise.icon}
                      </Box>

                      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", justifyContent: "flex-end", gap: 1 }}>
                        <Chip label={exercise.category} sx={{ bgcolor: typeStyle.chip, color: typeStyle.chipText, fontWeight: 800 }} />
                        <Chip label={difficultyStyle.label} sx={{ bgcolor: difficultyStyle.bg, color: difficultyStyle.color, fontWeight: 800 }} />
                      </Stack>
                    </Stack>

                    <Box>
                      <Typography sx={{ color: playfulPalette.ink, fontWeight: 900, fontSize: "1.15rem", mb: 0.5 }}>
                        {exercise.arabicTitle}
                      </Typography>
                      <Typography sx={{ color: playfulPalette.inkSoft, lineHeight: 1.7 }}>
                        {exercise.arabicDescription}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                      <Chip
                        icon={<TimerRoundedIcon />}
                        label={`${exercise.duration} دقيقة`}
                        size="small"
                        sx={{ bgcolor: playfulPalette.softPeach, color: "#A96324", fontWeight: 800 }}
                      />
                      <Chip
                        icon={<TrendingUpRoundedIcon />}
                        label={`${exercise.attempts} محاولات`}
                        size="small"
                        sx={{ bgcolor: playfulPalette.softBlue, color: playfulPalette.ink, fontWeight: 800 }}
                      />
                    </Stack>

                    {exercise.completed && exercise.score !== undefined && (
                      <Box
                        sx={{
                          borderRadius: 3,
                          p: 1.5,
                          bgcolor: scoreAccent.track,
                          border: "1px solid rgba(255,255,255,0.72)",
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.9 }}>
                          <Typography sx={{ color: playfulPalette.ink, fontWeight: 800, fontSize: "0.92rem" }}>
                            آخر درجة: {exercise.score}%
                          </Typography>
                          <Typography sx={{ color: playfulPalette.inkSoft, fontWeight: 800, fontSize: "0.92rem" }}>
                            أفضل درجة: {exercise.bestScore}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={exercise.score}
                          sx={{
                            height: 10,
                            borderRadius: 999,
                            bgcolor: "rgba(255,255,255,0.6)",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 999,
                              bgcolor: scoreAccent.bar,
                            },
                          }}
                        />
                      </Box>
                    )}

                    <Button
                      variant="contained"
                      startIcon={selectedExercise?.id === exercise.id ? <StopRoundedIcon /> : <PlayArrowRoundedIcon />}
                      onClick={() =>
                        selectedExercise?.id === exercise.id ? handleStopExercise() : handleStartExercise(exercise)
                      }
                      sx={{
                        mt: 0.2,
                        borderRadius: 999,
                        py: 1.2,
                        fontWeight: 900,
                        background:
                          selectedExercise?.id === exercise.id
                            ? playfulPalette.candyGradient
                            : exercise.completed
                              ? playfulPalette.actionGradient
                              : "linear-gradient(135deg, #79D7FF 0%, #B39DFF 100%)",
                        color: selectedExercise?.id === exercise.id ? playfulPalette.snow : playfulPalette.ink,
                        boxShadow: "none",
                        "&:hover": {
                          boxShadow: "none",
                          opacity: 0.92,
                        },
                      }}
                    >
                      {selectedExercise?.id === exercise.id
                        ? "إيقاف الآن"
                        : exercise.completed
                          ? "مراجعة التمرين"
                          : "ابدأ التمرين"}
                    </Button>
                  </Stack>
                </CardContent>
              </MotionCard>
            );
          })}
        </Box>

        {filteredExercises.length === 0 && (
          <Alert
            severity="info"
            sx={{
              mt: 3,
              borderRadius: 4,
              bgcolor: playfulPalette.softBlue,
              color: playfulPalette.ink,
              border: `1px solid ${playfulPalette.line}`,
            }}
          >
            لا توجد تمارين متاحة في هذا القسم حاليًا.
          </Alert>
        )}
      </Box>
    </Box>
  );
};
