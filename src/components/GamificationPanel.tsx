import React, { Suspense, lazy } from 'react'
import { Box, Card, CardContent, Typography, LinearProgress } from '@mui/material';
import { EmojiEvents, MilitaryTech } from '@mui/icons-material';

const BadgesList = lazy(() => import('./BadgesList'))

interface GamificationPanelProps {
  totalXp: number;
  level: number;
  streak: number;
  levelProgress: number;
  badges?: Array<{
    id: string;
    title: string;
    icon: string;
    color: string;
    earned: boolean;
  }>;
}

const GamificationPanel: React.FC<GamificationPanelProps> = ({
  totalXp,
  level,
  streak,
  levelProgress,
  badges = []
}) => {
  const defaultBadges = [
    { id: 'first_lesson', title: 'أول درس', icon: '🎯', color: '#4CAF50', earned: totalXp >= 10 },
    { id: 'week_streak', title: 'أسبوع متواصل', icon: '🔥', color: '#FF9800', earned: streak >= 7 },
    { id: 'level_5', title: 'مستوى 5', icon: '⭐', color: '#2196F3', earned: level >= 5 },
    { id: 'xp_master', title: 'خبير النقاط', icon: '💎', color: '#9C27B0', earned: totalXp >= 500 },
    { id: 'grammar_hero', title: 'بطل القواعد', icon: '📚', color: '#F44336', earned: totalXp >= 200 },
    { id: 'vocabulary_king', title: 'ملك المفردات', icon: '👑', color: '#FFD700', earned: totalXp >= 300 }
  ];

  const displayBadges = badges.length > 0 ? badges : defaultBadges;

  const nextLevelXp = level * 100;
  const xpForNextLevel = nextLevelXp - totalXp;

  return (
    <Card sx={{ mb: 3, borderRadius: 3, background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%)' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmojiEvents sx={{ color: '#0B4B88' }} />
          إنجازاتك ومستواك
        </Typography>

        {/* Stats Overview */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              تقدم الدرس
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {Math.round(levelProgress)}% مكتمل
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={levelProgress}
            sx={{
              height: 10,
              borderRadius: 5,
              background: '#E3F2FD',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #0B4B88, #2979C1)',
                borderRadius: 5,
              },
            }}
          />
        </Box>

        {/* Level Progress */}
        <Box sx={{ mb: 3, p: 2, background: 'white', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              المستوى {level} → المستوى {level + 1}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#0B4B88' }}>
              {xpForNextLevel} XP للمستوى التالي
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={levelProgress}
            sx={{
              height: 12,
              borderRadius: 6,
              background: '#E3F2FD',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #0B4B88, #2979C1)',
                borderRadius: 6
              }
            }}
          />
        </Box>

        {/* Badges Section (loaded lazily) */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <MilitaryTech sx={{ color: '#FFD700' }} />
            الشارات والمكافآت
          </Typography>
          <Suspense fallback={<Box sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>جارٍ تحميل الشارات...</Box>}>
            <BadgesList badges={displayBadges as any} />
          </Suspense>
        </Box>

        {/* Motivational Message */}
        <Box
          sx={{
            mt: 2,
            p: 2,
            background: 'linear-gradient(135deg, #0B4B88 0%, #2979C1 100%)',
            borderRadius: 2,
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
            {streak >= 7 
              ? `🔥 رائع! لقد حافظت على سلسلة ${streak} أيام متتالية! استمر في التميز!`
              : streak >= 3
              ? `💪 ممتاز! سلسلة ${streak} أيام. حافظ على حماسك!`
              : `🎯 مرحباً! حافظ على التعلم اليومي لتحصل على مكافآت أكبر!`
            }
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GamificationPanel;
