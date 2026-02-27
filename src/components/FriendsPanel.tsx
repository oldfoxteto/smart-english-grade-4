import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
} from '@mui/material';
import { PersonAdd, EmojiEvents } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface Friend {
  id: string;
  display_name: string;
  email: string;
  total_xp: number;
  relationship: 'friend' | 'not_friend' | 'self';
}

interface FriendRequest {
  id: string;
  requester_id: string;
  display_name: string;
  email: string;
  requested_at: string;
}

interface Challenge {
  id: string;
  challenger_id: string;
  challenger_nickname: string;
  challenged_id: string;
  challenged_nickname: string;
  challenge_type: 'daily_xp' | 'lesson_race' | 'quiz_battle';
  challenge_date: string;
  challenger_xp: number;
  challenged_xp: number;
  status: 'active' | 'completed';
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`friends-tabpanel-${index}`}
      aria-labelledby={`friends-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

export const FriendsPanel: React.FC = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [tabValue, setTabValue] = useState(0);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [others, setOthers] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openChallenge, setOpenChallenge] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [challengeType, setChallengeType] = useState<'daily_xp' | 'lesson_race' | 'quiz_battle'>('daily_xp');

  const loadFriendsData = useCallback(async () => {
    setLoading(true);
    try {
      const [friendsRes, requestsRes, challengesRes] = await Promise.all([
        fetch('/api/v1/friends/list'),
        fetch('/api/v1/friends/requests'),
        fetch('/api/v1/friends/challenges'),
      ]);

      if (friendsRes.ok) {
        const data = await friendsRes.json();
        setFriends(data.friends || []);
        setOthers(data.others || []);
      }

      if (requestsRes.ok) {
        const data = await requestsRes.json();
        setRequests(data.requests || []);
      }

      if (challengesRes.ok) {
        const data = await challengesRes.json();
        setChallenges(data.challenges || []);
      }

      setError(null);
    } catch (err) {
      setError(isArabic ? 'خطأ في تحميل البيانات' : 'Error loading data');
    } finally {
      setLoading(false);
    }
  }, [isArabic]);

  useEffect(() => {
    void loadFriendsData();
  }, [loadFriendsData]);

  const handleSendRequest = async (friendId: string) => {
    try {
      const res = await fetch(`/api/v1/friends/request/${friendId}`, {
        method: 'POST',
      });

      if (res.ok) {
        setError(isArabic ? 'تم إرسال طلب الصداقة' : 'Friend request sent');
        await loadFriendsData();
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError(isArabic ? 'خطأ في الإرسال' : 'Error sending request');
    }
  };

  const handleRespondRequest = async (requestId: string, accept: boolean) => {
    try {
      const res = await fetch(`/api/v1/friends/request/${requestId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accept }),
      });

      if (res.ok) {
        await loadFriendsData();
      }
    } catch (err) {
      setError(isArabic ? 'خطأ في الرد' : 'Error responding to request');
    }
  };

  const handleCreateChallenge = async () => {
    if (!selectedFriend) return;

    try {
      const res = await fetch(`/api/v1/friends/challenges/${selectedFriend.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: challengeType }),
      });

      if (res.ok) {
        setOpenChallenge(false);
        setSelectedFriend(null);
        await loadFriendsData();
      }
    } catch (err) {
      setError(isArabic ? 'خطأ في إنشاء التحدي' : 'Error creating challenge');
    }
  };

  const getChallengeTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      daily_xp: isArabic ? 'تحدي النقاط اليومية' : 'Daily XP Challenge',
      lesson_race: isArabic ? 'سباق الدروس' : 'Lesson Race',
      quiz_battle: isArabic ? 'معركة الاختبارات' : 'Quiz Battle',
    };
    return labels[type] || type;
  };

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAdd sx={{ color: '#0B4B88' }} />
          {isArabic ? 'الأصدقاء والتحديات' : 'Friends & Challenges'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}

        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ mb: 2, borderBottom: '1px solid #e0e0e0' }}
        >
          <Tab label={`${isArabic ? 'أصدقائي' : 'My Friends'} (${friends.length})`} />
          <Tab label={`${isArabic ? 'الطلبات' : 'Requests'} (${requests.length})`} />
          <Tab label={`${isArabic ? 'التحديات' : 'Challenges'} (${challenges.length})`} />
          <Tab label={isArabic ? 'ابحث' : 'Discover'} />
        </Tabs>

        {/* Friends Tab */}
        <TabPanel value={tabValue} index={0}>
          {friends.length === 0 ? (
            <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
              {isArabic ? 'لا توجد أصدقاء بعد' : 'No friends yet'}
            </Typography>
          ) : (
            <List>
              {friends.map((friend) => (
                <ListItem key={friend.id} sx={{ mb: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      {friend.display_name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={friend.display_name}
                    secondary={`${friend.total_xp} XP`}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EmojiEvents />}
                    onClick={() => {
                      setSelectedFriend(friend);
                      setOpenChallenge(true);
                    }}
                  >
                    {isArabic ? 'تحدِ' : 'Challenge'}
                  </Button>
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>

        {/* Requests Tab */}
        <TabPanel value={tabValue} index={1}>
          {requests.length === 0 ? (
            <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
              {isArabic ? 'لا توجد طلبات' : 'No pending requests'}
            </Typography>
          ) : (
            <List>
              {requests.map((request) => (
                <ListItem key={request.id} sx={{ mb: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                      {request.display_name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={request.display_name}
                    secondary={new Date(request.requested_at).toLocaleDateString()}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => handleRespondRequest(request.id, true)}
                    sx={{ mr: 1 }}
                  >
                    ✓
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleRespondRequest(request.id, false)}
                  >
                    ✕
                  </Button>
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>

        {/* Challenges Tab */}
        <TabPanel value={tabValue} index={2}>
          {challenges.length === 0 ? (
            <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
              {isArabic ? 'لا توجد تحديات نشطة' : 'No active challenges'}
            </Typography>
          ) : (
            <List>
              {challenges.map((challenge) => (
                <Card key={challenge.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {getChallengeTypeLabel(challenge.challenge_type)}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {challenge.challenger_nickname} vs {challenge.challenged_nickname}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip
                          label={`${challenge.challenger_xp} vs ${challenge.challenged_xp}`}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </List>
          )}
        </TabPanel>

        {/* Discover Tab */}
        <TabPanel value={tabValue} index={3}>
          {others.length === 0 ? (
            <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
              {isArabic ? 'لا يوجد مستخدمين آخرين' : 'No other users available'}
            </Typography>
          ) : (
            <List>
              {others.slice(0, 10).map((user) => (
                <ListItem key={user.id} sx={{ mb: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
                      {user.display_name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.display_name}
                    secondary={`${user.total_xp} XP`}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={() => handleSendRequest(user.id)}
                  >
                    {isArabic ? 'أضيف' : 'Add'}
                  </Button>
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>
      </CardContent>

      {/* Challenge Dialog */}
      <Dialog open={openChallenge} onClose={() => setOpenChallenge(false)}>
        <DialogTitle>
          {isArabic ? 'إنشاء تحدي' : 'Create Challenge'}
        </DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <Typography sx={{ mb: 2, fontWeight: 'bold' }}>
            {isArabic ? 'تحدِ' : 'Challenge'} {selectedFriend?.display_name}
          </Typography>
          <TextField
            select
            fullWidth
            label={isArabic ? 'نوع التحدي' : 'Challenge Type'}
            value={challengeType}
            onChange={(e) => setChallengeType(e.target.value as any)}
            SelectProps={{
              native: true,
            }}
          >
            <option value="daily_xp">{getChallengeTypeLabel('daily_xp')}</option>
            <option value="lesson_race">{getChallengeTypeLabel('lesson_race')}</option>
            <option value="quiz_battle">{getChallengeTypeLabel('quiz_battle')}</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChallenge(false)}>
            {isArabic ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={handleCreateChallenge} variant="contained" color="primary">
            {isArabic ? 'إنشاء' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default FriendsPanel;
