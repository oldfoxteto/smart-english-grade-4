// Progress Tracking Dashboard - Advanced Analytics Dashboard
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  LinearProgress,
  CircularProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tabs,
  Tab,
  Button,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Badge,
  Fab,
  Drawer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  TrendingUp,
  TrendingDown,
  Timeline as TimelineIcon,
  Assessment,
  Speed,
  Memory,
  Psychology,
  School,
  EmojiEvents,
  Star,
  StarBorder,
  FilterList,
  Download,
  Upload,
  Refresh,
  Settings,
  Info,
  Warning,
  Error,
  CheckCircle,
  Schedule,
  Today,
  DateRange,
  CalendarToday,
  BarChart,
  PieChart,
  LineChart,
  ScatterPlot,
  Radar,
  DonutLarge,
  ShowChart,
  Analytics,
  Insights,
  Leaderboard,
  MilitaryTech,
  WorkspacePremium,
  Extension,
  ExtensionOff,
  Notifications,
  NotificationsOff,
  Visibility,
  VisibilityOff,
  Fullscreen,
  FullscreenExit,
  ZoomIn,
  ZoomOut,
  Search,
  Clear,
  Sort,
  SortByAlpha,
  SortByNumeric,
  FilterAlt,
  FilterListOff,
  ViewList,
  ViewModule,
  ViewQuilt,
  ViewColumn,
  ViewComfy,
  ViewCompact,
  ViewWeek,
  ViewDay,
  ViewAgenda,
  ViewCarousel,
  ViewStream,
  Dashboard,
  DashboardCustomize,
  QueryStats,
  Summarize,
  FactCheck,
  DataThresholding,
  DataUsage,
  DataArray,
  DataObject,
  DataExploration,
  DataSaverOn,
  DataSaverOff,
  Storage,
  CloudUpload,
  CloudDownload,
  CloudSync,
  CloudDone,
  CloudQueue,
  CloudOff,
  CloudCircle,
  Cloud,
  CloudQueue as CloudQueueIcon,
} from '@mui/icons-material';

// Progress Data Types
interface ProgressData {
  studentId: string;
  studentName: string;
  overallProgress: number;
  weeklyProgress: number;
  monthlyProgress: number;
  skills: {
    vocabulary: number;
    grammar: number;
    pronunciation: number;
    conversation: number;
    listening: number;
    reading: number;
    writing: number;
  };
  achievements: Achievement[];
  streak: number;
  totalStudyTime: number;
  averageScore: number;
  lastActive: Date;
  goals: Goal[];
  weakAreas: string[];
  strongAreas: string[];
  recommendations: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
  category: 'vocabulary' | 'grammar' | 'pronunciation' | 'conversation' | 'general';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  deadline: Date;
  category: string;
  completed: boolean;
}

interface AnalyticsData {
  totalStudents: number;
  averageProgress: number;
  topPerformers: ProgressData[];
  strugglingStudents: ProgressData[];
  skillDistribution: {
    [key: string]: number;
  };
  timeDistribution: {
    [key: string]: number;
  };
  achievementStats: {
    totalEarned: number;
    mostCommon: string;
    rarest: string;
  };
  engagementMetrics: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionDuration: number;
    retentionRate: number;
  };
}

const ProgressTrackingDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterEnabled, setFilterEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'progress' | 'name' | 'streak'>('progress');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock data generation
  useEffect(() => {
    const generateMockData = () => {
      const mockProgressData: ProgressData[] = Array.from({ length: 50 }, (_, i) => ({
        studentId: `student-${i + 1}`,
        studentName: `Student ${i + 1}`,
        overallProgress: Math.floor(Math.random() * 100),
        weeklyProgress: Math.floor(Math.random() * 30),
        monthlyProgress: Math.floor(Math.random() * 60),
        skills: {
          vocabulary: Math.floor(Math.random() * 100),
          grammar: Math.floor(Math.random() * 100),
          pronunciation: Math.floor(Math.random() * 100),
          conversation: Math.floor(Math.random() * 100),
          listening: Math.floor(Math.random() * 100),
          reading: Math.floor(Math.random() * 100),
          writing: Math.floor(Math.random() * 100),
        },
        achievements: Array.from({ length: Math.floor(Math.random() * 10) }, (_, j) => ({
          id: `achievement-${j}`,
          title: `Achievement ${j + 1}`,
          description: `Description for achievement ${j + 1}`,
          icon: '🏆',
          earnedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          category: ['vocabulary', 'grammar', 'pronunciation', 'conversation', 'general'][Math.floor(Math.random() * 5)] as any,
          rarity: ['common', 'rare', 'epic', 'legendary'][Math.floor(Math.random() * 4)] as any,
          points: Math.floor(Math.random() * 100) + 10,
        })),
        streak: Math.floor(Math.random() * 30),
        totalStudyTime: Math.floor(Math.random() * 1000),
        averageScore: Math.floor(Math.random() * 100),
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        goals: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
          id: `goal-${j}`,
          title: `Goal ${j + 1}`,
          description: `Description for goal ${j + 1}`,
          target: Math.floor(Math.random() * 100) + 50,
          current: Math.floor(Math.random() * 100),
          deadline: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
          category: 'general',
          completed: Math.random() > 0.5,
        })),
        weakAreas: ['vocabulary', 'grammar', 'pronunciation'].slice(0, Math.floor(Math.random() * 3) + 1),
        strongAreas: ['conversation', 'listening', 'reading'].slice(0, Math.floor(Math.random() * 3) + 1),
        recommendations: [
          'Practice more vocabulary exercises',
          'Focus on pronunciation drills',
          'Join conversation practice sessions',
          'Review grammar rules',
          'Read more English texts',
        ].slice(0, Math.floor(Math.random() * 3) + 1),
      }));

      const mockAnalyticsData: AnalyticsData = {
        totalStudents: mockProgressData.length,
        averageProgress: mockProgressData.reduce((sum, student) => sum + student.overallProgress, 0) / mockProgressData.length,
        topPerformers: mockProgressData.sort((a, b) => b.overallProgress - a.overallProgress).slice(0, 10),
        strugglingStudents: mockProgressData.sort((a, b) => a.overallProgress - b.overallProgress).slice(0, 10),
        skillDistribution: {
          vocabulary: mockProgressData.reduce((sum, student) => sum + student.skills.vocabulary, 0) / mockProgressData.length,
          grammar: mockProgressData.reduce((sum, student) => sum + student.skills.grammar, 0) / mockProgressData.length,
          pronunciation: mockProgressData.reduce((sum, student) => sum + student.skills.pronunciation, 0) / mockProgressData.length,
          conversation: mockProgressData.reduce((sum, student) => sum + student.skills.conversation, 0) / mockProgressData.length,
          listening: mockProgressData.reduce((sum, student) => sum + student.skills.listening, 0) / mockProgressData.length,
          reading: mockProgressData.reduce((sum, student) => sum + student.skills.reading, 0) / mockProgressData.length,
          writing: mockProgressData.reduce((sum, student) => sum + student.skills.writing, 0) / mockProgressData.length,
        },
        timeDistribution: {
          morning: Math.floor(Math.random() * 100),
          afternoon: Math.floor(Math.random() * 100),
          evening: Math.floor(Math.random() * 100),
          night: Math.floor(Math.random() * 100),
        },
        achievementStats: {
          totalEarned: mockProgressData.reduce((sum, student) => sum + student.achievements.length, 0),
          mostCommon: 'Vocabulary Master',
          rarest: 'Legendary Speaker',
        },
        engagementMetrics: {
          dailyActiveUsers: Math.floor(mockProgressData.length * 0.7),
          weeklyActiveUsers: Math.floor(mockProgressData.length * 0.85),
          monthlyActiveUsers: mockProgressData.length,
          averageSessionDuration: Math.floor(Math.random() * 60) + 20,
          retentionRate: Math.floor(Math.random() * 30) + 70,
        },
      };

      setProgressData(mockProgressData);
      setAnalyticsData(mockAnalyticsData);
      setLoading(false);
    };

    generateMockData();
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Refresh data
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Filter and sort progress data
  const filteredAndSortedData = useMemo(() => {
    let filtered = progressData;

    // Apply skill filter
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(student => 
        selectedSkills.some(skill => student.skills[skill as keyof typeof student.skills] > 70)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'progress':
          comparison = a.overallProgress - b.overallProgress;
          break;
        case 'name':
          comparison = a.studentName.localeCompare(b.studentName);
          break;
        case 'streak':
          comparison = a.streak - b.streak;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [progressData, selectedSkills, sortBy, sortOrder]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!analyticsData) return null;

    return {
      totalProgress: filteredAndSortedData.reduce((sum, student) => sum + student.overallProgress, 0),
      averageProgress: filteredAndSortedData.reduce((sum, student) => sum + student.overallProgress, 0) / filteredAndSortedData.length,
      topSkill: Object.entries(analyticsData.skillDistribution).reduce((a, b) => a[1] > b[1] ? a : b)[0],
      improvementRate: Math.floor(Math.random() * 20) + 5, // Mock improvement rate
      engagementScore: Math.floor(Math.random() * 30) + 70, // Mock engagement score
    };
  }, [filteredAndSortedData, analyticsData]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSortChange = (newSortBy: 'progress' | 'name' | 'streak') => {
    if (sortBy === newSortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const getSkillColor = (value: number) => {
    if (value >= 80) return 'success';
    if (value >= 60) return 'warning';
    return 'error';
  };

  const getProgressColor = (value: number) => {
    if (value >= 90) return '#4caf50';
    if (value >= 75) return '#2196f3';
    if (value >= 60) return '#ff9800';
    if (value >= 40) return '#f44336';
    return '#9e9e9e';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Header */}
      <Paper sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            📊 Progress Tracking Dashboard
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Auto Refresh">
              <IconButton onClick={() => setAutoRefresh(!autoRefresh)} color={autoRefresh ? 'primary' : 'default'}>
                {autoRefresh ? <CloudSync /> : <CloudOff />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Fullscreen">
              <IconButton onClick={() => setFullscreen(!fullscreen)}>
                {fullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Settings">
              <IconButton>
                <Settings />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Statistics Cards */}
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {analyticsData?.totalStudents || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Students
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <School />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {statistics?.averageProgress.toFixed(1) || 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Progress
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <TrendingUp />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                      {statistics?.improvementRate || 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Improvement Rate
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <Speed />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                      {statistics?.engagementScore || 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Engagement Score
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <Psychology />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 2 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Overview" icon={<Dashboard />} />
          <Tab label="Student Progress" icon={<Assessment />} />
          <Tab label="Skills Analysis" icon={<BarChart />} />
          <Tab label="Achievements" icon={<EmojiEvents />} />
          <Tab label="Analytics" icon={<Analytics />} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {selectedTab === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Recent Activity
                  </Typography>
                  <Timeline>
                    {filteredAndSortedData.slice(0, 5).map((student, index) => (
                      <TimelineItem key={student.studentId}>
                        <TimelineDot color={getSkillColor(student.overallProgress)} />
                        <TimelineContent>
                          <Typography variant="h6">{student.studentName}</Typography>
                          <Typography variant="body2">
                            Progress: {student.overallProgress}% | Streak: {student.streak} days
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Last active: {student.lastActive.toLocaleDateString()}
                          </Typography>
                        </TimelineContent>
                        {index < 4 && <TimelineSeparator />}
                      </TimelineItem>
                    ))}
                  </Timeline>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Skill Distribution
                  </Typography>
                  {analyticsData && Object.entries(analyticsData.skillDistribution).map(([skill, value]) => (
                    <Box key={skill} sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {skill.charAt(0).toUpperCase() + skill.slice(1)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={value}
                        color={getSkillColor(value)}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {value.toFixed(1)}%
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {selectedTab === 1 && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Student Progress
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <FormControl size="small">
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value as any)}
                      label="Sort By"
                    >
                      <MenuItem value="progress">Progress</MenuItem>
                      <MenuItem value="name">Name</MenuItem>
                      <MenuItem value="streak">Streak</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Tooltip title="Toggle Filter">
                    <IconButton onClick={() => setFilterEnabled(!filterEnabled)} color={filterEnabled ? 'primary' : 'default'}>
                      <FilterList />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              {filterEnabled && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Filter by Skills:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {Object.keys(filteredAndSortedData[0]?.skills || {}).map(skill => (
                      <Chip
                        key={skill}
                        label={skill.charAt(0).toUpperCase() + skill.slice(1)}
                        color={selectedSkills.includes(skill) ? 'primary' : 'default'}
                        onClick={() => handleSkillToggle(skill)}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Progress</TableCell>
                      <TableCell>Skills</TableCell>
                      <TableCell>Streak</TableCell>
                      <TableCell>Achievements</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAndSortedData.map((student) => (
                      <TableRow key={student.studentId}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {student.studentName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2">{student.studentName}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {student.lastActive.toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={student.overallProgress}
                              sx={{ width: 100, height: 8, borderRadius: 4 }}
                              style={{ backgroundColor: getProgressColor(student.overallProgress) }}
                            />
                            <Typography variant="body2">
                              {student.overallProgress}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {Object.entries(student.skills).map(([skill, value]) => (
                              <Tooltip key={skill} title={`${skill}: ${value}%`}>
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: getProgressColor(value),
                                  }}
                                />
                              </Tooltip>
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<LocalFireDepartment />}
                            label={`${student.streak} days`}
                            size="small"
                            color={student.streak > 7 ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Badge badgeContent={student.achievements.length} color="primary">
                            <EmojiEvents />
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => setSelectedStudent(student.studentId)}>
                            <Info />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {selectedTab === 2 && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Skills Performance
                  </Typography>
                  {analyticsData && Object.entries(analyticsData.skillDistribution).map(([skill, value]) => (
                    <Box key={skill} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          {skill.charAt(0).toUpperCase() + skill.slice(1)}
                        </Typography>
                        <Typography variant="body2">
                          {value.toFixed(1)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={value}
                        color={getSkillColor(value)}
                        sx={{ height: 12, borderRadius: 6 }}
                      />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Weak Areas Analysis
                  </Typography>
                  <List>
                    {filteredAndSortedData
                      .flatMap(student => student.weakAreas)
                      .reduce((acc, area) => {
                        const existing = acc.find(item => item.area === area);
                        if (existing) {
                          existing.count++;
                        } else {
                          acc.push({ area, count: 1 });
                        }
                        return acc;
                      }, [] as { area: string; count: number }[])
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 5)
                      .map((item, index) => (
                        <ListItem key={item.area}>
                          <ListItemIcon>
                            <Warning color="error" />
                          </ListItemIcon>
                          <ListItemText
                            primary={item.area.charAt(0).toUpperCase() + item.area.slice(1)}
                            secondary={`${item.count} students need help`}
                          />
                        </ListItem>
                      ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {selectedTab === 3 && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Achievement Statistics
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      Total Achievements Earned: {analyticsData?.achievementStats.totalEarned}
                    </Typography>
                    <Typography variant="body2">
                      Most Common: {analyticsData?.achievementStats.mostCommon}
                    </Typography>
                    <Typography variant="body2">
                      Rarest: {analyticsData?.achievementStats.rarest}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Top Achievers
                  </Typography>
                  <List>
                    {filteredAndSortedData
                      .sort((a, b) => b.achievements.length - a.achievements.length)
                      .slice(0, 5)
                      .map((student) => (
                        <ListItem key={student.studentId}>
                          <ListItemIcon>
                            <MilitaryTech color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={student.studentName}
                            secondary={`${student.achievements.length} achievements`}
                          />
                        </ListItem>
                      ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {selectedTab === 4 && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Engagement Metrics
                  </Typography>
                  {analyticsData && (
                    <Box>
                      <Typography variant="body2">
                        Daily Active Users: {analyticsData.engagementMetrics.dailyActiveUsers}
                      </Typography>
                      <Typography variant="body2">
                        Weekly Active Users: {analyticsData.engagementMetrics.weeklyActiveUsers}
                      </Typography>
                      <Typography variant="body2">
                        Monthly Active Users: {analyticsData.engagementMetrics.monthlyActiveUsers}
                      </Typography>
                      <Typography variant="body2">
                        Average Session Duration: {analyticsData.engagementMetrics.averageSessionDuration} min
                      </Typography>
                      <Typography variant="body2">
                        Retention Rate: {analyticsData.engagementMetrics.retentionRate}%
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Time Distribution
                  </Typography>
                  {analyticsData && Object.entries(analyticsData.timeDistribution).map(([period, value]) => (
                    <Box key={period} sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={value}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {value} students
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default ProgressTrackingDashboard;
