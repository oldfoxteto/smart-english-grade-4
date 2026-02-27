// AI-Powered Conversation Practice Module
import React, { useState, useEffect, useRef } from 'react';
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
  Fab,
  Badge,
  CircularProgress,
} from '@mui/material';
import {
  Chat,
  Mic,
  MicOff,
  Send,
  VolumeUp,
  VolumeOff,
  Psychology,
  RecordVoiceOver,
  Stop,
  Refresh,
  Star,
  TrendingUp,
  Speed,
  Settings,
  Language,
  Translate,
  CheckCircle,
  Error,
  Warning,
  Lightbulb,
  School,
  EmojiEvents,
} from '@mui/icons-material';

interface ConversationScenario {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  duration: number;
  context: string;
  aiTutor: {
    name: string;
    personality: string;
    avatar: string;
    specialties: string[];
  };
  objectives: string[];
  vocabulary: Array<{
    word: string;
    translation: string;
    example: string;
  }>;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  arabicText?: string;
  corrections?: Array<{
    original: string;
    corrected: string;
    explanation: string;
  }>;
  pronunciation?: {
    score: number;
    feedback: string;
    improvements: string[];
  };
}

const mockScenarios: ConversationScenario[] = [
  {
    id: '1',
    title: 'Restaurant Conversation',
    arabicTitle: 'محادثة في المطعم',
    description: 'Practice ordering food and making small talk',
    arabicDescription: 'تدرب على طلب الطعام وإجراء محادثات قصيرة',
    difficulty: 'intermediate',
    category: 'Daily Life',
    duration: 15,
    context: 'You are at a restaurant and want to order food',
    aiTutor: {
      name: 'Sarah',
      personality: 'Friendly and patient',
      avatar: '/avatars/sarah.jpg',
      specialties: ['Pronunciation', 'Grammar', 'Fluency']
    },
    objectives: [
      'Order food confidently',
      'Ask questions about menu items',
      'Make small talk with waiter'
    ],
    vocabulary: [
      {
        word: 'recommendation',
        translation: 'توصية',
        example: 'What do you recommend?'
      },
      {
        word: 'delicious',
        translation: 'لذيذ',
        example: 'This looks delicious!'
      }
    ]
  }
];

const AIConversationModule: React.FC = () => {
  const [scenarios, setScenarios] = useState<ConversationScenario[]>([]);
  const [currentScenario, setCurrentScenario] = useState<ConversationScenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [conversationStats, setConversationStats] = useState({
    duration: 0,
    messagesCount: 0,
    vocabularyUsed: 0,
    grammarScore: 0,
    pronunciationScore: 0
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setTimeout(() => {
      setScenarios(mockScenarios);
    }, 1000);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartConversation = (scenario: ConversationScenario) => {
    setCurrentScenario(scenario);
    setMessages([{
      id: '1',
      text: `Hi! I'm ${scenario.aiTutor.name}, your AI tutor. Let's practice ${scenario.title}!`,
      sender: 'ai',
      timestamp: new Date(),
      arabicText: `مرحباً! أنا ${scenario.aiTutor.name}، مدربك الذكي. لنتدرب على ${scenario.arabicTitle}!`
    }]);
    setConversationStats({
      duration: 0,
      messagesCount: 1,
      vocabularyUsed: 0,
      grammarScore: 0,
      pronunciationScore: 0
    });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText),
        sender: 'ai',
        timestamp: new Date(),
        corrections: generateCorrections(inputText),
        pronunciation: generatePronunciationFeedback(inputText)
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
      
      // Update stats
      setConversationStats(prev => ({
        ...prev,
        messagesCount: prev.messagesCount + 2,
        vocabularyUsed: prev.vocabularyUsed + Math.floor(Math.random() * 3),
        grammarScore: Math.min(100, prev.grammarScore + Math.floor(Math.random() * 10)),
        pronunciationScore: Math.min(100, prev.pronunciationScore + Math.floor(Math.random() * 15))
      }));
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "That's great! Your pronunciation is improving. Let's continue with the next part of our conversation.",
      "Excellent! You used some good vocabulary there. Can you tell me more about that?",
      "I understand what you mean. Try using 'I would like' instead of 'I want' for more politeness.",
      "Good job! Let's practice asking questions now. What would you like to know about this topic?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateCorrections = (text: string) => {
    // Simulate AI corrections
    if (Math.random() > 0.7) {
      return [{
        original: "I want",
        corrected: "I would like",
        explanation: "Using 'I would like' is more polite in formal situations."
      }];
    }
    return [];
  };

  const generatePronunciationFeedback = (text: string) => {
    return {
      score: Math.floor(Math.random() * 30) + 70,
      feedback: "Good pronunciation! Focus on the 'th' sound in 'the'.",
      improvements: ["Practice the 'th' sound", "Slow down a bit", "Good rhythm!"]
    };
  };

  const handleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Start voice recognition
      if ('webkitSpeechRecognition' in window) {
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsRecording(false);
        };
        
        recognition.onerror = () => {
          setIsRecording(false);
        };
        
        recognition.start();
      }
    } else {
      setIsRecording(false);
    }
  };

  const handleEndConversation = () => {
    setCurrentScenario(null);
    setMessages([]);
    setInputText('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        🤖 وحدة المحادثة الذكية
      </Typography>

      {!currentScenario ? (
        <Grid container spacing={3}>
          {scenarios.map((scenario) => (
            <Grid item xs={12} md={6} key={scenario.id}>
              <Card sx={{ height: '100%', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Chat />
                      </Avatar>
                      <Stack direction="row" spacing={1}>
                        <Chip label={scenario.difficulty} color="primary" size="small" />
                        <Chip label={`${scenario.duration} دقيقة`} size="small" />
                      </Stack>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {scenario.arabicTitle}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      {scenario.arabicDescription}
                    </Typography>

                    <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        🤖 المدرب الذكي: {scenario.aiTutor.name}
                      </Typography>
                      <Typography variant="body2">
                        {scenario.aiTutor.personality}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {scenario.aiTutor.specialties.map((specialty, index) => (
                          <Chip key={index} label={specialty} variant="outlined" size="small" />
                        ))}
                      </Stack>
                    </Box>

                    <Button
                      startIcon={<Chat />}
                      onClick={() => handleStartConversation(scenario)}
                      variant="contained"
                      fullWidth
                    >
                      بدء المحادثة
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Stack spacing={2} sx={{ height: '70vh' }}>
          {/* Conversation Header */}
          <Paper sx={{ p: 2, bgcolor: 'primary.50' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={currentScenario.aiTutor.avatar}>
                  <Psychology />
                </Avatar>
                <Box>
                  <Typography variant="h6">{currentScenario.aiTutor.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentScenario.arabicTitle}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Tooltip title="إحصائيات المحادثة">
                  <IconButton>
                    <TrendingUp />
                  </IconButton>
                </Tooltip>
                <Button
                  startIcon={<Stop />}
                  onClick={handleEndConversation}
                  variant="outlined"
                >
                  إنهاء
                </Button>
              </Stack>
            </Box>
          </Paper>

          {/* Messages Area */}
          <Paper sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                      color: message.sender === 'user' ? 'white' : 'text.primary',
                      p: 2,
                      borderRadius: 2,
                      position: 'relative'
                    }}
                  >
                    <Typography variant="body1">
                      {message.text}
                    </Typography>
                    
                    {/* AI Corrections */}
                    {message.corrections && message.corrections.length > 0 && (
                      <Box sx={{ mt: 1, p: 1, bgcolor: 'warning.50', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          💡 تحسينات:
                        </Typography>
                        {message.corrections.map((correction, index) => (
                          <Typography key={index} variant="caption">
                            "{correction.original}" → "{correction.corrected}"
                          </Typography>
                        ))}
                      </Box>
                    )}

                    {/* Pronunciation Feedback */}
                    {message.pronunciation && (
                      <Box sx={{ mt: 1, p: 1, bgcolor: 'success.50', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          🎤 النطق: {message.pronunciation.score}/100
                        </Typography>
                        <Typography variant="caption">
                          {message.pronunciation.feedback}
                        </Typography>
                      </Box>
                    )}

                    <Typography variant="caption" sx={{ mt: 1, opacity: 0.7 }}>
                      {message.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'grey.200' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton
                  onClick={handleVoiceRecording}
                  color={isRecording ? 'error' : 'primary'}
                >
                  {isRecording ? <MicOff /> : <Mic />}
                </IconButton>
                
                <TextField
                  fullWidth
                  placeholder="اكتب رسالتك هنا..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isProcessing}
                />
                
                <IconButton onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
                
                <Button
                  startIcon={<Send />}
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isProcessing}
                  variant="contained"
                >
                  إرسال
                </Button>
              </Stack>

              {isProcessing && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="caption">الذكاء الاصطناعي يفكر...</Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Stats Bar */}
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} justifyContent="space-around">
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary.main">
                  {conversationStats.messagesCount}
                </Typography>
                <Typography variant="caption">رسائل</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">
                  {conversationStats.grammarScore}%
                </Typography>
                <Typography variant="caption">قواعد</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main">
                  {conversationStats.pronunciationScore}%
                </Typography>
                <Typography variant="caption">نطق</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="secondary.main">
                  {conversationStats.vocabularyUsed}
                </Typography>
                <Typography variant="caption">مفردات</Typography>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      )}
    </Box>
  );
};

export default AIConversationModule;
