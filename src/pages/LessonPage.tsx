import { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Chip, IconButton, Stack, Avatar, TextField, LinearProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack, VolumeUp, CheckCircle, Cancel, EmojiEvents, SentimentDissatisfied, Refresh } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { getA1LessonById, type A1Lesson } from '../core/a1Content';
import { playSuccess, playClick } from '../core/sounds';
import { getMasteryThreshold, recordLessonAttempt, type RemediationPlan } from '../core/masteryEngine';
import { updateLessonProgress } from '../core/api';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const LessonPage = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();

  const [lesson, setLesson] = useState<A1Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | number>>({});
  const [showResult, setShowResult] = useState(false);
  const [exerciseResults, setExerciseResults] = useState<Record<string, boolean>>({});
  const [lessonScore, setLessonScore] = useState<number | null>(null);
  const [lessonMastery, setLessonMastery] = useState<number | null>(null);
  const [remediationPlan, setRemediationPlan] = useState<RemediationPlan | null>(null);

  useEffect(() => {
    if (lessonId) {
      const lessonData = getA1LessonById(lessonId);
      setLesson(lessonData || null);
      setLoading(false);
    }
  }, [lessonId]);

  const handleExerciseAnswer = (exerciseId: string, answer: string | number) => {
    if (showResult) return;
    playClick();
    setSelectedAnswers(prev => ({ ...prev, [exerciseId]: answer }));
  };

  const handleFillBlankChange = (exerciseId: string, value: string) => {
    if (showResult) return;
    setSelectedAnswers(prev => ({ ...prev, [exerciseId]: value }));
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleSubmitExercises = async () => {
    if (!lesson?.exercises) return;
    const results: Record<string, boolean> = {};
    lesson.exercises.forEach(ex => {
      const userAnswer = selectedAnswers[ex.id];
      if (ex.type === 'fill-blank') {
        results[ex.id] = String(userAnswer ?? '').trim().toLowerCase() === String(ex.correctAnswer).toLowerCase();
      } else {
        results[ex.id] = userAnswer === ex.correctAnswer;
      }
    });
    setExerciseResults(results);
    setShowResult(true);

    const correctCount = Object.values(results).filter(Boolean).length;
    if (correctCount === lesson.exercises.length) {
      playSuccess();
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFC107', '#4CAF50', '#2196F3', '#E91E63']
      });
    }

    const masteryUpdate = recordLessonAttempt({
      lessonId: lesson.id,
      lessonCategory: lesson.category,
      totalExercises: lesson.exercises.length,
      correctExercises: correctCount,
      weakSkills: []
    });

    setLessonScore(masteryUpdate.scorePercent);
    setLessonMastery(masteryUpdate.lessonMastery);
    setRemediationPlan(masteryUpdate.activeRemediationPlan);

    const completed = masteryUpdate.lessonMastery >= getMasteryThreshold();
    updateLessonProgress(lesson.id, masteryUpdate.lessonMastery, completed).catch(() => {
      // Keep local progress as fallback if remote sync fails.
    });
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setShowResult(false);
    setExerciseResults({});
    setLessonScore(null);
    setLessonMastery(null);
    setRemediationPlan(null);
  };

  const allAnswered = lesson?.exercises?.every(ex => {
    const ans = selectedAnswers[ex.id];
    if (ex.type === 'fill-blank') return typeof ans === 'string' && ans.trim().length > 0;
    return ans !== undefined;
  }) ?? false;

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography>Loading...</Typography></Box>;
  if (!lesson) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography>Lesson not found</Typography></Box>;

  const totalExercises = lesson.exercises?.length ?? 0;
  const correctCount = Object.values(exerciseResults).filter(Boolean).length;
  const isPerfect = showResult && correctCount === totalExercises;
  const isPassing = showResult && (lessonScore ?? 0) >= 70;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FBE7', fontFamily: '"Nunito", sans-serif', pb: 10 }}>
      {/* App Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pt: 4, background: 'linear-gradient(135deg, rgba(76,175,80,0.95), rgba(56,142,60,0.95))', color: 'white', borderBottomLeftRadius: 28, borderBottomRightRadius: 28, mb: 4, boxShadow: '0 8px 24px rgba(76,175,80,0.3)' }}>
        <IconButton onClick={() => navigate('/home')} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', width: 44, height: 44, '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 900, fontFamily: '"Merriweather", serif' }}>
          {lesson.title}
        </Typography>
        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 44, height: 44, fontSize: '1.3rem' }}>
          🎟️
        </Avatar>
      </Box>

      <Box sx={{ px: 2, maxWidth: 600, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>

        {/* Badges Card */}
        <Card sx={{ borderRadius: 4, border: '1px solid #E8F5E9', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
              <Chip label={lesson.level} sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 800, borderRadius: 2 }} />
              <Chip label={`${lesson.duration} min`} sx={{ bgcolor: '#E3F2FD', color: '#1565C0', fontWeight: 800, borderRadius: 2 }} />
              <Chip label="50 XP" sx={{ bgcolor: '#FFF3E0', color: '#E65100', fontWeight: 800, borderRadius: 2 }} />
              <Chip label={lesson.category} sx={{ bgcolor: '#F3E5F5', color: '#7B1FA2', fontWeight: 800, borderRadius: 2, textTransform: 'capitalize' }} />
            </Stack>
            <Typography sx={{ color: '#616161', lineHeight: 1.6 }}>
              {lesson.description}
            </Typography>
          </CardContent>
        </Card>

        {/* Key Vocabulary */}
        {lesson.vocabulary && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B5E20', mb: 2 }}>
              📖 Key Vocabulary
            </Typography>
            <Stack spacing={2}>
              {lesson.vocabulary.map((v, i) => (
                <Card key={i} sx={{ borderRadius: 4, border: '1px solid #E8F5E9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'relative' }}>
                  <CardContent sx={{ p: 2.5, pr: 14 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#2E7D32', mb: 0.5 }}>{v.word}</Typography>
                    <Typography variant="body2" sx={{ color: '#757575', mb: 0.5 }}>
                      {v.pronunciation} • {v.translation}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9E9E9E' }}>
                      {v.exampleTranslation}
                    </Typography>
                    <Button
                      onClick={() => speakText(v.word)}
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', borderRadius: 4, px: 2, bgcolor: '#4CAF50', boxShadow: 'none', minWidth: 'auto' }}
                      startIcon={<VolumeUp />}
                    >
                      Listen
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        )}

        {/* Grammar */}
        {lesson.grammar && (
          <Card sx={{ borderRadius: 4, border: '1px solid #E8F5E9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B5E20', mb: 1 }}>📝 {lesson.grammar.title}</Typography>
              <Typography sx={{ color: '#616161', mb: 2 }}>{lesson.grammar.explanation}</Typography>
              <Box sx={{ bgcolor: '#F5F5F5', p: 2, borderRadius: 2 }}>
                <Typography sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#2E7D32' }}>{lesson.grammar.formula}</Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Quick Practice */}
        {lesson.exercises && lesson.exercises.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B5E20', mb: 2 }}>
              🎯 Quick Practice
            </Typography>
            <Stack spacing={2.5}>
              {lesson.exercises.map((ex, exIndex) => {
                const isCorrect = exerciseResults[ex.id];
                const isWrong = showResult && !isCorrect;
                const answered = showResult;

                // Determine border/background based on result
                const cardBorder = answered
                  ? isCorrect ? '2px solid #4CAF50' : '2px solid #F44336'
                  : '1px solid #E8F5E9';
                const cardBg = answered
                  ? isCorrect ? 'linear-gradient(145deg, #fff, #F1F8E9)' : 'linear-gradient(145deg, #fff, #FFF3F3)'
                  : 'white';

                return (
                  <MotionCard
                    key={ex.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: exIndex * 0.1 }}
                    sx={{ borderRadius: 4, border: cardBorder, background: cardBg, boxShadow: answered ? (isCorrect ? '0 4px 16px rgba(76,175,80,0.15)' : '0 4px 16px rgba(244,67,54,0.15)') : '0 4px 12px rgba(0,0,0,0.02)', overflow: 'hidden' }}
                  >
                    {/* Question header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2.5, pb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 900, color: '#757575' }}>Q{exIndex + 1}</Typography>
                        </Box>
                        <Chip
                          label={ex.type === 'fill-blank' ? '✏️ Fill Blank' : '🔘 Multiple Choice'}
                          size="small"
                          sx={{ fontSize: '0.7rem', fontWeight: 700, bgcolor: '#F5F5F5', color: '#616161', height: 22 }}
                        />
                      </Box>
                      {answered && (
                        <AnimatePresence>
                          <MotionBox
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                          >
                            {isCorrect
                              ? <CheckCircle sx={{ color: '#4CAF50', fontSize: '1.8rem' }} />
                              : <Cancel sx={{ color: '#F44336', fontSize: '1.8rem' }} />
                            }
                          </MotionBox>
                        </AnimatePresence>
                      )}
                    </Box>

                    <CardContent sx={{ px: 3, pt: 1, pb: 3 }}>
                      <Typography sx={{ fontWeight: 800, color: '#2C3E50', mb: 2.5, fontSize: '1.05rem', lineHeight: 1.5 }}>
                        {ex.question}
                      </Typography>

                      {/* Multiple choice */}
                      {ex.type !== 'fill-blank' && ex.options && (
                        <Stack direction="row" flexWrap="wrap" gap={1.5} useFlexGap>
                          {ex.options.map((opt, oIdx) => {
                            const isSelected = selectedAnswers[ex.id] === oIdx;
                            const isCorrectOption = oIdx === ex.correctAnswer;

                            let btnBg = 'transparent';
                            let btnColor = '#757575';
                            let btnBorder = '#E0E0E0';
                            let btnShadow = 'none';

                            if (answered) {
                              if (isCorrectOption) {
                                btnBg = '#4CAF50'; btnColor = 'white'; btnBorder = '#388E3C';
                                btnShadow = '0 4px 12px rgba(76,175,80,0.3)';
                              } else if (isSelected && !isCorrectOption) {
                                btnBg = '#F44336'; btnColor = 'white'; btnBorder = '#D32F2F';
                                btnShadow = '0 4px 12px rgba(244,67,54,0.3)';
                              }
                            } else if (isSelected) {
                              btnBg = '#2196F3'; btnColor = 'white'; btnBorder = '#1976D2';
                              btnShadow = '0 4px 12px rgba(33,150,243,0.3)';
                            }

                            return (
                              <Box sx={{ width: { xs: '48%', sm: '48%' } }} key={oIdx}>
                                <motion.div whileHover={!answered ? { scale: 1.02 } : {}} whileTap={!answered ? { scale: 0.97 } : {}}>
                                  <Button
                                    fullWidth
                                    disabled={answered}
                                    onClick={() => handleExerciseAnswer(ex.id, oIdx)}
                                    sx={{
                                      borderRadius: 3, py: 1.5, fontWeight: 700,
                                      textTransform: 'none', fontSize: '0.9rem',
                                      border: `2px solid ${btnBorder}`,
                                      bgcolor: btnBg, color: btnColor,
                                      boxShadow: btnShadow,
                                      '&.Mui-disabled': { color: btnColor, bgcolor: btnBg, border: `2px solid ${btnBorder}` },
                                      transition: 'all 0.2s',
                                    }}
                                  >
                                    {opt}
                                  </Button>
                                </motion.div>
                              </Box>
                            );
                          })}
                        </Stack>
                      )}

                      {/* Fill blank */}
                      {ex.type === 'fill-blank' && (
                        <Box>
                          <TextField
                            fullWidth
                            disabled={showResult}
                            placeholder="Type your answer here..."
                            value={selectedAnswers[ex.id] as string ?? ''}
                            onChange={(e) => handleFillBlankChange(ex.id, e.target.value)}
                            variant="outlined"
                            inputProps={{ style: { fontSize: '1.1rem', fontWeight: 700 } }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                '&.Mui-focused fieldset': { borderColor: '#4CAF50', borderWidth: 2 },
                                '&.Mui-disabled': {
                                  '& fieldset': { borderColor: answered ? (isCorrect ? '#4CAF50' : '#F44336') : '#E0E0E0', borderWidth: 2 }
                                }
                              },
                            }}
                          />
                        </Box>
                      )}

                      {/* Feedback box for wrong answers */}
                      {answered && isWrong && (
                        <AnimatePresence>
                          <MotionBox
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            sx={{ mt: 2, p: 2, bgcolor: '#FFF8E1', borderRadius: 3, border: '1px solid #FFE082' }}
                          >
                            <Typography sx={{ fontWeight: 800, color: '#F57C00', fontSize: '0.85rem', mb: 0.5 }}>
                              💡 الإجابة الصحيحة:
                            </Typography>
                            <Typography sx={{ fontWeight: 900, color: '#2C3E50', fontSize: '1rem' }}>
                              {ex.type === 'fill-blank'
                                ? String(ex.correctAnswer)
                                : ex.options?.[ex.correctAnswer as number] ?? String(ex.correctAnswer)
                              }
                            </Typography>
                            <Typography sx={{ color: '#78909C', fontSize: '0.8rem', mt: 0.5 }}>
                              {ex.explanation}
                            </Typography>
                          </MotionBox>
                        </AnimatePresence>
                      )}

                      {/* Feedback box for correct answers */}
                      {answered && isCorrect && (
                        <AnimatePresence>
                          <MotionBox
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            sx={{ mt: 2, p: 1.5, bgcolor: '#E8F5E9', borderRadius: 3, border: '1px solid #A5D6A7' }}
                          >
                            <Typography sx={{ fontWeight: 700, color: '#2E7D32', fontSize: '0.85rem' }}>
                              ✅ ممتاز! {ex.explanation}
                            </Typography>
                          </MotionBox>
                        </AnimatePresence>
                      )}
                    </CardContent>
                  </MotionCard>
                );
              })}
            </Stack>

            {/* Check Answers / Result Section */}
            <Box sx={{ mt: 4 }}>
              {!showResult ? (
                <motion.div whileHover={{ scale: allAnswered ? 1.02 : 1 }} whileTap={{ scale: allAnswered ? 0.98 : 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmitExercises}
                    disabled={!allAnswered}
                    sx={{
                      py: 2, borderRadius: 4,
                      background: allAnswered ? 'linear-gradient(135deg, #2196F3, #1565C0)' : undefined,
                      fontSize: '1.1rem', fontWeight: 900,
                      boxShadow: allAnswered ? '0 8px 20px rgba(33,150,243,0.35)' : 'none',
                      letterSpacing: '0.5px'
                    }}
                  >
                    ✓ Check Answers
                  </Button>
                </motion.div>
              ) : (
                <AnimatePresence>
                  <MotionBox
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    {/* Score card */}
                    <Card sx={{
                      borderRadius: 5, mb: 3, overflow: 'hidden',
                      background: isPerfect
                        ? 'linear-gradient(135deg, #43A047, #1B5E20)'
                        : isPassing
                          ? 'linear-gradient(135deg, #1E88E5, #1565C0)'
                          : 'linear-gradient(135deg, #E53935, #B71C1C)',
                      color: 'white',
                      boxShadow: isPerfect
                        ? '0 12px 32px rgba(76,175,80,0.4)'
                        : isPassing
                          ? '0 12px 32px rgba(33,150,243,0.4)'
                          : '0 12px 32px rgba(244,67,54,0.4)',
                    }}>
                      <CardContent sx={{ p: 3.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                          <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex' }}>
                            {isPassing
                              ? <EmojiEvents sx={{ fontSize: '2.5rem', color: '#FFC107' }} />
                              : <SentimentDissatisfied sx={{ fontSize: '2.5rem' }} />
                            }
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', lineHeight: 1 }}>
                              {isPerfect ? '🎉 Perfect Score!' : isPassing ? '👍 Good Job!' : '💪 Keep Trying!'}
                            </Typography>
                            <Typography sx={{ opacity: 0.85, fontSize: '0.9rem', mt: 0.5 }}>
                              {correctCount} out of {totalExercises} correct
                            </Typography>
                          </Box>
                        </Box>

                        {/* Score bar */}
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', opacity: 0.9 }}>Score</Typography>
                            <Typography sx={{ fontWeight: 900, fontSize: '1rem' }}>{lessonScore}%</Typography>
                          </Box>
                          <Box sx={{ height: 10, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 5, overflow: 'hidden' }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${lessonScore}%` }}
                              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                              style={{ height: '100%', background: 'rgba(255,255,255,0.85)', borderRadius: 5 }}
                            />
                          </Box>
                        </Box>

                        {/* Mastery bar */}
                        <Box sx={{ mt: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', opacity: 0.9 }}>Lesson Mastery</Typography>
                            <Typography sx={{ fontWeight: 900, fontSize: '1rem' }}>{lessonMastery}%</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={lessonMastery ?? 0}
                            sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: '#FFC107', borderRadius: 5 } }}
                          />
                        </Box>
                      </CardContent>
                    </Card>

                    {/* AI Tutor suggestion */}
                    {remediationPlan && (
                      <Card sx={{ borderRadius: 4, mb: 2.5, border: '2px solid #E3F2FD', bgcolor: '#F8FBFF' }}>
                        <CardContent sx={{ p: 2.5 }}>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Box sx={{ fontSize: '2rem' }}>🤖</Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={{ fontWeight: 800, color: '#1565C0', mb: 0.5 }}>AI Tutor can help!</Typography>
                              <Typography sx={{ color: '#607D8B', fontSize: '0.85rem' }}>
                                Get focused practice on the topics you missed.
                              </Typography>
                            </Box>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => navigate(`/ai-tutor?scenario=${remediationPlan.aiScenario}&message=${remediationPlan.aiPrompt}&remediationPlanId=${remediationPlan.id}`)}
                              sx={{ bgcolor: '#1565C0', borderRadius: 3, fontWeight: 800, boxShadow: 'none', flexShrink: 0 }}
                            >
                              Let's go
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    )}

                    {/* Action buttons */}
                    <Stack spacing={2}>
                      {!isPerfect && (
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={handleRetry}
                          startIcon={<Refresh />}
                          sx={{ py: 1.75, borderRadius: 4, fontWeight: 800, fontSize: '1rem', borderColor: '#4CAF50', color: '#4CAF50', borderWidth: 2, '&:hover': { bgcolor: '#E8F5E9', borderWidth: 2 } }}
                        >
                          Try Again
                        </Button>
                      )}
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => navigate('/home')}
                        sx={{
                          py: 1.75, borderRadius: 4,
                          background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                          fontSize: '1rem', fontWeight: 900,
                          boxShadow: '0 8px 20px rgba(76,175,80,0.35)'
                        }}
                      >
                        {isPerfect ? '🏠 Back to Home' : '✅ Complete Lesson'}
                      </Button>
                    </Stack>
                  </MotionBox>
                </AnimatePresence>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LessonPage;
