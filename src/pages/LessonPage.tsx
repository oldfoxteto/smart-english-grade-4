import { useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Button, Card, CardContent, Chip, IconButton, LinearProgress, Stack, TextField, Typography } from '@mui/material';
import { ArrowBack, Cancel, CheckCircle, EmojiEvents, Refresh, VolumeUp } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useNavigate, useParams } from 'react-router-dom';
import { getA1LessonById, type A1Lesson } from '../core/a1Content';
import { getLessonContent, type LessonContentResponse, updateLessonProgress } from '../core/api';
import { getMasteryThreshold, recordLessonAttempt, type RemediationPlan } from '../core/masteryEngine';
import { playClick, playSuccess } from '../core/sounds';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const cardSx = { borderRadius: 4, border: '1px solid #DDECCF', boxShadow: '0 6px 16px rgba(0,0,0,0.04)' };
const asString = (value: unknown) => typeof value === 'string' && value.trim() ? value : null;
const asStringArray = (value: unknown) => Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : [];

const LessonPage = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<A1Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [remoteContent, setRemoteContent] = useState<LessonContentResponse | null>(null);
  const [remoteError, setRemoteError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | number>>({});
  const [showResult, setShowResult] = useState(false);
  const [exerciseResults, setExerciseResults] = useState<Record<string, boolean>>({});
  const [lessonScore, setLessonScore] = useState<number | null>(null);
  const [lessonMastery, setLessonMastery] = useState<number | null>(null);
  const [remediationPlan, setRemediationPlan] = useState<RemediationPlan | null>(null);

  useEffect(() => {
    let active = true;
    if (!lessonId) {
      setLesson(null);
      setRemoteContent(null);
      setLoading(false);
      return () => { active = false; };
    }
    const localLesson = getA1LessonById(lessonId) || null;
    setLesson(localLesson);
    setRemoteContent(null);
    setRemoteError(null);
    setLoading(!localLesson);
    getLessonContent(lessonId)
      .then((response) => { if (active) setRemoteContent(response); })
      .catch(() => { if (active) setRemoteError('Lesson server details are temporarily unavailable.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [lessonId]);

  const remoteIntro = useMemo(() => asString(remoteContent?.body?.intro), [remoteContent]);
  const remoteObjective = useMemo(() => asString(remoteContent?.body?.objective), [remoteContent]);
  const remoteTasks = useMemo(() => asStringArray(remoteContent?.body?.tasks), [remoteContent]);
  const remoteSupportTips = useMemo(() => asStringArray(remoteContent?.body?.supportTips), [remoteContent]);
  const remoteReviewPrompt = useMemo(() => asString(remoteContent?.body?.reviewPrompt), [remoteContent]);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const handleExerciseAnswer = (exerciseId: string, answer: string | number) => {
    if (showResult) return;
    playClick();
    setSelectedAnswers((prev) => ({ ...prev, [exerciseId]: answer }));
  };

  const handleFillBlankChange = (exerciseId: string, value: string) => {
    if (showResult) return;
    setSelectedAnswers((prev) => ({ ...prev, [exerciseId]: value }));
  };

  const handleSubmitExercises = async () => {
    if (!lesson?.exercises?.length) return;
    const results: Record<string, boolean> = {};
    lesson.exercises.forEach((exercise) => {
      const userAnswer = selectedAnswers[exercise.id];
      results[exercise.id] = exercise.type === 'fill-blank'
        ? String(userAnswer ?? '').trim().toLowerCase() === String(exercise.correctAnswer).trim().toLowerCase()
        : userAnswer === exercise.correctAnswer;
    });
    setExerciseResults(results);
    setShowResult(true);
    const correctCount = Object.values(results).filter(Boolean).length;
    if (correctCount === lesson.exercises.length) {
      playSuccess();
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#FBC84C', '#6DD6B3', '#79D7FF', '#FF8BA7'] });
    }
    const masteryUpdate = recordLessonAttempt({
      lessonId: lesson.id,
      lessonCategory: lesson.category,
      totalExercises: lesson.exercises.length,
      correctExercises: correctCount,
      weakSkills: [],
    });
    setLessonScore(masteryUpdate.scorePercent);
    setLessonMastery(masteryUpdate.lessonMastery);
    setRemediationPlan(masteryUpdate.activeRemediationPlan);
    const completed = masteryUpdate.lessonMastery >= getMasteryThreshold();
    updateLessonProgress(lesson.id, masteryUpdate.lessonMastery, completed).catch(() => {});
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setShowResult(false);
    setExerciseResults({});
    setLessonScore(null);
    setLessonMastery(null);
    setRemediationPlan(null);
  };

  const allAnswered = lesson?.exercises?.every((exercise) => {
    const answer = selectedAnswers[exercise.id];
    return exercise.type === 'fill-blank' ? typeof answer === 'string' && answer.trim().length > 0 : answer !== undefined;
  }) ?? false;

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography>Loading lesson...</Typography></Box>;
  if (!lesson) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography>Lesson not found</Typography></Box>;

  const totalExercises = lesson.exercises?.length ?? 0;
  const correctCount = Object.values(exerciseResults).filter(Boolean).length;
  const isPerfect = showResult && correctCount === totalExercises;
  const isPassing = showResult && (lessonScore ?? 0) >= 70;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFDF4', fontFamily: '"Nunito", sans-serif', pb: 10 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pt: 4, background: 'linear-gradient(135deg, rgba(121,215,255,0.98), rgba(109,214,179,0.98))', color: '#173042', borderBottomLeftRadius: 28, borderBottomRightRadius: 28, mb: 4, boxShadow: '0 12px 28px rgba(121,215,255,0.22)' }}>
        <IconButton onClick={() => navigate('/lessons')} sx={{ bgcolor: 'rgba(255,255,255,0.58)', color: '#173042', '&:hover': { bgcolor: 'rgba(255,255,255,0.74)' } }}><ArrowBack /></IconButton>
        <Typography variant="h6" sx={{ fontWeight: 900, textAlign: 'center', px: 2 }}>{lesson.title}</Typography>
        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.58)', color: '#173042' }}>LP</Avatar>
      </Box>

      <Box sx={{ px: 2, maxWidth: 680, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Card sx={cardSx}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
              <Chip label={lesson.level} sx={{ bgcolor: '#E2F6EC', color: '#24765B', fontWeight: 800 }} />
              <Chip label={`${lesson.duration} min`} sx={{ bgcolor: '#E4F4FF', color: '#3566A5', fontWeight: 800 }} />
              <Chip label="50 XP" sx={{ bgcolor: '#FFF2C4', color: '#8B6116', fontWeight: 800 }} />
              <Chip label={lesson.category} sx={{ bgcolor: '#F3ECFF', color: '#6A54B5', fontWeight: 800, textTransform: 'capitalize' }} />
              {remoteContent?.lesson?.qaStatus ? <Chip label={`QA: ${remoteContent.lesson.qaStatus}`} sx={{ bgcolor: '#FFE5EE', color: '#B44B77', fontWeight: 800 }} /> : null}
            </Stack>
            <Typography sx={{ color: '#55626C', lineHeight: 1.7 }}>{lesson.description}</Typography>
          </CardContent>
        </Card>

        {remoteContent ? (
          <Card sx={{ ...cardSx, background: 'linear-gradient(180deg, #FFFFFF 0%, #F9FCFF 100%)' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
                <Chip label={remoteContent.lesson.unitTitle} sx={{ bgcolor: '#EAF8FF', color: '#3566A5', fontWeight: 800 }} />
                <Chip label={remoteContent.lesson.trackName} sx={{ bgcolor: '#E9F9F2', color: '#24765B', fontWeight: 800 }} />
                <Chip label={remoteContent.lesson.cefrLevel} sx={{ bgcolor: '#FFF2C4', color: '#8B6116', fontWeight: 800 }} />
              </Stack>
              <Typography sx={{ color: '#173042', fontWeight: 900, fontSize: '1.05rem', mb: 1 }}>Server lesson plan</Typography>
              {remoteIntro ? <Typography sx={{ color: '#55626C', lineHeight: 1.7, mb: 1.5 }}>{remoteIntro}</Typography> : null}
              {remoteObjective ? (
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#F7FBFF', border: '1px solid #DCEEFF', mb: 1.5 }}>
                  <Typography sx={{ color: '#3566A5', fontWeight: 800, mb: 0.5 }}>Learning objective</Typography>
                  <Typography sx={{ color: '#55626C', lineHeight: 1.6 }}>{remoteObjective}</Typography>
                </Box>
              ) : null}
              {remoteTasks.length ? (
                <Stack spacing={1}>
                  {remoteTasks.map((task) => (
                    <Box key={task} sx={{ p: 1.4, borderRadius: 2.5, bgcolor: '#FFF8E2', color: '#6B5A1A', fontWeight: 700 }}>
                      {task}
                    </Box>
                  ))}
                </Stack>
              ) : null}
              {remoteSupportTips.length ? (
                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ color: '#173042', fontWeight: 800, mb: 1 }}>Support tips</Typography>
                  <Stack spacing={1}>
                    {remoteSupportTips.map((tip) => <Typography key={tip} sx={{ color: '#55626C' }}>- {tip}</Typography>)}
                  </Stack>
                </Box>
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        {!remoteContent && remoteError ? (
          <Card sx={{ ...cardSx, borderColor: '#F6D7E0', background: '#FFF8FB' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography sx={{ color: '#B44B77', fontWeight: 800, mb: 0.5 }}>Remote lesson details unavailable</Typography>
              <Typography sx={{ color: '#6A5A66' }}>{remoteError}</Typography>
            </CardContent>
          </Card>
        ) : null}

        {lesson.vocabulary?.length ? (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#173042', mb: 2 }}>Key vocabulary</Typography>
            <Stack spacing={2}>
              {lesson.vocabulary.map((item, index) => (
                <Card key={`${item.word}-${index}`} sx={{ ...cardSx, position: 'relative' }}>
                  <CardContent sx={{ p: 2.5, pr: 14 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#24765B', mb: 0.5 }}>{item.word}</Typography>
                    <Typography variant="body2" sx={{ color: '#6A7882', mb: 0.5 }}>{item.pronunciation} - {item.translation}</Typography>
                    <Typography variant="body2" sx={{ color: '#85939C' }}>{item.exampleTranslation}</Typography>
                    <Button
                      onClick={() => speakText(item.word)}
                      variant="contained"
                      size="small"
                      sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', borderRadius: 4, px: 2, bgcolor: '#6DD6B3', color: '#173042', boxShadow: 'none', minWidth: 'auto', '&:hover': { bgcolor: '#5BC8A4', boxShadow: 'none' } }}
                      startIcon={<VolumeUp />}
                    >
                      Listen
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        ) : null}

        {lesson.grammar ? (
          <Card sx={cardSx}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#173042', mb: 1 }}>Grammar focus: {lesson.grammar.title}</Typography>
              <Typography sx={{ color: '#55626C', mb: 2, lineHeight: 1.6 }}>{lesson.grammar.explanation}</Typography>
              <Box sx={{ bgcolor: '#F7FBFF', p: 2, borderRadius: 2.5 }}>
                <Typography sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#3566A5' }}>{lesson.grammar.formula}</Typography>
              </Box>
            </CardContent>
          </Card>
        ) : null}

        {lesson.exercises?.length ? (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#173042', mb: 2 }}>Quick practice</Typography>
            <Stack spacing={2.5}>
              {lesson.exercises.map((exercise, exerciseIndex) => {
                const isCorrect = exerciseResults[exercise.id];
                const isWrong = showResult && !isCorrect;
                const answered = showResult;
                const cardBorder = answered ? (isCorrect ? '2px solid #6DD6B3' : '2px solid #F58CA8') : '1px solid #DDECCF';
                const cardBg = answered ? (isCorrect ? 'linear-gradient(145deg, #fff, #F1FFF9)' : 'linear-gradient(145deg, #fff, #FFF4F8)') : '#FFFFFF';
                return (
                  <MotionCard key={exercise.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: exerciseIndex * 0.08 }} sx={{ borderRadius: 4, border: cardBorder, background: cardBg, boxShadow: answered ? (isCorrect ? '0 10px 20px rgba(109,214,179,0.16)' : '0 10px 20px rgba(245,140,168,0.16)') : '0 6px 16px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2.5, pb: 1 }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: '#F4F7FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 900, color: '#6A7882' }}>Q{exerciseIndex + 1}</Typography>
                        </Box>
                        <Chip label={exercise.type === 'fill-blank' ? 'Fill blank' : 'Multiple choice'} size="small" sx={{ fontSize: '0.72rem', fontWeight: 700, bgcolor: '#F4F7FA', color: '#55626C', height: 22 }} />
                      </Stack>
                      {answered ? <AnimatePresence><MotionBox initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>{isCorrect ? <CheckCircle sx={{ color: '#3DB58C', fontSize: '1.8rem' }} /> : <Cancel sx={{ color: '#F06B8E', fontSize: '1.8rem' }} />}</MotionBox></AnimatePresence> : null}
                    </Box>
                    <CardContent sx={{ px: 3, pt: 1, pb: 3 }}>
                      <Typography sx={{ fontWeight: 800, color: '#173042', mb: 2.4, fontSize: '1.05rem', lineHeight: 1.5 }}>{exercise.question}</Typography>
                      {exercise.type !== 'fill-blank' && exercise.options ? (
                        <Stack direction="row" flexWrap="wrap" gap={1.5} useFlexGap>
                          {exercise.options.map((option, optionIndex) => {
                            const isSelected = selectedAnswers[exercise.id] === optionIndex;
                            const isCorrectOption = optionIndex === exercise.correctAnswer;
                            let buttonBg = 'transparent';
                            let buttonColor = '#5C6770';
                            let buttonBorder = '#E2E8EF';
                            let buttonShadow = 'none';
                            if (answered) {
                              if (isCorrectOption) {
                                buttonBg = '#6DD6B3'; buttonColor = '#173042'; buttonBorder = '#57BE9A'; buttonShadow = '0 6px 14px rgba(109,214,179,0.22)';
                              } else if (isSelected) {
                                buttonBg = '#FFB7CA'; buttonColor = '#173042'; buttonBorder = '#F58CA8'; buttonShadow = '0 6px 14px rgba(245,140,168,0.2)';
                              }
                            } else if (isSelected) {
                              buttonBg = '#79D7FF'; buttonColor = '#173042'; buttonBorder = '#60C5F0'; buttonShadow = '0 6px 14px rgba(121,215,255,0.22)';
                            }
                            return (
                              <Box sx={{ width: { xs: '100%', sm: '48%' } }} key={`${exercise.id}-${optionIndex}`}>
                                <motion.div whileHover={!answered ? { scale: 1.02 } : {}} whileTap={!answered ? { scale: 0.98 } : {}}>
                                  <Button
                                    fullWidth
                                    disabled={answered}
                                    onClick={() => handleExerciseAnswer(exercise.id, optionIndex)}
                                    sx={{ borderRadius: 3, py: 1.5, fontWeight: 700, textTransform: 'none', fontSize: '0.92rem', border: `2px solid ${buttonBorder}`, bgcolor: buttonBg, color: buttonColor, boxShadow: buttonShadow, '&.Mui-disabled': { color: buttonColor, bgcolor: buttonBg, border: `2px solid ${buttonBorder}` } }}
                                  >
                                    {option}
                                  </Button>
                                </motion.div>
                              </Box>
                            );
                          })}
                        </Stack>
                      ) : null}
                      {exercise.type === 'fill-blank' ? (
                        <TextField
                          fullWidth
                          disabled={showResult}
                          placeholder="Type your answer here..."
                          value={(selectedAnswers[exercise.id] as string) ?? ''}
                          onChange={(event) => handleFillBlankChange(exercise.id, event.target.value)}
                          variant="outlined"
                          inputProps={{ style: { fontSize: '1.05rem', fontWeight: 700 } }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, '&.Mui-focused fieldset': { borderColor: '#79D7FF', borderWidth: 2 }, '&.Mui-disabled fieldset': { borderColor: answered ? (isCorrect ? '#6DD6B3' : '#F58CA8') : '#E0E0E0', borderWidth: 2 } } }}
                        />
                      ) : null}
                      {answered && isWrong ? (
                        <AnimatePresence>
                          <MotionBox initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3, delay: 0.15 }} sx={{ mt: 2, p: 2, bgcolor: '#FFF5F8', borderRadius: 3, border: '1px solid #FFD2DE' }}>
                            <Typography sx={{ fontWeight: 800, color: '#B44B77', fontSize: '0.88rem', mb: 0.5 }}>Correct answer</Typography>
                            <Typography sx={{ fontWeight: 900, color: '#173042', fontSize: '1rem' }}>{exercise.type === 'fill-blank' ? String(exercise.correctAnswer) : exercise.options?.[exercise.correctAnswer as number] ?? String(exercise.correctAnswer)}</Typography>
                            <Typography sx={{ color: '#66757F', fontSize: '0.84rem', mt: 0.5 }}>{exercise.explanation}</Typography>
                          </MotionBox>
                        </AnimatePresence>
                      ) : null}
                      {answered && isCorrect ? (
                        <AnimatePresence>
                          <MotionBox initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3, delay: 0.15 }} sx={{ mt: 2, p: 1.5, bgcolor: '#F1FFF9', borderRadius: 3, border: '1px solid #CBEFDF' }}>
                            <Typography sx={{ fontWeight: 700, color: '#24765B', fontSize: '0.85rem' }}>Nice work. {exercise.explanation}</Typography>
                          </MotionBox>
                        </AnimatePresence>
                      ) : null}
                    </CardContent>
                  </MotionCard>
                );
              })}
            </Stack>
            <Box sx={{ mt: 4 }}>
              {!showResult ? (
                <motion.div whileHover={{ scale: allAnswered ? 1.02 : 1 }} whileTap={{ scale: allAnswered ? 0.98 : 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmitExercises}
                    disabled={!allAnswered}
                    sx={{ py: 2, borderRadius: 4, background: allAnswered ? 'linear-gradient(135deg, #79D7FF, #6DD6B3)' : undefined, color: '#173042', fontSize: '1.06rem', fontWeight: 900, boxShadow: allAnswered ? '0 12px 24px rgba(121,215,255,0.22)' : 'none' }}
                  >
                    Check answers
                  </Button>
                </motion.div>
              ) : (
                <AnimatePresence>
                  <MotionBox initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 20 }}>
                    <Card sx={{ borderRadius: 5, mb: 3, overflow: 'hidden', background: isPerfect ? 'linear-gradient(135deg, #6DD6B3, #3DB58C)' : isPassing ? 'linear-gradient(135deg, #79D7FF, #4DB4E2)' : 'linear-gradient(135deg, #FFB7CA, #F58CA8)', color: '#173042', boxShadow: '0 16px 30px rgba(0,0,0,0.08)' }}>
                      <CardContent sx={{ p: 3.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                          <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.45)', borderRadius: '50%', display: 'flex' }}><EmojiEvents sx={{ fontSize: '2.2rem', color: '#8B6116' }} /></Box>
                          <Box>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', lineHeight: 1 }}>{isPerfect ? 'Perfect score' : isPassing ? 'Good job' : 'Keep going'}</Typography>
                            <Typography sx={{ opacity: 0.84, fontSize: '0.92rem', mt: 0.5 }}>{correctCount} out of {totalExercises} correct</Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', opacity: 0.9 }}>Score</Typography>
                            <Typography sx={{ fontWeight: 900, fontSize: '1rem' }}>{lessonScore}%</Typography>
                          </Box>
                          <Box sx={{ height: 10, bgcolor: 'rgba(255,255,255,0.45)', borderRadius: 5, overflow: 'hidden' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${lessonScore ?? 0}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }} style={{ height: '100%', background: 'rgba(255,255,255,0.92)', borderRadius: 5 }} />
                          </Box>
                        </Box>
                        <Box sx={{ mt: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', opacity: 0.9 }}>Lesson mastery</Typography>
                            <Typography sx={{ fontWeight: 900, fontSize: '1rem' }}>{lessonMastery}%</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={lessonMastery ?? 0} sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.45)', '& .MuiLinearProgress-bar': { bgcolor: '#FFF2C4', borderRadius: 5 } }} />
                        </Box>
                      </CardContent>
                    </Card>

                    {remoteReviewPrompt ? <Card sx={{ ...cardSx, mb: 2.5, borderColor: '#DCEEFF', background: '#F8FCFF' }}><CardContent sx={{ p: 2.5 }}><Typography sx={{ fontWeight: 800, color: '#3566A5', mb: 0.7 }}>Say this after the lesson</Typography><Typography sx={{ color: '#55626C', lineHeight: 1.6 }}>{remoteReviewPrompt}</Typography></CardContent></Card> : null}
                    {remediationPlan ? <Card sx={{ ...cardSx, mb: 2.5, borderColor: '#DCEEFF', background: '#F8FCFF' }}><CardContent sx={{ p: 2.5 }}><Stack direction="row" alignItems="center" spacing={1.5}><Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#EAF4FF', display: 'grid', placeItems: 'center', color: '#3566A5', fontWeight: 900 }}>AI</Box><Box sx={{ flex: 1 }}><Typography sx={{ fontWeight: 800, color: '#3566A5', mb: 0.5 }}>AI Tutor can reinforce this lesson</Typography><Typography sx={{ color: '#60717A', fontSize: '0.86rem' }}>Open a focused practice session for the parts you missed.</Typography></Box><Button size="small" variant="contained" onClick={() => navigate(`/ai-tutor?scenario=${remediationPlan.aiScenario}&message=${remediationPlan.aiPrompt}&remediationPlanId=${remediationPlan.id}`)} sx={{ bgcolor: '#79D7FF', color: '#173042', borderRadius: 3, fontWeight: 800, boxShadow: 'none' }}>Open</Button></Stack></CardContent></Card> : null}

                    <Stack spacing={2}>
                      {!isPerfect ? <Button fullWidth variant="outlined" onClick={handleRetry} startIcon={<Refresh />} sx={{ py: 1.75, borderRadius: 4, fontWeight: 800, fontSize: '1rem', borderColor: '#79D7FF', color: '#3566A5', borderWidth: 2, '&:hover': { bgcolor: '#F3FBFF', borderWidth: 2, borderColor: '#79D7FF' } }}>Try again</Button> : null}
                      <Button fullWidth variant="contained" onClick={() => navigate('/lessons')} sx={{ py: 1.75, borderRadius: 4, background: 'linear-gradient(135deg, #6DD6B3, #79D7FF)', color: '#173042', fontSize: '1rem', fontWeight: 900, boxShadow: '0 12px 24px rgba(121,215,255,0.22)' }}>
                        {isPerfect ? 'Back to lessons' : 'Complete lesson'}
                      </Button>
                    </Stack>
                  </MotionBox>
                </AnimatePresence>
              )}
            </Box>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default LessonPage;
