import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationService } from '../services';

const { width } = Dimensions.get('window');
const MOBILE_PREVIEW_MESSAGE = 'Mobile preview only. Live AI integration will be enabled after the web platform is finalized.';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'quick_reply' | 'audio';
}

interface QuickReply {
  id: string;
  text: string;
  icon: string;
  color: string;
}

const AIChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const quickReplies: QuickReply[] = [
    { id: '1', text: 'Speaking Practice', icon: '🗣️', color: '#4CAF50' },
    { id: '2', text: 'Grammar Help', icon: '📝', color: '#2196F3' },
    { id: '3', text: 'Vocabulary', icon: '📚', color: '#FF9800' },
    { id: '4', text: 'Writing Practice', icon: '✍️', color: '#9C27B0' },
  ];

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: '1',
      text: `Hello! I'm your AI English Teacher! 👋\n\n${MOBILE_PREVIEW_MESSAGE}\n\nWhat would you like to practice today?`,
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    
    animateContent();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const animateContent = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setShowQuickReplies(false);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (reply: QuickReply) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `I want to practice ${reply.text.toLowerCase()}`,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setShowQuickReplies(false);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateQuickReplyResponse(reply.text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello there! 👋\n\nHow can I help you with your English learning today?";
    }
    
    if (input.includes('grammar')) {
      return "Great choice! Grammar is fundamental to English. \n\nWhat specific grammar topic would you like to work on? For example:\n• Tenses (past, present, future)\n• Articles (a, an, the)\n• Prepositions (in, on, at)\n• Conditionals";
    }
    
    if (input.includes('vocabulary')) {
      return "Excellent! Building vocabulary is key to fluency. \n\nWhat type of vocabulary would you like to learn?\n• Daily conversation\n• Business English\n• Travel phrases\n• Academic vocabulary";
    }
    
    if (input.includes('speaking') || input.includes('talk')) {
      return "Perfect! Speaking practice is essential. \n\nLet's start with a simple conversation. Tell me about your day in English, and I'll help you improve your speaking skills!";
    }
    
    return "That's interesting! Let me help you with that. \n\nCould you tell me more about what you'd like to learn or practice? I'm here to help with grammar, vocabulary, speaking, and writing!";
  };

  const generateQuickReplyResponse = (topic: string): string => {
    switch (topic) {
      case 'Speaking Practice':
        return "Great choice! Let's practice speaking. 🗣️\n\nImagine you're ordering food at a restaurant. Here's a common phrase: 'I'd like to order the steak, please.'\n\nNow you try! What would you say if you wanted to order pasta?";
      
      case 'Grammar Help':
        return "Perfect! Grammar is the foundation of good English. 📝\n\nLet's start with something basic. Can you tell me the difference between 'a' and 'an'?\n\nHint: Think about the first sound of the word that follows!";
      
      case 'Vocabulary':
        return "Excellent! Building vocabulary is crucial. 📚\n\nLet's learn some common travel words today:\n• Boarding pass - تذكرة الصعود\n• Luggage - الأمتعة\n• Departure - المغادرة\n• Arrival - الوصول\n\nWhich word would you like to practice using in a sentence?";
      
      case 'Writing Practice':
        return "Wonderful! Writing helps reinforce what you learn. ✍️\n\nLet's start with a simple exercise. Write a short paragraph (3-4 sentences) about your favorite hobby.\n\nDon't worry about perfection - I'll help you improve it!";
      
      default:
        return "Great! Let's work on that together. What specific aspect would you like to focus on?";
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    
    return (
      <View key={message.id} style={styles.messageContainer}>
        {!isUser && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🤖</Text>
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.aiBubble,
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userText : styles.aiText,
          ]}>
            {message.text}
          </Text>
          <Text style={[
            styles.messageTime,
            isUser ? styles.userTime : styles.aiTime,
          ]}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        
        {isUser && (
          <View style={[styles.avatar, styles.userAvatar]}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
        )}
      </View>
    );
  };

  const renderTypingIndicator = () => (
    <View style={styles.messageContainer}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>🤖</Text>
      </View>
      <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
        <View style={styles.typingIndicator}>
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
        </View>
      </View>
    </View>
  );

  const renderQuickRepliesSection = () => (
    <Animated.View style={[styles.quickRepliesContainer, { opacity: fadeAnim }]}>
      <Text style={styles.quickRepliesTitle}>Choose a topic:</Text>
      
      <View style={styles.quickRepliesGrid}>
        {quickReplies.map((reply) => (
          <TouchableOpacity
            key={reply.id}
            style={[
              styles.quickReplyButton,
              { borderColor: reply.color },
            ]}
            onPress={() => handleQuickReply(reply)}
          >
            <Text style={styles.quickReplyIcon}>{reply.icon}</Text>
            <Text style={[styles.quickReplyText, { color: reply.color }]}>
              {reply.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.previewBanner}>
        <Icon name="info-outline" size={18} color="#7A4B00" />
        <Text style={styles.previewBannerText}>{MOBILE_PREVIEW_MESSAGE}</Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => NavigationService.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#424242" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>🤖</Text>
          </View>
          <View style={styles.aiInfo}>
            <Text style={styles.aiName}>AI English Master</Text>
            <Text style={styles.aiStatus}>● Online</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.optionsButton}>
          <Icon name="more-vert" size={24} color="#424242" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map(renderMessage)}
        {isTyping && renderTypingIndicator()}
        {showQuickReplies && renderQuickRepliesSection()}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.voiceButton}>
          <Icon name="mic" size={24} color="#4CAF50" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.textInput}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
        >
          <Icon name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Quick actions:</Text>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionText}>Help</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionText}>Translate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionText}>Correct</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF5',
  },
  previewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFF3CD',
    borderBottomWidth: 1,
    borderBottomColor: '#F2D58B',
  },
  previewBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#7A4B00',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 20,
    backgroundColor: '#4CAF50',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiAvatarText: {
    fontSize: 16,
  },
  aiInfo: {
    justifyContent: 'center',
  },
  aiName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  aiStatus: {
    fontSize: 10,
    color: '#4CAF50',
  },
  optionsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatar: {
    backgroundColor: '#2196F3',
    marginRight: 0,
    marginLeft: 12,
  },
  avatarText: {
    fontSize: 14,
  },
  messageBubble: {
    maxWidth: width - 100,
    padding: 16,
    borderRadius: 16,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  userBubble: {
    backgroundColor: '#4CAF50',
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  aiText: {
    color: '#424242',
  },
  userText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 8,
  },
  aiTime: {
    color: '#757575',
  },
  userTime: {
    color: '#E8F5E8',
  },
  typingBubble: {
    padding: 12,
    minWidth: 80,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#757575',
    marginHorizontal: 2,
  },
  quickRepliesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quickRepliesTitle: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 15,
  },
  quickRepliesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickReplyButton: {
    width: '48%',
    height: 55,
    borderRadius: 20,
    backgroundColor: '#F8FAF5',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  quickReplyIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  quickReplyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#F5F5F5',
    marginRight: 12,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  quickActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  quickActionsTitle: {
    fontSize: 10,
    color: '#757575',
    marginRight: 10,
  },
  quickActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#E8F5E8',
    marginRight: 8,
  },
  quickActionText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#2E7D32',
  },
});

export default AIChatScreen;
