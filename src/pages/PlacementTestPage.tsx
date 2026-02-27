import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  Grid,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  getPlacementTest,
  submitPlacement,
  type PlacementTestResponse,
} from '../core/api';
import { playSuccess, playClick } from '../core/sounds';

const PlacementTestPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [error, setError] = useState('');
  const [testData, setTestData] = useState<PlacementTestResponse | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const [result, setResult] = useState<{
    estimatedCefr: string;
    scorePercent: number;
    recommendations: string[];
  } | null>(null);

  const steps = ['الاختيار', 'الاختبار', 'النتيجة'];

  useEffect(() => {
    const loadTest = async () => {
      setLoading(true);
      setError('');
      try {
        const test = await getPlacementTest('en');
        setTestData(test);
        setStep(1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'فشل تحميل الاختبار');
      } finally {
        setLoading(false);
      }
    };

    // Auto-load test when component mounts
    loadTest();
  }, []);

  const handleLanguageSelect = (language: 'en' | 'el') => {
    setLoading(true);
    setError('');
    getPlacementTest(language)
      .then((test) => {
        setTestData(test);
        setStep(1);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'فشل تحميل الاختبار');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAnswer = (questionId: string, optionId: string) => {
    playClick();
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < (testData?.test.questions.length || 0) - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmitTest();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    if (!testData) return;

    
    setError('');

    try {
      const answersArray = Object.entries(answers).map(([questionId, optionId]) => ({
        questionId,
        optionId,
      }));

      const response = await submitPlacement(testData.test.id, answersArray);
      
      const cefr = response.placementResult.estimatedCefr;
      const score = response.placementResult.scorePercent;

      // Generate recommendations based on CEFR level
      const recommendations = getRecommendationsForLevel(cefr);

      setResult({
        estimatedCefr: cefr,
        scorePercent: score,
        recommendations,
      });

      playSuccess();
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تسليم الاختبار');
    } finally {
      
    }
  };

  const getRecommendationsForLevel = (cefr: string): string[] => {
    const recommendations: Record<string, string[]> = {
      'A1': [
        'التركيز على المفردات الأساسية والتحيات',
        'ممارسة الأفعال الشائعة في الحاضر',
        'تعلم أرقام والألوان والأيام',
        'تمارين بسيطة على القراءة والاستماع',
      ],
      'A2': [
        'تطوير مهارات المحادثة اليومية',
        'تعلم قواعد الماضي والمستقبل البسيط',
        'ممارسة قراءة النصوص القصيرة',
        'توسيع المفردات في المواضيع اليومية',
      ],
      'B1': [
        'التركيز على القواعد المتقدمة',
        'ممارسة الكتابة في فقرات',
        'فهم النصوص الطويلة والمحادثات',
        'تعلم التعبيرات الاصطلاحية',
      ],
      'B2': [
        'ممارسة اللغة في سياقات مهنية',
        'فهم المواد الأكاديمية',
        'الكتابة عن مواضيع معقدة',
        'المشاركة في المناقشات المتقدمة',
      ],
      'C1': [
        'فهم النصوص الأدبية والمعقدة',
        'التعبير الدقيق والرسمي',
        'تحليل المواضيع المجردة',
        'إعداد العروض التقديمية',
      ],
      'C2': [
        'إتقان اللغة في جميع السياقات',
        'فهم النكات الثقافية الدقيقة',
        'الكتابة الأكاديمية المتقدمة',
        'القدرة على تدريس اللغة',
      ],
    };

    return recommendations[cefr] || [
      'ممارسة شاملة لجميع المهارات',
      'التواصل مع الناطقين الأصليين',
      'استخدام متنوع للغة في الحياة اليومية',
    ];
  };

  const getLevelColor = (cefr: string) => {
    const colors: Record<string, string> = {
      'A1': '#4CAF50',
      'A2': '#8BC34A',
      'B1': '#FF9800',
      'B2': '#FF5722',
      'C1': '#9C27B0',
      'C2': '#F44336',
    };
    return colors[cefr] || '#2196F3';
  };

  const getLevelDescription = (cefr: string) => {
    const descriptions: Record<string, string> = {
      'A1': 'مبتدئ (Beginner) - يمكنك فهم واستخدام عبارات يومية بسيطة',
      'A2': 'مبتدئ متقدم (Elementary) - يمكنك التواصل في المهام الروتينية البسيطة',
      'B1': 'متوسط (Intermediate) - يمكنك التعامل مع معظم المواقف أثناء السفر',
      'B2': 'متوسط متقدم (Upper Intermediate) - يمكنك التفاعل بثقة و fluency',
      'C1': 'متقدم (Advanced) - يمكنك استخدام اللغة بفعالية في الحياة المهنية',
      'C2': 'خبير (Proficient) - يمكنك فهم وتعبير كل شيء تقريباً',
    };
    return descriptions[cefr] || 'مستوى غير محدد';
  };

  const question = testData?.test.questions[currentQuestion];
  const progress = testData ? ((currentQuestion + 1) / testData.test.questions.length) * 100 : 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mr: 2 }}>جاري تحميل الاختبار...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 6, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0B4B88 0%, #0C7FA0 60%, #7BC8A4 100%)', 
        py: { xs: 3, md: 4 }, 
        px: { xs: 2, md: 3 }, 
        mb: 4, 
        textAlign: 'center' 
      }}>
        <Typography variant="h3" sx={{ 
          color: 'white', 
          fontWeight: 800, 
          mb: 1, 
          fontSize: { xs: '1.8rem', md: '2.8rem' } 
        }}>
          📋 اختبار تحديد المستوى
        </Typography>
        <Typography variant="h6" sx={{ 
          color: 'rgba(255,255,255,0.9)', 
          fontSize: { xs: '0.95rem', md: '1.15rem' } 
        }}>
          اختبار ذكي لتحديد مستواك الحقيقي في اللغة الإنجليزية
        </Typography>
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 }, maxWidth: 900, mx: 'auto' }}>
        <Button onClick={() => navigate('/home')} sx={{ mb: 3, fontWeight: 700 }}>
          العودة للرئيسية
        </Button>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Stepper */}
        <Stepper activeStep={step} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 0: Language Selection */}
        {step === 0 && (
          <Card sx={{ textAlign: 'center', p: { xs: 2, md: 4 } }}>
            <CardContent>
              <Typography sx={{ fontSize: '4rem', mb: 2 }}>🌍</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                اختر اللغة التي تريد اختبارها
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                سنقوم بتقييم مستواك الحالي وتحديد المسار التعليمي الأنسب لك
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => handleLanguageSelect('en')}
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(135deg, #0B4B88, #2979C1)',
                    fontSize: '1.1rem',
                    px: 4,
                    py: 1.5,
                  }}
                >
                  🇬🇧 الإنجليزية
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => handleLanguageSelect('el')}
                  disabled={loading}
                  sx={{
                    fontSize: '1.1rem',
                    px: 4,
                    py: 1.5,
                  }}
                >
                  🇬🇷 اليونانية (قريباً)
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Test Questions */}
        {step === 1 && question && (
          <Box>
            {/* Progress */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    السؤال {currentQuestion + 1} / {testData?.test.questions.length}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {Math.round(progress)}% مكتمل
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress}
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
              </CardContent>
            </Card>

            {/* Question */}
            <Card>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                  {question.prompt}
                </Typography>

                <Grid container spacing={2}>
                  {question.options
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((option) => {
                      const isSelected = answers[question.id] === option.id;
                      return (
                        <Box key={option.id} sx={{ width: { xs: '100%', sm: '50%' } }}>
                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => handleAnswer(question.id, option.id)}
                            sx={{
                              py: 2,
                              textAlign: 'right',
                              justifyContent: 'flex-start',
                              background: isSelected ? '#E3F2FD' : 'white',
                              borderColor: isSelected ? '#0B4B88' : '#E0E0E0',
                              color: isSelected ? '#0B4B88' : 'text.primary',
                              fontWeight: isSelected ? 700 : 600,
                              fontSize: '1rem',
                              transition: 'all 0.3s',
                              '&:hover': {
                                background: '#F5F5F5',
                                borderColor: '#0B4B88',
                              },
                            }}
                          >
                            {option.optionText}
                          </Button>
                        </Box>
                      );
                    })}
                </Grid>

                {/* Navigation */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    sx={{ fontWeight: 600 }}
                  >
                    السؤال السابق
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!answers[question.id]}
                    sx={{
                      background: 'linear-gradient(135deg, #0B4B88, #2979C1)',
                      fontWeight: 600,
                    }}
                  >
                    {currentQuestion === (testData?.test.questions.length || 0) - 1
                      ? 'إنهاء الاختبار'
                      : 'السؤال التالي'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Step 2: Results */}
        {step === 2 && result && (
          <Card sx={{ textAlign: 'center' }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography sx={{ fontSize: '4rem', mb: 2 }}>
                {result.scorePercent >= 80 ? '🏆' : result.scorePercent >= 60 ? '🌟' : '💪'}
              </Typography>
              
              <Typography variant="h3" sx={{ 
                fontWeight: 800, 
                color: getLevelColor(result.estimatedCefr),
                mb: 1,
                fontSize: { xs: '1.8rem', md: '2.5rem' }
              }}>
                مستواك: {result.estimatedCefr}
              </Typography>
              
              <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                {getLevelDescription(result.estimatedCefr)}
              </Typography>
              
              <Box sx={{ 
                background: 'linear-gradient(135deg, #F8FAFB, #E8F0FF)', 
                borderRadius: '16px', 
                p: 3, 
                mb: 3 
              }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  📊 نتيجة الاختبار
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#0B4B88' }}>
                  {result.scorePercent}%
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'right', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                  🎯 توصيات مخصصة لك:
                </Typography>
                {result.recommendations.map((rec, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      label={`${index + 1}`} 
                      size="small" 
                      sx={{ 
                        background: '#0B4B88', 
                        color: 'white', 
                        fontWeight: 700,
                        ml: 1,
                        minWidth: 30
                      }} 
                    />
                    <Typography variant="body1">{rec}</Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setStep(0);
                    setCurrentQuestion(0);
                    setAnswers({});
                    setResult(null);
                  }}
                  sx={{ fontWeight: 600 }}
                >
                  إعادة الاختبار
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/home')}
                  sx={{
                    background: 'linear-gradient(135deg, #0B4B88, #2979C1)',
                    fontWeight: 600,
                  }}
                >
                  ابدأ التعلم الآن
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default PlacementTestPage;
