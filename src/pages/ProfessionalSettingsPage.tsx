// Professional Settings Page with Full Functionality
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Switch,
  FormControlLabel,
  Slider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Alert,
  AlertTitle,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Badge,
  CircularProgress,
  Backdrop,
  Fade,
  Chip,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Person,
  Notifications,
  VolumeUp,
  VolumeOff,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  Palette,
  Security,
  Save,
  Refresh,
  Download,
  Upload,
  Edit,
  Visibility,
  VisibilityOff,
  DarkMode,
  LightMode,
  Wifi,
  WifiOff,
  BatteryFull,
  BatteryAlert,
  SignalCellular4Bar,
  SignalCellularOff,
  TrendingUp,
  EmojiEvents,
  PlayArrow,
  ExpandMore,
  Language,
  Speed,
  Storage,
  Help,
  Info,
  CheckCircle,
  Warning,
  Error,
  Sync,
  CloudUpload,
  CloudDownload,
  Lock,
  LockOpen,
  Key,
  Shield,
  PrivacyTip,
  GppGood,
  GppMaybe,
  GppBad,
  PhonelinkLock,
  PhonelinkSetup,
  Devices,
  Computer,
  Smartphone,
  Tablet,
  Monitor,
  Headset,
  Speaker,
  Hearing,
  HearingDisabled,
  RecordVoiceOver,
  SettingsVoice,
  SettingsInputComponent,
  SettingsInputAntenna,
  SettingsInputHdmi,
  SettingsInputComposite,
  SettingsInputSvideo,
  SettingsApplications,
  SettingsAccessibility,
  SettingsEthernet,
  SettingsPhone,
  SettingsRemote,
  SettingsBluetooth,
  SettingsBrightness,
  SettingsOverscan,
  SettingsSystemDaydream,
  SettingsVoice as VoiceSettings,
  SettingsInputComponent as ComponentSettings,
} from '@mui/icons-material';

// Types
interface UserSettings {
  profile: {
    name: string;
    email: string;
    avatar: string;
    level: number;
    xp: number;
    language: 'ar' | 'en';
    bio: string;
    location: string;
    timezone: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
    vibration: boolean;
    desktop: boolean;
    sms: boolean;
    inApp: boolean;
    weekly: boolean;
    daily: boolean;
  };
  audio: {
    microphone: boolean;
    speaker: boolean;
    volume: number;
    inputDevice: string;
    outputDevice: string;
    noiseSuppression: boolean;
    echoCancellation: boolean;
    autoGainControl: boolean;
  };
  video: {
    camera: boolean;
    quality: 'low' | 'medium' | 'high' | 'ultra';
    device: string;
    backgroundBlur: boolean;
    virtualBackground: boolean;
    mirrorMode: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    language: 'ar' | 'en';
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    compactMode: boolean;
    animations: boolean;
    highContrast: boolean;
    reduceMotion: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showProgress: boolean;
    showAchievements: boolean;
    showActivity: boolean;
    dataCollection: boolean;
    analytics: boolean;
    cookies: boolean;
    locationSharing: boolean;
  };
  performance: {
    autoPlay: boolean;
    preloadContent: boolean;
    reduceAnimations: boolean;
    offlineMode: boolean;
    lowPowerMode: boolean;
    backgroundSync: boolean;
    cacheSize: number;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    loginNotifications: boolean;
    passwordStrength: 'weak' | 'medium' | 'strong';
    lastPasswordChange: Date;
    activeSessions: number;
    trustedDevices: string[];
  }
}

// Enhanced Mock Data
const mockSettings: UserSettings = {
  profile: {
    name: 'أحمد الطالب',
    email: 'ahmed@example.com',
    avatar: '/avatars/user.jpg',
    level: 12,
    xp: 3450,
    language: 'ar',
    bio: 'طالب متحمس لتعلم اللغة الإنجليزية',
    location: 'الرياض، السعودية',
    timezone: 'Asia/Riyadh',
  },
  notifications: {
    email: true,
    push: true,
    sound: true,
    vibration: true,
    desktop: true,
    sms: false,
    inApp: true,
    weekly: true,
    daily: false,
  },
  audio: {
    microphone: true,
    speaker: true,
    volume: 75,
    inputDevice: 'default',
    outputDevice: 'default',
    noiseSuppression: true,
    echoCancellation: true,
    autoGainControl: true,
  },
  video: {
    camera: true,
    quality: 'medium',
    device: 'default',
    backgroundBlur: false,
    virtualBackground: false,
    mirrorMode: true,
  },
  appearance: {
    theme: 'light',
    language: 'ar',
    fontSize: 'medium',
    compactMode: false,
    animations: true,
    highContrast: false,
    reduceMotion: false,
  },
  privacy: {
    profileVisibility: 'public',
    showProgress: true,
    showAchievements: true,
    showActivity: false,
    dataCollection: true,
    analytics: true,
    cookies: true,
    locationSharing: false,
  },
  performance: {
    autoPlay: true,
    preloadContent: true,
    reduceAnimations: false,
    offlineMode: false,
    lowPowerMode: false,
    backgroundSync: true,
    cacheSize: 500,
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginNotifications: true,
    passwordStrength: 'medium',
    lastPasswordChange: new Date('2024-01-01'),
    activeSessions: 2,
    trustedDevices: ['iPhone 13', 'MacBook Pro'],
  }
};

const ProfessionalSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(mockSettings);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notificationTest, setNotificationTest] = useState(false);

  useEffect(() => {
    // Check for unsaved changes
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const handleSettingChange = (category: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setHasChanges(false);
      playSound('success');
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
      playSound('error');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟')) {
      setSettings(mockSettings);
      setHasChanges(true);
      playSound('warning');
    }
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `settings_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    playSound('success');
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          setHasChanges(true);
          playSound('success');
        } catch (error) {
          console.error('Error importing settings:', error);
          playSound('error');
          alert('خطأ في استيراد الإعدادات');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleTestNotification = () => {
    setNotificationTest(true);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('اختبار الإشعار', {
        body: 'هذا إشعار اختبار من منصة التعلم',
        icon: '/favicon.ico',
      });
    }
    setTimeout(() => setNotificationTest(false), 3000);
    playSound('notification');
  };

  const handleTestAudio = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 440; // A4
    gainNode.gain.value = settings.audio.volume / 1000;
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const playSound = (type: 'success' | 'error' | 'warning' | 'notification') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'success':
        oscillator.frequency.value = 523.25; // C5
        gainNode.gain.value = 0.1;
        break;
      case 'error':
        oscillator.frequency.value = 220; // A3
        gainNode.gain.value = 0.1;
        break;
      case 'warning':
        oscillator.frequency.value = 440; // A4
        gainNode.gain.value = 0.05;
        break;
      case 'notification':
        oscillator.frequency.value = 880; // A5
        gainNode.gain.value = 0.05;
        break;
    }
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const sections = [
    { id: 'profile', title: 'الملف الشخصي', icon: <Person /> },
    { id: 'notifications', title: 'الإشعارات', icon: <Notifications /> },
    { id: 'audio', title: 'الصوت', icon: <VolumeUp /> },
    { id: 'video', title: 'الفيديو', icon: <Videocam /> },
    { id: 'appearance', title: 'المظهر', icon: <Palette /> },
    { id: 'privacy', title: 'الخصوصية', icon: <Security /> },
    { id: 'performance', title: 'الأداء', icon: <Speed /> },
    { id: 'security', title: 'الأمان', icon: <Shield /> },
  ];

  return (
    <Box sx={{ py: 4 }}>
      {/* Loading Overlay */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={saving}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress color="inherit" />
          <Typography variant="h6">جاري حفظ الإعدادات...</Typography>
        </Stack>
      </Backdrop>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            ⚙️ الإعدادات
          </Typography>
          <Stack direction="row" spacing={2}>
            <Tooltip title="إعادة تعيين">
              <IconButton onClick={handleResetSettings} color="warning">
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="تصدير">
              <IconButton onClick={handleExportSettings} color="primary">
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="استيراد">
              <IconButton onClick={() => document.getElementById('import-settings')?.click()} color="primary">
                <Upload />
              </IconButton>
            </Tooltip>
            <input
              id="import-settings"
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleImportSettings}
            />
          </Stack>
        </Box>
        <Typography variant="body1" color="text.secondary">
          تخصيص تجربة التعلم حسب احتياجاتك وتفضيلاتك
        </Typography>
      </Box>

      {/* Alert for unsaved changes */}
      {hasChanges && (
        <Alert severity="warning" sx={{ mb: 4 }} action={
          <Button color="inherit" size="small" onClick={handleSaveSettings} disabled={saving}>
            حفظ الآن
          </Button>
        }>
          <AlertTitle>توجد تغييرات غير محفوظة</AlertTitle>
          لا تنسَ حفظ التغييرات التي قمت بها.
        </Alert>
      )}

      {/* Success notification */}
      {notificationTest && (
        <Alert severity="success" sx={{ mb: 4 }}>
          <AlertTitle>تم اختبار الإشعار بنجاح!</AlertTitle>
          الإشعار يعمل بشكل صحيح.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Navigation Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, position: 'sticky', top: 20 }}>
            <List>
              {sections.map((section) => (
                <ListItem
                  key={section.id}
                  button
                  selected={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {section.icon}
                  </ListItemIcon>
                  <ListItemText primary={section.title} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Settings Content */}
        <Grid item xs={12} md={9}>
          {/* Profile Settings */}
          {activeSection === 'profile' && (
            <Stack spacing={3}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    معلومات الملف الشخصي
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={3}>
                        <TextField
                          fullWidth
                          label="الاسم الكامل"
                          value={settings.profile.name}
                          onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
                        />
                        <TextField
                          fullWidth
                          label="البريد الإلكتروني"
                          value={settings.profile.email}
                          onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                          type="email"
                        />
                        <TextField
                          fullWidth
                          label="السيرة الذاتية"
                          value={settings.profile.bio}
                          onChange={(e) => handleSettingChange('profile', 'bio', e.target.value)}
                          multiline
                          rows={3}
                        />
                        <TextField
                          fullWidth
                          label="الموقع"
                          value={settings.profile.location}
                          onChange={(e) => handleSettingChange('profile', 'location', e.target.value)}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={3} alignItems="center">
                        <Avatar
                          src={settings.profile.avatar}
                          sx={{ width: 120, height: 120, bgcolor: 'primary.main' }}
                        >
                          <Person sx={{ fontSize: 60 }} />
                        </Avatar>
                        <Button startIcon={<Edit />} variant="outlined">
                          تغيير الصورة
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            المستوى: {settings.profile.level}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {settings.profile.xp} XP
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(settings.profile.xp % 1000) / 10}
                            sx={{ mt: 1, height: 8, borderRadius: 4 }}
                          />
                        </Box>
                        <FormControl fullWidth>
                          <InputLabel>المنطقة الزمنية</InputLabel>
                          <Select
                            value={settings.profile.timezone}
                            label="المنطقة الزمنية"
                            onChange={(e) => handleSettingChange('profile', 'timezone', e.target.value)}
                          >
                            <MenuItem value="Asia/Riyadh">الرياض</MenuItem>
                            <MenuItem value="Asia/Dubai">دبي</MenuItem>
                            <MenuItem value="Asia/Cairo">القاهرة</MenuItem>
                            <MenuItem value="Europe/London">لندن</MenuItem>
                            <MenuItem value="America/New_York">نيويورك</MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    إحصائيات الحساب
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          {settings.profile.level}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          المستوى الحالي
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                          {settings.profile.xp}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          إجمالي XP
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                          {1000 - (settings.profile.xp % 1000)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          XP للمستوى التالي
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                          45
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          أيام النشاط
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Stack>
          )}

          {/* Notifications Settings */}
          {activeSection === 'notifications' && (
            <Stack spacing={3}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      إعدادات الإشعارات
                    </Typography>
                    <Button
                      startIcon={<PlayArrow />}
                      onClick={handleTestNotification}
                      variant="outlined"
                      size="small"
                    >
                      اختبار الإشعار
                    </Button>
                  </Box>

                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        إشعارات التطبيق
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <Notifications />
                          </ListItemIcon>
                          <ListItemText
                            primary="الإشعارات داخل التطبيق"
                            secondary="عرض الإشعارات داخل واجهة التطبيق"
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={settings.notifications.inApp}
                              onChange={(e) => handleSettingChange('notifications', 'inApp', e.target.checked)}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon>
                            <VolumeUp />
                          </ListItemIcon>
                          <ListItemText
                            primary="صوت الإشعارات"
                            secondary="تشغيل صوت عند تلقي إشعارات"
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={settings.notifications.sound}
                              onChange={(e) => handleSettingChange('notifications', 'sound', e.target.checked)}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon>
                            <Videocam />
                          </ListItemIcon>
                          <ListItemText
                            primary="الإشعارات على سطح المكتب"
                            secondary="عرض إشعارات على سطح المكتب"
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={settings.notifications.desktop}
                              onChange={(e) => handleSettingChange('notifications', 'desktop', e.target.checked)}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        إشعارات البريد الإلكتروني
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <Email />
                          </ListItemIcon>
                          <ListItemText
                            primary="الإشعارات البريد الإلكتروني"
                            secondary="تلقي إشعارات عبر البريد الإلكتروني"
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={settings.notifications.email}
                              onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon>
                            <CalendarToday />
                          </ListItemIcon>
                          <ListItemText
                            primary="ملخص أسبوعي"
                            secondary="تلقي ملخص أسبوعي بالتقدم"
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={settings.notifications.weekly}
                              onChange={(e) => handleSettingChange('notifications', 'weekly', e.target.checked)}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon>
                            <Today />
                          </ListItemIcon>
                          <ListItemText
                            primary="ملخص يومي"
                            secondary="تلقي ملخص يومي بالتقدم"
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={settings.notifications.daily}
                              onChange={(e) => handleSettingChange('notifications', 'daily', e.target.checked)}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        إشعارات الجوال
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <Smartphone />
                          </ListItemIcon>
                          <ListItemText
                            primary="الإشعارات الفورية"
                            secondary="تلقي إشعارات فورية على الجوال"
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={settings.notifications.push}
                              onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon>
                            <Vibration />
                          </ListItemIcon>
                          <ListItemText
                            primary="الاهتزاز"
                            secondary="اهتزاز الجهاز عند تلقي إشعارات"
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={settings.notifications.vibration}
                              onChange={(e) => handleSettingChange('notifications', 'vibration', e.target.checked)}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon>
                            <Sms />
                          </ListItemIcon>
                          <ListItemText
                            primary="رسائل SMS"
                            secondary="تلقي إشعارات عبر رسائل SMS"
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={settings.notifications.sms}
                              onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Stack>
          )}

          {/* Audio Settings */}
          {activeSection === 'audio' && (
            <Stack spacing={3}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      إعدادات الصوت
                    </Typography>
                    <Button
                      startIcon={<PlayArrow />}
                      onClick={handleTestAudio}
                      variant="outlined"
                      size="small"
                    >
                      اختبار الصوت
                    </Button>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={3}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            الأجهزة
                          </Typography>
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>جهاز الإدخال (الميكروفون)</InputLabel>
                            <Select
                              value={settings.audio.inputDevice}
                              label="جهاز الإدخال"
                              onChange={(e) => handleSettingChange('audio', 'inputDevice', e.target.value)}
                            >
                              <MenuItem value="default">الافتراضي</MenuItem>
                              <MenuItem value="headphones">سماعات الرأس</MenuItem>
                              <MenuItem value="microphone">ميكروفون خارجي</MenuItem>
                              <MenuItem value="webcam">ميكروفون الكاميرا</MenuItem>
                            </Select>
                          </FormControl>
                          <FormControl fullWidth>
                            <InputLabel>جهاز الإخراج (السماعات)</InputLabel>
                            <Select
                              value={settings.audio.outputDevice}
                              label="جهاز الإخراج"
                              onChange={(e) => handleSettingChange('audio', 'outputDevice', e.target.value)}
                            >
                              <MenuItem value="default">الافتراضي</MenuItem>
                              <MenuItem value="speakers">سماعات النظام</MenuItem>
                              <MenuItem value="headphones">سماعات الرأس</MenuItem>
                              <MenuItem value="bluetooth">سماعات بلوتوث</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>

                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            التحكم في الصوت
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              مستوى الصوت: {settings.audio.volume}%
                            </Typography>
                            <Slider
                              value={settings.audio.volume}
                              onChange={(e, value) => handleSettingChange('audio', 'volume', value)}
                              min={0}
                              max={100}
                              valueLabelDisplay="auto"
                              marks={[
                                { value: 0, label: '0%' },
                                { value: 50, label: '50%' },
                                { value: 100, label: '100%' },
                              ]}
                            />
                          </Box>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={3}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            إعدادات متقدمة
                          </Typography>
                          <List>
                            <ListItem>
                              <ListItemIcon>
                                <Mic />
                              </ListItemIcon>
                              <ListItemText
                                primary="تفعيل الميكروفون"
                                secondary="السماح باستخدام الميكروفون للتسجيل"
                              />
                              <ListItemSecondaryAction>
                                <Switch
                                  checked={settings.audio.microphone}
                                  onChange={(e) => handleSettingChange('audio', 'microphone', e.target.checked)}
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                            <ListItem>
                              <ListItemIcon>
                                <VolumeUp />
                              </ListItemIcon>
                              <ListItemText
                                primary="تفعيل السماعات"
                                secondary="السماح بتشغيل الصوت من السماعات"
                              />
                              <ListItemSecondaryAction>
                                <Switch
                                  checked={settings.audio.speaker}
                                  onChange={(e) => handleSettingChange('audio', 'speaker', e.target.checked)}
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                            <ListItem>
                              <ListItemIcon>
                                <NoiseControlOff />
                              </ListItemIcon>
                              <ListItemText
                                primary="تقليل الضوضاء"
                                secondary="تقليل الضوضاء الخلفية أثناء التسجيل"
                              />
                              <ListItemSecondaryAction>
                                <Switch
                                  checked={settings.audio.noiseSuppression}
                                  onChange={(e) => handleSettingChange('audio', 'noiseSuppression', e.target.checked)}
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                            <ListItem>
                              <ListItemIcon>
                                <SurroundSound />
                              </ListItemIcon>
                              <ListItemText
                                primary="إلغاء الصدى"
                                secondary="إلغاء الصدى أثناء المكالمات"
                              />
                              <ListItemSecondaryAction>
                                <Switch
                                  checked={settings.audio.echoCancellation}
                                  onChange={(e) => handleSettingChange('audio', 'echoCancellation', e.target.checked)}
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                            <ListItem>
                              <ListItemIcon>
                                <AutoFixHigh />
                              </ListItemIcon>
                              <ListItemText
                                primary="التحكم التلقائي في الكسب"
                                secondary="ضبط مستوى الصوت تلقائياً"
                              />
                              <ListItemSecondaryAction>
                                <Switch
                                  checked={settings.audio.autoGainControl}
                                  onChange={(e) => handleSettingChange('audio', 'autoGainControl', e.target.checked)}
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                          </List>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Stack>
          )}

          {/* Save Button */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              startIcon={<Save />}
              color="primary"
              onClick={handleSaveSettings}
              disabled={!hasChanges || saving}
              variant="contained"
              size="large"
              sx={{ minWidth: 200 }}
            >
              {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfessionalSettingsPage;
