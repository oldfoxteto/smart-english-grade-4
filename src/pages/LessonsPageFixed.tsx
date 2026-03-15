import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import { getLessonPathStatuses, type LessonPathStatus } from "../core/api";
import { getAllA1Lessons, type A1Lesson } from "../core/a1Content";
import {
  getMasteryState,
  getMasteryThreshold,
  getUnlockedLessonIds,
  subscribeToMasteryUpdates,
} from "../core/masteryEngine";
import { playClick, playSuccess, playWrong } from "../core/sounds";
import { playfulPalette } from "../theme/playfulPalette";

const MotionCard = motion(Card);

const glassCardSx = {
  borderRadius: 5,
  border: `1px solid ${playfulPalette.line}`,
  background: playfulPalette.glass,
  boxShadow: playfulPalette.glow,
  backdropFilter: "blur(12px)",
};

const getCategoryAccent = (lesson: A1Lesson) => {
  if (lesson.category === "vocabulary") {
      return {
      gradient: "linear-gradient(135deg, #8DE6C2 0%, #79D7FF 100%)",
      soft: playfulPalette.softMint,
      text: "#24765B",
    };
  }
  if (lesson.category === "grammar") {
    return {
      gradient: "linear-gradient(135deg, #79D7FF 0%, #B39DFF 100%)",
      soft: playfulPalette.softBlue,
      text: "#4168B5",
    };
  }
  return {
    gradient: "linear-gradient(135deg, #FFBE78 0%, #FF8BA7 100%)",
    soft: playfulPalette.softPeach,
    text: "#B35E3C",
  };
};

const LessonsPage = () => {
  const navigate = useNavigate();
  const [masteryRevision, setMasteryRevision] = useState(0);
  const [remoteStatusMap, setRemoteStatusMap] = useState<Record<string, LessonPathStatus>>({});
  const [remoteEnabled, setRemoteEnabled] = useState(false);

  const allLessons = useMemo(() => getAllA1Lessons(), []);
  const masteryState = getMasteryState();
  const unlockedIds = useMemo(
    () => new Set(getUnlockedLessonIds(allLessons, masteryState)),
    [allLessons, masteryState]
  );
  const threshold = getMasteryThreshold();

  useEffect(() => {
    const unsubscribe = subscribeToMasteryUpdates(() => {
      setMasteryRevision((value) => value + 1);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    let cancelled = false;
    getLessonPathStatuses(allLessons.map((lesson) => lesson.id))
      .then((response) => {
        if (cancelled) return;
        const map: Record<string, LessonPathStatus> = {};
        response.statuses.forEach((status) => {
          map[status.lessonId] = status;
        });
        setRemoteStatusMap(map);
        setRemoteEnabled(response.statuses.length > 0);
      })
      .catch(() => {
        if (cancelled) return;
        setRemoteEnabled(false);
      });
    return () => {
      cancelled = true;
    };
  }, [allLessons, masteryRevision]);

  const units = useMemo(() => {
    const map = new Map<number, A1Lesson[]>();
    allLessons.forEach((lesson) => {
      if (!map.has(lesson.unit)) map.set(lesson.unit, []);
      map.get(lesson.unit)?.push(lesson);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [allLessons]);

  const totalMasteryScore = useMemo(() => {
    if (remoteEnabled) {
      return Object.values(remoteStatusMap).reduce((sum, item) => sum + Number(item.masteryScore || 0), 0);
    }
    return Object.values(masteryState.lessonMastery).reduce((sum, value) => sum + value, 0);
  }, [masteryState, remoteEnabled, remoteStatusMap]);

  const masteredCount = useMemo(() => {
    if (remoteEnabled) {
      return Object.values(remoteStatusMap).filter((item) => item.mastered).length;
    }
    return Object.values(masteryState.lessonMastery).filter((value) => value >= threshold).length;
  }, [masteryState, remoteEnabled, remoteStatusMap, threshold]);

  const unlockedCount = useMemo(() => {
    if (remoteEnabled) {
      return Object.values(remoteStatusMap).filter((item) => item.unlocked).length;
    }
    return unlockedIds.size;
  }, [remoteEnabled, remoteStatusMap, unlockedIds]);

  const fireConfetti = () => {
    playSuccess();
    confetti({
      particleCount: 90,
      spread: 72,
      origin: { y: 0.7 },
      colors: [playfulPalette.sky, playfulPalette.mint, playfulPalette.lemon, playfulPalette.coral],
    });
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", pb: 10 }}>
      <AnimatedBackground />

      <Box sx={{ position: "relative", zIndex: 1, px: { xs: 0.5, sm: 1.5 }, pt: { xs: 1, md: 2 } }}>
        <MotionCard
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{ ...glassCardSx, overflow: "hidden", mb: 3 }}
        >
          <CardContent sx={{ p: { xs: 2.2, sm: 3.2 } }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" },
                gap: 2.5,
                alignItems: "center",
              }}
            >
              <Box>
                <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", mb: 2 }}>
                  <IconButton
                    onClick={() => navigate("/home")}
                    sx={{ bgcolor: playfulPalette.softBlue, color: playfulPalette.ink }}
                  >
                    <ArrowBackRoundedIcon />
                  </IconButton>
                  <Chip
                    icon={<SchoolRoundedIcon sx={{ color: `${playfulPalette.ink} !important` }} />}
                    label="Learning path"
                    sx={{ bgcolor: playfulPalette.lemon, color: playfulPalette.ink, fontWeight: 800, borderRadius: 999 }}
                  />
                </Stack>

                <Typography
                  sx={{
                    color: playfulPalette.ink,
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.02,
                    fontSize: { xs: "1.9rem", md: "2.8rem" },
                    maxWidth: 520,
                  }}
                >
                  Follow your units, unlock lessons, and master them step by step.
                </Typography>

                <Typography sx={{ color: playfulPalette.inkSoft, mt: 1.4, maxWidth: 560, lineHeight: 1.7 }}>
                  A brighter path helps the page feel friendlier for children while keeping mastery and unlock states easy to read.
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 2.2, flexWrap: "wrap", gap: 1 }}>
                  <Chip
                    icon={<AutoAwesomeRoundedIcon sx={{ color: `${playfulPalette.lilac} !important` }} />}
                    label={`${unlockedCount} unlocked`}
                    sx={{ bgcolor: playfulPalette.softLilac, color: playfulPalette.ink, fontWeight: 800, borderRadius: 2.5 }}
                  />
                  <Chip
                    icon={<EmojiEventsRoundedIcon sx={{ color: `${playfulPalette.peach} !important` }} />}
                    label={`${masteredCount} mastered`}
                    sx={{ bgcolor: playfulPalette.softPeach, color: playfulPalette.ink, fontWeight: 800, borderRadius: 2.5 }}
                  />
                </Stack>
              </Box>

              <Box
                onClick={fireConfetti}
                sx={{
                  ...glassCardSx,
                  p: 2.2,
                  cursor: "pointer",
                  background: playfulPalette.candyGradient,
                  color: playfulPalette.ink,
                }}
              >
                <Typography sx={{ color: "rgba(40,75,99,0.74)", fontSize: "0.9rem", mb: 0.6 }}>
                  Total mastery
                </Typography>
                <Typography sx={{ fontWeight: 900, fontSize: "2rem", letterSpacing: "-0.04em" }}>
                  {Math.floor(totalMasteryScore)}
                </Typography>
                <Typography sx={{ color: "rgba(40,75,99,0.74)", mt: 0.8, mb: 1.5 }}>
                  Tap this card for a little celebration.
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={allLessons.length ? (masteredCount / allLessons.length) * 100 : 0}
                  sx={{
                    height: 10,
                    borderRadius: 99,
                    bgcolor: "rgba(255,255,255,0.45)",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 99,
                      background: playfulPalette.actionGradient,
                    },
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </MotionCard>

        <Stack spacing={3}>
          {units.map(([unitNum, lessons], unitIndex) => (
            <MotionCard
              key={unitNum}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: unitIndex * 0.06 }}
              sx={{ ...glassCardSx, overflow: "hidden" }}
            >
              <CardContent sx={{ p: { xs: 2.2, sm: 2.8 } }}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={1.4}
                  sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, mb: 2.2 }}
                >
                  <Box>
                    <Typography sx={{ color: playfulPalette.ink, fontWeight: 900, fontSize: "1.35rem", letterSpacing: "-0.03em" }}>
                      Unit {unitNum}
                    </Typography>
                    <Typography sx={{ color: playfulPalette.inkSoft, mt: 0.5 }}>
                      {lessons.length} lessons in this unit
                    </Typography>
                  </Box>

                  <Chip
                    label={`${lessons.filter((lesson) => {
                      const remote = remoteStatusMap[lesson.id];
                      const score = remoteEnabled ? Number(remote?.masteryScore || 0) : masteryState.lessonMastery[lesson.id] || 0;
                      return remoteEnabled ? Boolean(remote?.mastered) : score >= threshold;
                    }).length}/${lessons.length} mastered`}
                    sx={{ bgcolor: playfulPalette.softBlue, color: playfulPalette.ink, fontWeight: 800, borderRadius: 2.5 }}
                  />
                </Stack>

                <Grid container spacing={2}>
                  {lessons.map((lesson) => {
                    const remote = remoteStatusMap[lesson.id];
                    const isUnlocked = remoteEnabled ? Boolean(remote?.unlocked) : unlockedIds.has(lesson.id);
                    const masteryScore = remoteEnabled ? Number(remote?.masteryScore || 0) : masteryState.lessonMastery[lesson.id] || 0;
                    const isMastered = remoteEnabled ? Boolean(remote?.mastered) : masteryScore >= threshold;
                    const isCurrent = isUnlocked && !isMastered;
                    const accent = getCategoryAccent(lesson);

                    return (
                      <Grid key={lesson.id} size={{ xs: 12, md: 6 }}>
                        <Tooltip
                          title={
                            isUnlocked
                              ? `${lesson.titleAr || lesson.title} • ${Math.round(masteryScore)}% mastery`
                              : "This lesson is still locked"
                          }
                        >
                          <MotionCard
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: isUnlocked ? 0.995 : 1 }}
                            onClick={() => {
                              if (isUnlocked) {
                                playClick();
                                navigate(`/lesson/${lesson.id}`);
                              } else {
                                playWrong();
                              }
                            }}
                            sx={{
                              borderRadius: 4,
                              cursor: isUnlocked ? "pointer" : "not-allowed",
                              border: isCurrent ? `1px solid ${playfulPalette.coral}` : `1px solid ${playfulPalette.line}`,
                              boxShadow: isCurrent
                                ? "0 20px 38px rgba(255, 139, 167, 0.18)"
                                : "0 12px 28px rgba(255, 190, 120, 0.12)",
                              opacity: isUnlocked ? 1 : 0.72,
                              overflow: "hidden",
                            }}
                          >
                            <CardContent sx={{ p: 0 }}>
                              <Box sx={{ display: "grid", gridTemplateColumns: "10px 1fr" }}>
                                <Box sx={{ background: accent.gradient }} />
                                <Box sx={{ p: 2.1 }}>
                                  <Stack direction="row" spacing={1.2} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <Box sx={{ flex: 1 }}>
                                      <Typography sx={{ color: playfulPalette.ink, fontWeight: 800, fontSize: "1rem" }}>
                                        {lesson.title}
                                      </Typography>
                                      <Typography sx={{ color: playfulPalette.inkSoft, mt: 0.45, fontSize: "0.9rem", lineHeight: 1.5 }}>
                                        {lesson.titleAr || "Lesson content ready for practice."}
                                      </Typography>
                                    </Box>

                                    <Box
                                      sx={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: "50%",
                                        display: "grid",
                                        placeItems: "center",
                                        bgcolor: isMastered ? playfulPalette.softPeach : isUnlocked ? accent.soft : "#F5F7FA",
                                        color: isMastered ? "#B35E3C" : isUnlocked ? accent.text : "#8DA0AA",
                                        flexShrink: 0,
                                      }}
                                    >
                                      {isMastered ? (
                                        <CheckCircleRoundedIcon fontSize="small" />
                                      ) : isUnlocked ? (
                                        <PlayArrowRoundedIcon fontSize="small" />
                                      ) : (
                                        <LockRoundedIcon fontSize="small" />
                                      )}
                                    </Box>
                                  </Stack>

                                  <Stack direction="row" spacing={1} sx={{ mt: 1.4, flexWrap: "wrap", gap: 0.9 }}>
                                    <Chip
                                      label={lesson.category}
                                      size="small"
                                      sx={{
                                        bgcolor: accent.soft,
                                        color: accent.text,
                                        fontWeight: 800,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                      }}
                                    />
                                    <Chip
                                      label={`${lesson.duration} min`}
                                      size="small"
                                      sx={{ bgcolor: playfulPalette.softBlue, color: playfulPalette.ink, fontWeight: 800 }}
                                    />
                                    <Chip
                                      label={isMastered ? "Mastered" : isCurrent ? "Current" : isUnlocked ? "Unlocked" : "Locked"}
                                      size="small"
                                      sx={{
                                        bgcolor: isMastered ? playfulPalette.softPink : isUnlocked ? playfulPalette.softMint : "#F7F8FB",
                                        color: isMastered ? playfulPalette.coral : isUnlocked ? "#24765B" : "#7C8D96",
                                        fontWeight: 800,
                                      }}
                                    />
                                  </Stack>

                                  <Box sx={{ mt: 1.6 }}>
                                    <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", mb: 0.7 }}>
                                      <Typography sx={{ color: playfulPalette.inkSoft, fontSize: "0.82rem", fontWeight: 700 }}>
                                        Mastery progress
                                      </Typography>
                                      <Typography sx={{ color: playfulPalette.ink, fontSize: "0.82rem", fontWeight: 800 }}>
                                        {Math.round(masteryScore)}%
                                      </Typography>
                                    </Stack>
                                    <LinearProgress
                                      variant="determinate"
                                      value={Math.max(0, Math.min(100, masteryScore))}
                                      sx={{
                                        height: 8,
                                        borderRadius: 99,
                                        bgcolor: "#F3F6FA",
                                        "& .MuiLinearProgress-bar": {
                                          borderRadius: 99,
                                          background: accent.gradient,
                                        },
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </Box>
                            </CardContent>
                          </MotionCard>
                        </Tooltip>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </MotionCard>
          ))}
        </Stack>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/practice")}
            sx={{
              borderRadius: 999,
              px: 3,
              py: 1.3,
              fontWeight: 900,
              color: playfulPalette.ink,
              background: playfulPalette.actionGradient,
              boxShadow: "0 18px 28px rgba(255,190,120,0.24)",
            }}
          >
            Continue practice
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LessonsPage;
