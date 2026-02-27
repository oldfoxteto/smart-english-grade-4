// Placement Test Interface Component
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  IconButton,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Avatar,
  Chip,
  Divider,
  Tooltip,
  Fab,
  Grid,
  CircularProgress,
  Badge
} from '@mui/material';
import {
  NavigateBefore,
  NavigateNext,
  PlayArrow,
  Stop,
  Refresh,
  CheckCircle,
  Error,
  Warning,
  Schedule,
  Assessment,
  Timer,
  VolumeUp,
  Mic,
  MicOff,
  Headphones,
  Book,
  Psychology,
  RecordVoiceOver,
  Language,
  Translate
} from '@mui/icons-material';
import { placementTestQuestions, evaluatePlacementTest, type PlacementQuestion, type PlacementTestResult } from '../../data/placementTest';

export interface PlacementTestUIProps {
  onTestComplete: (result: PlacementTestResult) => void;
  onTestCancel: () => void;
  userId: string;
}

export const PlacementTestUI: React.FC<PlacementTestUIProps> = ({
  onTestComplete,
  onTestCancel,
  userId
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds
  const [isTestActive, setIsTestActive] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [testResult, setTestResult] = useState<PlacementTestResult | null>(null);

  const currentQuestion = placementTestQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / placementTestQuestions.length) * 100;

  const handleTestSubmit = useCallback(() => {
    const result = evaluatePlacementTest(answers);
    result.userId = userId;
    setTestResult(result);
    setIsTestCompleted(true);
    setIsTestActive(false);
    setShowResults(true);
  }, [answers, userId]);

  // Timer effect
  useEffect(() => {
    if (isTestActive && timeLeft > 0 && !isTestCompleted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isTestCompleted) {
      handleTestSubmit();
    }
  }, [timeLeft, isTestActive, isTestCompleted, handleTestSubmit]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [`question_${questionId}`]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < placementTestQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleTestSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleStartTest = () => {
    setShowInstructions(false);
    setIsTestActive(true);
  };

  const handleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/wav' });
          const url = URL.createObjectURL(audioBlob);
          setAudioURL(url);
          // In a real implementation, this would be analyzed
        };

        mediaRecorder.start();
        setIsRecording(true);
        
        // Auto-stop after 30 seconds
        setTimeout(() => {
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            setIsRecording(false);
          }
        }, 30000);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    } else {
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioURL && !isPlaying) {
      const audio = new Audio(audioURL);
      audio.play();
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple_choice': return <Assessment />;
      case 'fill_blank': return <Edit />;
      case 'listening': return <Headphones />;
      case 'reading': return <Book />;
      case 'speaking': return <RecordVoiceOver />;
      case 'grammar': return <Psychology />;
      case 'vocabulary': return <Language />;
      default: return <Help />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'A1': return '#4CAF50';
      case 'A2': return '#8BC34A';
      case 'B1': return '#FF9800';
      case 'B2': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const renderQuestionContent = (question: PlacementQuestion) => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 3, fontWeight: 600 }}>
              {question.arabicQuestion}
            </Typography>
            <RadioGroup
              value={answers[`question_${question.id}`] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            >
              {question.options?.map((option, index) => (
                <Paper key={index} sx={{ mb: 2, p: 2, border: '1px solid #E0E0E0' }}>
                  <FormControlLabel
                    value={option}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          {String.fromCharCode(65 + index)}. {option}
                        </Typography>
                      </Box>
                    }
                    sx={{ width: '100%', margin: 0 }}
                  />
                </Paper>
              ))}
            </RadioGroup>
          </Box>
        );

      case 'fill_blank':
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 3, fontWeight: 600 }}>
              {question.arabicQuestion}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={answers[`question_${question.id}`] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="اكتب إجابتك هنا..."
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Box>
        );

      case 'listening':
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 3, fontWeight: 600 }}>
              {question.arabicQuestion}
            </Typography>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <IconButton
                size="large"
                onClick={playAudio}
                disabled={!audioURL}
                sx={{
                  bgcolor: audioURL ? '#2196F3' : '#E0E0E0',
                  color: 'white',
                  width: 80,
                  height: 80,
                  '&:hover': {
                    bgcolor: audioURL ? '#1976D2' : '#BDBDBD'
                  }
                }}
              >
                {isPlaying ? <VolumeUp /> : <PlayArrow />}
              </IconButton>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {isPlaying ? 'جاري التشغيل...' : 'اضغط للاستماع'}
              </Typography>
            </Box>
            {audioURL && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <audio controls src={audioURL} style={{ width: '100%' }} />
              </Box>
            )}
            {question.options && (
              <RadioGroup
                value={answers[`question_${question.id}`] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              >
                {question.options.map((option, index) => (
                  <Paper key={index} sx={{ mb: 2, p: 2, border: '1px solid #E0E0E0' }}>
                    <FormControlLabel
                      value={option}
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">
                            {String.fromCharCode(65 + index)}. {option}
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', margin: 0 }}
                    />
                  </Paper>
                ))}
              </RadioGroup>
            )}
          </Box>
        );

      case 'reading':
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 3, fontWeight: 600 }}>
              {question.arabicQuestion}
            </Typography>
            <Paper sx={{ p: 3, mb: 3, bgcolor: '#F5F5F5', maxHeight: 300, overflow: 'auto' }}>
              <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                {question.arabicPassage || question.passage}
              </Typography>
            </Paper>
            {question.options && (
              <RadioGroup
                value={answers[`question_${question.id}`] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              >
                {question.options.map((option, index) => (
                  <Paper key={index} sx={{ mb: 2, p: 2, border: '1px solid #E0E0E0' }}>
                    <FormControlLabel
                      value={option}
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">
                            {String.fromCharCode(65 + index)}. {option}
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', margin: 0 }}
                    />
                  </Paper>
                ))}
              </RadioGroup>
            )}
          </Box>
        );

      case 'speaking':
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 3, fontWeight: 600 }}>
              {question.arabicQuestion}
            </Typography>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <IconButton
                size="large"
                onClick={handleRecording}
                sx={{
                  bgcolor: isRecording ? '#F44336' : '#4CAF50',
                  color: 'white',
                  width: 80,
                  height: 80,
                  '&:hover': {
                    bgcolor: isRecording ? '#D32F2F' : '#45A049'
                  }
                }}
              >
                {isRecording ? <MicOff /> : <Mic />}
              </IconButton>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {isRecording ? 'جاري التسجيل...' : 'اضغط للتسجيل'}
              </Typography>
              {isRecording && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="indeterminate"
                    sx={{ width: 200, mx: 'auto' }}
                  />
                </Box>
              )}
            </Box>
            {audioURL && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <audio controls src={audioURL} style={{ width: '100%' }} />
              </Box>
            )}
          </Box>
        );

      default:
        return (
          <Typography variant="body1">
            نوع السؤال غير مدعوم
          </Typography>
        );
    }
  };

  if (showInstructions) {
    return (
      <Dialog open maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            📋 تعليمات اختبار تحديد المستوى
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            <AlertTitle>معلومات هامة</AlertTitle>
            هذا الاختبار سيحدد مستواك الحالي في اللغة الإنجليزية. يرجى الإجابة بصدق ودون مساعدة خارجية.
          </Alert>
          
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
            📝 تعليمات الاختبار:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• مدة الاختبار: 45 دقيقة" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• عدد الأسئلة: 26 سؤال" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• أنواع الأسئلة: قواعد، مفردات، استماع، قراءة، نطق" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• لا يمكنك العودة للسؤال السابق بعد الإجابة" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• سيتم تقييم إجاباتك تلقائياً" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• النتائج ستظهر فوراً بعد الانتهاء" />
            </ListItem>
          </List>
          
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
            🎯 نصائح للنجاح:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• اقرأ كل سؤال بعناية" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• استمع جيداً لأسئلة الاستماع" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• أجب باللغة الإنجليزية قدر الإمكان" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• لا تترك أي سؤال بدون إجابة" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onTestCancel} color="error">
            إلغاء
          </Button>
          <Button onClick={handleStartTest} variant="contained" startIcon={<PlayArrow />}>
            ابدأ الاختبار
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  if (showResults && testResult) {
    return (
      <Dialog open maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            🎉 نتائج اختبار تحديد المستوى
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: '#4CAF50',
                width: 80,
                height: 80,
                mb: 2
              }}
            >
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 900 }}>
                {testResult.level}
              </Typography>
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              مستواك: {testResult.level}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {testResult.correctAnswers} / {testResult.totalQuestions} إجابة صحيحة
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(testResult.correctAnswers / testResult.totalQuestions) * 100}
              sx={{ width: 200, mx: 'auto', mb: 2 }}
            />
          </Box>
          
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            📊 النتائج حسب الفئة:
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  القواعد
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#2196F3' }}>
                  {testResult.categoryScores.grammar}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  المفردات
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#4CAF50' }}>
                  {testResult.categoryScores.vocabulary}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  الاستماع
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#FF9800' }}>
                  {testResult.categoryScores.listening}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  القراءة
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#9C27B0' }}>
                  {testResult.categoryScores.reading}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  النطق
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#F44336' }}>
                  {testResult.categoryScores.speaking}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>توصيات للتحسين</AlertTitle>
            <List dense>
              {testResult.arabicRecommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onTestCancel}>
            إغلاق
          </Button>
          <Button onClick={() => onTestComplete(testResult)} variant="contained" color="primary">
            متابعة للتعلم
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, p: 0, overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', bgcolor: '#F8F9FA' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: getDifficultyColor(currentQuestion.difficulty) }}>
                {getQuestionTypeIcon(currentQuestion.type)}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  السؤال {currentQuestionIndex + 1} / {placementTestQuestions.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentQuestion.type === 'multiple_choice' ? 'اختيار من متعدد' :
                   currentQuestion.type === 'fill_blank' ? 'ملء فراغات' :
                   currentQuestion.type === 'listening' ? 'استماع' :
                   currentQuestion.type === 'reading' ? 'قراءة' :
                   currentQuestion.type === 'speaking' ? 'نطق' : currentQuestion.type}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                icon={<Timer />}
                label={formatTime(timeLeft)}
                color={timeLeft < 300 ? 'error' : 'default'}
                sx={{ fontWeight: 700 }}
              />
              <Chip
                label={currentQuestion.difficulty}
                sx={{ 
                  bgcolor: getDifficultyColor(currentQuestion.difficulty),
                  color: 'white',
                  fontWeight: 600
                }}
              />
            </Box>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mt: 2, height: 8, borderRadius: 4 }}
          />
        </Box>

        {/* Question Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {currentQuestion.timeLimit && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <AlertTitle>الوقت المحدد للسؤال</AlertTitle>
              لديك {currentQuestion.timeLimit} ثانية للإجابة على هذا السؤال
            </Alert>
          )}
          
          {renderQuestionContent(currentQuestion)}
        </Box>

        {/* Navigation */}
        <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider', bgcolor: '#F8F9FA' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<NavigateBefore />}
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              السابق
            </Button>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => handleAnswerChange(currentQuestion.id, '')}
              >
                مسح الإجابة
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Warning />}
                onClick={onTestCancel}
                color="error"
              >
                إلغاء الاختبار
              </Button>
            </Box>
            
            <Button
              variant="contained"
              endIcon={currentQuestionIndex === placementTestQuestions.length - 1 ? <CheckCircle /> : <NavigateNext />}
              onClick={handleNextQuestion}
              disabled={!answers[`question_${currentQuestion.id}`]}
            >
              {currentQuestionIndex === placementTestQuestions.length - 1 ? 'إنهاء الاختبار' : 'التالي'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
