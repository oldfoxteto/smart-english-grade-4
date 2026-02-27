import { useState } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Button,
    Collapse, Chip, LinearProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { grammarLessons } from '../core/data';
import { useProgress } from '../core/ProgressContext';
import { playClick, playSuccess, playStar } from '../core/sounds';

const GrammarPage = () => {
    const navigate = useNavigate();
    const { progress, markGrammarDone } = useProgress();
    const [expanded, setExpanded] = useState<number | null>(null);

    const completed = progress.grammarCompleted.length;
    const pct = Math.round((completed / grammarLessons.length) * 100);

    const toggle = (id: number) => setExpanded(prev => (prev === id ? null : id));

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
