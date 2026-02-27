// Integration Service - Connect Assessment System with Certificates
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
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
  TimelineOppositeContent
} from '@mui/material';
import {
  Assessment,
  CheckCircle,
  School,
  EmojiEvents,
  MilitaryTech,
  WorkspacePremium,
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
  Download,
  Share,
  Visibility,
  GetApp,
  Refresh,
  Star,
  Timeline,
  AutoAwesome,
  Lightbulb
} from '@mui/icons-material';
import { type Assessment, type Certificate, type LearningPath } from './AssessmentSystem';

export interface AssessmentCertificateIntegration {
  assessmentId: string;
  certificateId: string;
  userId: string;
  issuedAt: Date;
  expiresAt?: Date;
  verificationCode: string;
  status: 'pending' | 'issued' | 'expired' | 'revoked';
}

export interface UserProgress {
  userId: string;
  totalAssessments: number;
  completedAssessments: number;
  averageScore: number;
  highestScore: number;
  currentLevel: string;
  totalCertificates: number;
  activeLearningPaths: number;
  completedLearningPaths: number;
  studyStreak: number;
  totalStudyHours: number;
  lastActivity: Date;
  achievements: string[];
}

// Integration Component
export const AssessmentCertificateIntegration: React.FC<{
  userId: string;
  assessments: Assessment[];
  certificates: Certificate[];
  learningPaths: LearningPath[];
  onAssessmentComplete: (assessmentId: string, result: any) => void;
  onCertificateIssued: (certificate: Certificate) => void;
}> = ({
  userId,
  assessments,
  certificates,
  learningPaths,
  onAssessmentComplete,
  onCertificateIssued
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [pendingCertificates, setPendingCertificates] = useState<AssessmentCertificateIntegration[]>([]);
  const [showCertificatePreview, setShowCertificatePreview] = useState<Certificate | null>(null);

  // Calculate user progress
  useEffect(() => {
    const completedAssessments = assessments.filter(a => a.completedAt);
    const averageScore = completedAssessments.reduce((sum, a) => sum + (a.score || 0), 0) / completedAssessments.length || 0;
    const highestScore = Math.max(...completedAssessments.map(a => a.score || 0));
    
    const progress: UserProgress = {
      userId,
      totalAssessments: assessments.length,
      completedAssessments: completedAssessments.length,
      averageScore: Math.round(averageScore),
      highestScore,
      currentLevel: determineUserLevel(averageScore),
      totalCertificates: certificates.length,
      activeLearningPaths: learningPaths.filter(p => p.progress < 100).length,
      completedLearningPaths: learningPaths.filter(p => p.progress >= 100).length,
      studyStreak: calculateStudyStreak(assessments),
      totalStudyHours: calculateStudyHours(assessments),
      lastActivity: new Date(),
      achievements: generateAchievements(completedAssessments, certificates)
    };
    
    setUserProgress(progress);
    
    // Check for pending certificates
    const pending: AssessmentCertificateIntegration[] = [];
    completedAssessments.forEach(assessment => {
      if (assessment.score && assessment.score >= assessment.passingScore) {
        const hasCertificate = certificates.some(cert => cert.metadata?.courseName === assessment.title);
        if (!hasCertificate) {
          pending.push({
            assessmentId: assessment.id,
            certificateId: `cert_${assessment.id}_${Date.now()}`,
            userId,
            issuedAt: new Date(),
            status: 'pending',
            verificationCode: generateVerificationCode()
          });
        }
      }
    });
    setPendingCertificates(pending);
  }, [userId, assessments, certificates, learningPaths]);

  const determineUserLevel = (averageScore: number): string => {
    if (averageScore >= 90) return 'B2';
    if (averageScore >= 80) return 'B1';
    if (averageScore >= 70) return 'A2';
    if (averageScore >= 60) return 'A1';
    return 'Beginner';
  };

  const calculateStudyStreak = (assessments: Assessment[]): number => {
    // Simple streak calculation based on recent activity
    const today = new Date();
    const recentAssessments = assessments.filter(a => {
      const daysDiff = (today.getTime() - new Date(a.completedAt || today).getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });
    return recentAssessments.length;
  };

  const calculateStudyHours = (assessments: Assessment[]): number => {
    // Estimate study hours based on completed assessments
    const completedAssessments = assessments.filter(a => a.completedAt);
    return completedAssessments.length * 2; // Assume 2 hours per assessment
  };

  const generateAchievements = (completedAssessments: Assessment[], certificates: Certificate[]): string[] => {
    const achievements = [];
    
    if (completedAssessments.length >= 1) achievements.push('First Assessment');
    if (completedAssessments.length >= 5) achievements.push('Assessment Enthusiast');
    if (completedAssessments.length >= 10) achievements.push('Assessment Master');
    if (certificates.length >= 1) achievements.push('First Certificate');
    if (certificates.length >= 5) achievements.push('Certificate Collector');
    
    const perfectScores = completedAssessments.filter(a => a.score && a.score >= 95);
    if (perfectScores.length >= 1) achievements.push('Perfect Score');
    if (perfectScores.length >= 3) achievements.push('Consistent Excellence');
    
    return achievements;
  };

  const generateVerificationCode = (): string => {
    return 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const issueCertificate = (pendingCert: AssessmentCertificateIntegration) => {
    const assessment = assessments.find(a => a.id === pendingCert.assessmentId);
    if (!assessment) return;

    const certificate: Certificate = {
      id: pendingCert.certificateId,
      userId,
      type: 'completion',
      title: `${assessment.title} Certificate`,
      arabicTitle: `شهادة ${assessment.arabicTitle}`,
      description: `Successfully completed ${assessment.title} with score ${assessment.score}`,
      arabicDescription: `أكمل بنجاح ${assessment.arabicTitle} بدرجة ${assessment.score}`,
      level: assessment.difficulty,
      score: assessment.score || 0,
      date: new Date(),
      issuer: 'Smart English Grade 4',
      certificateId: pendingCert.verificationCode,
      verificationUrl: `https://smart-english.com/verify/${pendingCert.verificationCode}`,
      shareUrl: `https://smart-english.com/share/${pendingCert.certificateId}`,
      downloadUrl: `https://smart-english.com/download/${pendingCert.certificateId}`,
      skills: extractSkillsFromAssessment(assessment),
      arabicSkills: extractArabicSkillsFromAssessment(assessment),
      metadata: {
        courseName: assessment.title,
        arabicCourseName: assessment.arabicTitle,
        instructor: 'AI Tutor',
        arabicInstructor: 'المعلم الذكي',
        duration: `${assessment.duration} minutes`,
        arabicDuration: `${assessment.duration} دقيقة`
      }
    };

    onCertificateIssued(certificate);
    
    // Update pending status
    setPendingCertificates(prev => 
      prev.map(cert => 
        cert.id === pendingCert.id 
          ? { ...cert, status: 'issued' as const }
          : cert
      )
    );
  };

  const extractSkillsFromAssessment = (assessment: Assessment): string[] => {
    const skills = [];
    
    switch (assessment.category) {
      case 'grammar':
        skills.push('Grammar', 'Sentence Structure', 'Verb Tenses');
        break;
      case 'vocabulary':
        skills.push('Vocabulary', 'Word Usage', 'Context Understanding');
        break;
      case 'listening':
        skills.push('Listening Comprehension', 'Audio Analysis', 'Note Taking');
        break;
      case 'reading':
        skills.push('Reading Comprehension', 'Text Analysis', 'Critical Thinking');
        break;
      case 'speaking':
        skills.push('Speaking', 'Pronunciation', 'Oral Communication');
        break;
    }
    
    return skills;
  };

  const extractArabicSkillsFromAssessment = (assessment: Assessment): string[] => {
    const skills = [];
    
    switch (assessment.category) {
      case 'grammar':
        skills.push('القواعد', 'بناء الجمل', 'أزمنة الأفعال');
        break;
      case 'vocabulary':
        skills.push('المفردات', 'استخدام الكلمات', 'الفهم السياقي');
        break;
      case 'listening':
        skills.push('الفهم الاستماعي', 'تحليل الصوت', 'أخذ الملاحظات');
        break;
      case 'reading':
        skills.push('الفهم القرائي', 'تحليل النص', 'التفكير النقدي');
        break;
      case 'speaking':
        skills.push('التحدث', 'النطق', 'التواصل الشفهي');
        break;
    }
    
    return skills;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A1': return '#4CAF50';
      case 'A2': return '#8BC34A';
      case 'B1': return '#FF9800';
      case 'B2': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, p: 0, overflow: 'hidden' }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue as number)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="نظرة عامة" />
          <Tab label="الشهادات المعلقة" />
          <Tab label="مسار التعلم" />
          <Tab label="الإنجازات" />
        </Tabs>

        {activeTab === 0 && userProgress && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
              📊 نظرة عامة على تقدمك
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#E3F2FD' }}>
                  <Avatar sx={{ bgcolor: '#2196F3', width: 60, height: 60, mb: 1 }}>
                    <Assessment />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>
                    {userProgress.completedAssessments}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    اختبار مكتمل
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#E8F5E8' }}>
                  <Avatar sx={{ bgcolor: '#4CAF50', width: 60, height: 60, mb: 1 }}>
                    <TrendingUp />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>
                    {userProgress.averageScore}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    متوسط الدرجات
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#FFF3E0' }}>
                  <Avatar sx={{ bgcolor: '#FF9800', width: 60, height: 60, mb: 1 }}>
                    <EmojiEvents />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>
                    {userProgress.totalCertificates}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    شهادة مكتسبة
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#F3E5F5' }}>
                  <Avatar sx={{ bgcolor: getLevelColor(userProgress.currentLevel), width: 60, height: 60, mb: 1 }}>
                    <School />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>
                    {userProgress.currentLevel}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    المستوى الحالي
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                🏆 الإنجازات
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {userProgress.achievements.map((achievement, index) => (
                  <Chip
                    key={index}
                    label={achievement}
                    color="primary"
                    variant="outlined"
                    icon={<Star />}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
              📜 الشهادات المعلقة
            </Typography>
            
            {pendingCertificates.length === 0 ? (
              <Alert severity="info">
                <AlertTitle>لا توجد شهادات معلقة</AlertTitle>
                جميع الشهادات المتاحة تم إصدارها بنجاح.
              </Alert>
            ) : (
              <List>
                {pendingCertificates.map((cert, index) => {
                  const assessment = assessments.find(a => a.id === cert.assessmentId);
                  return (
                    <ListItem key={index} sx={{ mb: 2 }}>
                      <Paper sx={{ p: 2, width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ bgcolor: '#FFD700' }}>
                              <Certificate />
                            </Avatar>
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {assessment?.arabicTitle}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                الدرجة: {assessment?.score}/{assessment?.maxScore}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Chip
                            label={cert.status === 'pending' ? 'معلقة' : 'صادرة'}
                            color={cert.status === 'pending' ? 'warning' : 'success'}
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          رمز التحقق: {cert.verificationCode}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            startIcon={<CheckCircle />}
                            onClick={() => issueCertificate(cert)}
                            disabled={cert.status === 'issued'}
                          >
                            إصدار الشهادة
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<Visibility />}
                            onClick={() => setShowCertificatePreview(assessment)}
                          >
                            معاينة
                          </Button>
                        </Box>
                      </Paper>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Box>
        )}

        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
              🛤️ مسار التعلم
            </Typography>
            
            <Timeline>
              {learningPaths.map((path, index) => (
                <TimelineItem key={index}>
                  <TimelineOppositeContent sx={{ m: 'auto 0' }}>
                    <Typography variant="body2" color="text.secondary">
                      {path.estimatedCompletion.toLocaleDateString('ar')}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineDot color={path.progress >= 100 ? 'success' : 'primary'} />
                  <TimelineContent>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {path.arabicName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {path.arabicDescription}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={path.progress}
                      sx={{ mt: 1 }}
                    />
                    <Typography variant="caption" sx={{ mt: 0.5 }}>
                      {path.progress}% مكتمل • {path.completedAssessments}/{path.totalAssessments} تقييم
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Box>
        )}

        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
              🏆 جميع الإنجازات
            </Typography>
            
            <Grid container spacing={2}>
              {[
                { name: 'أول اختبار', icon: <GetApp />, achieved: userProgress?.achievements.includes('First Assessment') },
                { name: 'جامع الشهادات', icon: <WorkspacePremium />, achieved: userProgress?.achievements.includes('Certificate Collector') },
                { name: 'خبير التقييم', icon: <Assessment />, achieved: userProgress?.achievements.includes('Assessment Master') },
                { name: 'درجة مثالية', icon: <Star />, achieved: userProgress?.achievements.includes('Perfect Score') }
              ].map((achievement, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    opacity: achievement.achieved ? 1 : 0.5,
                    border: achievement.achieved ? '2px solid #4CAF50' : '2px solid #E0E0E0'
                  }}>
                    <Avatar sx={{ 
                      bgcolor: achievement.achieved ? '#4CAF50' : '#9E9E9E',
                      width: 50,
                      height: 50,
                      mb: 1
                    }}>
                      {achievement.icon}
                    </Avatar>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {achievement.name}
                    </Typography>
                    {achievement.achieved && (
                      <Chip
                        label="مكتسب"
                        color="success"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
