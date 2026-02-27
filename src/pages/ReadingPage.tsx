import { useState } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Button,
    Chip, Dialog, DialogContent, DialogActions, Alert, LinearProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { readingStories } from '../core/data';
import { useProgress } from '../core/ProgressContext';
import { speakWord, playCorrect, playWrong, playSuccess } from '../core/sounds';

const levelColors: Record<string, string> = { Easy: '#4CAF50', Medium: '#FF9800', Hard: '#6C63FF' };

const ReadingPage = () => {
    const navigate = useNavigate();
    const { progress, markStoryDone } = useProgress();
    const [openStory, setOpenStory] = useState<typeof readingStories[0] | null>(null);
    const [phase, setPhase] = useState<'read' | 'quiz' | 'result'>('read');
    const [answers, setAnswers] = useState<number[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);

    const completed = progress.storiesCompleted.length;
    const pct = Math.round((completed / readingStories.length) * 100);

    const startStory = (story: typeof readingStories[0]) => {
        setOpenStory(story);
        setPhase('read');
        setAnswers([]);
        setCurrentQ(0);
        setScore(0);
    };

    const handleAnswer = (answerIdx: number) => {
        if (!openStory) return;
        const q = openStory.questions[currentQ];
        const isCorrect = answerIdx === q.answer;
        const newScore = isCorrect ? score + 1 : score;
        const newAnswers = [...answers, answerIdx];

        if (isCorrect) playCorrect(); else playWrong();

        if (currentQ + 1 < openStory.questions.length) {
            setCurrentQ(currentQ + 1);
            setScore(newScore);
            setAnswers(newAnswers);
        } else {
            setScore(newScore);
            setAnswers(newAnswers);
            setPhase('result');
            if (!progress.storiesCompleted.includes(openStory.id)) markStoryDone(openStory.id);
            if (newScore / openStory.questions.length >= 0.5) playSuccess();
        }
    };

    const closeDialog = () => { setOpenStory(null); setPhase('read'); };

    return (
        <Box sx={{ pb: 6 }}>
            <Box sx={{ background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)', py: 4, px: 3, mb: 4, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 1 }}>📚 Reading Stories</Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', mb: 2 }}>Read, listen, and answer questions to earn stars!</Typography>
                <Box sx={{ maxWidth: 400, mx: 'auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>{completed} / {readingStories.length} stories completed</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>{pct}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={pct} sx={{ height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #FFD700, #FFA500)', borderRadius: 5 } }} />
                </Box>
            </Box>

            <Box sx={{ px: { xs: 2, md: 4 } }}>
                <Button onClick={() => navigate('/home')} sx={{ mb: 3, color: '#4CAF50', fontWeight: 700 }} startIcon={<span>←</span>}>Back to Home</Button>

                <Grid container spacing={3}>
                    {readingStories.map(story => {
                        const isDone = progress.storiesCompleted.includes(story.id);
                        return (
                            <Grid size={{ xs: 12, md: 4 }} key={story.id}>
                                <Card sx={{ height: '100%', border: isDone ? `2px solid ${story.color}` : '2px solid transparent', background: isDone ? `${story.color}08` : 'white' }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ width: '100%', height: 120, borderRadius: '16px', background: `linear-gradient(135deg, ${story.color}, ${story.color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', mb: 2 }}>
                                            {story.emoji}
                                        </Box>
                                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{story.title}</Typography>
                                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                            <Chip label={story.level} size="small" sx={{ background: `${levelColors[story.level]}20`, color: levelColors[story.level], fontWeight: 700, border: `1px solid ${levelColors[story.level]}40` }} />
                                            <Chip label={`${story.questions.length} Questions`} size="small" sx={{ background: '#F0F4FF', color: '#6C63FF', fontWeight: 700 }} />
                                            {isDone && <Chip label="✅ Done" size="small" sx={{ background: '#E8F5E9', color: '#2E7D32', fontWeight: 700 }} />}
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{story.text.substring(0, 100)}...</Typography>
                                        <Button variant="contained" fullWidth onClick={() => startStory(story)} sx={{ background: `linear-gradient(135deg, ${story.color}, ${story.color}99)` }}>
                                            {isDone ? '📖 Read Again' : '📖 Read Story (+10 ⭐)'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>

            {/* Story Dialog */}
            <Dialog open={!!openStory} onClose={closeDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '24px', maxHeight: '90vh' } }}>
                {openStory && (
                    <>
                        <DialogContent sx={{ p: { xs: 3, md: 4 } }}>
                            {/* Reading Phase */}
                            {phase === 'read' && (
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <Typography sx={{ fontSize: '3rem' }}>{openStory.emoji}</Typography>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 800 }}>{openStory.title}</Typography>
                                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                                <Chip label={openStory.level} size="small" sx={{ background: `${levelColors[openStory.level]}20`, color: levelColors[openStory.level], fontWeight: 700 }} />
                                                <Button size="small" onClick={() => speakWord(openStory.title)} sx={{ color: '#4CAF50', p: 0.5, minWidth: 'auto' }}>🔊 Listen</Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box sx={{ background: '#F8F9FF', borderRadius: '16px', p: 3, mb: 3, borderLeft: `4px solid ${openStory.color}` }}>
                                        {openStory.text.split('\n\n').map((para, i) => (
                                            <Typography key={i} variant="body1" sx={{ mb: 2, lineHeight: 1.9, fontSize: '1.1rem' }}>{para}</Typography>
                                        ))}
                                    </Box>
                                    {/* Read aloud button */}
                                    <Button fullWidth variant="outlined" onClick={() => speakWord(openStory.text.substring(0, 300))}
                                        sx={{ mb: 2, borderColor: '#4CAF50', color: '#4CAF50', fontWeight: 700 }}>
                                        🔊 Read Story Aloud (first part)
                                    </Button>
                                </Box>
                            )}

                            {/* Quiz Phase */}
                            {phase === 'quiz' && (
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 800 }}>🎯 Question {currentQ + 1} of {openStory.questions.length}</Typography>
                                        <Chip label={`Score: ${score}`} sx={{ background: '#F0F4FF', color: '#6C63FF', fontWeight: 700 }} />
                                    </Box>
                                    <LinearProgress variant="determinate" value={(currentQ / openStory.questions.length) * 100}
                                        sx={{ mb: 3, height: 8, borderRadius: 4, '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg, ${openStory.color}, ${openStory.color}99)` } }} />
                                    <Box sx={{ background: '#F8F9FF', borderRadius: '16px', p: 3, mb: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1 }}>{openStory.questions[currentQ].question}</Typography>
                                            <Button size="small" onClick={() => speakWord(openStory.questions[currentQ].question)} sx={{ color: openStory.color, minWidth: 'auto', p: 0.5 }}>🔊</Button>
                                        </Box>
                                        <Grid container spacing={2}>
                                            {openStory.questions[currentQ].options.map((opt, i) => (
                                                <Grid size={{ xs: 12, sm: 6 }} key={i}>
                                                    <Button fullWidth variant="outlined" onClick={() => handleAnswer(i)}
                                                        sx={{ py: 1.5, borderColor: '#6C63FF30', color: '#2D3748', fontWeight: 600, justifyContent: 'flex-start', textAlign: 'left', '&:hover': { background: `${openStory.color}15`, borderColor: openStory.color } }}>
                                                        <Chip label={String.fromCharCode(65 + i)} size="small" sx={{ mr: 1, background: openStory.color, color: 'white', fontWeight: 700 }} />
                                                        {opt}
                                                    </Button>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </Box>
                            )}

                            {/* Result Phase */}
                            {phase === 'result' && (
                                <Box sx={{ textAlign: 'center', py: 2 }}>
                                    <Typography sx={{ fontSize: '5rem', mb: 2 }}>
                                        {score === openStory.questions.length ? '🏆' : score >= openStory.questions.length / 2 ? '🌟' : '💪'}
                                    </Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                                        {score === openStory.questions.length ? 'Perfect!' : score >= openStory.questions.length / 2 ? 'Great Job!' : 'Keep Trying!'}
                                    </Typography>
                                    <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>You got {score} out of {openStory.questions.length} correct!</Typography>
                                    <Alert severity={score >= openStory.questions.length / 2 ? 'success' : 'info'} sx={{ borderRadius: '12px', mb: 3, fontSize: '1rem' }}>
                                        {score >= openStory.questions.length / 2 ? '🎉 Amazing! You earned 10 ⭐ stars!' : '📚 Read the story again and try the quiz!'}
                                    </Alert>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                                        {openStory.questions.map((q, i) => (
                                            <Chip key={i} label={`Q${i + 1}: ${answers[i] === q.answer ? '✅' : '❌'}`}
                                                sx={{ background: answers[i] === q.answer ? '#E8F5E9' : '#FFEBEE', color: answers[i] === q.answer ? '#2E7D32' : '#C62828', fontWeight: 700 }} />
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </DialogContent>

                        <DialogActions sx={{ p: 3, pt: 0 }}>
                            {phase === 'read' && (
                                <>
                                    <Button onClick={closeDialog} sx={{ color: 'text.secondary' }}>Close</Button>
                                    <Button variant="contained" onClick={() => setPhase('quiz')} sx={{ background: `linear-gradient(135deg, ${openStory.color}, ${openStory.color}99)` }}>Start Quiz! 🎯</Button>
                                </>
                            )}
                            {phase === 'result' && (
                                <>
                                    <Button onClick={() => { setPhase('read'); setCurrentQ(0); setScore(0); setAnswers([]); }} sx={{ color: 'text.secondary' }}>Read Again</Button>
                                    <Button variant="contained" onClick={closeDialog} sx={{ background: 'linear-gradient(135deg, #4CAF50, #81C784)' }}>Back to Stories ✅</Button>
                                </>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default ReadingPage;
