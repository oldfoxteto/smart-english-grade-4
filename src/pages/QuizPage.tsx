import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { quizQuestions } from '../core/data';
import { useProgress } from '../core/ProgressContext';
import { playCorrect, playWrong, playSuccess, speakWord, playClick } from '../core/sounds';

const QuizPage = () => {
  const navigate = useNavigate();
  const { addQuizScore } = useProgress();

  const [phase, setPhase] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [questions, setQuestions] = useState<typeof quizQuestions>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(20);

  const startQuiz = () => {
    playClick();
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 8);
    setQuestions(shuffled);
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setAnswers([]);
    setTimeLeft(20);
    setPhase('quiz');
  };

  const handleAnswer = useCallback((idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === questions[currentQ].answer;
    const newScore = correct ? score + 1 : score;
    setScore(newScore);
    setAnswers((prev) => [...prev, idx]);

    if (correct) playCorrect();
    else playWrong();

    setTimeout(() => {
      if (currentQ + 1 < questions.length) {
        setCurrentQ((q) => q + 1);
        setSelected(null);
        setAnswered(false);
        setTimeLeft(20);
      } else {
        addQuizScore(newScore, questions.length);
        if (newScore / questions.length >= 0.5) playSuccess();
        setPhase('result');
      }
    }, 1500);
  }, [answered, questions, currentQ, score, addQuizScore]);

  useEffect(() => {
    if (phase !== 'quiz' || answered) return;
    if (timeLeft <= 0) {
      handleAnswer(-1);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, phase, answered, handleAnswer]);

  useEffect(() => {
    if (phase === 'quiz' && questions[currentQ]) {
      setTimeout(() => speakWord(questions[currentQ].question), 300);
    }
  }, [currentQ, phase, questions]);

  const q = questions[currentQ];
  const pct = questions.length > 0 ? (currentQ / questions.length) * 100 : 0;
  const timePct = (timeLeft / 20) * 100;

  const getGrade = () => {
    const ratio = score / questions.length;
    if (ratio === 1) return { icon: '🏆', label: 'ممتاز جدًا', color: '#FFD700', msg: 'إجابة كاملة بدون أخطاء. أداء احترافي.' };
    if (ratio >= 0.75) return { icon: '🌟', label: 'ممتاز', color: '#4CAF50', msg: 'نتيجة قوية جدًا. استمر بنفس الإيقاع.' };
    if (ratio >= 0.5) return { icon: '👍', label: 'جيد', color: '#FF9800', msg: 'تقدم جيد. قليل من التدريب وسيصبح الأداء أفضل.' };
    return { icon: '💪', label: 'استمر', color: '#FF6B6B', msg: 'البداية جيدة. الممارسة اليومية سترفع المستوى بسرعة.' };
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)', py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 }, mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 1, fontSize: { xs: '1.9rem', md: '2.8rem' } }}>
          اختبار سريع
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', fontSize: { xs: '0.95rem', md: '1.1rem' } }}>
          اختبر مستواك واجمع النجوم مع كل محاولة.
        </Typography>
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 }, maxWidth: 760, mx: 'auto' }}>
        <Button onClick={() => navigate('/home')} sx={{ mb: 3, color: '#FF9800', fontWeight: 700 }}>
          العودة للرئيسية
        </Button>

        {phase === 'intro' && (
          <Card sx={{ textAlign: 'center', p: { xs: 1, md: 2 } }}>
            <CardContent>
              <Typography sx={{ fontSize: '4rem', mb: 2 }}>🎯</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                جاهز للاختبار؟
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                8 أسئلة عشوائية • 20 ثانية لكل سؤال • دعم قراءة صوتية.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                {['8 أسئلة', '20 ثانية/سؤال', 'قراءة صوتية', 'نجوم ومكافآت'].map((tag) => (
                  <Chip key={tag} label={tag} sx={{ background: '#FFF3E0', color: '#E65100', fontWeight: 700 }} />
                ))}
              </Box>
              <Button
                variant="contained"
                size="large"
                onClick={startQuiz}
                sx={{ background: 'linear-gradient(135deg, #FF9800, #FFB74D)', fontSize: { xs: '1rem', md: '1.15rem' }, px: 5 }}
              >
                ابدأ الاختبار
              </Button>
            </CardContent>
          </Card>
        )}

        {phase === 'quiz' && q && (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#FF9800' }}>
                  السؤال {currentQ + 1} / {questions.length}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: timeLeft <= 5 ? '#FF6B6B' : '#4CAF50', fontSize: '1rem' }}>
                  ⏱ {timeLeft}ث
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{ height: 8, borderRadius: 4, mb: 1, background: '#FFF3E0', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #FF9800, #FFB74D)', borderRadius: 4 } }}
              />
              <LinearProgress
                variant="determinate"
                value={timePct}
                sx={{ height: 6, borderRadius: 4, background: '#FFEBEE', '& .MuiLinearProgress-bar': { background: timeLeft <= 5 ? 'linear-gradient(90deg, #FF6B6B, #FF9999)' : 'linear-gradient(90deg, #4CAF50, #81C784)', borderRadius: 4, transition: 'width 1s linear' } }}
              />
            </Box>

            <Card>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={q.category} size="small" sx={{ background: '#FFF3E0', color: '#E65100', fontWeight: 700 }} />
                  <Button size="small" onClick={() => speakWord(q.question)} sx={{ color: '#FF9800', minWidth: 'auto', p: 0.5 }}>
                    🔊
                  </Button>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                  {q.question}
                </Typography>

                <Grid container spacing={2}>
                  {q.options.map((opt, i) => {
                    let bg = 'white';
                    let borderColor = '#E0E0E0';
                    let color = '#2D3748';
                    if (answered) {
                      if (i === q.answer) {
                        bg = '#E8F5E9';
                        borderColor = '#4CAF50';
                        color = '#2E7D32';
                      } else if (i === selected) {
                        bg = '#FFEBEE';
                        borderColor = '#FF6B6B';
                        color = '#C62828';
                      }
                    }
                    return (
                      <Grid size={{ xs: 12, sm: 6 }} key={i}>
                        <Button
                          fullWidth
                          variant="outlined"
                          disabled={answered}
                          onClick={() => handleAnswer(i)}
                          sx={{
                            py: 1.5,
                            background: bg,
                            borderColor,
                            color,
                            fontWeight: 600,
                            justifyContent: 'flex-start',
                            textAlign: 'left',
                            fontSize: '1rem',
                            transition: 'all 0.3s',
                            '&:hover:not(:disabled)': { background: '#FFF3E0', borderColor: '#FF9800' },
                            '&.Mui-disabled': { opacity: 1 },
                          }}
                        >
                          <Chip label={String.fromCharCode(65 + i)} size="small" sx={{ mr: 1.5, background: answered && i === q.answer ? '#4CAF50' : '#FF9800', color: 'white', fontWeight: 700 }} />
                          {opt}
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>

                {answered && (
                  <Alert severity={selected === q.answer ? 'success' : 'error'} sx={{ mt: 2, borderRadius: '12px' }}>
                    {selected === q.answer ? 'إجابة صحيحة. ' : 'إجابة غير صحيحة. '}
                    {q.explanation}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Box>
        )}

        {phase === 'result' && (() => {
          const grade = getGrade();
          return (
            <Card sx={{ textAlign: 'center' }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography sx={{ fontSize: '4rem', mb: 1 }}>{grade.icon}</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: grade.color, mb: 1, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                  {grade.label}
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
                  {score} / {questions.length} صحيحة
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: '#718096' }}>{grade.msg}</Typography>
                <Box sx={{ background: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)', borderRadius: '16px', p: 2, mb: 3, display: 'inline-block' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#E65100' }}>
                    ⭐ +{Math.round((score / questions.length) * 15)} نجمة
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                  {questions.map((question, i) => (
                    <Chip
                      key={i}
                      label={`س${i + 1} ${answers[i] === question.answer ? '✅' : '❌'}`}
                      sx={{ background: answers[i] === question.answer ? '#E8F5E9' : '#FFEBEE', color: answers[i] === question.answer ? '#2E7D32' : '#C62828', fontWeight: 700 }}
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button variant="outlined" onClick={startQuiz} sx={{ borderColor: '#FF9800', color: '#FF9800', fontWeight: 700 }}>
                    إعادة الاختبار
                  </Button>
                  <Button variant="contained" onClick={() => navigate('/home')} sx={{ background: 'linear-gradient(135deg, #FF9800, #FFB74D)', fontWeight: 700 }}>
                    العودة للرئيسية
                  </Button>
                </Box>
              </CardContent>
            </Card>
          );
        })()}
      </Box>
    </Box>
  );
};

export default QuizPage;
