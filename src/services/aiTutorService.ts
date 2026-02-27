// AI Tutor Service with API Integration and Error Handling
import { useState } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  arabicContent?: string;
}

export interface ConversationSession {
  id: string;
  userId: string;
  messages: Message[];
  startTime: Date;
  lastActivity: Date;
  topic?: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
}

export interface TutorResponse {
  message: string;
  arabicMessage: string;
  suggestions?: string[];
  corrections?: Array<{
    original: string;
    corrected: string;
    explanation: string;
  }>;
  followUpQuestions?: string[];
}

class AITutorService {
  private apiEndpoint: string;
  private apiKey: string;
  private maxRetries: number = 3;
  private timeoutMs: number = 10000;

  constructor() {
    // Initialize with environment variables or defaults
    this.apiEndpoint = (globalThis as any).process?.env?.REACT_APP_AI_TUTOR_API || 'https://api.openai.com/v1/chat/completions';
    this.apiKey = (globalThis as any).process?.env?.REACT_APP_AI_TUTOR_API_KEY || '';
  }

  // Main chat function with error handling
  async sendMessage(
    message: string,
    conversationId: string,
    level: 'A1' | 'A2' | 'B1' | 'B2' = 'A1'
  ): Promise<TutorResponse> {
    try {
      const conversation = await this.getConversation(conversationId);
      const response = await this.callAIAPI(message, conversation, level);
      
      // Save the conversation
      await this.saveMessage(conversationId, message, 'user');
      await this.saveMessage(conversationId, response.message, 'assistant');
      
      return response;
    } catch (error) {
      console.error('Error in AI Tutor service:', error);
      return this.handleError(error);
    }
  }

  // Call AI API with retry logic
  private async callAIAPI(
    message: string,
    conversation: ConversationSession,
    level: string
  ): Promise<TutorResponse> {
    const systemPrompt = this.buildSystemPrompt(level, conversation.topic);
    const messages = this.buildMessagesArray(systemPrompt, conversation.messages, message);

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this.makeAPIRequest(messages);
        return this.parseAIResponse(response);
      } catch (error) {
        if (attempt === this.maxRetries) {
          throw error;
        }
        console.warn(`Attempt ${attempt} failed, retrying...`);
        await this.delay(1000 * attempt); // Exponential backoff
      }
    }

    throw new Error('Max retries exceeded');
  }

  // Make actual API request
  private async makeAPIRequest(messages: any[]): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
          response_format: { type: 'json_object' }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Build system prompt based on level and topic
  private buildSystemPrompt(level: string, topic?: string): string {
    const basePrompt = `You are an English language tutor for Arabic speakers at ${level} level. 
    Your role is to help students learn English in a friendly, patient, and encouraging way.
    
    Guidelines:
    - Use simple English appropriate for ${level} level
    - Provide Arabic translations when helpful
    - Correct mistakes gently with clear explanations
    - Ask follow-up questions to encourage conversation
    - Be encouraging and positive
    - Keep responses concise but thorough
    
    Response format (JSON):
    {
      "message": "Your English response",
      "arabicMessage": "Arabic translation if needed",
      "suggestions": ["alternative ways to say this"],
      "corrections": [{"original": "mistake", "corrected": "correction", "explanation": "why"}],
      "followUpQuestions": ["questions to continue conversation"]
    }`;

    if (topic) {
      return basePrompt + `\n\nCurrent topic: ${topic}`;
    }

    return basePrompt;
  }

  // Build messages array for API
  private buildMessagesArray(
    systemPrompt: string,
    conversationMessages: Message[],
    newMessage: string
  ): any[] {
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history (last 10 messages to avoid context limit)
    const recentMessages = conversationMessages.slice(-10);
    recentMessages.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });

    // Add new message
    messages.push({
      role: 'user',
      content: newMessage
    });

    return messages;
  }

  // Parse AI response
  private parseAIResponse(response: any): TutorResponse {
    try {
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in AI response');
      }

      const parsed = JSON.parse(content);
      return {
        message: parsed.message || 'I apologize, but I could not generate a response.',
        arabicMessage: parsed.arabicMessage || '',
        suggestions: parsed.suggestions || [],
        corrections: parsed.corrections || [],
        followUpQuestions: parsed.followUpQuestions || []
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
        message: 'I apologize, but I had trouble understanding that. Could you please rephrase?',
        arabicMessage: 'أعتذر، لكن واجهت صعوبة في الفهم. هل يمكنك إعادة الصياغة؟',
        suggestions: ['Try using simpler words', 'Check your spelling'],
        corrections: [],
        followUpQuestions: ['What would you like to learn about today?']
      };
    }
  }

  // Error handling
  private handleError(error: any): TutorResponse {
    if (error.name === 'AbortError') {
      return {
        message: 'The response took too long. Please try again.',
        arabicMessage: 'استغرق الرد وقتاً طويلاً. حاول مرة أخرى.',
        suggestions: ['Check your internet connection', 'Try a shorter message'],
        corrections: [],
        followUpQuestions: ['How can I help you today?']
      };
    }

    if (error.message?.includes('API Error')) {
      return {
        message: 'I am having some technical difficulties. Please try again in a moment.',
        arabicMessage: 'أواجه بعض الصعوبات التقنية. حاول مرة أخرى بعد قليل.',
        suggestions: ['Wait a moment and try again', 'Refresh the page'],
        corrections: [],
        followUpQuestions: ['Is there anything specific you would like to learn?']
      };
    }

    // Default error response
    return {
      message: 'Something went wrong. Please try again.',
      arabicMessage: 'حدث خطأ ما. حاول مرة أخرى.',
      suggestions: ['Check your internet connection', 'Try refreshing the page'],
      corrections: [],
      followUpQuestions: ['How can I assist you today?']
    };
  }

  // Conversation management
  async createConversation(userId: string, level: 'A1' | 'A2' | 'B1' | 'B2' = 'A1'): Promise<string> {
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const conversation: ConversationSession = {
      id: conversationId,
      userId,
      messages: [],
      startTime: new Date(),
      lastActivity: new Date(),
      level
    };

    // Save to localStorage (in production, use a proper database)
    const conversations = this.getStoredConversations();
    conversations[conversationId] = conversation;
    localStorage.setItem('ai_tutor_conversations', JSON.stringify(conversations));

    return conversationId;
  }

  async getConversation(conversationId: string): Promise<ConversationSession> {
    const conversations = this.getStoredConversations();
    const conversation = conversations[conversationId];
    
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return conversation;
  }

  async saveMessage(conversationId: string, content: string, role: 'user' | 'assistant'): Promise<void> {
    const conversations = this.getStoredConversations();
    const conversation = conversations[conversationId];
    
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date()
    };

    conversation.messages.push(message);
    conversation.lastActivity = new Date();
    
    localStorage.setItem('ai_tutor_conversations', JSON.stringify(conversations));
  }

  async deleteConversation(conversationId: string): Promise<void> {
    const conversations = this.getStoredConversations();
    delete conversations[conversationId];
    localStorage.setItem('ai_tutor_conversations', JSON.stringify(conversations));
  }

  async getUserConversations(userId: string): Promise<ConversationSession[]> {
    const conversations = this.getStoredConversations();
    return Object.values(conversations).filter(conv => conv.userId === userId);
  }

  // Helper functions
  private getStoredConversations(): Record<string, ConversationSession> {
    const stored = localStorage.getItem('ai_tutor_conversations');
    return stored ? JSON.parse(stored) : {};
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Utility methods
  async analyzeUserLevel(message: string): Promise<'A1' | 'A2' | 'B1' | 'B2'> {
    // Simple heuristic-based level detection
    const wordCount = message.split(' ').length;
    const hasComplexStructures = /[,.;:!?]/.test(message);
    const hasAdvancedVocabulary = /\b(although|however|therefore|moreover)\b/i.test(message);

    if (wordCount <= 5 && !hasComplexStructures) {
      return 'A1';
    } else if (wordCount <= 10 && hasComplexStructures) {
      return 'A2';
    } else if (wordCount <= 15 && hasAdvancedVocabulary) {
      return 'B1';
    } else {
      return 'B2';
    }
  }

  async suggestTopics(level: 'A1' | 'A2' | 'B1' | 'B2'): Promise<string[]> {
    const topics = {
      A1: ['Greetings and introductions', 'Family and friends', 'Daily routines', 'Food and drinks', 'Numbers and time'],
      A2: ['Hobbies and interests', 'Travel and holidays', 'Shopping', 'Weather', 'Work and school'],
      B1: ['Current events', 'Future plans', 'Experiences and memories', 'Opinions and feelings', 'Cultural differences'],
      B2: ['Social issues', 'Technology and society', 'Environmental topics', 'Career development', 'Academic subjects']
    };

    return topics[level] || topics.A1;
  }
}

// Export singleton instance
export const aiTutorService = new AITutorService();

// React hook for using AI Tutor
export const useAITutor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);

  const sendMessage = async (message: string, level: 'A1' | 'A2' | 'B1' | 'B2' = 'A1') => {
    setIsLoading(true);
    setError(null);

    try {
      if (!currentConversation) {
        const conversationId = await aiTutorService.createConversation('user', level);
        setCurrentConversation(conversationId);
      }

      const response = await aiTutorService.sendMessage(message, currentConversation!, level);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = async (level: 'A1' | 'A2' | 'B1' | 'B2' = 'A1') => {
    const conversationId = await aiTutorService.createConversation('user', level);
    setCurrentConversation(conversationId);
    return conversationId;
  };

  const clearConversation = async () => {
    if (currentConversation) {
      await aiTutorService.deleteConversation(currentConversation);
      setCurrentConversation(null);
    }
  };

  return {
    sendMessage,
    startNewConversation,
    clearConversation,
    isLoading,
    error,
    currentConversation
  };
};
