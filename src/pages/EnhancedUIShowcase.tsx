// Enhanced UI/UX Showcase Page
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Switch,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  Stack,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  AppBar,
  Toolbar,
  Drawer,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu,
  Close,
  Settings,
  Accessibility,
  Animation,
  Palette,
  Contrast,
  FontSize,
  VolumeUp,
  VolumeDown,
  VolumeOff,
  LightMode,
  DarkMode,
  Computer,
  Smartphone,
  Tablet,
  DesktopWindows,
  Laptop,
  Tv,
  Language,
  Translate,
  GTranslate,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  Headphones,
  Headset,
  Speaker,
  RecordVoiceOver,
  SettingsVoice,
  SettingsAccessibility,
  SettingsBrightness,
  SettingsEthernet,
  SettingsInputComponent,
  SettingsInputHdmi,
  SettingsInputAntenna,
  SettingsBluetooth,
  SettingsApplications,
  SettingsSystemDaydream,
  SettingsOverscan,
  SettingsPhone,
  SettingsRemote,
  SettingsInputComposite,
  SettingsInputSvideo,
  SettingsVoice as VoiceSettings,
  SettingsInputComponent as ComponentSettings,
} from '@mui/icons-material';

// Import our enhanced components
import { useResponsive, ResponsiveGrid, ResponsiveContainer, ResponsiveCard, ResponsiveButton } from '../ui/ResponsiveComponents';
import {
  SkipLink,
  FocusIndicator,
  AccessibilityToolbar,
  HighContrastToggle,
  FontSizeAdjuster,
  VolumeControl,
  ReadingModeToggle,
  AnimationControl,
} from '../ui/AccessibilityComponents';
import {
  AnimatedWrapper,
  HoverAnimation,
  LoadingAnimation,
  ProgressAnimation,
  InteractiveAnimation,
  AnimationControlPanel,
} from '../ui/AnimationSystem';

const EnhancedUIShowcase: React.FC = () => {
  const theme = useTheme();
  const { isMobile, isTablet, isDesktop, currentBreakpoint } = useResponsive();
  
  // UI State
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [volume, setVolume] = useState(75);
  const [muted, setMuted] = useState(false);
  const [readingMode, setReadingMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState('normal');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [language, setLanguage] = useState('ar');
  const [rtl, setRtl] = useState(true);
  
  // Responsive Demo State
  const [activeDevice, setActiveDevice] = useState('desktop');
  const [showGrid, setShowGrid] = useState(false);
  const [showBreakpoints, setShowBreakpoints] = useState(false);
  
  // Animation Demo State
  const [activeAnimation, setActiveAnimation] = useState('fadeIn');
  const [hoverAnimation, setHoverAnimation] = useState('lift');
  const [loadingType, setLoadingType] = useState('spinner');
  const [progressType, setProgressType] = useState('linear');
  
  // Accessibility Demo State
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(true);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showFocusIndicators, setShowFocusIndicators] = useState(true);
  
  const devices = [
    { id: 'mobile', name: 'Mobile', icon: <Smartphone />, width: 375, height: 667 },
    { id: 'tablet', name: 'Tablet', icon: <Tablet />, width: 768, height: 1024 },
    { id: 'desktop', name: 'Desktop', icon: <DesktopWindows />, width: 1920, height: 1080 },
    { id: 'laptop', name: 'Laptop', icon: <Laptop />, width: 1366, height: 768 },
    { id: 'tv', name: 'TV', icon: <Tv />, width: 1920, height: 1080 },
  ];
  
  const animations = [
    'fadeIn', 'slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight',
    'scaleIn', 'rotateIn', 'flipIn', 'bounce', 'pulse', 'shake', 'wiggle'
  ];
  
  const hoverAnimations = ['scale', 'lift', 'glow', 'rotate', 'slide', 'fade'];
  const loadingTypes = ['spinner', 'dots', 'pulse', 'wave', 'bounce', 'skeleton'];
  const progressTypes = ['linear', 'circular', 'wave'];
  
  const fontSizes = ['small', 'medium', 'large', 'extra-large'];
  const animationSpeeds = ['slow', 'normal', 'fast'];
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Skip Links */}
      <SkipLink href="#main-content">تخطي إلى المحتوى الرئيسي</SkipLink>
      <SkipLink href="#navigation">تخطي إلى التنقل</SkipLink>
      
      {/* Header */}
      <AppBar position="sticky" sx={{ zIndex: 1200 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{ mr: 2 }}
          >
            {sidebarOpen ? <Close /> : <Menu />}
          </IconButton>
          
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🎨 معرض واجهة المستخدم المحسّنة
          </Typography>
          
          <Stack direction="row" spacing={1}>
            <Tooltip title={darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}>
              <IconButton
                color="inherit"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title={rtl ? 'LTR' : 'RTL'}>
              <IconButton
                color="inherit"
                onClick={() => setRtl(!rtl)}
              >
                <Translate />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="إعدادات الوصول">
              <IconButton
                color="inherit"
                onClick={() => setShowAccessibilityPanel(!showAccessibilityPanel)}
              >
                <Accessibility />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar */}
      <Drawer
        anchor={rtl ? 'right' : 'left'}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            🎛️ لوحة التحكم
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <Computer />
              </ListItemIcon>
              <ListItemText primary="الجهاز الحالي" secondary={currentBreakpoint} />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="الإعدادات" />
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <ListItemIcon>
                <Animation />
              </ListItemIcon>
              <ListItemText primary="الحركات" secondary={animationsEnabled ? 'مفعلة' : 'معطلة'} />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Accessibility />
              </ListItemIcon>
              <ListItemText primary="تسهيل الوصول" secondary={highContrast ? 'عالي التباين' : 'عادي'} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          minWidth: 0,
          bgcolor: darkMode ? 'grey.900' : 'grey.50',
          minHeight: '100vh',
        }}
        id="main-content"
      >
        <Container maxWidth="xl">
          {/* Header Section */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
              🎨 نظام واجهة المستخدم المحسّن
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              عرض شامل لميزات التصميم المتجاوب، تسهيل الوصول، والرسوم المتحركة
            </Typography>
            
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
              <Chip
                icon={<Computer />}
                label={`الجهاز: ${currentBreakpoint}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<Animation />}
                label={`الحركات: ${animationsEnabled ? 'مفعلة' : 'معطلة'}`}
                color="secondary"
                variant="outlined"
              />
              <Chip
                icon={<Accessibility />}
                label={`الوصول: ${highContrast ? 'عالي' : 'عادي'}`}
                color="success"
                variant="outlined"
              />
              <Chip
                icon={<FontSize />}
                label={`الخط: ${fontSize}`}
                color="warning"
                variant="outlined"
              />
            </Stack>
          </Box>
          
          {/* Responsive Design Section */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                📱 التصميم المتجاوب
              </Typography>
              
              <ResponsiveGrid container spacing={3}>
                <ResponsiveGrid item xs={12} md={6}>
                  <ResponsiveCard>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        محاكاة الأجهزة
                      </Typography>
                      
                      <Stack spacing={2}>
                        <Typography variant="body2">
                          اختر جهازًا لمحاكاة تصميم واجهة المستخدم:
                        </Typography>
                        
                        <ResponsiveGrid container spacing={2}>
                          {devices.map((device) => (
                            <ResponsiveGrid item xs={6} sm={4} key={device.id}>
                              <ResponsiveButton
                                variant={activeDevice === device.id ? 'contained' : 'outlined'}
                                onClick={() => setActiveDevice(device.id)}
                                fullWidth
                                startIcon={device.icon}
                              >
                                {device.name}
                              </ResponsiveButton>
                            </ResponsiveGrid>
                          ))}
                        </ResponsiveGrid>
                        
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            الجهاز النشط: {devices.find(d => d.id === activeDevice)?.name}
                          </Typography>
                          <Typography variant="caption">
                            الأبعاد: {devices.find(d => d.id === activeDevice)?.width} × {devices.find(d => d.id === activeDevice)?.height}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </ResponsiveCard>
                </ResponsiveGrid>
                
                <ResponsiveGrid item xs={12} md={6}>
                  <ResponsiveCard>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        نقاط التوقف (Breakpoints)
                      </Typography>
                      
                      <Stack spacing={2}>
                        <Typography variant="body2">
                          عرض نقاط التوقف المتاحة في النظام:
                        </Typography>
                        
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <Smartphone />
                            </ListItemIcon>
                            <ListItemText primary="xs: 0px - 599px" secondary="الهواتف المحمولة" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <Tablet />
                            </ListItemIcon>
                            <ListItemText primary="sm: 600px - 899px" secondary="الأجهزة اللوحية الصغيرة" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <Laptop />
                            </ListItemIcon>
                            <ListItemText primary="md: 900px - 1199px" secondary="الأجهزة اللوحية الكبيرة" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <DesktopWindows />
                            </ListItemIcon>
                            <ListItemText primary="lg: 1200px - 1535px" secondary="أجهزة الكمبيوتر المكتبية" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <Tv />
                            </ListItemIcon>
                            <ListItemText primary="xl: 1536px+" secondary="شاشات العرض الكبيرة" />
                          </ListItem>
                        </List>
                      </Stack>
                    </CardContent>
                  </ResponsiveCard>
                </ResponsiveGrid>
              </ResponsiveGrid>
            </CardContent>
          </Card>
          
          {/* Animation Section */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                🎬 الرسوم المتحركة والتفاعلات
              </Typography>
              
              <ResponsiveGrid container spacing={3}>
                <ResponsiveGrid item xs={12} md={6}>
                  <ResponsiveCard>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        الرسوم المتحركة
                      </Typography>
                      
                      <Stack spacing={2}>
                        <FormControl fullWidth>
                          <InputLabel>نوع الحركة</InputLabel>
                          <Select
                            value={activeAnimation}
                            onChange={(e) => setActiveAnimation(e.target.value)}
                            label="نوع الحركة"
                          >
                            {animations.map((animation) => (
                              <MenuItem key={animation} value={animation}>
                                {animation}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                          <AnimatedWrapper animation={activeAnimation}>
                            <Box
                              sx={{
                                width: 100,
                                height: 100,
                                bgcolor: 'primary.main',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                              }}
                            >
                              حركة
                            </Box>
                          </AnimatedWrapper>
                        </Box>
                      </Stack>
                    </CardContent>
                  </ResponsiveCard>
                </ResponsiveGrid>
                
                <ResponsiveGrid item xs={12} md={6}>
                  <ResponsiveCard>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        حركات التمرير
                      </Typography>
                      
                      <Stack spacing={2}>
                        <FormControl fullWidth>
                          <InputLabel>حركة التمرير</InputLabel>
                          <Select
                            value={hoverAnimation}
                            onChange={(e) => setHoverAnimation(e.target.value)}
                            label="حركة التمرير"
                          >
                            {hoverAnimations.map((animation) => (
                              <MenuItem key={animation} value={animation}>
                                {animation}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                          <HoverAnimation animation={hoverAnimation}>
                            <ResponsiveButton variant="contained">
                              مرر فوقي
                            </ResponsiveButton>
                          </HoverAnimation>
                        </Box>
                      </Stack>
                    </CardContent>
                  </ResponsiveCard>
                </ResponsiveGrid>
                
                <ResponsiveGrid item xs={12} md={6}>
                  <ResponsiveCard>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        رسوم التحميل
                      </Typography>
                      
                      <Stack spacing={2}>
                        <FormControl fullWidth>
                          <InputLabel>نوع التحميل</InputLabel>
                          <Select
                            value={loadingType}
                            onChange={(e) => setLoadingType(e.target.value)}
                            label="نوع التحميل"
                          >
                            {loadingTypes.map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                          <LoadingAnimation type={loadingType} size="large" />
                        </Box>
                      </Stack>
                    </CardContent>
                  </ResponsiveCard>
                </ResponsiveGrid>
                
                <ResponsiveGrid item xs={12} md={6}>
                  <ResponsiveCard>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        رسوم التقدم
                      </Typography>
                      
                      <Stack spacing={2}>
                        <FormControl fullWidth>
                          <InputLabel>نوع التقدم</InputLabel>
                          <Select
                            value={progressType}
                            onChange={(e) => setProgressType(e.target.value)}
                            label="نوع التقدم"
                          >
                            {progressTypes.map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                          <ProgressAnimation
                            type={progressType}
                            value={75}
                            max={100}
                            size="large"
                            animated={animationsEnabled}
                          />
                        </Box>
                      </Stack>
                    </CardContent>
                  </ResponsiveCard>
                </ResponsiveGrid>
              </ResponsiveGrid>
            </CardContent>
          </Card>
          
          {/* Accessibility Section */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                ♿ تسهيل الوصول
              </Typography>
              
              <ResponsiveGrid container spacing={3}>
                <ResponsiveGrid item xs={12} md={6}>
                  <ResponsiveCard>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        إعدادات تسهيل الوصول
                      </Typography>
                      
                      <Stack spacing={3}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={highContrast}
                              onChange={(e) => setHighContrast(e.target.checked)}
                            />
                          }
                          label="وضع عالي التباين"
                        />
                        
                        <FormControlLabel
                          control={
                            <Switch
                              checked={readingMode}
                              onChange={(e) => setReadingMode(e.target.checked)}
                            />
                          }
                          label="وضع القراءة"
                        />
                        
                        <FormControlLabel
                          control={
                            <Switch
                              checked={showFocusIndicators}
                              onChange={(e) => setShowFocusIndicators(e.target.checked)}
                            />
                          }
                          label="مؤشرات التركيز"
                        />
                        
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            حجم الخط
                          </Typography>
                          <FormControl fullWidth>
                            <Select
                              value={fontSize}
                              onChange={(e) => setFontSize(e.target.value)}
                              size="small"
                            >
                              {fontSizes.map((size) => (
                                <MenuItem key={size} value={size}>
                                  {size === 'small' ? 'صغير' : 
                                   size === 'medium' ? 'متوسط' : 
                                   size === 'large' ? 'كبير' : 'كبير جدا'}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            مستوى الصوت
                          </Typography>
                          <VolumeControl
                            volume={volume}
                            onChange={setVolume}
                            muted={muted}
                            onMuteToggle={() => setMuted(!muted)}
                          />
                        </Box>
                      </Stack>
                    </CardContent>
                  </ResponsiveCard>
                </ResponsiveGrid>
                
                <ResponsiveGrid item xs={12} md={6}>
                  <ResponsiveCard>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        اختصارات لوحة المفاتيح
                      </Typography>
                      
                      <Stack spacing={2}>
                        <Typography variant="body2">
                          استخدم هذه الاختصارات للتنقل السريع:
                        </Typography>
                        
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <KeyboardTab />
                            </ListItemIcon>
                            <ListItemText primary="Tab" secondary="التنقل بين العناصر" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <KeyboardTab />
                            </ListItemIcon>
                            <ListItemText primary="Enter" secondary="تنشيط العنصر النشط" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <KeyboardTab />
                            </ListItemIcon>
                            <ListItemText primary="Space" secondary="تنشيط العنصر" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <KeyboardTab />
                            </ListItemIcon>
                            <ListItemText primary="Esc" secondary="إغلاق الحوار" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <KeyboardTab />
                            </ListItemIcon>
                            <ListItemText primary="Alt + ?" secondary="إظهار المساعدة" />
                          </ListItem>
                        </List>
                        
                        <ResponsiveButton
                          variant="outlined"
                          onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
                          fullWidth
                        >
                          {showKeyboardHelp ? 'إخفاء' : 'إظهار'} المساعدة
                        </ResponsiveButton>
                      </Stack>
                    </CardContent>
                  </ResponsiveCard>
                </ResponsiveGrid>
              </ResponsiveGrid>
            </CardContent>
          </Card>
          
          {/* Features Demo */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                🚀 المميزات التفاعلية
              </Typography>
              
              <ResponsiveGrid container spacing={3}>
                <ResponsiveGrid item xs={12} sm={6} md={4}>
                  <FocusIndicator>
                    <ResponsiveCard>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                          <Accessibility />
                        </Avatar>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          قابل للتركيز
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          عنصر قابل للتركيز مع مؤشرات بصرية
                        </Typography>
                      </CardContent>
                    </ResponsiveCard>
                  </FocusIndicator>
                </ResponsiveGrid>
                
                <ResponsiveGrid item xs={12} sm={6} md={4}>
                  <InteractiveAnimation trigger="visible" animation="scaleIn">
                    <ResponsiveCard>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2 }}>
                          <Animation />
                        </Avatar>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          حركة عند الظهور
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        حركة عند ظهور العنصر في الشاشة
                        </Typography>
                      </CardContent>
                    </ResponsiveCard>
                  </InteractiveAnimation>
                </ResponsiveGrid>
                
                <ResponsiveGrid item xs={12} sm={6} md={4}>
                  <HoverAnimation animation="lift">
                    <ResponsiveCard>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                          <Settings />
                        </Avatar>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          حركة عند التمرير
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          حركة عند التمرير فوق العنصر
                        </Typography>
                      </CardContent>
                    </ResponsiveCard>
                  </HoverAnimation>
                </ResponsiveGrid>
              </ResponsiveGrid>
            </CardContent>
          </Card>
        </Container>
      </Box>
      
      {/* Accessibility Toolbar */}
      {showAccessibilityPanel && (
        <AccessibilityToolbar
          highContrast={highContrast}
          fontSize={fontSize}
          volume={volume}
          muted={muted}
          readingMode={readingMode}
          animationsEnabled={animationsEnabled}
          onHighContrastChange={setHighContrast}
          onFontSizeChange={setFontSize}
          onVolumeChange={setVolume}
          onMuteToggle={() => setMuted(!muted)}
          onReadingModeToggle={setReadingMode}
          onAnimationToggle={setAnimationsEnabled}
        />
      )}
      
      {/* Animation Control Panel */}
      <AnimationControlPanel
        animationsEnabled={animationsEnabled}
        animationSpeed={animationSpeed}
        onAnimationsToggle={setAnimationsEnabled}
        onAnimationSpeedChange={setAnimationSpeed}
      />
      
      {/* Keyboard Help Modal */}
      {showKeyboardHelp && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            p: 3,
            zIndex: 9999,
            boxShadow: theme.shadows[24],
            maxWidth: 500,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            اختصارات لوحة المفاتيح
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Tab</strong>: التنقل بين العناصر
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Enter</strong>: تنشيط العنصر النشط
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Space</strong>: تنشيط العنصر
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Esc</strong>: إغلاق الحوار
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Alt + ?</strong>: إظهار/إخفاء المساعدة
          </Typography>
          <ResponsiveButton
            onClick={() => setShowKeyboardHelp(false)}
            variant="contained"
            sx={{ mt: 2 }}
          >
            إغلاق
          </ResponsiveButton>
        </Box>
      )}
    </Box>
  );
};

export default EnhancedUIShowcase;
