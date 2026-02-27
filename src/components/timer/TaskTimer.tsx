// Task Timer Component
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Chip,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Fab,
  Grid,
  Switch,
  FormControlLabel,
  Slider,
  TextField,
  CircularProgress,
  Badge,
  Menu,
  MenuItem,
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
  Timer,
  Schedule,
  PlayArrow,
  Pause,
  Stop,
  Refresh,
  CheckCircle,
  Error,
  Warning,
  Info,
  Speed,
  AccessTime,
  Alarm,
  AlarmOn,
  AlarmOff,
  Notifications,
  NotificationsActive,
  NotificationsOff,
  Settings,
  Edit,
  Save,
  Cancel,
  Delete,
  Add,
  Remove,
  KeyboardArrowUp,
  KeyboardArrowDown,
  ExpandMore,
  ExpandLess,
  Fullscreen,
  FullscreenExit,
  VolumeUp,
  VolumeDown,
  VolumeOff,
  Headphones,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  ScreenShare,
  StopScreenShare,
  Bookmark,
  BookmarkBorder,
  Star,
  StarBorder,
  ThumbUp,
  ThumbDown,
  Comment,
  Share,
  Flag,
  FlagOutlined
} from '@mui/icons-material';

export interface TimerSession {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  arabicDescription: string;
  duration: number; // in seconds
  targetTime?: number; // target time in seconds
  category: 'study' | 'practice' | 'exercise' | 'break' | 'custom';
  type: 'countdown' | 'stopwatch' | 'pomodoro' | 'interval';
  settings: {
    allowPause: boolean;
    allowReset: boolean;
    showProgress: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    notificationEnabled: boolean;
    autoStart: boolean;
    loop: boolean;
    intervals?: number[]; // for interval training
  };
  status: 'idle' | 'running' | 'paused' | 'completed' | 'cancelled';
  startTime?: Date;
  endTime?: Date;
  pausedTime?: number;
  totalTime?: number;
  cycles?: number;
  currentCycle?: number;
  tags: string[];
  createdAt: Date;
  lastUsed?: Date;
}

export interface TimerHistory {
  id: string;
  sessionId: string;
  action: string;
  arabicAction: string;
  timestamp: Date;
  duration: number;
  completion: number; // percentage
  notes?: string;
  arabicNotes?: string;
}

export interface TimerSettings {
  defaultDuration: number;
  pomodoroWork: number;
  pomodoroBreak: number;
  longBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  notificationEnabled: boolean;
  tickSound: string;
  completionSound: string;
  warningSound: string;
  volume: number;
  showMilliseconds: boolean;
  darkMode: boolean;
  compactMode: boolean;
  alwaysOnTop: boolean;
  keyboardShortcuts: boolean;
}

// Timer Hook
export const useTaskTimer = () => {
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const [activeSession, setActiveSession] = useState<TimerSession | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [settings, setSettings] = useState<TimerSettings>({
    defaultDuration: 25 * 60, // 25 minutes
    pomodoroWork: 25 * 60,
    pomodoroBreak: 5 * 60,
    longBreak: 15 * 60,
    autoStartBreaks: true,
    autoStartWork: true,
    soundEnabled: true,
    vibrationEnabled: true,
    notificationEnabled: true,
    tickSound: 'tick',
    completionSound: 'completion',
    warningSound: 'warning',
    volume: 0.5,
    showMilliseconds: false,
    darkMode: false,
    compactMode: false,
    alwaysOnTop: false,
    keyboardShortcuts: true
  });
  const [history, setHistory] = useState<TimerHistory[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopTimerRef = useRef<() => void>(() => {});

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('timer_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Load sessions from localStorage
    const savedSessions = localStorage.getItem('timer_sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }

    // Load history from localStorage
    const savedHistory = localStorage.getItem('timer_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('timer_settings', JSON.stringify(settings));
  }, [settings]);

  const startTimer = useCallback((session?: TimerSession) => {
    const timerSession = session || activeSession;
    if (!timerSession) return;

    setIsRunning(true);
    setIsPaused(false);
    setActiveSession({
      ...timerSession,
      status: 'running',
      startTime: new Date(),
      pausedTime: 0
    });

    if (timerSession.type === 'countdown') {
      setTimeLeft(timerSession.duration);
    }

    // Start interval
    intervalRef.current = setInterval(() => {
      if (timerSession.type === 'countdown') {
        setTimeLeft(prev => {
          if (prev <= 0) {
            stopTimerRef.current();
            return 0;
          }
          return prev - 1;
        });
      } else if (timerSession.type === 'stopwatch') {
        // Update elapsed time
        setActiveSession(prev => {
          if (prev) {
            const elapsed = Date.now() - (prev.startTime?.getTime() || 0);
            return { ...prev, totalTime: elapsed };
          }
          return prev;
        });
      }
    }, 1000);
  }, [activeSession]);

  const pauseTimer = useCallback(() => {
    if (!activeSession || !activeSession.settings.allowPause) return;

    setIsPaused(true);
    setIsRunning(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setActiveSession(prev => {
      if (prev) {
        return {
          ...prev,
          status: 'paused',
          pausedTime: (prev.pausedTime || 0) + (Date.now() - (prev.startTime?.getTime() || 0))
        };
      }
      return prev;
    });
  }, [activeSession]);

  const resumeTimer = useCallback(() => {
    if (!activeSession || !isPaused) return;

    setIsRunning(true);
    setIsPaused(false);
    
    const pausedDuration = Date.now() - (activeSession.pausedTime || 0);
    
    setActiveSession(prev => {
      if (prev) {
        return {
          ...prev,
          status: 'running',
          startTime: new Date(Date.now() - pausedDuration),
          pausedTime: 0
        };
      }
      return prev;
    });

    startTimer(activeSession);
  }, [activeSession, isPaused, startTimer]);

  const stopTimer = useCallback(() => {
    if (!activeSession) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const finalSession = {
      ...activeSession,
      status: 'completed',
      endTime: new Date(),
      totalTime: activeSession.totalTime || (Date.now() - (activeSession.startTime?.getTime() || 0))
    };

    setActiveSession(finalSession);
    setIsRunning(false);
    setIsPaused(false);

    // Add to history
    const historyEntry: TimerHistory = {
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId: activeSession.id,
      action: 'Session completed',
      arabicAction: 'اكتملت الجلسة',
      timestamp: new Date(),
      duration: finalSession.totalTime || 0,
      completion: 100,
      notes: `${activeSession.arabicName} - ${Math.round((finalSession.totalTime || 0) / 60)} دقيقة`
    };

    const updatedHistory = [historyEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('timer_history', JSON.stringify(updatedHistory));

    // Play completion sound
    if (settings.soundEnabled) {
      const audio = new Audio(`/sounds/${settings.completionSound}.mp3`);
      audio.volume = settings.volume;
      audio.play().catch(e => console.log('Sound play failed:', e));
    }

    // Show notification
    if (settings.notificationEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Session completed', {
        body: 'اكتملت الجلسة',
        icon: '/favicon.ico',
        tag: 'timer'
      });
    }
  }, [activeSession, settings, history]);

  const resetTimer = useCallback(() => {
    if (!activeSession || !activeSession.settings.allowReset) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setActiveSession({
      ...activeSession,
      status: 'idle',
      startTime: undefined,
      pausedTime: 0,
      totalTime: 0
    });

    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(activeSession.duration);
  }, [activeSession]);

  useEffect(() => {
    stopTimerRef.current = stopTimer;
  }, [stopTimer]);

  const createSession = useCallback((sessionData: Omit<TimerSession, 'id' | 'createdAt'>) => {
    const newSession: TimerSession = {
      ...sessionData,
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      lastUsed: new Date()
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    localStorage.setItem('timer_sessions', JSON.stringify(updatedSessions));
    
    return newSession;
  }, [sessions]);

  const deleteSession = useCallback((sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    localStorage.setItem('timer_sessions', JSON.stringify(updatedSessions));
  }, [sessions]);

  const updateSettings = useCallback((newSettings: Partial<TimerSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };

  return {
    sessions,
    activeSession,
    timeLeft,
    isRunning,
    isPaused,
    settings,
    history,
    showSettings,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    createSession,
    deleteSession,
    updateSettings,
    formatTime
  };
};

// Timer Component
export const TaskTimerComponent: React.FC = () => {
  const {
    sessions,
    activeSession,
    timeLeft,
    isRunning,
    isPaused,
    settings,
    history,
    showSettings,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    createSession,
    deleteSession,
    updateSettings,
    formatTime
  } = useTaskTimer();

  const [selectedSession, setSelectedSession] = useState<TimerSession | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showSessionManager, setShowSessionManager] = useState(false);

  const presetSessions = [
    {
      name: 'Pomodoro',
      arabicName: 'بومودورو',
      description: '25 min work, 5 min break',
      arabicDescription: '25 دقيقة عمل، 5 دقيقة راحة',
      duration: 25 * 60,
      type: 'pomodoro' as const,
      category: 'study' as const,
      settings: {
        allowPause: true,
        allowReset: true,
        showProgress: true,
        soundEnabled: true,
        vibrationEnabled: true,
        notificationEnabled: true,
        autoStart: true,
        loop: false
      }
    },
    {
      name: 'Quick Study',
      arabicName: 'دراسة سريعة',
      description: '15 minutes focused study',
      arabicDescription: '15 دقيقة دراسة مركزة',
      duration: 15 * 60,
      type: 'countdown' as const,
      category: 'study' as const,
      settings: {
        allowPause: true,
        allowReset: true,
        showProgress: true,
        soundEnabled: true,
        vibrationEnabled: true,
        notificationEnabled: true,
        autoStart: false,
        loop: false
      }
    },
    {
      name: 'Exercise Timer',
      arabicName: 'مؤقت التمرين',
      description: '30 seconds intervals with 10 seconds rest',
      arabicDescription: '30 ثانية تدريب مع 10 ثانية راحة',
      duration: 30,
      type: 'interval' as const,
      category: 'exercise' as const,
      settings: {
        allowPause: true,
        allowReset: true,
        showProgress: true,
        soundEnabled: true,
        vibrationEnabled: true,
        notificationEnabled: true,
        autoStart: true,
        loop: true,
        intervals: [30, 10]
      }
    }
  ];

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'study': return <School />;
      case 'practice': return <Psychology />;
      case 'exercise': return <Timer />;
      case 'break': return <Schedule />;
      case 'custom': return <Settings />;
      default: return <Timer />;
    }
  };

  const getSessionColor = (category: string) => {
    switch (category) {
      case 'study': return '#4CAF50';
      case 'practice': return '#2196F3';
      case 'exercise': return '#FF9800';
      case 'break': return '#9C27B0';
      case 'custom': return '#607D8B';
      default: return '#9E9E9E';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, p: 0, overflow: 'hidden' }}>
        {/* Timer Display */}
        <Box sx={{ p: 3, bgcolor: '#F8F9FA', borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {activeSession && (
                <Avatar sx={{ bgcolor: getSessionColor(activeSession.category), color: 'white' }}>
                  {getSessionIcon(activeSession.type)}
                </Avatar>
              )}
              
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  {activeSession ? activeSession.arabicName : 'اختر جلسة'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {activeSession ? activeSession.arabicDescription : 'ابدأ مؤقت لجلسة جديدة'}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, fontFamily: 'monospace', minWidth: 120 }}>
                {activeSession ? formatTime(timeLeft) : '00:00:00'}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {!isRunning && !isPaused && activeSession && (
                  <IconButton
                    onClick={() => startTimer(activeSession)}
                    color="primary"
                    sx={{ bgcolor: '#4CAF50', color: 'white' }}
                  >
                    <PlayArrow />
                  </IconButton>
                )}
                
                {isRunning && !isPaused && (
                  <IconButton
                    onClick={pauseTimer}
                    color="warning"
                    sx={{ bgcolor: '#FF9800', color: 'white' }}
                  >
                    <Pause />
                  </IconButton>
                )}
                
                {isPaused && (
                  <IconButton
                    onClick={resumeTimer}
                    color="success"
                    sx={{ bgcolor: '#4CAF50', color: 'white' }}
                  >
                    <PlayArrow />
                  </IconButton>
                )}
                
                {activeSession && (
                  <>
                    <IconButton
                      onClick={resetTimer}
                      color="default"
                    >
                      <Refresh />
                    </IconButton>
                    <IconButton
                      onClick={stopTimer}
                      color="error"
                      sx={{ bgcolor: '#F44336', color: 'white' }}
                    >
                      <Stop />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={() => setShowSessionManager(!showSessionManager)}>
                <List />
              </IconButton>
              <IconButton onClick={() => setShowHistory(!showHistory)}>
                <History />
              </IconButton>
              <IconButton onClick={() => setShowSettings(!showSettings)}>
                <Settings />
              </IconButton>
            </Box>
          </Box>
          
          {activeSession && activeSession.settings.showProgress && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={((activeSession.duration - timeLeft) / activeSession.duration) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" sx={{ mt: 0.5 }}>
                {Math.round(((activeSession.duration - timeLeft) / activeSession.duration) * 100)}% مكتمل
              </Typography>
            </Box>
          )}
        </Box>

        {/* Quick Sessions */}
        <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
            ⏱️ الجلسات السريعة
          </Typography>
          
          <Grid container spacing={2}>
            {presetSessions.map((session, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: selectedSession?.id === session.id ? '2px solid #2196F3' : '1px solid #E0E0E0',
                    bgcolor: selectedSession?.id === session.id ? '#E3F2FD' : 'white',
                    '&:hover': { bgcolor: '#F5F5F5', transform: 'translateY(-2px)' }
                  }}
                  onClick={() => {
                    const newSession = createSession(session);
                    setSelectedSession(newSession);
                    setActiveSession(newSession);
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Avatar sx={{ bgcolor: getSessionColor(session.category), color: 'white' }}>
                      {getSessionIcon(session.type)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {session.arabicName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {session.arabicDescription}
                      </Typography>
                    </Box>
                    
                    <Chip
                      size="small"
                      label={formatTime(session.duration)}
                      color="default"
                    />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
