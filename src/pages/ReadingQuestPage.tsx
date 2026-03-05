import { useState, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, Button, LinearProgress } from '@mui/material';
import { ArrowBack, VolumeUp, CheckCircle, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { playClick, playSuccess } from '../core/sounds';
import { awardXp } from '../core/api';
import { useProgress } from '../core/ProgressContext';

// Mock Story Data
const storyData = {
    id: 'quest-1',
    title: 'The Magic Forest',
    image: '🌲',
    paragraphs: [
        {
            text: "Once upon a time, there was a small boy named Ali. He lived near a big, dark forest. Everyone said the forest was magic. Ali wanted to see the magic.",
            dictionary: {
                'Once': 'في قديم الزمان',
                'time': 'وقت',
                'small': 'صغير',
                'boy': 'ولد',
                'named': 'اسمه',
                'lived': 'عاش',
                'near': 'بالقرب من',
                'big': 'كبير',
                'dark': 'مظلم',
                'forest': 'غابة',
                'Everyone': 'الجميع',
                'said': 'قال',
                'magic': 'سحر',
                'wanted': 'أراد',
                'see': 'يرى'
            },
            quiz: {
                question: 'Where did Ali live?',
                options: ['Near a big forest', 'In a city', 'On a mountain', 'Under the sea'],
                correctIndex: 0
            }
        },
        {
            text: "One day, Ali walked into the forest. He saw a blue bird. The bird talked to him! 'Hello, Ali,' said the bird. Ali was very surprised.",
            dictionary: {
                'One': 'واحد',
                'day': 'يوم',
                'walked': 'مشى',
                'into': 'إلى داخل',
                'saw': 'رأى',
                'blue': 'أزرق',
                'bird': 'طائر',
                'talked': 'تحدث',
                'Hello': 'مرحباً',
                'very': 'جداً',
                'surprised': 'متفاجئ'
            },
            quiz: {
                question: 'What color was the bird?',
                options: ['Red', 'Blue', 'Yellow', 'Green'],
                correctIndex: 1
            }
        }
    ]
};

const ReadingQuestPage = () => {
    const navigate = useNavigate();
    const { addStars } = useProgress();

    const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [selectedWord, setSelectedWord] = useState<{ word: string, translation: string } | null>(null);
    const [quizAnswered, setQuizAnswered] = useState<{ selected: number, isCorrect: boolean } | null>(null);
    const [questComplete, setQuestComplete] = useState(false);

    // Stop any reading when component unmounts
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const paragraph = storyData.paragraphs[currentParagraphIndex];

    const handleWordClick = (wordRaw: string) => {
        // Strip punctuation
        const word = wordRaw.replace(/[.,'!?]/g, '').trim();

        // Play pronunciation
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);

        // Find translation (case insensitive naive match)
        const dict = paragraph.dictionary as any;
        const translation = dict[word] || dict[word.toLowerCase()] || dict[word.charAt(0).toUpperCase() + word.slice(1)];

        if (translation) {
            setSelectedWord({ word, translation });
            setTimeout(() => setSelectedWord(null), 3000); // Auto hide after 3 seconds
        }
    };

    const handleQuizAnswer = (index: number) => {
        const isCorrect = index === paragraph.quiz.correctIndex;
        setQuizAnswered({ selected: index, isCorrect });

        if (isCorrect) {
            playSuccess();
        } else {
            // Optional: play error sound
        }
    };

    const nextSection = () => {
        playClick();
        if (currentParagraphIndex < storyData.paragraphs.length - 1) {
            setCurrentParagraphIndex(prev => prev + 1);
            setShowQuiz(false);
            setQuizAnswered(null);
        } else {
            // Quest Complete
            completeQuest();
        }
    };

    const completeQuest = async () => {
        setQuestComplete(true);
        playSuccess();
        try {
            await awardXp('reading_quest', 150);
            addStars(15);
        } catch (e) {
            console.error(e);
        }
    };

    if (questComplete) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#F9FBE7', p: 3, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '5rem', mb: 2 }}>🏆</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#1B5E20', mb: 1, fontFamily: '"Merriweather", serif' }}>
                    Quest Complete!
                </Typography>
                <Typography sx={{ fontSize: '1.2rem', color: '#4CAF50', fontWeight: 800, mb: 4 }}>
                    +150 XP Earned
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate('/home')}
                    sx={{ bgcolor: '#FF9800', color: 'white', borderRadius: 8, py: 1.5, px: 4, fontWeight: 800, fontSize: '1.1rem', '&:hover': { bgcolor: '#F57C00' } }}
                >
                    Back to Dashboard
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FBE7', fontFamily: '"Nunito", sans-serif', pb: 10 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#4CAF50', color: 'white', boxShadow: '0 4px 12px rgba(76,175,80,0.3)' }}>
                <IconButton onClick={() => navigate('/home')} sx={{ color: 'white' }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 800, flex: 1, textAlign: 'center', fontFamily: '"Merriweather", serif' }}>
                    {storyData.title} {storyData.image}
                </Typography>
                <Box sx={{ width: 40 }} />
            </Box>

            {/* Progress */}
            <LinearProgress
                variant="determinate"
                value={((currentParagraphIndex) / storyData.paragraphs.length) * 100}
                sx={{ height: 8, bgcolor: '#C8E6C9', '& .MuiLinearProgress-bar': { bgcolor: '#FF9800' } }}
            />

            <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>

                {/* Floating Translation Bubble */}
                <Box sx={{ height: 60, display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                    {selectedWord && (
                        <Paper elevation={4} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1, px: 3, borderRadius: 8, bgcolor: '#1E88E5', color: 'white', animation: 'fadeIn 0.3s ease-out' }}>
                            <VolumeUp fontSize="small" sx={{ opacity: 0.8 }} />
                            <Typography sx={{ fontWeight: 800 }}>{selectedWord.word}:</Typography>
                            <Typography sx={{ fontWeight: 600, fontSize: '1.1rem' }}>{selectedWord.translation}</Typography>
                        </Paper>
                    )}
                </Box>

                {/* Story Text */}
                <Paper elevation={0} sx={{ p: 4, borderRadius: 6, bgcolor: 'white', border: '2px solid #E0E0E0', mb: 4, lineHeight: 2 }}>
                    <Typography sx={{ fontSize: '1.4rem', color: '#424242', fontWeight: 600, textAlign: 'left' }}>
                        {paragraph.text.split(' ').map((wordRaw, i) => (
                            <span
                                key={i}
                                onClick={() => handleWordClick(wordRaw)}
                                style={{
                                    cursor: 'pointer',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                    marginBottom: '8px',
                                    borderBottom: '2px dashed #BDBDBD',
                                    transition: 'all 0.2s',
                                }}
                                onMouseOver={(e) => e.currentTarget.style.color = '#1E88E5'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#424242'}
                            >
                                {wordRaw}
                            </span>
                        ))}
                    </Typography>
                </Paper>

                {/* Action Button to Show Quiz */}
                {!showQuiz && (
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => { playClick(); setShowQuiz(true); }}
                        sx={{ bgcolor: '#4CAF50', color: 'white', borderRadius: 4, py: 2, fontWeight: 800, fontSize: '1.1rem', '&:hover': { bgcolor: '#388E3C' } }}
                    >
                        I finished reading!
                    </Button>
                )}

                {/* Comprehension Quiz */}
                {showQuiz && (
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 6, bgcolor: '#FFF8E1', border: '2px solid #FFE082', animation: 'slideUp 0.4s ease-out' }}>
                        <Typography sx={{ fontWeight: 800, color: '#F57C00', fontSize: '1.1rem', mb: 2, textAlign: 'center' }}>
                            🎯 Quick Quiz
                        </Typography>
                        <Typography sx={{ fontWeight: 800, color: '#424242', fontSize: '1.2rem', mb: 3, textAlign: 'center' }}>
                            {paragraph.quiz.question}
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {paragraph.quiz.options.map((opt, i) => {
                                const isSelected = quizAnswered?.selected === i;
                                const isCorrect = i === paragraph.quiz.correctIndex;
                                const isWrongSelected = isSelected && !isCorrect;

                                let bgcolor = 'white';
                                let borderColor = '#E0E0E0';
                                if (quizAnswered) {
                                    if (isCorrect) { bgcolor = '#E8F5E9'; borderColor = '#4CAF50'; }
                                    if (isWrongSelected) { bgcolor = '#FFEBEE'; borderColor = '#F44336'; }
                                }

                                return (
                                    <Button
                                        key={i}
                                        variant="outlined"
                                        onClick={() => !quizAnswered && handleQuizAnswer(i)}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            px: 2,
                                            py: 1.5,
                                            borderRadius: 4,
                                            textTransform: 'none',
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            color: isWrongSelected ? '#D32F2F' : isCorrect ? '#2E7D32' : '#424242',
                                            bgcolor,
                                            borderColor,
                                            borderWidth: 2,
                                            '&:hover': { borderColor: quizAnswered ? borderColor : '#4CAF50', bgcolor: quizAnswered ? bgcolor : '#F5F5F5', borderWidth: 2 }
                                        }}
                                        disabled={quizAnswered !== null}
                                        startIcon={
                                            quizAnswered && isCorrect ? <CheckCircle color="success" /> :
                                                (quizAnswered && isWrongSelected ? <Cancel color="error" /> : null)
                                        }
                                    >
                                        {opt}
                                    </Button>
                                );
                            })}
                        </Box>

                        {quizAnswered && quizAnswered.isCorrect && (
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={nextSection}
                                sx={{ mt: 3, bgcolor: '#4CAF50', color: 'white', borderRadius: 4, py: 1.5, fontWeight: 800, fontSize: '1.1rem', '&:hover': { bgcolor: '#388E3C' } }}
                            >
                                Continue Quest
                            </Button>
                        )}
                    </Paper>
                )}
            </Box>

            {/* Basic Keyframes for smooth UI */}
            <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
        </Box>
    );
};

export default ReadingQuestPage;
