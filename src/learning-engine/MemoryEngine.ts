// Memory Engine Implementation for Long-term Retention
export interface MemoryItem {
  id: string;
  userId: string;
  content: {
    type: 'vocabulary' | 'grammar' | 'concept' | 'skill' | 'example';
    data: any;
    context?: string;
    importance: number; // 1-10
    difficulty: number; // 1-10
  };
  memory: {
    strength: number; // 0-100, how well remembered
    lastAccessed: Date;
    accessCount: number;
    retentionRate: number; // 0-100, how well retained over time
    forgettingCurve: number[]; // retention over time points
    spacedRepetition: {
      interval: number; // days until next review
      easeFactor: number; // 0-3, how easy to recall
      repetitionCount: number;
      nextReview: Date;
    };
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    source: 'learning' | 'practice' | 'assessment' | 'review';
    tags: string[];
  };
}

export interface SpacedRepetitionSchedule {
  itemId: string;
  userId: string;
  schedule: {
    interval: number; // days
    easeFactor: number; // 0-3
    repetitionCount: number;
    nextReview: Date;
    reviewHistory: {
      date: Date;
      performance: number; // 0-5
      timeSpent: number; // seconds
      success: boolean;
    }[];
  };
  algorithm: 'sm2' | 'fsrs' | 'anki' | 'custom';
}

export interface MemoryAnalytics {
  userId: string;
  totalItems: number;
  averageRetention: number;
  averageStrength: number;
  forgettingRate: number; // percentage per month
  optimalReviewInterval: number; // days
  memoryCapacity: number; // estimated items can retain
  learningEfficiency: number; // items learned per week
  weakAreas: string[];
  strongAreas: string[];
  recommendations: string[];
}

export interface MemoryRetrieval {
  itemId: string;
  retrievalType: 'recall' | 'recognition' | 'application';
  context: string;
  performance: {
    accuracy: number; // 0-100
    responseTime: number; // milliseconds
    confidence: number; // 1-5
    hints: number;
    attempts: number;
  };
  timestamp: Date;
}

class MemoryEngine {
  private memoryItems: Map<string, MemoryItem> = new Map();
  private schedules: Map<string, SpacedRepetitionSchedule> = new Map();
  private retrievals: Map<string, MemoryRetrieval[]> = new Map();
  private analytics: Map<string, MemoryAnalytics> = new Map();

  constructor() {
    // Initialize with default forgetting curve parameters
    this.initializeDefaultSettings();
  }

  // Initialize default memory settings
  private initializeDefaultSettings(): void {
    // These are based on Ebbinghaus forgetting curve research
    const defaultForgettingCurve = [
      { time: 1, retention: 0.84 }, // 1 day
      { time: 7, retention: 0.63 }, // 1 week
      { time: 30, retention: 0.46 }, // 1 month
      { time: 90, retention: 0.34 }, // 3 months
      { time: 180, retention: 0.28 }, // 6 months
      { time: 365, retention: 0.21 }  // 1 year
    ];
  }

  // Store memory item
  storeMemoryItem(userId: string, content: any, type: MemoryItem['content']['type'], context?: string): MemoryItem {
    const itemId = `memory-${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const memoryItem: MemoryItem = {
      id: itemId,
      userId,
      content: {
        type,
        data: content,
        context,
        importance: this.calculateImportance(content, type),
        difficulty: this.calculateDifficulty(content, type)
      },
      memory: {
        strength: 50, // Initial strength
        lastAccessed: new Date(),
        accessCount: 1,
        retentionRate: 50, // Initial retention
        forgettingCurve: this.generateForgettingCurve(),
        spacedRepetition: this.calculateInitialSchedule(itemId)
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'learning',
        tags: this.extractTags(content, type)
      }
    };

    this.memoryItems.set(itemId, memoryItem);
    this.initializeSchedule(itemId, userId);

    return memoryItem;
  }

  // Calculate importance based on content
  private calculateImportance(content: any, type: string): number {
    // Base importance by type
    const typeImportance: Record<string, number> = {
      'vocabulary': 7,
      'grammar': 8,
      'concept': 9,
      'skill': 10,
      'example': 5
    };

    let importance = typeImportance[type] || 5;

    // Adjust based on content characteristics
    if (typeof content === 'object') {
      if (content.frequency) importance += Math.min(content.frequency, 3);
      if (content.relevance) importance += Math.min(content.relevance, 2);
      if (content.complexity) importance += Math.min(content.complexity, 2);
    }

    return Math.max(1, Math.min(importance, 10));
  }

  // Calculate difficulty based on content
  private calculateDifficulty(content: any, type: string): number {
    // Base difficulty by type
    const typeDifficulty: Record<string, number> = {
      'vocabulary': 4,
      'grammar': 6,
      'concept': 7,
      'skill': 5,
      'example': 3
    };

    let difficulty = typeDifficulty[type] || 5;

    // Adjust based on content characteristics
    if (typeof content === 'object') {
      if (content.abstractness) difficulty += Math.min(content.abstractness, 3);
      if (content.length) difficulty += Math.min(content.length / 100, 2);
      if (content.prerequisites) difficulty += Math.min(content.prerequisites.length, 2);
    }

    return Math.max(1, Math.min(difficulty, 10));
  }

  // Generate forgetting curve
  private generateForgettingCurve(): number[] {
    // Simplified Ebbinghaus curve
    return [
      100, // Initial (time 0)
      84,  // 1 day
      74,  // 3 days
      68,  // 1 week
      58,  // 2 weeks
      50,  // 1 month
      40,  // 2 months
      35,  // 3 months
      30,  // 6 months
      25   // 1 year
    ];
  }

  // Calculate initial spaced repetition schedule
  private calculateInitialSchedule(itemId: string): MemoryItem['memory']['spacedRepetition'] {
    return {
      interval: 1, // Review tomorrow
      easeFactor: 2.5, // Start relatively easy
      repetitionCount: 1,
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };
  }

  // Initialize spaced repetition schedule
  private initializeSchedule(itemId: string, userId: string): void {
    const schedule: SpacedRepetitionSchedule = {
      itemId,
      userId,
      schedule: {
        interval: 1,
        easeFactor: 2.5,
        repetitionCount: 1,
        nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
        reviewHistory: []
      },
      algorithm: 'sm2' // SuperMemo 2 algorithm
    };

    this.schedules.set(itemId, schedule);
  }

  // Update memory based on retrieval
  updateMemoryFromRetrieval(retrieval: MemoryRetrieval): void {
    const memoryItem = this.memoryItems.get(retrieval.itemId);
    if (!memoryItem) return;

    // Update memory strength based on performance
    const performanceScore = this.calculatePerformanceScore(retrieval.performance);
    const newStrength = this.updateMemoryStrength(memoryItem.memory.strength, performanceScore);
    
    // Update spaced repetition schedule
    const newSchedule = this.calculateNextSchedule(
      memoryItem.memory.spacedRepetition,
      retrieval.performance
    );

    // Update memory item
    memoryItem.memory = {
      ...memoryItem.memory,
      strength: newStrength,
      lastAccessed: retrieval.timestamp,
      accessCount: memoryItem.memory.accessCount + 1,
      retentionRate: this.calculateRetentionRate(newStrength, memoryItem.memory.accessCount),
      spacedRepetition: newSchedule
    };

    memoryItem.metadata.updatedAt = new Date();
    this.memoryItems.set(retrieval.itemId, memoryItem);
    this.schedules.set(retrieval.itemId, newSchedule.schedule);

    // Store retrieval
    if (!this.retrievals.has(retrieval.itemId)) {
      this.retrievals.set(retrieval.itemId, []);
    }
    this.retrievals.get(retrieval.itemId)!.push(retrieval);
  }

  // Calculate performance score
  private calculatePerformanceScore(performance: MemoryRetrieval['performance']): number {
    let score = 0;
    
    // Accuracy scoring (0-50 points)
    score += performance.accuracy * 0.5;
    
    // Response time scoring (0-20 points, faster is better)
    if (performance.responseTime < 1000) score += 20;
    else if (performance.responseTime < 3000) score += 15;
    else if (performance.responseTime < 5000) score += 10;
    else if (performance.responseTime < 10000) score += 5;
    
    // Confidence scoring (0-20 points)
    score += performance.confidence * 4;
    
    // Hints penalty (0-10 points)
    score -= Math.min(performance.hints * 2, 10);
    
    // Attempts penalty (0-10 points)
    score -= Math.min((performance.attempts - 1) * 2, 10);
    
    return Math.max(0, Math.min(score, 100));
  }

  // Update memory strength using SM-2 algorithm
  private updateMemoryStrength(currentStrength: number, performanceScore: number): number {
    const easeFactor = performanceScore / 100; // Convert to 0-1 scale
    const newEaseFactor = (currentStrength * 0.85) + (easeFactor * 0.15);
    
    return Math.max(0, Math.min(newEaseFactor * 100, 100));
  }

  // Calculate next review schedule using SM-2
  private calculateNextSchedule(currentSchedule: MemoryItem['memory']['spacedRepetition'], performance: MemoryRetrieval['performance']): MemoryItem['memory']['spacedRepetition'] {
    const performanceScore = this.calculatePerformanceScore(performance);
    const easeFactor = performanceScore / 100;
    
    // Calculate new interval using SM-2 formula
    const newInterval = Math.ceil(
      currentSchedule.interval * 
      Math.pow(currentSchedule.easeFactor, 2.5) * 
      Math.pow(easeFactor, 2.5)
    );
    
    // Limit interval to reasonable range (1 day to 6 months)
    const clampedInterval = Math.max(1, Math.min(newInterval, 180));
    
    // Calculate next review date
    const nextReview = new Date(Date.now() + clampedInterval * 24 * 60 * 60 * 1000);
    
    return {
      interval: clampedInterval,
      easeFactor: Math.max(0.3, easeFactor),
      repetitionCount: currentSchedule.repetitionCount + 1,
      nextReview,
      reviewHistory: [
        ...currentSchedule.reviewHistory,
        {
          date: new Date(),
          performance: performanceScore,
          timeSpent: performance.responseTime,
          success: performance.accuracy >= 70
        }
      ]
    };
  }

  // Calculate retention rate
  private calculateRetentionRate(strength: number, accessCount: number): number {
    // Simplified retention calculation
    // Higher strength and more access = better retention
    const accessBonus = Math.min(accessCount * 2, 20);
    return Math.min(strength + accessBonus, 100);
  }

  // Extract tags from content
  private extractTags(content: any, type: string): string[] {
    const tags: string[] = [];
    
    // Add type-based tags
    tags.push(type);
    
    // Extract content-based tags
    if (typeof content === 'object') {
      if (content.category) tags.push(content.category);
      if (content.topic) tags.push(content.topic);
      if (content.level) tags.push(content.level);
      if (content.keywords) {
        content.keywords.forEach((keyword: string) => tags.push(keyword));
      }
    }
    
    return [...new Set(tags)]; // Remove duplicates
  }

  // Get items due for review
  getDueReviews(userId: string, limit: number = 20): MemoryItem[] {
    const now = new Date();
    const dueItems: MemoryItem[] = [];
    
    this.schedules.forEach((schedule, itemId) => {
      if (schedule.userId === userId && schedule.schedule.nextReview <= now) {
        const item = this.memoryItems.get(itemId);
        if (item) {
          dueItems.push(item);
        }
      }
    });
    
    // Sort by urgency (earliest due first)
    return dueItems
      .sort((a, b) => a.memory.spacedRepetition.nextReview.getTime() - b.memory.spacedRepetition.nextReview.getTime())
      .slice(0, limit);
  }

  // Get memory analytics
  getMemoryAnalytics(userId: string): MemoryAnalytics {
    const userItems = Array.from(this.memoryItems.values())
      .filter(item => item.userId === userId);
    
    if (userItems.length === 0) {
      return this.createDefaultAnalytics(userId);
    }

    const totalItems = userItems.length;
    const averageRetention = userItems.reduce((sum, item) => sum + item.memory.retentionRate, 0) / totalItems;
    const averageStrength = userItems.reduce((sum, item) => sum + item.memory.strength, 0) / totalItems;
    
    // Calculate forgetting rate
    const retrievals = Array.from(this.retrievals.values())
      .flatMap(retrievalList => retrievalList)
      .filter(retrieval => retrieval.some(r => r.itemId === retrieval.itemId));
    
    const totalRetrievals = retrievals.length;
    const successfulRetrievals = retrievals.filter(r => r.performance.accuracy >= 70).length;
    const forgettingRate = totalRetrievals > 0 ? ((totalRetrievals - successfulRetrievals) / totalRetrievals) * 100 : 0;
    
    // Calculate optimal review interval
    const successfulSchedules = Array.from(this.schedules.values())
      .filter(schedule => schedule.userId === userId)
      .flatMap(schedule => schedule.schedule.reviewHistory)
      .filter(review => review.success);
    
    const optimalInterval = successfulSchedules.length > 0 
      ? successfulSchedules.reduce((sum, review) => sum + review.performance, 0) / successfulSchedules.length
      : 7; // Default to 1 week

    // Identify weak and strong areas
    const weakAreas: string[] = [];
    const strongAreas: string[] = [];
    
    const areaPerformance = new Map<string, { total: number; successful: number }>();
    
    userItems.forEach(item => {
      const itemTags = item.metadata.tags;
      itemTags.forEach(tag => {
        if (!areaPerformance.has(tag)) {
          areaPerformance.set(tag, { total: 0, successful: 0 });
        }
        areaPerformance.get(tag)!.total++;
        if (item.memory.retentionRate >= 70) {
          areaPerformance.get(tag)!.successful++;
        }
      });
    });
    
    areaPerformance.forEach((performance, area) => {
      const successRate = performance.total > 0 ? (performance.successful / performance.total) * 100 : 0;
      if (successRate < 60) {
        weakAreas.push(area);
      } else if (successRate >= 80) {
        strongAreas.push(area);
      }
    });

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (averageRetention < 60) {
      recommendations.push('Increase review frequency');
      recommendations.push('Focus on weak areas identified');
    }
    
    if (forgettingRate > 40) {
      recommendations.push('Use spaced repetition more consistently');
      recommendations.push('Improve initial encoding strategies');
    }
    
    if (optimalInterval > 14) {
      recommendations.push('Consider shorter review intervals');
    }

    return {
      userId,
      totalItems,
      averageRetention,
      averageStrength,
      forgettingRate,
      optimalReviewInterval,
      memoryCapacity: Math.round(averageStrength * 0.8), // Estimate capacity
      learningEfficiency: this.calculateLearningEfficiency(userId),
      weakAreas,
      strongAreas,
      recommendations
    };
  }

  // Calculate learning efficiency
  private calculateLearningEfficiency(userId: number): number {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentItems = Array.from(this.memoryItems.values())
      .filter(item => item.userId === userId && item.metadata.createdAt >= thirtyDaysAgo);
    
    if (recentItems.length === 0) return 1;
    
    const successfullyLearned = recentItems.filter(item => item.memory.retentionRate >= 70).length;
    return successfullyLearned / recentItems.length;
  }

  // Create default analytics
  private createDefaultAnalytics(userId: string): MemoryAnalytics {
    return {
      userId,
      totalItems: 0,
      averageRetention: 0,
      averageStrength: 0,
      forgettingRate: 0,
      optimalReviewInterval: 7,
      memoryCapacity: 0,
      learningEfficiency: 0,
      weakAreas: [],
      strongAreas: [],
      recommendations: ['Start learning to build your memory base']
    };
  }

  // Get memory item
  getMemoryItem(itemId: string): MemoryItem | undefined {
    return this.memoryItems.get(itemId);
  }

  // Get all memory items for user
  getUserMemoryItems(userId: string): MemoryItem[] {
    return Array.from(this.memoryItems.values())
      .filter(item => item.userId === userId);
  }

  // Get review schedule
  getReviewSchedule(itemId: string): SpacedRepetitionSchedule | undefined {
    return this.schedules.get(itemId);
  }

  // Force review of specific item
  forceReview(itemId: string, userId: string): void {
    const item = this.memoryItems.get(itemId);
    if (!item) return;

    // Create artificial retrieval to trigger review
    const retrieval: MemoryRetrieval = {
      itemId,
      retrievalType: 'recall',
      context: 'Manual review',
      performance: {
        accuracy: 100, // Assume perfect recall for manual review
        responseTime: 5000,
        confidence: 5,
        hints: 0,
        attempts: 1
      },
      timestamp: new Date()
    };

    this.updateMemoryFromRetrieval(retrieval);
  }
}

export default MemoryEngine;
export type { MemoryItem, SpacedRepetitionSchedule, MemoryAnalytics, MemoryRetrieval };
