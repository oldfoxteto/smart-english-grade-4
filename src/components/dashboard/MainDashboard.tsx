// Refactored Main Dashboard Component
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Stack,
  Divider,
  Alert,
  AlertTitle,
  CircularProgress,
  Fab,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School,
  TrendingUp,
  EmojiEvents,
  Timer,
  Notifications,
  Settings,
  Refresh,
  MoreVert,
  Add,
  PlayArrow,
  Pause,
  Stop,
  CheckCircle,
  Warning,
  Info,
  Star,
  Bookmark,
  Share,
  FilterList,
  Search,
  Person,
  Group,
  Chat,
  Mic,
  Videocam,
  Headphones,
  VolumeUp,
  BatteryFull,
  Wifi,
  SignalCellular4G,
} from '@mui/icons-material';

// Import our design system and components
import { tokens } from '../../design-system/tokens';
import {
  AppLayout,
  AppHeader,
  AppCard,
  AppButton,
  AppProgress,
  AppIcon,
  AppBadge,
  AppAvatar,
  AppChip,
  AppGrid,
  AppPaper,
} from '../../components/ui';

// Types
interface DashboardStats {
  totalLessons: number;
  completedLessons: number;
  averageScore: number;
  studyTime: number;
  currentStreak: number;
  totalXP: number;
  level: number;
  achievements: number;
}

interface RecentActivity {
  id: string;
  type: 'lesson' | 'exercise' | 'achievement' | 'streak';
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  onClick: () => void;
  disabled?: boolean;
}

// Main Dashboard Component
export const MainDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalLessons: 50,
    completedLessons: 32,
    averageScore: 87,
    studyTime: 245,
    currentStreak: 7,
    totalXP: 3450,
    level: 12,
    achievements: 23,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'lesson',
      title: 'درس جديد مكتمل',
      description: 'أكملت درس "Present Perfect"',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      icon: <School />,
      color: 'success',
    },
    {
      id: '2',
      type: 'achievement',
      title: 'إنجاز جديد',
      description: 'حصلت على شارة "Fast Learner"',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      icon: <EmojiEvents />,
      color: 'warning',
    },
    {
      id: '3',
      type: 'streak',
      title: 'سلسلة متصلة',
      description: '7 أيام متتالية من التعلم',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      icon: <TrendingUp />,
      color: 'primary',
    },
  ]);

  const [quickActions, setQuickActions] = useState<QuickAction[]>([
    {
      id: '1',
      title: 'بدء درس جديد',
      description: 'استكمل درسك التالي',
      icon: <PlayArrow />,
      color: 'primary',
      onClick: () => console.log('Start new lesson'),
    },
    {
      id: '2',
      title: 'ممارسة النطق',
      description: 'تدرب على النطق الصحيح',
      icon: <Mic />,
      color: 'secondary',
      onClick: () => console.log('Practice pronunciation'),
    },
    {
      id: '3',
      title: 'اختبار سريع',
      description: 'اختبر معلوماتك',
      icon: <Timer />,
      color: 'warning',
      onClick: () => console.log('Quick test'),
    },
    {
      id: '4',
      title: 'الدردشة الجماعية',
      description: 'تواصل مع زملائك',
      icon: <Group />,
      color: 'info',
      onClick: () => console.log('Group chat'),
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setLoading(false);
      handleMenuClose();
    }, 1500);
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return `منذ ${diffDays} يوم`;
  };

  const getProgressColor = (percentage: number): 'success' | 'warning' | 'error' => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  return (
    <AppLayout
      header={
        <AppHeader
          title="لوحة التحكم"
          subtitle="مرحباً بك في منصة التعلم الذكية"
          leftActions={
            <AppIcon
              icon={<DashboardIcon />}
              color="primary"
              ariaLabel="Dashboard"
            />
          }
          rightActions={
            <Stack direction="row" spacing={1}>
              <AppIcon
                icon={<Notifications />}
                onClick={() => console.log('Notifications')}
                ariaLabel="Notifications"
              />
              <AppIcon
                icon={<Search />}
                onClick={() => console.log('Search')}
                ariaLabel="Search"
              />
              <AppIcon
                icon={<MoreVert />}
                onClick={handleMenuOpen}
                ariaLabel="More options"
              />
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleRefresh}>
                  <AppIcon icon={<Refresh />} size="sm" />
                  تحديث البيانات
                </MenuItem>
                <MenuItem onClick={() => console.log('Settings')}>
                  <AppIcon icon={<Settings />} size="sm" />
                  الإعدادات
                </MenuItem>
                <MenuItem onClick={() => console.log('Profile')}>
                  <AppIcon icon={<Person />} size="sm" />
                  الملف الشخصي
                </MenuItem>
              </Menu>
            </Stack>
          }
        />
      }
    >
      <Box sx={{ py: tokens.spacing.lg }}>
        {/* Alert for important information */}
        <Alert severity="info" sx={{ mb: tokens.spacing.lg }}>
          <AlertTitle>مرحباً بك!</AlertTitle>
          لقد أكملت 64% من الدروس المتاحة. استمر في التقدم للحفاظ على سلسلة التعلم!
        </Alert>

        {/* Stats Overview */}
        <AppGrid spacing={tokens.spacing.lg} sx={{ mb: tokens.spacing.xl }}>
          <AppGrid xs={12} sm={6} md={3}>
            <AppCard>
              <Stack spacing={tokens.spacing.md} alignItems="center">
                <AppAvatar color="primary" size="lg">
                  <School />
                </AppAvatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {stats.completedLessons}/{stats.totalLessons}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  الدروس المكتملة
                </Typography>
                <AppProgress
                  value={(stats.completedLessons / stats.totalLessons) * 100}
                  color="primary"
                  showLabel
                  label="التقدم"
                />
              </Stack>
            </AppCard>
          </AppGrid>

          <AppGrid xs={12} sm={6} md={3}>
            <AppCard>
              <Stack spacing={tokens.spacing.md} alignItems="center">
                <AppAvatar color="success" size="lg">
                  <TrendingUp />
                </AppAvatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {stats.averageScore}%
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  متوسط الدرجات
                </Typography>
                <AppProgress
                  value={stats.averageScore}
                  color={getProgressColor(stats.averageScore)}
                  showLabel
                  label="الأداء"
                />
              </Stack>
            </AppCard>
          </AppGrid>

          <AppGrid xs={12} sm={6} md={3}>
            <AppCard>
              <Stack spacing={tokens.spacing.md} alignItems="center">
                <AppAvatar color="warning" size="lg">
                  <Timer />
                </AppAvatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {formatTime(stats.studyTime)}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  وقت الدراسة
                </Typography>
                <AppChip
                  label={`${stats.currentStreak} أيام متتالية`}
                  color="warning"
                  size="small"
                />
              </Stack>
            </AppCard>
          </AppGrid>

          <AppGrid xs={12} sm={6} md={3}>
            <AppCard>
              <Stack spacing={tokens.spacing.md} alignItems="center">
                <AppAvatar color="secondary" size="lg">
                  <EmojiEvents />
                </AppAvatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Level {stats.level}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {stats.totalXP} XP
                </Typography>
                <AppChip
                  label={`${stats.achievements} إنجاز`}
                  color="secondary"
                  size="small"
                />
              </Stack>
            </AppCard>
          </AppGrid>
        </AppGrid>

        {/* Quick Actions and Recent Activity */}
        <AppGrid spacing={tokens.spacing.lg}>
          {/* Quick Actions */}
          <AppGrid xs={12} md={8}>
            <AppCard
              title="الإجراءات السريعة"
              subtitle="ابدأ التعلم بسرعة"
            >
              <AppGrid spacing={tokens.spacing.md}>
                {quickActions.map((action) => (
                  <AppGrid xs={12} sm={6} key={action.id}>
                    <AppPaper
                      onClick={action.onClick}
                      padding={tokens.spacing.lg}
                      hoverable
                    >
                      <Stack direction="row" spacing={tokens.spacing.md} alignItems="center">
                        <AppAvatar color={action.color} size="md">
                          {action.icon}
                        </AppAvatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {action.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {action.description}
                          </Typography>
                        </Box>
                        <AppIcon
                          icon={<PlayArrow />}
                          color={action.color}
                          size="sm"
                        />
                      </Stack>
                    </AppPaper>
                  </AppGrid>
                ))}
              </AppGrid>
            </AppCard>
          </AppGrid>

          {/* Recent Activity */}
          <AppGrid xs={12} md={4}>
            <AppCard
              title="النشاط الأخير"
              subtitle="آخر تحديثاتك"
            >
              <Stack spacing={tokens.spacing.md}>
                {recentActivity.map((activity) => (
                  <Box key={activity.id}>
                    <Stack direction="row" spacing={tokens.spacing.md} alignItems="flex-start">
                      <AppAvatar color={activity.color} size="sm">
                        {activity.icon}
                      </AppAvatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {activity.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(activity.timestamp)}
                        </Typography>
                      </Box>
                    </Stack>
                    {activity.id !== recentActivity[recentActivity.length - 1].id && (
                      <Divider sx={{ mt: tokens.spacing.md }} />
                    )}
                  </Box>
                ))}
              </Stack>
            </AppCard>
          </AppGrid>
        </AppGrid>

        {/* System Status */}
        <AppGrid spacing={tokens.spacing.lg} sx={{ mt: tokens.spacing.xl }}>
          <AppGrid xs={12}>
            <AppCard
              title="حالة النظام"
              subtitle="معلومات النظام والاتصال"
            >
              <Stack direction="row" spacing={tokens.spacing.xl} alignItems="center">
                <Stack direction="row" spacing={tokens.spacing.sm} alignItems="center">
                  <Wifi color="success" />
                  <Typography variant="body2">متصل</Typography>
                </Stack>
                <Stack direction="row" spacing={tokens.spacing.sm} alignItems="center">
                  <BatteryFull color="success" />
                  <Typography variant="body2">85%</Typography>
                </Stack>
                <Stack direction="row" spacing={tokens.spacing.sm} alignItems="center">
                  <SignalCellular4G color="success" />
                  <Typography variant="body2">4G</Typography>
                </Stack>
                <Stack direction="row" spacing={tokens.spacing.sm} alignItems="center">
                  <VolumeUp color="action" />
                  <Typography variant="body2">صوت عالي</Typography>
                </Stack>
                <Stack direction="row" spacing={tokens.spacing.sm} alignItems="center">
                  <Headphones color="action" />
                  <Typography variant="body2">مكبرات صوت</Typography>
                </Stack>
              </Stack>
            </AppCard>
          </AppGrid>
        </AppGrid>

        {/* Loading Overlay */}
        {loading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <Stack spacing={tokens.spacing.md} alignItems="center">
              <CircularProgress size={48} />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                جاري تحديث البيانات...
              </Typography>
            </Stack>
          </Box>
        )}

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: tokens.spacing.xl,
            right: tokens.spacing.xl,
          }}
          onClick={() => console.log('Add new content')}
        >
          <Add />
        </Fab>
      </Box>
    </AppLayout>
  );
};
