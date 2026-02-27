// Conversation Storage Service
import { useState } from 'react';
import type { Message, ConversationSession } from '../services/aiTutorService';

export interface ConversationStorage {
  saveConversation(conversation: ConversationSession): Promise<void>;
  getConversation(conversationId: string): Promise<ConversationSession | null>;
  getUserConversations(userId: string): Promise<ConversationSession[]>;
  deleteConversation(conversationId: string): Promise<void>;
  updateConversation(conversationId: string, updates: Partial<ConversationSession>): Promise<void>;
  searchConversations(userId: string, query: string): Promise<ConversationSession[]>;
  exportConversations(userId: string): Promise<string>;
  importConversations(userId: string, data: string): Promise<void>;
}

class LocalStorageConversationStorage implements ConversationStorage {
  private readonly storageKey = 'ai_tutor_conversations';

  async saveConversation(conversation: ConversationSession): Promise<void> {
    try {
      const conversations = await this.getAllConversations();
      conversations[conversation.id] = conversation;
      localStorage.setItem(this.storageKey, JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversation:', error);
      throw new Error('Failed to save conversation');
    }
  }

  async getConversation(conversationId: string): Promise<ConversationSession | null> {
    try {
      const conversations = await this.getAllConversations();
      const conversation = conversations[conversationId];
      
      if (!conversation) {
        return null;
      }

      // Convert string dates back to Date objects
      return {
        ...conversation,
        startTime: new Date(conversation.startTime),
        lastActivity: new Date(conversation.lastActivity),
        messages: conversation.messages.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      };
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }

  async getUserConversations(userId: string): Promise<ConversationSession[]> {
    try {
      const conversations = await this.getAllConversations();
      return Object.values(conversations)
        .filter(conv => conv.userId === userId)
        .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
    } catch (error) {
      console.error('Error getting user conversations:', error);
      return [];
    }
  }

  async deleteConversation(conversationId: string): Promise<void> {
    try {
      const conversations = await this.getAllConversations();
      delete conversations[conversationId];
      localStorage.setItem(this.storageKey, JSON.stringify(conversations));
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw new Error('Failed to delete conversation');
    }
  }

  async updateConversation(conversationId: string, updates: Partial<ConversationSession>): Promise<void> {
    try {
      const conversation = await this.getConversation(conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      const updatedConversation = { ...conversation, ...updates };
      await this.saveConversation(updatedConversation);
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw new Error('Failed to update conversation');
    }
  }

  async searchConversations(userId: string, query: string): Promise<ConversationSession[]> {
    try {
      const userConversations = await this.getUserConversations(userId);
      const lowercaseQuery = query.toLowerCase();

      return userConversations.filter(conv => {
        // Search in topic
        if (conv.topic && conv.topic.toLowerCase().includes(lowercaseQuery)) {
          return true;
        }

        // Search in messages
        return conv.messages.some(msg => 
          msg.content.toLowerCase().includes(lowercaseQuery) ||
          (msg.arabicContent && msg.arabicContent.includes(query))
        );
      });
    } catch (error) {
      console.error('Error searching conversations:', error);
      return [];
    }
  }

  async exportConversations(userId: string): Promise<string> {
    try {
      const conversations = await this.getUserConversations(userId);
      const exportData = {
        userId,
        exportDate: new Date().toISOString(),
        conversations: conversations.map(conv => ({
          id: conv.id,
          topic: conv.topic,
          level: conv.level,
          startTime: conv.startTime,
          lastActivity: conv.lastActivity,
          messageCount: conv.messages.length,
          messages: conv.messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            arabicContent: msg.arabicContent,
            timestamp: msg.timestamp
          }))
        }))
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting conversations:', error);
      throw new Error('Failed to export conversations');
    }
  }

  async importConversations(userId: string, data: string): Promise<void> {
    try {
      const importData = JSON.parse(data);
      
      if (!importData.conversations || !Array.isArray(importData.conversations)) {
        throw new Error('Invalid import data format');
      }

      for (const convData of importData.conversations) {
        const conversation: ConversationSession = {
          id: convData.id || `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          topic: convData.topic,
          level: convData.level || 'A1',
          startTime: new Date(convData.startTime),
          lastActivity: new Date(convData.lastActivity),
          messages: (convData.messages || []).map((msg: any) => ({
            id: msg.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: msg.role,
            content: msg.content,
            arabicContent: msg.arabicContent,
            timestamp: new Date(msg.timestamp)
          }))
        };

        await this.saveConversation(conversation);
      }
    } catch (error) {
      console.error('Error importing conversations:', error);
      throw new Error('Failed to import conversations');
    }
  }

  private async getAllConversations(): Promise<Record<string, any>> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error getting all conversations:', error);
      return {};
    }
  }

  // Storage management
  async getStorageSize(): Promise<number> {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? new Blob([data]).size : 0;
    } catch (error) {
      console.error('Error getting storage size:', error);
      return 0;
    }
  }

  async clearOldConversations(userId: string, daysOld: number = 30): Promise<void> {
    try {
      const conversations = await this.getUserConversations(userId);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const conversationsToDelete = conversations.filter(conv => 
        new Date(conv.lastActivity) < cutoffDate
      );

      for (const conv of conversationsToDelete) {
        await this.deleteConversation(conv.id);
      }
    } catch (error) {
      console.error('Error clearing old conversations:', error);
      throw new Error('Failed to clear old conversations');
    }
  }

  async getConversationStats(userId: string): Promise<{
    totalConversations: number;
    totalMessages: number;
    averageMessagesPerConversation: number;
    mostActiveDay: string;
    levelDistribution: Record<string, number>;
  }> {
    try {
      const conversations = await this.getUserConversations(userId);
      const totalConversations = conversations.length;
      const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0);
      const averageMessagesPerConversation = totalConversations > 0 ? totalMessages / totalConversations : 0;

      // Find most active day
      const dayCounts: Record<string, number> = {};
      conversations.forEach(conv => {
        const day = new Date(conv.lastActivity).toDateString();
        dayCounts[day] = (dayCounts[day] || 0) + 1;
      });
      
      const mostActiveDay = Object.entries(dayCounts).reduce((a, b) => 
        dayCounts[a[0]] > dayCounts[b[0]] ? a : b
      )[0];

      // Level distribution
      const levelDistribution: Record<string, number> = {};
      conversations.forEach(conv => {
        levelDistribution[conv.level] = (levelDistribution[conv.level] || 0) + 1;
      });

      return {
        totalConversations,
        totalMessages,
        averageMessagesPerConversation,
        mostActiveDay,
        levelDistribution
      };
    } catch (error) {
      console.error('Error getting conversation stats:', error);
      return {
        totalConversations: 0,
        totalMessages: 0,
        averageMessagesPerConversation: 0,
        mostActiveDay: '',
        levelDistribution: {}
      };
    }
  }
}

// Export singleton instance
export const conversationStorage = new LocalStorageConversationStorage();

// React hook for conversation management
export const useConversationStorage = (userId: string) => {
  const [conversations, setConversations] = useState<ConversationSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userConversations = await conversationStorage.getUserConversations(userId);
      setConversations(userConversations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      await conversationStorage.deleteConversation(conversationId);
      setConversations((prev: ConversationSession[]) => prev.filter((conv: ConversationSession) => conv.id !== conversationId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete conversation');
    }
  };

  const searchConversations = async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await conversationStorage.searchConversations(userId, query);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search conversations');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const exportConversations = async () => {
    try {
      return await conversationStorage.exportConversations(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export conversations');
      throw err;
    }
  };

  const importConversations = async (data: string) => {
    try {
      await conversationStorage.importConversations(userId, data);
      await loadConversations(); // Reload conversations
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import conversations');
      throw err;
    }
  };

  const getStats = async () => {
    try {
      return await conversationStorage.getConversationStats(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get stats');
      return null;
    }
  };

  return {
    conversations,
    loading,
    error,
    loadConversations,
    deleteConversation,
    searchConversations,
    exportConversations,
    importConversations,
    getStats
  };
};
