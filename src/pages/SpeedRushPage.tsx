import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Paper, Stack, IconButton, Grid, Avatar } from '@mui/material';
import { ArrowBack, Timer, Star, Bolt } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAllA1Lessons, type VocabularyItem } from '../core/a1Content';
import { playClick, playSuccess } from '../core/sounds';

// Extract all vocabulary from A1 content
const getAllVocabulary = (): VocabularyItem[] => {
    const allVocab: VocabularyItem[] = [];
    getAllA1Lessons().forEach(lesson => {
        if (lesson.vocabulary) {
            allVocab.push(...lesson.vocabulary);
        }
    });
    return allVocab.filter((v, i, a) => a.findIndex(t => t.word === v.word) === i); // Unique
};

const SpeedRushPage = () => {
    const navigate = useNavigate();
    const [vocabList, setVocabList] = useState<VocabularyItem[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(1);
    const [currentWord, setCurrentWord] = useState<VocabularyItem | null>(null);
    const [options, setOptions] = useState<VocabularyItem[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('lisan_speed_rush_high') || '0'));

    useEffect(() => {
        setVocabList(getAllVocabulary());
    }, []);

    const generateQuestion = useCallback((vList: VocabularyItem[] = vocabList) => {
        if (vList.length < 4) return;
        const target = vList[Math.floor(Math.random() * vList.length)];

        // Pick 3 wrong answers
        const wrongOptions = vList.filter(v => v.word !== target.word).sort(() => 0.5 - Math.random()).slice(0, 3);

        const allOptions = [target, ...wrongOptions].sort(() => 0.5 - Math.random());

        setCurrentWord(target);
        setOptions(allOptions);
    }, [vocabList]);

    const startGame = () => {
        setIsPlaying(true);
        setGameOver(false);
        setTimeLeft(60);
        setScore(0);
        setCombo(1);
        generateQuestion();
        playClick();
    };

    useEffect(() => {
        let timer: any;
        if (isPlaying && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && isPlaying) {
            setIsPlaying(false);
            setGameOver(true);
            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('lisan_speed_rush_high', score.toString());
            }
        }
        return () => clearInterval(timer);
    }, [isPlaying, timeLeft, score, highScore]);

    const handleSelect = (selectedWord: VocabularyItem) => {
        if (!currentWord || gameOver) return;

        if (selectedWord.word === currentWord.word) {
            playSuccess();
            setScore(prev => prev + (10 * combo));
            setCombo(prev => Math.min(prev + 1, 5)); // Max combo x5
            generateQuestion();
        } else {
            // playError();
            setCombo(1); // Break combo
            // Shake effect could be added here
            setTimeout(() => generateQuestion(), 500);
        }
    };

    if (gameOver) {
        return (
            <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F9FBE7', fontFamily: '"Nunito", sans-serif', alignItems: 'center', justifyContent: 'center', p: 3 }}>
                <Paper elevation={0} sx={{ p: 5, borderRadius: 8, textAlign: 'center', maxWidth: 400, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, fontFamily: '"Merriweather", serif', color: '#4CAF50' }}>Time's Up!</Typography>
                    <Typography variant="h6" sx={{ color: '#757575', mb: 4 }}>Great job practicing your vocabulary!</Typography>

                    <Box sx={{ bgcolor: '#E8F5E9', p: 3, borderRadius: 4, mb: 4 }}>
                        <Typography sx={{ fontSize: '1.2rem', color: '#388E3C', fontWeight: 800 }}>Score</Typography>
                        <Typography sx={{ fontSize: '3rem', fontWeight: 900, color: '#4CAF50', lineHeight: 1 }}>{score}</Typography>

                        {score >= highScore && score > 0 && (
                            <Box sx={{ display: 'inline-block', bgcolor: '#FFB74D', color: 'white', px: 2, py: 0.5, borderRadius: 4, mt: 1, fontWeight: 800, fontSize: '0.8rem' }}>
                                NEW HIGH SCORE! 🏆
                            </Box>
                        )}
                    </Box>

                    <Stack spacing={2}>
                        <Button variant="contained" color="primary" fullWidth size="large" onClick={startGame} sx={{ borderRadius: 4, py: 1.5, fontWeight: 800, fontSize: '1.1rem' }}>
                            Play Again
                        </Button>
                        <Button variant="text" color="inherit" fullWidth onClick={() => navigate('/home')} sx={{ fontWeight: 700, color: '#757575' }}>
                            Back to Dashboard
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        );
    }

    if (!isPlaying) {
        return (
            <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F9FBE7', fontFamily: '"Nunito", sans-serif' }}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => navigate('/home')} sx={{ bgcolor: 'white', color: '#4CAF50', width: 40, height: 40, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <ArrowBack fontSize="small" />
                    </IconButton>
                </Box>

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
                    <Avatar sx={{ width: 100, height: 100, bgcolor: '#FFCA28', mb: 4, boxShadow: '0 8px 24px rgba(255, 202, 40, 0.4)' }}>
                        <Bolt sx={{ fontSize: '4rem', color: 'white' }} />
                    </Avatar>

                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, fontFamily: '"Merriweather", serif', color: '#424242', textAlign: 'center' }}>
                        Speed Rush
                    </Typography>

                    <Typography variant="body1" sx={{ color: '#757575', mb: 6, textAlign: 'center', maxWidth: 300 }}>
                        Match as many words as you can in 60 seconds. Build your combo for extra points!
                    </Typography>

                    <Paper elevation={0} sx={{ p: 2, borderRadius: 4, mb: 6, display: 'flex', alignItems: 'center', gap: 2, px: 4, bgcolor: 'white' }}>
                        <Star sx={{ color: '#FFCA28', fontSize: '2rem' }} />
                        <Box>
                            <Typography sx={{ color: '#9E9E9E', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>High Score</Typography>
                            <Typography sx={{ color: '#424242', fontSize: '1.5rem', fontWeight: 900, lineHeight: 1 }}>{highScore}</Typography>
                        </Box>
                    </Paper>

                    <Button variant="contained" color="secondary" size="large" onClick={startGame} sx={{ borderRadius: 8, py: 2, px: 6, fontWeight: 900, fontSize: '1.2rem', boxShadow: '0 8px 24px rgba(156, 39, 176, 0.3)', '&:hover': { transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}>
                        START CHALLENGE
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F9FBE7', fontFamily: '"Nunito", sans-serif' }}>
            {/* Game Header */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', borderRadius: '0 0 24px 24px', zIndex: 10, position: 'relative' }}>
                {/* Score & Combo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box>
                        <Typography sx={{ fontSize: '0.7rem', color: '#9E9E9E', fontWeight: 800, textTransform: 'uppercase' }}>Score</Typography>
                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, color: '#4CAF50', lineHeight: 1 }}>{score}</Typography>
                    </Box>

                    {combo > 1 && (
                        <Paper elevation={0} sx={{ bgcolor: '#FFB74D', color: 'white', px: 1.5, py: 0.5, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Bolt fontSize="small" />
                            <Typography sx={{ fontWeight: 900, fontSize: '1rem' }}>x{combo}</Typography>
                        </Paper>
                    )}
                </Box>

                {/* Timer */}
                <Paper elevation={0} sx={{ bgcolor: timeLeft <= 10 ? '#FFEBEE' : '#E8F5E9', p: 1, px: 2, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Timer sx={{ color: timeLeft <= 10 ? '#F44336' : '#4CAF50' }} />
                    <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', color: timeLeft <= 10 ? '#F44336' : '#4CAF50' }}>{timeLeft}s</Typography>
                </Paper>
            </Box>

            {/* Game Area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
                {currentWord && (
                    <>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 8, mb: 6, width: '100%', maxWidth: 400, textAlign: 'center', bgcolor: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
                            <Typography sx={{ fontSize: '1.2rem', color: '#9E9E9E', fontWeight: 700, mb: 1 }}>What is the meaning of</Typography>
                            <Typography sx={{ fontSize: '3rem', fontWeight: 900, color: '#424242', fontFamily: '"Merriweather", serif' }}>
                                {currentWord.word}
                            </Typography>
                        </Paper>

                        <Grid container spacing={2} sx={{ maxWidth: 400 }}>
                            {options.map((opt) => (
                                <Grid size={{ xs: 6 }} key={opt.word}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => handleSelect(opt)}
                                        sx={{
                                            py: 3,
                                            borderRadius: 4,
                                            bgcolor: 'white',
                                            color: '#424242',
                                            fontWeight: 800,
                                            fontSize: '1.1rem',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                            '&:hover': {
                                                bgcolor: '#F5F5F5',
                                                boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                                                transform: 'translateY(-2px)'
                                            },
                                            transition: 'all 0.2s',
                                            textTransform: 'none'
                                        }}
                                    >
                                        {opt.translation}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default SpeedRushPage;
