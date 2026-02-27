// Practice Page
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
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
  Fullscreen,
} from '@mui/icons-material';

// Import design system
import { tokens } from '../design-system/tokens';
import {
  AppCard,
  AppButton,
  AppProgress,
  AppIcon,
  AppAvatar,
  AppChip,
  AppGrid,
} from '../components/ui';

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

export const PracticePage: React.FC = () => {
  const [exercises, setExercises] = useState<PracticeExercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<PracticeExercise[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<PracticeExercise | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setExercises(mockExercises);
      setFilteredExercises(mockExercises);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval !== undefined) {
        clearInterval(interval);
      }
    };
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

  const getTypeColor = (type: string): 'success' | 'warning' | 'error' => {
    switch (type) {
      case 'pronunciation': return 'success';
      case 'listening': return 'warning';
      case 'speaking': return 'error';
      case 'grammar': return 'warning';
      case 'vocabulary': return 'error';
      default: return 'success';
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Stack spacing={2} alignItems="center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <Typography variant="h6">جاري تحميل التمارين...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ p: tokens.spacing.lg }}>
      {/* Header */}
      <Box sx={{ mb: tokens.spacing.xl }}>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: tokens.spacing.md }}>
          🎯 التدريب والممارسة
        </Typography>
        <Typography variant="body1" color="text.secondary">
          اختر التمرين المناسب لتحسين مهاراتك اللغوية
        </Typography>
      </Box>

      {/* Active Session */}
      {selectedExercise && (
        <AppCard sx={{ mb: tokens.spacing.xl, bgcolor: 'primary.50' }}>
          <Stack spacing={tokens.spacing.lg}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={tokens.spacing.md} alignItems="center">
                <AppAvatar color="primary" size="lg">
                  {selectedExercise.icon}
                </AppAvatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedExercise.arabicTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedExercise.arabicDescription}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1}>
                <AppIcon
                  icon={<Refresh />}
                  onClick={() => setSessionTime(0)}
                  ariaLabel="Reset timer"
                />
                <AppIcon
                  icon={<Fullscreen />}
                  onClick={() => console.log('Fullscreen')}
                  ariaLabel="Fullscreen"
                />
              </Stack>
            </Box>

            {/* Timer and Controls */}
            <Stack direction="row" spacing={tokens.spacing.lg} alignItems="center" justifyContent="center">
              <Typography variant="h3" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>
                {formatTime(sessionTime)}
              </Typography>

              <Stack direction="row" spacing={1}>
                <AppButton
                  startIcon={isRecording ? <Stop /> : <Mic />}
                  color={isRecording ? 'error' : 'secondary'}
                  onClick={handleRecording}
                >
                  {isRecording ? 'إيقاف التسجيل' : 'بدء التسجيل'}
                </AppButton>

                <AppButton
                  startIcon={<Stop />}
                  color="error"
                  onClick={handleStopExercise}
                >
                  إنهاء التمرين
                </AppButton>
              </Stack>
            </Stack>

            {/* Progress */}
            <AppProgress
              value={(sessionTime / (selectedExercise.duration * 60)) * 100}
              color="primary"
              showLabel
              label="التقدم"
            />
          </Stack>
        </AppCard>
      )}

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
                <Psychology />
              </AppAvatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {exercises.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                إجمالي التمارين
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
                {exercises.filter(e => e.completed).length}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                التمارين المكتملة
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
                {exercises.reduce((acc, e) => acc + e.attempts, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                إجمالي المحاولات
              </Typography>
            </Stack>
          </AppCard>
        </AppGrid>

        <AppGrid xs={12} sm={6} md={3}>
          <AppCard>
            <Stack spacing={tokens.spacing.md} alignItems="center">
              <AppAvatar color="secondary" size="lg">
                <Star />
              </AppAvatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {Math.round(exercises.reduce((acc, e) => acc + (e.bestScore || 0), 0) / exercises.filter(e => e.completed).length) || 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                متوسط الدرجات
              </Typography>
            </Stack>
          </AppCard>
        </AppGrid>
      </AppGrid>

      {/* Exercises Grid */}
      <AppGrid spacing={tokens.spacing.lg}>
        {filteredExercises.map((exercise) => (
          <AppGrid xs={12} sm={6} md={4} key={exercise.id}>
            <AppCard
              hoverable
              onClick={() => !selectedExercise && handleStartExercise(exercise)}
              sx={{
                opacity: selectedExercise ? 0.6 : 1,
                cursor: selectedExercise ? 'not-allowed' : 'pointer',
              }}
            >
              <Stack spacing={tokens.spacing.md}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <AppAvatar color={getTypeColor(exercise.type)} size="md">
                    {exercise.icon}
                  </AppAvatar>
                  <Stack direction="row" spacing={1}>
                    <AppChip
                      label={exercise.category}
                      color={getTypeColor(exercise.type)}
                      size="small"
                    />
                    <AppChip
                      label={exercise.difficulty}
                      color={getDifficultyColor(exercise.difficulty)}
                      size="small"
                    />
                  </Stack>
                </Box>

                {/* Title and Description */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: tokens.spacing.xs }}>
                    {exercise.arabicTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: tokens.spacing.sm }}>
                    {exercise.arabicDescription}
                  </Typography>
                </Box>

                {/* Stats */}
                <Stack direction="row" spacing={tokens.spacing.md} alignItems="center">
                  <Stack direction="row" spacing={tokens.spacing.xs} alignItems="center">
                    <Timer sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {exercise.duration} دقيقة
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={tokens.spacing.xs} alignItems="center">
                    <Speed sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {exercise.attempts} محاولة
                    </Typography>
                  </Stack>
                </Stack>

                {/* Score Progress */}
                {exercise.completed && exercise.score && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: tokens.spacing.xs }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        آخر درجة: {exercise.score}%
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        أفضل درجة: {exercise.bestScore}%
                      </Typography>
                    </Box>
                    <AppProgress
                      value={exercise.score}
                      color={getScoreColor(exercise.score)}
                      showLabel
                      label="الأداء"
                    />
                  </Box>
                )}

                {/* Action Button */}
                <AppButton
                  startIcon={selectedExercise?.id === exercise.id ? <Stop /> : <PlayArrow />}
                  color={exercise.completed ? 'success' : 'primary'}
                  onClick={() => !selectedExercise && handleStartExercise(exercise)}
                  disabled={!!selectedExercise}
                  fullWidth
                >
                  {selectedExercise?.id === exercise.id ? 'جاري التنفيذ...' : exercise.completed ? 'مراجعة' : 'بدء التمرين'}
                </AppButton>
              </Stack>
            </AppCard>
          </AppGrid>
        ))}
      </AppGrid>

      {filteredExercises.length === 0 && (
        <Alert severity="info" sx={{ mt: tokens.spacing.lg }}>
          <AlertTitle>لا توجد تمارين</AlertTitle>
          لا توجد تمارين في هذه الفئة حالياً.
        </Alert>
      )}
    </Box>
  );
};
