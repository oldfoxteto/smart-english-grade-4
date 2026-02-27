// Voice Recognition and Speech Training Component
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  LinearProgress,
  CircularProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Slider,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  AlertTitle,
  Tooltip,
  Badge,
  Fab,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Grid,
  Container,
} from '@mui/material';
import {
  Mic,
  MicOff,
  VolumeUp,
  VolumeDown,
  VolumeOff,
  Settings,
  PlayArrow,
  Stop,
  Refresh,
  CheckCircle,
  Error,
  Warning,
  Info,
  RecordVoiceOver,
  Hearing,
  HearingDisabled,
  SettingsVoice,
  GraphicEq,
  Equalizer,
  Speed,
  SlowMotionVideo,
  HighQuality,
  LowQuality,
  Translate,
  Language,
  GTranslate,
  School,
  Psychology,
  Assessment,
  TrendingUp,
  TrendingDown,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  Star,
  StarBorder,
  ThumbUp,
  ThumbDown,
  Bookmark,
  BookmarkBorder,
  Share,
  Download,
  Upload,
  Save,
  Edit,
  Delete,
  Close,
  ExpandMore,
  ExpandLess,
  MoreVert,
  FilterList,
  Sort,
  Search,
  Clear,
  Visibility,
  VisibilityOff,
  Fullscreen,
  FullscreenExit,
  ZoomIn,
  ZoomOut,
  PanoramaFishEye,
  CenterFocusStrong,
  CenterFocusWeak,
  FilterCenterFocus,
  FilterCenterFocusWeak,
  FilterCenterFocusStrong,
  FilterDrama,
  FilterFrames,
  FilterHdr,
  FilterList as FilterListIcon,
  FilterNone,
  Filter1,
  Filter2,
  Filter3,
  Filter4,
  Filter5,
  Filter6,
  Filter7,
  Filter8,
  Filter9,
  Filter9Plus,
  FilterBAndW,
  FilterVintage,
  FilterVignette,
  FilterNone as FilterNoneIcon,
} from '@mui/icons-material';

// Voice Recognition Types
interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  timestamp: Date;
  duration: number;
  language: string;
  words: WordResult[];
}

interface WordResult {
  word: string;
  confidence: number;
  startTime: number;
  endTime: number;
  phoneme: string;
  correct: boolean;
  suggestions: string[];
}

interface SpeechTrainingSession {
  id: string;
  title: string;
  description: string;
  targetText: string;
  targetLanguage: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'pronunciation' | 'vocabulary' | 'conversation' | 'grammar';
  instructions: string[];
  examples: string[];
  tips: string[];
  commonMistakes: string[];
  createdAt: Date;
  completedAt?: Date;
  score?: number;
  attempts: number;
  bestAttempt?: VoiceRecognitionResult;
}

interface VoiceSettings {
  language: string;
  accent: string;
  speed: number;
  pitch: number;
  volume: number;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  grammars: string[];
}

interface VoiceAnalytics {
  totalSessions: number;
  averageAccuracy: number;
  improvementRate: number;
  timeSpent: number;
  wordsRecognized: number;
  mistakesCorrected: number;
  strongAreas: string[];
  weakAreas: string[];
  recommendedPractice: string[];
  progressHistory: {
    date: Date;
    accuracy: number;
    speed: number;
    confidence: number;
  }[];
}

const VoiceRecognition: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSession, setCurrentSession] = useState<SpeechTrainingSession | null>(null);
  const [recognitionResults, setRecognitionResults] = useState<VoiceRecognitionResult[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const [settings, setSettings] = useState<VoiceSettings>({
    language: 'en-US',
    accent: 'US',
    speed: 1.0,
    pitch: 1.0,
    volume: 1.0,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    continuous: false,
    interimResults: true,
    maxAlternatives: 3,
    grammars: [],
  });
  
  const [analytics, setAnalytics] = useState<VoiceAnalytics>({
    totalSessions: 0,
    averageAccuracy: 0,
    improvementRate: 0,
    timeSpent: 0,
    wordsRecognized: 0,
    mistakesCorrected: 0,
    strongAreas: [],
    weakAreas: [],
    recommendedPractice: [],
    progressHistory: [],
  });
  
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Mock training sessions
  const trainingSessions: SpeechTrainingSession[] = [
    {
      id: '1',
      title: 'Basic Pronunciation',
      description: 'Learn basic English pronunciation',
      targetText: 'Hello, how are you today?',
      targetLanguage: 'en-US',
      difficulty: 'beginner',
      category: 'pronunciation',
      instructions: [
        'Listen to the example pronunciation',
        'Repeat the phrase clearly',
        'Pay attention to word stress',
        'Practice multiple times',
      ],
      examples: [
        'Hello, how are you today?',
        'Hello, how are you doing?',
        'Hi, how are you today?',
      ],
      tips: [
        'Speak clearly and at a moderate pace',
        'Pay attention to the rhythm of the sentence',
        'Practice each word individually',
        'Record yourself and compare',
      ],
      commonMistakes: [
        'Pronouncing "how" as "hao"',
        'Not stressing "are" properly',
        'Speaking too quickly',
        'Mumbling the end of the sentence',
      ],
      createdAt: new Date(),
      attempts: 0,
    },
    {
      id: '2',
      title: 'Vocabulary Practice',
      description: 'Practice common English vocabulary',
      targetText: 'The weather is beautiful today',
      targetLanguage: 'en-US',
      difficulty: 'intermediate',
      category: 'vocabulary',
      instructions: [
        'Focus on each word pronunciation',
        'Use proper intonation',
        'Practice at different speeds',
        'Check your accuracy',
      ],
      examples: [
        'The weather is beautiful today',
        'The weather is lovely today',
        'The weather is nice today',
      ],
      tips: [
        'Break down long words into syllables',
        'Use a dictionary for pronunciation',
        'Listen to native speakers',
        'Practice with a partner',
      ],
      commonMistakes: [
        'Mispronouncing "beautiful"',
        'Wrong word stress',
        'Skipping words',
        'Speaking too fast',
      ],
      createdAt: new Date(),
      attempts: 0,
    },
    {
      id: '3',
      title: 'Conversation Practice',
      description: 'Practice conversational English',
      targetText: 'I would like to order a coffee, please',
      targetLanguage: 'en-US',
      difficulty: 'advanced',
      category: 'conversation',
      instructions: [
        'Use natural intonation',
        'Practice politeness expressions',
        'Focus on flow and rhythm',
        'Record and review',
      ],
      examples: [
        'I would like to order a coffee, please',
        'I would like to have a coffee, please',
        'Can I have a coffee, please?',
      ],
      tips: [
        'Use polite expressions naturally',
        'Practice different scenarios',
        'Focus on connected speech',
        'Listen to native examples',
      ],
      commonMistakes: [
        'Unnatural intonation',
        'Wrong word order',
        'Missing polite expressions',
        'Speaking too formally',
      ],
      createdAt: new Date(),
      attempts: 0,
    },
  ];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = settings.continuous;
      recognitionRef.current.interimResults = settings.interimResults;
      recognitionRef.current.maxAlternatives = settings.maxAlternatives;
      recognitionRef.current.lang = settings.language;
      
      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;
        
        const voiceResult: VoiceRecognitionResult = {
          transcript,
          confidence,
          timestamp: new Date(),
          duration: 0, // Calculate from event timing
          language: settings.language,
          words: parseWords(transcript, confidence),
        };
        
        setRecognitionResults(prev => [...prev, voiceResult]);
        setIsProcessing(false);
        
        // Update analytics
        setAnalytics(prev => ({
          ...prev,
          totalSessions: prev.totalSessions + 1,
          averageAccuracy: (prev.averageAccuracy * prev.totalSessions + confidence) / (prev.totalSessions + 1),
          wordsRecognized: prev.wordsRecognized + voiceResult.words.length,
          progressHistory: [
            ...prev.progressHistory,
            {
              date: new Date(),
              accuracy: confidence,
              speed: 0, // Calculate words per minute
              confidence: confidence,
            },
          ],
        }));
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setIsProcessing(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
        setIsProcessing(false);
      };
    }
    
    synthesisRef.current = window.speechSynthesis;
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, [settings]);

  // Parse words from transcript
  const parseWords = (transcript: string, confidence: number): WordResult[] => {
    return transcript.split(' ').map((word, index) => ({
      word,
      confidence,
      startTime: index * 0.5, // Mock timing
      endTime: (index + 1) * 0.5,
      phoneme: '', // Mock phoneme
      correct: Math.random() > 0.3, // Mock correctness
      suggestions: [], // Mock suggestions
    }));
  };

  // Start recording
  const startRecording = useCallback(() => {
    if (recognitionRef.current && currentSession) {
      recognitionRef.current.lang = settings.language;
      recognitionRef.current.start();
      setIsRecording(true);
      setIsProcessing(true);
      
      // Start audio recording for playback
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorderRef.current = new MediaRecorder(stream);
          audioChunksRef.current = [];
          
          mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };
          
          mediaRecorderRef.current.start();
        })
        .catch(error => {
          console.error('Error accessing microphone:', error);
        });
    }
  }, [currentSession, settings.language]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    setIsProcessing(false);
    
    // Update session attempts
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        attempts: prev.attempts + 1,
      } : null);
    }
  }, [currentSession]);

  // Play target text
  const playTargetText = useCallback(() => {
    if (currentSession && synthesisRef.current) {
      synthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(currentSession.targetText);
      utterance.rate = settings.speed;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;
      utterance.lang = currentSession.targetLanguage;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
      synthesisRef.current.speak(utterance);
    }
  }, [currentSession, settings]);

  // Play user recording
  const playUserRecording = useCallback(async () => {
    if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    }
  }, []);

  // Calculate accuracy
  const calculateAccuracy = useCallback((result: VoiceRecognitionResult, targetText: string) => {
    const targetWords = targetText.toLowerCase().split(' ');
    const recognizedWords = result.transcript.toLowerCase().split(' ');
    
    let matches = 0;
    for (let i = 0; i < Math.min(targetWords.length, recognizedWords.length); i++) {
      if (targetWords[i] === recognizedWords[i]) {
        matches++;
      }
    }
    
    return (matches / targetWords.length) * 100;
  }, []);

  // Get accuracy color
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'success';
    if (accuracy >= 75) return 'warning';
    return 'error';
  };

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'success';
    if (confidence >= 0.7) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Header */}
      <Paper sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            🎤 Voice Recognition & Speech Training
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Analytics">
              <IconButton onClick={() => setAnalyticsOpen(true)}>
                <Assessment />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Settings">
              <IconButton onClick={() => setSettingsOpen(true)}>
                <Settings />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Container maxWidth="lg">
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab label="Training" icon={<School />} />
            <Tab label="Results" icon={<Assessment />} />
            <Tab label="Progress" icon={<TrendingUp />} />
          </Tabs>

          {/* Training Tab */}
          {selectedTab === 0 && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                {/* Session Selection */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Select Training Session
                      </Typography>
                      
                      <List>
                        {trainingSessions.map((session) => (
                          <ListItem
                            key={session.id}
                            button
                            onClick={() => setCurrentSession(session)}
                            selected={currentSession?.id === session.id}
                          >
                            <ListItemIcon>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <RecordVoiceOver />
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={session.title}
                              secondary={`${session.difficulty} • ${session.category}`}
                            />
                            <Chip
                              label={session.difficulty}
                              color={session.difficulty === 'beginner' ? 'success' : session.difficulty === 'intermediate' ? 'warning' : 'error'}
                              size="small"
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Current Session */}
                <Grid item xs={12} md={6}>
                  {currentSession && (
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          {currentSession.title}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {currentSession.description}
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Target Text:
                          </Typography>
                          <Typography variant="body1" sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                            {currentSession.targetText}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Instructions:
                          </Typography>
                          <List dense>
                            {currentSession.instructions.map((instruction, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <CheckCircle color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={instruction} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Examples:
                          </Typography>
                          <List dense>
                            {currentSession.examples.map((example, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <Info color="info" />
                                </ListItemIcon>
                                <ListItemText primary={example} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Tips:
                          </Typography>
                          <List dense>
                            {currentSession.tips.map((tip, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <Lightbulb color="warning" />
                                </ListItemIcon>
                                <ListItemText primary={tip} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Common Mistakes:
                          </Typography>
                          <List dense>
                            {currentSession.commonMistakes.map((mistake, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <Warning color="error" />
                                </ListItemIcon>
                                <ListItemText primary={mistake} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </CardContent>
                    </Card>
                  )}
                </Grid>

                {/* Controls */}
                <Grid item xs={12}>
                  {currentSession && (
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                          <Button
                            variant="contained"
                            startIcon={<PlayArrow />}
                            onClick={playTargetText}
                            disabled={isPlaying}
                          >
                            Play Target
                          </Button>
                          
                          <Button
                            variant={isRecording ? 'contained' : 'outlined'}
                            color={isRecording ? 'error' : 'primary'}
                            startIcon={isRecording ? <Stop /> : <Mic />}
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={isProcessing}
                          >
                            {isRecording ? 'Stop Recording' : 'Start Recording'}
                          </Button>
                          
                          <Button
                            variant="outlined"
                            startIcon={<VolumeUp />}
                            onClick={playUserRecording}
                            disabled={audioChunksRef.current.length === 0}
                          >
                            Play Recording
                          </Button>
                        </Box>
                        
                        {isRecording && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <CircularProgress />
                            <Typography variant="body2" sx={{ ml: 2 }}>
                              Recording... Speak clearly
                            </Typography>
                          </Box>
                        )}
                        
                        {isProcessing && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <CircularProgress />
                            <Typography variant="body2" sx={{ ml: 2 }}>
                              Processing...
                            </Typography>
                          </Box>
                        )}
                        
                        {recognitionResults.length > 0 && (
                          <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                              Recognition Results
                            </Typography>
                            
                            {recognitionResults.map((result, index) => (
                              <Card key={index} sx={{ mb: 2 }}>
                                <CardContent>
                                  <Typography variant="body1" sx={{ mb: 1 }}>
                                    "{result.transcript}"
                                  </Typography>
                                  
                                  <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                                    <Chip
                                      label={`Confidence: ${(result.confidence * 100).toFixed(1)}%`}
                                      color={getConfidenceColor(result.confidence) as any}
                                      size="small"
                                    />
                                    
                                    <Chip
                                      label={`Accuracy: ${calculateAccuracy(result, currentSession.targetText).toFixed(1)}%`}
                                      color={getAccuracyColor(calculateAccuracy(result, currentSession.targetText)) as any}
                                      size="small"
                                    />
                                  </Box>
                                  
                                  <Typography variant="caption" color="text.secondary">
                                    {result.timestamp.toLocaleString()}
                                  </Typography>
                                </CardContent>
                              </Card>
                            ))}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Results Tab */}
          {selectedTab === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recognition Results
              </Typography>
              
              {recognitionResults.length > 0 ? (
                <List>
                  {recognitionResults.map((result, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <RecordVoiceOver />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={result.transcript}
                        secondary={`Confidence: ${(result.confidence * 100).toFixed(1)}% • ${result.timestamp.toLocaleString()}`}
                      />
                      <Chip
                        label={getConfidenceColor(result.confidence)}
                        color={getConfidenceColor(result.confidence) as any}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  <AlertTitle>No Results Yet</AlertTitle>
                  Start a training session to see recognition results.
                </Alert>
              )}
            </Box>
          )}

          {/* Progress Tab */}
          {selectedTab === 2 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Voice Training Progress
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {analytics.totalSessions}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Sessions
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {analytics.averageAccuracy.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Accuracy
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                        {analytics.wordsRecognized}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Words Recognized
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                        {analytics.improvementRate.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Improvement Rate
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Container>
      </Box>

      {/* Hidden audio element */}
      <audio ref={audioRef} style={{ display: 'none' }} />

      {/* Settings Drawer */}
      <Drawer
        anchor="right"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Voice Settings
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Language</InputLabel>
            <Select
              value={settings.language}
              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
            >
              <MenuItem value="en-US">English (US)</MenuItem>
              <MenuItem value="en-GB">English (UK)</MenuItem>
              <MenuItem value="ar-SA">Arabic (SA)</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Speed</InputLabel>
            <Slider
              value={settings.speed}
              onChange={(e, value) => setSettings(prev => ({ ...prev, speed: value as number }))}
              min={0.5}
              max={2}
              step={0.1}
              marks={[
                { value: 0.5, label: '0.5x' },
                { value: 1, label: '1x' },
                { value: 1.5, label: '1.5x' },
                { value: 2, label: '2x' },
              ]}
            />
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Pitch</InputLabel>
            <Slider
              value={settings.pitch}
              onChange={(e, value) => setSettings(prev => ({ ...prev, pitch: value as number }))}
              min={0.5}
              max={2}
              step={0.1}
              marks={[
                { value: 0.5, label: 'Low' },
                { value: 1, label: 'Normal' },
                { value: 1.5, label: 'High' },
                { value: 2, label: 'Very High' },
              ]}
            />
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Volume</InputLabel>
            <Slider
              value={settings.volume}
              onChange={(e, value) => setSettings(prev => ({ ...prev, volume: value as number }))}
              min={0}
              max={1}
              step={0.1}
              marks={[
                { value: 0, label: '0%' },
                { value: 0.5, label: '50%' },
                { value: 1, label: '100%' },
              ]}
            />
          </FormControl>
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.echoCancellation}
                onChange={(e) => setSettings(prev => ({ ...prev, echoCancellation: e.target.checked }))}
              />
            }
            label="Echo Cancellation"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.noiseSuppression}
                onChange={(e) => setSettings(prev => ({ ...prev, noiseSuppression: e.target.checked }))}
              />
            }
            label="Noise Suppression"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.autoGainControl}
                onChange={(e) => setSettings(prev => ({ ...prev, autoGainControl: e.target.checked }))}
              />
            }
            label="Auto Gain Control"
          />
        </Box>
      </Drawer>

      {/* Analytics Drawer */}
      <Drawer
        anchor="right"
        open={analyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Voice Analytics
          </Typography>
          
          <Typography variant="body2">
            Total Sessions: {analytics.totalSessions}
          </Typography>
          <Typography variant="body2">
            Average Accuracy: {analytics.averageAccuracy.toFixed(1)}%
          </Typography>
          <Typography variant="body2">
            Words Recognized: {analytics.wordsRecognized}
          </Typography>
          <Typography variant="body2">
            Improvement Rate: {analytics.improvementRate.toFixed(1)}%
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Progress History</Typography>
            {analytics.progressHistory.map((point, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="caption">
                  {point.date.toLocaleDateString()}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={point.accuracy}
                  sx={{ mb: 0.5 }}
                />
                <Typography variant="caption">
                  Accuracy: {point.accuracy.toFixed(1)}%
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default VoiceRecognition;
