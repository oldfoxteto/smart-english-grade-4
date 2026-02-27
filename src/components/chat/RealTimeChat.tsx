// Real-time Chat System
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Paper,
  Badge,
  Tooltip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  CircularProgress,
  LinearProgress,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
  Grid
} from '@mui/material';
import {
  Send,
  Mic,
  MicOff,
  AttachFile,
  EmojiEmotions,
  MoreVert,
  Settings,
  Videocam,
  VideocamOff,
  Phone,
  PhoneDisabled,
  VolumeUp,
  VolumeOff,
  ScreenShare,
  StopScreenShare,
  PersonAdd,
  Group,
  Block,
  Report,
  Info,
  CheckCircle,
  RadioButtonUnchecked,
  RadioButtonChecked,
  Schedule,
  History,
  Star,
  StarBorder,
  ThumbUp,
  ThumbDown,
  Reply,
  ReplyAll,
  Forward,
  ContentCopy,
  Bookmark,
  BookmarkBorder
} from '@mui/icons-material';

export interface ChatMessage {
  id: string;
  fromUserId: string;
  toUserId?: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'file' | 'system';
  timestamp: Date;
  isRead: boolean;
  isEdited: boolean;
  editedAt?: Date;
  replyTo?: string;
  reactions: Array<{
    userId: string;
    emoji: string;
    timestamp: Date;
  }>;
  attachments?: Array<{
    id: string;
    type: string;
    name: string;
    url: string;
    size: number;
  }>;
  metadata?: {
    isTyping?: boolean;
    isOnline?: boolean;
    isRecording?: boolean;
    callStatus?: 'idle' | 'ringing' | 'connected' | 'ended';
  };
}

export interface ChatRoom {
  id: string;
  name: string;
  arabicName: string;
  type: 'private' | 'group' | 'study_group' | 'challenge';
  participants: Array<{
    userId: string;
    username: string;
    avatar: string;
    role: 'admin' | 'moderator' | 'member';
    joinedAt: Date;
    isOnline: boolean;
    isTyping: boolean;
  }>;
  messages: ChatMessage[];
  settings: {
    allowFileSharing: boolean;
    allowVoiceCall: boolean;
    allowVideoCall: boolean;
    allowScreenShare: boolean;
    maxParticipants: number;
    isArchived: boolean;
  };
  createdBy: string;
  createdAt: Date;
  lastActivity: Date;
  unreadCount: number;
}

export interface ChatUser {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: Date;
  isTyping: boolean;
  isInCall: boolean;
  currentCall?: {
    userId: string;
    type: 'voice' | 'video';
    startTime: Date;
  };
  preferences: {
    notifications: boolean;
    sound: boolean;
    doNotDisturb: boolean;
    status: 'online' | 'away' | 'busy' | 'invisible';
  };
}

// Real-time Chat Hook
export const useRealTimeChat = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const socketRef = useRef<any>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = new WebSocket('ws://localhost:8080/chat');
    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      console.log('Connected to chat server');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'chat_rooms':
          setChatRooms(data.rooms);
          break;
        case 'messages':
          setMessages(prev => [...prev, ...data.messages]);
          break;
        case 'new_message':
          setMessages(prev => [...prev, data.message]);
          updateUnreadCount(data.message.fromUserId, 1);
          break;
        case 'user_status':
          setOnlineUsers(prev => 
            prev.map(user => 
              user.id === data.userId 
                ? { ...user, status: data.status, lastSeen: data.lastSeen }
                : user
            )
          );
          break;
        case 'typing':
          setTypingUsers(prev => {
            const newSet = new Set(prev);
            if (data.isTyping) {
              newSet.add(data.userId);
            } else {
              newSet.delete(data.userId);
            }
            return newSet;
          });
          break;
        case 'user_joined':
        case 'user_left':
          updateRoomParticipants(data.roomId, data.participants);
          break;
      }
    };

    socket.onclose = () => {
      setIsConnected(false);
      console.log('Disconnected from chat server');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const updateUnreadCount = (userId: string, delta: number) => {
    setUnreadCounts(prev => ({
      ...prev,
      [userId]: (prev[userId] || 0) + delta
    }));
  };

  const updateRoomParticipants = (roomId: string, participants: any[]) => {
    setChatRooms(prev => 
      prev.map(room => 
        room.id === roomId 
          ? { ...room, participants }
          : room
      )
    );
  };

  const sendMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>, roomId: string) => {
    if (!socketRef.current || !isConnected) return;

    const fullMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      isRead: false,
      isEdited: false,
      reactions: []
    };

    socketRef.current.send(JSON.stringify({
      type: 'send_message',
      roomId,
      message: fullMessage
    }));
  }, [isConnected]);

  const joinRoom = useCallback((roomId: string) => {
    if (!socketRef.current || !isConnected) return;

    socketRef.current.send(JSON.stringify({
      type: 'join_room',
      roomId
    }));

    const room = chatRooms.find(r => r.id === roomId);
    if (room) {
      setActiveRoom(room);
      setMessages(room.messages);
    }
  }, [chatRooms, isConnected]);

  const leaveRoom = useCallback(() => {
    if (!socketRef.current || !isConnected || !activeRoom) return;

    socketRef.current.send(JSON.stringify({
      type: 'leave_room',
      roomId: activeRoom.id
    }));

    setActiveRoom(null);
    setMessages([]);
  }, [activeRoom, isConnected]);

  const startTyping = useCallback(() => {
    if (!socketRef.current || !isConnected || !activeRoom) return;

    socketRef.current.send(JSON.stringify({
      type: 'start_typing',
      roomId: activeRoom.id
    }));
  }, [activeRoom, isConnected]);

  const stopTyping = useCallback(() => {
    if (!socketRef.current || !isConnected || !activeRoom) return;

    socketRef.current.send(JSON.stringify({
      type: 'stop_typing',
      roomId: activeRoom.id
    }));
  }, [activeRoom, isConnected]);

  const addReaction = useCallback((messageId: string, emoji: string) => {
    if (!socketRef.current || !isConnected) return;

    socketRef.current.send(JSON.stringify({
      type: 'add_reaction',
      messageId,
      emoji,
      userId: 'current_user_id' // Would come from auth context
    }));
  }, [isConnected]);

  return {
    chatRooms,
    activeRoom,
    messages,
    onlineUsers,
    isConnected,
    typingUsers,
    unreadCounts,
    sendMessage,
    joinRoom,
    leaveRoom,
    startTyping,
    stopTyping,
    addReaction
  };
};

// Chat Interface Component
export const ChatInterface: React.FC<{
  userId: string;
  username: string;
  avatar: string;
}> = ({ userId, username, avatar }) => {
  const [messageInput, setMessageInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    chatRooms,
    activeRoom,
    messages,
    onlineUsers,
    isConnected,
    typingUsers,
    sendMessage,
    joinRoom,
    leaveRoom,
    startTyping,
    stopTyping,
    addReaction
  } = useRealTimeChat();

  const handleSendMessage = () => {
    if (!messageInput.trim() && !selectedFile) return;

    const message: Omit<ChatMessage, 'id' | 'timestamp'> = {
      fromUserId: userId,
      content: messageInput,
      type: selectedFile ? 'file' : 'text',
      isRead: false,
      isEdited: false,
      reactions: []
    };

    if (selectedFile) {
      message.attachments = [{
        id: `att_${Date.now()}`,
        type: selectedFile.type,
        name: selectedFile.name,
        url: URL.createObjectURL(selectedFile),
        size: selectedFile.size
      }];
    }

    sendMessage(message, activeRoom?.id || '');
    setMessageInput('');
    setSelectedFile(null);
    stopTyping();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (messageInput.trim()) {
      startTyping();
    }
  };

  const handleKeyUp = () => {
    if (!messageInput.trim()) {
      stopTyping();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });
  };

  const getTypingIndicator = () => {
    const typingInRoom = Array.from(typingUsers).filter(userId => 
      activeRoom?.participants.some(p => p.userId === userId)
    );

    if (typingInRoom.length === 0) return '';
    if (typingInRoom.length === 1) return `${typingInRoom[0]} يكتب...`;
    return `${typingInRoom.length} أشخاص يكتبون...`;
  };

  const commonEmojis = ['😀', '😂', '❤️', '👍', '🎉', '🔥', '💯', '👏', '🙏', '💪', '🎯', '📚', '🏆'];

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, p: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Connection Status */}
        {!isConnected && (
          <Alert severity="warning" sx={{ m: 2 }}>
            <AlertTitle>غير متصل</AlertTitle>
            جاري محاولة الاتصال بخادم الدردشة...
          </Alert>
        )}

        {/* Chat Rooms List */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: '#F8F9FA' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
            💬 غرف الدردشة
          </Typography>
          
          <Grid container spacing={1}>
            {chatRooms.map((room) => (
              <Grid item xs={12} sm={6} md={4} key={room.id}>
                <Paper
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: activeRoom?.id === room.id ? '2px solid #2196F3' : '1px solid #E0E0E0',
                    bgcolor: activeRoom?.id === room.id ? '#E3F2FD' : 'white',
                    '&:hover': { bgcolor: '#F5F5F5' }
                  }}
                  onClick={() => joinRoom(room.id)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {room.arabicName}
                    </Typography>
                    <Badge badgeContent={room.unreadCount} color="error">
                      <Group />
                    </Badge>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {room.participants.length} مشارك
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {room.participants.filter(p => p.isOnline).map((participant, index) => (
                      <Avatar
                        key={index}
                        src={participant.avatar}
                        sx={{ width: 24, height: 24 }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Messages Area */}
        {activeRoom && (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Room Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: '#F8F9FA' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  {activeRoom.arabicName}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton onClick={() => setShowAttachments(!showAttachments)}>
                    <AttachFile />
                  </IconButton>
                  <IconButton onClick={() => leaveRoom()}>
                    <PhoneDisabled />
                  </IconButton>
                </Box>
              </Box>
              
              {/* Typing Indicator */}
              {getTypingIndicator() && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  {getTypingIndicator()}
                </Typography>
              )}
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {messages.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    لا توجد رسائل في هذه الغرفة. ابدأ المحادثة!
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {messages.map((message, index) => (
                    <ListItem
                      key={message.id}
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        p: 1,
                        mb: 1,
                        bgcolor: message.fromUserId === userId ? '#E3F2FD' : 'transparent',
                        borderRadius: 2,
                        '&:hover': { bgcolor: '#F5F5F5' }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', mb: 1 }}>
                        <Avatar
                          src={onlineUsers.find(u => u.id === message.fromUserId)?.avatar}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        />
                        
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {onlineUsers.find(u => u.id === message.fromUserId)?.username}
                          </Typography>
                          
                          <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                            {message.content}
                          </Typography>
                          
                          {message.attachments && (
                            <Box sx={{ mt: 1 }}>
                              {message.attachments.map((attachment, attIndex) => (
                                <Paper key={attIndex} sx={{ p: 1, mb: 1, display: 'inline-block', mr: 1 }}>
                                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                    📎 {attachment.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    ({(attachment.size / 1024).toFixed(1)} KB)
                                  </Typography>
                                </Paper>
                              ))}
                            </Box>
                          )}
                        </Box>
                        
                        <Box sx={{ ml: 'auto' }}>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(message.timestamp)}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Message Input */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: '#F8F9FA' }}>
              {selectedFile && (
                <Alert severity="info" sx={{ mb: 1 }}>
                  📎 {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  <Button
                    size="small"
                    onClick={() => setSelectedFile(null)}
                    sx={{ ml: 1 }}
                  >
                    إزالة
                  </Button>
                </Alert>
              )}
              
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onKeyUp={handleKeyUp}
                  placeholder="اكتب رسالتك..."
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        id="file-input"
                      />
                    )
                  }}
                />
                
                <IconButton onClick={() => document.getElementById('file-input')?.click()}>
                  <AttachFile />
                </IconButton>
                
                <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                  <EmojiEmotions />
                </IconButton>
                
                <IconButton onClick={() => setAnchorEl(anchorEl ? null : e.currentTarget)}>
                  <MoreVert />
                </IconButton>
                
                <Button
                  variant="contained"
                  endIcon={<Send />}
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() && !selectedFile}
                >
                  إرسال
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
