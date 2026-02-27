// Mobile Testing Guide - Fixed Version
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  AlertTitle,
  Chip,
  Avatar,
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  LinearProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
  RadioButtonChecked,
  Error,
  Warning,
  Info,
  Phone,
  Tablet,
  Laptop,
  DesktopMac,
  Devices,
  MobileFriendly,
  TouchApp,
  Visibility,
  VisibilityOff,
  Wifi,
  WifiOff,
  BatteryFull,
  BatteryAlert,
  SignalCellular4G,
  SignalCellularOff,
  SignalWifi4Bar,
  SignalWifiOff,
  Settings,
  Refresh,
  Speed,
  Memory,
  Storage,
  Camera,
  Videocam,
  Mic,
  MicOff,
  Headphones,
  VolumeUp,
  VolumeDown,
  Fullscreen,
  FullscreenExit,
  ZoomIn,
  ZoomOut,
  AspectRatio,
  ScreenRotation,
  BugReport,
  Feedback,
  Help,
  Info as InfoIcon,
  Launch,
  PlayArrow,
  Stop,
  Pause,
  SkipNext,
  SkipPrevious,
  RestartAlt,
  GetApp,
  Share,
  Bookmark,
  BookmarkBorder,
  Star,
  StarBorder,
  ThumbUp,
  ThumbDown,
  Comment,
  Send,
  Share as ShareIcon
} from '@mui/icons-material';

export interface TestPage {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  url: string;
  category: 'navigation' | 'content' | 'interaction' | 'performance' | 'compatibility' | 'accessibility' | 'offline' | 'integration';
  priority: 'high' | 'medium' | 'low';
  testSteps: Array<{
    id: string;
    title: string;
    arabicTitle: string;
    description: string;
    arabicDescription: string;
    expected: string;
    arabicExpected: string;
    instructions: string;
    arabicInstructions: string;
    notes: string;
    arabicNotes: string;
  }>;
  requirements: string[];
  arabicRequirements: string[];
  results: {
    passed: boolean;
    score: number;
    issues: Array<{
      type: string;
      description: string;
      arabicDescription: string;
      severity: 'error' | 'warning' | 'info';
    }>;
  };
}

// Complete Testing Guide
export const mobileTestingGuide: TestPage[] = [
  // Navigation Testing
  {
    id: 'nav_home',
    title: 'Home Navigation',
    arabicTitle: 'التنقل الرئيسي',
    description: 'Test main navigation elements',
    arabicDescription: 'اختبار عناصر التنقل الرئيسية',
    url: '/',
    category: 'navigation',
    priority: 'high',
    testSteps: [
      {
        id: 'nav_home_1',
        title: 'Navigation Menu',
        arabicTitle: 'قائمة التنقل',
        description: 'Check navigation menu accessibility and responsiveness',
        arabicDescription: 'تحقق من إمكانية الوصول واستجابة القائمة',
        expected: 'Menu should be accessible and responsive',
        arabicExpected: 'يجب أن تكون القائمة قابلة للوصول ومتجاوبة',
        instructions: '1. Open navigation menu\n2. Check all menu items are visible\n3. Test keyboard navigation\n4. Verify responsive behavior',
        arabicInstructions: '1. افتح قائمة التنقل\n2. تحقق من ظهور جميع العناصر\n3. اختبر التنقل بلوحة المفاتيح\n4. تحقق من السلوك المتجاوب'
      },
      {
        id: 'nav_home_2',
        title: 'Breadcrumbs',
        arabicTitle: 'مسار التنقل',
        description: 'Test breadcrumb navigation',
        arabicDescription: 'اختبار مسار التنقل',
        expected: 'Breadcrumbs should show current page path',
        arabicExpected: 'يجب أن يظهر المسار الحالي للصفحة',
        instructions: '1. Navigate through pages\n2. Verify breadcrumbs update correctly\n3. Check clickable breadcrumbs\n4. Test responsive behavior',
        arabicInstructions: '1. تنقل بين الصفحات\n2. تحقق من تحديث المسار\n3. اختبر الروابط القابلة للنقر\n4. اختبر السلوك المتجاوب'
      },
      {
        id: 'nav_home_3',
        title: 'Back/Forward Buttons',
        arabicTitle: 'أزرار الرجوع/التقدم',
        description: 'Test browser navigation buttons',
        arabicDescription: 'اختبار أزرار التنقل',
        expected: 'Navigation buttons should work correctly',
        arabicExpected: 'يجب أن تعمل أزرار التنقل بشكل صحيح',
        instructions: '1. Test back button\n2. Test forward button\n3. Test refresh button\n4. Verify history navigation',
        arabicInstructions: '1. اختبر زر الرجوع\n2. اختبر زر التقدم\n3. اختبر زر التحديث\n4. تحقق من التنقل في التاريخ'
      }
    ],
    requirements: ['Navigation menu', 'Breadcrumbs', 'Navigation buttons'],
    arabicRequirements: ['قائمة التنقل', 'مسار التنقل', 'أزرار التنقل'],
    results: {
      passed: false,
      score: 0,
      issues: []
    }
  },

  // Content Testing
  {
    id: 'content_lessons',
    title: 'Lessons Display',
    arabicTitle: 'عرض الدروس',
    description: 'Test lesson content display and interaction',
    arabicDescription: 'اختبار عرض محتوى الدروس والتفاعل',
    url: '/lessons',
    category: 'content',
    priority: 'high',
    testSteps: [
      {
        id: 'content_lessons_1',
        title: 'Lesson Cards',
        arabicTitle: 'بطاقات الدروس',
        description: 'Test lesson card layout and responsiveness',
        arabicDescription: 'اختبار تخطيط بطاقات الدروس',
        expected: 'Cards should be properly aligned and readable',
        arabicExpected: 'يجب أن تكون البطاقات محاذاة بشكل صحيح وقابلة للقراءة',
        instructions: '1. Check card layout on different screen sizes\n2. Verify text readability\n3. Test card interactions\n4. Check loading states',
        arabicInstructions: '1. تحقق من تخطيط البطاقات على مختلف أحجام الشاشة\n2. تحقق من قابلية قراءة النص\n3. اختبر تفاعل البطاقات\n4. اختبر حالات التحميل'
      },
      {
        id: 'content_lessons_2',
        title: 'Audio/Video Content',
        arabicTitle: 'محتوى الصوت والفيديو',
        description: 'Test multimedia content playback',
        arabicDescription: 'اختبار تشغيل المحتوى المتعدد',
        expected: 'Media should play correctly on mobile',
        arabicExpected: 'يجب أن يشغل المحتوى بشكل صحيح على الموبايل',
        instructions: '1. Test audio playback\n2. Test video playback\n3. Test controls\n4. Test fullscreen mode',
        arabicInstructions: '1. اختبر تشغيل الصوت\n2. اختبر تشغيل الفيديو\n3. اختبر عناصر التحكم\n4. اختبر وضع ملء الشاشة'
      },
      {
        id: 'content_lessons_3',
        title: 'Interactive Exercises',
        arabicTitle: 'التمارين التفاعلية',
        description: 'Test interactive exercise functionality',
        arabicDescription: 'اختبار وظائف التمارين التفاعلية',
        expected: 'Exercises should be fully interactive',
        arabicExpected: 'يجب أن تكون التمارين تفاعلية بالكامل',
        instructions: '1. Test drag and drop\n2. Test touch interactions\n3. Test keyboard input\n4. Verify feedback mechanisms',
        arabicInstructions: '1. اختبر السحب والإفلات\n2. اختبر التفاعلات باللمس\n3. اختبر الإدخال بلوحة المفاتيح\n4. تحقق من آليات التغذية'
      }
    ],
    requirements: ['Responsive cards', 'Media playback', 'Interactive elements'],
    arabicRequirements: ['بطاقات متجاوبة', 'تشغيل الوسائط', 'عناصر تفاعلية'],
    results: {
      passed: false,
      score: 0,
      issues: []
    }
  },

  // Interaction Testing
  {
    id: 'interaction_gestures',
    title: 'Touch Gestures',
    arabicTitle: 'الإيماءات باللمس',
    description: 'Test touch gesture support',
    arabicDescription: 'اختبار دعم الإيماءات باللمس',
    url: '/practice',
    category: 'interaction',
    priority: 'high',
    testSteps: [
      {
        id: 'interaction_gestures_1',
        title: 'Swipe Gestures',
        arabicTitle: 'إيماءات السحب',
        description: 'Test swipe navigation and actions',
        arabicDescription: 'اختبار التنقل بالإيماءات',
        expected: 'Swipe gestures should work correctly',
        arabicExpected: 'يجب أن تعمل الإيماءات بشكل صحيح',
        instructions: '1. Test left swipe\n2. Test right swipe\n3. Test up/down swipe\n4. Test swipe actions',
        arabicInstructions: '1. اختبر السحب لليسار\n2. اختبر السحب لليمين\n3. اختبر السحب للأعلى/للأسفل\n4. اختبر إجراءات السحب'
      },
      {
        id: 'interaction_gestures_2',
        title: 'Pinch Gestures',
        arabicTitle: 'إيماءات القرص',
        description: 'Test pinch zoom and rotation',
        arabicDescription: 'اختبار التكبير والتصوير بالإيماءات',
        expected: 'Pinch gestures should work correctly',
        arabicExpected: 'يجب أن تعمل إيماءات القرص بشكل صحيح',
        instructions: '1. Test pinch to zoom\n2. Test pinch to rotate\n3. Test double-tap zoom\n4. Test reset zoom',
        arabicInstructions: '1. اختبر القرص للتكبير\n2. اختبر القرص للتصوير\n3. اختبر النقر المزدوج للتكبير\n4. اختبر إعادة تعيين التكبير'
      },
      {
        id: 'interaction_gestures_3',
        title: 'Long Press',
        arabicTitle: 'الضغط الطويل',
        description: 'Test long press interactions',
        arabicDescription: 'اختبار تفاعلات الضغط الطويل',
        expected: 'Long press should trigger context menus',
        arabicExpected: 'يجب أن يطلق الضغط الطويل القوائم السياقية',
        instructions: '1. Test long press on cards\n2. Test long press on images\n3. Test long press on text\n4. Verify context menu options',
        arabicInstructions: '1. اختبر الضغط الطويل على البطاقات\n2. اختبر الضغط الطويل على الصور\n3. اختبر الضغط الطويل على النص\n4. تحقق من خيارات القائمة السياقية'
      }
    ],
    requirements: ['Touch gestures', 'Multi-touch support', 'Haptic feedback'],
    arabicRequirements: ['إيماءات اللمس', 'دعم اللمس المتعدد', 'التغذية اللمسية'],
    results: {
      passed: false,
      score: 0,
      issues: []
    }
  },

  // Performance Testing
  {
    id: 'performance_loading',
    title: 'Loading Performance',
    arabicTitle: 'أداء التحميل',
    description: 'Test app loading speed and responsiveness',
    arabicDescription: 'اختبار سرعة تحميل التطبيق',
    url: '/',
    category: 'performance',
    priority: 'medium',
    testSteps: [
      {
        id: 'performance_loading_1',
        title: 'Initial Load',
        arabicTitle: 'التحميل الأولي',
        description: 'Test initial app loading',
        arabicDescription: 'اختبار تحميل التطبيق لأول مرة',
        expected: 'App should load within 3 seconds',
        arabicExpected: 'يجب أن يتم تحميل التطبيق خلال 3 ثواني',
        instructions: '1. Clear browser cache\n2. Open app in new tab\n3. Measure load time\n4. Check loading indicators',
        arabicInstructions: '1. امسح ذاكرة المتصفح\n2. افتح التطبيق في تب جديد\n3. قس وقت التحميل\n4. تحقق من مؤشرات التحميل'
      },
      {
        id: 'performance_loading_2',
        title: 'Navigation Speed',
        arabicTitle: 'سرعة التنقل',
        description: 'Test navigation between pages',
        arabicDescription: 'اختبار سرعة التنقل بين الصفحات',
        expected: 'Page transitions should be smooth',
        arabicExpected: 'يجب أن تكون انتقالات الصفحات سلسة',
        instructions: '1. Navigate between pages\n2. Measure transition time\n3. Test animation smoothness\n4. Check memory usage',
        arabicInstructions: '1. تنقل بين الصفحات\n2. قس وقت الانتقال\n3. اختبر سلاسة الرسوم المتحركة\n4. تحقق من استخدام الذاكرة'
      }
    ],
    requirements: ['Fast loading', 'Smooth animations', 'Low memory usage'],
    arabicRequirements: ['تحميل سريع', 'رسوم متحركة سلسة', 'استخدام منخفض للذاكرة'],
    results: {
      passed: false,
      score: 0,
      issues: []
    }
  },

  // Compatibility Testing
  {
    id: 'compatibility_browsers',
    title: 'Browser Compatibility',
    arabicTitle: 'توافق المتصفحات',
    description: 'Test across different mobile browsers',
    arabicDescription: 'اختبار التوافق مع متصفحات الموبايل المختلفة',
    category: 'compatibility',
    priority: 'medium',
    testSteps: [
      {
        id: 'compatibility_browsers_1',
        title: 'Chrome Mobile',
        arabicTitle: 'كروم للموبايل',
        description: 'Test on Chrome mobile browser',
        arabicDescription: 'اختبار على متصفح كروم للموبايل',
        expected: 'All features should work correctly',
        arabicExpected: 'يجب أن تعمل جميع المميزات بشكل صحيح',
        instructions: '1. Open in Chrome mobile\n2. Test all features\n3. Check console for errors\n4. Verify performance',
        arabicInstructions: '1. افتح في كروم للموبايل\n2. اختبر جميع المميزات\n3. تحقق من وحدة التحكم للأخطاء\n4. تحقق من الأداء'
      },
      {
        id: 'compatibility_browsers_2',
        title: 'Safari Mobile',
        arabicTitle: 'سفاري للموبايل',
        description: 'Test on Safari mobile browser',
        arabicDescription: 'اختبار على متصفح سفاري للموبايل',
        expected: 'All features should work correctly',
        arabicExpected: 'يجب أن تعمل جميع المميزات بشكل صحيح',
        instructions: '1. Open in Safari mobile\n2. Test all features\n3. Check for Safari-specific issues\n4. Verify touch responsiveness',
        arabicInstructions: '1. افتح في سفاري للموبايل\n2. اختبر جميع المميزات\n3. تحقق من مشاكلات سفاري\n4. تحقق من استجابة اللمس'
      },
      {
        id: 'compatibility_browsers_3',
        title: 'Firefox Mobile',
        arabicTitle: 'فايرفوكس للموبايل',
        description: 'Test on Firefox mobile browser',
        arabicDescription: 'اختبار على متصفح فايرفوكس للموبايل',
        expected: 'All features should work correctly',
        arabicExpected: 'يجب أن تعمل جميع المميزات بشكل صحيح',
        instructions: '1. افتح في فايرفوكس للموبايل\n2. اختبر جميع المميزات\n3. تحقق من مشاكلات فايرفوكس\n4. تحقق من توافق الإضافات'
      }
    ],
    requirements: ['Cross-browser compatibility', 'Progressive enhancement', 'Graceful degradation'],
    arabicRequirements: ['توافق المتصفحات', 'التحسين التدريجي', 'التدهير اللطيف'],
    results: {
      passed: false,
      score: 0,
      issues: []
    }
  },

  // Accessibility Testing
  {
    id: 'accessibility_screen',
    title: 'Screen Reader Support',
    arabicTitle: 'دعم قارئ الشاشة',
    description: 'Test screen reader accessibility',
    category: 'accessibility',
    priority: 'high',
    testSteps: [
      {
        id: 'accessibility_screen_1',
        title: 'VoiceOver',
        arabicTitle: 'VoiceOver',
        description: 'Test VoiceOver screen reader',
        arabicDescription: 'اختبار قارئ الشاشة VoiceOver',
        expected: 'App should be fully accessible',
        arabicExpected: 'يجب أن يكون التطبيق قابلا للوصول بالكامل',
        instructions: '1. Enable VoiceOver\n2. Navigate through app\n3. Check element descriptions\n4. Test reading order',
        arabicInstructions: '1. فعّل VoiceOver\n2. تنقل في التطبيق\n3. تحقق من أوصاف العناصر\n4. اختبر ترتيب القراءة'
      },
      {
        id: 'accessibility_screen_2',
        title: 'TalkBack',
        arabicTitle: 'TalkBack',
        description: 'Test TalkBack screen reader',
        arabicDescription: 'اختبار قارئ الشاشة TalkBack',
        expected: 'App should be fully accessible',
        arabicExpected: 'يجب أن يكون التطبيق قابلا للوصول بالكامل',
        instructions: '1. Enable TalkBack\n2. Navigate through app\n3. Check element descriptions\n4. Test rotor control',
        arabicInstructions: '1. فعّل TalkBack\n2. تنقل في التطبيق\n3. تحقق من أوصاف العناصر\n4. اختبر التحكم بالدوار'
      },
      {
        id: 'accessibility_screen_3',
        title: 'Color Contrast',
        arabicTitle: 'تباين الألوان',
        description: 'Test color contrast and visibility',
        arabicDescription: 'اختبار تباين الألوان والرؤية',
        expected: 'Text should be readable with good contrast',
        arabicExpected: 'يجب أن يكون النص مقروء مع تباين جيدة',
        instructions: '1. Check text contrast\n2. Test with different backgrounds\n3. Verify button visibility\n4. Test in bright light',
        arabicInstructions: '1. تحقق من تباين النص\n2. اختبر مع خلفيات مختلفة\n3. تحقق من رؤية الأزرار\n4. اختبر في الإضاءة الساطعة'
      }
    ],
    requirements: ['WCAG compliance', 'Keyboard navigation', 'Screen reader support', 'High contrast'],
    arabicRequirements: ['امتثال WCAG', 'التنقل بلوحة المفاتيح', 'دعم قارئ الشاشة', 'تباين ألوان عالية'],
    results: {
      passed: false,
      score: 0,
      issues: []
    }
  }
];

// Mobile Testing Checklist Component
export const MobileTestingChecklist: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('navigation');
  const [expandedTests, setExpandedTests] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);

  const categories = [
    { id: 'navigation', name: 'التنقل', icon: <Menu /> },
    { id: 'content', name: 'المحتوى', icon: <Book /> },
    { id: 'interaction', name: 'التفاعل', icon: <TouchApp /> },
    { id: 'performance', name: 'الأداء', icon: <Speed /> },
    { id: 'compatibility', name: 'التوافق', icon: <Devices /> },
    { id: 'accessibility', name: 'إمكانية الوصول', icon: <Visibility /> }
  ];

  const toggleTest = (testId: string, category: string) => {
    setTestResults(prev => ({
      ...prev,
      [`${category}_${testId}`]: !prev[`${category}_${testId}`]
    }));
  };

  const toggleExpanded = (category: string) => {
    setExpandedTests(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getCategoryTests = (category: string) => {
    return mobileTestingGuide.filter(test => test.category === category);
  };

  const calculateProgress = () => {
    const allTests = mobileTestingGuide.filter(test => test.category === activeCategory);
    const completedTests = allTests.filter(test => 
      testResults[`${test.category}_${test.id}`] === true
    ).length;
    return allTests.length > 0 ? (completedTests / allTests.length) * 100 : 0;
  };

  const runAllTests = () => {
    const allTests = mobileTestingGuide;
    const results: Record<string, boolean> = {};
    
    allTests.forEach(test => {
      results[`${test.category}_${test.id}`] = true;
    });
    
    setTestResults(results);
    setShowResults(true);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, p: 0, overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', bgcolor: '#F8F9FA' }}>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
            📱 دليل اختبار التطبيق للموبايل
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={runAllTests}
            >
              تشغيل جميع الاختبارات
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => setTestResults({})}
            >
              إعادة تعيين
            </Button>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            التقدم الإجمالي: {Math.round(calculateProgress())}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={calculateProgress()}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {/* Categories */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Grid container spacing={1}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: activeCategory === category.id ? '2px solid #2196F3' : '1px solid #E0E0E0',
                    bgcolor: activeCategory === category.id ? '#E3F2FD' : 'white',
                    '&:hover': { bgcolor: '#F5F5F5', transform: 'translateY(-2px)' }
                  }}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: activeCategory === category.id ? '#2196F3' : '#9E9E9E', color: 'white' }}>
                      {category.icon}
                    </Avatar>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {category.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={`${getCategoryTests(category.id).length} اختبار`}
                      color={activeCategory === category.id ? 'primary' : 'default'}
                    />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Tests */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
            {categories.find(c => c.id === activeCategory)?.name}
          </Typography>
          
          <List>
            {getCategoryTests(activeCategory).map((test) => (
              <ListItem key={test.id} sx={{ p: 0, mb: 1 }}>
                <Paper sx={{ p: 2, width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        onClick={() => toggleTest(test.id, activeCategory)}
                        sx={{
                          color: testResults[`${activeCategory}_${test.id}`] ? 'success' : 'default'
                        }}
                      >
                        {testResults[`${activeCategory}_${test.id}`] ? <CheckCircle /> : <RadioButtonUnchecked />}
                      </IconButton>
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {test.arabicTitle}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {test.arabicDescription}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <IconButton
                      onClick={() => toggleExpanded(test.id)}
                      sx={{ transform: expandedTests[test.id] ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      <ExpandMore />
                    </IconButton>
                  </Box>
                  
                  {expandedTests[test.id] && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#F5F5F5', borderRadius: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        خطوات الاختبار:
                      </Typography>
                      
                      <Stepper activeStep={0} orientation="vertical">
                        {test.testSteps.map((step, index) => (
                          <Step key={step.id}>
                            <StepLabel>
                              {step.arabicTitle}
                            </StepLabel>
                            <StepContent>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                {step.arabicInstructions}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                المتوقع: {step.arabicExpected}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                ملاحظات: {step.arabicNotes || 'لا توجد'}
                              </Typography>
                            </StepContent>
                          </Step>
                        ))}
                      </Stepper>
                    </Box>
                  )}
                </Paper>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Results Summary */}
        {showResults && (
          <Dialog open maxWidth="md" fullWidth>
            <DialogTitle>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                📊 نتائج الاختبارات
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                {categories.map((category) => {
                  const categoryTests = getCategoryTests(category.id);
                  const passedTests = categoryTests.filter(test => 
                    testResults[`${category.id}_${test.id}`] === true
                  ).length;
                  const totalTests = categoryTests.length;
                  const score = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
                  
                  return (
                    <Grid item xs={12} sm={6} key={category.id}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Avatar sx={{ 
                          bgcolor: score >= 80 ? '#4CAF50' : score >= 60 ? '#FF9800' : '#F44336',
                          color: 'white',
                          width: 60,
                          height: 60,
                          mb: 1
                        }}>
                          {score}%
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 900 }}>
                          {category.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {passedTests}/{totalTests} اختبار مكتمل
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={score}
                          sx={{ mt: 1, width: 100 }}
                        />
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowResults(false)}>
                إغلاق
              </Button>
              <Button
                variant="contained"
                startIcon={<Share />}
                onClick={() => {
                  // Export results functionality
                }}
              >
                مشاركة النتائج
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};
