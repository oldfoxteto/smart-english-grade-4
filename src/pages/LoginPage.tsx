import { useState } from "react";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useProgress } from "../core/ProgressContext";
import { login, register } from "../core/api";
import { isOnboardingCompleted, saveCurrentUser, saveTokens } from "../core/auth";

const LoginPage = () => {
  const { setUsername } = useProgress();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"register" | "login">("register");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const payload = { email: normalizedEmail, password, displayName: displayName.trim(), country: "SA" };

      const response = mode === "register" ? await register(payload) : await login(payload);
      saveTokens(response.token, response.refreshToken);
      saveCurrentUser(response.user);
      setUsername(response.user.displayName || displayName || "متعلم");
      // Force a full navigation reload to ensure all providers read localStorage
      const target = isOnboardingCompleted() ? "/home" : "/onboarding";
      window.location.replace(target);
    } catch (err) {
      const message = err instanceof Error ? err.message : "تعذر إتمام عملية تسجيل الدخول";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0B4B88 0%, #0C7FA0 50%, #85D8CE 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 4 },
          borderRadius: 3,
          width: "100%",
          maxWidth: 460,
          background: "rgba(255,255,255,0.96)",
          boxShadow: "0 24px 60px rgba(11,75,136,0.22)"
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#0B4B88", mb: 0.5, textAlign: "center" }}>
          لسان AI
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: "center" }}>
          منصة عربية لتعلم الإنجليزية واليونانية
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <TextField
              fullWidth
              label="الاسم"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
          )}
          <TextField
            fullWidth
            type="email"
            label="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            type="password"
            label="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
            helperText="8 أحرف على الأقل"
            required
          />

          <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ py: 1.4, mb: 1.5, fontWeight: 800 }}>
            {loading ? "جاري المعالجة..." : mode === "register" ? "إنشاء حساب" : "تسجيل الدخول"}
          </Button>

          <Button type="button" fullWidth variant="text" onClick={() => setMode((prev) => (prev === "register" ? "login" : "register"))}>
            {mode === "register" ? "لديك حساب؟ سجّل الدخول" : "ليس لديك حساب؟ أنشئ حسابًا"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
