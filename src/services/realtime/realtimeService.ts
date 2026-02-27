import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import authService from '../auth/authService';

// Real-time Event Types
export interface RealtimeEvent {
  type: string;
  payload: any;
  timestamp: number;
  userId?: string;
  roomId?: string;
}

// Chat Message
export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  message: string;
  timestamp: number;
  type: 'text' | 'image' | 'file' | 'system';
  roomId: string;
  replyTo?: string;
  reactions?: {
    emoji: string;
    count: number;
    users: string[];
  }[];
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  metadata?: any;
}

// User Status
export interface UserStatus {
  userId: string;
  username: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: number;
  currentActivity?: string;
}

// Room/Channel
export interface Room {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  members: string[];
  admins: string[];
  createdAt: number;
  createdBy: string;
  lastActivity?: number;
}

// Typing Indicator
export interface TypingIndicator {
  userId: string;
  username: string;
  roomId: string;
  isTyping: boolean;
  timestamp: number;
}

// Voice Call
export interface VoiceCall {
  id: string;
  roomId: string;
  initiator: string;
  participants: string[];
  status: 'ringing' | 'active' | 'ended';
  startTime?: number;
  endTime?: number;
}

// Screen Share
export interface ScreenShare {
  id: string;
  userId: string;
  roomId: string;
  stream?: MediaStream;
  status: 'active' | 'ended';
  startTime: number;
}

// Whiteboard
export interface WhiteboardData {
  roomId: string;
  elements: any[];
  cursor?: {
    userId: string;
    x: number;
    y: number;
  };
  lastModified: number;
  modifiedBy: string;
}

// Real-time Service Class
class RealtimeService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private eventListeners = new Map<string, Function[]>();
  private typingTimers = new Map<string, NodeJS.Timeout>();
  private currentRooms = new Set<string>();

  // Connection Management
  async connect(): Promise<void> {
    if (this.socket?.connected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      const token = authService.getAuthHeader();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const serverUrl = process.env.REACT_APP_REALTIME_URL || 'http://localhost:3001';

      this.socket = io(serverUrl, {
        auth: token,
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
      });

      this.setupEventHandlers();
      
      return new Promise((resolve, reject) => {
        this.socket!.once('connect', () => {
          console.log('✅ Connected to real-time server');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          resolve();
        });

        this.socket!.once('connect_error', (error) => {
          console.error('❌ Failed to connect to real-time server:', error);
          this.isConnecting = false;
          reject(error);
        });
      });
    } catch (error) {
      this.isConnecting = false;
      throw error;
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentRooms.clear();
    this.clearTypingTimers();
    console.log('🔌 Disconnected from real-time server');
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ Real-time connection established');
      toast.success('متصل بالخادم في الوقت الفعلي');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from real-time server:', reason);
      
      if (reason === 'io server disconnect') {
        // Server disconnected, reconnect manually
        this.connect();
      } else {
        toast.warning('انقطع الاتصال بالخادم في الوقت الفعلي');
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Real-time connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error('فشل الاتصال بالخادم في الوقت الفعلي');
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
      toast.success('تم إعادة الاتصال بالخادم في الوقت الفعلي');
    });

    // Authentication events
    this.socket.on('authenticated', (data) => {
      console.log('✅ Real-time authentication successful:', data);
    });

    this.socket.on('authentication_error', (error) => {
      console.error('❌ Real-time authentication failed:', error);
      toast.error('فشل المصادقة في الوقت الفعلي');
    });

    // Room events
    this.socket.on('room_joined', (data) => {
      console.log('📥 Joined room:', data);
      this.currentRooms.add(data.roomId);
      this.emit('room_joined', data);
    });

    this.socket.on('room_left', (data) => {
      console.log('📤 Left room:', data);
      this.currentRooms.delete(data.roomId);
      this.emit('room_left', data);
    });

    // Message events
    this.socket.on('new_message', (message: ChatMessage) => {
      console.log('💬 New message received:', message);
      this.emit('new_message', message);
      
      // Show notification if not in the same room
      if (message.roomId && !this.currentRooms.has(message.roomId)) {
        toast.info(`${message.username}: ${message.message}`);
      }
    });

    this.socket.on('message_updated', (data) => {
      console.log('✏️ Message updated:', data);
      this.emit('message_updated', data);
    });

    this.socket.on('message_deleted', (data) => {
      console.log('🗑️ Message deleted:', data);
      this.emit('message_deleted', data);
    });

    // Typing events
    this.socket.on('user_typing', (data: TypingIndicator) => {
      console.log('⌨️ User typing:', data);
      this.emit('user_typing', data);
      this.handleTypingIndicator(data);
    });

    // User status events
    this.socket.on('user_status_changed', (status: UserStatus) => {
      console.log('👤 User status changed:', status);
      this.emit('user_status_changed', status);
    });

    // Notification events
    this.socket.on('notification', (notification: Notification) => {
      console.log('🔔 New notification:', notification);
      this.emit('notification', notification);
      this.showNotification(notification);
    });

    // Voice call events
    this.socket.on('voice_call_started', (call: VoiceCall) => {
      console.log('📞 Voice call started:', call);
      this.emit('voice_call_started', call);
      toast.info(`مكالمة صوتية من ${call.initiator}`);
    });

    this.socket.on('voice_call_ended', (call: VoiceCall) => {
      console.log('📞 Voice call ended:', call);
      this.emit('voice_call_ended', call);
    });

    // Screen share events
    this.socket.on('screen_share_started', (share: ScreenShare) => {
      console.log('🖥️ Screen share started:', share);
      this.emit('screen_share_started', share);
    });

    this.socket.on('screen_share_ended', (share: ScreenShare) => {
      console.log('🖥️ Screen share ended:', share);
      this.emit('screen_share_ended', share);
    });

    // Whiteboard events
    this.socket.on('whiteboard_updated', (data: WhiteboardData) => {
      console.log('🎨 Whiteboard updated:', data);
      this.emit('whiteboard_updated', data);
    });

    // Error events
    this.socket.on('error', (error) => {
      console.error('❌ Real-time error:', error);
      toast.error('حدث خطأ في الاتصال في الوقت الفعلي');
    });
  }

  // Room Management
  async joinRoom(roomId: string): Promise<void> {
    if (!this.socket?.connected) {
      await this.connect();
    }

    this.socket!.emit('join_room', { roomId });
  }

  async leaveRoom(roomId: string): Promise<void> {
    if (this.socket?.connected) {
      this.socket.emit('leave_room', { roomId });
    }
  }

  async createRoom(room: Omit<Room, 'id' | 'createdAt'>): Promise<Room> {
    if (!this.socket?.connected) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('create_room', room, (response: { success: boolean; room?: Room; error?: string }) => {
        if (response.success && response.room) {
          resolve(response.room);
        } else {
          reject(new Error(response.error || 'Failed to create room'));
        }
      });
    });
  }

  // Message Management
  async sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
    if (!this.socket?.connected) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('send_message', message, (response: { success: boolean; message?: ChatMessage; error?: string }) => {
        if (response.success && response.message) {
          resolve(response.message);
        } else {
          reject(new Error(response.error || 'Failed to send message'));
        }
      });
    });
  }

  async updateMessage(messageId: string, updates: Partial<ChatMessage>): Promise<ChatMessage> {
    if (!this.socket?.connected) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('update_message', { messageId, updates }, (response: { success: boolean; message?: ChatMessage; error?: string }) => {
        if (response.success && response.message) {
          resolve(response.message);
        } else {
          reject(new Error(response.error || 'Failed to update message'));
        }
      });
    });
  }

  async deleteMessage(messageId: string): Promise<void> {
    if (!this.socket?.connected) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('delete_message', { messageId }, (response: { success: boolean; error?: string }) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || 'Failed to delete message'));
        }
      });
    });
  }

  // Typing Indicators
  sendTypingIndicator(roomId: string, isTyping: boolean): void {
    if (this.socket?.connected) {
      this.socket.emit('typing', { roomId, isTyping });
    }
  }

  private handleTypingIndicator(data: TypingIndicator): void {
    const timerKey = `${data.userId}-${data.roomId}`;
    
    // Clear existing timer
    if (this.typingTimers.has(timerKey)) {
      clearTimeout(this.typingTimers.get(timerKey)!);
    }

    if (data.isTyping) {
      // Set timer to stop typing after 3 seconds
      const timer = setTimeout(() => {
        this.emit('user_stopped_typing', data);
      }, 3000);
      this.typingTimers.set(timerKey, timer);
    }
  }

  private clearTypingTimers(): void {
    this.typingTimers.forEach(timer => clearTimeout(timer));
    this.typingTimers.clear();
  }

  // User Status
  async updateStatus(status: Partial<UserStatus>): Promise<void> {
    if (!this.socket?.connected) {
      await this.connect();
    }

    this.socket!.emit('update_status', status);
  }

  async getUserStatus(userId: string): Promise<UserStatus | null> {
    if (!this.socket?.connected) {
      await this.connect();
    }

    return new Promise((resolve) => {
      this.socket!.emit('get_user_status', { userId }, (response: { status?: UserStatus }) => {
        resolve(response.status || null);
      });
    });
  }

  // Voice Calls
  async startVoiceCall(roomId: string, participants: string[]): Promise<VoiceCall> {
    if (!this.socket?.connected) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('start_voice_call', { roomId, participants }, (response: { success: boolean; call?: VoiceCall; error?: string }) => {
        if (response.success && response.call) {
          resolve(response.call);
        } else {
          reject(new Error(response.error || 'Failed to start voice call'));
        }
      });
    });
  }

  async endVoiceCall(callId: string): Promise<void> {
    if (this.socket?.connected) {
      this.socket.emit('end_voice_call', { callId });
    }
  }

  // Screen Sharing
  async startScreenShare(roomId: string): Promise<ScreenShare> {
    if (!this.socket?.connected) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('start_screen_share', { roomId }, (response: { success: boolean; share?: ScreenShare; error?: string }) => {
        if (response.success && response.share) {
          resolve(response.share);
        } else {
          reject(new Error(response.error || 'Failed to start screen share'));
        }
      });
    });
  }

  async endScreenShare(shareId: string): Promise<void> {
    if (this.socket?.connected) {
      this.socket.emit('end_screen_share', { shareId });
    }
  }

  // Whiteboard
  async updateWhiteboard(data: Partial<WhiteboardData>): Promise<void> {
    if (!this.socket?.connected) {
      await this.connect();
    }

    this.socket!.emit('update_whiteboard', data);
  }

  // Notifications
  async markNotificationRead(notificationId: string): Promise<void> {
    if (!this.socket?.connected) {
      await this.connect();
    }

    this.socket!.emit('mark_notification_read', { notificationId });
  }

  private showNotification(notification: Notification): void {
    // Show toast notification
    const toastOptions = {
      onClick: () => {
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
        this.markNotificationRead(notification.id);
      },
    };

    switch (notification.type) {
      case 'success':
        toast.success(notification.message, toastOptions);
        break;
      case 'warning':
        toast.warning(notification.message, toastOptions);
        break;
      case 'error':
        toast.error(notification.message, toastOptions);
        break;
      default:
        toast.info(notification.message, toastOptions);
    }

    // Show browser notification if permitted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
      });
    }
  }

  // Event Management
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Utility Methods
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getCurrentRooms(): string[] {
    return Array.from(this.currentRooms);
  }

  async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Cleanup
  destroy(): void {
    this.disconnect();
    this.eventListeners.clear();
    this.clearTypingTimers();
  }
}

// Create singleton instance
const realtimeService = new RealtimeService();

export default realtimeService;
export type { 
  RealtimeEvent, 
  ChatMessage, 
  Notification, 
  UserStatus, 
  Room, 
  TypingIndicator, 
  VoiceCall, 
  ScreenShare, 
  WhiteboardData 
};
