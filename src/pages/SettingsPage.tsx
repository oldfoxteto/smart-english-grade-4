import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode, type SyntheticEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SettingsVoiceRoundedIcon from "@mui/icons-material/SettingsVoiceRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import { playfulPalette } from "../theme/playfulPalette";
import { getUserSettings, saveUserSettings, type UserSettingsPayload } from "../core/api";

type UserSettings = UserSettingsPayload;

const defaultSettings: UserSettings = {
  profile: {
    name: "Ahmed Student",
    email: "ahmed@example.com",
    avatar: "/avatars/user.jpg",
    level: 12,
    xp: 3450,
    language: "ar",
  },
  notifications: {
    email: true,
    push: true,
    sound: true,
    vibration: true,
    desktop: true,
  },
  audio: {
    microphone: true,
    speaker: true,
    volume: 75,
    inputDevice: "default",
    outputDevice: "default",
  },
  video: {
    camera: true,
    quality: "medium",
    device: "default",
  },
  appearance: {
    theme: "light",
    language: "ar",
    fontSize: "medium",
    compactMode: false,
  },
  privacy: {
    profileVisibility: "public",
    showProgress: true,
    showAchievements: true,
    dataCollection: true,
  },
  performance: {
    autoPlay: true,
    preloadContent: true,
    reduceAnimations: false,
    offlineMode: false,
  },
};

const MotionCard = motion(Card);

const glassCardSx = {
  borderRadius: 5,
  border: `1px solid ${playfulPalette.line}`,
  background: playfulPalette.glass,
  boxShadow: playfulPalette.glow,
  backdropFilter: "blur(12px)",
};

const sectionTitleSx = {
  color: playfulPalette.ink,
  fontWeight: 900,
  fontSize: "1.2rem",
  letterSpacing: "-0.03em",
};

type SettingsSectionProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

function SettingsSection({ title, subtitle, children }: SettingsSectionProps) {
  return (
    <MotionCard initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} sx={glassCardSx}>
      <CardContent sx={{ p: { xs: 2.2, sm: 2.8 } }}>
        <Typography sx={sectionTitleSx}>{title}</Typography>
        <Typography sx={{ color: playfulPalette.inkSoft, mt: 0.6, mb: 2.2, lineHeight: 1.65 }}>{subtitle}</Typography>
        <Stack spacing={2}>{children}</Stack>
      </CardContent>
    </MotionCard>
  );
}

type ToggleRowProps = {
  title: string;
  subtitle: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function ToggleRow({ title, subtitle, checked, onChange }: ToggleRowProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        p: 1.6,
        borderRadius: 3,
        bgcolor: "rgba(255,255,255,0.7)",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ color: playfulPalette.ink, fontWeight: 800 }}>{title}</Typography>
        <Typography sx={{ color: playfulPalette.inkSoft, mt: 0.3, fontSize: "0.92rem", lineHeight: 1.55 }}>{subtitle}</Typography>
      </Box>
      <Switch checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </Box>
  );
}

export const SettingsPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getUserSettings()
      .then((response) => {
        if (!active) return;
        setSettings(response.settings);
        setHasChanges(false);
        setLoadError(null);
      })
      .catch(() => {
        if (!active) return;
        setSettings(defaultSettings);
        setLoadError("Could not load live settings, so the page is showing local defaults for now.");
      })
      .finally(() => {
        if (active) setInitializing(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasChanges) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  const handleSettingChange = <K extends keyof UserSettings>(
    category: K,
    key: keyof UserSettings[K],
    value: UserSettings[K][keyof UserSettings[K]]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    setHasChanges(true);
    setStatusMessage(null);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await saveUserSettings(settings);
      setSettings(response.settings);
      setHasChanges(false);
      setStatusMessage("Settings were saved to the backend successfully.");
    } catch {
      setStatusMessage("Saving settings failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = () => {
    if (!window.confirm("Reset all settings to the default values?")) return;
    setSettings({
      ...defaultSettings,
      profile: {
        ...settings.profile,
        language: defaultSettings.profile.language,
      },
    });
    setHasChanges(true);
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", "settings.json");
    linkElement.click();
  };

  const handleImportSettings = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const importedSettings = JSON.parse(String(loadEvent.target?.result || "{}")) as UserSettings;
        setSettings(importedSettings);
        setHasChanges(true);
        setStatusMessage("Imported settings file loaded locally. Save changes to store it on the backend.");
      } catch {
        window.alert("Could not import that settings file.");
      }
    };
    reader.readAsText(file);
  };

  const tabs = useMemo(
    () => [
      { label: "Profile", icon: <AutoAwesomeRoundedIcon fontSize="small" /> },
      { label: "Notifications", icon: <NotificationsRoundedIcon fontSize="small" /> },
      { label: "Audio & Video", icon: <SettingsVoiceRoundedIcon fontSize="small" /> },
      { label: "Appearance", icon: <PaletteRoundedIcon fontSize="small" /> },
      { label: "Privacy", icon: <ShieldRoundedIcon fontSize="small" /> },
      { label: "Performance", icon: <SpeedRoundedIcon fontSize="small" /> },
    ],
    []
  );

  const renderTabContent = () => {
    if (activeTab === 0) {
      return (
        <Stack spacing={3}>
          <SettingsSection title="Profile details" subtitle="Adjust the core account information used across the app.">
            <TextField
              fullWidth
              label="Display name"
              value={settings.profile.name}
              onChange={(event) => handleSettingChange("profile", "name", event.target.value)}
            />
            <TextField
              fullWidth
              label="Email"
              value={settings.profile.email}
              onChange={(event) => handleSettingChange("profile", "email", event.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={settings.profile.language}
                label="Language"
                onChange={(event) => handleSettingChange("profile", "language", event.target.value as "ar" | "en")}
              >
                <MenuItem value="ar">Arabic</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>
          </SettingsSection>

          <SettingsSection title="Learning stats" subtitle="A bright snapshot of progress for a quick and friendly overview.">
            <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", gap: 2 }}>
              <Chip label={`Level ${settings.profile.level}`} sx={{ bgcolor: playfulPalette.softLilac, color: playfulPalette.ink, fontWeight: 800 }} />
              <Chip label={`${settings.profile.xp} XP`} sx={{ bgcolor: playfulPalette.softPeach, color: playfulPalette.ink, fontWeight: 800 }} />
              <Chip
                label={`${1000 - (settings.profile.xp % 1000)} XP to next level`}
                sx={{ bgcolor: playfulPalette.softMint, color: playfulPalette.ink, fontWeight: 800 }}
              />
            </Stack>
          </SettingsSection>
        </Stack>
      );
    }

    if (activeTab === 1) {
      return (
        <SettingsSection title="Notifications" subtitle="Control when and how the learner gets nudges, alerts, and reminders.">
          <ToggleRow title="Email updates" subtitle="Receive reminders and summaries by email." checked={settings.notifications.email} onChange={(value) => handleSettingChange("notifications", "email", value)} />
          <ToggleRow title="Push notifications" subtitle="Show real-time prompts in the browser." checked={settings.notifications.push} onChange={(value) => handleSettingChange("notifications", "push", value)} />
          <ToggleRow title="Sounds" subtitle="Play small audio cues for system events." checked={settings.notifications.sound} onChange={(value) => handleSettingChange("notifications", "sound", value)} />
          <ToggleRow title="Vibration" subtitle="Allow vibration feedback on supported devices." checked={settings.notifications.vibration} onChange={(value) => handleSettingChange("notifications", "vibration", value)} />
          <ToggleRow title="Desktop alerts" subtitle="Display desktop notifications when available." checked={settings.notifications.desktop} onChange={(value) => handleSettingChange("notifications", "desktop", value)} />
        </SettingsSection>
      );
    }

    if (activeTab === 2) {
      return (
        <Stack spacing={3}>
          <SettingsSection title="Audio controls" subtitle="Tune microphone, speaker output, and device routing.">
            <ToggleRow title="Microphone" subtitle="Enable microphone access for voice activities." checked={settings.audio.microphone} onChange={(value) => handleSettingChange("audio", "microphone", value)} />
            <ToggleRow title="Speaker" subtitle="Enable spoken responses and playback." checked={settings.audio.speaker} onChange={(value) => handleSettingChange("audio", "speaker", value)} />
            <Box sx={{ p: 1.6, borderRadius: 3, bgcolor: "rgba(255,255,255,0.7)" }}>
              <Typography sx={{ color: playfulPalette.ink, fontWeight: 800, mb: 1 }}>Volume</Typography>
              <Slider value={settings.audio.volume} onChange={(_event, value) => handleSettingChange("audio", "volume", value as number)} min={0} max={100} valueLabelDisplay="auto" />
            </Box>
            <FormControl fullWidth>
              <InputLabel>Input device</InputLabel>
              <Select value={settings.audio.inputDevice} label="Input device" onChange={(event) => handleSettingChange("audio", "inputDevice", event.target.value)}>
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="headphones">Headset mic</MenuItem>
                <MenuItem value="microphone">External mic</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Output device</InputLabel>
              <Select value={settings.audio.outputDevice} label="Output device" onChange={(event) => handleSettingChange("audio", "outputDevice", event.target.value)}>
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="speakers">Speakers</MenuItem>
                <MenuItem value="headphones">Headphones</MenuItem>
              </Select>
            </FormControl>
          </SettingsSection>

          <SettingsSection title="Video controls" subtitle="Manage camera usage and visual quality.">
            <ToggleRow title="Camera" subtitle="Enable camera for vision activities." checked={settings.video.camera} onChange={(value) => handleSettingChange("video", "camera", value)} />
            <FormControl fullWidth>
              <InputLabel>Video quality</InputLabel>
              <Select value={settings.video.quality} label="Video quality" onChange={(event) => handleSettingChange("video", "quality", event.target.value as "low" | "medium" | "high")}>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Camera device</InputLabel>
              <Select value={settings.video.device} label="Camera device" onChange={(event) => handleSettingChange("video", "device", event.target.value)}>
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="webcam">Webcam</MenuItem>
                <MenuItem value="external">External camera</MenuItem>
              </Select>
            </FormControl>
          </SettingsSection>
        </Stack>
      );
    }

    if (activeTab === 3) {
      return (
        <SettingsSection title="Appearance" subtitle="Choose the overall look, text size, and layout feel of the app.">
          <FormControl fullWidth>
            <InputLabel>Theme</InputLabel>
            <Select value={settings.appearance.theme} label="Theme" onChange={(event) => handleSettingChange("appearance", "theme", event.target.value as "light" | "dark" | "auto")}>
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
              <MenuItem value="auto">Auto</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Language</InputLabel>
            <Select value={settings.appearance.language} label="Language" onChange={(event) => handleSettingChange("appearance", "language", event.target.value as "ar" | "en")}>
              <MenuItem value="ar">Arabic</MenuItem>
              <MenuItem value="en">English</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Font size</InputLabel>
            <Select value={settings.appearance.fontSize} label="Font size" onChange={(event) => handleSettingChange("appearance", "fontSize", event.target.value as "small" | "medium" | "large")}>
              <MenuItem value="small">Small</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="large">Large</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel control={<Switch checked={settings.appearance.compactMode} onChange={(event) => handleSettingChange("appearance", "compactMode", event.target.checked)} />} label="Compact mode" />
        </SettingsSection>
      );
    }

    if (activeTab === 4) {
      return (
        <SettingsSection title="Privacy" subtitle="Adjust what information is visible and what data is collected.">
          <FormControl fullWidth>
            <InputLabel>Profile visibility</InputLabel>
            <Select value={settings.privacy.profileVisibility} label="Profile visibility" onChange={(event) => handleSettingChange("privacy", "profileVisibility", event.target.value as "public" | "private")}>
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
            </Select>
          </FormControl>
          <ToggleRow title="Show progress" subtitle="Let others see general learning progress." checked={settings.privacy.showProgress} onChange={(value) => handleSettingChange("privacy", "showProgress", value)} />
          <ToggleRow title="Show achievements" subtitle="Display earned badges and milestones." checked={settings.privacy.showAchievements} onChange={(value) => handleSettingChange("privacy", "showAchievements", value)} />
          <ToggleRow title="Data collection" subtitle="Allow anonymous usage data for product improvements." checked={settings.privacy.dataCollection} onChange={(value) => handleSettingChange("privacy", "dataCollection", value)} />
        </SettingsSection>
      );
    }

    return (
      <SettingsSection title="Performance" subtitle="Choose how aggressively the app loads and renders content.">
        <ToggleRow title="Autoplay" subtitle="Play supported content automatically." checked={settings.performance.autoPlay} onChange={(value) => handleSettingChange("performance", "autoPlay", value)} />
        <ToggleRow title="Preload content" subtitle="Load likely next content early for smoother use." checked={settings.performance.preloadContent} onChange={(value) => handleSettingChange("performance", "preloadContent", value)} />
        <ToggleRow title="Reduce animations" subtitle="Use fewer transitions for a calmer, lighter UI." checked={settings.performance.reduceAnimations} onChange={(value) => handleSettingChange("performance", "reduceAnimations", value)} />
        <ToggleRow title="Offline mode" subtitle="Keep more content available when connection is weak." checked={settings.performance.offlineMode} onChange={(value) => handleSettingChange("performance", "offlineMode", value)} />
      </SettingsSection>
    );
  };

  if (initializing) {
    return (
      <Box sx={{ minHeight: "70vh", display: "grid", placeItems: "center", px: 2 }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress sx={{ color: playfulPalette.coral, mb: 2 }} />
          <Typography sx={{ color: playfulPalette.ink, fontWeight: 800 }}>
            Loading live settings...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", pb: 10 }}>
      <AnimatedBackground />

      <Box sx={{ position: "relative", zIndex: 1, px: { xs: 0.5, sm: 1.5 }, pt: { xs: 1, md: 2 } }}>
        <MotionCard initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} sx={{ ...glassCardSx, overflow: "hidden", mb: 3 }}>
          <CardContent sx={{ p: { xs: 2.2, sm: 3.2 } }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" }, gap: 2.5, alignItems: "center" }}>
              <Box>
                <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", mb: 2 }}>
                  <IconButton onClick={() => navigate("/home")} sx={{ bgcolor: playfulPalette.softBlue, color: playfulPalette.ink }}>
                    <ArrowBackRoundedIcon />
                  </IconButton>
                  <Chip icon={<TuneRoundedIcon sx={{ color: `${playfulPalette.ink} !important` }} />} label="Control center" sx={{ bgcolor: playfulPalette.lemon, color: playfulPalette.ink, fontWeight: 800, borderRadius: 999 }} />
                </Stack>

                <Typography sx={{ color: playfulPalette.ink, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.02, fontSize: { xs: "1.9rem", md: "2.8rem" }, maxWidth: 520 }}>
                  Bright settings help the app feel calm, playful, and easier for children to use.
                </Typography>

                <Typography sx={{ color: playfulPalette.inkSoft, mt: 1.4, maxWidth: 560, lineHeight: 1.7 }}>
                  These controls keep the same behavior as before, but the page now matches the cheerful visual style of the learning experience.
                </Typography>
              </Box>

              <Box sx={{ ...glassCardSx, p: 2.2, background: playfulPalette.heroGradient, color: playfulPalette.ink }}>
                <Typography sx={{ color: "rgba(40,75,99,0.72)", fontSize: "0.9rem", mb: 0.5 }}>Current learner</Typography>
                <Typography sx={{ fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.03em" }}>{settings.profile.name}</Typography>
                <Typography sx={{ color: "rgba(40,75,99,0.74)", mt: 0.5 }}>{settings.profile.email}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1.6, flexWrap: "wrap", gap: 1 }}>
                  <Chip label={`Lvl ${settings.profile.level}`} sx={{ bgcolor: "rgba(255,255,255,0.56)", color: playfulPalette.ink, fontWeight: 800 }} />
                  <Chip label={`${settings.profile.xp} XP`} sx={{ bgcolor: "rgba(255,255,255,0.56)", color: playfulPalette.ink, fontWeight: 800 }} />
                </Stack>
              </Box>
            </Box>
          </CardContent>
        </MotionCard>

        <MotionCard initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }} sx={{ ...glassCardSx, mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.4} sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", md: "center" } }}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                <Button
                  startIcon={<SaveRoundedIcon />}
                  variant="contained"
                  onClick={() => void handleSaveSettings()}
                  disabled={!hasChanges || saving}
                  sx={{ borderRadius: 999, px: 2.3, fontWeight: 900, color: playfulPalette.ink, background: playfulPalette.actionGradient }}
                >
                  {saving ? "Saving..." : "Save changes"}
                </Button>
                <Button startIcon={<RefreshRoundedIcon />} variant="outlined" onClick={handleResetSettings} sx={{ borderRadius: 999, fontWeight: 800 }}>
                  Reset
                </Button>
                <Button startIcon={<DownloadRoundedIcon />} variant="outlined" onClick={handleExportSettings} sx={{ borderRadius: 999, fontWeight: 800 }}>
                  Export
                </Button>
                <Button startIcon={<UploadRoundedIcon />} variant="outlined" onClick={() => document.getElementById("import-settings")?.click()} sx={{ borderRadius: 999, fontWeight: 800 }}>
                  Import
                </Button>
                <input id="import-settings" type="file" accept=".json" hidden onChange={handleImportSettings} />
              </Stack>

              <Chip
                label={hasChanges ? "Unsaved changes" : "All changes saved"}
                sx={{
                  bgcolor: hasChanges ? playfulPalette.softPink : playfulPalette.softMint,
                  color: hasChanges ? playfulPalette.coral : "#24765B",
                  fontWeight: 800,
                  borderRadius: 999,
                }}
              />
            </Stack>
          </CardContent>
        </MotionCard>

        <MotionCard initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} sx={{ ...glassCardSx, mb: 3 }}>
          <CardContent sx={{ p: { xs: 1, sm: 1.3 } }}>
            <Tabs
              value={activeTab}
              onChange={(_event: SyntheticEvent, value: number) => setActiveTab(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 0,
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: 999,
                  background: playfulPalette.candyGradient,
                },
              }}
            >
              {tabs.map((tab) => (
                <Tab key={tab.label} icon={tab.icon} iconPosition="start" label={tab.label} sx={{ minHeight: 48, fontWeight: 800 }} />
              ))}
            </Tabs>
          </CardContent>
        </MotionCard>

        {renderTabContent()}

        {hasChanges && (
          <Alert severity="warning" sx={{ mt: 3, borderRadius: 3 }}>
            You have unsaved changes. Save them before leaving if you want to keep this configuration.
          </Alert>
        )}

        {loadError && (
          <Alert severity="info" sx={{ mt: 3, borderRadius: 3 }}>
            {loadError}
          </Alert>
        )}

        {statusMessage && !hasChanges && (
          <Alert severity="success" sx={{ mt: 3, borderRadius: 3 }}>
            {statusMessage}
          </Alert>
        )}

        <Divider sx={{ my: 3, opacity: 0 }} />
      </Box>
    </Box>
  );
};
