// Social Notifications System - Fixed Version
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Chip,
  Badge,
  Tooltip,
  Paper,
  Divider,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Slider,
  TextField,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Fab
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  NotificationsOff,
  NotificationsPaused,
  VolumeUp,
  VolumeOff,
  Settings,
  PersonAdd,
  Group,
  Message,
  ThumbUp,
  Comment,
  Share,
  Favorite,
  Bookmark,
  BookmarkBorder,
  Star,
  StarBorder,
  CheckCircle,
  Error,
  Warning,
  Info,
  Schedule,
  Update,
  Celebration,
  EmojiEvents,
  MilitaryTech,
  School,
  Psychology,
  TrendingUp,
  LocalFireDepartment,
  Workspaces,
  WorkspacesOutline,
  Forum,
  Chat,
  People,
  Visibility,
  VisibilityOff,
  Close,
  DoneAll,
  FilterList,
  MarkEmailRead,
  MarkEmailUnread,
  Delete,
  Archive,
  Unarchive,
  Report,
  Block,
  Person,
  PersonAddDisabled,
  GroupAdd,
  GroupRemove,
  Send,
  Reply,
  ReplyAll,
  Forward,
  Edit
} from '@mui/icons-material';

export interface SocialNotification {
  id: string;
  type: 'friend_request' | 'friend_accepted' | 'message' | 'group_invite' | 'challenge' | 'achievement' | 'level_up' | 'streak' | 'mention' | 'like' | 'comment' | 'share' | 'follow' | 'system';
  title: string;
  arabicTitle: string;
  message: string;
  arabicMessage: string;
  fromUser?: {
    id: string;
    username: string;
    avatar: string;
    level: number;
  };
  fromGroup?: {
    id: string;
    name: string;
    arabicName: string;
    avatar: string;
    memberCount: number;
  };
  data?: any;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'social' | 'learning' | 'system' | 'achievement';
  actions?: Array<{
    id: string;
    label: string;
    arabicLabel: string;
    action: () => void;
    icon?: any;
  }>;
  metadata?: {
    relatedUserId?: string;
    relatedGroupId?: string;
    relatedChallengeId?: string;
    relatedAchievementId?: string;
    expiresAt?: Date;
    isDismissable?: boolean;
  };
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  desktop: boolean;
  email: boolean;
  push: boolean;
  categories: {
    social: boolean;
    learning: boolean;
    system: boolean;
    achievement: boolean;
  };
  priorities: {
    low: boolean;
    medium: boolean;
    high: boolean;
    urgent: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: {
    friendRequests: boolean;
    messages: boolean;
    groupInvites: boolean;
    challenges: boolean;
    achievements: boolean;
    levelUps: boolean;
    streaks: boolean;
    mentions: boolean;
  };
}

// Social Notifications Hook
export const useSocialNotifications = () => {
  const [notifications, setNotifications] = useState<SocialNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    sound: true,
    vibration: true,
    desktop: true,
    email: false,
    push: true,
    categories: {
      social: true,
      learning: true,
      system: true,
      achievement: true
    },
    priorities: {
      low: true,
      medium: true,
      high: true,
      urgent: true
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    frequency: {
      friendRequests: true,
      messages: true,
      groupInvites: true,
      challenges: true,
      achievements: true,
      levelUps: true,
      streaks: true,
      mentions: true
    }
  });
  const [showPanel, setShowPanel] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'social' | 'learning' | 'achievement'>('all');

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('social_notification_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('social_notifications');
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotifications(parsed);
      setUnreadCount(parsed.filter((n: SocialNotification) => !n.isRead).length);
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('social_notification_settings', JSON.stringify(settings));
  }, [settings]);

  const addNotification = useCallback((notification: Omit<SocialNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: SocialNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      isRead: false
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    setUnreadCount(prev => prev + 1);
    
    // Save to localStorage
    localStorage.setItem('social_notifications', JSON.stringify(updatedNotifications));

    // Show browser notification if enabled
    if (settings.desktop && settings.categories[notification.category] && 
        settings.priorities[notification.priority]) {
      showBrowserNotification(newNotification);
    }

    // Play sound if enabled
    if (settings.sound && settings.categories[notification.category]) {
      playNotificationSound(notification.type);
    }

    // Vibrate if enabled
    if (settings.vibration && settings.categories[notification.category]) {
      vibrateForNotification(notification.type);
    }
  }, [notifications, settings]);

  const markAsRead = useCallback((notificationId: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    setNotifications(updatedNotifications);
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    localStorage.setItem('social_notifications', JSON.stringify(updatedNotifications));
  }, [notifications]);

  const markAllAsRead = useCallback(() => {
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
    
    localStorage.setItem('social_notifications', JSON.stringify(updatedNotifications));
  }, [notifications]);

  const deleteNotification = useCallback((notificationId: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    setNotifications(updatedNotifications);
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    localStorage.setItem('social_notifications', JSON.stringify(updatedNotifications));
  }, [notifications]);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    
    localStorage.setItem('social_notifications', JSON.stringify([]));
  }, []);

  const showBrowserNotification = (notification: SocialNotification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.arabicTitle, {
        body: notification.arabicMessage,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent'
      });
    }
  };

  const playNotificationSound = (type: string) => {
    const audio = new Audio();
    
    switch (type) {
      case 'friend_request':
      case 'friend_accepted':
        audio.src = '/sounds/friend_notification.mp3';
        break;
      case 'message':
        audio.src = '/sounds/message_notification.mp3';
        break;
      case 'group_invite':
        audio.src = '/sounds/group_notification.mp3';
        break;
      case 'challenge':
        audio.src = '/sounds/challenge_notification.mp3';
        break;
      case 'achievement':
      case 'level_up':
      case 'streak':
        audio.src = '/sounds/achievement_notification.mp3';
        break;
      default:
        audio.src = '/sounds/default_notification.mp3';
    }
    
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  const vibrateForNotification = (type: string) => {
    if ('vibrate' in navigator) {
      switch (type) {
        case 'friend_request':
        case 'friend_accepted':
        case 'message':
          navigator.vibrate([200, 100, 200]);
          break;
        case 'achievement':
        case 'level_up':
        case 'streak':
          navigator.vibrate([100, 50, 100, 50, 100]);
          break;
        case 'challenge':
          navigator.vibrate([300, 200, 300]);
          break;
        default:
          navigator.vibrate(200);
      }
    }
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.isRead);
    } else if (filter !== 'all') {
      filtered = filtered.filter(n => n.category === filter);
    }
    
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    notifications,
    unreadCount,
    settings,
    showPanel,
    filter,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getFilteredNotifications,
    updateSettings,
    setShowPanel
  };
};

// Social Notifications Component
export const SocialNotificationsPanel: React.FC = () => {
  const {
    notifications,
    unreadCount,
    settings,
    showPanel,
    filter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getFilteredNotifications,
    updateSettings,
    setShowPanel
  } = useSocialNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request': return <PersonAdd />;
      case 'friend_accepted': return <Person />;
      case 'message': return <Message />;
      case 'group_invite': return <Group />;
      case 'challenge': return <MilitaryTech />;
      case 'achievement': return <EmojiEvents />;
      case 'level_up': return <TrendingUp />;
      case 'streak': return <LocalFireDepartment />;
      case 'mention': return <Comment />;
      case 'like': return <ThumbUp />;
      case 'share': return <Share />;
      case 'follow': return <Visibility />;
      case 'system': return <Info />;
      default: return <Notifications />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'urgent') return '#F44336';
    if (priority === 'high') return '#FF9800';
    if (priority === 'medium') return '#2196F3';
    
    switch (type) {
      case 'friend_request':
      case 'friend_accepted':
        return '#4CAF50';
      case 'message':
        return '#2196F3';
      case 'group_invite':
        return '#9C27B0';
      case 'challenge':
        return '#FF5722';
      case 'achievement':
      case 'level_up':
      case 'streak':
        return '#FFD700';
      default:
        return '#9E9E9E';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجل';
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return 'عادي';
    }
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <>
      {/* Notification Bell */}
      <Fab
        color={unreadCount > 0 ? 'secondary' : 'default'}
        onClick={() => setShowPanel(!showPanel)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000
        }}
      >
        {unreadCount > 0 ? (
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsActive />
          </Badge>
        ) : (
          <Notifications />
        )}
      </Fab>

      {/* Notifications Panel */}
      {showPanel && (
        <Dialog
          open={showPanel}
          onClose={() => setShowPanel(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              height: '80vh',
              maxHeight: '80vh'
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                🔔 الإشعارات الاجتماعية
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={markAllAsRead}
                  startIcon={<DoneAll />}
                >
                  تحديد الكل كمقروء
                </Button>
                <Button
                  variant="outlined"
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
            <Tabs value={filter} onChange={(e, newValue) => setFilter(newValue as any)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="الكل" value="all" />
              <Tab label={`غير مقروء (${unreadCount})`} value="unread" />
              <Tab label="اجتماعي" value="social" />
              <Tab label="تعلم" value="learning" />
              <Tab label="إنجازات" value="achievement" />
            </Tabs>
            
            <Box sx={{ height: 'calc(80vh - 120px)', overflow: 'auto' }}>
              {filteredNotifications.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {filter === 'unread' ? 'لا توجد إشعارات غير مقروءة' : 'لا توجد إشعارات'}
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {filteredNotifications.map((notification) => (
                    <ListItem
                      key={notification.id}
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        p: 2,
                        mb: 1,
                        bgcolor: notification.isRead ? 'transparent' : '#F5F5F5',
                        borderLeft: `4px solid ${getNotificationColor(notification.type, notification.priority)}`,
                        '&:hover': { bgcolor: '#E8F5E8' }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            sx={{
                              bgcolor: getNotificationColor(notification.type, notification.priority),
                              color: 'white',
                              width: 40,
                              height: 40
                            }}
                          >
                            {getNotificationIcon(notification.type)}
                          </Avatar>
                          
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {notification.arabicTitle}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Chip
                                size="small"
                                label={getPriorityLabel(notification.priority)}
                                color={notification.priority === 'urgent' ? 'error' : 
                                       notification.priority === 'high' ? 'warning' : 'default'}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {notification.timestamp.toLocaleString('ar')}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {!notification.isRead && (
                            <IconButton
                              size="small"
                              onClick={() => markAsRead(notification.id)}
                              sx={{ color: '#4CAF50' }}
                            >
                              <MarkEmailRead />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            onClick={() => deleteNotification(notification.id)}
                            sx={{ color: '#F44336' }}
                          >
                            <Close />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {notification.arabicMessage}
                      </Typography>
                      
                      {notification.actions && notification.actions.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {notification.actions.map((action, index) => (
                            <Button
                              key={index}
                              size="small"
                              variant="outlined"
                              startIcon={action.icon}
                              onClick={action.action}
                              sx={{ mb: 1 }}
                            >
                              {action.arabicLabel}
                            </Button>
                          ))}
                        </Box>
                      )}
                      
                      {notification.fromUser && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, p: 1, bgcolor: '#F8F9FA', borderRadius: 1 }}>
                          <Avatar
                            src={notification.fromUser.avatar}
                            sx={{ width: 24, height: 24 }}
                          />
                          <Typography variant="caption">
                            {notification.fromUser.username} • Level {notification.fromUser.level}
                          </Typography>
                        </Box>
                      )}
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button onClick={() => setShowPanel(false)}>
              إغلاق
            </Button>
            <Button
              variant="contained"
              startIcon={<Settings />}
              onClick={() => {
                // Open settings dialog
              }}
            >
              إعدادات الإشعارات
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
