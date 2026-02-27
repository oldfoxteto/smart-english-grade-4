// AI-Powered Reading Comprehension Module
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  MenuBook,
  Translate,
  RecordVoiceOver,
  Speed,
  CheckCircle,
  Star,
  TrendingUp,
  Lightbulb,
  Psychology,
  Timer,
  VolumeUp,
  Bookmark,
  BookmarkBorder,
  Share,
  Download,
} from '@mui/icons-material';

interface ReadingPassage {
  id: string;
  title: string;
  arabicTitle: string;
  content: string;
  arabicContent: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  readingTime: number;
  wordCount: number;
  vocabulary: Array<{
    word: string;
    translation: string;
    context: string;
    difficulty: string;
  }>;
  questions: Array<{
    id: string;
    question: string;
    arabicQuestion: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
  aiInsights: {
    mainTheme: string;
    keyPoints: string[];
    suggestedLevel: string;
    relatedTopics: string[];
  };
}

const mockReadingPassages: ReadingPassage[] = [
  {
    id: '1',
    title: 'The Power of Reading',
    arabicTitle: 'قوة القراءة',
    content: 'Reading is one of the most powerful tools for learning and personal growth. When we read, we expose ourselves to new ideas, different perspectives, and valuable knowledge that can transform our lives...',
    arabicContent: 'القراءة هي واحدة من أقوى الأدوات للتعلم والنمو الشخصي. عندما نقرأ، نعرض أنفسنا لأفكار جديدة ووجهات نظر مختلفة ومعرفة قيمة يمكن أن تحول حياتنا...',
    difficulty: 'intermediate',
    category: 'Personal Development',
    readingTime: 5,
    wordCount: 250,
    vocabulary: [
      {
        word: 'expose',
        translation: 'يعرض',
        context: 'When we read, we expose ourselves to new ideas',
        difficulty: 'intermediate'
      },
      {
        word: 'perspectives',
        translation: 'وجهات نظر',
        context: 'different perspectives and valuable knowledge',
        difficulty: 'intermediate'
      }
    ],
    questions: [
      {
        id: '1',
        question: 'What is the main benefit of reading according to the passage?',
        arabicQuestion: 'ما هي الفائدة الرئيسية للقراءة حسب المقطع؟',
        options: [
          'Entertainment only',
          'Learning and personal growth',
          'Improving memory',
          'Making friends'
        ],
        correctAnswer: 1,
        explanation: 'The passage states that reading is a powerful tool for learning and personal growth.'
      }
    ],
    aiInsights: {
      mainTheme: 'Personal Development Through Reading',
      keyPoints: ['Reading exposes to new ideas', 'Different perspectives', 'Transformative knowledge'],
      suggestedLevel: 'B1 Intermediate',
      relatedTopics: ['Critical Thinking', 'Vocabulary Building', 'Cultural Awareness']
    }
  }
];

const AIReadingModule: React.FC = () => {
  const [passages, setPassages] = useState<ReadingPassage[]>([]);
  const [currentPassage, setCurrentPassage] = useState<ReadingPassage | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPassages(mockReadingPassages);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStartReading = (passage: ReadingPassage) => {
    setCurrentPassage(passage);
    setReadingProgress(0);
    setReadingTime(0);
  };

  const handleBookmark = (passageId: string) => {
    setBookmarked(prev => 
      prev.includes(passageId) 
        ? prev.filter(id => id !== passageId)
        : [...prev, passageId]
    );
  };

  const handleTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        📚 وحدة القراءة المدعومة بالذكاء الاصطناعي
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={3}>
          {/* Reading Passages Grid */}
          <Grid container spacing={3}>
            {passages.map((passage) => (
              <Grid item xs={12} md={6} key={passage.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <MenuBook />
                        </Avatar>
                        <Stack direction="row" spacing={1}>
                          <Chip label={passage.difficulty} color="primary" size="small" />
                          <Chip label={`${passage.readingTime} دقيقة`} size="small" />
                        </Stack>
                      </Box>
                      
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {passage.arabicTitle}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        {passage.arabicContent.substring(0, 100)}...
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          {passage.wordCount} كلمة • {passage.category}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            onClick={() => handleBookmark(passage.id)}
                            color={bookmarked.includes(passage.id) ? 'primary' : 'default'}
                          >
                            {bookmarked.includes(passage.id) ? <Bookmark /> : <BookmarkBorder />}
                          </IconButton>
                          <IconButton onClick={() => handleStartReading(passage)}>
                            <MenuBook />
                          </IconButton>
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Active Reading Dialog */}
          {currentPassage && (
            <Dialog open={true} maxWidth="lg" fullWidth>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">{currentPassage.arabicTitle}</Typography>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="نطق النص">
                      <IconButton onClick={() => handleTextToSpeech(currentPassage.content)}>
                        <VolumeUp />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="رؤى الذكاء الاصطناعي">
                      <IconButton onClick={() => setShowAIInsights(!showAIInsights)}>
                        <Psychology />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              </DialogTitle>
              
              <DialogContent>
                <Stack spacing={3}>
                  {/* Reading Progress */}
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      التقدم: {readingProgress}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={readingProgress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  {/* Main Content */}
                  <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'right' }}>
                      {currentPassage.arabicContent}
                    </Typography>
                  </Paper>

                  {/* AI Insights Panel */}
                  {showAIInsights && (
                    <Paper sx={{ p: 3, bgcolor: 'primary.50', border: '2px solid', borderColor: 'primary.main' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Psychology color="primary" />
                        رؤى الذكاء الاصطناعي
                      </Typography>
                      
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            الموضوع الرئيسي:
                          </Typography>
                          <Typography variant="body2">
                            {currentPassage.aiInsights.mainTheme}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            النقاط الرئيسية:
                          </Typography>
                          <List dense>
                            {currentPassage.aiInsights.keyPoints.map((point, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <CheckCircle color="success" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={point} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                        
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            المستوى المقترح:
                          </Typography>
                          <Chip label={currentPassage.aiInsights.suggestedLevel} color="primary" />
                        </Box>
                        
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            مواضيع ذات صلة:
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {currentPassage.aiInsights.relatedTopics.map((topic, index) => (
                              <Chip key={index} label={topic} variant="outlined" size="small" />
                            ))}
                          </Stack>
                        </Box>
                      </Stack>
                    </Paper>
                  )}

                  {/* Vocabulary Highlight */}
                  <Box>
                    <Button
                      startIcon={<Lightbulb />}
                      onClick={() => setShowVocabulary(!showVocabulary)}
                      variant="outlined"
                      fullWidth
                    >
                      {showVocabulary ? 'إخفاء' : 'عرض'} المفردات المهمة
                    </Button>
                    
                    {showVocabulary && (
                      <Paper sx={{ mt: 2, p: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          📖 المفردات المهمة
                        </Typography>
                        <List>
                          {currentPassage.vocabulary.map((vocab, index) => (
                            <ListItem key={index}>
                              <ListItemText
                                primary={
                                  <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                      {vocab.word}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {vocab.translation}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      "{vocab.context}"
                                    </Typography>
                                  </Box>
                                }
                              />
                              <Chip label={vocab.difficulty} size="small" />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    )}
                  </Box>
                </Stack>
              </DialogContent>
              
              <DialogActions>
                <Button onClick={() => setCurrentPassage(null)}>
                  إغلاق
                </Button>
                <Button variant="contained" color="primary">
                  بدء الاختبار
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default AIReadingModule;
