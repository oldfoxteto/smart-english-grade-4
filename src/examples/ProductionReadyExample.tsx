// Complete Integration Example - Production Ready
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Stack,
  Alert,
  AlertTitle,
  CircularProgress,
  Backdrop,
  Fade,
  Modal,
} from '@mui/material';
import {
  Search,
  FilterList,
  Refresh,
  Settings,
  Notifications,
  Person,
  School,
  TrendingUp,
  EmojiEvents,
  Timer,
  PlayArrow,
  Pause,
  Stop,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
} from '@mui/icons-material';

// Import design system and components
import { theme, extendedTheme } from '../design-system/theme';
import { tokens } from '../design-system/tokens';
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
} from '../components/ui';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
  streak: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  progress: number;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  completed: boolean;
  locked: boolean;
}

interface ApiResponse<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Custom hook for API calls
function useApiCall<T>(
  apiFunction: () => Promise<T>
): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data: data as T,
    loading,
    error,
    refetch: fetchData,
  };
}

// Mock API functions
const fetchUser = async (): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id: '1',
    name: 'Ahmed Student',
    email: 'ahmed@example.com',
    level: 12,
    xp: 3450,
    streak: 7,
  };
};

const fetchLessons = async (): Promise<Lesson[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return [
    {
      id: '1',
      title: 'Present Perfect Tense',
      description: 'Learn how to use the present perfect tense',
      progress: 75,
      duration: 45,
      difficulty: 'intermediate',
      category: 'Grammar',
      completed: false,
      locked: false,
    },
    {
      id: '2',
      title: 'Business Vocabulary',
      description: 'Essential business English vocabulary',
      progress: 30,
      duration: 60,
      difficulty: 'advanced',
      category: 'Vocabulary',
      completed: false,
      locked: false,
    },
    {
      id: '3',
      title: 'Daily Conversations',
      description: 'Common phrases for daily conversations',
      progress: 100,
      duration: 30,
      difficulty: 'beginner',
      category: 'Speaking',
      completed: true,
      locked: false,
    },
  ];
};

// Main Component
export const ProductionReadyDashboard: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // API calls with custom hook
  const userResponse = useApiCall(fetchUser);
  const lessonsResponse = useApiCall(fetchLessons);

  // Memoized filtered lessons
  const filteredLessons = useMemo(() => {
    if (!lessonsResponse.data) return [];
    
    return lessonsResponse.data.filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || lesson.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [lessonsResponse.data, searchQuery, filterCategory]);

  // Memoized stats
  const stats = useMemo(() => {
    if (!lessonsResponse.data) return null;
    
    const total = lessonsResponse.data.length;
    const completed = lessonsResponse.data.filter(l => l.completed).length;
    const inProgress = lessonsResponse.data.filter(l => l.progress > 0 && !l.completed).length;
    const averageProgress = lessonsResponse.data.reduce((acc, l) => acc + l.progress, 0) / total;
    
    return {
      total,
      completed,
      inProgress,
      averageProgress: Math.round(averageProgress),
    };
  }, [lessonsResponse.data]);

  // Event handlers
  const handleLessonClick = useCallback((lesson: Lesson) => {
    if (lesson.locked) return;
    setSelectedLesson(lesson);
  }, []);

  const handleRefresh = useCallback(() => {
    lessonsResponse.refetch();
    userResponse.refetch();
  }, [lessonsResponse, userResponse]);

  const getDifficultyColor = (difficulty: string): 'success' | 'warning' | 'error' => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'primary';
    }
  };

  const getProgressColor = (progress: number): 'success' | 'warning' | 'error' => {
    if (progress >= 80) return 'success';
    if (progress >= 50) return 'warning';
    return 'error';
  };

  // Loading state
  if (userResponse.loading && lessonsResponse.loading) {
    return (
      <Backdrop open sx={{ zIndex: 9999, color: 'primary.main' }}>
        <Stack spacing={3} alignItems="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            جاري تحميل البيانات...
          </Typography>
        </Stack>
      </Backdrop>
    );
  }

  // Error state
  if (userResponse.error || lessonsResponse.error) {
    return (
      <Box sx={{ p: tokens.spacing.xl }}>
        <Alert severity="error" sx={{ mb: tokens.spacing.lg }}>
          <AlertTitle>خطأ في تحميل البيانات</AlertTitle>
          {userResponse.error || lessonsResponse.error}
          <Box sx={{ mt: tokens.spacing.md }}>
            <AppButton
              onClick={handleRefresh}
              startIcon={<Refresh />}
              variant="outlined"
            >
              إعادة المحاولة
            </AppButton>
          </Box>
        </Alert>
      </Box>
    );
  }

  return (
    <AppLayout
      header={
        <AppHeader
          title="منصة التعلم الذكية"
          subtitle={`مرحباً بك، ${userResponse.data?.name}`}
          leftActions={
            <Stack direction="row" spacing={1}>
              <AppIcon
                icon={<Search />}
                onClick={() => console.log('Search')}
                ariaLabel="Search"
              />
              <AppIcon
                icon={<FilterList />}
                onClick={() => console.log('Filter')}
                ariaLabel="Filter"
              />
            </Stack>
          }
          rightActions={
            <Stack direction="row" spacing={1}>
              <AppBadge badgeContent={5} color="error">
                <AppIcon
                  icon={<Notifications />}
                  onClick={() => setShowNotifications(true)}
                  ariaLabel="Notifications"
                />
              </AppBadge>
              <AppIcon
                icon={<Settings />}
                onClick={() => setShowSettings(true)}
                ariaLabel="Settings"
              />
              <AppAvatar
                src={userResponse.data?.avatar}
                onClick={() => console.log('Profile')}
                ariaLabel="Profile"
              >
                <Person />
              </AppAvatar>
            </Stack>
          }
        />
      }
    >
      <Box sx={{ py: tokens.spacing.lg }}>
        {/* Welcome Alert */}
        <Alert severity="info" sx={{ mb: tokens.spacing.lg }}>
          <AlertTitle>أهلاً بك في منصة التعلم!</AlertTitle>
          لقد حققت تقدماً رائعاً. استمر في المذاكرة للحفاظ على سلسلة التعلم المتصلة.
        </Alert>

        {/* User Stats */}
        {userResponse.data && stats && (
          <AppGrid spacing={tokens.spacing.lg} sx={{ mb: tokens.spacing.xl }}>
            <AppGrid xs={12} sm={6} md={3}>
              <AppCard>
                <Stack spacing={tokens.spacing.md} alignItems="center">
                  <AppAvatar color="primary" size="lg">
                    <School />
                  </AppAvatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {stats.completed}/{stats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    الدروس المكتملة
                  </Typography>
                  <AppProgress
                    value={(stats.completed / stats.total) * 100}
                    color="primary"
                    showLabel
                    label="التقدم العام"
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
                    {stats.averageProgress}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    متوسط التقدم
                  </Typography>
                  <AppChip
                    label={`${stats.inProgress} درس جاري`}
                    color="success"
                    size="small"
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
                    {userResponse.data.streak}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    أيام متتالية
                  </Typography>
                  <AppChip
                    label="سلسلة نشطة"
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
                    Level {userResponse.data.level}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    {userResponse.data.xp} XP
                  </Typography>
                  <AppChip
                    label="مستوى متقدم"
                    color="secondary"
                    size="small"
                  />
                </Stack>
              </AppCard>
            </AppGrid>
          </AppGrid>
        )}

        {/* Lessons Grid */}
        <AppCard
          title="الدروس المتاحة"
          subtitle="اختر الدرس التالي للبدء"
          actions={
            <Stack direction="row" spacing={1}>
              <AppButton
                startIcon={<Refresh />}
                onClick={handleRefresh}
                variant="outlined"
                size="small"
              >
                تحديث
              </AppButton>
            </Stack>
          }
        >
          <AppGrid spacing={tokens.spacing.lg}>
            {filteredLessons.map((lesson) => (
              <AppGrid xs={12} sm={6} md={4} key={lesson.id}>
                <AppPaper
                  onClick={() => handleLessonClick(lesson)}
                  padding={tokens.spacing.lg}
                  hoverable={!lesson.locked}
                  sx={{
                    opacity: lesson.locked ? 0.6 : 1,
                    cursor: lesson.locked ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Stack spacing={tokens.spacing.md}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <AppChip
                        label={lesson.category}
                        color="primary"
                        size="small"
                      />
                      <AppChip
                        label={lesson.difficulty}
                        color={getDifficultyColor(lesson.difficulty)}
                        size="small"
                      />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {lesson.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                      {lesson.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
                      <Timer sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {lesson.duration} دقيقة
                      </Typography>
                    </Box>

                    <AppProgress
                      value={lesson.progress}
                      color={getProgressColor(lesson.progress)}
                      showLabel
                      label={lesson.completed ? "مكتمل" : "التقدم"}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <AppButton
                        startIcon={lesson.completed ? <CheckCircle /> : <PlayArrow />}
                        color={lesson.completed ? 'success' : 'primary'}
                        onClick={() => handleLessonClick(lesson)}
                        disabled={lesson.locked}
                        fullWidth
                      >
                        {lesson.completed ? 'مراجعة' : lesson.locked ? 'مقفل' : 'بدء'}
                      </AppButton>
                    </Box>
                  </Stack>
                </AppPaper>
              </AppGrid>
            ))}
          </AppGrid>

          {filteredLessons.length === 0 && (
            <Box sx={{ textAlign: 'center', py: tokens.spacing.xl }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: tokens.spacing.md }}>
                لا توجد دروس مطابقة للبحث
              </Typography>
              <AppButton
                onClick={() => {
                  setSearchQuery('');
                  setFilterCategory('all');
                }}
                variant="outlined"
              >
                مسح الفلاتر
              </AppButton>
            </Box>
          )}
        </AppCard>

        {/* Lesson Detail Modal */}
        <Modal
          open={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={!!selectedLesson}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: '80%', md: '60%' },
              maxWidth: 600,
            }}>
              {selectedLesson && (
                <AppCard
                  title={selectedLesson.title}
                  actions={
                    <Stack direction="row" spacing={1}>
                      <AppButton
                        onClick={() => setSelectedLesson(null)}
                        variant="outlined"
                      >
                        إغلاق
                      </AppButton>
                      <AppButton
                        startIcon={<PlayArrow />}
                        color="primary"
                        onClick={() => console.log('Start lesson', selectedLesson.id)}
                      >
                        بدء الدرس
                      </AppButton>
                    </Stack>
                  }
                >
                  <Stack spacing={tokens.spacing.lg}>
                    <Typography variant="body1">
                      {selectedLesson.description}
                    </Typography>

                    <Stack direction="row" spacing={tokens.spacing.lg}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: tokens.spacing.xs }}>
                          الفئة
                        </Typography>
                        <AppChip
                          label={selectedLesson.category}
                          color="primary"
                          size="small"
                        />
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: tokens.spacing.xs }}>
                          الصعوبة
                        </Typography>
                        <AppChip
                          label={selectedLesson.difficulty}
                          color={getDifficultyColor(selectedLesson.difficulty)}
                          size="small"
                        />
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: tokens.spacing.xs }}>
                          المدة
                        </Typography>
                        <Typography variant="body2">
                          {selectedLesson.duration} دقيقة
                        </Typography>
                      </Box>
                    </Stack>

                    <AppProgress
                      value={selectedLesson.progress}
                      color={getProgressColor(selectedLesson.progress)}
                      showLabel
                      label="التقدم الحالي"
                    />
                  </Stack>
                </AppCard>
              )}
            </Box>
          </Fade>
        </Modal>
      </Box>
    </AppLayout>
  );
};
