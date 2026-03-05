import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { readingStories } from '../core/data';
import { useProgress } from '../core/ProgressContext';
import { generateDynamicContent } from '../core/api';
import { playClick, playCorrect, playSuccess, playWrong, speakWord } from '../core/sounds';

const levelColors: Record<string, string> = {
  Easy: '#43A047',
  Medium: '#FB8C00',
  Hard: '#5E35B1',
};

type Story = (typeof readingStories)[number];

type QuestStep =
  | { type: 'read'; content: string }
  | { type: 'quiz'; content: Story['questions'][number] };

function buildQuestSteps(story: Story): QuestStep[] {
  const paragraphs = story.text.split('\n\n').filter(Boolean);
  const steps: QuestStep[] = [];
  const maxLen = Math.max(paragraphs.length, story.questions.length);

  for (let i = 0; i < maxLen; i += 1) {
    if (paragraphs[i]) {
      steps.push({ type: 'read', content: paragraphs[i] });
    }
    if (story.questions[i]) {
      steps.push({ type: 'quiz', content: story.questions[i] });
    }
  }

  return steps;
}

export default function ReadingPage() {
  const navigate = useNavigate();
  const { progress, markStoryDone } = useProgress();

  const [dynamicStories, setDynamicStories] = useState<Story[]>([]);
  const [generatingStory, setGeneratingStory] = useState(false);

  const [openStory, setOpenStory] = useState<Story | null>(null);
  const [phase, setPhase] = useState<'intro' | 'quest' | 'result'>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);

  const allStories = useMemo(() => [...dynamicStories, ...readingStories], [dynamicStories]);
  const completed = progress.storiesCompleted.filter((id) => allStories.some((story) => story.id === id)).length;
  const pct = Math.round((completed / Math.max(1, allStories.length)) * 100);

  const questSteps = useMemo(() => (openStory ? buildQuestSteps(openStory) : []), [openStory]);

  const startStory = (story: Story) => {
    playClick();
    setOpenStory(story);
    setPhase('intro');
    setCurrentStep(0);
    setScore(0);
  };

  const closeDialog = () => {
    playClick();
    setOpenStory(null);
  };

  const nextStep = () => {
    if (!openStory) return;
    playClick();
    if (currentStep + 1 < questSteps.length) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    setPhase('result');
    if (!progress.storiesCompleted.includes(openStory.id)) {
      markStoryDone(openStory.id);
    }
    playSuccess();
  };

  const handleAnswer = (index: number) => {
    const step = questSteps[currentStep];
    if (!step || step.type !== 'quiz') return;

    const isCorrect = index === step.content.answer;
    if (isCorrect) {
      playCorrect();
      setScore((value) => value + 1);
    } else {
      playWrong();
    }

    setTimeout(nextStep, 700);
  };

  const createDynamicStory = async () => {
    setGeneratingStory(true);
    try {
      const response = await generateDynamicContent({ topic: 'grade 4 school life', level: 'A1', mode: 'story' });
      const text = String(response.content?.text || '').trim();
      if (!text) return;

      const questions = Array.isArray(response.content?.questions) ? response.content.questions : [];
      const generated: Story = {
        id: 10000 + dynamicStories.length + 1,
        title: response.content?.title || `AI Story ${dynamicStories.length + 1}`,
        emoji: '🤖',
        level: 'Medium',
        color: '#00897B',
        text,
        questions:
          questions.length > 0
            ? questions.slice(0, 4).map((q) => ({
                question: String(q.question || 'What happened in the story?'),
                options: Array.isArray(q.options) && q.options.length === 4
                  ? q.options
                  : ['The team studied English.', 'They canceled class.', 'No one attended.', 'They forgot the lesson.'],
                answer: Math.max(0, Math.min(3, Number(q.answer || 0))),
              }))
            : [
                {
                  question: 'What is the main idea of this story?',
                  options: ['Team learning', 'Space mission', 'Shopping list', 'Weather report'],
                  answer: 0,
                },
              ],
      };

      setDynamicStories((prev) => [generated, ...prev].slice(0, 5));
    } finally {
      setGeneratingStory(false);
    }
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
          py: 4,
          px: 3,
          mb: 4,
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(76,175,80,0.3)',
        }}
      >
        <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, mb: 1 }}>
          Reading Quests
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.88)', mb: 2 }}>
          Read stories, answer checks, and improve comprehension.
        </Typography>
        <Box sx={{ maxWidth: 440, mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700 }}>
              {completed} / {allStories.length} quests completed
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800 }}>
              {pct}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{
              height: 10,
              borderRadius: 5,
              background: 'rgba(255,255,255,0.28)',
              '& .MuiLinearProgress-bar': { background: '#FFD54F', borderRadius: 5 },
            }}
          />
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 } }}>
        <Button onClick={() => navigate('/home')} sx={{ mb: 3, color: '#2E7D32', fontWeight: 700 }}>
          Back to Home
        </Button>
        <Button variant="contained" sx={{ mb: 3, ml: 1, fontWeight: 700 }} onClick={createDynamicStory} disabled={generatingStory}>
          {generatingStory ? 'Generating...' : 'Generate AI Quest'}
        </Button>

        <Grid container spacing={3}>
          {allStories.map((story) => {
            const done = progress.storiesCompleted.includes(story.id);
            return (
              <Grid size={{ xs: 12, md: 4 }} key={story.id}>
                <motion.div whileHover={{ y: -4 }}>
                  <Card sx={{ height: '100%', borderRadius: 4, border: done ? `2px solid ${story.color}` : '2px solid transparent' }}>
                    <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <Box
                        sx={{
                          width: '100%',
                          height: 130,
                          borderRadius: 3,
                          background: `linear-gradient(135deg, ${story.color}, ${story.color}BB)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '4rem',
                          mb: 2,
                        }}
                      >
                        {story.emoji}
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                        {story.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip size="small" label={story.level} sx={{ background: `${levelColors[story.level]}1F`, color: levelColors[story.level], fontWeight: 700 }} />
                        <Chip size="small" label={`${story.questions.length} Qs`} sx={{ fontWeight: 700 }} />
                        {done && <Chip size="small" label="Done" color="success" />}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                        {story.text.slice(0, 150)}...
                      </Typography>
                      <Button variant="contained" fullWidth sx={{ background: story.color, fontWeight: 800 }} onClick={() => startStory(story)}>
                        {done ? 'Read Again' : 'Start Quest'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Dialog open={Boolean(openStory)} onClose={closeDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, maxHeight: '90vh' } }}>
        {openStory && (
          <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '70vh' }}>
            <Box sx={{ p: 2.5, bgcolor: openStory.color, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{openStory.title}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Interactive Quest</Typography>
              </Box>
              <IconButton onClick={closeDialog} sx={{ color: '#fff' }}>×</IconButton>
            </Box>

            {phase === 'quest' && (
              <LinearProgress
                variant="determinate"
                value={(currentStep / Math.max(1, questSteps.length)) * 100}
                sx={{ height: 6, '& .MuiLinearProgress-bar': { background: openStory.color } }}
              />
            )}

            <Box sx={{ flex: 1, overflowY: 'auto', p: 3.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AnimatePresence mode="wait">
                {phase === 'intro' && (
                  <motion.div key="intro" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', width: '100%' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Ready to begin?</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                      Read each part carefully. Short checks appear between paragraphs.
                    </Typography>
                    <Button variant="contained" size="large" onClick={() => setPhase('quest')} sx={{ bgcolor: openStory.color, fontWeight: 800 }}>
                      Start
                    </Button>
                  </motion.div>
                )}

                {phase === 'quest' && questSteps[currentStep] && (
                  <motion.div key={`step-${currentStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ width: '100%', maxWidth: 640 }}>
                    {(() => {
                      const step = questSteps[currentStep];
                      if (step.type === 'read') {
                        return (
                      <Card sx={{ p: 3, borderRadius: 3, border: `2px solid ${openStory.color}33` }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Chip label="Read" sx={{ bgcolor: `${openStory.color}20`, color: openStory.color, fontWeight: 700 }} />
                          <IconButton onClick={() => speakWord(step.content)} sx={{ color: openStory.color }}>🔊</IconButton>
                        </Box>
                        <Typography sx={{ lineHeight: 1.8, fontWeight: 600 }}>{step.content}</Typography>
                        <Button variant="contained" fullWidth sx={{ mt: 3, bgcolor: openStory.color, fontWeight: 800 }} onClick={nextStep}>
                          Continue
                        </Button>
                      </Card>
                        );
                      }
                      return (
                      <Card sx={{ p: 3, borderRadius: 3, border: '2px solid #FFB74D', bgcolor: '#FFF8E1' }}>
                        <Typography sx={{ fontWeight: 800, mb: 2.5 }}>{step.content.question}</Typography>
                        <Grid container spacing={1.5}>
                          {step.content.options.map((option, index) => (
                            <Grid size={{ xs: 12, sm: 6 }} key={`${option}-${index}`}>
                              <Button fullWidth variant="outlined" sx={{ justifyContent: 'flex-start', borderRadius: 2 }} onClick={() => handleAnswer(index)}>
                                {option}
                              </Button>
                            </Grid>
                          ))}
                        </Grid>
                      </Card>
                      );
                    })()}
                  </motion.div>
                )}

                {phase === 'result' && (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 1.5 }}>
                      {score >= Math.ceil(openStory.questions.length / 2) ? 'Great Job' : 'Keep Practicing'}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                      Score: {score}/{openStory.questions.length}
                    </Typography>
                    <Button variant="contained" size="large" onClick={closeDialog} sx={{ bgcolor: openStory.color, fontWeight: 800 }}>
                      Close
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
}
