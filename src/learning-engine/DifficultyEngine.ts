// Difficulty Engine Implementation for Adaptive Learning
export interface DifficultyLevel {
  level: number; // 1-10
  name: string;
  description: string;
  characteristics: {
    pacing: 'slow' | 'moderate' | 'fast' | 'adaptive';
    complexity: 'simple' | 'moderate' | 'complex' | 'adaptive';
    support: 'minimal' | 'guided' | 'independent' | 'adaptive';
    cognitiveLoad: 'low' | 'medium' | 'high' | 'adaptive';
  };
  criteria: {
    timeLimit?: number; // minutes
    errorRate: number; // percentage
    completionRate: number; // percentage
    avgResponseTime: number; // seconds
  };
  adjustments: {
    contentComplexity: number; // -2 to +2
    timeLimit: number; // percentage change
    hints: number; // number of hints available
    attempts: number; // max attempts allowed
  };
}

export interface AdaptiveContent {
  id: string;
  originalDifficulty: number;
  currentDifficulty: number;
  type: 'exercise' | 'lesson' | 'quiz' | 'project';
  content: {
    questions?: any[];
    instructions?: string;
    materials?: any[];
    examples?: any[];
  };
  adaptations: {
    simplified?: boolean;
    extended?: boolean;
    visualAids?: boolean;
    audioSupport?: boolean;
    additionalHints?: boolean;
  };
  performance: {
    completionTime: number; // seconds
    accuracy: number; // percentage
    attempts: number;
    hintsUsed: number;
    frustrationLevel: number; // 1-10
  };
}

export interface DifficultyAssessment {
  userId: string;
  contentId: string;
  originalDifficulty: number;
  assessedDifficulty: number;
  performance: {
    completionTime: number;
    accuracy: number;
    attempts: number;
    hintsUsed: number;
    errorPattern: string[];
    frustrationIndicators: number[];
  };
  cognitiveLoad: {
    workingMemoryLoad: number; // 1-10
    processingSpeed: number; // 1-10
    attentionLevel: number; // 1-10
    comprehensionLevel: number; // 1-10
  };
  recommendations: {
    newDifficulty: number;
    adjustments: string[];
    nextContent: string[];
    supportLevel: 'minimal' | 'guided' | 'independent';
  };
  timestamp: Date;
}

export interface DifficultyMetrics {
  userId: string;
  overallDifficulty: number;
  averageAccuracy: number;
  averageCompletionTime: number;
  improvementRate: number; // percentage
  challengeLevel: 'under-challenged' | 'well-challenged' | 'optimally-challenged';
  learningVelocity: number; // skills per week
  adaptiveHistory: {
    date: Date;
    difficulty: number;
    performance: number;
    adjustment: number;
  }[];
}

class DifficultyEngine {
  private difficultyLevels: DifficultyLevel[] = [];
  private adaptiveContents: Map<string, AdaptiveContent> = new Map();
  private assessments: Map<string, DifficultyAssessment[]> = new Map();
  private userMetrics: Map<string, DifficultyMetrics> = new Map();

  constructor() {
    this.initializeDifficultyLevels();
  }

  // Initialize difficulty levels
  private initializeDifficultyLevels(): void {
    this.difficultyLevels = [
      {
        level: 1,
        name: 'Very Easy',
        description: 'Perfect for beginners, high success rate expected',
        characteristics: {
          pacing: 'slow',
          complexity: 'simple',
          support: 'guided',
          cognitiveLoad: 'low'
        },
        criteria: {
          timeLimit: 300, // 5 minutes
          errorRate: 20, // 80% accuracy
          completionRate: 90,
          avgResponseTime: 30 // seconds
        },
        adjustments: {
          contentComplexity: 0,
          timeLimit: 0,
          hints: 3,
          attempts: 5
        }
      },
      {
        level: 2,
        name: 'Easy',
        description: 'Suitable for beginners with some experience',
        characteristics: {
          pacing: 'slow',
          complexity: 'simple',
          support: 'guided',
          cognitiveLoad: 'low'
        },
        criteria: {
          timeLimit: 600, // 10 minutes
          errorRate: 25, // 75% accuracy
          completionRate: 85,
          avgResponseTime: 45
        },
        adjustments: {
          contentComplexity: 0,
          timeLimit: 0,
          hints: 2,
          attempts: 4
        }
      },
      {
        level: 3,
        name: 'Moderate',
        description: 'Balanced challenge for developing learners',
        characteristics: {
          pacing: 'moderate',
          complexity: 'moderate',
          support: 'guided',
          cognitiveLoad: 'medium'
        },
        criteria: {
          timeLimit: 900, // 15 minutes
          errorRate: 35, // 65% accuracy
          completionRate: 75,
          avgResponseTime: 60
        },
        adjustments: {
          contentComplexity: 0,
          timeLimit: 0,
          hints: 2,
          attempts: 3
        }
      },
      {
        level: 4,
        name: 'Challenging',
        description: 'Significant challenge requiring focus and effort',
        characteristics: {
          pacing: 'moderate',
          complexity: 'complex',
          support: 'minimal',
          cognitiveLoad: 'high'
        },
        criteria: {
          timeLimit: 1200, // 20 minutes
          errorRate: 40, // 60% accuracy
          completionRate: 65,
          avgResponseTime: 90
        },
        adjustments: {
          contentComplexity: 0,
          timeLimit: 0,
          hints: 1,
          attempts: 3
        }
      },
      {
        level: 5,
        name: 'Very Challenging',
        description: 'Maximum challenge for advanced learners',
        characteristics: {
          pacing: 'fast',
          complexity: 'complex',
          support: 'independent',
          cognitiveLoad: 'high'
        },
        criteria: {
          timeLimit: 1800, // 30 minutes
          errorRate: 50, // 50% accuracy
          completionRate: 50,
          avgResponseTime: 120
        },
        adjustments: {
          contentComplexity: 0,
          timeLimit: 0,
          hints: 1,
          attempts: 2
        }
      },
      {
        level: 6,
        name: 'Expert',
        description: 'Professional level challenge',
        characteristics: {
          pacing: 'fast',
          complexity: 'complex',
          support: 'independent',
          cognitiveLoad: 'high'
        },
        criteria: {
          timeLimit: 2400, // 40 minutes
          errorRate: 60, // 40% accuracy
          completionRate: 40,
          avgResponseTime: 150
        },
        adjustments: {
          contentComplexity: 0,
          timeLimit: 0,
          hints: 0,
          attempts: 2
        }
      },
      {
        level: 7,
        name: 'Master',
        description: 'Mastery level challenge',
        characteristics: {
          pacing: 'adaptive',
          complexity: 'adaptive',
          support: 'independent',
          cognitiveLoad: 'adaptive'
        },
        criteria: {
          errorRate: 70, // 30% accuracy
          completionRate: 30,
          avgResponseTime: 180
        },
        adjustments: {
          contentComplexity: 0,
          timeLimit: 0,
          hints: 0,
          attempts: 1
        }
      },
      {
        level: 8,
        name: 'Grandmaster',
        description: 'Ultimate challenge for demonstration',
        characteristics: {
          pacing: 'adaptive',
          complexity: 'adaptive',
          support: 'independent',
          cognitiveLoad: 'adaptive'
        },
        criteria: {
          errorRate: 80, // 20% accuracy
          completionRate: 20,
          avgResponseTime: 240
        },
        adjustments: {
          contentComplexity: 0,
          timeLimit: 0,
          hints: 0,
          attempts: 1
        }
      },
      {
        level: 9,
        name: 'Legendary',
        description: 'Legendary challenge for exceptional performance',
        characteristics: {
          pacing: 'adaptive',
          complexity: 'adaptive',
          support: 'independent',
          cognitiveLoad: 'adaptive'
        },
        criteria: {
          errorRate: 90, // 10% accuracy
          completionRate: 10,
          avgResponseTime: 300
        },
        adjustments: {
          contentComplexity: 0,
          timeLimit: 0,
          hints: 0,
          attempts: 1
        }
      },
      {
        level: 10,
        name: 'Mythic',
        description: 'Ultimate test of absolute mastery',
        characteristics: {
          pacing: 'adaptive',
          complexity: 'adaptive',
          support: 'independent',
          cognitiveLoad: 'adaptive'
        },
        criteria: {
          errorRate: 95, // 5% accuracy
          completionRate: 5,
          avgResponseTime: 360
        },
        adjustments: {
          contentComplexity: 0,
          timeLimit: 0,
          hints: 0,
          attempts: 1
        }
      }
    ];
  }

  // Assess user performance and adjust difficulty
  assessPerformance(contentId: string, userId: string, performance: any): DifficultyAssessment {
    const currentMetrics = this.getUserMetrics(userId);
    const content = this.getAdaptiveContent(contentId);
    
    if (!content || !performance) {
      return this.createDefaultAssessment(contentId, userId);
    }

    // Calculate performance metrics
    const accuracy = performance.accuracy || 0;
    const completionTime = performance.completionTime || 0;
    const attempts = performance.attempts || 1;
    const hintsUsed = performance.hintsUsed || 0;
    const errors = performance.errors || [];

    // Determine cognitive load indicators
    const workingMemoryLoad = this.calculateWorkingMemoryLoad(performance);
    const processingSpeed = this.calculateProcessingSpeed(performance);
    const attentionLevel = this.calculateAttentionLevel(performance);
    const comprehensionLevel = this.calculateComprehensionLevel(performance);

    // Assess current difficulty
    const currentDifficulty = content.currentDifficulty || 3;
    const assessedDifficulty = this.calculateOptimalDifficulty(
      accuracy,
      completionTime,
      attempts,
      currentDifficulty,
      workingMemoryLoad,
      processingSpeed,
      attentionLevel,
      comprehensionLevel
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      assessedDifficulty,
      currentDifficulty,
      performance,
      currentMetrics
    );

    const assessment: DifficultyAssessment = {
      userId,
      contentId,
      originalDifficulty: content.originalDifficulty,
      assessedDifficulty,
      performance: {
        completionTime,
        accuracy,
        attempts,
        hintsUsed,
        errorPattern: errors,
        frustrationIndicators: this.calculateFrustrationIndicators(performance)
      },
      cognitiveLoad: {
        workingMemoryLoad,
        processingSpeed,
        attentionLevel,
        comprehensionLevel
      },
      recommendations,
      timestamp: new Date()
    };

    // Store assessment
    this.storeAssessment(assessment);

    // Update content difficulty
    this.updateContentDifficulty(contentId, assessedDifficulty);

    // Update user metrics
    this.updateUserMetrics(userId, assessment);

    return assessment;
  }

  // Calculate optimal difficulty based on performance
  private calculateOptimalDifficulty(
    accuracy: number,
    completionTime: number,
    attempts: number,
    currentDifficulty: number,
    workingMemoryLoad: number,
    processingSpeed: number,
    attentionLevel: number,
    comprehensionLevel: number
  ): number {
    let newDifficulty = currentDifficulty;

    // Accuracy-based adjustment
    if (accuracy >= 90) {
      newDifficulty = Math.min(currentDifficulty + 1, 10);
    } else if (accuracy >= 75) {
      newDifficulty = currentDifficulty;
    } else if (accuracy >= 60) {
      newDifficulty = Math.max(currentDifficulty - 1, 1);
    } else {
      newDifficulty = Math.max(currentDifficulty - 2, 1);
    }

    // Time-based adjustment
    const difficultyLevel = this.getDifficultyLevel(currentDifficulty);
    if (difficultyLevel && completionTime > difficultyLevel.criteria.avgResponseTime * 1.5) {
      newDifficulty = Math.max(currentDifficulty - 1, 1);
    } else if (completionTime < difficultyLevel.criteria.avgResponseTime * 0.7) {
      newDifficulty = Math.min(currentDifficulty + 1, 10);
    }

    // Attempts-based adjustment
    if (attempts > difficultyLevel.adjustments.attempts) {
      newDifficulty = Math.max(currentDifficulty - 1, 1);
    }

    // Cognitive load adjustment
    const avgCognitiveLoad = (workingMemoryLoad + processingSpeed + attentionLevel + comprehensionLevel) / 4;
    if (avgCognitiveLoad > 7) {
      newDifficulty = Math.max(currentDifficulty - 1, 1);
    } else if (avgCognitiveLoad < 4) {
      newDifficulty = Math.min(currentDifficulty + 1, 10);
    }

    return Math.max(1, Math.min(newDifficulty, 10));
  }

  // Calculate working memory load
  private calculateWorkingMemoryLoad(performance: any): number {
    const errors = performance.errors || [];
    const hintsUsed = performance.hintsUsed || 0;
    const timePerQuestion = performance.completionTime / (performance.questionsCount || 1);
    
    let load = 5; // baseline
    
    // More errors = higher load
    load += Math.min(errors.length * 0.5, 2);
    
    // More hints = higher load (indicates difficulty)
    load += Math.min(hintsUsed * 0.3, 1);
    
    // Slow responses = higher load
    if (timePerQuestion > 60) load += 1;
    else if (timePerQuestion < 20) load -= 1;
    
    return Math.max(1, Math.min(load, 10));
  }

  // Calculate processing speed
  private calculateProcessingSpeed(performance: any): number {
    const totalTime = performance.completionTime || 0;
    const questionsCount = performance.questionsCount || 1;
    const timePerQuestion = totalTime / questionsCount;
    
    if (timePerQuestion > 120) return 2; // Very slow
    if (timePerQuestion > 60) return 4; // Slow
    if (timePerQuestion > 30) return 6; // Average
    if (timePerQuestion > 15) return 8; // Fast
    return 10; // Very fast
  }

  // Calculate attention level
  private calculateAttentionLevel(performance: any): number {
    const errors = performance.errors || [];
    const hintsUsed = performance.hintsUsed || 0;
    const attempts = performance.attempts || 1;
    
    let attention = 5; // baseline
    
    // High error rate = low attention
    const errorRate = errors.length / attempts;
    if (errorRate > 0.3) attention -= 2;
    else if (errorRate > 0.2) attention -= 1;
    
    // High hint usage = low attention
    if (hintsUsed > attempts * 0.5) attention -= 1;
    
    return Math.max(1, Math.min(attention, 10));
  }

  // Calculate comprehension level
  private calculateComprehensionLevel(performance: any): number {
    const accuracy = performance.accuracy || 0;
    const errors = performance.errors || [];
    
    let comprehension = 5; // baseline
    
    // High accuracy = high comprehension
    if (accuracy >= 90) comprehension += 3;
    else if (accuracy >= 75) comprehension += 2;
    else if (accuracy >= 60) comprehension += 1;
    else if (accuracy < 40) comprehension -= 2;
    
    // Error patterns analysis
    const hasConsistentErrors = errors.length > 3;
    if (hasConsistentErrors) comprehension -= 1;
    
    return Math.max(1, Math.min(comprehension, 10));
  }

  // Calculate frustration indicators
  private calculateFrustrationIndicators(performance: any): number[] {
    const indicators: number[] = [];
    
    // Time-based frustration
    if (performance.completionTime > 1800) indicators.push(10); // 30 minutes
    else if (performance.completionTime > 1200) indicators.push(7); // 20 minutes
    else if (performance.completionTime > 600) indicators.push(5); // 10 minutes
    
    // Attempt-based frustration
    if (performance.attempts > 5) indicators.push(8);
    else if (performance.attempts > 3) indicators.push(5);
    
    // Hint-based frustration
    if (performance.hintsUsed > 3) indicators.push(6);
    else if (performance.hintsUsed > 1) indicators.push(3);
    
    // Error-based frustration
    const errorRate = (performance.errors?.length || 0) / (performance.attempts || 1);
    if (errorRate > 0.5) indicators.push(9);
    else if (errorRate > 0.3) indicators.push(7);
    
    return indicators;
  }

  // Generate recommendations
  private generateRecommendations(
    assessedDifficulty: number,
    currentDifficulty: number,
    performance: any,
    metrics: DifficultyMetrics
  ): DifficultyAssessment['recommendations'] {
    const recommendations: string[] = [];
    const accuracy = performance.accuracy || 0;
    
    // Difficulty adjustment recommendations
    if (assessedDifficulty > currentDifficulty) {
      recommendations.push('Increase content complexity gradually');
      recommendations.push('Add more challenging elements');
    } else if (assessedDifficulty < currentDifficulty) {
      recommendations.push('Simplify content to reduce frustration');
      recommendations.push('Provide additional guidance and support');
    }

    // Performance-based recommendations
    if (accuracy < 60) {
      recommendations.push('Review fundamental concepts');
      recommendations.push('Practice with easier content first');
    } else if (accuracy >= 90) {
      recommendations.push('Ready for more advanced challenges');
      recommendations.push('Consider peer tutoring opportunities');
    }

    // Cognitive load recommendations
    const avgCognitiveLoad = metrics.averageAccuracy < 70 ? 7 : 4;
    if (avgCognitiveLoad > 7) {
      recommendations.push('Break content into smaller chunks');
      recommendations.push('Provide more frequent breaks');
    }

    // Support level recommendations
    if (assessedDifficulty > 5) {
      recommendations.push('Reduce guidance to encourage independence');
    } else if (assessedDifficulty < 3) {
      recommendations.push('Increase scaffolding and support');
    }

    return {
      newDifficulty: assessedDifficulty,
      adjustments: recommendations,
      nextContent: this.recommendNextContent(assessedDifficulty, metrics),
      supportLevel: this.determineSupportLevel(assessedDifficulty, performance)
    };
  }

  // Recommend next content
  private recommendNextContent(currentDifficulty: number, metrics: DifficultyMetrics): string[] {
    // This would integrate with Skill Graph and Knowledge Graph
    // For now, return generic recommendations
    if (currentDifficulty <= 3) {
      return ['practice-exercises', 'vocabulary-building', 'grammar-basics'];
    } else if (currentDifficulty <= 6) {
      return ['conversation-practice', 'reading-comprehension', 'writing-exercises'];
    } else {
      return ['advanced-grammar', 'creative-writing', 'critical-thinking'];
    }
  }

  // Determine support level
  private determineSupportLevel(difficulty: number, performance: any): 'minimal' | 'guided' | 'independent' {
    const accuracy = performance.accuracy || 0;
    
    if (difficulty >= 7 && accuracy >= 80) {
      return 'independent';
    } else if (difficulty >= 5 && accuracy >= 70) {
      return 'minimal';
    } else {
      return 'guided';
    }
  }

  // Get difficulty level details
  getDifficultyLevel(level: number): DifficultyLevel | undefined {
    return this.difficultyLevels.find(l => l.level === level);
  }

  // Get adaptive content
  getAdaptiveContent(contentId: string): AdaptiveContent | undefined {
    return this.adaptiveContents.get(contentId);
  }

  // Store assessment
  private storeAssessment(assessment: DifficultyAssessment): void {
    if (!this.assessments.has(assessment.contentId)) {
      this.assessments.set(assessment.contentId, []);
    }
    this.assessments.get(assessment.contentId)!.push(assessment);
  }

  // Update content difficulty
  private updateContentDifficulty(contentId: string, newDifficulty: number): void {
    const content = this.adaptiveContents.get(contentId);
    if (content) {
      content.currentDifficulty = newDifficulty;
      this.adaptiveContents.set(contentId, content);
    }
  }

  // Get user metrics
  getUserMetrics(userId: string): DifficultyMetrics {
    if (!this.userMetrics.has(userId)) {
      this.userMetrics.set(userId, {
        userId,
        overallDifficulty: 3,
        averageAccuracy: 70,
        averageCompletionTime: 600,
        improvementRate: 0,
        challengeLevel: 'well-challenged',
        learningVelocity: 1,
        adaptiveHistory: []
      });
    }
    return this.userMetrics.get(userId)!;
  }

  // Update user metrics
  private updateUserMetrics(userId: string, assessment: DifficultyAssessment): void {
    const metrics = this.getUserMetrics(userId);
    
    // Update overall metrics
    const accuracy = assessment.performance.accuracy;
    const oldAccuracy = metrics.averageAccuracy;
    const improvementRate = ((accuracy - oldAccuracy) / oldAccuracy) * 100;
    
    // Update challenge level
    let challengeLevel: 'under-challenged' | 'well-challenged' | 'optimally-challenged';
    if (accuracy >= 85 && assessment.assessedDifficulty >= 6) {
      challengeLevel = 'optimally-challenged';
    } else if (accuracy >= 70 && assessment.assessedDifficulty >= 4) {
      challengeLevel = 'well-challenged';
    } else {
      challengeLevel = 'under-challenged';
    }

    // Add to adaptive history
    metrics.adaptiveHistory.push({
      date: new Date(),
      difficulty: assessment.assessedDifficulty,
      performance: accuracy,
      adjustment: assessment.assessedDifficulty - assessment.originalDifficulty
    });

    // Keep only last 30 entries
    if (metrics.adaptiveHistory.length > 30) {
      metrics.adaptiveHistory = metrics.adaptiveHistory.slice(-30);
    }

    const updatedMetrics: DifficultyMetrics = {
      ...metrics,
      overallDifficulty: assessment.assessedDifficulty,
      averageAccuracy: (metrics.averageAccuracy * 0.8) + (accuracy * 0.2),
      averageCompletionTime: (metrics.averageCompletionTime * 0.8) + (assessment.performance.completionTime * 0.2),
      improvementRate,
      challengeLevel,
      learningVelocity: this.calculateLearningVelocity(metrics.adaptiveHistory)
    };

    this.userMetrics.set(userId, updatedMetrics);
  }

  // Calculate learning velocity
  private calculateLearningVelocity(history: DifficultyAssessment['adaptiveHistory']): number {
    if (history.length < 2) return 1;
    
    const recent = history.slice(-10);
    let totalImprovement = 0;
    
    for (let i = 1; i < recent.length; i++) {
      const improvement = recent[i].performance - recent[i-1].performance;
      totalImprovement += improvement;
    }
    
    return Math.max(0.1, totalImprovement / recent.length);
  }

  // Create default assessment
  private createDefaultAssessment(contentId: string, userId: string): DifficultyAssessment {
    return {
      userId,
      contentId,
      originalDifficulty: 3,
      assessedDifficulty: 3,
      performance: {
        completionTime: 0,
        accuracy: 0,
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
        newDifficulty: 3,
        adjustments: ['Start with basic assessment'],
        nextContent: ['beginner-content'],
        supportLevel: 'guided'
      },
      timestamp: new Date()
    };
  }
}

export default DifficultyEngine;
export type { DifficultyLevel, AdaptiveContent, DifficultyAssessment, DifficultyMetrics };
