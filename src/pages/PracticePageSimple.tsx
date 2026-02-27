// Simple Practice Page - Working Version
import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  Paper,
  Container,
} from '@mui/material';
import {
  Psychology,
  RecordVoiceOver,
  Mic,
  Headphones,
  Book,
  Timer,
  PlayArrow,
  Stop,
  Refresh,
  CheckCircle,
  Star,
  TrendingUp,
  Speed,
} from '@mui/icons-material';

// Types
interface PracticeExercise {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  type: 'pronunciation' | 'listening' | 'speaking' | 'grammar' | 'vocabulary';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  completed: boolean;
  score?: number;
  bestScore?: number;
  attempts: number;
  category: string;
  icon: React.ReactNode;
}

// Mock data
const mockExercises: PracticeExercise[] = [
  {
    id: '1',
    title: 'Pronunciation Practice',
    arabicTitle: 'تمرين النطق',
    description: 'Practice English pronunciation with AI feedback',
    arabicDescription: 'تدرب على النطق الإنجليزي مع تغذية راجعة من الذكاء الاصطناعي',
    type: 'pronunciation',
    difficulty: 'intermediate',
    duration: 15,
    completed: true,
    score: 85,
    bestScore: 92,
    attempts: 5,
    category: 'Speaking',
    icon: <RecordVoiceOver />,
  },
  {
    id: '2',
    title: 'Listening Comprehension',
    arabicTitle: 'فهم الاستماع',
    description: 'Test your listening skills with audio exercises',
    arabicDescription: 'اختبر مهارات الاستماع مع تمارين صوتية',
    type: 'listening',
    difficulty: 'beginner',
    duration: 20,
    completed: false,
    attempts: 2,
    category: 'Listening',
    icon: <Headphones />,
  },
  {
    id: '3',
    title: 'Speaking Practice',
    arabicTitle: 'تمرين التحدث',
    description: 'Practice speaking with conversation scenarios',
    arabicDescription: 'تدرب على التحدث مع سيناريوهات محادثة',
    type: 'speaking',
    difficulty: 'advanced',
    duration: 25,
    completed: false,
    attempts: 0,
    category: 'Speaking',
    icon: <Mic />,
  },
  {
    id: '4',
    title: 'Grammar Exercises',
    arabicTitle: 'تمارين القواعد',
    description: 'Improve grammar with interactive exercises',
    arabicDescription: 'حسن القواعد مع تمارين تفاعلية',
    type: 'grammar',
    difficulty: 'intermediate',
    duration: 30,
    completed: true,
    score: 78,
    bestScore: 85,
    attempts: 8,
    category: 'Grammar',
    icon: <Book />,
  },
  {
    id: '5',
    title: 'Vocabulary Builder',
    arabicTitle: 'بناء المفردات',
    description: 'Expand your vocabulary with word games',
    arabicDescription: 'وسع مفرداتك مع ألعاب الكلمات',
    type: 'vocabulary',
    difficulty: 'beginner',
    duration: 18,
    completed: true,
    score: 92,
    bestScore: 95,
    attempts: 3,
    category: 'Vocabulary',
    icon: <Psychology />,
  },
];

const PracticePageSimple: React.FC = () => {
  const [exercises, setExercises] = useState<PracticeExercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<PracticeExercise[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<PracticeExercise | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setExercises(mockExercises);
      setFilteredExercises(mockExercises);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const filtered = exercises.filter(exercise => {
      switch (activeTab) {
        case 0: return true; // All
        case 1: return exercise.type === 'pronunciation' || exercise.type === 'speaking';
        case 2: return exercise.type === 'listening';
        case 3: return exercise.type === 'grammar' || exercise.type === 'vocabulary';
        default: return true;
      }
    });
    setFilteredExercises(filtered);
  }, [exercises, activeTab]);

  const getTypeColor = (type: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' => {
    switch (type) {
      case 'pronunciation': return 'primary';
      case 'listening': return 'secondary';
      case 'speaking': return 'success';
      case 'grammar': return 'warning';
      case 'vocabulary': return 'error';
      default: return 'primary';
    }
  };

  const getDifficultyColor = (difficulty: string): 'success' | 'warning' | 'error' => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'success';
    }
  };

  const getScoreColor = (score: number): 'success' | 'warning' | 'error' => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const handleStartExercise = (exercise: PracticeExercise) => {
    setSelectedExercise(exercise);
    setIsPlaying(true);
    setSessionTime(0);
    console.log('Starting exercise:', exercise.id);
  };

  const handleStopExercise = () => {
    setIsPlaying(false);
    setIsRecording(false);
    setSessionTime(0);
    setSelectedExercise(null);
  };

  const handleRecording = () => {
    setIsRecording(!isRecording);
    console.log('Recording:', !isRecording);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const tabLabels = [
    'الكل',
    'التحدث والنطق',
    'الاستماع',
    'القواعد والمفردات',
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Stack spacing={2} alignItems="center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <Typography variant="h6">جاري تحميل التمارين...</Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          🎯 التدريب والممارسة
        </Typography>
        <Typography variant="body1" color="text.secondary">
          اختر التمرين المناسب لتحسين مهاراتك اللغوية
        </Typography>
      </Box>

      {/* Active Session */}
      {selectedExercise && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.50' }}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {selectedExercise.icon}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedExercise.arabicTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedExercise.arabicDescription}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Timer and Controls */}
            <Stack direction="row" spacing={3} alignItems="center" justifyContent="center">
              <Typography variant="h3" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                {formatTime(sessionTime)}
              </Typography>

              <Stack direction="row" spacing={1}>
                <Button
                  startIcon={isRecording ? <Stop /> : <Mic />}
                  color={isRecording ? 'error' : 'secondary'}
                  onClick={handleRecording}
                  variant={isRecording ? 'contained' : 'outlined'}
                >
                  {isRecording ? 'إيقاف التسجيل' : 'بدء التسجيل'}
                </Button>

                <Button
                  startIcon={<Stop />}
                  color="error"
                  onClick={handleStopExercise}
                  variant="contained"
                >
                  إنهاء التمرين
                </Button>
              </Stack>
            </Stack>

            {/* Progress */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                التقدم: {Math.round((sessionTime / (selectedExercise.duration * 60)) * 100)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(sessionTime / (selectedExercise.duration * 60)) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Stack>
        </Paper>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                <Psychology />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {exercises.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                إجمالي التمارين
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                <CheckCircle />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {exercises.filter(e => e.completed).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                التمارين المكتملة
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                <TrendingUp />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {exercises.reduce((acc, e) => acc + e.attempts, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                إجمالي المحاولات
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2 }}>
                <Star />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {exercises.filter(e => e.completed).length > 0 
                  ? Math.round(exercises.reduce((acc, e) => acc + (e.bestScore || 0), 0) / exercises.filter(e => e.completed).length)
                  : 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                متوسط الدرجات
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Exercises Grid */}
      <Grid container spacing={3}>
        {filteredExercises.map((exercise) => (
          <Grid item xs={12} sm={6} md={4} key={exercise.id}>
            <Card
              sx={{
                opacity: selectedExercise ? 0.6 : 1,
                cursor: selectedExercise ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: selectedExercise ? 'none' : 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => !selectedExercise && handleStartExercise(exercise)}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Avatar sx={{ bgcolor: `${getTypeColor(exercise.type)}.main` }}>
                      {exercise.icon}
                    </Avatar>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={exercise.category}
                        color={getTypeColor(exercise.type)}
                        size="small"
                      />
                      <Chip
                        label={exercise.difficulty}
                        color={getDifficultyColor(exercise.difficulty)}
                        size="small"
                      />
                    </Stack>
                  </Box>

                  {/* Title and Description */}
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {exercise.arabicTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {exercise.arabicDescription}
                    </Typography>
                  </Box>

                  {/* Stats */}
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Timer sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {exercise.duration} دقيقة
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Speed sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {exercise.attempts} محاولة
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Score Progress */}
                  {exercise.completed && exercise.score && (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          آخر درجة: {exercise.score}%
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          أفضل درجة: {exercise.bestScore}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={exercise.score}
                        color={getScoreColor(exercise.score)}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  )}

                  {/* Action Button */}
                  <Button
                    startIcon={selectedExercise?.id === exercise.id ? <Stop /> : <PlayArrow />}
                    color={exercise.completed ? 'success' : 'primary'}
                    onClick={() => !selectedExercise && handleStartExercise(exercise)}
                    disabled={!!selectedExercise}
                    variant={exercise.completed ? 'outlined' : 'contained'}
                    fullWidth
                  >
                    {selectedExercise?.id === exercise.id ? 'جاري التنفيذ...' : exercise.completed ? 'مراجعة' : 'بدء التمرين'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredExercises.length === 0 && (
        <Alert severity="info" sx={{ mt: 4 }}>
          <AlertTitle>لا توجد تمارين</AlertTitle>
          لا توجد تمارين في هذه الفئة حالياً.
        </Alert>
      )}
    </Container>
  );
};

export default PracticePageSimple;
