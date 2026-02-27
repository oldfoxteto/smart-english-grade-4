// Social System - Friends and Community Features
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Tooltip,
  Paper,
  Grid,
  Tabs,
  Tab,
  LinearProgress,
  Fab,
  Menu,
  MenuItem,
  InputAdornment,
  Search
} from '@mui/material';
import {
  PersonAdd,
  Search,
  MoreVert,
  Send,
  Message,
  ThumbUp,
  ThumbDown,
  Share,
  Group,
  TrendingUp,
  EmojiEvents,
  School,
  LocalFireDepartment,
  Public,
  Settings,
  Block,
  Report,
  Notifications,
  Chat,
  People,
  Star,
  Workspaces,
  Language,
  Psychology,
  SportsEsports,
  MusicNote,
  Book,
  CameraAlt,
  Videocam,
  Mic,
  Close,
  CheckCircle,
  RadioButtonUnchecked,
  RadioButtonChecked
} from '@mui/icons-material';

export interface User {
  id: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  bio: string;
  interests: string[];
  country: string;
  joinDate: Date;
  lastActive: Date;
  isOnline: boolean;
  isFriend: boolean;
  friendRequestSent: boolean;
  friendRequestReceived: boolean;
  stats: {
    lessonsCompleted: number;
    wordsLearned: number;
    hoursStudied: number;
    achievements: number;
  };
}

export interface FriendRequest {
  id: string;
  fromUser: User;
  toUser: User;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  respondedAt?: Date;
}

export interface ChatMessage {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'image' | 'audio' | 'study_invite';
  metadata?: any;
}

export interface StudyGroup {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  arabicDescription: string;
  creatorId: string;
  members: User[];
  maxMembers: number;
  isPrivate: boolean;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  category: 'grammar' | 'vocabulary' | 'speaking' | 'general';
  tags: string[];
  createdAt: Date;
  nextSession?: Date;
}

export interface Challenge {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  type: 'individual' | 'group' | 'community';
  category: 'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'reading';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // in days
  xpReward: number;
  participants: User[];
  createdBy: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  requirements?: {
    minLevel: number;
    maxLevel?: number;
    minFriends?: number;
  };
}

// Friends List Component
export const FriendsList: React.FC<{
  friends: User[];
  onFriendClick: (friend: User) => void;
  onSendMessage: (friend: User) => void;
}> = ({ friends, onFriendClick, onSendMessage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'online' | 'recent'>('all');

  const filteredFriends = friends.filter(friend => {
    const matchesSearch = friend.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         friend.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filter === 'online') return friend.isOnline;
    if (filter === 'recent') {
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return friend.lastActive > dayAgo;
    }
    
    return true;
  });

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, p: 0, overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
            👥 الأصدقاء ({friends.length})
          </Typography>
          
          <TextField
            fullWidth
            size="small"
            placeholder="البحث عن الأصدقاء..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {['all', 'online', 'recent'].map((filterType) => (
              <Chip
                key={filterType}
                label={filterType === 'all' ? 'الكل' : 
                      filterType === 'online' ? 'متصلين' : 'نشطين'}
                onClick={() => setFilter(filterType as any)}
                color={filter === filterType ? 'primary' : 'default'}
                size="small"
              />
            ))}
          </Box>
        </Box>

        {/* Friends List */}
        <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
          {filteredFriends.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                {searchTerm ? 'لا توجد نتائج للبحث' : 'لا توجد أصدقاء'}
              </Typography>
            </Box>
          ) : (
            filteredFriends.map((friend) => (
              <ListItem
                key={friend.id}
                sx={{
                  px: 2,
                  py: 1,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                  borderBottom: 1,
                  borderColor: 'divider'
                }}
                onClick={() => onFriendClick(friend)}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant={friend.isOnline ? 'dot' : 'standard'}
                    color={friend.isOnline ? 'success' : 'default'}
                  >
                    <Avatar
                      src={friend.avatar}
                      sx={{ width: 48, height: 48 }}
                    >
                      {friend.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {friend.username}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Chip
                          size="small"
                          label={`Level ${friend.level}`}
                          color="primary"
                        />
                        {friend.isOnline && (
                          <Chip
                            size="small"
                            label="متصل"
                            color="success"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {friend.bio}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        آخر نشاط: {new Date(friend.lastActive).toLocaleDateString('ar')}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                          <TrendingUp sx={{ fontSize: 12, color: '#4CAF50' }} />
                          {friend.xp} XP
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                          <LocalFireDepartment sx={{ fontSize: 12, color: '#FF5722' }} />
                          {friend.streak} يوم
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSendMessage(friend);
                    }}
                    sx={{ color: 'primary' }}
                  >
                    <Message />
                  </IconButton>
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Box>
              </ListItem>
            ))
          )}
        </List>
      </CardContent>
    </Card>
  );
};

// Friend Requests Component
export const FriendRequests: React.FC<{
  requests: FriendRequest[];
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
}> = ({ requests, onAcceptRequest, onRejectRequest }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
          📩 طلبات الصداقة ({requests.length})
        </Typography>
        
        {requests.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              لا توجد طلبات صداقة حالياً
            </Typography>
          </Box>
        ) : (
          <List>
            {requests.map((request) => (
              <ListItem key={request.id} sx={{ px: 0 }}>
                <Card sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={request.fromUser.avatar}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      >
                        {request.fromUser.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {request.fromUser.username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Level {request.fromUser.level} • {request.fromUser.xp} XP
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        label={new Date(request.createdAt).toLocaleDateString('ar')}
                        color="default"
                      />
                    </Box>
                    
                    {request.message && (
                      <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                        "{request.message}"
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => onRejectRequest(request.id)}
                        startIcon={<Close />}
                      >
                        رفض
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => onAcceptRequest(request.id)}
                        startIcon={<CheckCircle />}
                      >
                        قبول
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

// Study Groups Component
export const StudyGroups: React.FC<{
  groups: StudyGroup[];
  onJoinGroup: (groupId: string) => void;
  onCreateGroup: () => void;
}> = ({ groups, onJoinGroup, onCreateGroup }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.arabicName.includes(searchTerm) ||
    group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'A1': return '#4CAF50';
      case 'A2': return '#8BC34A';
      case 'B1': return '#FF9800';
      case 'B2': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, p: 0 }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              📚 مجموعات الدراسة ({groups.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={onCreateGroup}
              size="small"
            >
              إنشاء مجموعة
            </Button>
          </Box>
          
          <TextField
            fullWidth
            size="small"
            placeholder="البحث عن مجموعات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue as number)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2 }}
        >
          <Tab label="الكل" />
          <Tab label="مجموعاتي" />
          <Tab label="الموصى بها" />
        </Tabs>

        {/* Groups List */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {filteredGroups.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                {searchTerm ? 'لا توجد مجموعات مطابقة للبحث' : 'لا توجد مجموعات'}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filteredGroups.map((group) => (
                <Grid item xs={12} sm={6} md={4} key={group.id}>
                  <Card sx={{ 
                    height: '100%', 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }
                  }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Chip
                          size="small"
                          label={group.category}
                          color={getDifficultyColor(group.level)}
                        />
                        {group.isPrivate && (
                          <Chip
                            size="small"
                            label="خاص"
                            variant="outlined"
                            icon={<Public />}
                          />
                        )}
                      </Box>
                      
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {group.arabicName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {group.arabicDescription}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                            {group.members.length}
                          </Avatar>
                          <Typography variant="caption">
                            عضو
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          من {group.maxMembers}
                        </Typography>
                      </Box>
                      
                      {group.nextSession && (
                        <Box sx={{ p: 1, bgcolor: '#E3F2FD', borderRadius: 1, mb: 2 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            الجلسة القادمة: {new Date(group.nextSession).toLocaleString('ar')}
                          </Typography>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {group.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => onJoinGroup(group.id)}
                        disabled={group.members.length >= group.maxMembers}
                      >
                        {group.members.length >= group.maxMembers ? 'المجموعة ممتلئة' : 'انضمام'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

// Challenges Component
export const Challenges: React.FC<{
  challenges: Challenge[];
  onJoinChallenge: (challengeId: string) => void;
}> = ({ challenges, onJoinChallenge }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredChallenges = challenges.filter(challenge => {
    if (filter === 'active') return challenge.isActive;
    if (filter === 'completed') return !challenge.isActive && new Date() > challenge.endDate;
    return true;
  });

  const getChallengeTypeColor = (type: string) => {
    switch (type) {
      case 'individual': return '#2196F3';
      case 'group': return '#4CAF50';
      case 'community': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, p: 0 }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
            🏆 التحديات ({challenges.length})
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {['all', 'active', 'completed'].map((filterType) => (
              <Chip
                key={filterType}
                label={filterType === 'all' ? 'الكل' : 
                      filterType === 'active' ? 'نشط' : 'مكتمل'}
                onClick={() => setFilter(filterType as any)}
                color={filter === filterType ? 'primary' : 'default'}
                size="small"
              />
            ))}
          </Box>
        </Box>

        {/* Challenges List */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {filteredChallenges.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                لا توجد تحديات حالياً
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filteredChallenges.map((challenge) => (
                <Grid item xs={12} sm={6} md={4} key={challenge.id}>
                  <Card sx={{ 
                    height: '100%',
                    border: challenge.isActive ? `2px solid ${getChallengeTypeColor(challenge.type)}` : '1px solid #E0E0E0',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {challenge.isActive && (
                      <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bgcolor: getChallengeTypeColor(challenge.type),
                        color: 'white',
                        py: 0.5,
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        {challenge.type === 'individual' ? 'فردي' :
                         challenge.type === 'group' ? 'جماعي' : 'مجتمعي'}
                      </Box>
                    )}
                    
                    <CardContent sx={{ pt: challenge.isActive ? 4 : 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {challenge.arabicTitle}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {challenge.arabicDescription}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            size="small"
                            label={challenge.category}
                            color="primary"
                          />
                          <Chip
                            size="small"
                            label={challenge.difficulty === 'easy' ? 'سهل' :
                                   challenge.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                            color={challenge.difficulty === 'easy' ? 'success' :
                                   challenge.difficulty === 'medium' ? 'warning' : 'error'}
                          />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 900, color: '#FFD700' }}>
                          +{challenge.xpReward} XP
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2">
                          المدة: {challenge.duration} يوم
                        </Typography>
                        <Typography variant="body2">
                          المشاركون: {challenge.participants.length}
                        </Typography>
                      </Box>
                      
                      <LinearProgress
                        variant="determinate"
                        value={getDaysRemaining(challenge.endDate)}
                        max={challenge.duration}
                        sx={{ mb: 2 }}
                      />
                      
                      <Typography variant="caption" sx={{ mb: 2 }}>
                        {getDaysRemaining(challenge.endDate)} يوم متبقي
                      </Typography>
                      
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => onJoinChallenge(challenge.id)}
                        disabled={!challenge.isActive}
                      >
                        {challenge.isActive ? 'انضمام للتحدي' : 'التحدي انتهى'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
