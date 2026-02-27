// Interactive Exercise Generator with AI
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Avatar,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,
  CircularProgress,
} from '@mui/material';
import {
  Quiz,
  Psychology,
  School,
  Speed,
  Timer,
  CheckCircle,
  Error,
  Warning,
  Refresh,
  PlayArrow,
  Stop,
  VolumeUp,
  VolumeOff,
  Mic,
  MicOff,
  Translate,
  Spellcheck,
  RecordVoiceOver,
  Hearing,
  Visibility,
  VisibilityOff,
  AutoAwesome,
  Lightbulb,
  Star,
  TrendingUp,
  EmojiEvents,
  LocalFireDepartment,
} from '@mui/icons-material';

interface ExerciseTemplate {
  id: string;
  type: 'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'reading' | 'writing';
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  aiFeatures: string[];
  icon: React.ReactNode;
}

interface GeneratedExercise {
  id: string;
  templateId: string;
  type: string;
  title: string;
  content: any;
  questions: any[];
  aiGenerated: boolean;
  difficulty: string;
  estimatedTime: number;
  xpReward: number;
}

const exerciseTemplates: ExerciseTemplate[] = [
  {
    id: '1',
    type: 'vocabulary',
    title: 'AI Vocabulary Builder',
    arabicTitle: 'منشئ المفردات بالذكاء الاصطناعي',
    description: 'Generate personalized vocabulary exercises based on your level',
    arabicDescription: 'توليد تمارين مفردات مخصصة حسب مستواك',
    difficulty: 'intermediate',
    estimatedTime: 10,
    aiFeatures: ['Adaptive difficulty', 'Contextual examples', 'Personalized words'],
    icon: <Spellcheck />
  },
  {
    id: '2',
    type: 'grammar',
    title: 'Smart Grammar Practice',
    arabicTitle: 'تمرين القواعد الذكي',
    description: 'AI-powered grammar exercises with instant feedback',
    arabicDescription: 'تمارين قواعد مدعومة بالذكاء الاصطناعي مع تغذية راجعة فورية',
    difficulty: 'intermediate',
    estimatedTime: 15,
    aiFeatures: ['Error detection', 'Explanations', 'Progressive difficulty'],
    icon: <School />
  },
  {
    id: '3',
    type: 'listening',
    title: 'Adaptive Listening Comprehension',
    arabicTitle: 'فهم الاستماع التكيفي',
    description: 'AI-generated listening materials that adapt to your level',
    arabicDescription: 'مواد استماعية مولدة بالذكاء الاصطناعي تتكيف مع مستواك',
    difficulty: 'intermediate',
    estimatedTime: 20,
    aiFeatures: ['Speed adaptation', 'Content personalization', 'Comprehension analysis'],
    icon: <Hearing />
  },
  {
    id: '4',
    type: 'speaking',
    title: 'AI Speech Coach',
    arabicTitle: 'مدرب النطق بالذكاء الاصطناعي',
    description: 'Practice speaking with real-time AI pronunciation feedback',
    arabicDescription: 'تدرب على التحدث مع تغذية راجعة فورية للنطق بالذكاء الاصطناعي',
    difficulty: 'advanced',
    estimatedTime: 15,
    aiFeatures: ['Pronunciation scoring', 'Fluency analysis', 'Accent training'],
    icon: <RecordVoiceOver />
  }
];

const InteractiveExerciseGenerator: React.FC = () => {
  const [templates, setTemplates] = useState<ExerciseTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ExerciseTemplate | null>(null);
  const [generatedExercises, setGeneratedExercises] = useState<GeneratedExercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<GeneratedExercise | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userLevel, setUserLevel] = useState('intermediate');
  const [exerciseCount, setExerciseCount] = useState(5);
  const [focusTopics, setFocusTopics] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [exerciseProgress, setExerciseProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTemplates(exerciseTemplates);
      setLoading(false);
    }, 1000);
  }, []);

  const handleGenerateExercise = async (template: ExerciseTemplate) => {
    setSelectedTemplate(template);
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const newExercise: GeneratedExercise = {
        id: Date.now().toString(),
        templateId: template.id,
        type: template.type,
        title: `AI Generated ${template.title}`,
        content: generateExerciseContent(template),
        questions: generateQuestions(template),
        aiGenerated: true,
        difficulty: userLevel,
        estimatedTime: template.estimatedTime,
        xpReward: 50 + Math.floor(Math.random() * 50)
      };
      
      setGeneratedExercises(prev => [...prev, newExercise]);
      setCurrentExercise(newExercise);
      setIsGenerating(false);
    }, 2000);
  };

  const generateExerciseContent = (template: ExerciseTemplate) => {
    switch (template.type) {
      case 'vocabulary':
        return {
          words: [
            { word: 'innovative', translation: 'مبتكر', example: 'This is an innovative solution.' },
            { word: 'comprehensive', translation: 'شامل', example: 'We need a comprehensive plan.' },
            { word: 'efficient', translation: 'كفء', example: 'The new system is more efficient.' }
          ],
          instructions: 'Match each word with its correct translation and example.'
        };
      case 'grammar':
        return {
          sentences: [
            { sentence: 'She ___ to school every day.', options: ['go', 'goes', 'going', 'went'], correct: 1 },
            { sentence: 'They ___ playing football now.', options: ['is', 'are', 'was', 'were'], correct: 1 }
          ],
          instructions: 'Choose the correct verb form for each sentence.'
        };
      default:
        return { instructions: 'Complete the exercise below.' };
    }
  };

  const generateQuestions = (template: ExerciseTemplate) => {
    return [
      {
        id: '1',
        question: 'What is the main purpose of this exercise?',
        options: ['Practice vocabulary', 'Learn grammar', 'Improve listening', 'Enhance speaking'],
        correct: 0
      }
    ];
  };

  const handleStartExercise = (exercise: GeneratedExercise) => {
    setCurrentExercise(exercise);
    setExerciseProgress(0);
    setScore(0);
    setShowResults(false);
  };

  const handleAnswerSubmit = (answer: any) => {
    // Simulate answer processing
    const isCorrect = Math.random() > 0.3;
    if (isCorrect) {
      setScore(prev => prev + 10);
    }
    setExerciseProgress(prev => Math.min(prev + 20, 100));
    
    if (exerciseProgress >= 80) {
      setShowResults(true);
    }
  };

  const handleRegenerateExercise = () => {
    if (selectedTemplate) {
      handleGenerateExercise(selectedTemplate);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'primary';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        🎯 منشئ التمارين التفاعلي بالذكاء الاصطناعي
      </Typography>

      {/* Configuration Panel */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          ⚙️ إعدادات التمرين
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>المستوى</InputLabel>
              <Select
                value={userLevel}
                label="المستوى"
                onChange={(e) => setUserLevel(e.target.value)}
              >
                <MenuItem value="beginner">مبتدئ</MenuItem>
                <MenuItem value="intermediate">متوسط</MenuItem>
                <MenuItem value="advanced">متقدم</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>عدد التمارين</InputLabel>
              <Select
                value={exerciseCount}
                label="عدد التمارين"
                onChange={(e) => setExerciseCount(Number(e.target.value))}
              >
                <MenuItem value={3}>3 تمارين</MenuItem>
                <MenuItem value={5}>5 تمارين</MenuItem>
                <MenuItem value={10}>10 تمارين</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="مواضيع التركيز (اختياري)"
              placeholder="مثال: الأعمال، السفر، التكنولوجيا"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Exercise Templates */}
      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 8,
                }
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {template.icon}
                    </Avatar>
                    <Stack direction="row" spacing={1}>
                      <Chip label={template.difficulty} color={getDifficultyColor(template.difficulty)} size="small" />
                      <Chip label={`${template.estimatedTime} دقيقة`} size="small" />
                    </Stack>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {template.arabicTitle}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    {template.arabicDescription}
                  </Typography>

                  {/* AI Features */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      🤖 ميزات الذكاء الاصطناعي:
                    </Typography>
                    <Stack spacing={0.5}>
                      {template.aiFeatures.map((feature, index) => (
                        <Typography key={index} variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AutoAwesome sx={{ fontSize: 12, color: 'primary.main' }} />
                          {feature}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>

                  <Button
                    startIcon={<Psychology />}
                    onClick={() => handleGenerateExercise(template)}
                    disabled={isGenerating}
                    variant="contained"
                    fullWidth
                  >
                    {isGenerating && selectedTemplate?.id === template.id ? (
                      <>
                        <CircularProgress size={16} sx={{ mr: 1 }} />
                        جاري التوليد...
                      </>
                    ) : (
                      'توليد تمرين'
                    )}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Generated Exercises */}
      {generatedExercises.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            📝 التمارين المولدة
          </Typography>
          <Grid container spacing={2}>
            {generatedExercises.map((exercise) => (
              <Grid item xs={12} sm={6} md={4} key={exercise.id}>
                <Card sx={{ bgcolor: 'success.50', border: '2px solid', borderColor: 'success.main' }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {exercise.title}
                        </Typography>
                        <Chip label="AI Generated" color="success" size="small" />
                      </Box>
                      
                      <Typography variant="body2">
                        🎁 {exercise.xpReward} XP • {exercise.estimatedTime} دقيقة
                      </Typography>
                      
                      <Stack direction="row" spacing={1}>
                        <Button
                          startIcon={<PlayArrow />}
                          onClick={() => handleStartExercise(exercise)}
                          variant="contained"
                          size="small"
                          fullWidth
                        >
                          بدء
                        </Button>
                        <IconButton onClick={handleRegenerateExercise} size="small">
                          <Refresh />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Current Exercise Dialog */}
      {currentExercise && (
        <Dialog open={true} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">{currentExercise.title}</Typography>
              <Stack direction="row" spacing={1}>
                <Chip label={`${currentExercise.xpReward} XP`} color="primary" />
                <Chip label={currentExercise.difficulty} color={getDifficultyColor(currentExercise.difficulty)} />
              </Stack>
            </Box>
          </DialogTitle>
          
          <DialogContent>
            <Stack spacing={3}>
              {/* Progress */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  التقدم: {exerciseProgress}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={exerciseProgress}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              {/* Exercise Content */}
              <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  📋 التعليمات
                </Typography>
                <Typography variant="body1">
                  {currentExercise.content?.instructions || 'Complete the exercise below.'}
                </Typography>

                {/* Sample Exercise Content */}
                {currentExercise.type === 'vocabulary' && currentExercise.content?.words && (
                  <Box sx={{ mt: 3 }}>
                    {currentExercise.content.words.map((word: any, index: number) => (
                      <Card key={index} sx={{ mb: 2, p: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {word.word}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {word.example}
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="اكتب الترجمة هنا..."
                          sx={{ mt: 1 }}
                        />
                      </Card>
                    ))}
                  </Box>
                )}
              </Paper>

              {/* Score Display */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  🎯 النتيجة: {score}
                </Typography>
              </Box>
            </Stack>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={() => setCurrentExercise(null)}>
              إغلاق
            </Button>
            <Button
              onClick={() => handleAnswerSubmit(null)}
              variant="contained"
              color="primary"
            >
              إرسال الإجابة
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Results Alert */}
      {showResults && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <AlertTitle>🎉 مبروك!</AlertTitle>
          لقد أكملت التمرين بنجاح! حصلت على {score} نقطة و {currentExercise?.xpReward} XP.
        </Alert>
      )}
    </Box>
  );
};

export default InteractiveExerciseGenerator;
