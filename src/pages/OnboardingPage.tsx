import { useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, MenuItem, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { saveOnboardingProfile, type OnboardingProfile } from "../core/auth";
import { getLearningPath } from "../core/api";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [languageCode, setLanguageCode] = useState<"en" | "el">("en");
  const [goalType, setGoalType] = useState<"daily" | "travel" | "work" | "study" | "migration">("work");
  const [proficiency, setProficiency] = useState<"A1" | "A2" | "B1" | "B2" | "C1" | "C2">("A2");
  const [dailyMinutes, setDailyMinutes] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const summary = useMemo(() => {
    const languageLabel = languageCode === "en" ? "الإنجليزية" : "اليونانية";
    const goalLabelMap = {
      daily: "الاستخدام اليومي",
      travel: "السفر",
      work: "العمل",
      study: "الدراسة",
      migration: "الهجرة"
    };
    return `${languageLabel} • ${goalLabelMap[goalType]} • ${proficiency} • ${dailyMinutes} دقيقة يوميا`;
  }, [dailyMinutes, goalType, languageCode, proficiency]);

  const handleStart = async () => {
    setError("");
    setLoading(true);
    try {
      const profile: OnboardingProfile = {
        languageCode,
        goalType,
        proficiency,
        dailyMinutes,
        completedAt: new Date().toISOString()
      };
      saveOnboardingProfile(profile);
      await getLearningPath(languageCode, goalType);
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إكمال الإعداد الأولي");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0F4C81 0%, #0B8F8C 55%, #7BC8A4 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 640, borderRadius: 4 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
            إعداد التجربة التعليمية
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            اختر تفضيلاتك لنبدأ بخطة تعلم مناسبة لك.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box sx={{ display: "grid", gap: 2 }}>
            <TextField select label="اللغة المستهدفة" value={languageCode} onChange={(e) => setLanguageCode(e.target.value as "en" | "el")}>
              <MenuItem value="en">الإنجليزية</MenuItem>
              <MenuItem value="el">اليونانية</MenuItem>
            </TextField>

            <TextField select label="هدف التعلم" value={goalType} onChange={(e) => setGoalType(e.target.value as "daily" | "travel" | "work" | "study" | "migration")}>
              <MenuItem value="daily">الاستخدام اليومي</MenuItem>
              <MenuItem value="travel">السفر</MenuItem>
              <MenuItem value="work">العمل</MenuItem>
              <MenuItem value="study">الدراسة</MenuItem>
              <MenuItem value="migration">الهجرة</MenuItem>
            </TextField>

            <TextField select label="مستواك الحالي" value={proficiency} onChange={(e) => setProficiency(e.target.value as "A1" | "A2" | "B1" | "B2" | "C1" | "C2")}>
              {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => <MenuItem key={level} value={level}>{level}</MenuItem>)}
            </TextField>

            <TextField
              select
              label="وقت التعلم اليومي"
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(Number(e.target.value))}
            >
              <MenuItem value={10}>10 دقائق</MenuItem>
              <MenuItem value={20}>20 دقيقة</MenuItem>
              <MenuItem value={30}>30 دقيقة</MenuItem>
              <MenuItem value={45}>45 دقيقة</MenuItem>
            </TextField>
          </Box>

          <Alert severity="info" sx={{ mt: 2.5 }}>
            الخطة المختارة: {summary}
          </Alert>

          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 2.5, py: 1.4, fontWeight: 800 }}
            disabled={loading}
            onClick={handleStart}
          >
            {loading ? "جاري تجهيز خطتك..." : "ابدأ الآن"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OnboardingPage;
