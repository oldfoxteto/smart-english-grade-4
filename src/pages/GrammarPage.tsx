import { useState } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Button,
    Collapse, Chip, LinearProgress, IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { grammarLessons } from '../core/data';
import { useProgress } from '../core/ProgressContext';
import { playClick, playSuccess, playStar, playCorrect, playWrong } from '../core/sounds';
import { getDueReviews, getSRSStats, reviewItem, type SRSItem } from '../core/srsEngine';
import { motion } from 'framer-motion';

const GrammarPage = () => {
    const navigate = useNavigate();
    const { progress, markGrammarDone } = useProgress();
    const [expanded, setExpanded] = useState<number | null>(null);

    // SRS State
    const [srsMode, setSrsMode] = useState(false);
    const [dueItems, setDueItems] = useState<SRSItem[]>([]);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [reviewStartTime, setReviewStartTime] = useState<number>(0);
    const [srsStats, setSrsStats] = useState(getSRSStats());

    const completed = progress.grammarCompleted.length;
    const pct = Math.round((completed / grammarLessons.length) * 100);

    const toggle = (id: number) => setExpanded(prev => (prev === id ? null : id));

    const startSRSReview = async () => {
        const due = (await getDueReviews()).filter(item => item.type === 'grammar');
        if (due.length === 0) return;
        setDueItems(due);
        setCurrentReviewIndex(0);
        setReviewStartTime(Date.now());
        setSrsMode(true);
        playClick();
    };

    const handleSRSAnswer = async (isCorrect: boolean) => {
        const item = dueItems[currentReviewIndex];
        const timeTaken = (Date.now() - reviewStartTime) / 1000;

        await reviewItem(item.id, 'grammar', isCorrect, timeTaken);

        if (isCorrect) playCorrect(); else playWrong();

        if (currentReviewIndex + 1 < dueItems.length) {
            setCurrentReviewIndex(prev => prev + 1);
            setReviewStartTime(Date.now());
        } else {
            // Finished review session
            playSuccess();
            setSrsMode(false);
            setDueItems([]);
            setSrsStats(getSRSStats());
        }
    };

    // SRS Review UI
    if (srsMode && dueItems.length > 0) {
        const currentItem = dueItems[currentReviewIndex];
        const grammarId = parseInt(currentItem.id.replace('grammar-', ''), 10);
        const lesson = grammarLessons.find(g => g.id === grammarId);

        if (!lesson) {
            setSrsMode(false);
            return null;
        }

        return (
            <Box sx={{ height: '100dvh', bgcolor: '#121212', color: 'white', display: 'flex', flexDirection: 'column', p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 800, color: '#FF9800' }}>🧠 Grammar Review</Typography>
                    <Typography sx={{ fontWeight: 800 }}>{currentReviewIndex + 1} / {dueItems.length}</Typography>
                    <IconButton onClick={() => setSrsMode(false)} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>✕</IconButton>
                </Box>

                <LinearProgress variant="determinate" value={(currentReviewIndex / dueItems.length) * 100} sx={{ mb: 4, height: 8, borderRadius: 4, '& .MuiLinearProgress-bar': { background: '#FF9800' } }} />

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key={lesson.id} style={{ width: '100%', maxWidth: 500 }}>
                        <Card sx={{ width: '100%', minHeight: 300, borderRadius: 6, bgcolor: '#1E1E1E', color: 'white', p: 4, boxShadow: '0 16px 40px rgba(0,0,0,0.5)', border: '2px solid #333' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Typography sx={{ fontSize: '3rem', mr: 2 }}>{lesson.emoji}</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 800 }}>{lesson.title}</Typography>
                            </Box>

                            <Typography variant="body1" sx={{ color: '#E0E0E0', fontSize: '1.1rem', mb: 4, lineHeight: 1.6 }}>
                                Do you remember the rule for this?
                            </Typography>

                            {expanded !== lesson.id ? (
                                <Button fullWidth variant="contained" onClick={() => setExpanded(lesson.id)} sx={{ bgcolor: '#FF9800', color: 'black', fontWeight: 800, '&:hover': { bgcolor: '#F57C00' }, borderRadius: 4, py: 1.5 }}>
                                    Show Explanation
                                </Button>
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', p: 2, borderRadius: 3, mb: 3, borderLeft: `4px solid ${lesson.color}` }}>
                                        <Typography sx={{ mb: 2 }}>{lesson.explanation}</Typography>
                                        {lesson.examples.slice(0, 2).map((ex, i) => (
                                            <Typography key={i} variant="body2" sx={{ color: '#A5D6A7', mb: 0.5 }}>• {ex}</Typography>
                                        ))}
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                                        <Button fullWidth variant="contained" color="error" onClick={() => { handleSRSAnswer(false); setExpanded(null); }} sx={{ py: 2, fontWeight: 800, borderRadius: 4 }}>
                                            Forgot (1)
                                        </Button>
                                        <Button fullWidth variant="contained" color="success" onClick={() => { handleSRSAnswer(true); setExpanded(null); }} sx={{ py: 2, fontWeight: 800, borderRadius: 4 }}>
                                            Remembered (3)
                                        </Button>
                                    </Box>
                                </motion.div>
                            )}
                        </Card>
                    </motion.div>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ pb: 6 }}>
            {/* Page Header */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #FF6B6B 0%, #FF9999 100%)',
                    py: 4, px: 3, mb: 4, textAlign: 'center',
                }}
            >
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 1 }}>
                    âœï¸ Grammar Lessons
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', mb: 2 }}>
                    Learn the rules of English!
                </Typography>
                <Box sx={{ maxWidth: 400, mx: 'auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            {completed} / {grammarLessons.length} lessons completed
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>
                            {pct}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                            height: 10, borderRadius: 5,
                            background: 'rgba(255,255,255,0.2)',
                            '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                                borderRadius: 5,
                            },
                        }}
                    />
                </Box>
            </Box>

            <Box sx={{ px: { xs: 2, md: 4 } }}>
                <Button
                    onClick={() => navigate('/home')}
                    sx={{ mb: 3, color: '#FF6B6B', fontWeight: 700 }}
                    startIcon={<span>â†</span>}
                >
                    Back to Home
                </Button>
                <Button
                    onClick={startSRSReview}
                    disabled={srsStats.due === 0}
                    variant="contained"
                    sx={{ mb: 3, ml: 1, fontWeight: 700 }}
                >
                    Memory Review ({srsStats.due})
                </Button>

                <Grid container spacing={3}>
                    {grammarLessons.map(lesson => {
                        const isDone = progress.grammarCompleted.includes(lesson.id);
                        const isOpen = expanded === lesson.id;

                        return (
                            <Grid size={{ xs: 12, md: 6 }} key={lesson.id}>
                                <Card
                                    sx={{
                                        border: isDone ? `2px solid ${lesson.color}` : '2px solid transparent',
                                        background: isDone ? `${lesson.color}08` : 'white',
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        {/* Header row */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Box
                                                sx={{
                                                    width: 56,
                                                    height: 56,
                                                    borderRadius: '14px',
                                                    background: `linear-gradient(135deg, ${lesson.color}, ${lesson.color}99)`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.8rem',
                                                    mr: 2,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {lesson.emoji}
                                            </Box>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                                        {lesson.title}
                                                    </Typography>
                                                    {isDone && <Chip label="âœ… Done" size="small" sx={{ background: '#E8F5E9', color: '#2E7D32', fontWeight: 700 }} />}
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                                                    {lesson.explanation.substring(0, 60)}...
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Toggle button */}
                                        <Button
                                            fullWidth
                                            variant={isOpen ? 'contained' : 'outlined'}
                                            onClick={() => { playClick(); toggle(lesson.id); }}
                                            sx={{
                                                mb: isOpen ? 2 : 0,
                                                borderColor: lesson.color,
                                                color: isOpen ? 'white' : lesson.color,
                                                background: isOpen ? `linear-gradient(135deg, ${lesson.color}, ${lesson.color}99)` : 'transparent',
                                                '&:hover': {
                                                    background: `linear-gradient(135deg, ${lesson.color}, ${lesson.color}99)`,
                                                    color: 'white',
                                                },
                                            }}
                                        >
                                            {isOpen ? 'Hide Lesson â–²' : 'Learn This! â–¼'}
                                        </Button>

                                        {/* Expandable content */}
                                        <Collapse in={isOpen}>
                                            <Box
                                                sx={{
                                                    background: '#F8F9FF',
                                                    borderRadius: '12px',
                                                    p: 2.5,
                                                    mb: 2,
                                                }}
                                            >
                                                <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: '#2D3748' }}>
                                                    {lesson.explanation}
                                                </Typography>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: lesson.color }}>
                                                    ðŸ“Œ Examples:
                                                </Typography>
                                                {lesson.examples.map((ex, i) => (
                                                    <Box
                                                        key={i}
                                                        sx={{
                                                            background: 'white',
                                                            borderRadius: '8px',
                                                            p: 1.5,
                                                            mb: 1,
                                                            borderLeft: `4px solid ${lesson.color}`,
                                                        }}
                                                    >
                                                        <Typography variant="body2">{ex}</Typography>
                                                    </Box>
                                                ))}
                                            </Box>

                                            <Button
                                                variant="contained"
                                                fullWidth
                                                disabled={isDone}
                                                onClick={() => { playSuccess(); playStar(); markGrammarDone(lesson.id); }}
                                                sx={{
                                                    background: isDone
                                                        ? '#E8F5E9'
                                                        : `linear-gradient(135deg, ${lesson.color}, ${lesson.color}99)`,
                                                    color: isDone ? '#2E7D32' : 'white',
                                                }}
                                            >
                                                {isDone ? 'âœ… Lesson Completed! (+5 â­)' : 'Mark as Completed! â­â­â­â­â­'}
                                            </Button>
                                        </Collapse>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        </Box>
    );
};

export default GrammarPage;
