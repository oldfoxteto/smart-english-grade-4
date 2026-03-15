// Simple Testing Page - Working Version
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  Stack,
  Alert,
  AlertTitle,
  Container,
} from '@mui/material';
import {
  Quiz,
  Timer,
  CheckCircle,
  School,
  TrendingUp,
  EmojiEvents,
  PlayArrow,
  Assessment,
  Book,
  Headphones,
  RecordVoiceOver,
} from '@mui/icons-material';

const TestingPageSimple: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Stack spacing={2} alignItems="center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <Typography variant="h6">جاري تحميل الاختبارات...</Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          📝 الاختبارات والتقييم
        </Typography>
        <Typography variant="body1" color="text.secondary">
          اختبر مهاراتك وتتبع تقدمك في تعلم اللغة الإنجليزية
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                <Quiz />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                5
              </Typography>
              <Typography variant="body2" color="text.secondary">
                إجمالي الاختبارات
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                <CheckCircle />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                2
              </Typography>
              <Typography variant="body2" color="text.secondary">
                الاختبارات المكتملة
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                <TrendingUp />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                85%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                متوسط الدرجات
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2 }}>
                <Timer />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                1h 30m
              </Typography>
              <Typography variant="body2" color="text.secondary">
                إجمالي وقت الاختبارات
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Test Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ transition: 'all 0.2s ease-in-out', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Assessment />
                  </Avatar>
                  <Stack direction="row" spacing={1}>
                    <Chip label="placement" color="primary" size="small" />
                    <Chip label="completed" color="success" size="small" />
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    اختبار التقييم
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    حدد مستواك في اللغة الإنجليزية
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Quiz sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      50 سؤال
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Timer sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      45 دقيقة
                    </Typography>
                  </Stack>
                </Stack>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      آخر درجة: 78%
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      أفضل درجة: 85%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={78}
                    color="warning"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>

                <Stack direction="row" spacing={1}>
                  <Button
                    startIcon={<PlayArrow />}
                    color="success"
                    variant="outlined"
                    fullWidth
                  >
                    مراجعة
                  </Button>
                  <Button
                    startIcon={<CheckCircle />}
                    color="secondary"
                    variant="outlined"
                  >
                    النتائج
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ transition: 'all 0.2s ease-in-out', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <Book />
                  </Avatar>
                  <Stack direction="row" spacing={1}>
                    <Chip label="progress" color="warning" size="small" />
                    <Chip label="available" color="primary" size="small" />
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    اختبار القواعد
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    اختبر معرفتك بالقواعد
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Quiz sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      25 سؤال
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Timer sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      30 دقيقة
                    </Typography>
                  </Stack>
                </Stack>

                <Button
                  startIcon={<PlayArrow />}
                  color="primary"
                  variant="contained"
                  fullWidth
                >
                  بدء الاختبار
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ transition: 'all 0.2s ease-in-out', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Avatar sx={{ bgcolor: 'error.main' }}>
                    <Headphones />
                  </Avatar>
                  <Stack direction="row" spacing={1}>
                    <Chip label="progress" color="warning" size="small" />
                    <Chip label="available" color="primary" size="small" />
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    اختبار فهم الاستماع
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    اختبر قدراتك الاستماع
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Quiz sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      30 سؤال
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Timer sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      35 دقيقة
                    </Typography>
                  </Stack>
                </Stack>

                <Button
                  startIcon={<PlayArrow />}
                  color="primary"
                  variant="contained"
                  fullWidth
                >
                  بدء الاختبار
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TestingPageSimple;
