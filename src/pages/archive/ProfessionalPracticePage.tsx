// Professional Practice Page with Full Functionality
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
  Tabs,
  Tab,
  Paper,
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
} from '@mui/material';
import {
  Psychology,
  RecordVoiceOver,
  Mic,
  MicOff,
  Headphones,
  VolumeUp,
  VolumeOff,
  Book,
  Timer,
  PlayArrow,
  Pause,
  Stop,
  Refresh,
  CheckCircle,
  Star,
  TrendingUp,
  Speed,
  Settings,
  Fullscreen,
  FullscreenExit,
  Close,
  Download,
  Share,
  Favorite,
  FavoriteBorder,
  School,
  EmojiEvents,
  Leaderboard,
  Analytics,
  VolumeUp as VolumeIcon,
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
  isFavorite?: boolean;
  xpReward: number;
  unlockLevel: number;
}

interface SessionStats {
  startTime: Date;
  exercisesCompleted: number;
  totalTime: number;
  averageScore: number;
  xpGained: number;
  streak: number;
}

// Enhanced Mock Data
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
    isFavorite: true,
    xpReward: 50,
    unlockLevel: 5,
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
    isFavorite: false,
    xpReward: 40,
    unlockLevel: 1,
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
    isFavorite: false,
    xpReward: 60,
    unlockLevel: 10,
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
    isFavorite: true,
    xpReward: 45,
    unlockLevel: 3,
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
    isFavorite: false,
    xpReward: 35,
    unlockLevel: 1,
  },
];

const ProfessionalPracticePage: React.FC = () => {
  const [exercises, setExercises] = useState<PracticeExercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<PracticeExercise[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<PracticeExercise | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    startTime: new Date(),
    exercisesCompleted: 0,
    totalTime: 0,
    averageScore: 0,
    xpGained: 0,
    streak: 0,
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setTimeout(() => {
      setExercises(mockExercises);
      setFilteredExercises(mockExercises);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
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
    if (exercise.unlockLevel > 12) {
      alert('هذا التمرين يتطلب مستوى أعلى!');
      return;
    }
    setSelectedExercise(exercise);
    setIsPlaying(true);
    setSessionTime(0);
    playSound('start');
    console.log('Starting exercise:', exercise.id);
  };

  const handleStopExercise = () => {
    setIsPlaying(false);
    setIsRecording(false);
    setSessionTime(0);
    setSelectedExercise(null);
    playSound('stop');
  };

  const handleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      playSound('record');
    } else {
      playSound('stop');
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleFavoriteToggle = (exerciseId: string) => {
    setExercises(prev => prev.map(ex => 
      ex.id === exerciseId ? { ...ex, isFavorite: !ex.isFavorite } : ex
    ));
  };

  const handleShare = (exercise: PracticeExercise) => {
    if (navigator.share) {
      navigator.share({
        title: exercise.arabicTitle,
        text: exercise.arabicDescription,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط!');
    }
  };

  const playSound = (type: 'start' | 'stop' | 'record' | 'complete') => {
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'start':
        oscillator.frequency.value = 523.25; // C5
        gainNode.gain.value = 0.1;
        break;
      case 'stop':
        oscillator.frequency.value = 261.63; // C4
        gainNode.gain.value = 0.1;
        break;
      case 'record':
        oscillator.frequency.value = 440; // A4
        gainNode.gain.value = 0.05;
        break;
      case 'complete':
        oscillator.frequency.value = 659.25; // E5
        gainNode.gain.value = 0.1;
        break;
    }
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
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
          <Stack spacing={3} alignItems="center">
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6">جاري تحميل التمارين...</Typography>
            <Typography variant="body2" color="text.secondary">
              يتم تحميل أفضل التمارين لك
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

      {/* Header with Stats */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            🎯 التدريب والممارسة
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
          اختر التمرين المناسب لتحسين مهاراتك اللغوية | {sessionStats.xpGained} XP مكتسب اليوم
        </Typography>
      </Box>

      {/* Active Session Dialog */}
      {selectedExercise && (
        <Dialog open={true} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: getTypeColor(selectedExercise.type).main }}>
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
            </Stack>
            <IconButton onClick={handleStopExercise}>
              <Close />
            </IconButton>
          </DialogTitle>
          
          <DialogContent>
            <Stack spacing={3}>
              {/* Timer Display */}
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h2" sx={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'primary.main' }}>
                  {formatTime(sessionTime)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  من {selectedExercise.duration} دقيقة
                </Typography>
              </Box>

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

              {/* Recording Indicator */}
              {isRecording && (
                <Alert severity="info">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <div className="animate-pulse">
                      <Mic sx={{ color: 'error.main' }} />
                    </div>
                    <Typography>جاري التسجيل...</Typography>
                  </Stack>
                </Alert>
              )}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3, gap: 2 }}>
            {/* Volume Control */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 'auto' }}>
              <IconButton onClick={handleMuteToggle} color={isMuted ? 'error' : 'default'}>
                {isMuted ? <VolumeOff /> : <VolumeUp />}
              </IconButton>
              <Box sx={{ width: 100 }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </Box>
              <Typography variant="caption">{volume}%</Typography>
            </Stack>

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
          </DialogActions>
        </Dialog>
      )}

      {/* Enhanced Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ position: 'relative', overflow: 'visible' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Badge badgeContent={exercises.filter(e => !e.completed).length} color="error">
                <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                  <Psychology />
                </Avatar>
              </Badge>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {exercises.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                إجمالي التمارين
              </Typography>
              <Typography variant="caption" color="primary">
                +{exercises.filter(e => !e.completed).length} جديد
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
                {exercises.filter(e => e.completed).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                التمارين المكتملة
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(exercises.filter(e => e.completed).length / exercises.length) * 100}
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
                {exercises.reduce((acc, e) => acc + e.attempts, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                إجمالي المحاولات
              </Typography>
              <Typography variant="caption" color="success.main">
                +{sessionStats.streak} متتالي
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
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
              <Typography variant="caption" color="warning.main">
                {sessionStats.xpGained} XP اليوم
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

      {/* Enhanced Exercise Cards */}
      <Grid container spacing={3}>
        {filteredExercises.map((exercise) => (
          <Grid item xs={12} sm={6} md={4} key={exercise.id}>
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
                onClick={() => handleFavoriteToggle(exercise.id)}
                color={exercise.isFavorite ? 'error' : 'default'}
              >
                {exercise.isFavorite ? <Favorite /> : <FavoriteBorder />}
              </IconButton>

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
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
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
                    <Stack direction="row" spacing={1} alignItems="center">
                      <School sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {exercise.xpReward} XP
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

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={1}>
                    <Button
                      startIcon={<PlayArrow />}
                      color={exercise.completed ? 'success' : 'primary'}
                      onClick={() => handleStartExercise(exercise)}
                      disabled={!!selectedExercise}
                      variant={exercise.completed ? 'outlined' : 'contained'}
                      fullWidth
                    >
                      {exercise.completed ? 'مراجعة' : 'بدء التمرين'}
                    </Button>
                    <IconButton
                      onClick={() => handleShare(exercise)}
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

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => setShowResults(true)}
      >
        <Analytics />
      </Fab>

      {filteredExercises.length === 0 && (
        <Alert severity="info" sx={{ mt: 4 }}>
          <AlertTitle>لا توجد تمارين</AlertTitle>
          لا توجد تمارين في هذه الفئة حالياً.
        </Alert>
      )}
    </Container>
  );
};

export default ProfessionalPracticePage;
