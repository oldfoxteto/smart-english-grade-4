// Lessons Page - Fixed Version
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import {
  Search,
  School,
  PlayArrow,
  CheckCircle,
  Lock,
  Timer,
  Star,
  TrendingUp,
  Book,
  Psychology,
  RecordVoiceOver,
  Headphones,
} from '@mui/icons-material';

// Import design system
import { tokens } from '../design-system/tokens';
import {
  AppCard,
  AppButton,
  AppProgress,
  AppAvatar,
  AppChip,
  AppGrid,
} from '../components/ui';

// Types
interface Lesson {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  category: 'grammar' | 'vocabulary' | 'reading' | 'listening' | 'speaking';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  progress: number;
  completed: boolean;
  locked: boolean;
  rating: number;
  enrolled: number;
  instructor: {
    name: string;
    avatar: string;
  };
}

// Mock data
const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Present Perfect Tense',
    arabicTitle: 'زمن المضارع التام',
    description: 'Learn how to use present perfect tense correctly',
    arabicDescription: 'تعلم كيفية استخدام زمن المضارع التام بشكل صحيح',
    category: 'grammar',
    difficulty: 'intermediate',
    duration: 45,
    progress: 75,
    completed: false,
    locked: false,
    rating: 4.5,
    enrolled: 1234,
    instructor: {
      name: 'Dr. Ahmed',
      avatar: '/avatars/instructor1.jpg',
    },
  },
  {
    id: '2',
    title: 'Business Vocabulary',
    arabicTitle: 'مفردات الأعمال',
    description: 'Essential business English vocabulary',
    arabicDescription: 'مفردات إنجليزية أساسية للأعمال',
    category: 'vocabulary',
    difficulty: 'advanced',
    duration: 60,
    progress: 30,
    completed: false,
    locked: false,
    rating: 4.8,
    enrolled: 892,
    instructor: {
      name: 'Prof. Sarah',
      avatar: '/avatars/instructor2.jpg',
    },
  },
  {
    id: '3',
    title: 'Daily Conversations',
    arabicTitle: 'المحادثات اليومية',
    description: 'Common phrases for daily conversations',
    arabicDescription: 'عبارات شائعة للمحادثات اليومية',
    category: 'speaking',
    difficulty: 'beginner',
    duration: 30,
    progress: 100,
    completed: true,
    locked: false,
    rating: 4.7,
    enrolled: 2156,
    instructor: {
      name: 'Ms. Fatima',
      avatar: '/avatars/instructor3.jpg',
    },
  },
];

const LessonsPage: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLessons(mockLessons);
      setFilteredLessons(mockLessons);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = lessons;
    if (searchQuery) {
      filtered = filtered.filter(lesson =>
        lesson.arabicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.arabicDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(lesson => lesson.category === selectedCategory);
    }
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(lesson => lesson.difficulty === selectedDifficulty);
    }
    setFilteredLessons(filtered);
  }, [lessons, searchQuery, selectedCategory, selectedDifficulty]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'grammar': return <Book />;
      case 'vocabulary': return <Psychology />;
      case 'reading': return <Book />;
      case 'listening': return <Headphones />;
      case 'speaking': return <RecordVoiceOver />;
      default: return <School />;
    }
  };

  const getCategoryColor = (category: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' => {
    switch (category) {
      case 'grammar': return 'primary';
      case 'vocabulary': return 'secondary';
      case 'reading': return 'success';
      case 'listening': return 'warning';
      case 'speaking': return 'error';
      default: return 'primary';
    }
  };

  const getDifficultyColor = (difficulty: string): 'success' | 'warning' | 'error' => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'warning';
    }
  };

  const getProgressColor = (progress: number): 'success' | 'warning' | 'error' => {
    if (progress >= 80) return 'success';
    if (progress >= 50) return 'warning';
    return 'error';
  };

  const handleLessonClick = (lessonId: string) => {
    console.log('Navigate to lesson:', lessonId);
    window.location.href = `/lesson/${lessonId}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Stack spacing={2} alignItems="center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <Typography variant="h6">جاري تحميل الدروس...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ p: tokens.spacing.lg }}>
      <Box sx={{ mb: tokens.spacing.xl }}>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: tokens.spacing.md }}>
          📚 الدروس المتاحة
        </Typography>
        <Typography variant="body1" color="text.secondary">
          اختر الدرس المناسب لمستواك وابدأ رحلة التعلم
        </Typography>
      </Box>

      <AppCard sx={{ mb: tokens.spacing.xl }}>
        <Stack spacing={tokens.spacing.lg}>
          <TextField
            fullWidth
            placeholder="ابحث عن درس..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
                  <Search />
                </Box>
              ),
            }}
            sx={{ mb: tokens.spacing.md }}
          />

          <Stack direction="row" spacing={tokens.spacing.md}>
            <FormControl fullWidth>
              <InputLabel>الفئة</InputLabel>
              <Select
                value={selectedCategory}
                label="الفئة"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">جميع الفئات</MenuItem>
                <MenuItem value="grammar">القواعد</MenuItem>
                <MenuItem value="vocabulary">المفردات</MenuItem>
                <MenuItem value="reading">القراءة</MenuItem>
                <MenuItem value="listening">الاستماع</MenuItem>
                <MenuItem value="speaking">التحدث</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>المستوى</InputLabel>
              <Select
                value={selectedDifficulty}
                label="المستوى"
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <MenuItem value="all">جميع المستويات</MenuItem>
                <MenuItem value="beginner">مبتدئ</MenuItem>
                <MenuItem value="intermediate">متوسط</MenuItem>
                <MenuItem value="advanced">متقدم</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </AppCard>

      <AppGrid spacing={tokens.spacing.lg} sx={{ mb: tokens.spacing.xl }}>
        <AppGrid xs={12} sm={6} md={3}>
          <AppCard>
            <Stack spacing={tokens.spacing.md} alignItems="center">
              <AppAvatar color="primary" size="lg">
                <School />
              </AppAvatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {lessons.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                إجمالي الدروس
              </Typography>
            </Stack>
          </AppCard>
        </AppGrid>

        <AppGrid xs={12} sm={6} md={3}>
          <AppCard>
            <Stack spacing={tokens.spacing.md} alignItems="center">
              <AppAvatar color="success" size="lg">
                <CheckCircle />
              </AppAvatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {lessons.filter(l => l.completed).length}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                الدروس المكتملة
              </Typography>
            </Stack>
          </AppCard>
        </AppGrid>

        <AppGrid xs={12} sm={6} md={3}>
          <AppCard>
            <Stack spacing={tokens.spacing.md} alignItems="center">
              <AppAvatar color="warning" size="lg">
                <TrendingUp />
              </AppAvatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {lessons.filter(l => l.progress > 0 && !l.completed).length}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                الدروس قيد التقدم
              </Typography>
            </Stack>
          </AppCard>
        </AppGrid>

        <AppGrid xs={12} sm={6} md={3}>
          <AppCard>
            <Stack spacing={tokens.spacing.md} alignItems="center">
              <AppAvatar color="secondary" size="lg">
                <Star />
              </AppAvatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Level 12
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                3450 XP
              </Typography>
            </Stack>
          </AppCard>
        </AppGrid>
      </AppGrid>

      <AppCard title="الدروس المتاحة" subtitle="اختر الدرس التالي للبدء">
        <AppGrid spacing={tokens.spacing.lg}>
          {filteredLessons.map((lesson) => (
            <AppGrid xs={12} sm={6} md={4} key={lesson.id}>
              <Card
                onClick={() => handleLessonClick(lesson.id)}
                sx={{
                  opacity: lesson.locked ? 0.6 : 1,
                  cursor: lesson.locked ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: tokens.shadows.md,
                  },
                }}
              >
                <CardContent sx={{ p: tokens.spacing.lg }}>
                  <Stack spacing={tokens.spacing.md}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <AppChip
                        label={lesson.arabicTitle}
                        color={getCategoryColor(lesson.category)}
                        size="small"
                        icon={getCategoryIcon(lesson.category)}
                      />
                      <AppChip
                        label={lesson.difficulty}
                        color={getDifficultyColor(lesson.difficulty)}
                        size="small"
                      />
                    </Box>

                    <Stack direction="row" spacing={tokens.spacing.sm} alignItems="center">
                      <AppAvatar
                        src={lesson.instructor.avatar}
                        size="sm"
                      >
                        {lesson.instructor.name.charAt(0)}
                      </AppAvatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {lesson.instructor.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          المدرب
                        </Typography>
                      </Box>
                    </Stack>

                    <Typography variant="h6" sx={{ fontWeight: 600, mb: tokens.spacing.xs }}>
                      {lesson.arabicTitle}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: tokens.spacing.sm }}>
                      {lesson.arabicDescription}
                    </Typography>

                    <Stack direction="row" spacing={tokens.spacing.md} alignItems="center">
                      <Stack direction="row" spacing={tokens.spacing.xs} alignItems="center">
                        <Timer sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {lesson.duration} دقيقة
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={tokens.spacing.xs} alignItems="center">
                        <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                        <Typography variant="caption" color="text.secondary">
                          {lesson.rating}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={tokens.spacing.xs} alignItems="center">
                        <School sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {lesson.enrolled}
                        </Typography>
                      </Stack>
                    </Stack>

                    <AppProgress
                      value={lesson.progress}
                      color={getProgressColor(lesson.progress)}
                      showLabel
                      label={lesson.completed ? "مكتمل" : "التقدم"}
                    />

                    <AppButton
                      startIcon={lesson.locked ? <Lock /> : lesson.completed ? <CheckCircle /> : <PlayArrow />}
                      color={lesson.completed ? 'success' : 'primary'}
                      onClick={() => handleLessonClick(lesson.id)}
                      disabled={lesson.locked}
                      fullWidth
                    >
                      {lesson.locked ? 'مقفل' : lesson.completed ? 'مراجعة' : 'بدء الدرس'}
                    </AppButton>
                  </Stack>
                </CardContent>
              </Card>
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
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              variant="outlined"
            >
              مسح الفلاتر
            </AppButton>
          </Box>
        )}
      </AppCard>
    </Box>
  );
};

export default LessonsPage;
