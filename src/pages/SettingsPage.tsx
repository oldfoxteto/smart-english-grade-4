// Settings Page
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
  Tabs,
  Tab,
  Stack,
} from '@mui/material';
import {
  Person,
  Notifications,
  VolumeUp,
  Videocam,
  Palette,
  Speed,
  Storage,
  Save,
  Refresh,
  Download,
  Upload,
  Edit,
  Visibility,
  WifiOff,
  TrendingUp,
  EmojiEvents,
  PlayArrow,
} from '@mui/icons-material';

// Import design system
import { tokens } from '../design-system/tokens';
import {
  AppCard,
  AppButton,
  AppProgress,
  AppAvatar,
  AppGrid,
} from '../components/ui';

// Types
interface UserSettings {
  profile: {
    name: string;
    email: string;
    avatar: string;
    level: number;
    xp: number;
    language: 'ar' | 'en';
  };
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
    vibration: boolean;
    desktop: boolean;
  };
  audio: {
    microphone: boolean;
    speaker: boolean;
    volume: number;
    inputDevice: string;
    outputDevice: string;
  };
  video: {
    camera: boolean;
    quality: 'low' | 'medium' | 'high';
    device: string;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    language: 'ar' | 'en';
    fontSize: 'small' | 'medium' | 'large';
    compactMode: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showProgress: boolean;
    showAchievements: boolean;
    dataCollection: boolean;
  };
  performance: {
    autoPlay: boolean;
    preloadContent: boolean;
    reduceAnimations: boolean;
    offlineMode: boolean;
  };
}

// Mock data
const mockSettings: UserSettings = {
  profile: {
    name: 'أحمد الطالب',
    email: 'ahmed@example.com',
    avatar: '/avatars/user.jpg',
    level: 12,
    xp: 3450,
    language: 'ar',
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
    inputDevice: 'default',
    outputDevice: 'default',
  },
  video: {
    camera: true,
    quality: 'medium',
    device: 'default',
  },
  appearance: {
    theme: 'light',
    language: 'ar',
    fontSize: 'medium',
    compactMode: false,
  },
  privacy: {
    profileVisibility: 'public',
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

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(mockSettings);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setHasChanges(false);
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين الإعدادات؟')) {
      setSettings(mockSettings);
      setHasChanges(true);
    }
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'settings.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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
        } catch (error) {
          console.error('Error importing settings:', error);
          alert('خطأ في استيراد الإعدادات');
        }
      };
      reader.readAsText(file);
    }
  };

  const tabLabels = [
    'الملف الشخصي',
    'الإشعارات',
    'الصوت والفيديو',
    'المظهر',
    'الخصوصية',
    'الأداء',
  ];

  return (
    <Box sx={{ p: tokens.spacing.lg }}>
      {/* Header */}
      <Box sx={{ mb: tokens.spacing.xl }}>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: tokens.spacing.md }}>
          ⚙️ الإعدادات
        </Typography>
        <Typography variant="body1" color="text.secondary">
          تخصيص تجربة التعلم حسب احتياجاتك
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mb: tokens.spacing.xl }}>
        <AppButton
          startIcon={<Save />}
          color="primary"
          onClick={handleSaveSettings}
          disabled={!hasChanges || loading}
          loading={loading}
        >
          حفظ الإعدادات
        </AppButton>
        <AppButton
          startIcon={<Refresh />}
          onClick={handleResetSettings}
          variant="outlined"
        >
          إعادة تعيين
        </AppButton>
        <AppButton
          startIcon={<Download />}
          onClick={handleExportSettings}
          variant="outlined"
        >
          تصدير الإعدادات
        </AppButton>
        <AppButton
          startIcon={<Upload />}
          onClick={() => document.getElementById('import-settings')?.click()}
          variant="outlined"
        >
          استيراد الإعدادات
        </AppButton>
        <input
          id="import-settings"
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleImportSettings}
        />
      </Stack>

      {/* Settings Tabs */}
      <AppCard>
        <Tabs
          value={activeTab}
          onChange={(_event, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
      </AppCard>

      {/* Tab Content */}
      <Box sx={{ mt: tokens.spacing.xl }}>
        {/* Profile Settings */}
        {activeTab === 0 && (
          <AppGrid spacing={tokens.spacing.lg}>
            <AppGrid xs={12} md={6}>
              <AppCard title="معلومات الملف الشخصي">
                <Stack spacing={tokens.spacing.lg}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.lg }}>
                    <AppAvatar
                      src={settings.profile.avatar}
                      size="lg"
                    >
                      <Person />
                    </AppAvatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {settings.profile.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {settings.profile.email}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, mt: tokens.spacing.xs }}>
                        <Typography variant="body2" color="text.secondary">
                          المستوى: {settings.profile.level}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          XP: {settings.profile.xp}
                        </Typography>
                      </Box>
                    </Box>
                    <AppButton
                      startIcon={<Edit />}
                      size="small"
                      onClick={() => console.log('Edit profile')}
                    >
                      تعديل
                    </AppButton>
                  </Box>

                  <TextField
                    fullWidth
                    label="الاسم"
                    value={settings.profile.name}
                    onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
                    sx={{ mb: tokens.spacing.md }}
                  />

                  <TextField
                    fullWidth
                    label="البريد الإلكتروني"
                    value={settings.profile.email}
                    onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                    sx={{ mb: tokens.spacing.md }}
                  />

                  <FormControl fullWidth>
                    <InputLabel>اللغة</InputLabel>
                    <Select
                      value={settings.profile.language}
                      label="اللغة"
                      onChange={(e) => handleSettingChange('profile', 'language', e.target.value)}
                    >
                      <MenuItem value="ar">العربية</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </AppCard>
            </AppGrid>

            <AppGrid xs={12} md={6}>
              <AppCard title="الإحصائيات">
                <Stack spacing={tokens.spacing.lg}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main' }}>
                      {settings.profile.level}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      المستوى الحالي
                    </Typography>
                  </Box>

                  <AppProgress
                    value={(settings.profile.xp % 1000) / 10}
                    color="primary"
                    showLabel
                    label="التقدم للمستوى التالي"
                  />

                  <Stack direction="row" spacing={tokens.spacing.lg} justifyContent="space-around">
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {settings.profile.xp}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        إجمالي XP
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {1000 - (settings.profile.xp % 1000)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        XP للمستوى التالي
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </AppCard>
            </AppGrid>
          </AppGrid>
        )}

        {/* Notification Settings */}
        {activeTab === 1 && (
          <AppGrid spacing={tokens.spacing.lg}>
            <AppGrid xs={12}>
              <AppCard title="إعدادات الإشعارات">
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Notifications />
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
                      <Notifications />
                    </ListItemIcon>
                    <ListItemText
                      primary="الإشعارات الفورية"
                      secondary="تلقي إشعارات فورية في المتصفح"
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

                  <Divider />

                  <ListItem>
                    <ListItemIcon>
                      <Videocam />
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
                </List>
              </AppCard>
            </AppGrid>
          </AppGrid>
        )}

        {/* Audio and Video Settings */}
        {activeTab === 2 && (
          <AppGrid spacing={tokens.spacing.lg}>
            <AppGrid xs={12} md={6}>
              <AppCard title="إعدادات الصوت">
                <Stack spacing={tokens.spacing.lg}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: tokens.spacing.md }}>
                      الميكروفون
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.audio.microphone}
                          onChange={(e) => handleSettingChange('audio', 'microphone', e.target.checked)}
                        />
                      }
                      label="تفعيل الميكروفون"
                    />
                  </Box>

                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: tokens.spacing.md }}>
                      السماعات
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.audio.speaker}
                          onChange={(e) => handleSettingChange('audio', 'speaker', e.target.checked)}
                        />
                      }
                      label="تفعيل السماعات"
                    />
                  </Box>

                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: tokens.spacing.md }}>
                      مستوى الصوت
                    </Typography>
                    <Slider
                      value={settings.audio.volume}
                      onChange={(_event, value) => handleSettingChange('audio', 'volume', value)}
                      min={0}
                      max={100}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value}%`}
                    />
                  </Box>

                  <FormControl fullWidth>
                    <InputLabel>جهاز الإدخال</InputLabel>
                    <Select
                      value={settings.audio.inputDevice}
                      label="جهاز الإدخال"
                      onChange={(e) => handleSettingChange('audio', 'inputDevice', e.target.value)}
                    >
                      <MenuItem value="default">الافتراضي</MenuItem>
                      <MenuItem value="headphones">سماعات الرأس</MenuItem>
                      <MenuItem value="microphone">ميكروفون خارجي</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>جهاز الإخراج</InputLabel>
                    <Select
                      value={settings.audio.outputDevice}
                      label="جهاز الإخراج"
                      onChange={(e) => handleSettingChange('audio', 'outputDevice', e.target.value)}
                    >
                      <MenuItem value="default">الافتراضي</MenuItem>
                      <MenuItem value="speakers">سماعات</MenuItem>
                      <MenuItem value="headphones">سماعات الرأس</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </AppCard>
            </AppGrid>

            <AppGrid xs={12} md={6}>
              <AppCard title="إعدادات الفيديو">
                <Stack spacing={tokens.spacing.lg}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: tokens.spacing.md }}>
                      الكاميرا
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.video.camera}
                          onChange={(e) => handleSettingChange('video', 'camera', e.target.checked)}
                        />
                      }
                      label="تفعيل الكاميرا"
                    />
                  </Box>

                  <FormControl fullWidth>
                    <InputLabel>جودة الفيديو</InputLabel>
                    <Select
                      value={settings.video.quality}
                      label="جودة الفيديو"
                      onChange={(e) => handleSettingChange('video', 'quality', e.target.value)}
                    >
                      <MenuItem value="low">منخفضة</MenuItem>
                      <MenuItem value="medium">متوسطة</MenuItem>
                      <MenuItem value="high">عالية</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>جهاز الكاميرا</InputLabel>
                    <Select
                      value={settings.video.device}
                      label="جهاز الكاميرا"
                      onChange={(e) => handleSettingChange('video', 'device', e.target.value)}
                    >
                      <MenuItem value="default">الافتراضي</MenuItem>
                      <MenuItem value="webcam">كاميرا الويب</MenuItem>
                      <MenuItem value="external">كاميرا خارجية</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </AppCard>
            </AppGrid>
          </AppGrid>
        )}

        {/* Appearance Settings */}
        {activeTab === 3 && (
          <AppGrid spacing={tokens.spacing.lg}>
            <AppGrid xs={12} md={6}>
              <AppCard title="إعدادات المظهر">
                <Stack spacing={tokens.spacing.lg}>
                  <FormControl fullWidth>
                    <InputLabel>السمة</InputLabel>
                    <Select
                      value={settings.appearance.theme}
                      label="السمة"
                      onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                    >
                      <MenuItem value="light">فاتح</MenuItem>
                      <MenuItem value="dark">داكن</MenuItem>
                      <MenuItem value="auto">تلقائي</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>اللغة</InputLabel>
                    <Select
                      value={settings.appearance.language}
                      label="اللغة"
                      onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                    >
                      <MenuItem value="ar">العربية</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>حجم الخط</InputLabel>
                    <Select
                      value={settings.appearance.fontSize}
                      label="حجم الخط"
                      onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
                    >
                      <MenuItem value="small">صغير</MenuItem>
                      <MenuItem value="medium">متوسط</MenuItem>
                      <MenuItem value="large">كبير</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.appearance.compactMode}
                        onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
                      />
                    }
                    label="الوضع المضغوط"
                  />
                </Stack>
              </AppCard>
            </AppGrid>
          </AppGrid>
        )}

        {/* Privacy Settings */}
        {activeTab === 4 && (
          <AppGrid spacing={tokens.spacing.lg}>
            <AppGrid xs={12}>
              <AppCard title="إعدادات الخصوصية">
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Visibility />
                    </ListItemIcon>
                    <ListItemText
                      primary="رؤية الملف الشخصي"
                      secondary="تحديد من يمكن رؤية ملفك الشخصي"
                    />
                    <ListItemSecondaryAction>
                      <Select
                        value={settings.privacy.profileVisibility}
                        onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                        size="small"
                      >
                        <MenuItem value="public">عام</MenuItem>
                        <MenuItem value="private">خاص</MenuItem>
                      </Select>
                    </ListItemSecondaryAction>
                  </ListItem>

                  <Divider />

                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp />
                    </ListItemIcon>
                    <ListItemText
                      primary="عرض التقدم"
                      secondary="إظهار تقدمك للآخرين"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.privacy.showProgress}
                        onChange={(e) => handleSettingChange('privacy', 'showProgress', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <Divider />

                  <ListItem>
                    <ListItemIcon>
                      <EmojiEvents />
                    </ListItemIcon>
                    <ListItemText
                      primary="عرض الإنجازات"
                      secondary="إظهار إنجازاتك للآخرين"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.privacy.showAchievements}
                        onChange={(e) => handleSettingChange('privacy', 'showAchievements', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <Divider />

                  <ListItem>
                    <ListItemIcon>
                      <Storage />
                    </ListItemIcon>
                    <ListItemText
                      primary="جمع البيانات"
                      secondary="المساعدة في تحسين الخدمة من خلال جمع البيانات"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.privacy.dataCollection}
                        onChange={(e) => handleSettingChange('privacy', 'dataCollection', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </AppCard>
            </AppGrid>
          </AppGrid>
        )}

        {/* Performance Settings */}
        {activeTab === 5 && (
          <AppGrid spacing={tokens.spacing.lg}>
            <AppGrid xs={12}>
              <AppCard title="إعدادات الأداء">
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PlayArrow />
                    </ListItemIcon>
                    <ListItemText
                      primary="التشغيل التلقائي"
                      secondary="تشغيل المحتوى تلقائياً"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.performance.autoPlay}
                        onChange={(e) => handleSettingChange('performance', 'autoPlay', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <Divider />

                  <ListItem>
                    <ListItemIcon>
                      <Speed />
                    </ListItemIcon>
                    <ListItemText
                      primary="التحميل المسبق"
                      secondary="تحميل المحتوى مسبقاً لتحسين الأداء"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.performance.preloadContent}
                        onChange={(e) => handleSettingChange('performance', 'preloadContent', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <Divider />

                  <ListItem>
                    <ListItemIcon>
                      <Palette />
                    </ListItemIcon>
                    <ListItemText
                      primary="تقليل الرسوم المتحركة"
                      secondary="تقليل الرسوم المتحركة لتحسين الأداء"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.performance.reduceAnimations}
                        onChange={(e) => handleSettingChange('performance', 'reduceAnimations', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <Divider />

                  <ListItem>
                    <ListItemIcon>
                      <WifiOff />
                    </ListItemIcon>
                    <ListItemText
                      primary="الوضع دون اتصال"
                      secondary="العمل بدون اتصال بالإنترنت"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.performance.offlineMode}
                        onChange={(e) => handleSettingChange('performance', 'offlineMode', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </AppCard>
            </AppGrid>
          </AppGrid>
        )}
      </Box>

      {/* Save Changes Alert */}
      {hasChanges && (
        <Alert severity="warning" sx={{ mt: tokens.spacing.lg }}>
          <AlertTitle>توجد تغييرات غير محفوظة</AlertTitle>
          لا تنسَ حفظ التغييرات التي قمت بها.
        </Alert>
      )}
    </Box>
  );
};
