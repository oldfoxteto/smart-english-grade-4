import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import TipsAndUpdatesRoundedIcon from "@mui/icons-material/TipsAndUpdatesRounded";
import { motion, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import { getGamificationStatus } from "../core/api";
import { getOnboardingProfile } from "../core/auth";
import { getAllA1Lessons } from "../core/a1Content";
import { getUnlockedLessonIds, getNextRecommendedLesson } from "../core/masteryEngine";
import { useProgress } from "../core/ProgressContext";
import { playClick } from "../core/sounds";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const glassCardSx = {
  borderRadius: 5,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(245,250,252,0.9))",
  boxShadow: "0 20px 50px rgba(7,23,34,0.08)",
  backdropFilter: "blur(12px)",
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } },
};

const HomePage = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const onboarding = getOnboardingProfile();

  const [gamification, setGamification] = useState<any>(null);

  const allLessons = getAllA1Lessons();
  const unlockedIds = getUnlockedLessonIds(allLessons);
  const nextLesson = getNextRecommendedLesson(allLessons) || allLessons[0];
  const recommendedLessons = allLessons.filter((lesson) => unlockedIds.includes(lesson.id)).slice(0, 3);

  if (recommendedLessons.length === 0 && nextLesson) {
    recommendedLessons.push(nextLesson);
  }

  useEffect(() => {
    getGamificationStatus().then(setGamification).catch(() => setGamification(null));
  }, []);

  const totalXp = gamification?.totalXp ?? progress.stars * 10;
  const streak = gamification?.currentStreakDays ?? 1;
  const levelText = onboarding?.proficiency || "A1";
  const dailyProgress = Math.min(95, Math.max(20, (progress.quizScores.length + progress.vocabularyCompleted.length) * 6 || 30));
  const levelProgress = totalXp % 500;

  const quickActions = [
    {
      title: "AI Tutor",
      subtitle: "Talk, ask, and practice anytime.",
      icon: <ChatBubbleRoundedIcon sx={{ fontSize: "1.8rem" }} />,
      route: "/ai-tutor",
      gradient: "linear-gradient(135deg, #0C7FA0 0%, #146C94 100%)",
      shadow: "0 16px 30px rgba(12,127,160,0.24)",
    },
    {
      title: "Next lesson",
      subtitle: nextLesson?.title || "Continue your track.",
      icon: <MenuBookRoundedIcon sx={{ fontSize: "1.8rem" }} />,
      route: nextLesson ? `/lesson/${nextLesson.id}` : "/lessons",
      gradient: "linear-gradient(135deg, #2E7D32 0%, #4FA35A 100%)",
      shadow: "0 16px 30px rgba(46,125,50,0.24)",
    },
    {
      title: "Leaderboard",
      subtitle: "See top learners and streaks.",
      icon: <EmojiEventsRoundedIcon sx={{ fontSize: "1.8rem" }} />,
      route: "/leaderboard",
      gradient: "linear-gradient(135deg, #8559D9 0%, #5A41C8 100%)",
      shadow: "0 16px 30px rgba(90,65,200,0.24)",
    },
    {
      title: "Reading quest",
      subtitle: "Unlock more story practice.",
      icon: <TipsAndUpdatesRoundedIcon sx={{ fontSize: "1.8rem" }} />,
      route: "/reading-quest",
      gradient: "linear-gradient(135deg, #F08D32 0%, #E25A44 100%)",
      shadow: "0 16px 30px rgba(240,141,50,0.24)",
    },
  ];

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", pb: 10 }}>
      <AnimatedBackground />

      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="show"
        sx={{
          position: "relative",
          zIndex: 1,
          px: { xs: 0.5, sm: 1.5 },
          pt: { xs: 1, md: 2 },
        }}
      >
        <MotionCard variants={itemVariants} sx={{ ...glassCardSx, overflow: "hidden", mb: 3 }}>
          <CardContent sx={{ p: { xs: 2.2, sm: 3.2 } }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
                gap: 2.5,
                alignItems: "center",
              }}
            >
              <Box>
                <Chip
                  icon={<AutoAwesomeRoundedIcon sx={{ color: "#0B2433 !important" }} />}
                  label="Your daily dashboard"
                  sx={{
                    mb: 2,
                    bgcolor: "#C9F2E8",
                    color: "#0B2433",
                    fontWeight: 800,
                    borderRadius: 999,
                  }}
                />

                <Typography
                  sx={{
                    color: "#0B2433",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.02,
                    fontSize: { xs: "1.9rem", md: "2.9rem" },
                    maxWidth: 520,
                  }}
                >
                  Welcome back, {progress.username || "Student"}.
                </Typography>

                <Typography sx={{ color: "#5D717C", mt: 1.4, maxWidth: 540, lineHeight: 1.7 }}>
                  Your next best step is ready. Keep the streak alive, build confidence with the AI tutor, and move one lesson forward today.
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 2.2, flexWrap: "wrap", gap: 1 }}>
                  <Chip
                    icon={<LocalFireDepartmentRoundedIcon sx={{ color: "#F17842 !important" }} />}
                    label={`${streak} day streak`}
                    sx={{ bgcolor: "#FFF0E7", color: "#A3491B", fontWeight: 800, borderRadius: 2.5 }}
                  />
                  <Chip
                    icon={<AutoAwesomeRoundedIcon sx={{ color: "#0C7FA0 !important" }} />}
                    label={`${levelText} track`}
                    sx={{ bgcolor: "#E8F8FB", color: "#0B617B", fontWeight: 800, borderRadius: 2.5 }}
                  />
                </Stack>
              </Box>

              <Box
                sx={{
                  ...glassCardSx,
                  p: 2,
                  background: "linear-gradient(180deg, rgba(8,32,45,0.96), rgba(18,57,75,0.92))",
                  color: "#F7FBFC",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    <Avatar
                      sx={{
                        width: 52,
                        height: 52,
                        bgcolor: "rgba(201,242,232,0.14)",
                        color: "#C9F2E8",
                        fontWeight: 900,
                      }}
                    >
                      {(progress.username || "S").charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 800 }}>{progress.username || "Student"}</Typography>
                      <Typography sx={{ color: "rgba(226,237,240,0.68)", fontSize: "0.88rem" }}>
                        Level {progress.level} learner
                      </Typography>
                    </Box>
                  </Stack>

                  <IconButton
                    sx={{
                      width: 40,
                      height: 40,
                      color: "#F7FBFC",
                      bgcolor: "rgba(255,255,255,0.08)",
                    }}
                  >
                    <NotificationsNoneRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Typography sx={{ color: "rgba(226,237,240,0.72)", fontSize: "0.9rem", mb: 1 }}>
                  Daily momentum
                </Typography>
                <Box sx={{ height: 12, borderRadius: 999, bgcolor: "rgba(255,255,255,0.09)", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dailyProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      borderRadius: 999,
                      background: "linear-gradient(90deg, #85D8CE 0%, #D6F38E 100%)",
                    }}
                  />
                </Box>
                <Typography sx={{ color: "rgba(226,237,240,0.74)", fontSize: "0.84rem", mt: 1.1 }}>
                  {dailyProgress}% of today&apos;s suggested effort completed.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </MotionCard>

        <Grid container spacing={2.2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <MotionCard variants={itemVariants} sx={{ ...glassCardSx, height: "100%" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography sx={{ color: "#6A7F89", fontSize: "0.84rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Total XP
                </Typography>
                <Typography sx={{ color: "#0B2433", fontWeight: 900, fontSize: "2rem", mt: 0.6 }}>{totalXp}</Typography>
                <Typography sx={{ color: "#5D717C", mt: 0.8 }}>
                  Steady growth from lessons, quizzes, and missions.
                </Typography>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <MotionCard variants={itemVariants} sx={{ ...glassCardSx, height: "100%" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography sx={{ color: "#6A7F89", fontSize: "0.84rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Current streak
                </Typography>
                <Typography sx={{ color: "#0B2433", fontWeight: 900, fontSize: "2rem", mt: 0.6 }}>{streak} days</Typography>
                <Typography sx={{ color: "#5D717C", mt: 0.8 }}>
                  Consistency matters more than intensity.
                </Typography>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <MotionCard variants={itemVariants} sx={{ ...glassCardSx, height: "100%" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography sx={{ color: "#6A7F89", fontSize: "0.84rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Level progress
                </Typography>
                <Typography sx={{ color: "#0B2433", fontWeight: 900, fontSize: "2rem", mt: 0.6 }}>
                  {levelProgress}
                  <Box component="span" sx={{ color: "#95A6AF", fontWeight: 700, fontSize: "1rem" }}>
                    {" "}
                    / 500
                  </Box>
                </Typography>
                <Typography sx={{ color: "#5D717C", mt: 0.8 }}>
                  Keep going to unlock the next level threshold.
                </Typography>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        <MotionBox variants={itemVariants} sx={{ mb: 1.5, px: 0.5 }}>
          <Typography sx={{ color: "#0B2433", fontWeight: 900, fontSize: "1.35rem", letterSpacing: "-0.03em" }}>
            Jump back in
          </Typography>
        </MotionBox>

        <Grid container spacing={2.2} sx={{ mb: 3.5 }}>
          {quickActions.map((action) => (
            <Grid key={action.title} size={{ xs: 12, sm: 6 }}>
              <MotionCard
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  playClick();
                  navigate(action.route);
                }}
                sx={{
                  borderRadius: 5,
                  cursor: "pointer",
                  color: "white",
                  background: action.gradient,
                  boxShadow: action.shadow,
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 900, fontSize: "1.08rem" }}>{action.title}</Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.82)", mt: 0.7, lineHeight: 1.55 }}>
                      {action.subtitle}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "rgba(255,255,255,0.16)",
                      flexShrink: 0,
                    }}
                  >
                    {action.icon}
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <MotionCard
          variants={itemVariants}
          whileHover={{ y: -3 }}
          onClick={() => {
            playClick();
            navigate("/speed-rush");
          }}
          sx={{
            borderRadius: 5,
            mb: 3.5,
            cursor: "pointer",
            overflow: "hidden",
            background: "linear-gradient(135deg, #101F2C 0%, #15384C 58%, #0C7FA0 100%)",
            color: "#F7FBFC",
            boxShadow: "0 22px 44px rgba(12,127,160,0.2)",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 }, position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                top: -26,
                right: -20,
                width: 120,
                height: 120,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.08)",
              }}
            />
            <Stack direction="row" spacing={2} sx={{ alignItems: "center", position: "relative", zIndex: 1 }}>
              <Avatar sx={{ width: 60, height: 60, bgcolor: "#C9F2E8", color: "#0B2433" }}>
                <BoltRoundedIcon sx={{ fontSize: "2rem" }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 900, fontSize: { xs: "1.15rem", md: "1.35rem" }, letterSpacing: "-0.03em" }}>
                  Speed Rush
                </Typography>
                <Typography sx={{ color: "rgba(226,237,240,0.78)", mt: 0.6, maxWidth: 560, lineHeight: 1.65 }}>
                  Play a fast 60-second challenge, sharpen recall, and earn a quick XP boost.
                </Typography>
              </Box>
              <IconButton
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "#F7FBFC",
                }}
              >
                <ArrowForwardRoundedIcon />
              </IconButton>
            </Stack>
          </CardContent>
        </MotionCard>

        <MotionBox variants={itemVariants} sx={{ mb: 1.5, px: 0.5 }}>
          <Typography sx={{ color: "#0B2433", fontWeight: 900, fontSize: "1.35rem", letterSpacing: "-0.03em" }}>
            Recommended lessons
          </Typography>
        </MotionBox>

        <Stack spacing={2.2} sx={{ pb: 1 }}>
          {recommendedLessons.map((lesson) => {
            const accent =
              lesson.category === "vocabulary"
                ? "linear-gradient(180deg, #2E7D32, #63B96D)"
                : lesson.category === "grammar"
                  ? "linear-gradient(180deg, #0C7FA0, #50B4D4)"
                  : "linear-gradient(180deg, #F08D32, #F3B76D)";

            return (
              <MotionCard
                key={lesson.id}
                variants={itemVariants}
                whileHover={{ y: -2, x: 2 }}
                whileTap={{ scale: 0.995 }}
                onClick={() => {
                  playClick();
                  navigate(`/lesson/${lesson.id}`);
                }}
                sx={{
                  ...glassCardSx,
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: "grid", gridTemplateColumns: "8px 1fr" }}>
                    <Box sx={{ background: accent }} />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        px: 2.3,
                        py: 2.1,
                      }}
                    >
                      <Box>
                        <Typography sx={{ color: "#0B2433", fontWeight: 800, fontSize: "1.02rem" }}>
                          {lesson.title}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 0.9, flexWrap: "wrap", gap: 0.8 }}>
                          <Chip
                            label={lesson.category}
                            size="small"
                            sx={{
                              height: 24,
                              bgcolor: "#EEF5F7",
                              color: "#4E6470",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          />
                          <Typography sx={{ color: "#78909A", fontSize: "0.86rem", fontWeight: 700 }}>
                            {lesson.duration} min
                          </Typography>
                        </Stack>
                      </Box>

                      <IconButton sx={{ bgcolor: "#ECF4F7", color: "#0B617B" }}>
                        <ArrowForwardRoundedIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </MotionCard>
            );
          })}
        </Stack>
      </MotionBox>
    </Box>
  );
};

export default HomePage;
