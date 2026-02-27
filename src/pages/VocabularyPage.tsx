import { useState } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Button,
    Chip, Dialog, DialogContent, IconButton, LinearProgress, Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { vocabularyWords } from '../core/data';
import { useProgress } from '../core/ProgressContext';
import { speakWord, playClick, playStar } from '../core/sounds';

const categories = ['All', 'Fruits', 'Animals', 'Places', 'Feelings', 'Actions'];

const VocabularyPage = () => {
    const navigate = useNavigate();
    const { progress, markVocabularyDone } = useProgress();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [flashcard, setFlashcard] = useState<typeof vocabularyWords[0] | null>(null);
    const [flipped, setFlipped] = useState(false);

    const filtered = selectedCategory === 'All'
        ? vocabularyWords
        : vocabularyWords.filter(w => w.category === selectedCategory);

    const completed = progress.vocabularyCompleted.length;
    const pct = Math.round((completed / vocabularyWords.length) * 100);

    const openFlashcard = (word: typeof vocabularyWords[0]) => {
        setFlashcard(word);
        setFlipped(false);
        playClick();
        speakWord(word.word);
    };

    const handleLearnedIt = () => {
        if (flashcard) {
            playStar();
            markVocabularyDone(flashcard.id);
            setFlashcard(null);
        }
    };

    return (
        <Box sx={{ pb: 6 }}>
            {/* Page Header */}
            <Box sx={{ background: 'linear-gradient(135deg, #6C63FF 0%, #9D97FF 100%)', py: 4, px: 3, mb: 4, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 1 }}>📖 Vocabulary Practice</Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', mb: 2 }}>Click a word to hear it and see its flashcard!</Typography>
                <Box sx={{ maxWidth: 400, mx: 'auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>{completed} / {vocabularyWords.length} words learned</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>{pct}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={pct} sx={{ height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #FFD700, #FFA500)', borderRadius: 5 } }} />
                </Box>
            </Box>

            <Box sx={{ px: { xs: 2, md: 4 } }}>
                <Button onClick={() => navigate('/home')} sx={{ mb: 3, color: '#6C63FF', fontWeight: 700 }} startIcon={<span>←</span>}>
                    Back to Home
                </Button>

                {/* Category Filter */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                    {categories.map(cat => (
                        <Chip key={cat} label={cat} onClick={() => setSelectedCategory(cat)}
                            sx={{ fontWeight: 700, cursor: 'pointer', background: selectedCategory === cat ? 'linear-gradient(135deg, #6C63FF, #9D97FF)' : '#F0F4FF', color: selectedCategory === cat ? 'white' : '#6C63FF', border: '2px solid', borderColor: selectedCategory === cat ? 'transparent' : '#6C63FF30', '&:hover': { opacity: 0.85 } }}
                        />
                    ))}
                </Box>

                {/* Word Cards Grid - MUI v7 uses size prop */}
                <Grid container spacing={2}>
                    {filtered.map(word => {
                        const isDone = progress.vocabularyCompleted.includes(word.id);
                        return (
                            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={word.id}>
                                <Card onClick={() => openFlashcard(word)}
                                    sx={{ cursor: 'pointer', textAlign: 'center', p: 1, border: isDone ? '2px solid #4CAF50' : '2px solid transparent', background: isDone ? '#F1FFF3' : 'white', position: 'relative', height: '100%' }}
                                >
                                    {isDone && <Box sx={{ position: 'absolute', top: 8, right: 8, fontSize: '1rem' }}>✅</Box>}
                                    <CardContent sx={{ p: '16px !important' }}>
                                        <Typography sx={{ fontSize: '2.5rem', mb: 1 }}>{word.emoji}</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#6C63FF' }}>{word.word}</Typography>
                                        <Typography variant="body2" color="text.secondary">{word.translation}</Typography>
                                        <Chip label={word.category} size="small" sx={{ mt: 1, fontSize: '0.7rem', background: '#F0F4FF', color: '#6C63FF' }} />
                                        <Box sx={{ mt: 1 }}>
                                            <Tooltip title="Listen">
                                                <IconButton size="small" onClick={e => { e.stopPropagation(); speakWord(word.word); }} sx={{ color: '#6C63FF' }}>🔊</IconButton>
                                            </Tooltip>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>

            {/* Flashcard Dialog */}
            <Dialog open={!!flashcard} onClose={() => setFlashcard(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '24px', overflow: 'visible' } }}>
                {flashcard && (
                    <DialogContent sx={{ p: 4, textAlign: 'center' }}>
                        <IconButton onClick={() => setFlashcard(null)} sx={{ position: 'absolute', top: -16, right: -16, background: 'white', boxShadow: 2 }}>✕</IconButton>

                        {/* Flashcard */}
                        <Box
                            onClick={() => { setFlipped(!flipped); if (!flipped) speakWord(flashcard.word); }}
                            sx={{ minHeight: 220, borderRadius: '20px', background: flipped ? 'linear-gradient(135deg, #4CAF50, #81C784)' : 'linear-gradient(135deg, #6C63FF, #9D97FF)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', mb: 2, p: 3, transition: 'all 0.4s ease', boxShadow: '0 12px 40px rgba(108,99,255,0.3)' }}
                        >
                            {!flipped ? (
                                <>
                                    <Typography sx={{ fontSize: '4rem', mb: 1 }}>{flashcard.emoji}</Typography>
                                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 800 }}>{flashcard.word}</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>👆 Tap to reveal meaning</Typography>
                                </>
                            ) : (
                                <>
                                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 1 }}>{flashcard.translation}</Typography>
                                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', textAlign: 'center', px: 2 }}>"{flashcard.example}"</Typography>
                                </>
                            )}
                        </Box>

                        {/* Listen button */}
                        <Button fullWidth variant="outlined" onClick={() => speakWord(flashcard.word)}
                            sx={{ mb: 2, borderColor: '#6C63FF', color: '#6C63FF', fontWeight: 700, fontSize: '1rem' }}>
                            🔊 Listen: "{flashcard.word}"
                        </Button>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button variant="outlined" fullWidth onClick={() => setFlashcard(null)} sx={{ borderColor: '#6C63FF', color: '#6C63FF' }}>Skip</Button>
                            <Button variant="contained" fullWidth onClick={handleLearnedIt} disabled={progress.vocabularyCompleted.includes(flashcard.id)}
                                sx={{ background: 'linear-gradient(135deg, #4CAF50, #81C784)' }}>
                                {progress.vocabularyCompleted.includes(flashcard.id) ? '✅ Done!' : 'I Learned It! ⭐'}
                            </Button>
                        </Box>
                    </DialogContent>
                )}
            </Dialog>
        </Box>
    );
};

export default VocabularyPage;
