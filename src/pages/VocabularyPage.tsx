import { useState } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Button,
    Chip, Dialog, DialogContent, IconButton, LinearProgress, Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { vocabularyWords } from '../core/data';
import { useProgress } from '../core/ProgressContext';
import { speakWord, playClick, playStar, playCorrect, playWrong, playSuccess } from '../core/sounds';
import { reviewItem, getDueReviews, getSRSStats, type SRSItem } from '../core/srsEngine';
import { motion } from 'framer-motion';

const categories = ['All', ...Array.from(new Set(vocabularyWords.map((word) => word.category)))];

const VocabularyPage = () => {
    const navigate = useNavigate();
    const { progress, markVocabularyDone } = useProgress();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [flashcard, setFlashcard] = useState<typeof vocabularyWords[0] | null>(null);
    const [flipped, setFlipped] = useState(false);

    // SRS State
    const [srsMode, setSrsMode] = useState(false);
    const [dueItems, setDueItems] = useState<SRSItem[]>([]);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [reviewStartTime, setReviewStartTime] = useState<number>(0);
    const [stats, setStats] = useState(getSRSStats());

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

    const handleLearnedIt = async () => {
        if (flashcard) {
            playStar();
            markVocabularyDone(flashcard.id);
            // Add to SRS
            await reviewItem(`vocab-${flashcard.id}`, 'vocabulary', true, 1);
            setStats(getSRSStats());
            setFlashcard(null);
        }
    };

    const startSRSReview = async () => {
        const due = (await getDueReviews()).filter(item => item.type === 'vocabulary');
        if (due.length > 0) {
            setDueItems(due);
            setCurrentReviewIndex(0);
            setReviewStartTime(Date.now());
            setSrsMode(true);
            playClick();
        }
    };

    const handleSRSAnswer = async (isCorrect: boolean) => {
        const item = dueItems[currentReviewIndex];
        const timeTaken = (Date.now() - reviewStartTime) / 1000;

        await reviewItem(item.id, 'vocabulary', isCorrect, timeTaken);

        if (isCorrect) playCorrect(); else playWrong();

        if (currentReviewIndex + 1 < dueItems.length) {
            setCurrentReviewIndex(prev => prev + 1);
            setReviewStartTime(Date.now());
        } else {
            // Finished review session
            playSuccess();
            setSrsMode(false);
            setDueItems([]);
            setStats(getSRSStats());
        }
    };

    // If in SRS mode, render the review UI entirely
    if (srsMode && dueItems.length > 0) {
        const currentItem = dueItems[currentReviewIndex];
        const vocabId = parseInt(currentItem.id.replace('vocab-', ''), 10);
        const word = vocabularyWords.find(w => w.id === vocabId);

        if (!word) {
            setSrsMode(false);
            return null;
        }

        return (
            <Box sx={{ height: '100dvh', bgcolor: '#121212', color: 'white', display: 'flex', flexDirection: 'column', p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 800, color: '#FF9800' }}>🧠 Memory Review</Typography>
                    <Typography sx={{ fontWeight: 800 }}>{currentReviewIndex + 1} / {dueItems.length}</Typography>
                    <IconButton onClick={() => setSrsMode(false)} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>✕</IconButton>
                </Box>

                <LinearProgress variant="determinate" value={(currentReviewIndex / dueItems.length) * 100} sx={{ mb: 4, height: 8, borderRadius: 4, '& .MuiLinearProgress-bar': { background: '#FF9800' } }} />

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key={word.id}>
                        <Card sx={{ width: 320, minHeight: 400, borderRadius: 6, bgcolor: '#1E1E1E', color: 'white', p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 16px 40px rgba(0,0,0,0.5)', border: '2px solid #333' }}>
                            <Typography sx={{ fontSize: '5rem', mb: 2 }}>{word.emoji}</Typography>
                            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>{word.word}</Typography>

                            {!flipped ? (
                                <Button variant="contained" onClick={() => setFlipped(true)} sx={{ mt: 4, bgcolor: '#FF9800', color: 'black', fontWeight: 800, '&:hover': { bgcolor: '#F57C00' }, borderRadius: 4, py: 1.5, px: 4 }}>
                                    Show Meaning
                                </Button>
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 800, mt: 3, mb: 2 }}>{word.translation}</Typography>
                                    <Box sx={{ display: 'flex', gap: 2, mt: 4, width: '100%' }}>
                                        <Button fullWidth variant="contained" color="error" onClick={() => { handleSRSAnswer(false); setFlipped(false); }} sx={{ py: 2, fontWeight: 800, borderRadius: 4 }}>
                                            Forgot (1)
                                        </Button>
                                        <Button fullWidth variant="contained" color="success" onClick={() => { handleSRSAnswer(true); setFlipped(false); }} sx={{ py: 2, fontWeight: 800, borderRadius: 4 }}>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Button onClick={() => navigate('/home')} sx={{ color: '#6C63FF', fontWeight: 700 }} startIcon={<span>←</span>}>
                        Back to Home
                    </Button>

                    <Button
                        variant="contained"
                        onClick={startSRSReview}
                        disabled={stats.due === 0}
                        sx={{
                            background: stats.due > 0 ? 'linear-gradient(135deg, #FF9800, #F57C00)' : '#E0E0E0',
                            color: stats.due > 0 ? 'white' : '#9E9E9E',
                            fontWeight: 800,
                            borderRadius: 4,
                            px: 3,
                            boxShadow: stats.due > 0 ? '0 4px 12px rgba(255,152,0,0.3)' : 'none'
                        }}
                        startIcon={<span>🧠</span>}
                    >
                        Review Due ({stats.due})
                    </Button>
                </Box>

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
