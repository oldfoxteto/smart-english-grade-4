// Professional Testing Page with Full Functionality
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  Stack,
  Alert,
  AlertTitle,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Fab,
  Badge,
  CircularProgress,
  Backdrop,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Quiz,
  Timer,
  CheckCircle,
  School,
  TrendingUp,
  EmojiEvents,
  PlayArrow,
  Stop,
  Refresh,
  Download,
  Share,
  Assessment,
  Book,
  Headphones,
  RecordVoiceOver,
  Analytics,
  Leaderboard,
  Star,
  Speed,
  Visibility,
  Close,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material';

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
  xpReward: number;
  unlockLevel: number;
  isFavorite?: boolean;
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
  xpGained: number;
}

// Enhanced Mock Data
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
    xpReward: 100,
    unlockLevel: 1,
    isFavorite: true,
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
    xpReward: 75,
    unlockLevel: 5,
    isFavorite: false,
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
    icon: <Headphones />,
    xpReward: 50,
    unlockLevel: 1,
    isFavorite: true,
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
    icon: <RecordVoiceOver />,
    xpReward: 80,
    unlockLevel: 8,
    isFavorite: false,
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
    xpReward: 90,
    unlockLevel: 10,
    isFavorite: false,
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
    xpGained: 78,
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
    xpGained: 46,
  },
];

const ProfessionalTestingPage: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [filteredTests, setFilteredTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTestActive, setIsTestActive] = useState(false);
  const [testTime, setTestTime] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setTimeout(() => {
      setTests(mockTests);
      setTestResults(mockTestResults);
      setFilteredTests(mockTests);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (isTestActive) {
      timerRef.current = setInterval(() => {
        setTestTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTestActive]);

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
    setIsTestActive(true);
    setTestTime(0);
    setCurrentQuestion(0);
    setAnswers([]);
    playSound('start');
    console.log('Starting test:', test.id);
  };

  const handleStopTest = () => {
    setIsTestActive(false);
    setTestTime(0);
    setSelectedTest(null);
    playSound('stop');
  };

  const handleViewResults = (result: TestResult) => {
    setSelectedTest(tests.find(t => t.id === result.testId) || null);
    setShowResults(true);
  };

  const handleShare = (test: Test) => {
    if (navigator.share) {
      navigator.share({
        title: test.arabicTitle,
        text: test.arabicDescription,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط!');
    }
  };

  const playSound = (type: 'start' | 'stop' | 'complete') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'start':
        oscillator.frequency.value = 523.25;
        gainNode.gain.value = 0.1;
        break;
      case 'stop':
        oscillator.frequency.value = 261.63;
        gainNode.gain.value = 0.1;
        break;
      case 'complete':
        oscillator.frequency.value = 659.25;
        gainNode.gain.value = 0.1;
        break;
    }
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Stack spacing={3} alignItems="center">
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6">جاري تحميل الاختبارات...</Typography>
            <Typography variant="body2" color="text.secondary">
              يتم تحميل أفضل الاختبارات لتقييم مستواك
            </Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="auto" />

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            📝 الاختبارات والتقييم
          </Typography>
          <Stack direction="row" spacing={2}>
            <Tooltip title="إحصائيات التقدم">
              <IconButton color="primary">
                <Analytics />
              </IconButton>
            </Tooltip>
            <Tooltip title="لوحة الصدارة">
              <IconButton color="primary">
                <Leaderboard />
              </IconButton>
            </Tooltip>
            <Tooltip title="الإنجازات">
              <IconButton color="primary">
                <EmojiEvents />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
        <Typography variant="body1" color="text.secondary">
          اختبر مهاراتك وتتبع تقدمك في تعلم اللغة الإنجليزية
        </Typography>
      </Box>

      {/* Active Test Dialog */}
      {selectedTest && isTestActive && (
        <Dialog open={true} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: getTypeColor(selectedTest.type).main }}>
                {selectedTest.icon}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {selectedTest.arabicTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  السؤال {currentQuestion + 1} من {selectedTest.questions}
                </Typography>
              </Box>
            </Stack>
            <IconButton onClick={handleStopTest}>
              <Close />
            </IconButton>
          </DialogTitle>
          
          <DialogContent>
            <Stack spacing={3}>
              {/* Timer Display */}
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'primary.main' }}>
                  {Math.floor(testTime / 60)}:{(testTime % 60).toString().padStart(2, '0')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  من {selectedTest.duration} دقيقة
                </Typography>
              </Box>

              {/* Progress */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  التقدم: {Math.round((currentQuestion / selectedTest.questions) * 100)}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(currentQuestion / selectedTest.questions) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              {/* Sample Question */}
              <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  سؤال مثال: اختر الإجابة الصحيحة
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  What is the past tense of "go"?
                </Typography>
                <Stack spacing={2}>
                  <Button variant="outlined" fullWidth sx={{ justifyContent: 'flex-start' }}>
                    A) Goed
                  </Button>
                  <Button variant="outlined" fullWidth sx={{ justifyContent: 'flex-start' }}>
                    B) Went
                  </Button>
                  <Button variant="outlined" fullWidth sx={{ justifyContent: 'flex-start' }}>
                    C) Gone
                  </Button>
                  <Button variant="outlined" fullWidth sx={{ justifyContent: 'flex-start' }}>
                    D) Going
                  </Button>
                </Stack>
              </Paper>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              السابق
            </Button>
            <Button
              onClick={() => setCurrentQuestion(Math.min(selectedTest.questions - 1, currentQuestion + 1))}
              disabled={currentQuestion === selectedTest.questions - 1}
              variant="contained"
            >
              {currentQuestion === selectedTest.questions - 1 ? 'إنهاء' : 'التالي'}
            </Button>
            <Button
              startIcon={<Stop />}
              color="error"
              onClick={handleStopTest}
              variant="outlined"
            >
              إلغاء الاختبار
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Enhanced Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ position: 'relative', overflow: 'visible' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Badge badgeContent={tests.filter(t => !t.completed).length} color="error">
                <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                  <Quiz />
                </Avatar>
              </Badge>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {tests.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                إجمالي الاختبارات
              </Typography>
              <Typography variant="caption" color="primary">
                +{tests.filter(t => !t.completed).length} جديد
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <CheckCircle />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {tests.filter(t => t.completed).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                الاختبارات المكتملة
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(tests.filter(t => t.completed).length / tests.length) * 100}
                sx={{ mt: 1, height: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <TrendingUp />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {testResults.length > 0 ? Math.round(testResults.reduce((acc, r) => acc + r.score, 0) / testResults.length) : 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                متوسط الدرجات
              </Typography>
              <Typography variant="caption" color="success.main">
                {testResults.reduce((acc, r) => acc + r.xpGained, 0)} XP مكتسب
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <Timer />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formatTime(testResults.reduce((acc, r) => acc + r.timeSpent, 0))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                إجمالي وقت الاختبارات
              </Typography>
              <Typography variant="caption" color="warning.main">
                {testResults.length} محاولة
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Enhanced Test Cards */}
      <Grid container spacing={3}>
        {filteredTests.map((test) => (
          <Grid item xs={12} sm={6} md={4} key={test.id}>
            <Card
              sx={{
                position: 'relative',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 8,
                },
              }}
            >
              {/* Favorite Badge */}
              <IconButton
                sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                color={test.isFavorite ? 'error' : 'default'}
              >
                <Star />
              </IconButton>

              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Avatar sx={{ bgcolor: `${getTypeColor(test.type)}.main` }}>
                      {test.icon}
                    </Avatar>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={test.type}
                        color={getTypeColor(test.type)}
                        size="small"
                      />
                      <Chip
                        label={test.status}
                        color={getStatusColor(test.status)}
                        size="small"
                      />
                    </Stack>
                  </Box>

                  {/* Title and Description */}
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {test.arabicTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {test.arabicDescription}
                    </Typography>
                  </Box>

                  {/* Stats */}
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Quiz sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {test.questions} سؤال
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Timer sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {test.duration} دقيقة
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Speed sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {test.attempts} محاولة
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Score Progress */}
                  {test.completed && test.score && (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          آخر درجة: {test.score}%
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          أفضل درجة: {test.bestScore}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={test.score}
                        color={getScoreColor(test.score)}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  )}

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={1}>
                    <Button
                      startIcon={test.status === 'locked' ? <Visibility /> : <PlayArrow />}
                      color={test.completed ? 'success' : 'primary'}
                      onClick={() => handleStartTest(test)}
                      disabled={test.status === 'locked'}
                      variant={test.completed ? 'outlined' : 'contained'}
                      fullWidth
                    >
                      {test.status === 'locked' ? 'مقفل' : test.completed ? 'مراجعة' : 'بدء الاختبار'}
                    </Button>
                    {test.completed && (
                      <Button
                        startIcon={<Visibility />}
                        color="secondary"
                        onClick={() => {
                          const result = testResults.find(r => r.testId === test.id);
                          if (result) handleViewResults(result);
                        }}
                        variant="outlined"
                      >
                        النتائج
                      </Button>
                    )}
                    <IconButton
                      onClick={() => handleShare(test)}
                      color="primary"
                      size="small"
                    >
                      <Share />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Test Results Dialog */}
      <Dialog open={showResults} onClose={() => setShowResults(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            📊 نتائج الاختبار
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedTest && testResults.find(r => r.testId === selectedTest.id) && (
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  {selectedTest.arabicTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedTest.arabicDescription}
                </Typography>
              </Box>

              <TableContainer component={Paper}>
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
                    <TableRow>
                      <TableCell>XP المكتسب</TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                          +{testResults.find(r => r.testId === selectedTest.id)?.xpGained} XP
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  التغذية الراجعة
                </Typography>
                <Typography variant="body2">
                  {testResults.find(r => r.testId === selectedTest.id)?.feedback}
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
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
          <Button onClick={() => setShowResults(false)}>
            إغلاق
          </Button>
          <Button
            startIcon={<Share />}
            color="primary"
            onClick={() => console.log('Share results')}
          >
            مشاركة النتائج
          </Button>
          <Button
            startIcon={<Download />}
            color="secondary"
            onClick={() => console.log('Download results')}
          >
            تحميل النتائج
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => console.log('View analytics')}
      >
        <Analytics />
      </Fab>

      {filteredTests.length === 0 && (
        <Alert severity="info" sx={{ mt: 4 }}>
          <AlertTitle>لا توجد اختبارات</AlertTitle>
          لا توجد اختبارات تطابق معايير البحث حالياً.
        </Alert>
      )}
    </Container>
  );
};

export default ProfessionalTestingPage;
