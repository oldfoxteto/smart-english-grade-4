import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import TipsAndUpdatesRoundedIcon from "@mui/icons-material/TipsAndUpdatesRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getLearningPath } from "../core/api";
import { saveOnboardingProfile, type OnboardingProfile } from "../core/auth";
import { useProgress } from "../core/ProgressContext";

const MotionBox = motion(Box);

const floatingLights = [
  { left: "10%", delay: 0.1, duration: 5.4 },
  { left: "24%", delay: 0.8, duration: 6.1 },
  { left: "38%", delay: 0.4, duration: 5.8 },
  { left: "54%", delay: 1.1, duration: 6.5 },
  { left: "70%", delay: 0.6, duration: 5.7 },
  { left: "86%", delay: 1.3, duration: 6.2 },
];

type Proficiency = OnboardingProfile["proficiency"];
type GoalType = OnboardingProfile["goalType"];

const questions = [
  {
    id: "name",
    title: "What should we call you?",
    subtitle: "A name helps us personalize your path from the first lesson.",
    footer: "We will use it across lessons, streaks, and your dashboard.",
  },
  {
    id: "proficiency",
    title: "Where is your English today?",
    subtitle: "Choose the level that feels closest to your current ability.",
    footer: "An honest answer helps us avoid lessons that feel too easy or too hard.",
  },
  {
    id: "goal",
    title: "What is your main goal?",
    subtitle: "We will shape the recommended path around this target.",
    footer: "You can always refine this later from your profile.",
  },
  {
    id: "time",
    title: "How much time can you give each day?",
    subtitle: "Small consistent sessions usually beat long irregular ones.",
    footer: "We will pace reminders and lesson suggestions around this number.",
  },
  {
    id: "reason",
    title: "What is driving you right now?",
    subtitle: "This gives the experience a little more context and motivation.",
    footer: "We use this to tune the tone of your learning journey.",
  },
] as const;

const proficiencyOptions: Array<{
  value: Proficiency;
  label: string;
  description: string;
}> = [
  { value: "A1", label: "A1 Beginner", description: "I know basic words and simple phrases." },
  { value: "A2", label: "A2 Elementary", description: "I can manage everyday topics with support." },
  { value: "B1", label: "B1 Intermediate", description: "I can communicate on common topics with more confidence." },
  { value: "B2", label: "B2 Upper-Intermediate", description: "I can discuss ideas and details in a clearer way." },
];

const goalOptions: Array<{
  value: GoalType;
  label: string;
  description: string;
  icon: typeof FlightTakeoffRoundedIcon;
}> = [
  { value: "travel", label: "Travel", description: "Speak with confidence while moving around the world.", icon: FlightTakeoffRoundedIcon },
  { value: "work", label: "Work", description: "Improve everyday professional English and confidence.", icon: WorkRoundedIcon },
  { value: "daily", label: "Daily life", description: "Use English naturally in regular conversations.", icon: PsychologyRoundedIcon },
  { value: "study", label: "Study", description: "Prepare for lessons, coursework, and academic use.", icon: SchoolRoundedIcon },
];

const timeOptions = [
  { value: 10, label: "10 minutes", description: "Quick daily momentum." },
  { value: 15, label: "15 minutes", description: "Balanced and sustainable." },
  { value: 20, label: "20 minutes", description: "A little more depth every day." },
  { value: 30, label: "30 minutes", description: "Fastest route to visible progress." },
] as const;

const reasonOptions = [
  "I want to speak more confidently.",
  "I need English for travel or moving.",
  "I want better school or work opportunities.",
  "I simply enjoy learning and want to keep growing.",
] as const;

const cardBaseSx = {
  borderRadius: 4,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.05))",
  backdropFilter: "blur(14px)",
  boxShadow: "0 24px 48px rgba(7,23,34,0.24)",
};

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { setUsername } = useProgress();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [proficiency, setProficiency] = useState<Proficiency>("A1");
  const [goalType, setGoalType] = useState<GoalType>("travel");
  const [dailyMinutes, setDailyMinutes] = useState(15);
  const [reason, setReason] = useState<string>(reasonOptions[0]);
  const [loading, setLoading] = useState(false);

  const currentQ = questions[step];
  const progressValue = ((step + 1) / questions.length) * 100;

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }

    setLoading(true);
    try {
      if (name.trim()) setUsername(name.trim());

      const profile: OnboardingProfile = {
        languageCode: "en",
        goalType,
        proficiency,
        dailyMinutes,
        completedAt: new Date().toISOString(),
      };

      saveOnboardingProfile(profile);

      try {
        await getLearningPath("en", goalType);
      } catch (apiError) {
        console.warn("Learning path API unavailable, continuing onboarding.", apiError);
      }

      navigate("/home", { replace: true, state: { onboardingReason: reason } });
    } catch (error) {
      console.error(error);
      navigate("/home", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    if (step === 0) {
      return (
        <TextField
          fullWidth
          label="Preferred name"
          placeholder="Type your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoFocus
          sx={{
            "& .MuiInputLabel-root": { color: "rgba(233,243,246,0.78)" },
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              color: "#F7FBFC",
              bgcolor: "rgba(255,255,255,0.04)",
              "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
              "&:hover fieldset": { borderColor: "rgba(201,242,232,0.45)" },
              "&.Mui-focused fieldset": { borderColor: "#85D8CE" },
            },
          }}
        />
      );
    }

    if (step === 1) {
      return (
        <Stack spacing={1.4}>
          {proficiencyOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant="text"
              onClick={() => setProficiency(option.value)}
              sx={{
                justifyContent: "flex-start",
                alignItems: "flex-start",
                textTransform: "none",
                p: 2,
                ...cardBaseSx,
                borderColor: proficiency === option.value ? "rgba(133,216,206,0.72)" : "rgba(255,255,255,0.08)",
                outline: proficiency === option.value ? "2px solid rgba(133,216,206,0.2)" : "none",
              }}
            >
              <Box sx={{ textAlign: "left" }}>
                <Typography sx={{ color: "#F7FBFC", fontWeight: 800 }}>{option.label}</Typography>
                <Typography sx={{ color: "rgba(226,237,240,0.74)", fontSize: "0.92rem", mt: 0.45 }}>
                  {option.description}
                </Typography>
              </Box>
            </Button>
          ))}
        </Stack>
      );
    }

    if (step === 2) {
      return (
        <Stack spacing={1.4}>
          {goalOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = goalType === option.value;
            return (
              <Button
                key={option.value}
                type="button"
                variant="text"
                onClick={() => setGoalType(option.value)}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  p: 2,
                  gap: 1.5,
                  ...cardBaseSx,
                  borderColor: isSelected ? "rgba(133,216,206,0.72)" : "rgba(255,255,255,0.08)",
                  outline: isSelected ? "2px solid rgba(133,216,206,0.2)" : "none",
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2.5,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: isSelected ? "rgba(133,216,206,0.16)" : "rgba(255,255,255,0.07)",
                    color: "#C9F2E8",
                    flexShrink: 0,
                  }}
                >
                  <Icon fontSize="small" />
                </Box>
                <Box sx={{ textAlign: "left" }}>
                  <Typography sx={{ color: "#F7FBFC", fontWeight: 800 }}>{option.label}</Typography>
                  <Typography sx={{ color: "rgba(226,237,240,0.74)", fontSize: "0.92rem", mt: 0.45 }}>
                    {option.description}
                  </Typography>
                </Box>
              </Button>
            );
          })}
        </Stack>
      );
    }

    if (step === 3) {
      return (
        <Stack spacing={1.4}>
          {timeOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant="text"
              onClick={() => setDailyMinutes(option.value)}
              sx={{
                justifyContent: "space-between",
                textTransform: "none",
                p: 2,
                ...cardBaseSx,
                borderColor: dailyMinutes === option.value ? "rgba(133,216,206,0.72)" : "rgba(255,255,255,0.08)",
                outline: dailyMinutes === option.value ? "2px solid rgba(133,216,206,0.2)" : "none",
              }}
            >
              <Box sx={{ textAlign: "left" }}>
                <Typography sx={{ color: "#F7FBFC", fontWeight: 800 }}>{option.label}</Typography>
                <Typography sx={{ color: "rgba(226,237,240,0.74)", fontSize: "0.92rem", mt: 0.45 }}>
                  {option.description}
                </Typography>
              </Box>
              <Chip
                icon={<AccessTimeRoundedIcon sx={{ color: "#0B2433 !important" }} />}
                label={`${option.value}m`}
                sx={{
                  bgcolor: "#C9F2E8",
                  color: "#0B2433",
                  fontWeight: 800,
                  borderRadius: 2.5,
                }}
              />
            </Button>
          ))}
        </Stack>
      );
    }

    return (
      <Stack spacing={1.4}>
        {reasonOptions.map((option) => (
          <Button
            key={option}
            type="button"
            variant="text"
            onClick={() => {
              setReason(option);
              void handleNext();
            }}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              p: 2,
              gap: 1.5,
              ...cardBaseSx,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(133,216,206,0.16)",
                color: "#C9F2E8",
                flexShrink: 0,
              }}
            >
              <TipsAndUpdatesRoundedIcon fontSize="small" />
            </Box>
            <Typography sx={{ color: "#F7FBFC", fontWeight: 700, textAlign: "left" }}>{option}</Typography>
          </Button>
        ))}
      </Stack>
    );
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "linear-gradient(160deg, #071722 0%, #0B2433 48%, #12394B 100%)",
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 5 },
      }}
    >
      {floatingLights.map((light) => (
        <Box
          key={light.left}
          sx={{
            position: "absolute",
            top: 0,
            left: light.left,
            width: 1,
            height: { xs: 140, md: 210 },
            background: "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.03))",
            opacity: 0.38,
          }}
        >
          <MotionBox
            animate={{ y: [0, 9, 0], opacity: [0.86, 1, 0.86] }}
            transition={{ duration: light.duration, delay: light.delay, repeat: Infinity, ease: "easeInOut" }}
            sx={{
              position: "absolute",
              left: "50%",
              bottom: -6,
              width: 10,
              height: 10,
              borderRadius: "50%",
              transform: "translateX(-50%)",
              background: "#FFF1A7",
              boxShadow: "0 0 18px rgba(255,241,167,0.92)",
            }}
          />
        </Box>
      ))}

      <MotionBox
        animate={{ scale: [1, 1.08, 1], opacity: [0.16, 0.26, 0.16] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          width: 380,
          height: 380,
          right: -100,
          top: -120,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(133,216,206,0.34), transparent 72%)",
          filter: "blur(24px)",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "0.9fr 1.1fr" },
          gap: 3,
          maxWidth: 1180,
          mx: "auto",
          alignItems: "start",
        }}
      >
        <Box
          sx={{
            ...cardBaseSx,
            px: { xs: 2.5, md: 3.5 },
            py: { xs: 2.5, md: 3.5 },
          }}
        >
          <Chip
            icon={<AutoAwesomeRoundedIcon sx={{ color: "#08202D !important" }} />}
            label="Personalized setup"
            sx={{
              bgcolor: "#C9F2E8",
              color: "#08202D",
              fontWeight: 800,
              borderRadius: 999,
              mb: 2,
            }}
          />

          <Typography
            sx={{
              color: "#F7FBFC",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              fontSize: { xs: "2.1rem", md: "3.3rem" },
              maxWidth: 460,
            }}
          >
            Let&apos;s shape a learning path that fits your rhythm.
          </Typography>

          <Typography sx={{ color: "rgba(226,237,240,0.78)", mt: 2, maxWidth: 500, lineHeight: 1.7 }}>
            A few quick answers are enough for us to tune lessons, practice, and recommendations around your level and daily routine.
          </Typography>

          <Stack spacing={1.25} sx={{ mt: 3 }}>
            {questions.map((question, index) => (
              <Box
                key={question.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  px: 1.4,
                  py: 1.2,
                  borderRadius: 3,
                  background: index === step ? "rgba(201,242,232,0.12)" : "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: index <= step ? "#C9F2E8" : "rgba(255,255,255,0.08)",
                    color: index <= step ? "#08202D" : "#D9E6EA",
                    fontSize: "0.88rem",
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </Box>
                <Typography sx={{ color: "#F7FBFC", fontWeight: index === step ? 800 : 600 }}>
                  {question.title}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <MotionBox
          key={currentQ.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          sx={{
            ...cardBaseSx,
            px: { xs: 2.5, md: 3.5 },
            py: { xs: 2.5, md: 3.5 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2.5 }}>
            <IconButton
              onClick={() => (step > 0 ? setStep((prev) => prev - 1) : navigate(-1))}
              sx={{
                width: 42,
                height: 42,
                color: "#F7FBFC",
                bgcolor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <ArrowBackRoundedIcon fontSize="small" />
            </IconButton>

            <Typography sx={{ color: "rgba(226,237,240,0.72)", fontWeight: 800 }}>
              Step {step + 1} / {questions.length}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: 8,
              borderRadius: 99,
              bgcolor: "rgba(255,255,255,0.08)",
              mb: 3,
              "& .MuiLinearProgress-bar": {
                borderRadius: 99,
                background: "linear-gradient(90deg, #85D8CE 0%, #D6F38E 100%)",
              },
            }}
          />

          <Typography
            sx={{
              color: "#F7FBFC",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              fontSize: { xs: "1.6rem", md: "2.3rem" },
              lineHeight: 1.06,
            }}
          >
            {currentQ.title}
          </Typography>

          <Typography sx={{ color: "rgba(226,237,240,0.76)", mt: 1.3, mb: 3, lineHeight: 1.7 }}>
            {currentQ.subtitle}
          </Typography>

          {renderStepContent()}

          <Typography sx={{ color: "rgba(226,237,240,0.58)", mt: 3, textAlign: "center", fontSize: "0.92rem" }}>
            {currentQ.footer}
          </Typography>

          {step !== questions.length - 1 && (
            <Button
              type="button"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || (step === 0 && !name.trim())}
              onClick={() => void handleNext()}
              sx={{
                mt: 3,
                py: 1.45,
                borderRadius: 3,
                fontWeight: 900,
                fontSize: "1rem",
                color: "#08202D",
                background: "linear-gradient(135deg, #C9F2E8 0%, #D6F38E 100%)",
                boxShadow: "0 18px 30px rgba(133,216,206,0.18)",
              }}
            >
              {loading ? "Preparing your path..." : "Continue"}
            </Button>
          )}
        </MotionBox>
      </Box>
    </Box>
  );
};

export default OnboardingPage;
