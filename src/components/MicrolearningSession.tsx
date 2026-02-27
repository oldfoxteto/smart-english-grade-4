import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  CheckCircle,
  Refresh,
  EmojiEvents,
  Timer,
  School,
  Lightbulb
} from '@mui/icons-material';
import { playClick, playSuccess, playStar } from '../core/sounds';
import { useNotification } from '../core/NotificationContext';
import { usePushNotifications } from '../core/PushNotificationService';

interface MicrolearningSessionProps {
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'vocabulary' | 'grammar' | 'reading' | 'listening' | 'speaking';
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
}

const MicrolearningSession: React.FC<MicrolearningSessionProps> = ({
  title,
  description,
  duration,
  difficulty,
  type,
  onComplete,
  onProgress
}) => {
  const { notifySuccess, notifyInfo } = useNotification();
  const { showEncouragingNotification } = usePushNotifications();
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [progress, setProgress] = useState(0);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  const difficultyColors = {
    easy: '#4CAF50',
    medium: '#FF9800',
    hard: '#F44336'
  };

  const typeIcons = {
    vocabulary: '📚',
    grammar: '📝',
    reading: '📖',
    listening: '🎧',
    speaking: '🗣️'
  };

  const typeLabels = {
    vocabulary: 'المفردات',
    grammar: 'القواعد',
    reading: 'القراءة',
    listening: 'الاستماع',
    speaking: 'التحدث'
  };

  useEffect(() => {
    let interval: number | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          const newTime = time - 1;
          const progressPercent = ((duration * 60 - newTime) / (duration * 60)) * 100;
          setProgress(progressPercent);
          onProgress?.(progressPercent);
          
          if (newTime === 0) {
            setIsActive(false);
            setShowCompleteDialog(true);
          }
          
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, duration, onProgress]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    playClick();
    setShowStartDialog(false);
    setIsActive(true);
    notifyInfo(`بدأت جلسة "${title}" - حظاً موفقاً! 🎯`);
  };

  const handlePause = () => {
    playClick();
    setIsActive(!isActive);
  };

  const handleReset = () => {
    playClick();
    setIsActive(false);
    setTimeLeft(duration * 60);
    setProgress(0);
    onProgress?.(0);
  };

  const handleComplete = () => {
    playSuccess();
    playStar();
    setShowCompleteDialog(false);
    const xpGained = duration * 10;
    notifySuccess(`أتممت جلسة "${title}" بنجاح! +${xpGained} XP 🏆`);
    showEncouragingNotification('🎉 جلسة مكتملة!', `لقد أكملت جلسة "${title}" بنجاح`, xpGained);
    onComplete?.();
    handleReset();
  };

  const getMotivationalMessage = () => {
    const messages = [
      '🎯 رائع! استمر في التقدم!',
      '💪 ممتاز! أنت تتعلم بسرعة!',
      '⭐ أحسنت! حافظ على هذا الزخم!',
      '🚀 مذهل! مستواك يتحسن باستمرار!',
      '🏆 ممتاز! أنت على الطريق الصحيح!'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%)',
        border: `2px solid ${difficultyColors[difficulty]}20`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
        }
      }}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: difficultyColors[difficulty],
              width: { xs: 40, sm: 44, md: 48 },
              height: { xs: 40, sm: 44, md: 48 },
              fontSize: { xs: '1.2rem', sm: '1.35rem', md: '1.5rem' }
            }}
          >
            {typeIcons[type]}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 900, 
              mb: 0.5,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
            }}>
              {title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              <Chip
                size="small"
                label={typeLabels[type]}
                sx={{ 
                  background: '#E3F2FD', 
                  color: '#1976D2',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              />
              <Chip
                size="small"
                label={`${duration} دقيقة`}
                icon={<Timer sx={{ fontSize: { xs: 14, sm: 16 } }} />}
                sx={{ 
                  background: '#FFF3E0', 
                  color: '#F57C00',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              />
              <Chip
                size="small"
                label={difficulty === 'easy' ? 'سهل' : difficulty === 'medium' ? 'متوسط' : 'صعب'}
                sx={{ 
                  background: `${difficultyColors[difficulty]}20`,
                  color: difficultyColors[difficulty],
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              />
            </Box>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ 
          mb: 2,
          fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' }
        }}>
          {description}
        </Typography>

        {/* Progress Bar */}
        {isActive && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                التقدم
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {Math.round(progress)}% • {formatTime(timeLeft)}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                background: '#E3F2FD',
                '& .MuiLinearProgress-bar': {
                  background: `linear-gradient(90deg, ${difficultyColors[difficulty]}, ${difficultyColors[difficulty]}CC)`,
                  borderRadius: 4
                }
              }}
            />
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
          {!isActive ? (
            <Button
              variant="contained"
              fullWidth
              startIcon={<PlayArrow />}
              onClick={() => { playClick(); setShowStartDialog(true); }}
              sx={{
                background: `linear-gradient(135deg, ${difficultyColors[difficulty]}, ${difficultyColors[difficulty]}CC)`,
                fontWeight: 700,
                py: 1.2
              }}
            >
              ابدأ الجلسة
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                startIcon={isActive ? <Pause /> : <PlayArrow />}
                onClick={handlePause}
                sx={{ fontWeight: 600 }}
              >
                {isActive ? 'إيقاف' : 'استئناف'}
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Refresh />}
                onClick={handleReset}
                sx={{ fontWeight: 600 }}
              >
                إعادة
              </Button>
            </>
          )}
        </Box>

        {/* Motivational Message */}
        {isActive && progress > 0 && progress < 100 && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
              borderRadius: 2,
              textAlign: 'center'
            }}
          >
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
              {getMotivationalMessage()}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Start Dialog */}
      <Dialog open={showStartDialog} onClose={() => setShowStartDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 900 }}>
          <School sx={{ fontSize: 40, color: '#0B4B88', mb: 1 }} />
          استعد للجلسة التعليمية
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
            جلسة "{title}" ستستغرق {duration} دقائق فقط
          </Typography>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Lightbulb sx={{ fontSize: 30, color: '#FFC107', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              نصيحة: اجلس في مكان هادئ وركز بشكل كامل للحصول على أفضل النتائج
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 1, pb: 2 }}>
          <Button onClick={() => { playClick(); setShowStartDialog(false); }} variant="outlined">
            إلغاء
          </Button>
          <Button
            onClick={handleStart}
            variant="contained"
            startIcon={<PlayArrow />}
            sx={{ background: 'linear-gradient(135deg, #0B4B88, #2979C1)' }}
          >
            ابدأ الآن
          </Button>
        </DialogActions>
      </Dialog>

      {/* Complete Dialog */}
      <Dialog open={showCompleteDialog} onClose={handleComplete} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 900 }}>
          <EmojiEvents sx={{ fontSize: 40, color: '#FFD700', mb: 1 }} />
          🎉 أتممت الجلسة بنجاح!
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
            لقد أكملت جلسة "{title}" في الوقت المحدد
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 900, mb: 1 }}>
              +{duration * 10} XP
            </Typography>
            <Typography variant="body2" color="text.secondary">
              استمر في التعلم لتحقيق المزيد من الإنجازات!
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            onClick={handleComplete}
            variant="contained"
            startIcon={<CheckCircle />}
            sx={{ background: 'linear-gradient(135deg, #4CAF50, #66BB6A)' }}
          >
            رائع!
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default MicrolearningSession;
