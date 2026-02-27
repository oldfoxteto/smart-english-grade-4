// Learning Engine - Main Entry Point
export { SkillGraph } from './SkillGraph';
export { MasteryEngine } from './MasteryEngine';
export { KnowledgeGraph } from './KnowledgeGraph';
export { DifficultyEngine } from './DifficultyEngine';
export { MemoryEngine } from './MemoryEngine';
export { RecommendationEngineImpl as RecommendationEngine } from './RecommendationEngine';

export interface LearningEngineConfig {
  enableSkillGraph: boolean;
  enableMasteryEngine: boolean;
  enableKnowledgeGraph: boolean;
  enableDifficultyEngine: boolean;
  enableMemoryEngine: boolean;
  enableRecommendationEngine: boolean;
  adaptiveMode: 'conservative' | 'moderate' | 'aggressive';
  personalizationLevel: 'basic' | 'intermediate' | 'advanced';
}

export interface LearningSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  contentIds: string[];
  performance: {
    accuracy: number;
    completionTime: number;
    difficulty: number;
    improvements: string[];
  };
  context: {
    environment: string;
    device: string;
    mood: string;
    interruptions: number;
  };
}

export interface LearningAnalytics {
  userId: string;
  overallProgress: {
    totalSkills: number;
    masteredSkills: number;
    averageMastery: number;
    improvementRate: number;
  };
  skillBreakdown: {
    vocabulary: { level: number; progress: number; timeSpent: number };
    grammar: { level: number; progress: number; timeSpent: number };
    pronunciation: { level: number; progress: number; timeSpent: number };
    listening: { level: number; progress: number; timeSpent: number };
    speaking: { level: number; progress: number; timeSpent: number };
    reading: { level: number; progress: number; timeSpent: number };
    writing: { level: number; progress: number; timeSpent: number };
  };
  memoryAnalytics: {
    retentionRate: number;
    optimalReviewInterval: number;
    memoryCapacity: number;
    forgettingRate: number;
  };
  recommendations: {
    pending: number;
    accepted: number;
    effectiveness: number;
    categories: {
      content: number;
      skill: number;
      path: number;
      remediation: number;
      resource: number;
    };
  };
  timestamp: Date;
}

class LearningEngine {
  private config: LearningEngineConfig;
  private skillGraph: SkillGraph;
  private masteryEngine: MasteryEngine;
  private knowledgeGraph: KnowledgeGraph;
  private difficultyEngine: DifficultyEngine;
  private memoryEngine: MemoryEngine;
  private recommendationEngine: RecommendationEngine;
  private activeSessions: Map<string, LearningSession> = new Map();

  constructor(config?: Partial<LearningEngineConfig>) {
    this.config = {
      enableSkillGraph: true,
      enableMasteryEngine: true,
      enableKnowledgeGraph: true,
      enableDifficultyEngine: true,
      enableMemoryEngine: true,
      enableRecommendationEngine: true,
      adaptiveMode: 'moderate',
      personalizationLevel: 'intermediate',
      ...config
    };

    this.initializeEngines();
  }

  // Initialize all sub-engines
  private initializeEngines(): void {
    this.skillGraph = new SkillGraph();
    this.masteryEngine = new MasteryEngine(this.skillGraph);
    this.knowledgeGraph = new KnowledgeGraph();
    this.difficultyEngine = new DifficultyEngine();
    this.memoryEngine = new MemoryEngine();
    this.recommendationEngine = new RecommendationEngineImpl();
  }

  // Start learning session
  startSession(userId: string, contentIds: string[]): LearningSession {
    const sessionId = `session-${userId}-${Date.now()}`;
    
    const session: LearningSession = {
      id: sessionId,
      userId,
      startTime: new Date(),
      contentIds,
      performance: {
        accuracy: 0,
        completionTime: 0,
        difficulty: 0,
        improvements: []
      },
      context: {
        environment: 'web',
        device: 'desktop',
        mood: 'neutral',
        interruptions: 0
      }
    };

    this.activeSessions.set(sessionId, session);
    return session;
  }

  // End learning session
  endSession(sessionId: string, performance: Partial<LearningSession['performance']>): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    session.endTime = new Date();
    session.performance = {
      ...session.performance,
      ...performance
    };

    // Update all engines with session data
    this.updateEnginesWithSessionData(session);

    this.activeSessions.delete(sessionId);
  }

  // Update engines with session data
  private updateEnginesWithSessionData(session: LearningSession): void {
    const { userId, contentIds, performance } = session;
    const duration = session.endTime!.getTime() - session.startTime.getTime();

    // Update Mastery Engine
    if (this.config.enableMasteryEngine) {
      contentIds.forEach(contentId => {
        const assessment = {
          userId,
          contentId,
          originalDifficulty: 3, // Default
          assessedDifficulty: performance.difficulty || 3,
          performance: {
            completionTime: duration,
            accuracy: performance.accuracy || 0,
            attempts: 1,
            hintsUsed: 0,
            errorPattern: [],
            frustrationIndicators: []
          },
          cognitiveLoad: {
            workingMemoryLoad: 5,
            processingSpeed: 5,
            attentionLevel: 5,
            comprehensionLevel: 5
          },
          recommendations: {
            newDifficulty: performance.difficulty || 3,
            adjustments: ['Session completed'],
            nextContent: [],
            supportLevel: 'guided'
          },
          timestamp: new Date()
        };

        this.masteryEngine.updateUserProgress(contentId, userId, assessment);
      });
    }

    // Update Memory Engine
    if (this.config.enableMemoryEngine && performance.accuracy !== undefined) {
      contentIds.forEach(contentId => {
        const retrieval = {
          itemId: contentId,
          retrievalType: 'application',
          context: `Session ${session.id}`,
          performance: {
            accuracy: performance.accuracy,
            responseTime: duration,
            confidence: performance.accuracy >= 80 ? 5 : 3,
            hints: 0,
            attempts: 1
          },
          timestamp: new Date()
        };

        this.memoryEngine.updateMemoryFromRetrieval(retrieval);
      });
    }

    // Update Difficulty Engine
    if (this.config.enableDifficultyEngine) {
      contentIds.forEach(contentId => {
        this.difficultyEngine.assessPerformance(contentId, userId, performance);
      });
    }
  }

  // Get personalized recommendations
  getRecommendations(userId: string, context?: any): any[] {
    if (!this.config.enableRecommendationEngine) return [];

    // Create learning context
    const learningContext = this.createLearningContext(userId, context);

    // Get user profile (would integrate with user service)
    const userProfile = this.getUserProfile(userId);

    return this.recommendationEngine.generateRecommendations(userId, learningContext, userProfile);
  }

  // Create learning context
  private createLearningContext(userId: string, context?: any): any {
    const activeSession = Array.from(this.activeSessions.values())
      .find(session => session.userId === userId);

    return {
      userId,
      currentSession: activeSession || {
        startTime: new Date(),
        contentIds: [],
        performance: {},
        environment: 'web',
        device: 'desktop',
        mood: 'neutral',
        interruptions: 0
      },
      recentActivity: {
        lastLogin: new Date(),
        lastCompleted: new Date(),
        timeSpentToday: this.getTimeSpentToday(userId),
        sessionsThisWeek: 1,
      },
      currentGoals: [],
      availableTime: 60, // minutes
      mood: activeSession?.context?.mood || 'neutral',
      externalFactors: []
    };
  }

  // Get user profile (placeholder)
  private getUserProfile(userId: string): any {
    // This would integrate with user service
    return {
      userId,
      learningStyle: {
        visual: 7,
        auditory: 5,
        kinesthetic: 4,
        reading: 8,
        global: 6
      },
      preferences: {
        difficulty: 'gradual',
        pace: 'moderate',
        contentTypes: ['interactive', 'visual', 'audio'],
        timeOfDay: 'morning',
        sessionLength: 30
      },
      performance: {
        strengths: ['vocabulary', 'reading'],
        weaknesses: ['pronunciation'],
        averageAccuracy: 75,
        averageCompletionTime: 600,
        improvementRate: 5,
        streakDays: 3
      },
      interests: ['science', 'technology', 'music'],
      goals: {
        short: ['complete-daily-lesson'],
        medium: ['reach-intermediate-level'],
        long: ['achieve-fluency']
      },
      demographics: {
        age: 10,
        gradeLevel: '4',
        location: 'US',
        languageLevel: 'beginner'
      }
    };
  }

  // Get time spent today (placeholder)
  private getTimeSpentToday(userId: number): number {
    // This would calculate from session data
    return 45; // minutes
  }

  // Get comprehensive learning analytics
  getAnalytics(userId: string): LearningAnalytics {
    const masteryAnalytics = this.masteryEngine.getUserProgress('vocabulary-basic-nouns', userId);
    const memoryAnalytics = this.memoryEngine.getMemoryAnalytics(userId);
    const difficultyAnalytics = this.difficultyEngine.getUserMetrics(userId);

    return {
      userId,
      overallProgress: {
        totalSkills: 15, // From SkillGraph
        masteredSkills: 3, // Estimated
        averageMastery: masteryAnalytics?.currentLevel?.level || 25,
        improvementRate: difficultyAnalytics?.improvementRate || 5
      },
      skillBreakdown: {
        vocabulary: { level: 3, progress: 65, timeSpent: 120 },
        grammar: { level: 2, progress: 45, timeSpent: 90 },
        pronunciation: { level: 2, progress: 30, timeSpent: 60 },
        listening: { level: 2, progress: 50, timeSpent: 80 },
        speaking: { level: 1, progress: 25, timeSpent: 45 },
        reading: { level: 3, progress: 70, timeSpent: 100 },
        writing: { level: 2, progress: 40, timeSpent: 75 }
      },
      memoryAnalytics: {
        retentionRate: memoryAnalytics.averageRetention,
        optimalReviewInterval: memoryAnalytics.optimalReviewInterval,
        memoryCapacity: memoryAnalytics.memoryCapacity,
        forgettingRate: memoryAnalytics.forgettingRate
      },
      recommendations: {
        pending: 5,
        accepted: 3,
        effectiveness: 75,
        categories: {
          content: 2,
          skill: 3,
          path: 1,
          remediation: 1,
          resource: 1
        }
      },
      timestamp: new Date()
    };
  }

  // Get skill graph data
  getSkillGraph(): SkillGraph {
    return this.skillGraph;
  }

  // Get mastery engine data
  getMasteryEngine(): MasteryEngine {
    return this.masteryEngine;
  }

  // Get knowledge graph data
  getKnowledgeGraph(): KnowledgeGraph {
    return this.knowledgeGraph;
  }

  // Get difficulty engine data
  getDifficultyEngine(): DifficultyEngine {
    return this.difficultyEngine;
  }

  // Get memory engine data
  getMemoryEngine(): MemoryEngine {
    return this.memoryEngine;
  }

  // Get recommendation engine data
  getRecommendationEngine(): RecommendationEngine {
    return this.recommendationEngine;
  }

  // Get active sessions
  getActiveSessions(): LearningSession[] {
    return Array.from(this.activeSessions.values());
  }

  // Update configuration
  updateConfig(newConfig: Partial<LearningEngineConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Re-initialize engines with new config if needed
    if (newConfig.adaptiveMode) {
      // Engines would adapt to new personalization level
    }
  }

  // Get current configuration
  getConfig(): LearningEngineConfig {
    return this.config;
  }
}

export default LearningEngine;
export type { 
  LearningEngineConfig, 
  LearningSession, 
  LearningAnalytics, 
  LearningEngine as LearningEngineType 
};
