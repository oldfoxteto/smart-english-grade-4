import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import HeadphonesRoundedIcon from "@mui/icons-material/HeadphonesRounded";
import RecordVoiceOverRoundedIcon from "@mui/icons-material/RecordVoiceOverRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import {
  getTestingCatalog,
  type TestingCatalogItem,
  type TestingCatalogResponse,
  type TestingResultItem,
} from "../core/api";
import { playfulPalette } from "../theme/playfulPalette";

const MotionCard = motion(Card);

const glassCardSx = {
  borderRadius: 5,
  border: `1px solid ${playfulPalette.line}`,
  background: playfulPalette.glass,
  boxShadow: playfulPalette.glow,
  backdropFilter: "blur(14px)",
};

const tabLabels = ["All", "Placement", "Practice", "Completed"];

const iconMap = {
  assessment: <AssessmentRoundedIcon />,
  pronunciation: <RecordVoiceOverRoundedIcon />,
  listening: <HeadphonesRoundedIcon />,
  speaking: <RecordVoiceOverRoundedIcon />,
  grammar: <MenuBookRoundedIcon />,
  vocabulary: <PsychologyRoundedIcon />,
  reading: <AutoStoriesRoundedIcon />,
};

const statusStyles = {
  completed: { bg: playfulPalette.softMint, color: "#2A8B6C", label: "Completed" },
  available: { bg: playfulPalette.softBlue, color: playfulPalette.ink, label: "Ready" },
  locked: { bg: playfulPalette.softPink, color: playfulPalette.coral, label: "Locked" },
  in_progress: { bg: playfulPalette.softPeach, color: "#A96324", label: "In progress" },
};

const difficultyStyles = {
  beginner: { bg: playfulPalette.softMint, color: "#2A8B6C", label: "Beginner" },
  intermediate: { bg: playfulPalette.softPeach, color: "#A96324", label: "Intermediate" },
  advanced: { bg: playfulPalette.softPink, color: playfulPalette.coral, label: "Advanced" },
};

const scoreTrack = (score: number) => {
  if (score >= 80) return { track: "#DDFBF0", bar: "#38B889" };
  if (score >= 60) return { track: "#FFF1D8", bar: "#F0A93A" };
  return { track: "#FFE3EB", bar: "#E66B93" };
};

const formatMinutes = (value: number) => {
  if (!value) return "0 min";
  const hours = Math.floor(value / 60);
  const mins = value % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;
};

export const TestingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [catalog, setCatalog] = useState<TestingCatalogResponse | null>(null);
  const [selectedResult, setSelectedResult] = useState<TestingResultItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getTestingCatalog()
      .then((response) => {
        if (!active) return;
        setCatalog(response);
        setError("");
      })
      .catch(() => {
        if (!active) return;
        setError("Could not load the live testing data right now.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const results = catalog?.results || [];
  const summary = catalog?.summary || {
    totalTests: 0,
    completedTests: 0,
    averageScore: 0,
    totalTimeMinutes: 0,
  };

  const filteredTests = useMemo(() => {
    const tests = catalog?.tests || [];
    return tests.filter((test) => {
      if (activeTab === 1) return test.type === "placement";
      if (activeTab === 2) return test.type === "practice";
      if (activeTab === 3) return test.completed;
      return true;
    });
  }, [activeTab, catalog?.tests]);

  const statCards = [
    {
      label: "Total assessments",
      value: summary.totalTests,
      icon: <AssessmentRoundedIcon />,
      bg: playfulPalette.softBlue,
      color: playfulPalette.ink,
    },
    {
      label: "Completed",
      value: summary.completedTests,
      icon: <CheckCircleRoundedIcon />,
      bg: playfulPalette.softMint,
      color: "#2A8B6C",
    },
    {
      label: "Average score",
      value: `${summary.averageScore}%`,
      icon: <TrendingUpRoundedIcon />,
      bg: playfulPalette.softLilac,
      color: "#5F65C7",
    },
    {
      label: "Time invested",
      value: formatMinutes(summary.totalTimeMinutes),
      icon: <TimerRoundedIcon />,
      bg: playfulPalette.softPeach,
      color: "#A96324",
    },
  ];

  const handleOpenTest = (test: TestingCatalogItem) => {
    if (test.status === "locked") return;
    if (test.type === "placement") {
      navigate("/placement-test");
      return;
    }
    if (test.category === "reading") {
      navigate("/reading-quest");
      return;
    }
    if (test.type === "practice") {
      navigate("/practice");
      return;
    }
    navigate("/lessons");
  };

  const renderResultDialog = () => (
    <Dialog open={Boolean(selectedResult)} onClose={() => setSelectedResult(null)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 900 }}>Assessment result</DialogTitle>
      <DialogContent>
        {selectedResult && (
          <Stack spacing={2}>
            <Box>
              <Typography sx={{ color: playfulPalette.ink, fontWeight: 900, fontSize: "1.3rem" }}>
                {selectedResult.score}%
              </Typography>
              <Typography sx={{ color: playfulPalette.inkSoft }}>
                {selectedResult.correctAnswers}/{selectedResult.totalQuestions} correct in{" "}
                {formatMinutes(selectedResult.timeSpentMinutes)}
              </Typography>
            </Box>
            <Typography sx={{ color: playfulPalette.ink, lineHeight: 1.7 }}>
              {selectedResult.feedback}
            </Typography>
            <Stack spacing={1}>
              {selectedResult.recommendations.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  sx={{
                    justifyContent: "flex-start",
                    bgcolor: playfulPalette.softBlue,
                    color: playfulPalette.ink,
                    fontWeight: 700,
                  }}
                />
              ))}
            </Stack>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <Box sx={{ minHeight: "70vh", display: "grid", placeItems: "center", px: 2 }}>
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <CircularProgress sx={{ color: playfulPalette.coral }} />
          <Typography sx={{ color: playfulPalette.ink, fontWeight: 800 }}>
            Loading live testing data...
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
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" }, gap: 2.4, alignItems: "center" }}>
              <Box>
                <Chip
                  icon={<AssessmentRoundedIcon />}
                  label="Live assessment center"
                  sx={{ bgcolor: playfulPalette.lemon, color: playfulPalette.ink, fontWeight: 900, borderRadius: 999, mb: 2 }}
                />
                <Typography sx={{ color: playfulPalette.ink, fontWeight: 900, fontSize: { xs: "1.9rem", md: "2.7rem" }, letterSpacing: "-0.04em", lineHeight: 1.04 }}>
                  One place to review placement, practice checks, and reading progress with real backend data.
                </Typography>
                <Typography sx={{ color: playfulPalette.inkSoft, mt: 1.4, lineHeight: 1.75, maxWidth: 560 }}>
                  This page now reflects saved test results instead of demo cards, so learners can see what is really completed and what still needs work.
                </Typography>
              </Box>

              <Box sx={{ ...glassCardSx, p: 2.2, background: playfulPalette.heroGradient }}>
                <Typography sx={{ color: "rgba(40,75,99,0.72)", fontSize: "0.9rem", mb: 0.5 }}>Current overview</Typography>
                <Typography sx={{ color: playfulPalette.ink, fontWeight: 900, fontSize: "1.42rem" }}>
                  {summary.completedTests}/{summary.totalTests} finished
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap", gap: 1 }}>
                  <Chip label={`${summary.averageScore}% average`} sx={{ bgcolor: "rgba(255,255,255,0.56)", color: playfulPalette.ink, fontWeight: 800 }} />
                  <Chip label={formatMinutes(summary.totalTimeMinutes)} sx={{ bgcolor: "rgba(255,255,255,0.56)", color: playfulPalette.ink, fontWeight: 800 }} />
                </Stack>
              </Box>
            </Box>
          </CardContent>
        </MotionCard>

        {error && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(4, 1fr)" }, gap: 2.2, mb: 3 }}>
          {statCards.map((stat, index) => (
            <MotionCard key={stat.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <CardContent sx={{ ...glassCardSx, p: 2, height: "100%", display: "flex", alignItems: "center", gap: 1.4 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 3, display: "grid", placeItems: "center", bgcolor: stat.bg, color: stat.color, flexShrink: 0 }}>
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

        <MotionCard initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} sx={{ ...glassCardSx, mb: 3 }}>
          <CardContent sx={{ p: { xs: 1, sm: 1.2 } }}>
            <Tabs
              value={activeTab}
              onChange={(_event, value: number) => setActiveTab(value)}
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

        <Grid container spacing={2.2}>
          {filteredTests.map((test, index) => {
            const statusStyle = statusStyles[test.status];
            const difficultyStyle = difficultyStyles[test.difficulty];
            const scoreAccent = scoreTrack(test.bestScore || test.score || 0);
            const result = results.find((item) => item.testId === test.id) || null;
            return (
              <Grid key={test.id} size={{ xs: 12, md: 6, xl: 4 }}>
                <MotionCard initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} sx={{ ...glassCardSx, opacity: test.status === "locked" ? 0.7 : 1 }}>
                  <CardContent sx={{ p: 2.2 }}>
                    <Stack spacing={1.6}>
                      <Stack direction="row" justifyContent="space-between" spacing={1.2}>
                        <Box sx={{ width: 56, height: 56, borderRadius: 3.5, display: "grid", placeItems: "center", bgcolor: playfulPalette.softBlue, color: playfulPalette.ink }}>
                          {iconMap[test.iconKey]}
                        </Box>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", justifyContent: "flex-end", gap: 1 }}>
                          <Chip label={difficultyStyle.label} sx={{ bgcolor: difficultyStyle.bg, color: difficultyStyle.color, fontWeight: 800 }} />
                          <Chip label={statusStyle.label} sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 800 }} />
                        </Stack>
                      </Stack>

                      <Box>
                        <Typography sx={{ color: playfulPalette.ink, fontWeight: 900, fontSize: "1.15rem", mb: 0.5 }}>
                          {test.arabicTitle}
                        </Typography>
                        <Typography sx={{ color: playfulPalette.inkSoft, lineHeight: 1.7 }}>
                          {test.arabicDescription}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                        <Chip label={`${test.questions} questions`} size="small" sx={{ bgcolor: playfulPalette.softPeach, color: "#A96324", fontWeight: 800 }} />
                        <Chip label={formatMinutes(test.duration)} size="small" sx={{ bgcolor: playfulPalette.softLilac, color: "#5F65C7", fontWeight: 800 }} />
                        <Chip label={`${test.attempts} attempts`} size="small" sx={{ bgcolor: playfulPalette.softBlue, color: playfulPalette.ink, fontWeight: 800 }} />
                      </Stack>

                      {test.completed && (
                        <Box sx={{ borderRadius: 3, p: 1.5, bgcolor: scoreAccent.track, border: "1px solid rgba(255,255,255,0.72)" }}>
                          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.9 }}>
                            <Typography sx={{ color: playfulPalette.ink, fontWeight: 800, fontSize: "0.92rem" }}>
                              Latest: {test.score}%
                            </Typography>
                            <Typography sx={{ color: playfulPalette.inkSoft, fontWeight: 800, fontSize: "0.92rem" }}>
                              Best: {test.bestScore}%
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={Math.max(0, Math.min(100, test.bestScore || test.score))}
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

                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                        <Button
                          variant="contained"
                          startIcon={test.completed ? <VisibilityRoundedIcon /> : <PlayArrowRoundedIcon />}
                          disabled={test.status === "locked"}
                          onClick={() => handleOpenTest(test)}
                          sx={{
                            flex: 1,
                            borderRadius: 999,
                            py: 1.15,
                            fontWeight: 900,
                            background: test.completed ? playfulPalette.actionGradient : "linear-gradient(135deg, #79D7FF 0%, #B39DFF 100%)",
                            color: playfulPalette.ink,
                            boxShadow: "none",
                            "&:hover": { boxShadow: "none", opacity: 0.92 },
                          }}
                        >
                          {test.status === "locked" ? "Locked" : test.completed ? "Open activity" : "Start activity"}
                        </Button>
                        {result && (
                          <Button
                            variant="outlined"
                            onClick={() => setSelectedResult(result)}
                            sx={{ borderRadius: 999, fontWeight: 900 }}
                          >
                            Result
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </MotionCard>
              </Grid>
            );
          })}
        </Grid>

        {!filteredTests.length && (
          <Alert severity="info" sx={{ mt: 3, borderRadius: 4 }}>
            No assessments match this filter right now.
          </Alert>
        )}
      </Box>
      {renderResultDialog()}
    </Box>
  );
};

export default TestingPage;
