import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  TextField,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowBack,
  ArrowForward,
  VolumeUp,
  CheckCircle,
  PlayArrow,
  Refresh,
} from '@mui/icons-material';
import { 
  getA1LessonById, 
  type A1Lesson, 
  type Exercise 
} from '../core/a1Content';
import { playSuccess, playClick } from '../core/sounds';

const LessonPage = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();
  
  const [lesson, setLesson] = useState<A1Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | number>>({});
  const [showResult, setShowResult] = useState(false);
  const [exerciseResults, setExerciseResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (lessonId) {
      const lessonData = getA1LessonById(lessonId);
      setLesson(lessonData || null);
      setLoading(false);
    }
  }, [lessonId]);

  const handleCompleteStep = () => {
    playClick();
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleExerciseAnswer = (exerciseId: string, answer: string | number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [exerciseId]: answer,
    });
  };

  const checkExerciseAnswer = (exercise: Exercise): boolean => {
    const userAnswer = selectedAnswers[exercise.id];
    return userAnswer === exercise.correctAnswer;
  };

  const handleSubmitExercises = () => {
    if (!lesson?.exercises) return;

    const results: Record<string, boolean> = {};
    lesson.exercises.forEach(exercise => {
      results[exercise.id] = checkExerciseAnswer(exercise);
    });
    setExerciseResults(results);
    setShowResult(true);
    
    // Play sound based on correctness
    const correctCount = Object.values(results).filter(r => r).length;
    if (correctCount === lesson.exercises.length) {
      playSuccess();
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const resetExercises = () => {
    setSelectedAnswers({});
    setExerciseResults({});
    setShowResult(false);
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 0: return '📚';
      case 1: return '📝';
      case 2: return '✏️';
      default: return '📖';
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 0: return 'المفردات';
      case 1: return 'القواعد';
      case 2: return 'التمارين';
      default: return '';
    }
  };

  const progress = lesson ? ((completedSteps.length) / 3) * 100 : 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography variant="h6">جاري تحميل الدرس...</Typography>
      </Box>
    );
  }

  if (!lesson) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          الدرس غير موجود
        </Typography>
        <Button variant="contained" onClick={() => navigate('/home')}>
          العودة للرئيسية
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 6, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0B4B88 0%, #0C7FA0 60%, #7BC8A4 100%)', 
        py: { xs: 3, md: 4 }, 
        px: { xs: 2, md: 3 }, 
        mb: 4, 
        textAlign: 'center' 
      }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/home')}
          sx={{ 
            position: 'absolute', 
            right: 20, 
            top: 20,
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            '&:hover': {
              background: 'rgba(255,255,255,0.3)',
            }
          }}
        >
          العودة
        </Button>
        
        <Typography variant="h3" sx={{ 
          color: 'white', 
          fontWeight: 800, 
          mb: 1, 
          fontSize: { xs: '1.8rem', md: '2.5rem' } 
        }}>
          {lesson.titleAr}
        </Typography>
        <Typography variant="h6" sx={{ 
          color: 'rgba(255,255,255,0.9)', 
          fontSize: { xs: '0.95rem', md: '1.1rem' } 
        }}>
          {lesson.title}
        </Typography>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Chip 
            label={`الوحدة ${lesson.unit}`} 
            sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }} 
          />
          <Chip 
            label={lesson.level} 
            sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }} 
          />
          <Chip 
            label={`${lesson.duration} دقيقة`} 
            sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }} 
          />
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
        {/* Progress */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                تقدم الدرس
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {Math.round(progress)}% مكتمل
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 10,
                borderRadius: 5,
                background: '#E3F2FD',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #0B4B88, #2979C1)',
                  borderRadius: 5,
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Stepper */}
        <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
          {[0, 1, 2].map((step) => (
            <Step key={step} completed={completedSteps.includes(step)}>
              <StepLabel icon={getStepIcon(step)}>
                {getStepTitle(step)}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        {currentStep === 0 && lesson.vocabulary && (
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                📚 المفردات الجديدة
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                {lesson.vocabulary.map((item, index) => (
                  <Card variant="outlined" sx={{ height: '100%' }} key={index}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          {item.word}
                        </Typography>
                        <IconButton 
                          onClick={() => speakText(item.word)}
                          size="small"
                          sx={{ color: '#0B4B88' }}
                        >
                          <VolumeUp />
                        </IconButton>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {item.pronunciation}
                      </Typography>
                      
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0B4B88', mb: 1 }}>
                        {item.translation}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic' }}>
                        "{item.example}"
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        {item.exampleTranslation}
                      </Typography>
                      
                      <Chip 
                        label={item.category} 
                        size="small" 
                        sx={{ mt: 1, background: '#E3F2FD', color: '#0B4B88' }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Box>
              
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleCompleteStep}
                  sx={{
                    background: 'linear-gradient(135deg, #0B4B88, #2979C1)',
                    px: 4,
                  }}
                >
                  التالي
                  <ArrowForward sx={{ mr: 1 }} />
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {currentStep === 1 && lesson.grammar && (
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                📝 القاعدة النحوية
              </Typography>
              
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0B4B88', mb: 2 }}>
                {lesson.grammar.titleAr}
              </Typography>
              
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                {lesson.grammar.title}
              </Typography>
              
              <Box sx={{ 
                background: '#F8FAFB', 
                p: 2, 
                borderRadius: 2, 
                mb: 3 
              }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {lesson.grammar.explanationAr}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {lesson.grammar.explanation}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                  {lesson.grammar.formula}
                </Typography>
              </Box>
              
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                أمثلة:
              </Typography>
              
              {lesson.grammar.examples.map((example, index) => (
                <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <Box component="span" sx={{ 
                        background: '#FFE0B2', 
                        px: 1, 
                        borderRadius: 1,
                        fontWeight: 700
                      }}>
                        {example.highlight}
                      </Box>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {example.translation}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
              
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleCompleteStep}
                  sx={{
                    background: 'linear-gradient(135deg, #0B4B88, #2979C1)',
                    px: 4,
                  }}
                >
                  التالي
                  <ArrowForward sx={{ mr: 1 }} />
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && lesson.exercises && (
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                ✏️ تمارين الدرس
              </Typography>
              
              {lesson.exercises.map((exercise, index) => (
                <Card key={exercise.id} variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                      التمرين {index + 1}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {exercise.questionAr}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {exercise.question}
                    </Typography>
                    
                    {exercise.type === 'multiple-choice' && exercise.options && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {exercise.options.map((option, optIndex) => (
                          <Box key={optIndex} sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' } }}>
                            <Button
                              fullWidth
                              variant={selectedAnswers[exercise.id] === optIndex ? "contained" : "outlined"}
                              onClick={() => handleExerciseAnswer(exercise.id, optIndex)}
                              sx={{
                                textAlign: 'right',
                                justifyContent: 'flex-start',
                                p: 2,
                                background: selectedAnswers[exercise.id] === optIndex ? '#E3F2FD' : 'white',
                                borderColor: selectedAnswers[exercise.id] === optIndex ? '#0B4B88' : '#E0E0E0',
                                color: selectedAnswers[exercise.id] === optIndex ? '#0B4B88' : 'text.primary',
                              }}
                            >
                              {option}
                            </Button>
                          </Box>
                        ))}
                      </Box>
                    )}
                    
                    {exercise.type === 'fill-blank' && (
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={selectedAnswers[exercise.id] as string || ''}
                        onChange={(e) => handleExerciseAnswer(exercise.id, e.target.value)}
                        placeholder="اكتب إجابتك هنا..."
                        sx={{ mt: 2 }}
                      />
                    )}
                    
                    {showResult && exerciseResults[exercise.id] !== undefined && (
                      <Alert 
                        severity={exerciseResults[exercise.id] ? "success" : "error"} 
                        sx={{ mt: 2 }}
                      >
                        {exerciseResults[exercise.id] ? "إجابة صحيحة!" : "إجابة خاطئة"}
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {exercise.explanationAr}
                        </Typography>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
                {!showResult ? (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSubmitExercises}
                    disabled={Object.keys(selectedAnswers).length !== lesson.exercises.length}
                    sx={{
                      background: 'linear-gradient(135deg, #0B4B88, #2979C1)',
                      px: 4,
                    }}
                  >
                    <CheckCircle sx={{ mr: 1 }} />
                    تصحيح الإجابات
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={resetExercises}
                      startIcon={<Refresh />}
                    >
                      إعادة المحاولة
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/home')}
                      sx={{
                        background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
                        px: 4,
                      }}
                    >
                      <PlayArrow sx={{ mr: 1 }} />
                      إنهاء الدرس
                    </Button>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default LessonPage;