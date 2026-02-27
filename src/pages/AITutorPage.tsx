import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  MenuItem,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { useNotification } from '../core/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../core/ProgressContext';
import { useMissions } from '../core/MissionContext';
import {
  ApiError,
  askAiTutor,
  awardXp,
  getGamificationStatus,
  trackAnalyticsEvent,
  type AiTutorResponse,
} from '../core/api';
import { playClick } from '../core/sounds';

type Scenario = 'daily' | 'travel' | 'work' | 'migration';
type Proficiency = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
type SessionHistoryItem = {
  id: string;
  at: string;
  scenario: Scenario;
  proficiency: Proficiency;
  sentence: string;
  correctionAr: string;
};

const AI_TUTOR_HISTORY_KEY = 'lisan_ai_tutor_history_v1';

const scenarioLabels: Record<Scenario, string> = {
  daily: 'الحياة اليومية',
  travel: 'السفر',
  work: 'العمل',
  migration: 'الهجرة',
};

function formatSecondsAr(seconds: number) {
  if (seconds <= 0) return '0 ثانية';
  if (seconds < 60) return `${seconds} ثانية`;
  const mins = Math.floor(seconds / 60);
  const rem = seconds % 60;
  return rem > 0 ? `${mins} دقيقة و${rem} ثانية` : `${mins} دقيقة`;
}

function parseStructuredLines(text: string) {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const getValue = (prefixes: string[]) => {
    const line = lines.find((l) => prefixes.some((prefix) => l.startsWith(prefix)));
    if (!line) return '';
    const prefix = prefixes.find((p) => line.startsWith(p)) || '';
    return line.replace(prefix, '').trim();
  };
  return {
    feedback: getValue(['Feedback:', 'التغذية الراجعة:']),
    naturalAlternative: getValue(['Natural Alternative:', 'بديل طبيعي:']),
    practicePrompt: getValue(['Practice Prompt:', 'تمرين مقترح:']),
  };
}

function parseCorrection(text: string) {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const getValue = (prefixes: string[]) => {
    const line = lines.find((l) => prefixes.some((prefix) => l.startsWith(prefix)));
    if (!line) return '';
    const prefix = prefixes.find((p) => line.startsWith(p)) || '';
    return line.replace(prefix, '').trim();
  };
  return {
    mistake: getValue(['الخطأ:', 'Mistake:']),
    reason: getValue(['السبب:', 'Reason:']),
    correctedExample: getValue(['مثال مصحح:', 'Corrected Example:']),
  };
}

const AITutorPage = () => {
  const navigate = useNavigate();

  const [scenario, setScenario] = useState<Scenario>('travel');
  const [proficiency, setProficiency] = useState<Proficiency>('A2');
  const [message, setMessage] = useState('I go airport tomorrow');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [xpNotice, setXpNotice] = useState('');
  const { notify } = useNotification();
  const { addStars } = useProgress();
  const { missions, completeMission } = useMissions();

  // show notifications when messages are set
  useEffect(() => {
    if (xpNotice) {
      notify({ message: xpNotice, severity: 'success' });
      setXpNotice('');
    }
  }, [xpNotice, notify]);

  useEffect(() => {
    if (error) {
      notify({ message: error, severity: 'error' });
      setError('');
    }
  }, [error, notify]);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [dailyCap, setDailyCap] = useState(120);
  const [awardedToday, setAwardedToday] = useState(0);
  const [remainingToday, setRemainingToday] = useState(120);
  const [result, setResult] = useState<AiTutorResponse | null>(null);
  const [history, setHistory] = useState<SessionHistoryItem[]>(() => {
    try {
      const raw = localStorage.getItem(AI_TUTOR_HISTORY_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as SessionHistoryItem[];
      return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
    } catch {
      return [];
    }
  });

  const tutorParts = useMemo(() => parseStructuredLines(result?.tutorReply || ''), [result]);
  const correctionParts = useMemo(() => parseCorrection(result?.correctionAr || ''), [result]);
  const dailyCapReached = remainingToday <= 0 || awardedToday >= dailyCap;

  const emitEvent = (eventName: 'ai_tutor_submitted' | 'ai_tutor_success' | 'ai_tutor_retry' | 'ai_tutor_cooldown_hit' | 'ai_tutor_daily_cap_hit', metadata: Record<string, unknown> = {}) => {
    void trackAnalyticsEvent({
      eventName,
      source: 'web_ai_tutor_page',
      metadata: {
        scenario,
        proficiency,
        ...metadata,
      },
    }).catch(() => {
      // Analytics should never block UX.
    });
  };

  useEffect(() => {
    const loadAiTutorGamification = async () => {
      try {
        const status = await getGamificationStatus();
        if (status.aiTutor) {
          setDailyCap(status.aiTutor.dailyCap);
          setAwardedToday(status.aiTutor.awardedToday);
          setRemainingToday(status.aiTutor.remainingToday);
          setCooldownSeconds(status.aiTutor.cooldownRemainingSeconds);
        }
      } catch {
        // Keep defaults if status load fails.
      }
    };
    void loadAiTutorGamification();
  }, []);

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      setCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownSeconds]);

  useEffect(() => {
    localStorage.setItem(AI_TUTOR_HISTORY_KEY, JSON.stringify(history.slice(0, 5)));
  }, [history]);

  const submitSentence = async (sentence: string) => {
    setError('');
    setXpNotice('');

    if (!sentence.trim()) {
      setError('اكتب جملة أولًا للتدريب.');
      return;
    }

    const xpBlockedByCooldown = cooldownSeconds > 0;
    const xpBlockedByCap = dailyCapReached;

    if (xpBlockedByCooldown) {
      emitEvent('ai_tutor_cooldown_hit', { cooldownSeconds });
    }
    if (xpBlockedByCap) {
      emitEvent('ai_tutor_daily_cap_hit', { remainingToday, dailyCap, awardedToday });
    }

    setLoading(true);
    try {
      emitEvent('ai_tutor_submitted', { sentenceLength: sentence.trim().length });
      const response = await askAiTutor({
        message: sentence.trim(),
        scenario,
        proficiency,
      });
      setResult(response);
      emitEvent('ai_tutor_success', { safetyBlocked: response.safety.blocked });
      setHistory((prev) => {
        const entry: SessionHistoryItem = {
          id: crypto.randomUUID(),
          at: new Date().toISOString(),
          scenario,
          proficiency,
          sentence: sentence.trim(),
          correctionAr: response.correctionAr,
        };
        return [entry, ...prev].slice(0, 5);
      });

      // complete AI tutor mission if exists
      const m3 = missions.find(m => m.id === 'm3');
      if (m3 && !m3.completed) {
        completeMission('m3');
        notify({ message: '✅ المهمة اليومية: استخدمت المدرب الذكي', severity: 'success' });
        addStars(m3.xpReward);
      }

      if (response.safety.blocked) {
        setXpNotice('تم تقديم التصحيح، لكن لا يمكن منح XP لهذه المحاولة بسبب فحص الأمان.');
        return;
      }

      if (xpBlockedByCooldown) {
        setXpNotice(`تم تقديم التصحيح بنجاح. XP متاح بعد انتهاء التهدئة خلال ${formatSecondsAr(cooldownSeconds)}.`);
        return;
      }

      if (xpBlockedByCap) {
        setXpNotice('تم الوصول للحد اليومي من XP للـ AI Tutor. يمكنك المتابعة بدون نقاط حتى يتجدد الحد.');
        return;
      }

      try {
        await awardXp('ai_tutor_session', 12);
        const notice = 'تمت إضافة +12 XP لهذه المحاولة.';
      setXpNotice(notice);
      notify({ message: notice, severity: 'success' });
        setAwardedToday((prev) => prev + 12);
        setRemainingToday((prev) => Math.max(0, prev - 12));
      } catch (xpErr) {
        if (xpErr instanceof ApiError && xpErr.status === 429) {
          const retryAfter = Number(xpErr.details.retryAfterSeconds || 0);
          const remaining = Number(xpErr.details.remainingToday);
          const cap = Number(xpErr.details.dailyCap);
          const awarded = Number(xpErr.details.awardedToday);
          if (Number.isFinite(cap) && cap > 0) {
            setDailyCap(cap);
          }
          if (Number.isFinite(awarded) && awarded >= 0) {
            setAwardedToday(awarded);
          }
          if (Number.isFinite(remaining)) {
            setRemainingToday(Math.max(0, remaining));
          }
          if (retryAfter > 0) {
            setCooldownSeconds(retryAfter);
            setError(`لا يمكنك كسب XP الآن. الرجاء الانتظار ${formatSecondsAr(retryAfter)}.`);
            emitEvent('ai_tutor_cooldown_hit', { retryAfterSeconds: retryAfter });
          } else {
            setError('تم الوصول للحد اليومي من XP للـ AI Tutor.');
            emitEvent('ai_tutor_daily_cap_hit', { remainingToday: remaining, dailyCap: cap, awardedToday: awarded });
          }
        } else {
          const xpErrMsg = xpErr instanceof Error ? xpErr.message : 'تعذر احتساب XP للمحاولة الحالية.';
      setError(xpErrMsg);
      notify({ message: xpErrMsg, severity: 'warning' });
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'تعذر الحصول على رد المدرس الذكي.';
      
      // Check if it's a quota/billing error
      if (msg.includes('quota') || msg.includes('insufficient') || msg.includes('billing')) {
        setError('📶 المدرس الذكي غير متاح مؤقتًا - يرجى تفعيل OpenAI API Billing في حسابك.')
      } else {
        setError(msg);
      }
      notify({ message: msg, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    playClick();
    await submitSentence(message);
  };

  const handleRetryPrompt = async () => {
    const improvedSentence = correctionParts.correctedExample || tutorParts.naturalAlternative || message;
    if (!improvedSentence.trim()) {
      setError('لا توجد جملة محسّنة حاليًا. نفّذ محاولة واحدة أولًا.');
      return;
    }
    setMessage(improvedSentence);
    emitEvent('ai_tutor_retry', { improvedSentenceLength: improvedSentence.length });
    await submitSentence(improvedSentence);
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ background: 'linear-gradient(135deg, #0B4B88 0%, #0C7FA0 60%, #7BC8A4 100%)', py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 }, mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 1, fontSize: { xs: '1.8rem', md: '2.8rem' } }}>
          🤖 المدرب الذكي AI Tutor
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: { xs: '0.95rem', md: '1.15rem' } }}>
          تصحيح منظم: الخطأ، السبب، مثال مصحح، وتمرين متابعة
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Chip label="✓ مدعوم بالذكاء الاصطناعي" sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }} />
          <Chip label="✓ تصحيح فوري" sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }} />
          <Chip label="✓ شرح بالعربية" sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }} />
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
        <Button onClick={() => navigate('/home')} sx={{ mb: 3, fontWeight: 700 }}>
          العودة للرئيسية
        </Button>

        <Alert severity="info" sx={{ mb: 3 }}>
          📶 <strong>ملاحظة:</strong> إذا ظهرت رسالة "المدرس الذكي غير متاح مؤقتًا"، يرجى تفعيل <strong>OpenAI API Billing</strong> في حسابك على <a href="https://platform.openai.com/account/billing" target="_blank" rel="noopener noreferrer" style={{color: '#0B4B88', fontWeight: 'bold'}}>OpenAI Platform</a>. قد يستغرق التفعيل 1-2 ساعة.
        </Alert>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  select
                  fullWidth
                  label="السيناريو"
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value as Scenario)}
                >
                  <MenuItem value="daily">الحياة اليومية</MenuItem>
                  <MenuItem value="travel">السفر</MenuItem>
                  <MenuItem value="work">العمل</MenuItem>
                  <MenuItem value="migration">الهجرة</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  select
                  fullWidth
                  label="المستوى"
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value as Proficiency)}
                >
                  {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label="اكتب جملتك"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                sx={{ background: 'linear-gradient(135deg, #0B4B88 0%, #2979C1 100%)' }}
              >
                {loading ? '🔄 جارٍ التحليل...' : '🤖 احصل على تصحيح منظم'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleRetryPrompt}
                disabled={loading || !result}
              >
                إعادة المحاولة تلقائيًا
              </Button>
            </Box>

            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={`المتبقي اليوم من XP: ${remainingToday}/${dailyCap}`} color={remainingToday > 0 ? 'primary' : 'warning'} />
              {cooldownSeconds > 0 && <Chip label={`التهدئة: ${formatSecondsAr(cooldownSeconds)}`} color="warning" />}
              {dailyCapReached && (
                <Chip
                  label="تم بلوغ الحد اليومي للـ AI Tutor"
                  color="success"
                  sx={{
                    fontWeight: 700,
                    animation: 'capPulse 1.2s ease-in-out infinite',
                    '@keyframes capPulse': {
                      '0%': { transform: 'scale(1)', boxShadow: '0 0 0 rgba(76,175,80,0.0)' },
                      '50%': { transform: 'scale(1.05)', boxShadow: '0 0 12px rgba(76,175,80,0.35)' },
                      '100%': { transform: 'scale(1)', boxShadow: '0 0 0 rgba(76,175,80,0.0)' },
                    },
                  }}
                />
              )}
            </Box>

            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                <Typography variant="caption" color="text.secondary">تقدم XP اليومي</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  {Math.min(awardedToday, dailyCap)}/{dailyCap}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.max(0, Math.min(100, (Math.min(awardedToday, dailyCap) / Math.max(1, dailyCap)) * 100))}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  background: '#EAF2FF',
                  '& .MuiLinearProgress-bar': {
                    background: remainingToday > 0
                      ? 'linear-gradient(90deg, #0B4B88, #2979C1)'
                      : 'linear-gradient(90deg, #F57C00, #FFB74D)',
                    borderRadius: 5,
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>


        {result && (
          <>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip label={`السيناريو: ${scenarioLabels[result.scenario as Scenario] ?? result.scenario}`} />
              <Chip label={result.safety.blocked ? 'السلامة: محجوب' : 'السلامة: سليم'} color={result.safety.blocked ? 'warning' : 'success'} />
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">الخطأ</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>{correctionParts.mistake || '-'}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">السبب</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>{correctionParts.reason || '-'}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">مثال مصحح</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>{correctionParts.correctedExample || '-'}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">التغذية الراجعة</Typography>
                    <Typography variant="body1">{tutorParts.feedback || '-'}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">بديل طبيعي</Typography>
                    <Typography variant="body1">{tutorParts.naturalAlternative || '-'}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">تمرين مقترح</Typography>
                    <Typography variant="body1">{tutorParts.practicePrompt || '-'}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">الخطوة التالية</Typography>
                <Typography variant="body1">{result.nextStep}</Typography>
              </CardContent>
            </Card>
          </>
        )}

        {history.length > 0 && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
                آخر جلسات AI Tutor
              </Typography>
              <Grid container spacing={1.5}>
                {history.map((item) => {
                  const c = parseCorrection(item.correctionAr);
                  return (
                    <Grid key={item.id} size={{ xs: 12, md: 6 }}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                            <Chip size="small" label={scenarioLabels[item.scenario]} />
                            <Chip size="small" label={item.proficiency} />
                            <Chip
                              size="small"
                              label={new Date(item.at).toLocaleString('ar-EG')}
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="subtitle2" color="text.secondary">الجملة</Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>{item.sentence}</Typography>
                          <Typography variant="subtitle2" color="text.secondary">المثال المصحح</Typography>
                          <Typography variant="body2">{c.correctedExample || '-'}</Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ mt: 1.25 }}
                            onClick={() => {
                              setMessage(item.sentence);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            تدرّب عليها مرة أخرى
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default AITutorPage;
