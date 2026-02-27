// Enhanced Notification System with Visual Effects and Sound
import React, { useState, useEffect, useCallback } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Box,
  Typography,
  Slide,
  Fade,
  Grow,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip,
  Paper,
  Divider
} from '@mui/material';
import {
  Close,
  CheckCircle,
  Error,
  Warning,
  Info,
  Celebration,
  EmojiEvents,
  Star,
  LocalFireDepartment,
  NotificationsActive,
  VolumeUp,
  VolumeOff,
  Settings,
  Delete,
  MarkEmailRead,
  PriorityHigh,
  Lightbulb
} from '@mui/icons-material';
import { playSuccess, playWrong, playLevelUp, playStar, playClick } from '../../core/sounds';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'achievement' | 'level_up' | 'streak' | 'reminder';
  title: string;
  arabicTitle: string;
  message: string;
  arabicMessage: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  xpReward?: number;
  badgeId?: string;
  actionUrl?: string;
  autoHide?: boolean;
  sound?: boolean;
  animation?: 'slide' | 'fade' | 'grow' | 'bounce';
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  desktop: boolean;
  autoHide: boolean;
  autoHideDelay: number;
  types: {
    success: boolean;
    error: boolean;
    warning: boolean;
    info: boolean;
    achievement: boolean;
    level_up: boolean;
    streak: boolean;
    reminder: boolean;
  };
}

// Notification Context
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    sound: true,
    vibration: true,
    desktop: true,
    autoHide: true,
    autoHideDelay: 5000,
    types: {
      success: true,
      error: true,
      warning: true,
      info: true,
      achievement: true,
      level_up: true,
      streak: true,
      reminder: true
    }
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('notification_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('notification_settings', JSON.stringify(settings));
  }, [settings]);

  // Calculate unread count
  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Request notification permissions
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const createNotification = useCallback((
    type: Notification['type'],
    title: string,
    arabicTitle: string,
    message: string,
    arabicMessage: string,
    options: Partial<Notification> = {}
  ) => {
    if (!settings.enabled || !settings.types[type]) return;

    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      arabicTitle,
      message,
      arabicMessage,
      timestamp: new Date(),
      read: false,
      priority: options.priority || 'medium',
      autoHide: options.autoHide !== false,
      sound: options.sound !== false,
      animation: options.animation || 'slide',
      ...options
    };

    // Add to notifications list
    setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50

    // Show current notification
    setCurrentNotification(notification);

    // Play sound
    if (settings.sound && notification.sound) {
      playNotificationSound(type);
    }

    // Vibration
    if (settings.vibration && 'vibrate' in navigator) {
      navigator.vibrate(type === 'achievement' || type === 'level_up' ? [200, 100, 200] : 200);
    }

    // Desktop notification
    if (settings.desktop && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: getNotificationIcon(type),
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: type === 'error' || type === 'warning'
      });
    }

    // Auto hide
    if (notification.autoHide && settings.autoHide) {
      setTimeout(() => {
        setCurrentNotification(null);
      }, settings.autoHideDelay);
    }
  }, [settings]);

  const playNotificationSound = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        playSuccess();
        break;
      case 'achievement':
        playLevelUp();
        playStar();
        break;
      case 'level_up':
        playLevelUp();
        break;
      case 'error':
        playWrong();
        break;
      default:
        playClick();
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '/icons/success.png';
      case 'error': return '/icons/error.png';
      case 'warning': return '/icons/warning.png';
      case 'info': return '/icons/info.png';
      case 'achievement': return '/icons/achievement.png';
      case 'level_up': return '/icons/level-up.png';
      case 'streak': return '/icons/streak.png';
      case 'reminder': return '/icons/reminder.png';
      default: return '/icons/default.png';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'warning': return '#FF9800';
      case 'info': return '#2196F3';
      case 'achievement': return '#FFD700';
      case 'level_up': return '#9C27B0';
      case 'streak': return '#FF5722';
      case 'reminder': return '#607D8B';
      default: return '#9E9E9E';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Helper methods
  const notifySuccess = (title: string, arabicTitle: string, message: string, arabicMessage: string) => {
    createNotification('success', title, arabicTitle, message, arabicMessage);
  };

  const notifyError = (title: string, arabicTitle: string, message: string, arabicMessage: string) => {
    createNotification('error', title, arabicTitle, message, arabicMessage, { priority: 'high', autoHide: false });
  };

  const notifyWarning = (title: string, arabicTitle: string, message: string, arabicMessage: string) => {
    createNotification('warning', title, arabicTitle, message, arabicMessage);
  };

  const notifyInfo = (title: string, arabicTitle: string, message: string, arabicMessage: string) => {
    createNotification('info', title, arabicTitle, message, arabicMessage);
  };

  const notifyAchievement = (title: string, arabicTitle: string, message: string, arabicMessage: string, xpReward?: number) => {
    createNotification('achievement', title, arabicTitle, message, arabicMessage, { 
      priority: 'high', 
      xpReward,
      animation: 'bounce',
      autoHide: false 
    });
  };

  const notifyLevelUp = (newLevel: number, title: string, arabicTitle: string) => {
    createNotification('level_up', title, arabicTitle, 
      `Congratulations! You've reached Level ${newLevel}!`, 
      `مبارك! لقد وصلت إلى المستوى ${newLevel}!`, 
      { priority: 'high', animation: 'grow', autoHide: false }
    );
  };

  const notifyStreak = (days: number, title: string, arabicTitle: string) => {
    createNotification('streak', title, arabicTitle, 
      `Amazing! You've maintained a ${days}-day learning streak!`, 
      `رائع! لقد حافظت على سلسلة تعلم لمدة ${days} أيام!`, 
      { priority: 'high', animation: 'bounce' }
    );
  };

  const notifyReminder = (title: string, arabicTitle: string, message: string, arabicMessage: string) => {
    createNotification('reminder', title, arabicTitle, message, arabicMessage, { 
      priority: 'low',
      sound: false 
    });
  };

  // Animation components
  const SlideTransition = (props: any) => <Slide {...props} direction="down" />;
  const FadeTransition = (props: any) => <Fade {...props} />;
  const GrowTransition = (props: any) => <Grow {...props} />;

  const getTransition = (animation: string) => {
    switch (animation) {
      case 'fade': return FadeTransition;
      case 'grow': return GrowTransition;
      case 'bounce': return GrowTransition;
      default: return SlideTransition;
    }
  };

  return (
    <Box>
      {/* Current Notification */}
      <Snackbar
        open={!!currentNotification}
        onClose={() => setCurrentNotification(null)}
        TransitionComponent={currentNotification ? getTransition(currentNotification.animation) : undefined}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 2 }}
      >
        <Alert
          severity={currentNotification?.type === 'error' ? 'error' : 
                  currentNotification?.type === 'warning' ? 'warning' : 
                  currentNotification?.type === 'info' ? 'info' : 'success'}
          icon={
            currentNotification?.type === 'achievement' ? <EmojiEvents /> :
            currentNotification?.type === 'level_up' ? <Star /> :
            currentNotification?.type === 'streak' ? <LocalFireDepartment /> :
            currentNotification?.type === 'reminder' ? <Lightbulb /> :
            undefined
          }
          action={
            <IconButton
              size="small"
              onClick={() => setCurrentNotification(null)}
              sx={{ color: 'inherit' }}
            >
              <Close />
            </IconButton>
          }
          sx={{
            minWidth: { xs: 280, sm: 400 },
            maxWidth: { xs: 320, sm: 500 },
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
        >
          <AlertTitle sx={{ fontWeight: 900, mb: 1 }}>
            {currentNotification?.arabicTitle}
          </AlertTitle>
          <Typography variant="body2">
            {currentNotification?.arabicMessage}
          </Typography>
          {currentNotification?.xpReward && (
            <Box sx={{ mt: 1 }}>
              <Chip
                icon={<Star />}
                label={`+${currentNotification.xpReward} XP`}
                color="primary"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          )}
        </Alert>
      </Snackbar>

      {/* Notification Bell */}
      <Tooltip title="الإشعارات">
        <IconButton
          onClick={() => setShowHistory(true)}
          sx={{ position: 'fixed', top: 80, right: 20, zIndex: 1000 }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsActive />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Settings Button */}
      <Tooltip title="إعدادات الإشعارات">
        <IconButton
          onClick={() => setShowSettings(true)}
          sx={{ position: 'fixed', top: 80, right: 70, zIndex: 1000 }}
        >
          <Settings />
        </IconButton>
      </Tooltip>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="sm" fullWidth>
        <DialogTitle>إعدادات الإشعارات</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <NotificationsActive />
              </ListItemIcon>
              <ListItemText 
                primary="تفعيل الإشعارات" 
                secondary="إظهار الإشعارات عند حدوث الأحداث"
              />
              <Button
                variant={settings.enabled ? "contained" : "outlined"}
                onClick={() => setSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                size="small"
              >
                {settings.enabled ? 'مفعل' : 'معطل'}
              </Button>
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <ListItemIcon>
                <VolumeUp />
              </ListItemIcon>
              <ListItemText 
                primary="الأصوات" 
                secondary="تشغيل الأصوات مع الإشعارات"
              />
              <Button
                variant={settings.sound ? "contained" : "outlined"}
                onClick={() => setSettings(prev => ({ ...prev, sound: !prev.sound }))}
                size="small"
              >
                {settings.sound ? 'مفعل' : 'معطل'}
              </Button>
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <PriorityHigh />
              </ListItemIcon>
              <ListItemText 
                primary="الاهتزاز" 
                secondary="اهتزاز الجهاز مع الإشعارات المهمة"
              />
              <Button
                variant={settings.vibration ? "contained" : "outlined"}
                onClick={() => setSettings(prev => ({ ...prev, vibration: !prev.vibration }))}
                size="small"
              >
                {settings.vibration ? 'مفعل' : 'معطل'}
              </Button>
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>إغلاق</Button>
        </DialogActions>
      </Dialog>

      {/* Notification History */}
      <Dialog open={showHistory} onClose={() => setShowHistory(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              سجل الإشعارات
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                onClick={markAllAsRead}
                startIcon={<MarkEmailRead />}
              >
                تحديد الكل كمقروء
              </Button>
              <Button
                size="small"
                onClick={clearAllNotifications}
                startIcon={<Delete />}
                color="error"
              >
                مسح الكل
              </Button>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <List sx={{ p: 0 }}>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText 
                  primary="لا توجد إشعارات" 
                  secondary="ستظهر الإشعارات هنا عند حدوثها"
                  sx={{ textAlign: 'center' }}
                />
              </ListItem>
            ) : (
              notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    bgcolor: notification.read ? 'transparent' : '#E3F2FD',
                    borderLeft: `4px solid ${getNotificationColor(notification.type)}`,
                    '&:hover': { bgcolor: '#F5F5F5' }
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: getNotificationColor(notification.type), width: 40, height: 40 }}>
                      {notification.type === 'achievement' ? <EmojiEvents /> :
                       notification.type === 'level_up' ? <Star /> :
                       notification.type === 'streak' ? <LocalFireDepartment /> :
                       notification.type === 'success' ? <CheckCircle /> :
                       notification.type === 'error' ? <Error /> :
                       notification.type === 'warning' ? <Warning /> :
                       <Info />}
                    </Avatar>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ fontWeight: !notification.read ? 700 : 400 }}>
                          {notification.arabicTitle}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.timestamp).toLocaleString('ar')}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.arabicMessage}
                        </Typography>
                        {notification.xpReward && (
                          <Chip
                            size="small"
                            label={`+${notification.xpReward} XP`}
                            color="primary"
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </Box>
                    }
                  />
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {!notification.read && (
                      <IconButton
                        size="small"
                        onClick={() => markAsRead(notification.id)}
                        sx={{ color: '#2196F3' }}
                      >
                        <MarkEmailRead />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => deleteNotification(notification.id)}
                      sx={{ color: '#F44336' }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </ListItem>
              ))
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHistory(false)}>إغلاق</Button>
        </DialogActions>
      </Dialog>

      {children}
    </Box>
  );
};

// Custom hook for notifications
export const useNotifications = () => {
  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notifyAchievement,
    notifyLevelUp,
    notifyStreak,
    notifyReminder
  };
};
