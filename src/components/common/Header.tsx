import {
  AppBar,
  Box,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../core/ProgressContext";
import { clearTokens } from "../../core/auth";
import { playfulPalette } from "../../theme/playfulPalette";

const Header = () => {
  const navigate = useNavigate();
  const { progress, resetProgress } = useProgress();

  const handleLogout = () => {
    clearTokens();
    resetProgress();
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "transparent",
        boxShadow: "none",
        pt: { xs: 1.25, md: 1.75 },
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 72, md: 82 },
          px: { xs: 1.5, sm: 2.5, md: 3.5 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            mx: "auto",
            maxWidth: 1120,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
            px: { xs: 1.5, sm: 2, md: 2.5 },
            py: 1.2,
            borderRadius: 4,
            background: playfulPalette.headerGradient,
            backdropFilter: "blur(18px)",
            border: `1px solid ${playfulPalette.line}`,
            boxShadow: playfulPalette.glow,
          }}
        >
          <Box
            onClick={() => navigate("/home")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              minWidth: 0,
              cursor: "pointer",
              flexShrink: 1,
            }}
          >
            <Box
              sx={{
                width: { xs: 42, md: 48 },
                height: { xs: 42, md: 48 },
                borderRadius: 2.5,
                display: "grid",
                placeItems: "center",
                color: playfulPalette.ink,
                fontWeight: 900,
                letterSpacing: "-0.04em",
                background: playfulPalette.actionGradient,
                boxShadow: "0 10px 24px rgba(255, 190, 120, 0.24)",
              }}
            >
              LS
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  color: playfulPalette.ink,
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  fontSize: { xs: "1rem", md: "1.12rem" },
                }}
              >
                Lisan AI
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(40,75,99,0.78)",
                  fontWeight: 600,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Learn with AI, lessons, and daily practice
              </Typography>
            </Box>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              justifyContent: "flex-end",
              flexShrink: 0,
            }}
          >
            <Chip
              icon={<AutoAwesomeRoundedIcon sx={{ color: `${playfulPalette.coral} !important` }} />}
              label={`${progress.stars} XP`}
              size="small"
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                bgcolor: "rgba(255,255,255,0.52)",
                color: playfulPalette.ink,
                fontWeight: 800,
                borderRadius: 2.5,
              }}
            />
            <Chip
              icon={<LocalFireDepartmentRoundedIcon sx={{ color: `${playfulPalette.peach} !important` }} />}
              label={`Lvl ${progress.level}`}
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.52)",
                color: playfulPalette.ink,
                fontWeight: 800,
                borderRadius: 2.5,
              }}
            />

            <Tooltip title={progress.username || "Student"}>
              <IconButton
                sx={{
                  width: 38,
                  height: 38,
                  color: playfulPalette.ink,
                  bgcolor: "rgba(255,255,255,0.52)",
                  border: `1px solid ${playfulPalette.line}`,
                }}
              >
                <PersonRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Log out">
              <IconButton
                onClick={handleLogout}
                sx={{
                  width: 38,
                  height: 38,
                  color: playfulPalette.ink,
                  bgcolor: "rgba(255,255,255,0.52)",
                  border: `1px solid ${playfulPalette.line}`,
                }}
              >
                <LogoutRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
