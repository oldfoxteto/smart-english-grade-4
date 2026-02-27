// Assessment and Certification System
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,
  Badge,
  Tooltip,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  CheckCircle,
  RadioButtonUnchecked,
  Schedule,
  EmojiEvents,
  School,
  MilitaryTech,
  WorkspacePremium,
  Download,
  Share,
  Visibility,
  Timeline,
  TimelineConnector,
  TimelineItem,
  TimelineSeparator
} from '@mui/material';
import {
  Check,
  Close,
  GetApp,
  Assessment,
  Grade,
  Star,
  Timeline as TimelineIcon,
  Assignment,
  Book,
  Psychology,
  Speed,
  TrendingUp,
  LocalFireDepartment,
  Celebration,
  Certificate,
  Award,
  WorkspacePremium as PremiumIcon
} from '@mui/icons-material';

export interface Assessment {
  id: string;
  type: 'placement' | 'progress' | 'final' | 'practice';
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  category: 'grammar' | 'vocabulary' | 'listening' | 'reading' | 'speaking' | 'comprehensive';
  difficulty: 'A1' | 'A2' | 'B1' | 'B2';
  duration: number; // in minutes
  questions: any[];
  passingScore: number;
  maxScore: number;
  createdAt: Date;
  completedAt?: Date;
  score?: number;
  level?: string;
  recommendations?: string[];
  arabicRecommendations?: string[];
}

export interface Certificate {
  id: string;
  userId: string;
  type: 'completion' | 'achievement' | 'level' | 'streak' | 'special';
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  level: string;
  score: number;
  date: Date;
  issuer: string;
  certificateId: string;
  verificationUrl: string;
  shareUrl: string;
  downloadUrl: string;
  skills: string[];
  arabicSkills: string[];
  metadata: {
    courseName: string;
    arabicCourseName: string;
    instructor: string;
    arabicInstructor: string;
    duration: string;
    arabicDuration: string;
  };
}

export interface LearningPath {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  arabicDescription: string;
  level: string;
  totalAssessments: number;
  completedAssessments: number;
  averageScore: number;
  progress: number;
  milestones: {
    title: string;
    arabicTitle: string;
    description: string;
    arabicDescription: string;
    completed: boolean;
    completedAt?: Date;
  }[];
  estimatedCompletion: Date;
  nextAssessment?: string;
}

// Assessment Types
export const assessmentTypes = {
  placement: {
    name: 'Placement Test',
    arabicName: 'اختبار تحديد المستوى',
    description: 'Determine your English level',
    arabicDescription: 'حدد مستواك في الإنجليزية',
    icon: '📋',
    color: '#2196F3'
  },
  progress: {
    name: 'Progress Assessment',
    arabicName: 'اختبار التقدم',
    description: 'Track your learning progress',
    arabicDescription: 'تتبع تقدمك في التعلم',
    icon: '📊',
    color: '#4CAF50'
  },
  final: {
    name: 'Final Exam',
    arabicName: 'الاختبار النهائي',
    description: 'Comprehensive final evaluation',
    arabicDescription: 'تقييم نهائي شامل',
    icon: '🎓',
    color: '#FF9800'
  },
  practice: {
    name: 'Practice Test',
    arabicName: 'اختبار تدريبي',
    description: 'Practice specific skills',
    arabicDescription: 'تدريب على مهارات محددة',
    icon: '🎯',
    color: '#9C27B0'
  }
};

// Certificate Templates
export const certificateTemplates = {
  completion: {
    title: 'Course Completion',
    arabicTitle: 'شهادة إكمال الدورة',
    template: 'completion',
    borderStyle: 'classic',
    colors: ['#0B4B88', '#FFD700', '#FFFFFF']
  },
  achievement: {
    title: 'Achievement Certificate',
    arabicTitle: 'شهادة الإنجاز',
    template: 'achievement',
    borderStyle: 'modern',
    colors: ['#4CAF50', '#FFFFFF', '#E8F5E8']
  },
  level: {
    title: 'Level Achievement',
    arabicTitle: 'شهادة المستوى',
    template: 'level',
    borderStyle: 'elegant',
    colors: ['#9C27B0', '#FFFFFF', '#F3E5F5']
  },
  streak: {
    title: 'Learning Streak',
    arabicTitle: 'سلسلة التعلم',
    template: 'streak',
    borderStyle: 'fun',
    colors: ['#FF5722', '#FFFFFF', '#FFF3E0']
  },
  special: {
    title: 'Special Recognition',
    arabicTitle: 'شهادة تقدير خاصة',
    template: 'special',
    borderStyle: 'premium',
    colors: ['#FFD700', '#FFFFFF', '#FFF8DC']
  }
};

// Assessment Component
export const AssessmentCard: React.FC<{
  assessment: Assessment;
  onStart: (assessmentId: string) => void;
  onRetake: (assessmentId: string) => void;
  onViewResults: (assessmentId: string) => void;
}> = ({ assessment, onStart, onRetake, onViewResults }) => {
  const getProgressColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#FF9800';
    return '#F44336';
  };

  const getStatusText = (assessment: Assessment) => {
    if (assessment.completedAt) {
      if (assessment.score! >= assessment.passingScore) {
        return { text: 'مجاز', color: '#4CAF50' };
      } else {
        return { text: 'راسب', color: '#F44336' };
      }
    }
    return { text: 'لم يبدأ', color: '#9E9E9E' };
  };

  const status = getStatusText(assessment);

  return (
    <Card sx={{ mb: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)' } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
              {assessmentTypes[assessment.type].icon} {assessment.arabicTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {assessment.arabicDescription}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              size="small"
              label={assessmentTypes[assessment.type].arabicName}
              sx={{ 
                bgcolor: assessmentTypes[assessment.type].color, 
                color: 'white',
                fontWeight: 600
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              size="small"
              label={assessment.difficulty}
              color="primary"
            />
            <Chip
              size="small"
              label={assessment.category}
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">
              المدة: {assessment.duration} دقيقة
            </Typography>
          </Box>
        </Box>

        {assessment.completedAt && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">
                النتيجة: {assessment.score}/{assessment.maxScore}
              </Typography>
              <Chip
                size="small"
                label={status.text}
                sx={{ 
                  bgcolor: status.color, 
                  color: 'white',
                  fontWeight: 600
                }}
              />
            </Box>
            
            <LinearProgress
              variant="determinate"
              value={(assessment.score! / assessment.maxScore) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#E0E0E0',
                '& .MuiLinearProgress-bar': {
                  bgcolor: getProgressColor(assessment.score!, assessment.maxScore),
                  borderRadius: 4
                }
              }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          {!assessment.completedAt && (
            <Button
              variant="contained"
              startIcon={<GetApp />}
              onClick={() => onStart(assessment.id)}
              fullWidth
            >
              ابدأ الاختبار
            </Button>
          )}
          
          {assessment.completedAt && assessment.score! < assessment.passingScore && (
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => onRetake(assessment.id)}
              fullWidth
            >
              إعادة الاختبار
            </Button>
          )}
          
          {assessment.completedAt && (
            <Button
              variant="outlined"
              startIcon={<Assessment />}
              onClick={() => onViewResults(assessment.id)}
              fullWidth
            >
              عرض النتائج
            </Button>
          )}
        </Box>

        {assessment.completedAt && assessment.recommendations && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <AlertTitle>توصيات</AlertTitle>
            <List dense>
              {assessment.arabicRecommendations?.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

// Certificate Component
export const CertificateDisplay: React.FC<{
  certificate: Certificate;
  onDownload: () => void;
  onShare: () => void;
  onVerify: () => void;
}> = ({ certificate, onDownload, onShare, onVerify }) => {
  const [showVerification, setShowVerification] = useState(false);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: '#FFD700',
              width: 80,
              height: 80,
              mb: 2
            }}
          >
            <Certificate sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
            {certificate.arabicTitle}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {certificate.arabicDescription}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
            <Chip
              icon={<Star />}
              label={certificate.level}
              color="primary"
            />
            <Chip
              label={`${certificate.score} نقطة`}
              variant="outlined"
            />
          </Box>
          
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>التاريخ:</strong> {certificate.date.toLocaleDateString('ar')}
          </Typography>
          
          <Typography variant="body2">
            <strong>المعرف:</strong> {certificate.certificateId}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          المهارات المكتسبة:
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {certificate.arabicSkills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              variant="outlined"
              size="small"
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={onDownload}
          >
            تحميل الشهادة
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Share />}
            onClick={onShare}
          >
            مشاركة
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Visibility />}
            onClick={() => setShowVerification(true)}
          >
            التحقق
          </Button>
        </Box>

        <Dialog open={showVerification} onClose={() => setShowVerification(false)} maxWidth="sm" fullWidth>
          <DialogTitle>التحقق من الشهادة</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              للتحقق من صحة هذه الشهادة، استخدم الرابط التالي أو امسح الكود QR:
            </Typography>
            
            <Box sx={{ p: 2, bgcolor: '#F5F5F5', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {certificate.verificationUrl}
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ mt: 2 }}>
              أو قم بزيارة:
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'primary', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              onClick={() => window.open(certificate.verificationUrl, '_blank')}
            >
              {certificate.verificationUrl}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowVerification(false)}>إغلاق</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

// Learning Path Component
export const LearningPathProgress: React.FC<{
  path: LearningPath;
}> = ({ path }) => {
  const [activeStep, setActiveStep] = useState(0);

  const getStepIcon = (step: any) => {
    return step.completed ? <CheckCircle /> : <RadioButtonUnchecked />;
  };

  const getStepColor = (step: any) => {
    return step.completed ? '#4CAF50' : '#E0E0E0';
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
          🛤️ مسار التعلم: {path.arabicName}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {path.arabicDescription}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2">
              التقدم العام: {Math.round(path.progress)}%
            </Typography>
            <Typography variant="body2">
              {path.completedAssessments}/{path.totalAssessments} مكتمل
            </Typography>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={path.progress}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: '#E0E0E0',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
                borderRadius: 5
              }
            }}
          />
        </Box>

        <Stepper activeStep={activeStep} orientation="vertical">
          {path.milestones.map((milestone, index) => (
            <Step key={index} completed={milestone.completed}>
              <StepLabel
                optional={
                  <Typography variant="caption">
                    {milestone.completedAt && `أكتملت في ${new Date(milestone.completedAt).toLocaleDateString('ar')}`}
                  </Typography>
                }
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: getStepColor(milestone) }}>
                    {getStepIcon(milestone)}
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {milestone.arabicTitle}
                  </Typography>
                </Box>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary">
                  {milestone.arabicDescription}
                </Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 3, p: 2, bgcolor: '#F5F5F5', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            التقييم المتوقع:
          </Typography>
          <Typography variant="body2">
            متوسط الدرجات: {path.averageScore}/100
          </Typography>
          <Typography variant="body2">
            التاريخ المتوقع للإكمال: {path.estimatedCompletion.toLocaleDateString('ar')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Assessment Dashboard Component
export const AssessmentDashboard: React.FC<{
  assessments: Assessment[];
  certificates: Certificate[];
  learningPaths: LearningPath[];
}> = ({ assessments, certificates, learningPaths }) => {
  const [activeTab, setActiveTab] = useState(0);

  const getStats = () => {
    const completedAssessments = assessments.filter(a => a.completedAt).length;
    const passedAssessments = assessments.filter(a => a.completedAt && a.score! >= a.passingScore).length;
    const averageScore = assessments.filter(a => a.score).reduce((sum, a) => sum + a.score!, 0) / assessments.filter(a => a.score).length || 0;

    return {
      totalAssessments: assessments.length,
      completedAssessments,
      passedAssessments,
      averageScore: Math.round(averageScore),
      totalCertificates: certificates.length,
      activePaths: learningPaths.filter(p => p.progress < 100).length
    };
  };

  const stats = getStats();

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
          📊 لوحة التقييم والشهادات
        </Typography>

        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue as number)} sx={{ mb: 3 }}>
          <Tab label="الإحصائيات" />
          <Tab label="الاختبارات" />
          <Tab label="الشهادات" />
          <Tab label="مسارات التعلم" />
        </Tabs>

        {activeTab === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#2196F3' }}>
                  {stats.totalAssessments}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  إجمالي الاختبارات
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#4CAF50' }}>
                  {stats.completedAssessments}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  الاختبارات المكتملة
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#FF9800' }}>
                  {stats.passedAssessments}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  الاختبارات المجازة
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#9C27B0' }}>
                  {stats.averageScore}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  متوسط الدرجات
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#FFD700' }}>
                  {stats.totalCertificates}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  الشهادات المكتسبة
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <List>
            {assessments.map((assessment) => (
              <AssessmentCard
                key={assessment.id}
                assessment={assessment}
                onStart={() => {}}
                onRetake={() => {}}
                onViewResults={() => {}}
              />
            ))}
          </List>
        )}

        {activeTab === 2 && (
          <Grid container spacing={2}>
            {certificates.map((certificate) => (
              <Grid item xs={12} sm={6} md={4} key={certificate.id}>
                <CertificateDisplay
                  certificate={certificate}
                  onDownload={() => {}}
                  onShare={() => {}}
                  onVerify={() => {}}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 3 && (
          <List>
            {learningPaths.map((path) => (
              <LearningPathProgress key={path.id} path={path} />
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};
