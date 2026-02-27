// Testing Page
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import {
  Quiz,
  Timer,
  CheckCircle,
  TrendingUp,
  PlayArrow,
  Visibility,
  Share,
  Search,
  Assessment,
  Speed,
  Psychology,
  Book,
  Headphones,
  RecordVoiceOver,
} from '@mui/icons-material';

// Import design system
import { tokens } from '../design-system/tokens';
import {
  AppCard,
  AppButton,
  AppProgress,
  AppAvatar,
  AppChip,
  AppGrid,
} from '../components/ui';

// Types
interface Test {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  type: 'placement' | 'progress' | 'final' | 'practice';
  category: 'grammar' | 'vocabulary' | 'listening' | 'reading' | 'speaking';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  questions: number;
  completed: boolean;
  score?: number;
  bestScore?: number;
  attempts: number;
  passingScore: number;
  status: 'available' | 'locked' | 'completed' | 'in_progress';
  icon: React.ReactNode;
}

interface TestResult {
  id: string;
  testId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: Date;
  feedback: string;
  recommendations: string[];
}

// Mock data
const mockTests: Test[] = [
  {
    id: '1',
    title: 'Placement Test',
    arabicTitle: 'اختبار التقييم',
    description: 'Determine your English level',
    arabicDescription: 'حدد مستواك في اللغة الإنجليزية',
    type: 'placement',
    category: 'grammar',
    difficulty: 'intermediate',
    duration: 45,
    questions: 50,
    completed: true,
    score: 78,
    bestScore: 85,
    attempts: 1,
    passingScore: 60,
    status: 'completed',
    icon: <Assessment />,
  },
  {
    id: '2',
    title: 'Grammar Test',
    arabicTitle: 'اختبار القواعد',
    description: 'Test your grammar knowledge',
    arabicDescription: 'اختبر معرفتك بالقواعد',
    type: 'progress',
    category: 'grammar',
    difficulty: 'intermediate',
    duration: 30,
    questions: 25,
    completed: false,
    attempts: 2,
    passingScore: 70,
    status: 'available',
    icon: <Book />,
  },
  {
    id: '3',
    title: 'Vocabulary Test',
    arabicTitle: 'اختبار المفردات',
    description: 'Test your vocabulary skills',
    arabicDescription: 'اختبر مهاراتك في المفردات',
    type: 'progress',
    category: 'vocabulary',
    difficulty: 'beginner',
    duration: 20,
    questions: 20,
    completed: true,
    score: 92,
    bestScore: 95,
    attempts: 3,
    passingScore: 75,
    status: 'completed',
    icon: <Psychology />,
  },
  {
    id: '4',
    title: 'Listening Comprehension',
    arabicTitle: 'اختبار فهم الاستماع',
    description: 'Test your listening abilities',
    arabicDescription: 'اختبر قدراتك الاستماع',
    type: 'progress',
    category: 'listening',
    difficulty: 'advanced',
    duration: 35,
    questions: 30,
    completed: false,
    attempts: 1,
    passingScore: 65,
    status: 'available',
    icon: <Headphones />,
  },
  {
    id: '5',
    title: 'Speaking Assessment',
    arabicTitle: 'تقييم التحدث',
    description: 'Evaluate your speaking skills',
    arabicDescription: 'قيم مهارات التحدث لديك',
    type: 'practice',
    category: 'speaking',
    difficulty: 'intermediate',
    duration: 25,
    questions: 15,
    completed: false,
    attempts: 0,
    passingScore: 70,
    status: 'locked',
    icon: <RecordVoiceOver />,
  },
];

const mockTestResults: TestResult[] = [
  {
    id: '1',
    testId: '1',
    score: 78,
    totalQuestions: 50,
    correctAnswers: 39,
    timeSpent: 42,
    completedAt: new Date('2024-01-15T10:30:00'),
    feedback: 'Good performance! You have intermediate level English skills.',
    recommendations: [
      'Focus on advanced grammar topics',
      'Practice more complex vocabulary',
      'Improve listening comprehension',
    ],
  },
  {
    id: '2',
    testId: '3',
    score: 92,
    totalQuestions: 20,
    correctAnswers: 18,
    timeSpent: 18,
    completedAt: new Date('2024-01-20T14:15:00'),
    feedback: 'Excellent! Your vocabulary is at advanced level.',
    recommendations: [
      'Challenge yourself with more difficult words',
      'Learn idiomatic expressions',
      'Practice using new vocabulary in context',
    ],
  },
];

export const TestingPage: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [filteredTests, setFilteredTests] = useState<Test[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTests(mockTests);
      setTestResults(mockTestResults);
      setFilteredTests(mockTests);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = tests;

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(test =>
        test.arabicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.arabicDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by tab
    switch (activeTab) {
      case 0: break; // All
      case 1: // Placement
        filtered = filtered.filter(test => test.type === 'placement');
        break;
      case 2: // Progress
        filtered = filtered.filter(test => test.type === 'progress');
        break;
      case 3: // Practice
        filtered = filtered.filter(test => test.type === 'practice');
        break;
    }

    setFilteredTests(filtered);
  }, [tests, searchQuery, activeTab]);

  const getTypeColor = (type: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' => {
    switch (type) {
      case 'placement': return 'primary';
      case 'progress': return 'success';
      case 'final': return 'error';
      case 'practice': return 'warning';
      default: return 'primary';
    }
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'locked': return 'error';
      default: return 'default';
    }
  };

  const getScoreColor = (score: number): 'success' | 'warning' | 'error' => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const handleStartTest = (test: Test) => {
    if (test.status === 'locked') {
      alert('هذا الاختبار مقفل حالياً');
      return;
    }
    setSelectedTest(test);
    console.log('Starting test:', test.id);
  };

  const handleViewResults = (result: TestResult) => {
    setSelectedTest(tests.find(t => t.id === result.testId) || null);
    setShowResults(true);
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ar', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const tabLabels = [
    'الكل',
    'اختبارات التقييم',
    'اختبارات التقدم',
    'اختبارات الممارسة',
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Stack spacing={2} alignItems="center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <Typography variant="h6">جاري تحميل الاختبارات...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ p: tokens.spacing.lg }}>
      {/* Header */}
      <Box sx={{ mb: tokens.spacing.xl }}>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: tokens.spacing.md }}>
          📝 الاختبارات والتقييم
        </Typography>
        <Typography variant="body1" color="text.secondary">
          اختبر مهاراتك وتتبع تقدمك في تعلم اللغة الإنجليزية
        </Typography>
      </Box>

      {/* Search Bar */}
      <AppCard sx={{ mb: tokens.spacing.xl }}>
        <TextField
          fullWidth
          placeholder="ابحث عن اختبار..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
                <Search />
              </Box>
            ),
          }}
        />
      </AppCard>

      {/* Tabs */}
      <AppCard sx={{ mb: tokens.spacing.xl }}>
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

      {/* Stats Cards */}
      <AppGrid spacing={tokens.spacing.lg} sx={{ mb: tokens.spacing.xl }}>
        <AppGrid xs={12} sm={6} md={3}>
          <AppCard>
            <Stack spacing={tokens.spacing.md} alignItems="center">
              <AppAvatar color="primary" size="lg">
                <Quiz />
              </AppAvatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {tests.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                إجمالي الاختبارات
              </Typography>
            </Stack>
          </AppCard>
        </AppGrid>

        <AppGrid xs={12} sm={6} md={3}>
          <AppCard>
            <Stack spacing={tokens.spacing.md} alignItems="center">
              <AppAvatar color="success" size="lg">
                <CheckCircle />
              </AppAvatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {tests.filter(t => t.completed).length}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                الاختبارات المكتملة
              </Typography>
            </Stack>
          </AppCard>
        </AppGrid>

        <AppGrid xs={12} sm={6} md={3}>
          <AppCard>
            <Stack spacing={tokens.spacing.md} alignItems="center">
              <AppAvatar color="warning" size="lg">
                <TrendingUp />
              </AppAvatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {testResults.length > 0 ? Math.round(testResults.reduce((acc, r) => acc + r.score, 0) / testResults.length) : 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                متوسط الدرجات
              </Typography>
            </Stack>
          </AppCard>
        </AppGrid>

        <AppGrid xs={12} sm={6} md={3}>
          <AppCard>
            <Stack spacing={tokens.spacing.md} alignItems="center">
              <AppAvatar color="secondary" size="lg">
                <Timer />
              </AppAvatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formatTime(testResults.reduce((acc, r) => acc + r.timeSpent, 0))}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                إجمالي وقت الاختبارات
              </Typography>
            </Stack>
          </AppCard>
        </AppGrid>
      </AppGrid>

      {/* Tests Grid */}
      <AppGrid spacing={tokens.spacing.lg}>
        {filteredTests.map((test) => (
          <AppGrid xs={12} sm={6} md={4} key={test.id}>
            <AppCard
              hoverable
              onClick={() => handleStartTest(test)}
              sx={{
                opacity: test.status === 'locked' ? 0.6 : 1,
                cursor: test.status === 'locked' ? 'not-allowed' : 'pointer',
              }}
            >
              <Stack spacing={tokens.spacing.md}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <AppAvatar color={getTypeColor(test.type)} size="md">
                    {test.icon}
                  </AppAvatar>
                  <Stack direction="row" spacing={1}>
                    <AppChip
                      label={test.type}
                      color={getTypeColor(test.type)}
                      size="small"
                    />
                    <AppChip
                      label={test.status}
                      color={getStatusColor(test.status)}
                      size="small"
                    />
                  </Stack>
                </Box>

                {/* Title and Description */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: tokens.spacing.xs }}>
                    {test.arabicTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: tokens.spacing.sm }}>
                    {test.arabicDescription}
                  </Typography>
                </Box>

                {/* Stats */}
                <Stack direction="row" spacing={tokens.spacing.md} alignItems="center">
                  <Stack direction="row" spacing={tokens.spacing.xs} alignItems="center">
                    <Quiz sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {test.questions} سؤال
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={tokens.spacing.xs} alignItems="center">
                    <Timer sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {test.duration} دقيقة
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={tokens.spacing.xs} alignItems="center">
                    <Speed sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {test.attempts} محاولة
                    </Typography>
                  </Stack>
                </Stack>

                {/* Score Progress */}
                {test.completed && test.score && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: tokens.spacing.xs }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        آخر درجة: {test.score}%
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        أفضل درجة: {test.bestScore}%
                      </Typography>
                    </Box>
                    <AppProgress
                      value={test.score}
                      color={getScoreColor(test.score)}
                      showLabel
                      label="الأداء"
                    />
                  </Box>
                )}

                {/* Action Buttons */}
                <Stack direction="row" spacing={1}>
                  <AppButton
                    startIcon={test.status === 'locked' ? <Visibility /> : <PlayArrow />}
                    color={test.completed ? 'success' : 'primary'}
                    onClick={() => handleStartTest(test)}
                    disabled={test.status === 'locked'}
                    fullWidth
                  >
                    {test.status === 'locked' ? 'مقفل' : test.completed ? 'مراجعة' : 'بدء الاختبار'}
                  </AppButton>
                  {test.completed && (
                    <AppButton
                      startIcon={<Visibility />}
                      color="secondary"
                      onClick={() => {
                        const result = testResults.find(r => r.testId === test.id);
                        if (result) handleViewResults(result);
                      }}
                    >
                      النتائج
                    </AppButton>
                  )}
                </Stack>
              </Stack>
            </AppCard>
          </AppGrid>
        ))}
      </AppGrid>

      {/* Test Results Dialog */}
      <Dialog open={showResults} onClose={() => setShowResults(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            📊 نتائج الاختبار
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedTest && testResults.find(r => r.testId === selectedTest.id) && (
            <Stack spacing={tokens.spacing.lg}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: tokens.spacing.md }}>
                  {selectedTest.arabicTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedTest.arabicDescription}
                </Typography>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>المقياس</TableCell>
                      <TableCell>القيمة</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>الدرجة</TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {testResults.find(r => r.testId === selectedTest.id)?.score}%
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>الإجابات الصحيحة</TableCell>
                      <TableCell>
                        {testResults.find(r => r.testId === selectedTest.id)?.correctAnswers} / {testResults.find(r => r.testId === selectedTest.id)?.totalQuestions}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>الوقت المستغرق</TableCell>
                      <TableCell>
                        {formatTime(testResults.find(r => r.testId === selectedTest.id)?.timeSpent || 0)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>تاريخ الإنجاز</TableCell>
                      <TableCell>
                        {formatDate(testResults.find(r => r.testId === selectedTest.id)?.completedAt || new Date())}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: tokens.spacing.md }}>
                  التغذية الراجعة
                </Typography>
                <Typography variant="body2">
                  {testResults.find(r => r.testId === selectedTest.id)?.feedback}
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: tokens.spacing.md }}>
                  التوصيات
                </Typography>
                <List>
                  {testResults.find(r => r.testId === selectedTest.id)?.recommendations.map((rec, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText primary={rec} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <AppButton onClick={() => setShowResults(false)}>
            إغلاق
          </AppButton>
          <AppButton
            startIcon={<Share />}
            color="primary"
            onClick={() => console.log('Share results')}
          >
            مشاركة النتائج
          </AppButton>
        </DialogActions>
      </Dialog>

      {filteredTests.length === 0 && (
        <Alert severity="info" sx={{ mt: tokens.spacing.lg }}>
          <AlertTitle>لا توجد اختبارات</AlertTitle>
          لا توجد اختبارات تطابق معايير البحث حالياً.
        </Alert>
      )}
    </Box>
  );
};
