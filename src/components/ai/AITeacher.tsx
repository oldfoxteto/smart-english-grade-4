// AI Teacher - Advanced AI-Powered Learning Assistant
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Paper,
  IconButton,
  Tooltip,
  Badge,
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  AlertTitle,
  CircularProgress,
  Fade,
  Grow,
  Zoom,
  Slide,
} from '@mui/material';
import {
  SmartToy,
  Mic,
  MicOff,
  VolumeUp,
  VolumeOff,
  Send,
  Psychology,
  School,
  Lightbulb,
  TipsAndUpdates,
  EmojiObjects,
  AutoAwesome,
  Translate,
  RecordVoiceOver,
  Hearing,
  Settings,
  Close,
  ExpandMore,
  ExpandLess,
  Star,
  ThumbUp,
  ThumbDown,
  Refresh,
  History,
  Bookmark,
  BookmarkBorder,
  Share,
  Download,
  Upload,
  Assessment,
  TrendingUp,
  Timeline,
  Analytics,
  Speed,
  Memory,
  Visibility,
  VisibilityOff,
  BrightnessHigh,
  BrightnessLow,
  Contrast,
  Accessibility,
  Language,
  GTranslate,
  Chat,
  QuestionAnswer,
  Help,
  Support,
  Feedback,
  RateReview,
  Menu,
  MoreVert,
  Edit,
  Delete,
  Save,
  Cancel,
  CheckCircle,
  Error,
  Warning,
  Info,
} from '@mui/icons-material';

// AI Teacher Interface
interface AITeacherMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  isBookmarked?: boolean;
  rating?: 'up' | 'down' | null;
  category?: 'vocabulary' | 'grammar' | 'pronunciation' | 'conversation' | 'general';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  relatedTopics?: string[];
  examples?: string[];
  translations?: { [key: string]: string };
}

interface AITeacherSettings {
  voiceEnabled: boolean;
  autoPlay: boolean;
  voiceSpeed: number;
  voicePitch: number;
  language: 'en' | 'ar' | 'both';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  teachingStyle: 'friendly' | 'professional' | 'encouraging' | 'strict';
  responseLength: 'short' | 'medium' | 'long';
  showTranslations: boolean;
  showExamples: boolean;
  showRelatedTopics: boolean;
  enableHints: boolean;
  enableCorrections: boolean;
  enableMotivation: boolean;
  sessionTimeout: number;
}

interface AITeacherAnalytics {
  totalSessions: number;
  averageSessionDuration: number;
  questionsAsked: number;
  conceptsLearned: number;
  mistakesCorrected: number;
  improvementRate: number;
  engagementScore: number;
  preferredTopics: string[];
  weakAreas: string[];
  strongAreas: string[];
  learningProgress: {
    vocabulary: number;
    grammar: number;
    pronunciation: number;
    conversation: number;
    listening: number;
    reading: number;
    writing: number;
  };
}

const AITeacher: React.FC = () => {
  const [messages, setMessages] = useState<AITeacherMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<string>('');
  const [teacherMood, setTeacherMood] = useState<'happy' | 'neutral' | 'encouraging'>('happy');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const [settings, setSettings] = useState<AITeacherSettings>({
    voiceEnabled: true,
    autoPlay: false,
    voiceSpeed: 1.0,
    voicePitch: 1.0,
    language: 'both',
    difficulty: 'intermediate',
    teachingStyle: 'friendly',
    responseLength: 'medium',
    showTranslations: true,
    showExamples: true,
    showRelatedTopics: true,
    enableHints: true,
    enableCorrections: true,
    enableMotivation: true,
    sessionTimeout: 30,
  });
  
  const [analytics, setAnalytics] = useState<AITeacherAnalytics>({
    totalSessions: 0,
    averageSessionDuration: 0,
    questionsAsked: 0,
    conceptsLearned: 0,
    mistakesCorrected: 0,
    improvementRate: 0,
    engagementScore: 0,
    preferredTopics: [],
    weakAreas: [],
    strongAreas: [],
    learningProgress: {
      vocabulary: 0,
      grammar: 0,
      pronunciation: 0,
      conversation: 0,
      listening: 0,
      reading: 0,
      writing: 0,
    },
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const sendMessageRef = useRef<(message: string) => void>(() => {});

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = settings.language === 'ar' ? 'ar-SA' : 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        sendMessageRef.current(transcript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
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
  }, [settings.language]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate contextual suggestions
  const generateSuggestions = useCallback(() => {
    const commonSuggestions = [
      "What does this word mean?",
      "Can you explain this grammar rule?",
      "How do I pronounce this?",
      "Can you give me an example?",
      "What's the difference between...",
      "Can you help me with my homework?",
      "I need practice with conversation",
      "Explain this concept simply",
      "Give me a vocabulary exercise",
      "Help me with pronunciation",
    ];
    
    const contextualSuggestions = [
      "Tell me about your day",
      "What's the weather like?",
      "Describe your family",
      "Talk about your hobbies",
      "Practice ordering food",
      "Ask for directions",
      "Shopping conversation",
      "Job interview practice",
      "Travel planning",
      "Medical appointment",
    ];
    
    const allSuggestions = [...commonSuggestions, ...contextualSuggestions];
    const randomSuggestions = allSuggestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    
    setSuggestions(randomSuggestions);
  }, []);

  useEffect(() => {
    generateSuggestions();
  }, [generateSuggestions]);

  // Handle sending message
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    const userMessage: AITeacherMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
      
      // Auto-play voice if enabled
      if (settings.autoPlay && settings.voiceEnabled) {
        speakText(aiResponse.content);
      }
      
      // Update analytics
      setAnalytics(prev => ({
        ...prev,
        questionsAsked: prev.questionsAsked + 1,
      }));
    }, 1500);
  };

  sendMessageRef.current = handleSendMessage;

  // Generate AI response
  const generateAIResponse = (userMessage: string): AITeacherMessage => {
    const responses = {
      greeting: {
        content: "Hello! I'm your AI English teacher. How can I help you learn today?",
        category: 'general',
        examples: ["Try asking me about vocabulary, grammar, or pronunciation!"],
        translations: { ar: "مرحباً! أنا معلمك الذكي للغة الإنجليزية. كيف يمكنني مساعدتك في التعلم اليوم؟" }
      },
      vocabulary: {
        content: "I'd be happy to help you with vocabulary! What specific words would you like to learn?",
        category: 'vocabulary',
        examples: ["We can learn words by theme, difficulty, or context."],
        translations: { ar: "يسعدني مساعدتك في المفردات! ما هي الكلمات المحددة التي تود تعلمها؟" }
      },
      grammar: {
        content: "Grammar is the foundation of good English. What grammar topic would you like to explore?",
        category: 'grammar',
        examples: ["We can cover tenses, parts of speech, sentence structure, and more."],
        translations: { ar: "القواعد هي أساس الإنجليزية الجيدة. ما موضوع القواعد الذي تود استكشافه؟" }
      },
      pronunciation: {
        content: "Pronunciation practice is essential for clear communication. Let's work on it together!",
        category: 'pronunciation',
        examples: ["I can help you with individual sounds, word stress, and intonation."],
        translations: { ar: "ممارسة النطق ضرورية للتواصل الواضح. دعنا نعمل عليها معاً!" }
      },
      conversation: {
        content: "Conversation practice helps you use English in real situations. What would you like to talk about?",
        category: 'conversation',
        examples: ["We can practice everyday conversations, interviews, or specific scenarios."],
        translations: { ar: "ممارسة المحادثة تساعدك على استخدام الإنجليزية في مواقف حقيقية. ماذا تود التحدث عنه؟" }
      },
      default: {
        content: "That's an interesting question! Let me help you with that. Could you provide more details?",
        category: 'general',
        examples: ["I'm here to help you learn English in the best way possible."],
        translations: { ar: "هذا سؤال مثير للاهتمام! دعني أساعدك في ذلك. هل يمكنك تقديم المزيد من التفاصيل؟" }
      }
    };
    
    // Simple keyword matching for demo
    let response = responses.default;
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      response = responses.greeting;
    } else if (userMessage.toLowerCase().includes('vocabulary') || userMessage.toLowerCase().includes('word')) {
      response = responses.vocabulary;
    } else if (userMessage.toLowerCase().includes('grammar') || userMessage.toLowerCase().includes('tense')) {
      response = responses.grammar;
    } else if (userMessage.toLowerCase().includes('pronounce') || userMessage.toLowerCase().includes('sound')) {
      response = responses.pronunciation;
    } else if (userMessage.toLowerCase().includes('conversation') || userMessage.toLowerCase().includes('talk')) {
      response = responses.conversation;
    }
    
    return {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: response.content,
      timestamp: new Date(),
      category: response.category,
      examples: response.examples,
      translations: response.translations,
      relatedTopics: ['Practice Exercises', 'More Examples', 'Related Concepts'],
    };
  };

  // Text-to-speech
  const speakText = (text: string) => {
    if (!synthesisRef.current || !settings.voiceEnabled) return;
    
    synthesisRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.voiceSpeed;
    utterance.pitch = settings.voicePitch;
    utterance.lang = settings.language === 'ar' ? 'ar-SA' : 'en-US';
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthesisRef.current.speak(utterance);
  };

  // Handle voice recording
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  // Handle message rating
  const handleRating = (messageId: string, rating: 'up' | 'down') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, rating } : msg
    ));
  };

  // Handle bookmark
  const handleBookmark = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isBookmarked: !msg.isBookmarked } : msg
    ));
  };

  // Get teacher avatar based on mood
  const getTeacherAvatar = () => {
    switch (teacherMood) {
      case 'happy':
        return '😊';
      case 'encouraging':
        return '🌟';
      default:
        return '🤖';
    }
  };

  // Get teacher status message
  const getTeacherStatus = () => {
    if (isProcessing) return 'Thinking...';
    if (isSpeaking) return 'Speaking...';
    if (isRecording) return 'Listening...';
    return 'Ready to help!';
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Header */}
      <Paper sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
              <Typography variant="h4">{getTeacherAvatar()}</Typography>
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                AI English Teacher
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getTeacherStatus()}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Analytics">
              <IconButton onClick={() => setAnalyticsOpen(true)}>
                <Analytics />
              </IconButton>
            </Tooltip>
            <Tooltip title="History">
              <IconButton onClick={() => setHistoryOpen(true)}>
                <History />
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton onClick={() => setSettingsOpen(true)}>
                <Settings />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={analytics.learningProgress.vocabulary}
          sx={{ mt: 2 }}
        />
      </Paper>

      {/* Messages Area */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {messages.map((message, index) => (
          <Fade in timeout={300} key={message.id}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              {message.type === 'assistant' && (
                <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
                  <SmartToy />
                </Avatar>
              )}
              
              <Box sx={{ maxWidth: '70%' }}>
                <Card
                  sx={{
                    bgcolor: message.type === 'user' ? 'primary.main' : 'grey.100',
                    color: message.type === 'user' ? 'white' : 'text.primary',
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="body1">
                      {message.content}
                    </Typography>
                    
                    {message.examples && settings.showExamples && (
                      <Box sx={{ mt: 1 }}>
                        {message.examples.map((example, idx) => (
                          <Typography key={idx} variant="body2" sx={{ fontStyle: 'italic' }}>
                            💡 {example}
                          </Typography>
                        ))}
                      </Box>
                    )}
                    
                    {message.translations && settings.showTranslations && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          🌐 {message.translations.ar}
                        </Typography>
                      </Box>
                    )}
                    
                    {message.relatedTopics && settings.showRelatedTopics && (
                      <Box sx={{ mt: 1 }}>
                        {message.relatedTopics.map((topic, idx) => (
                          <Chip
                            key={idx}
                            label={topic}
                            size="small"
                            sx={{ mr: 0.5 }}
                            onClick={() => handleSendMessage(topic)}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
                
                {/* Message Actions */}
                <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'flex-end' }}>
                  {message.type === 'assistant' && (
                    <>
                      <Tooltip title="Good response">
                        <IconButton
                          size="small"
                          onClick={() => handleRating(message.id, 'up')}
                          color={message.rating === 'up' ? 'primary' : 'default'}
                        >
                          <ThumbUp fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Not helpful">
                        <IconButton
                          size="small"
                          onClick={() => handleRating(message.id, 'down')}
                          color={message.rating === 'down' ? 'error' : 'default'}
                        >
                          <ThumbDown fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  <Tooltip title={message.isBookmarked ? 'Remove bookmark' : 'Bookmark'}>
                    <IconButton
                      size="small"
                      onClick={() => handleBookmark(message.id)}
                      color={message.isBookmarked ? 'primary' : 'default'}
                    >
                      {message.isBookmarked ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              {message.type === 'user' && (
                <Avatar sx={{ ml: 1, bgcolor: 'secondary.main' }}>
                  <Person />
                </Avatar>
              )}
            </Box>
          </Fade>
        ))}
        
        {isProcessing && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            💡 Suggested questions:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                variant="outlined"
                size="small"
                onClick={() => handleSendMessage(suggestion)}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Input Area */}
      <Paper sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about English..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputValue);
              }
            }}
            disabled={isProcessing}
          />
          
          <Tooltip title={isRecording ? 'Stop recording' : 'Start recording'}>
            <IconButton
              onClick={toggleRecording}
              color={isRecording ? 'error' : 'primary'}
              disabled={isProcessing}
            >
              {isRecording ? <MicOff /> : <Mic />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Speak response">
            <IconButton
              onClick={() => speakText(messages[messages.length - 1]?.content || '')}
              color={isSpeaking ? 'primary' : 'default'}
              disabled={!settings.voiceEnabled || messages.length === 0}
            >
              {isSpeaking ? <VolumeUp /> : <VolumeOff />}
            </IconButton>
          </Tooltip>
          
          <Button
            variant="contained"
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isProcessing}
            startIcon={<Send />}
          >
            Send
          </Button>
        </Box>
      </Paper>

      {/* Settings Drawer */}
      <Drawer
        anchor="right"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            AI Teacher Settings
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.voiceEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, voiceEnabled: e.target.checked }))}
              />
            }
            label="Voice Enabled"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.autoPlay}
                onChange={(e) => setSettings(prev => ({ ...prev, autoPlay: e.target.checked }))}
              />
            }
            label="Auto-play Responses"
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">Voice Speed</Typography>
            <Slider
              value={settings.voiceSpeed}
              onChange={(e, value) => setSettings(prev => ({ ...prev, voiceSpeed: value as number }))}
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
          </Box>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Language</InputLabel>
            <Select
              value={settings.language}
              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value as any }))}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="ar">Arabic</MenuItem>
              <MenuItem value="both">Both</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={settings.difficulty}
              onChange={(e) => setSettings(prev => ({ ...prev, difficulty: e.target.value as any }))}
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
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
            Learning Analytics
          </Typography>
          
          <Typography variant="body2">
            Total Sessions: {analytics.totalSessions}
          </Typography>
          <Typography variant="body2">
            Questions Asked: {analytics.questionsAsked}
          </Typography>
          <Typography variant="body2">
            Concepts Learned: {analytics.conceptsLearned}
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">Learning Progress</Typography>
            {Object.entries(analytics.learningProgress).map(([skill, progress]) => (
              <Box key={skill} sx={{ mb: 1 }}>
                <Typography variant="caption">{skill}</Typography>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
            ))}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default AITeacher;
