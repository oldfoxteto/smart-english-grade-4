// Enhanced Speech Recognition and Pronunciation Analysis System
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
  CircularProgress,
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
  Upload,
  Timeline,
  TrendingUp,
  TrendingDown,
  Equalizer,
  GraphicEq,
  Analytics,
  Assessment,
  Compare,
  CompareArrows,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

export interface EnhancedSpeechRecognitionResult {
  transcript: string;
  confidence: number;
  timestamp: Date;
  isFinal: boolean;
  words: Array<{
    word: string;
    confidence: number;
    startTime: number;
    endTime: number;
  }>;
}

export interface PronunciationAnalysis {
  overallScore: number;
  accuracy: number;
  fluency: number;
  pronunciation: number;
  rhythm: number;
  intonation: number;
  feedback: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    arabicStrengths: string[];
    arabicWeaknesses: string[];
    arabicRecommendations: string[];
  };
  phonemeAnalysis: Array<{
    phoneme: string;
    targetPhoneme: string;
    score: number;
    position: number;
  }>;
  wordAnalysis: Array<{
    word: string;
    score: number;
    syllables: string[];
    stressPattern: string;
    issues: string[];
  }>;
}

export interface VoiceProfile {
  id: string;
  name: string;
  arabicName: string;
  language: string;
  accent: string;
  age: string;
  gender: string;
  recordings: Array<{
    id: string;
    word: string;
    audioUrl: string;
    score: number;
    date: Date;
  }>;
  averageScore: number;
  improvement: number;
  createdAt: Date;
  lastUpdated: Date;
}

export interface SpeechSession {
  id: string;
  type: 'practice' | 'assessment' | 'conversation';
  duration: number;
  words: string[];
  recordings: Array<{
    id: string;
    word: string;
    audioUrl: string;
    score: number;
    timestamp: Date;
  }>;
  overallScore: number;
  improvements: string[];
  createdAt: Date;
}

// Enhanced Speech Recognition Hook
export const useEnhancedSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognitionResults, setRecognitionResults] = useState<EnhancedSpeechRecognitionResult[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check browser support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.maxAlternatives = 3;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const results: EnhancedSpeechRecognitionResult[] = [];
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i][0];
          const words = Array.from(result.transcript.split(' ')).map((word, index) => ({
            word,
            confidence: result.confidence,
            startTime: 0, // Would need more detailed timing info
            endTime: 0
          }));
          
          results.push({
            transcript: result.transcript,
            confidence: result.confidence,
            timestamp: new Date(),
            isFinal: event.results[i].isFinal,
            words
          });
        }
        
        setRecognitionResults(prev => [...prev, ...results]);
        
        if (event.results[event.results.length - 1].isFinal) {
          setTranscript(result.transcript);
          setConfidence(result.confidence);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onspeechstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onspeechend = () => {
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
      setTranscript('');
      setRecognitionResults([]);
      setError(null);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setRecognitionResults([]);
    setConfidence(0);
  }, []);

  return {
    isListening,
    transcript,
    confidence,
    isSupported,
    error,
    recognitionResults,
    startListening,
    stopListening,
    resetTranscript
  };
};

// Advanced Pronunciation Analysis Hook
export const useAdvancedPronunciationAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PronunciationAnalysis | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const analyzePronunciation = useCallback(async (targetWord: string, audioBlob: Blob) => {
    setIsAnalyzing(true);
    
    try {
      // Create audio URL for playback
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      
      // Extract waveform data
      await extractWaveform(audioBlob);
      
      // Simulate advanced pronunciation analysis
      const mockAnalysis: PronunciationAnalysis = {
        overallScore: Math.random() * 100,
        accuracy: Math.random() * 100,
        fluency: Math.random() * 100,
        pronunciation: Math.random() * 100,
        rhythm: Math.random() * 100,
        intonation: Math.random() * 100,
        feedback: {
          strengths: generateStrengths(),
          weaknesses: generateWeaknesses(),
          recommendations: generateRecommendations(),
          arabicStrengths: ['نطق واضح', 'سرعة جيدة', 'نبرة صحيحة'],
          arabicWeaknesses: ['بعض الأصوات غير دقيقة', 'سرعة غير متسقة', 'نبرة تحتاج تحسين'],
          arabicRecommendations: ['مارس النطق البطيء', 'ركز على الأصوات الصعبة', 'استمع للمتحدثين الأصليين']
        },
        phonemeAnalysis: generatePhonemeAnalysis(targetWord),
        wordAnalysis: generateWordAnalysis(targetWord)
      };
      
      setAnalysis(mockAnalysis);
      
    } catch (error) {
      console.error('Pronunciation analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const extractWaveform = async (audioBlob: Blob) => {
    return new Promise((resolve) => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          const channelData = audioBuffer.getChannelData(0);
          
          // Extract waveform peaks
          const peaks = [];
          const samplesPerPeak = Math.floor(channelData.length / 100);
          
          for (let i = 0; i < 100; i++) {
            const start = i * samplesPerPeak;
            const end = start + samplesPerPeak;
            let sum = 0;
            
            for (let j = start; j < end; j++) {
              sum += Math.abs(channelData[j]);
            }
            
            peaks.push(sum / samplesPerPeak);
          }
          
          setWaveformData(peaks);
          resolve(peaks);
        } catch (error) {
          console.error('Waveform extraction error:', error);
          resolve([]);
        }
      };
      
      reader.readAsArrayBuffer(audioBlob);
    });
  };

  const generateStrengths = (): string[] => {
    const possibleStrengths = [
      'Clear pronunciation',
      'Good rhythm',
      'Correct stress patterns',
      'Natural intonation',
      'Consistent pace',
      'Good vowel sounds',
      'Clear consonants'
    ];
    
    return possibleStrengths.sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  const generateWeaknesses = (): string[] => {
    const possibleWeaknesses = [
      'Some vowel sounds need improvement',
      'Inconsistent stress patterns',
      'Pronunciation speed varies',
      'Some consonants are unclear',
      'Intonation could be more natural',
      'Rhythm needs work'
    ];
    
    return possibleWeaknesses.sort(() => 0.5 - Math.random()).slice(0, 2);
  };

  const generateRecommendations = (): string[] => {
    const possibleRecommendations = [
      'Practice difficult sounds daily',
      'Listen to native speakers',
      'Record and compare your pronunciation',
      'Use tongue twisters for practice',
      'Focus on mouth position',
      'Practice with a language partner',
      'Use pronunciation apps',
      'Watch English videos and repeat'
    ];
    
    return possibleRecommendations.sort(() => 0.5 - Math.random()).slice(0, 4);
  };

  const generatePhonemeAnalysis = (targetWord: string) => {
    const phonemes = targetWord.split('').map((letter, index) => ({
      phoneme: letter,
      targetPhoneme: letter,
      score: Math.random() * 100,
      position: index
    }));
    
    return phonemes;
  };

  const generateWordAnalysis = (targetWord: string) => {
    return [{
      word: targetWord,
      score: Math.random() * 100,
      syllables: targetWord.split('-'),
      stressPattern: 'STRESS-stress',
      issues: []
    }];
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
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
    analysis,
    audioURL,
    waveformData,
    startRecording,
    stopRecording,
    analyzePronunciation
  };
};

// Voice Profile Management Hook
export const useVoiceProfile = () => {
  const [profiles, setProfiles] = useState<VoiceProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<VoiceProfile | null>(null);

  useEffect(() => {
    const savedProfiles = localStorage.getItem('voice_profiles');
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    }
  }, []);

  const createProfile = (profileData: Omit<VoiceProfile, 'id' | 'createdAt' | 'lastUpdated'>) => {
    const newProfile: VoiceProfile = {
      ...profileData,
      id: `profile_${Date.now()}`,
      createdAt: new Date(),
      lastUpdated: new Date(),
      recordings: [],
      averageScore: 0,
      improvement: 0
    };
    
    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    localStorage.setItem('voice_profiles', JSON.stringify(updatedProfiles));
    setCurrentProfile(newProfile);
  };

  const updateProfile = (profileId: string, updates: Partial<VoiceProfile>) => {
    const updatedProfiles = profiles.map(profile => 
      profile.id === profileId 
        ? { ...profile, ...updates, lastUpdated: new Date() }
        : profile
    );
    
    setProfiles(updatedProfiles);
    localStorage.setItem('voice_profiles', JSON.stringify(updatedProfiles));
    
    if (currentProfile?.id === profileId) {
      setCurrentProfile({ ...currentProfile, ...updates });
    }
  };

  const deleteProfile = (profileId: string) => {
    const updatedProfiles = profiles.filter(profile => profile.id !== profileId);
    setProfiles(updatedProfiles);
    localStorage.setItem('voice_profiles', JSON.stringify(updatedProfiles));
    
    if (currentProfile?.id === profileId) {
      setCurrentProfile(null);
    }
  };

  return {
    profiles,
    currentProfile,
    createProfile,
    updateProfile,
    deleteProfile
  };
};

// Enhanced Speech Recognition Component
export const EnhancedSpeechRecognitionComponent: React.FC<{
  onTranscript: (transcript: string, confidence: number) => void;
  onResults: (results: EnhancedSpeechRecognitionResult[]) => void;
  settings: any;
}> = ({ onTranscript, onResults, settings }) => {
  const {
    isListening,
    transcript,
    confidence,
    isSupported,
    error,
    recognitionResults,
    startListening,
    stopListening,
    resetTranscript
  } = useEnhancedSpeechRecognition();

  const [volume, setVolume] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    onTranscript(transcript, confidence);
    onResults(recognitionResults);
  }, [transcript, confidence, recognitionResults, onTranscript, onResults]);

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
          🎙️ التعرف على الكلام المتقدم
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
              <Typography variant="caption" sx={{ mt: 1 }}>
                الثقة: {Math.round(confidence)}%
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Waveform Visualization */}
        {isListening && (
          <Box sx={{ mb: 3, p: 2, bgcolor: '#F5F5F5', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              مستوى الصوت:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, height: 60 }}>
              {[...Array(20)].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 3,
                    height: Math.random() * 40 + 10,
                    bgcolor: '#4CAF50',
                    borderRadius: 1,
                    opacity: 0.8
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
        
        {/* Results Display */}
        <Paper sx={{ p: 2, bgcolor: '#F5F5F5', minHeight: 100 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            النص المتعرف:
          </Typography>
          <Typography variant="body1" sx={{ minHeight: 60, p: 1, bgcolor: 'white', borderRadius: 1 }}>
            {transcript || 'ابدأ بالتحدث...'}
          </Typography>
          
          {confidence > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                مستوى الثقة: {Math.round(confidence)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={confidence}
                sx={{ mt: 0.5 }}
              />
            </Box>
          )}
        </Paper>
        
        {/* Advanced Results */}
        {showAdvanced && recognitionResults.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() => setShowAdvanced(!showAdvanced)}
              size="small"
            >
              إخفاء النتائج المتقدمة
            </Button>
            
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>الوقت</TableCell>
                    <TableCell>النص</TableCell>
                    <TableCell>الثقة</TableCell>
                    <TableCell>نهائي</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recognitionResults.slice(-5).map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {result.timestamp.toLocaleTimeString()}
                      </TableCell>
                      <TableCell>{result.transcript}</TableCell>
                      <TableCell>{Math.round(result.confidence)}%</TableCell>
                      <TableCell>
                        {result.isFinal ? <CheckCircle color="success" /> : <RadioButtonUnchecked />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={resetTranscript}
            size="small"
          >
            مسح
          </Button>
          <Button
            variant="outlined"
            startIcon={showAdvanced ? <VisibilityOff /> : <Visibility />}
            onClick={() => setShowAdvanced(!showAdvanced)}
            size="small"
          >
            {showAdvanced ? 'إخفاء المتقدم' : 'عرض المتقدم'}
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
      </CardContent>
    </Card>
  );
};
