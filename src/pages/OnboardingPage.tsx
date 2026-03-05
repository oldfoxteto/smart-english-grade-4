import { useState } from "react";
import { Box, Typography, Button, Card, CardContent, TextField, LinearProgress, IconButton, Stack } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { saveOnboardingProfile, type OnboardingProfile } from "../core/auth";
import { getLearningPath } from "../core/api";
import { useProgress } from "../core/ProgressContext";

const questions = [
  { id: "name", title: "What's your name?", subtitle: "Tell us how to address you", footer: "This helps us personalize your learning experience" },
  { id: "proficiency", title: "Current English level", subtitle: "Where are you starting from?", footer: "Be honest so we can place you right" },
  { id: "goal", title: "Learning goal", subtitle: "What do you want to achieve?", footer: "We will tailor the path for you" },
  { id: "time", title: "Daily time commitment", subtitle: "How many minutes a day?", footer: "Consistency is key" },
  { id: "reason", title: "Why learn English?", subtitle: "Your primary motivation", footer: "Knowing why helps keep you motivated" }
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { setUsername } = useProgress();
  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [proficiency, setProficiency] = useState<"A1" | "A2" | "B1" | "B2" | "C1" | "C2">("A1");
  const [goalType, setGoalType] = useState<"daily" | "travel" | "work" | "study" | "migration">("travel");
  const [dailyMinutes, setDailyMinutes] = useState(15);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        if (name) setUsername(name);
        const profile: OnboardingProfile = {
          languageCode: "en",
          goalType,
          proficiency,
          dailyMinutes,
          completedAt: new Date().toISOString()
        };
        saveOnboardingProfile(profile);
        // Do not block onboarding completion if learning-path API is unavailable.
        try {
          await getLearningPath("en", goalType);
        } catch (apiError) {
          console.warn("Learning path API unavailable, continuing onboarding.", apiError);
        }
        navigate("/home", { replace: true });
      } catch (err) {
        console.error(err);
        navigate("/home", { replace: true });
      } finally {
        setLoading(false);
      }
    }
  };

  const currentQ = questions[step];

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F9FBE7", display: "flex", flexDirection: "column", alignItems: "center", pt: 6, px: 2, fontFamily: 'Nunito, sans-serif' }}>
      <Box sx={{ width: '100%', maxWidth: 500 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <IconButton onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)} sx={{ border: '1px solid #E0E0E0', bgcolor: 'white' }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" sx={{ color: '#2E7D32', fontWeight: 800 }}>
            Level Assessment
          </Typography>
          <Typography sx={{ color: '#4CAF50', fontWeight: 800 }}>{step + 1}/{questions.length}</Typography>
        </Box>
        <LinearProgress variant="determinate" value={((step + 1) / questions.length) * 100} sx={{ height: 8, borderRadius: 4, bgcolor: '#E0E0E0', '& .MuiLinearProgress-bar': { bgcolor: '#4CAF50' }, mb: 4 }} />

        {/* Card */}
        <Card sx={{ borderRadius: 4, mb: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.05)', overflow: 'visible', position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: -16, left: 24, bgcolor: '#4CAF50', color: 'white', px: 2, py: 0.5, borderRadius: 4, fontWeight: 700 }}>
            Question {step + 1}
          </Box>
          <CardContent sx={{ pt: 5, px: 4, pb: 4 }}>
            <Typography variant="h5" sx={{ color: '#1B5E20', fontWeight: 800, mb: 1 }}>{currentQ.title}</Typography>
            <Typography variant="body1" sx={{ color: '#757575', mb: 4 }}>{currentQ.subtitle}</Typography>

            {step === 0 && <TextField fullWidth variant="outlined" placeholder="Enter your name..." value={name} onChange={(e) => setName(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#F5F5F5', borderRadius: 2 } }} />}
            {step === 1 && (
              <Stack spacing={2}>
                {["A1 - Beginner", "A2 - Elementary", "B1 - Intermediate"].map(lvl => (
                  <Button key={lvl} variant={proficiency === lvl.substring(0, 2) ? "contained" : "outlined"} onClick={() => setProficiency(lvl.substring(0, 2) as any)} sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 3, fontWeight: 700, borderColor: '#E0E0E0', color: proficiency === lvl.substring(0, 2) ? 'white' : '#424242' }}>{lvl}</Button>
                ))}
              </Stack>
            )}
            {step === 2 && (
              <Stack spacing={2}>
                {["travel", "work", "daily"].map(g => (
                  <Button key={g} variant={goalType === g ? "contained" : "outlined"} onClick={() => setGoalType(g as any)} sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 3, fontWeight: 700, borderColor: '#E0E0E0', color: goalType === g ? 'white' : '#424242', textTransform: 'capitalize' }}>{g}</Button>
                ))}
              </Stack>
            )}
            {step === 3 && (
              <Stack spacing={2}>
                {[10, 15, 20, 30].map(mins => (
                  <Button key={mins} variant={dailyMinutes === mins ? "contained" : "outlined"} onClick={() => setDailyMinutes(mins)} sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 3, fontWeight: 700, borderColor: '#E0E0E0', color: dailyMinutes === mins ? 'white' : '#424242' }}>{mins} minutes</Button>
                ))}
              </Stack>
            )}
            {step === 4 && (
              <Stack spacing={2}>
                {["Career growth", "Travel freely", "Pass an exam", "Just for fun"].map(r => (
                  <Button key={r} variant="outlined" onClick={handleNext} sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 3, fontWeight: 700, borderColor: '#E0E0E0', color: '#424242' }}>{r}</Button>
                ))}
              </Stack>
            )}

            <Typography variant="body2" sx={{ color: '#9E9E9E', mt: 4, mb: 2, textAlign: 'center' }}>{currentQ.footer}</Typography>

            {step !== 4 && (
              <Button variant="contained" fullWidth size="large" onClick={handleNext} disabled={(step === 0 && !name)} sx={{ py: 1.5, borderRadius: 3, fontSize: '1.1rem', bgcolor: '#4CAF50', '&:hover': { bgcolor: '#43A047' } }}>
                {loading ? "Loading..." : "Next Question"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Questions List */}
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#424242', mb: 2 }}>Upcoming Questions:</Typography>
        <Stack spacing={2}>
          {questions.slice(step + 1).map((q, idx) => (
            <Box key={q.id} sx={{ display: 'flex', alignItems: 'center', opacity: 0.5 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#757575', mr: 2 }}>
                {step + 2 + idx}
              </Box>
              <Typography sx={{ fontWeight: 600, color: '#616161' }}>{q.title}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default OnboardingPage;
