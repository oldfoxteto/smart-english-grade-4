// Simple Practice Page - Working Version
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
  Tabs,
  Tab,
  Paper,
  Container,
} from '@mui/material';
import {
  Psychology,
  RecordVoiceOver,
  Mic,
  Headphones,
  Book,
  Timer,
  PlayArrow,
  Stop,
  Refresh,
  CheckCircle,
  Star,
  TrendingUp,
  Speed,
} from '@mui/icons-material';

const PracticePageSimple: React.FC = () => {
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
            <Typography variant="h6">جاري تحميل التمارين...</Typography>
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
          🎯 التدريب والممارسة
        </Typography>
        <Typography variant="body1" color="text.secondary">
          اختر التمرين المناسب لتحسين مهاراتك اللغوية
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                <Psychology />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                5
              </Typography>
              <Typography variant="body2" color="text.secondary">
                إجمالي التمارين
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
                3
              </Typography>
              <Typography variant="body2" color="text.secondary">
                التمارين المكتملة
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
                18
              </Typography>
              <Typography variant="body2" color="text.secondary">
                إجمالي المحاولات
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2 }}>
                <Star />
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
      </Grid>

      {/* Sample Exercise Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ transition: 'all 0.2s ease-in-out', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <RecordVoiceOver />
                  </Avatar>
                  <Stack direction="row" spacing={1}>
                    <Chip label="Speaking" color="primary" size="small" />
                    <Chip label="intermediate" color="warning" size="small" />
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    تمرين النطق
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    تدرب على النطق الإنجليزي مع تغذية راجعة من الذكاء الاصطناعي
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Timer sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      15 دقيقة
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Speed sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      5 محاولات
                    </Typography>
                  </Stack>
                </Stack>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      آخر درجة: 85%
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      أفضل درجة: 92%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={85}
                    color="success"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>

                <Button
                  startIcon={<PlayArrow />}
                  color="success"
                  variant="outlined"
                  fullWidth
                >
                  مراجعة
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
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <Headphones />
                  </Avatar>
                  <Stack direction="row" spacing={1}>
                    <Chip label="Listening" color="secondary" size="small" />
                    <Chip label="beginner" color="success" size="small" />
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    فهم الاستماع
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    اختبر مهارات الاستماع مع تمارين صوتية
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Timer sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      20 دقيقة
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Speed sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      2 محاولات
                    </Typography>
                  </Stack>
                </Stack>

                <Button
                  startIcon={<PlayArrow />}
                  color="primary"
                  variant="contained"
                  fullWidth
                >
                  بدء التمرين
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
                    <Mic />
                  </Avatar>
                  <Stack direction="row" spacing={1}>
                    <Chip label="Speaking" color="success" size="small" />
                    <Chip label="advanced" color="error" size="small" />
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    تمرين التحدث
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    تدرب على التحدث مع سيناريوهات محادثة
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Timer sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      25 دقيقة
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Speed sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      0 محاولات
                    </Typography>
                  </Stack>
                </Stack>

                <Button
                  startIcon={<PlayArrow />}
                  color="primary"
                  variant="contained"
                  fullWidth
                >
                  بدء التمرين
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PracticePageSimple;
