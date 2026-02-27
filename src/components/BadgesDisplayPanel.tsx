import {
  Box,
  Card,
  Grid,
  Typography,
  Tooltip,
  LinearProgress,
  Chip,
  Container
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Badge, UserProgress } from '../core/badges';
import { badges, checkBadgeUnlock, getUnlockedBadges } from '../core/badges';

interface BadgesDisplayProps {
  userProgress: UserProgress;
  showOnlyUnlocked?: boolean;
  maxBadges?: number;
}

/**
 * مكون عرض الشارات والإنجازات
 * يعرض الشارات المفتوحة والمقفلة مع التفاوت
 */
export default function BadgesDisplay({
  userProgress,
  showOnlyUnlocked = false,
  maxBadges = undefined
}: BadgesDisplayProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  // تحديد الشارات المراد عرضها
  const displayBadges = showOnlyUnlocked ? getUnlockedBadges() : badges;
  const badgesToShow = maxBadges ? displayBadges.slice(0, maxBadges) : displayBadges;

  // حساب عدد الشارات المفتوحة
  const unlockedCount = getUnlockedBadges().length;
  const totalBadges = badges.length;
  const unlockedPercentage = (unlockedCount / totalBadges) * 100;

  // تصنيف الشارات حسب الندرة
  const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
  const sortedBadges = badgesToShow.sort(
    (a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]
  );

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'common':
        return '#FFD700'; // ذهبي
      case 'rare':
        return '#C0C0C0'; // فضي
      case 'epic':
        return '#9B59B6'; // بنفسجي
      case 'legendary':
        return '#FF6347'; // أحمر
      default:
        return '#CCCCCC';
    }
  };

  const getRarityLabel = (rarity: string): string => {
    const rarityLabels: Record<string, string> = {
      common: 'عادي',
      rare: 'نادر',
      epic: 'ملحمي',
      legendary: 'أسطوري'
    };
    return isArabic ? rarityLabels[rarity] : rarity;
  };

  const renderBadgeCard = (badge: Badge) => {
    const isUnlocked = checkBadgeUnlock(badge, userProgress);

    return (
      <Tooltip
        key={badge.id}
        title={
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {isArabic ? badge.nameAr : badge.name}
            </Typography>
            <Typography variant="caption">
              {isArabic ? badge.descriptionAr : badge.description}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
              {isArabic ? 'النقاط: ' : 'Points: '} {badge.points}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              {getRarityLabel(badge.rarity)}
            </Typography>
          </Box>
        }
        arrow
        placement="top"
      >
        <Card
          sx={{
            cursor: 'pointer',
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2,
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: isUnlocked ? '#FFFFFF' : 'rgba(200, 200, 200, 0.3)',
            opacity: isUnlocked ? 1 : 0.6,
            border: `2px solid ${isUnlocked ? getRarityColor(badge.rarity) : '#CCCCCC'}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: isUnlocked ? 'scale(1.08)' : 'scale(1.02)',
              boxShadow: isUnlocked
                ? `0 8px 24px ${getRarityColor(badge.rarity)}40`
                : 'none',
            },
            filter: isUnlocked ? 'brightness(1)' : 'grayscale(70%)',
          }}
        >
          {/* شريط لون الندرة */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              backgroundColor: getRarityColor(badge.rarity),
            }}
          />

          {/* الأيقونة الكبيرة */}
          <TextField
            sx={{
              fontSize: '3rem',
              marginBottom: 1,
              filter: isUnlocked ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' : 'none',
            }}
          >
            {badge.icon}
          </TextField>

          {/* اسم الشارة */}
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: isUnlocked ? '#0B4B88' : '#888888',
              textAlign: 'center',
              fontSize: '0.9rem',
            }}
          >
            {isArabic ? badge.nameAr : badge.name}
          </Typography>

          {/* شريط التقدم (للشارات المقفلة) */}
          {!isUnlocked && (
            <Box sx={{ width: '100%', marginTop: 1 }}>
              <LinearProgress
                variant="determinate"
                value={calculateProgression(badge, userProgress)}
                sx={{
                  height: 4,
                  borderRadius: '2px',
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#FF9800',
                  },
                }}
              />
            </Box>
          )}

          {/* علامة مفتوحة */}
          {isUnlocked && (
            <Chip
              label={isArabic ? '✓ مفتوح' : '✓ Unlocked'}
              size="small"
              sx={{
                marginTop: 1,
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                color: '#2E7D32',
                fontWeight: 700,
              }}
            />
          )}
        </Card>
      </Tooltip>
    );
  };

  // دالة حساب التقدم بناءً على متطلب الشارة
  const calculateProgression = (badge: Badge, progress: UserProgress): number => {
    const { type, value } = badge.requirement;
    let currentValue = 0;

    switch (type) {
      case 'lessons':
        currentValue = progress.completedLessons;
        break;
      case 'exercises':
        currentValue = progress.completedExercises;
        break;
      case 'xp':
        currentValue = progress.totalXP;
        break;
      case 'streak':
        currentValue = progress.currentStreak;
        break;
      case 'score':
        currentValue = progress.highestScore;
        break;
      default:
        return 0;
    }

    return Math.min((currentValue / value) * 100, 100);
  };

  return (
    <Container maxWidth="lg">
      {/* رأس القسم */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            marginBottom: 1,
            background: 'linear-gradient(135deg, #0B4B88 0%, #2979C1 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {isArabic ? '🏆 الشارات والإنجازات' : '🏆 Badges & Achievements'}
        </Typography>

        {/* شريط التقدم العام */}
        <Card sx={{ padding: 2, marginBottom: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {isArabic ? `تم فتح ${unlockedCount} من ${totalBadges}` : `${unlockedCount} of ${totalBadges} Unlocked`}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#FF9800' }}>
              {Math.round(unlockedPercentage)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={unlockedPercentage}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 6,
                background: 'linear-gradient(90deg, #FF9800 0%, #FF6B6B 100%)',
              },
            }}
          />
        </Card>

        {/* إحصائيات المستخدم */}
        <Grid container spacing={2} sx={{ marginBottom: 3 }}>
          <Grid xs={6} sm={3} sx={{ display: 'flex' }}>
            <Card sx={{ textAlign: 'center', padding: 2, width: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0B4B88' }}>
                {userProgress.completedLessons}
              </Typography>
              <Typography variant="caption" sx={{ color: '#888' }}>
                {isArabic ? 'دروس' : 'Lessons'}
              </Typography>
            </Card>
          </Grid>
          <Grid xs={6} sm={3} sx={{ display: 'flex' }}>
            <Card sx={{ textAlign: 'center', padding: 2, width: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0B4B88' }}>
                {userProgress.completedExercises}
              </Typography>
              <Typography variant="caption" sx={{ color: '#888' }}>
                {isArabic ? 'تمارين' : 'Exercises'}
              </Typography>
            </Card>
          </Grid>
          <Grid xs={6} sm={3} sx={{ display: 'flex' }}>
            <Card sx={{ textAlign: 'center', padding: 2, width: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FF9800' }}>
                {userProgress.totalXP}
              </Typography>
              <Typography variant="caption" sx={{ color: '#888' }}>
                {isArabic ? 'نقاط' : 'XP'}
              </Typography>
            </Card>
          </Grid>
          <Grid xs={6} sm={3} sx={{ display: 'flex' }}>
            <Card sx={{ textAlign: 'center', padding: 2, width: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FF6B6B' }}>
                {userProgress.currentStreak}🔥
              </Typography>
              <Typography variant="caption" sx={{ color: '#888' }}>
                {isArabic ? 'سلسلة' : 'Streak'}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* شبكة الشارات */}
      <Grid container spacing={2}>
        {sortedBadges.map(badge => (
          <Grid xs={6} sm={4} md={3} lg={2.4} key={badge.id}>
            {renderBadgeCard(badge)}
          </Grid>
        ))}
      </Grid>

      {/* رسالة عندما لا توجد شارات */}
      {sortedBadges.length === 0 && (
        <Box sx={{ textAlign: 'center', padding: 4 }}>
          <Typography variant="h6" color="textSecondary">
            {isArabic ? 'لا توجد شارات للعرض' : 'No badges to display'}
          </Typography>
        </Box>
      )}
    </Container>
  );
}

// مساعد TypeScript
const TextField = Box;
