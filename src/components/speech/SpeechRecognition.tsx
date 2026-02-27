// Speech Recognition and Pronunciation System
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Chip,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Badge,
  Fab,
  Grid,
  Switch,
  FormControlLabel,
  Slider,
  TextField,
  CircularProgress
} from '@mui/material';
import {
  Mic,
  MicOff,
  VolumeUp,
  VolumeOff,
  Settings,
  PlayArrow,
  Stop,
  Replay,
  CheckCircle,
  Error,
  Warning,
  Speed,
  RecordVoiceOver,
  Hearing,
  Language,
  Translate,
  Psychology,
  School,
  Star,
  Refresh,
  Download,
  Upload
} from '@mui/icons-material';

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  timestamp: Date;
  isFinal: boolean;
}

export interface PronunciationScore {
  word: string;
  score: number;
  feedback: string;
  arabicFeedback: string;
  improvements: string[];
  arabicImprovements: string[];
}

export interface SpeechSettings {
  language: string;
  accent: string;
  speed: number;
  pitch: number;
  volume: number;
  autoDetect: boolean;
  continuousMode: boolean;
  confidenceThreshold: number;
}

export interface PronunciationPractice {
  id: string;
  word: string;
  arabicWord: string;
  phonetic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  attempts: PronunciationScore[];
  bestScore?: PronunciationScore;
  mastered: boolean;
}

// Speech Recognition Hook
export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check browser support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript + interimTranscript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      setIsSupported(true);
    } else {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser');
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript('');
      setError(null);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript
  };
};

// Pronunciation Analysis Hook
export const usePronunciationAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [score, setScore] = useState<PronunciationScore | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const analyzePronunciation = useCallback(async (targetWord: string, audioBlob: Blob) => {
    setIsAnalyzing(true);
    
    try {
      // Simulate pronunciation analysis
      // In a real implementation, this would call a speech analysis API
      const mockScore = Math.random() * 100;
      const feedback = mockScore > 80 ? 'Excellent!' : 
                     mockScore > 60 ? 'Good!' : 
                     mockScore > 40 ? 'Fair' : 'Keep practicing!';
      
      const arabicFeedback = mockScore > 80 ? 'ممتاز!' : 
                           mockScore > 60 ? 'جيد!' : 
                           mockScore > 40 ? 'مقبول' : 'استمر في الممارسة!';
      
      const improvements = mockScore < 80 ? [
        'Try to speak more clearly',
        'Focus on the correct pronunciation',
        'Practice the individual sounds'
      ] : [];
      
      const arabicImprovements = mockScore < 80 ? [
        'حاول التحدث بوضوح أكثر',
        'ركز على النطق الصحيح',
        'مارس الأصوات الفردية'
      ] : [];

      const result: PronunciationScore = {
        word: targetWord,
        score: mockScore,
        feedback,
        arabicFeedback,
        improvements,
        arabicImprovements
      };

      setScore(result);
      
      // Store audio for playback
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      
    } catch (error) {
      console.error('Pronunciation analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const startRecording = useCallback(async () => {
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
        // This would be analyzed in a real implementation
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  return {
    isAnalyzing,
    score,
    audioURL,
    startRecording,
    stopRecording,
    analyzePronunciation
  };
};

// Speech Recognition Component
export const SpeechRecognitionComponent: React.FC<{
  onTranscript: (transcript: string) => void;
  settings: SpeechSettings;
}> = ({ onTranscript, settings }) => {
  const {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition();

  const [volume, setVolume] = useState(0);

  useEffect(() => {
    onTranscript(transcript);
  }, [transcript, onTranscript]);

  if (!isSupported) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        <AlertTitle>التعرف على الكلام غير مدعوم</AlertTitle>
        متصفحك لا يدعم التعرف على الكلام. يرجى استخدام متصفح حديث مثل Chrome أو Firefox.
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        <AlertTitle>خطأ في التعرف على الكلام</AlertTitle>
        {error}
      </Alert>
    );
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
          🎙️ التعرف على الكلام
        </Typography>
        
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <IconButton
            size="large"
            onClick={isListening ? stopListening : startListening}
            sx={{
              bgcolor: isListening ? '#F44336' : '#4CAF50',
              color: 'white',
              width: 80,
              height: 80,
              '&:hover': {
                bgcolor: isListening ? '#D32F2F' : '#45A049'
              }
            }}
          >
            {isListening ? <MicOff /> : <Mic />}
          </IconButton>
          
          <Typography variant="body2" sx={{ mt: 1 }}>
            {isListening ? 'جاري التسجيل...' : 'اضغط للتحدث'}
          </Typography>
          
          {isListening && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="indeterminate"
                sx={{ width: 200, mx: 'auto' }}
              />
            </Box>
          )}
        </Box>
        
        <Paper sx={{ p: 2, bgcolor: '#F5F5F5', minHeight: 100 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            النص المتعرف:
          </Typography>
          <Typography variant="body1" sx={{ minHeight: 60, p: 1, bgcolor: 'white', borderRadius: 1 }}>
            {transcript || 'ابدأ بالتحدث...'}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={resetTranscript}
              size="small"
            >
              مسح
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckCircle />}
              onClick={() => {
                if (transcript.trim()) {
                  // Handle transcript submission
                }
              }}
              disabled={!transcript.trim()}
              size="small"
            >
              إرسال
            </Button>
          </Box>
        </Paper>
      </CardContent>
    </Card>
  );
};

// Pronunciation Practice Component
export const PronunciationPractice: React.FC<{
  practiceWords: PronunciationPractice[];
  onComplete: (wordId: string, score: PronunciationScore) => void;
}> = ({ practiceWords, onComplete }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const {
    isAnalyzing,
    score,
    audioURL,
    startRecording,
    stopRecording,
    analyzePronunciation
  } = usePronunciationAnalysis();

  const currentWord = practiceWords[currentWordIndex];
  const [attempts, setAttempts] = useState<PronunciationScore[]>([]);

  const handleNextWord = () => {
    if (currentWordIndex < practiceWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setAttempts([]);
      setScore(null);
    }
  };

  const handlePreviousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setAttempts([]);
      setScore(null);
    }
  };

  const handleRecordingComplete = async () => {
    if (audioURL) {
      // In a real implementation, this would analyze the recorded audio
      const mockScore: PronunciationScore = {
        word: currentWord.word,
        score: Math.random() * 100,
        feedback: Math.random() > 0.7 ? 'Excellent!' : 'Good!',
        arabicFeedback: Math.random() > 0.7 ? 'ممتاز!' : 'جيد!',
        improvements: [],
        arabicImprovements: []
      };
      
      const newAttempts = [...attempts, mockScore];
      setAttempts(newAttempts);
      setScore(mockScore);
      
      if (mockScore.score > 80) {
        onComplete(currentWord.id, mockScore);
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    if (score >= 40) return '#FF5722';
    return '#9E9E9E';
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
          🗣️ تدريب النطق
        </Typography>
        
        {/* Progress */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            الكلمة {currentWordIndex + 1} / {practiceWords.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(currentWordIndex + 1) / practiceWords.length * 100}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {/* Current Word */}
        <Paper sx={{ p: 3, mb: 3, textAlign: 'center', bgcolor: '#E3F2FD' }}>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: '#1976D2' }}>
            {currentWord.word}
          </Typography>
          <Typography variant="h6" sx={{ color: '#1976D2', mb: 1 }}>
            {currentWord.arabicWord}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            {currentWord.phonetic}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Chip
              size="small"
              label={currentWord.category}
              color="primary"
            />
            <Chip
              size="small"
              label={currentWord.difficulty === 'easy' ? 'سهل' : 
                     currentWord.difficulty === 'medium' ? 'متوسط' : 'صعب'}
              color={currentWord.difficulty === 'easy' ? 'success' : 
                     currentWord.difficulty === 'medium' ? 'warning' : 'error'}
            />
          </Box>
        </Paper>

        {/* Recording Controls */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <IconButton
            size="large"
            onClick={isRecording ? stopRecording : startRecording}
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
            {isRecording ? <Stop /> : <Mic />}
          </IconButton>
          
          <Typography variant="body2" sx={{ mt: 1 }}>
            {isRecording ? 'جاري التسجيل...' : 'اضغط لتسجيل نطقك'}
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

        {/* Audio Playback */}
        {audioURL && (
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <audio ref={audioRef} controls src={audioURL} style={{ width: '100%' }} />
            <Button
              variant="outlined"
              startIcon={<Replay />}
              onClick={() => audioRef.current?.play()}
              size="small"
              sx={{ mt: 1 }}
            >
              إعادة التشغيل
            </Button>
          </Box>
        )}

        {/* Analysis Results */}
        {isAnalyzing && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 1 }}>
              جاري تحليل النطق...
            </Typography>
          </Box>
        )}

        {score && (
          <Paper sx={{ p: 2, mb: 2, bgcolor: '#F5F5F5' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                النتيجة:
              </Typography>
              <Avatar
                sx={{
                  bgcolor: getScoreColor(score.score),
                  color: 'white',
                  fontWeight: 900,
                  width: 60,
                  height: 60
                }}
              >
                {Math.round(score.score)}
              </Avatar>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 1 }}>
              {score.arabicFeedback}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {score.feedback}
            </Typography>
            
            {score.improvements.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  نصائح للتحسين:
                </Typography>
                <List dense>
                  {score.improvements.map((improvement, index) => (
                    <ListItem key={index} sx={{ py: 0 }}>
                      <ListItemText primary={improvement} secondary={score.arabicImprovements[index]} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        )}

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handlePreviousWord}
            disabled={currentWordIndex === 0}
          >
            السابق
          </Button>
          
          <Button
            variant="contained"
            endIcon={score && score.score > 80 ? <CheckCircle /> : <PlayArrow />}
            onClick={score && score.score > 80 ? handleNextWord : handleRecordingComplete}
            disabled={!score}
          >
            {score && score.score > 80 ? 'التالي' : 'تحليل'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// Voice Settings Component
export const VoiceSettings: React.FC<{
  settings: SpeechSettings;
  onSettingsChange: (settings: SpeechSettings) => void;
}> = ({ settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSettingChange = (key: keyof SpeechSettings, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
          ⚙️ إعدادات الصوت والنطق
        </Typography>
        
        <List>
          <ListItem>
            <ListItemText 
              primary="اللغة" 
              secondary="اختر لغة التعرف على الكلام" 
            />
            <select
              value={localSettings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              style={{ marginLeft: 'auto', padding: '4px', borderRadius: '4px' }}
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="ar-SA">العربية (السعودية)</option>
            </select>
          </ListItem>
          
          <Divider />
          
          <ListItem>
            <ListItemText 
              primary="السرعة" 
              secondary={`السرعة الحالية: ${localSettings.speed}`} 
            />
            <Slider
              value={localSettings.speed}
              onChange={(e, value) => handleSettingChange('speed', value)}
              min={0.5}
              max={2}
              step={0.1}
              marks={[
                { value: 0.5, label: 'بطيء' },
                { value: 1, label: 'عادي' },
                { value: 1.5, label: 'سريع' },
                { value: 2, label: 'سريع جداً' }
              ]}
              sx={{ mt: 1 }}
            />
          </ListItem>
          
          <ListItem>
            <ListItemText 
              primary="درجة الثقة" 
              secondary={`الحد الأدنى للقبول: ${localSettings.confidenceThreshold}%`} 
            />
            <Slider
              value={localSettings.confidenceThreshold}
              onChange={(e, value) => handleSettingChange('confidenceThreshold', value)}
              min={50}
              max={95}
              step={5}
              marks={[
                { value: 50, label: 'منخفض' },
                { value: 70, label: 'متوسط' },
                { value: 90, label: 'عالي' }
              ]}
              sx={{ mt: 1 }}
            />
          </ListItem>
          
          <Divider />
          
          <ListItem>
            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.autoDetect}
                  onChange={(e) => handleSettingChange('autoDetect', e.target.checked)}
                />
              }
              label="التعرف التلقائي على اللغة"
            />
          </ListItem>
          
          <ListItem>
            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.continuousMode}
                  onChange={(e) => handleSettingChange('continuousMode', e.target.checked)}
                />
              }
              label="الوضع المستمر"
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};
