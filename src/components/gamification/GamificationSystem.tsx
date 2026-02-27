// Gamification System with XP, Achievements, and Leaderboard
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Avatar,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tab,
  Tabs,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  EmojiEvents,
  Star,
  TrendingUp,
  MilitaryTech,
  School,
  Psychology,
  Speed,
  LocalFireDepartment,
  WorkspacePremium,
  Diamond,
  Thunderstorm,
  AutoAwesome,
  Celebration,
  RocketLaunch,
  Flag,
  Timer,
  CheckCircle,
  Lock,
  LockOpen,
  Visibility,
  Share,
  Download,
  Refresh,
} from '@mui/icons-material';

interface Achievement {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  icon: React.ReactNode;
  category: 'learning' | 'practice' | 'social' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  requirements: string[];
}

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  rank: number;
  change: number;
  badges: number;
  streak: number;
}

interface UserStats {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  totalXP: number;
  streak: number;
  rank: number;
  badges: number;
  achievements: number;
  studyTime: number;
  lessonsCompleted: number;
  exercisesCompleted: number;
  testsPassed: number;
}

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    arabicTitle: 'الخطوات الأولى',
    description: 'Complete your first lesson',
    arabicDescription: 'أكمل أول درس لك',
    icon: <School />,
    category: 'learning',
    rarity: 'common',
    xpReward: 50,
    progress: 1,
    maxProgress: 1,
    requirements: ['Complete 1 lesson']
  },
  {
    id: '2',
    title: 'Week Warrior',
    arabicTitle: 'محارب الأسبوع',
    description: 'Study for 7 consecutive days',
    arabicDescription: 'درس لمدة 7 أيام متتالية',
    icon: <LocalFireDepartment />,
    category: 'milestone',
    rarity: 'rare',
    xpReward: 200,
    progress: 5,
    maxProgress: 7,
    requirements: ['7 day streak']
  },
  {
    id: '3',
    title: 'Speed Demon',
    arabicTitle: 'شيطان السرعة',
    description: 'Complete 10 exercises under time limit',
    arabicDescription: 'أكمل 10 تمرين في الوقت المحدد',
    icon: <Speed />,
    category: 'practice',
    rarity: 'epic',
    xpReward: 300,
    progress: 7,
    maxProgress: 10,
    requirements: ['10 timed exercises']
  },
  {
    id: '4',
    title: 'Master Mind',
    arabicTitle: 'العقل المبدع',
    description: 'Score 95% or higher on 5 tests',
    arabicDescription: 'احصل على 95% أو أعلى في 5 اختبارات',
    icon: <Psychology />,
    category: 'learning',
    rarity: 'legendary',
    xpReward: 500,
    progress: 3,
    maxProgress: 5,
    requirements: ['5 tests with 95%+ score']
  }
];

const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'أحمد الطالب',
    avatar: '/avatars/user1.jpg',
    level: 15,
    xp: 4500,
    rank: 1,
    change: 0,
    badges: 12,
    streak: 15
  },
  {
    id: '2',
    name: 'فاطمة محمد',
    avatar: '/avatars/user2.jpg',
    level: 14,
    xp: 4200,
    rank: 2,
    change: 1,
    badges: 10,
    streak: 8
  },
  {
    id: '3',
    name: 'عبدالله خالد',
    avatar: '/avatars/user3.jpg',
    level: 13,
    xp: 3800,
    rank: 3,
    change: -1,
    badges: 9,
    streak: 12
  }
];

const GamificationSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    level: 12,
    currentXP: 450,
    nextLevelXP: 1000,
    totalXP: 3450,
    streak: 7,
    rank: 25,
    badges: 8,
    achievements: 6,
    studyTime: 120,
    lessonsCompleted: 24,
    exercisesCompleted: 45,
    testsPassed: 8
  });
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAchievements(mockAchievements);
      setLeaderboard(mockLeaderboard);
      setLoading(false);
    }, 1000);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'grey';
      case 'rare': return 'blue';
      case 'epic': return 'purple';
      case 'legendary': return 'orange';
      default: return 'grey';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star />;
      case 'rare': return <Diamond />;
      case 'epic': return <Thunderstorm />;
      case 'legendary': return <AutoAwesome />;
      default: return <Star />;
    }
  };

  const handleClaimReward = (achievementId: string) => {
    setAchievements(prev => prev.map(achievement => 
      achievement.id === achievementId 
        ? { ...achievement, unlockedAt: new Date(), progress: achievement.maxProgress }
        : achievement
    ));
    
    setUserStats(prev => ({
      ...prev,
      currentXP: prev.currentXP + 50,
      totalXP: prev.totalXP + 50,
      achievements: prev.achievements + 1
    }));
  };

  const tabLabels = [
    'إنجازاتي',
    'لوحة الصدارة',
    'إحصائياتي',
    'المكافآت'
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        🏆 نظام التحفيز والإنجازات
      </Typography>

      {/* User Stats Overview */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.50' }}>
        <Grid container spacing={3}>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1, width: 60, height: 60 }}>
                <MilitaryTech />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {userStats.level}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                المستوى
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1, width: 60, height: 60 }}>
                <EmojiEvents />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {userStats.totalXP}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                إجمالي XP
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1, width: 60, height: 60 }}>
                <LocalFireDepartment />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {userStats.streak}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                أيام متتالية
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 1, width: 60, height: 60 }}>
                <WorkspacePremium />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {userStats.rank}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                الترتيب
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* XP Progress */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            التقدم للمستوى التالي: {userStats.currentXP}/{userStats.nextLevelXP} XP
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(userStats.currentXP / userStats.nextLevelXP) * 100}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {achievements.map((achievement) => (
            <Grid item xs={12} sm={6} md={4} key={achievement.id}>
              <Card
                sx={{
                  position: 'relative',
                  opacity: achievement.progress === achievement.maxProgress ? 1 : 0.7,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 8,
                  }
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    {/* Rarity Badge */}
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <Tooltip title={achievement.rarity}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: `${getRarityColor(achievement.rarity)}.main` }}>
                          {getRarityIcon(achievement.rarity)}
                        </Avatar>
                      </Tooltip>
                    </Box>

                    {/* Achievement Icon */}
                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', width: 60, height: 60 }}>
                      {achievement.icon}
                    </Avatar>

                    {/* Achievement Info */}
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {achievement.arabicTitle}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.arabicDescription}
                      </Typography>
                    </Box>

                    {/* Progress */}
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        التقدم: {achievement.progress}/{achievement.maxProgress}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(achievement.progress / achievement.maxProgress) * 100}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>

                    {/* XP Reward */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        🎁 {achievement.xpReward} XP
                      </Typography>
                      <Button
                        startIcon={achievement.progress === achievement.maxProgress ? <CheckCircle /> : <Lock />}
                        onClick={() => setSelectedAchievement(achievement)}
                        disabled={achievement.progress < achievement.maxProgress}
                        variant={achievement.progress === achievement.maxProgress ? 'contained' : 'outlined'}
                        size="small"
                      >
                        {achievement.progress === achievement.maxProgress ? 'مفتوح' : 'مقفل'}
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                🏆 لوحة الصدارة العالمية
              </Typography>
              <List>
                {leaderboard.map((entry, index) => (
                  <ListItem
                    key={entry.id}
                    sx={{
                      bgcolor: entry.id === '1' ? 'primary.50' : 'transparent',
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <ListItemIcon>
                      <Box sx={{ position: 'relative' }}>
                        <Avatar sx={{ width: 40, height: 40 }}>
                          {entry.rank <= 3 ? <EmojiEvents /> : entry.rank}
                        </Avatar>
                        {entry.change !== 0 && (
                          <Box sx={{ position: 'absolute', bottom: -4, right: -4 }}>
                            <Avatar sx={{ width: 20, height: 20, bgcolor: entry.change > 0 ? 'success.main' : 'error.main' }}>
                              <TrendingUp sx={{ fontSize: 12, transform: entry.change < 0 ? 'rotate(180deg)' : 'none' }} />
                            </Avatar>
                          </Box>
                        )}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {entry.name}
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Chip label={`المستوى ${entry.level}`} size="small" />
                            <Chip label={`${entry.xp} XP`} size="small" />
                            <Chip label={`${entry.streak} 🔥`} size="small" />
                          </Stack>
                        </Box>
                      }
                      secondary={`${entry.badges} شارات`}
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        #{entry.rank}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  📊 إحصائيات التعلم
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><School /></ListItemIcon>
                    <ListItemText primary="الدروس المكتملة" secondary={`${userStats.lessonsCompleted} درس`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Psychology /></ListItemIcon>
                    <ListItemText primary="التمارين المكتملة" secondary={`${userStats.exercisesCompleted} تمرين`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><EmojiEvents /></ListItemIcon>
                    <ListItemText primary="الاختبارات الناجحة" secondary={`${userStats.testsPassed} اختبار`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Timer /></ListItemIcon>
                    <ListItemText primary="وقت الدراسة" secondary={`${userStats.studyTime} دقيقة`} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  🏅 الإنجازات
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><Star /></ListItemIcon>
                    <ListItemText primary="الإنجازات المفتوحة" secondary={`${userStats.achievements} إنجاز`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WorkspacePremium /></ListItemIcon>
                    <ListItemText primary="الشارات" secondary={`${userStats.badges} شارة`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><LocalFireDepartment /></ListItemIcon>
                    <ListItemText primary="أطول سلسلة" secondary={`${userStats.streak} أيام`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><MilitaryTech /></ListItemIcon>
                    <ListItemText primary="الترتيب الحالي" secondary={`#${userStats.rank} عالمياً`} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Alert severity="info">
          <AlertTitle>🎁 المكافآت القادمة</AlertTitle>
          <Typography variant="body2">
            قريباً: نظام المكافآت اليومية والأسبوعية، ومتجر للهدايا الافتراضية!
          </Typography>
        </Alert>
      )}

      {/* Achievement Detail Dialog */}
      <Dialog open={!!selectedAchievement} onClose={() => setSelectedAchievement(null)} maxWidth="sm" fullWidth>
        {selectedAchievement && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: `${getRarityColor(selectedAchievement.rarity)}.main` }}>
                  {selectedAchievement.icon}
                </Avatar>
                <Typography variant="h6">
                  {selectedAchievement.arabicTitle}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <Typography variant="body1">
                  {selectedAchievement.arabicDescription}
                </Typography>
                
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    المتطلبات:
                  </Typography>
                  <List dense>
                    {selectedAchievement.requirements.map((req, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircle color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={req} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    المكافأة:
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 600 }}>
                    🎁 {selectedAchievement.xpReward} XP
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedAchievement(null)}>
                إغلاق
              </Button>
              {selectedAchievement.progress === selectedAchievement.maxProgress && (
                <Button
                  startIcon={<Celebration />}
                  onClick={() => handleClaimReward(selectedAchievement.id)}
                  variant="contained"
                  color="primary"
                >
                  استلام المكافأة
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default GamificationSystem;
