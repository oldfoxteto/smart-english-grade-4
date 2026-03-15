// Simple Settings Page - Working Version
import React, { useState, useEffect } from 'react';
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
  Container,
  Stack,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Person,
  Notifications,
  VolumeUp,
  Mic,
  Videocam,
  Palette,
  Security,
  Save,
  Refresh,
  Download,
  Upload,
  Edit,
  Visibility,
  TrendingUp,
  EmojiEvents,
  PlayArrow,
} from '@mui/icons-material';

const SettingsPageSimple: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setHasChanges(false);
      console.log('Settings saved');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين الإعدادات؟')) {
      setHasChanges(true);
    }
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify({}, null, 2);
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
          setHasChanges(true);
        } catch (error) {
          console.error('Error importing settings:', error);
          alert('خطأ في استيراد الإعدادات');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          ⚙️ الإعدادات
        </Typography>
        <Typography variant="body1" color="text.secondary">
          تخصيص تجربة التعلم حسب احتياجاتك
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Button
          startIcon={<Save />}
          color="primary"
          onClick={handleSaveSettings}
          disabled={!hasChanges || loading}
          variant="contained"
        >
          حفظ الإعدادات
        </Button>
        <Button
          startIcon={<Refresh />}
          onClick={handleResetSettings}
          variant="outlined"
        >
          إعادة تعيين
        </Button>
        <Button
          startIcon={<Download />}
          onClick={handleExportSettings}
          variant="outlined"
        >
          تصدير الإعدادات
        </Button>
        <Button
          startIcon={<Upload />}
          onClick={() => document.getElementById('import-settings')?.click()}
          variant="outlined"
        >
          استيراد الإعدادات
        </Button>
        <input
          id="import-settings"
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleImportSettings}
        />
      </Stack>

      {/* Profile Settings */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            معلومات الملف الشخصي
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="الاسم"
                  defaultValue="أحمد الطالب"
                  onChange={() => setHasChanges(true)}
                />
                <TextField
                  fullWidth
                  label="البريد الإلكتروني"
                  defaultValue="ahmed@example.com"
                  onChange={() => setHasChanges(true)}
                />
                <FormControl fullWidth>
                  <InputLabel>اللغة</InputLabel>
                  <Select
                    defaultValue="ar"
                    label="اللغة"
                    onChange={() => setHasChanges(true)}
                  >
                    <MenuItem value="ar">العربية</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={3} alignItems="center">
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                  <Person />
                </Avatar>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    المستوى: 12
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    XP: 3450
                  </Typography>
                </Box>
                <Button startIcon={<Edit />} size="small">
                  تعديل
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            إعدادات الإشعارات
          </Typography>
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
                  defaultChecked
                  onChange={() => setHasChanges(true)}
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
                  defaultChecked
                  onChange={() => setHasChanges(true)}
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
                  defaultChecked
                  onChange={() => setHasChanges(true)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Audio and Video Settings */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                إعدادات الصوت
              </Typography>
              <Stack spacing={3}>
                <FormControlLabel
                  control={
                    <Switch
                      defaultChecked
                      onChange={() => setHasChanges(true)}
                    />
                  }
                  label="تفعيل الميكروفون"
                />
                <FormControlLabel
                  control={
                    <Switch
                      defaultChecked
                      onChange={() => setHasChanges(true)}
                    />
                  }
                  label="تفعيل السماعات"
                />
                <Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    مستوى الصوت: 75%
                  </Typography>
                  <Slider
                    defaultValue={75}
                    onChange={() => setHasChanges(true)}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                  />
                </Box>
                <FormControl fullWidth>
                  <InputLabel>جهاز الإدخال</InputLabel>
                  <Select
                    defaultValue="default"
                    label="جهاز الإدخال"
                    onChange={() => setHasChanges(true)}
                  >
                    <MenuItem value="default">الافتراضي</MenuItem>
                    <MenuItem value="headphones">سماعات الرأس</MenuItem>
                    <MenuItem value="microphone">ميكروفون خارجي</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                إعدادات الفيديو
              </Typography>
              <Stack spacing={3}>
                <FormControlLabel
                  control={
                    <Switch
                      defaultChecked
                      onChange={() => setHasChanges(true)}
                    />
                  }
                  label="تفعيل الكاميرا"
                />
                <FormControl fullWidth>
                  <InputLabel>جودة الفيديو</InputLabel>
                  <Select
                    defaultValue="medium"
                    label="جودة الفيديو"
                    onChange={() => setHasChanges(true)}
                  >
                    <MenuItem value="low">منخفضة</MenuItem>
                    <MenuItem value="medium">متوسطة</MenuItem>
                    <MenuItem value="high">عالية</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>جهاز الكاميرا</InputLabel>
                  <Select
                    defaultValue="default"
                    label="جهاز الكاميرا"
                    onChange={() => setHasChanges(true)}
                  >
                    <MenuItem value="default">الافتراضي</MenuItem>
                    <MenuItem value="webcam">كاميرا الويب</MenuItem>
                    <MenuItem value="external">كاميرا خارجية</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Save Changes Alert */}
      {hasChanges && (
        <Alert severity="warning" sx={{ mt: 4 }}>
          <AlertTitle>توجد تغييرات غير محفوظة</AlertTitle>
          لا تنسَ حفظ التغييرات التي قمت بها.
        </Alert>
      )}
    </Container>
  );
};

export default SettingsPageSimple;
