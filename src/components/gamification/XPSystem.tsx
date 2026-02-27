// XP System and Gamification Components
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  Tooltip,
  Fab,
  Container,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import {
  EmojiEvents,
  Star,
  TrendingUp,
  LocalFireDepartment,
  MilitaryTech,
  WorkspacePremium,
  AutoAwesome,
  Speed,
  Timer,
  CheckCircle,
  RadioButtonUnchecked,
  RadioButtonChecked,
  NotificationsActive,
  Leaderboard,
  Assignment,
  Psychology,
  School,
  Lightbulb,
  RocketLaunch,
  Celebration,
  Confetti
} from '@mui/icons-material';

export interface UserLevel {
  level: number;
  title: string;
  arabicTitle: string;
  minXP: number;
  maxXP: number;
  color: string;
  icon: string;
  benefits: string[];
}

export interface Badge {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  arabicDescription: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'achievement' | 'streak' | 'mastery' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface DailyTask {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  xpReward: number;
  completed: boolean;
  progress: number;
  maxProgress: number;
  category: 'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'reading';
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  change: number;
}

// Levels Configuration
export const levels: UserLevel[] = [
  {
    level: 1,
    title: "Beginner",
    arabicTitle: "مبتدئ",
    minXP: 0,
    maxXP: 100,
    color: "#4CAF50",
    icon: "🌱",
    benefits: ["Access to basic lessons", "Daily vocabulary", "Simple exercises"]
  },
  {
    level: 2,
    title: "Elementary",
    arabicTitle: "ابتدائي",
    minXP: 100,
    maxXP: 300,
    color: "#8BC34A",
    icon: "🌿",
    benefits: ["Basic conversations", "Grammar exercises", "Audio lessons"]
  },
  {
    level: 3,
    title: "Pre-Intermediate",
    arabicTitle: "متوسط مبتدئ",
    minXP: 300,
    maxXP: 600,
    color: "#CDDC39",
    icon: "🌳",
    benefits: ["Complex sentences", "Reading comprehension", "Speaking practice"]
  },
  {
    level: 4,
    title: "Intermediate",
    arabicTitle: "متوسط",
    minXP: 600,
    maxXP: 1200,
    color: "#FFC107",
    icon: "🌲",
    benefits: ["Advanced grammar", "Writing exercises", "Cultural content"]
  },
  {
    level: 5,
    title: "Upper-Intermediate",
    arabicTitle: "متوسط متقدم",
    minXP: 1200,
    maxXP: 2000,
    color: "#FF9800",
    icon: "🌺",
    benefits: ["Business English", "Academic writing", "Debates"]
  },
  {
    level: 6,
    title: "Advanced",
    arabicTitle: "متقدم",
    minXP: 2000,
    maxXP: 3500,
    color: "#FF5722",
    icon: "🦅",
    benefits: ["Professional English", "Literature", "Research skills"]
  },
  {
    level: 7,
    title: "Expert",
    arabicTitle: "خبير",
    minXP: 3500,
    maxXP: 5000,
    color: "#9C27B0",
    icon: "🦉",
    benefits: ["Teaching skills", "Translation", "Content creation"]
  },
  {
    level: 8,
    title: "Master",
    arabicTitle: "محترف",
    minXP: 5000,
    maxXP: 10000,
    color: "#673AB7",
    icon: "🦋",
    benefits: ["All features unlocked", "Mentorship", "Custom content"]
  }
];

// Badges Configuration
export const badges: Badge[] = [
  {
    id: "first_lesson",
    name: "First Steps",
    arabicName: "الخطوات الأولى",
    description: "Complete your first lesson",
    arabicDescription: "أكمل أول درس لك",
    icon: "👶",
    color: "#4CAF50",
    unlocked: false,
    category: "achievement",
    rarity: "common"
  },
  {
    id: "week_streak",
    name: "Week Warrior",
    arabicName: "محارب الأسبوع",
    description: "7-day learning streak",
    arabicDescription: "سلسلة تعلم 7 أيام",
    icon: "🔥",
    color: "#FF9800",
    unlocked: false,
    category: "streak",
    rarity: "rare"
  },
  {
    id: "vocabulary_master",
    name: "Vocabulary Master",
    arabicName: "خبير المفردات",
    description: "Learn 100 words",
    arabicDescription: "تعلم 100 كلمة",
    icon: "📚",
    color: "#2196F3",
    unlocked: false,
    category: "mastery",
    rarity: "epic"
  },
  {
    id: "perfect_week",
    name: "Perfect Week",
    arabicName: "أسبوع مثالي",
    description: "Complete all daily tasks for a week",
    arabicDescription: "أكمل جميع المهام اليومية لمدة أسبوع",
    icon: "⭐",
    color: "#FFD700",
    unlocked: false,
    category: "achievement",
    rarity: "legendary"
  }
];

// Daily Tasks Configuration
export const generateDailyTasks = (): DailyTask[] => [
  {
    id: "vocab_5",
    title: "Learn 5 Words",
    arabicTitle: "تعلم 5 كلمات",
    description: "Complete 5 vocabulary exercises",
    arabicDescription: "أكمل 5 تمارين مفردات",
    xpReward: 20,
    completed: false,
    progress: 0,
    maxProgress: 5,
    category: "vocabulary",
    difficulty: "easy",
    icon: "📖"
  },
  {
    id: "grammar_3",
    title: "Grammar Practice",
    arabicTitle: "ممارسة القواعد",
    description: "Complete 3 grammar exercises",
    arabicDescription: "أكمل 3 تمارين قواعد",
    xpReward: 30,
    completed: false,
    progress: 0,
    maxProgress: 3,
    category: "grammar",
    difficulty: "medium",
    icon: "📝"
  },
  {
    id: "listening_10",
    title: "Listening Session",
    arabicTitle: "جلسة استماع",
    description: "Listen for 10 minutes",
    arabicDescription: "استمع لمدة 10 دقائق",
    xpReward: 25,
    completed: false,
    progress: 0,
    maxProgress: 10,
    category: "listening",
    difficulty: "easy",
    icon: "🎧"
  },
  {
    id: "speaking_5",
    title: "Speaking Practice",
    arabicTitle: "ممارسة التحدث",
    description: "Practice speaking for 5 minutes",
    arabicDescription: "مارس التحدث لمدة 5 دقائق",
    xpReward: 35,
    completed: false,
    progress: 0,
    maxProgress: 5,
    category: "speaking",
    difficulty: "medium",
    icon: "🗣️"
  },
  {
    id: "reading_15",
    title: "Reading Time",
    arabicTitle: "وقت القراءة",
    description: "Read for 15 minutes",
    arabicDescription: "اقرأ لمدة 15 دقيقة",
    xpReward: 20,
    completed: false,
    progress: 0,
    maxProgress: 15,
    category: "reading",
    difficulty: "easy",
    icon: "📚"
  }
];

// XP Progress Component
export const XPProgress: React.FC<{
  currentXP: number;
  currentLevel: number;
  showDetails?: boolean;
}> = ({ currentXP, currentLevel, showDetails = false }) => {
  const level = levels.find(l => l.level === currentLevel) || levels[0];
  const progress = level ? ((currentXP - level.minXP) / (level.maxXP - level.minXP)) * 100 : 0;
  const nextLevel = levels.find(l => l.level === currentLevel + 1);

  return (
    <Card sx={{ mb: 2, background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%)' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: level.color, mr: 2, width: { xs: 50, sm: 60 }, height: { xs: 50, sm: 60 } }}>
            <Typography variant="h4">{level.icon}</Typography>
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5 }}>
              {level.arabicTitle} - Level {level.level}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentXP} / {level.maxXP} XP
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: level.color }}>
              {currentXP}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total XP
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Progress to Level {currentLevel + 1}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {Math.round(progress)}%
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
                background: `linear-gradient(90deg, ${level.color}, ${level.color}CC)`,
                borderRadius: 4
              }
            }}
          />
        </Box>

        {showDetails && nextLevel && (
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Next Level: {nextLevel.arabicTitle}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {nextLevel.maxXP - currentXP} XP to unlock
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Benefits:
            </Typography>
            <List dense>
              {nextLevel.benefits.map((benefit, index) => (
                <ListItem key={index} sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <CheckCircle sx={{ fontSize: 16, color: level.color }} />
                  </ListItemIcon>
                  <ListItemText primary={benefit} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Badges Collection Component
export const BadgesCollection: React.FC<{
  badges: Badge[];
  onBadgeClick?: (badge: Badge) => void;
}> = ({ badges, onBadgeClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = ['all', 'achievement', 'streak', 'mastery', 'special'];

  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#9E9E9E';
      case 'rare': return '#29B6F6';
      case 'epic': return '#9C27B0';
      case 'legendary': return '#FFD700';
      default: return '#9E9E9E';
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
          🏆 شارات الإنجازات
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {categories.map(category => (
            <Chip
              key={category}
              label={category === 'all' ? 'الكل' : category}
              onClick={() => setSelectedCategory(category)}
              color={selectedCategory === category ? 'primary' : 'default'}
              size="small"
            />
          ))}
        </Box>

        <Grid container spacing={2}>
          {filteredBadges.map((badge) => (
            <Grid item xs={6} sm={4} md={3} key={badge.id}>
              <Tooltip 
                title={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {badge.arabicName}
                    </Typography>
                    <Typography variant="caption">
                      {badge.arabicDescription}
                    </Typography>
                    {!badge.unlocked && (
                      <Typography variant="caption" color="error">
                        🔒 مقفول
                      </Typography>
                    )}
                  </Box>
                }
                arrow
              >
                <Paper
                  onClick={() => onBadgeClick?.(badge)}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: badge.unlocked ? `2px solid ${getRarityColor(badge.rarity)}` : '2px solid #E0E0E0',
                    opacity: badge.unlocked ? 1 : 0.6,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    {badge.icon}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                    {badge.arabicName}
                  </Typography>
                  {badge.unlocked && (
                    <Chip
                      size="small"
                      label="✓"
                      sx={{ 
                        mt: 1, 
                        bgcolor: getRarityColor(badge.rarity), 
                        color: 'white',
                        fontSize: '0.6rem'
                      }}
                    />
                  )}
                </Paper>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

// Daily Tasks Component
export const DailyTasks: React.FC<{
  tasks: DailyTask[];
  onTaskComplete: (taskId: string) => void;
  onTaskProgress: (taskId: string, progress: number) => void;
}> = ({ tasks, onTaskComplete, onTaskProgress }) => {
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const totalXP = tasks.reduce((sum, task) => sum + (task.completed ? task.xpReward : 0), 0);
  const possibleXP = tasks.reduce((sum, task) => sum + task.xpReward, 0);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            📋 المهام اليومية
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {totalXP} / {possibleXP} XP
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(totalXP / possibleXP) * 100}
              sx={{ width: 100, height: 4, mt: 0.5 }}
            />
          </Box>
        </Box>

        <List>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              sx={{
                mb: 1,
                p: 2,
                bgcolor: task.completed ? '#E8F5E8' : '#FAFAFA',
                borderRadius: 2,
                border: `1px solid ${task.completed ? '#4CAF50' : '#E0E0E0'}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }
              }}
            >
              <ListItemIcon>
                <Avatar sx={{ bgcolor: getDifficultyColor(task.difficulty), width: 40, height: 40 }}>
                  <Typography variant="h6">{task.icon}</Typography>
                </Avatar>
              </ListItemIcon>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {task.arabicTitle}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        size="small"
                        label={`${task.xpReward} XP`}
                        color="primary"
                        sx={{ fontSize: '0.7rem' }}
                      />
                      {task.completed && (
                        <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
                      )}
                    </Box>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {task.arabicDescription}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(task.progress / task.maxProgress) * 100}
                        sx={{ flex: 1, height: 6, borderRadius: 3 }}
                      />
                      <Typography variant="caption" sx={{ minWidth: 40 }}>
                        {task.progress}/{task.maxProgress}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={() => setShowDetails(showDetails === task.id ? null : task.id)}
                >
                  <Lightbulb />
                </IconButton>
                {!task.completed && task.progress >= task.maxProgress && (
                  <IconButton
                    size="small"
                    onClick={() => onTaskComplete(task.id)}
                    sx={{ color: '#4CAF50' }}
                  >
                    <CheckCircle />
                  </IconButton>
                )}
              </Box>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

// Leaderboard Component
export const Leaderboard: React.FC<{
  entries: LeaderboardEntry[];
  currentUserId?: string;
}> = ({ entries, currentUserId }) => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'all-time'>('weekly');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return '#9E9E9E';
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            🏆 لوحة الصدارة
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {(['daily', 'weekly', 'all-time'] as const).map((range) => (
              <Chip
                key={range}
                label={range === 'daily' ? 'يومي' : range === 'weekly' ? 'أسبوعي' : 'كل الأوقات'}
                onClick={() => setTimeRange(range)}
                color={timeRange === range ? 'primary' : 'default'}
                size="small"
              />
            ))}
          </Box>
        </Box>

        <List>
          {entries.slice(0, 10).map((entry) => (
            <ListItem
              key={entry.userId}
              sx={{
                mb: 1,
                p: 2,
                bgcolor: entry.userId === currentUserId ? '#E3F2FD' : 'transparent',
                borderRadius: 2,
                border: entry.userId === currentUserId ? '2px solid #2196F3' : '1px solid #E0E0E0'
              }}
            >
              <ListItemIcon>
                <Avatar
                  sx={{
                    bgcolor: getRankColor(entry.rank),
                    color: 'white',
                    fontWeight: 900,
                    width: 40,
                    height: 40
                  }}
                >
                  {getRankIcon(entry.rank)}
                </Avatar>
              </ListItemIcon>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={entry.avatar} sx={{ width: 32, height: 32 }} />
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {entry.username}
                      </Typography>
                      {entry.userId === currentUserId && (
                        <Chip size="small" label="أنت" color="primary" />
                      )}
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: '#2196F3' }}>
                        {entry.xp}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Level {entry.level}
                      </Typography>
                    </Box>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocalFireDepartment sx={{ fontSize: 16, color: '#FF5722' }} />
                      <Typography variant="caption">
                        {entry.streak} days
                      </Typography>
                    </Box>
                    {entry.change !== 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TrendingUp 
                          sx={{ 
                            fontSize: 16, 
                            color: entry.change > 0 ? '#4CAF50' : '#F44336' 
                          }} 
                        />
                        <Typography 
                          variant="caption"
                          sx={{ color: entry.change > 0 ? '#4CAF50' : '#F44336' }}
                        >
                          {entry.change > 0 ? `+${entry.change}` : entry.change}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
