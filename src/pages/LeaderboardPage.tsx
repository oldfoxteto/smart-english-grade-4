import { useState, useEffect, useMemo } from "react";
import { Box, Typography, Card, CardContent, Avatar, IconButton, Stack, Chip, Tabs, Tab } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { getLeaderboard, type LeaderboardEntry } from "../core/api";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import { playfulPalette } from "../theme/playfulPalette";

type LeagueType = "Bronze" | "Silver" | "Gold";

const MotionCard = motion(Card);

const glassCardSx = {
  borderRadius: 5,
  border: `1px solid ${playfulPalette.line}`,
  background: playfulPalette.glass,
  boxShadow: playfulPalette.glow,
  backdropFilter: "blur(12px)",
};

const getLeagueTheme = (league: LeagueType) => {
  if (league === "Gold") {
    return {
      icon: <WorkspacePremiumRoundedIcon />,
      hero: "linear-gradient(135deg, #FFE27A 0%, #FFBE78 46%, #FF8BA7 100%)",
      soft: playfulPalette.softPeach,
      accent: "#C7851F",
    };
  }
  if (league === "Silver") {
    return {
      icon: <ShieldRoundedIcon />,
      hero: "linear-gradient(135deg, #B39DFF 0%, #79D7FF 56%, #8DE6C2 100%)",
      soft: playfulPalette.softLilac,
      accent: "#5F65C7",
    };
  }
  return {
    icon: <StarRoundedIcon />,
    hero: "linear-gradient(135deg, #FFBE78 0%, #FFE27A 52%, #8DE6C2 100%)",
    soft: playfulPalette.softMint,
    accent: "#2A8B6C",
  };
};

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [currentLeague, setCurrentLeague] = useState<LeagueType>("Bronze");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getLeaderboard(currentLeague)
      .then((response) => {
        setEntries(response.entries);
        setCurrentUser(response.currentUser);
        setCurrentLeague(response.league);
        setError("");
      })
      .catch(() => {
        setError("Could not load the live leaderboard right now.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentLeague]);

  const leagueTheme = getLeagueTheme(currentLeague);
  const topThree = useMemo(() => entries.slice(0, 3), [entries]);
  const restUsers = useMemo(() => entries.slice(3), [entries]);

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", pb: 10 }}>
      <AnimatedBackground />

      <Box sx={{ position: "relative", zIndex: 1, px: { xs: 0.5, sm: 1.5 }, pt: { xs: 1, md: 2 } }}>
        <MotionCard initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} sx={{ ...glassCardSx, overflow: "hidden", mb: 3 }}>
          <CardContent sx={{ p: { xs: 2.2, sm: 3.2 } }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" }, gap: 2.5, alignItems: "center" }}>
              <Box>
                <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", mb: 2 }}>
                  <IconButton onClick={() => navigate("/home")} sx={{ bgcolor: playfulPalette.softBlue, color: playfulPalette.ink }}>
                    <ArrowBackRoundedIcon />
                  </IconButton>
                  <Chip icon={leagueTheme.icon} label="Weekly leagues" sx={{ bgcolor: playfulPalette.lemon, color: playfulPalette.ink, fontWeight: 800, borderRadius: 999 }} />
                </Stack>

                <Typography sx={{ color: playfulPalette.ink, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.02, fontSize: { xs: "1.9rem", md: "2.8rem" }, maxWidth: 520 }}>
                  Cheerful rankings help kids feel progress, excitement, and healthy competition.
                </Typography>

                <Typography sx={{ color: playfulPalette.inkSoft, mt: 1.4, maxWidth: 560, lineHeight: 1.7 }}>
                  The leaderboard now uses brighter colors and simpler rank signals so children can quickly understand who is climbing.
                </Typography>
              </Box>

              <Box sx={{ ...glassCardSx, p: 2.2, background: leagueTheme.hero }}>
                <Typography sx={{ color: "rgba(40,75,99,0.72)", fontSize: "0.9rem", mb: 0.4 }}>Current standing</Typography>
                <Typography sx={{ color: playfulPalette.ink, fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.03em" }}>{currentLeague} League</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap", gap: 1 }}>
                  <Chip label={`${currentUser?.xp || 0} XP`} sx={{ bgcolor: "rgba(255,255,255,0.56)", color: playfulPalette.ink, fontWeight: 800 }} />
                  <Chip label={`${currentUser?.streak || 1} day streak`} sx={{ bgcolor: "rgba(255,255,255,0.56)", color: playfulPalette.ink, fontWeight: 800 }} />
                </Stack>
              </Box>
            </Box>
          </CardContent>
        </MotionCard>

        <MotionCard initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} sx={{ ...glassCardSx, mb: 3 }}>
          <CardContent sx={{ p: { xs: 1, sm: 1.3 } }}>
            <Tabs
              value={currentLeague}
              onChange={(_event, newValue: LeagueType) => setCurrentLeague(newValue)}
              variant="fullWidth"
              sx={{
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: 999,
                  background: playfulPalette.candyGradient,
                },
              }}
            >
              <Tab value="Bronze" label="Bronze" icon={<StarRoundedIcon fontSize="small" />} iconPosition="start" sx={{ fontWeight: 800 }} />
              <Tab value="Silver" label="Silver" icon={<ShieldRoundedIcon fontSize="small" />} iconPosition="start" sx={{ fontWeight: 800 }} />
              <Tab value="Gold" label="Gold" icon={<WorkspacePremiumRoundedIcon fontSize="small" />} iconPosition="start" sx={{ fontWeight: 800 }} />
            </Tabs>
          </CardContent>
        </MotionCard>

        {loading && (
          <Box sx={{ display: "grid", placeItems: "center", py: 4 }}>
            <CircularProgress sx={{ color: playfulPalette.coral }} />
          </Box>
        )}

        {error && !loading && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2.2, mb: 3 }}>
          {topThree.map((user, index) => (
            <MotionCard key={user.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} sx={{ ...glassCardSx, textAlign: "center", border: user.isCurrentUser ? `2px solid ${playfulPalette.coral}` : `1px solid ${playfulPalette.line}` }}>
              <CardContent sx={{ p: 2.2 }}>
                <Avatar
                  sx={{
                    mx: "auto",
                    mb: 1.2,
                    width: 62,
                    height: 62,
                    bgcolor: index === 0 ? playfulPalette.lemon : index === 1 ? playfulPalette.lilac : playfulPalette.peach,
                    color: playfulPalette.ink,
                    fontWeight: 900,
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Chip label={`#${user.rank}`} sx={{ mb: 1.2, bgcolor: leagueTheme.soft, color: leagueTheme.accent, fontWeight: 800 }} />
                <Typography sx={{ color: playfulPalette.ink, fontWeight: 800 }}>
                  {user.name} {user.isCurrentUser ? "(You)" : ""}
                </Typography>
                <Typography sx={{ color: playfulPalette.inkSoft, mt: 0.5 }}>{user.xp} XP</Typography>
                <Chip
                  icon={<LocalFireDepartmentRoundedIcon sx={{ color: `${playfulPalette.coral} !important` }} />}
                  label={`${user.streak} days`}
                  size="small"
                  sx={{ mt: 1.2, bgcolor: playfulPalette.softPink, color: playfulPalette.ink, fontWeight: 800 }}
                />
              </CardContent>
            </MotionCard>
          ))}
          </Box>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={`${currentLeague}-${entries.length}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.24 }}>
            <Stack spacing={2}>
              {restUsers.map((user) => (
                <Card
                  key={user.id}
                  sx={{
                    ...glassCardSx,
                    borderRadius: 4,
                    border: user.isCurrentUser ? `2px solid ${playfulPalette.coral}` : `1px solid ${playfulPalette.line}`,
                    boxShadow: user.isCurrentUser ? "0 18px 32px rgba(255,139,167,0.18)" : "0 12px 24px rgba(255,190,120,0.1)",
                  }}
                >
                  <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
                    <Box sx={{ width: 38, textAlign: "center" }}>
                      <Typography sx={{ color: playfulPalette.inkSoft, fontWeight: 900, fontSize: "1.1rem" }}>
                        {user.rank}
                      </Typography>
                    </Box>

                    <Avatar sx={{ bgcolor: playfulPalette.softBlue, color: playfulPalette.ink, fontWeight: 900 }}>
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: playfulPalette.ink, fontWeight: 800 }}>
                        {user.name} {user.isCurrentUser ? "(You)" : ""}
                      </Typography>
                      <Typography sx={{ color: playfulPalette.inkSoft, fontSize: "0.92rem" }}>
                        {user.xp} XP total
                      </Typography>
                    </Box>

                    <Stack spacing={0.7} sx={{ alignItems: "flex-end" }}>
                      <Chip label={`${user.xp} XP`} sx={{ bgcolor: playfulPalette.softPeach, color: playfulPalette.ink, fontWeight: 800 }} />
                      {user.streak > 2 && (
                        <Chip
                          icon={<LocalFireDepartmentRoundedIcon sx={{ color: `${playfulPalette.coral} !important` }} />}
                          label={`${user.streak} days`}
                          size="small"
                          sx={{ bgcolor: playfulPalette.softPink, color: playfulPalette.ink, fontWeight: 800 }}
                        />
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default LeaderboardPage;
