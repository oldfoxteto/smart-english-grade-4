import { AppBar, Box, Chip, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../core/ProgressContext";
import { clearTokens } from "../../core/auth";

const Header = () => {
  const navigate = useNavigate();
  const { progress, resetProgress } = useProgress();

  const handleLogout = () => {
    clearTokens();
    resetProgress();
    navigate("/login");
  };

  return (
    <AppBar position="static" elevation={0} sx={{ background: "linear-gradient(135deg, #0B4B88 0%, #0C7FA0 100%)", mb: 0 }}>
      <Toolbar sx={{ py: 1, minHeight: { xs: 68, md: 74 }, gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer", flexGrow: 1, minWidth: 0 }} onClick={() => navigate("/home")}>
          <Box
            sx={{
              width: { xs: 36, md: 42 },
              height: { xs: 36, md: 42 },
              borderRadius: 1.8,
              background: "rgba(255,255,255,0.24)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 1.1,
              color: "white",
              fontWeight: 900
            }}
          >
            LS
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ color: "white", fontWeight: 900, lineHeight: 1.1, fontSize: { xs: "1rem", md: "1.15rem" } }}>
              لسان AI
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.82)", fontWeight: 600, display: { xs: "none", sm: "block" } }}>
              تعلم اللغات للعرب
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Chip label={`XP ${progress.stars}`} size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "white", fontWeight: 700 }} />
          <Chip label={`مستوى ${progress.level}`} size="small" sx={{ background: "rgba(255,200,0,0.32)", color: "white", fontWeight: 700 }} />

          <Tooltip title={progress.username}>
            <IconButton sx={{ width: 34, height: 34, background: "rgba(255,255,255,0.25)", color: "white" }}>
              <PersonRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="تسجيل الخروج">
            <IconButton onClick={handleLogout} sx={{ width: 34, height: 34, background: "rgba(255,255,255,0.25)", color: "white" }}>
              <LogoutRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
