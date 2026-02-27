// AI Learning System - Main Entry Point
export { AIGrammarAnalyzer } from './AIGrammarAnalyzer';
export { AIWritingEvaluator } from './AIWritingEvaluator';
export { AIPersonalizationEngine } from './AIPersonalizationEngine';
export { AILearningPredictor } from './AILearningPredictor';
export { AICoaching } from './AICoaching';

export interface AISystemConfig {
  enableGrammarAnalyzer: boolean;
  enableWritingEvaluator: boolean;
  enablePersonalizationEngine: boolean;
  enableLearningPredictor: boolean;
  enableCoaching: boolean;
  aiModel: {
    version: string;
    languageModel: string;
    apiEndpoint: string;
    maxTokens: number;
    temperature: number;
    topP: number;
  };
  personalization: {
    adaptationRate: number; // 0-1
    learningRate: number; // 0.1-2.0
    retentionDecay: number; // 0.5-1.5
    difficultyAdjustment: number; // 0.1-2.0
    engagementThreshold: number; // 0-1
  };
  analytics: {
    enableTracking: boolean;
    dataRetentionDays: number;
    modelRetrainingInterval: number; // days
    predictionAccuracyThreshold: number; // 0-1
  };
}

export interface AISystemMetrics {
  userId: string;
  totalInteractions: number;
  accuracy: number;
  engagement: number;
  learningVelocity: number;
  adaptationEffectiveness: number;
  aiModelPerformance: {
    grammarAccuracy: number;
    writingAccuracy: number;
    predictionAccuracy: number;
    coachingEffectiveness: number;
  };
  timestamp: Date;
}

class AISystem {
  private config: AISystemConfig;
  private grammarAnalyzer: AIGrammarAnalyzer;
  private writingEvaluator: AIWritingEvaluator;
  private personalizationEngine: AIPersonalizationEngine;
  private learningPredictor: AILearningPredictor;
  private coaching: AICoaching;
  private metrics: Map<string, AISystemMetrics[]> = new Map();

  constructor(config?: Partial<AISystemConfig>) {
    this.config = {
      enableGrammarAnalyzer: true,
      enableWritingEvaluator: true,
      enablePersonalizationEngine: true,
      enableLearningPredictor: true,
      enableCoaching: true,
      aiModel: {
        version: '2.1.0',
        languageModel: 'gpt-4',
        apiEndpoint: 'https://api.openai.com/v1',
        maxTokens: 4000,
        temperature: 0.7,
        topP: 0.9
      },
      personalization: {
        adaptationRate: 0.8,
        learningRate: 1.2,
        retentionDecay: 0.9,
        difficultyAdjustment: 1.3,
        engagementThreshold: 0.7
      },
      analytics: {
        enableTracking: true,
        dataRetentionDays: 30,
        modelRetrainingInterval: 7,
        predictionAccuracyThreshold: 0.8
      },
      ...config
    };

    this.initializeAISystem();
  }

  // Initialize AI system
  private initializeAISystem(): void {
    this.grammarAnalyzer = new AIGrammarAnalyzer();
    this.writingEvaluator = new AIWritingEvaluator();
    this.personalizationEngine = new AIPersonalizationEngine();
    this.learningPredictor = new AILearningPredictor();
    this.coaching = new AICoaching();
  }

  // Analyze text with AI
  analyzeText(text: string, userId: string, analysisType: 'grammar' | 'writing' | 'comprehensive'): any {
    switch (analysisType) {
      case 'grammar':
        return this.grammarAnalyzer.analyzeGrammar(text, userId);
      case 'writing':
        return this.writingEvaluator.evaluateText(text, userId);
      case 'comprehensive':
        return this.performComprehensiveAnalysis(text, userId);
      default:
        return this.performBasicAnalysis(text, userId);
    }
  }

  // Perform comprehensive analysis
  private performComprehensiveAnalysis(text: string, userId: string): any {
    const grammarAnalysis = this.grammarAnalyzer.analyzeGrammar(text, userId);
    const writingAnalysis = this.writingEvaluator.evaluateText(text, userId);
    
    return {
      type: 'comprehensive',
      grammar: grammarAnalysis,
      writing: writingAnalysis,
      overall: this.calculateOverallScore(grammarAnalysis, writingAnalysis),
      recommendations: this.generateComprehensiveRecommendations(grammarAnalysis, writingAnalysis),
      timestamp: new Date()
    };
  }

  // Perform basic analysis
  private performBasicAnalysis(text: string, userId: string): any {
    const wordCount = text.split(/\s+/).length;
    const sentenceCount = text.split(/[.!?]+/).length;
    const avgWordLength = wordCount / sentenceCount;
    
    return {
      type: 'basic',
      wordCount,
      sentenceCount,
      avgWordLength,
      complexity: avgWordLength > 15 ? 'high' : avgWordLength > 10 ? 'medium' : 'simple',
      readability: this.calculateReadability(text),
      timestamp: new Date()
    };
  }

  // Calculate readability
  private calculateReadability(text: string): number {
    const sentences = text.split(/[.!?]+/);
    let totalWords = 0;
    let totalSyllables = 0;
    
    sentences.forEach(sentence => {
      const words = sentence.split(/\s+/);
      totalWords += words.length;
      words.forEach(word => {
        totalSyllables += this.countSyllables(word);
      });
    });
    
    const avgWordsPerSentence = totalWords / sentences.length;
    const avgSyllablesPerWord = totalSyllables / totalWords;
    
    // Simplified Flesch-Kincaid score
    const avgSentenceLength = totalWords / sentences.length;
    let score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    
    if (avgSentenceLength > 15) score -= 5;
    if (avgSentenceLength > 25) score -= 10;
    
    return Math.max(0, Math.round(score));
  }

  // Calculate overall score
  private calculateOverallScore(grammarAnalysis: any, writingAnalysis: any): number {
    const grammarScore = grammarAnalysis?.analysis?.score || 70;
    const writingScore = writingAnalysis?.analysis?.overallScore || 70;
    
    return (grammarScore + writingScore) / 2;
  }

  // Generate comprehensive recommendations
  private generateComprehensiveRecommendations(grammarAnalysis: any, writingAnalysis: any): string[] {
    const recommendations = [];
    
    if (grammarAnalysis?.analysis?.score < 60) {
      recommendations.push('Focus on basic grammar rules');
      recommendations.push('Practice sentence structure');
    }
    
    if (writingAnalysis?.analysis?.clarity < 60) {
      recommendations.push('Work on sentence clarity');
      recommendations.push('Use simpler vocabulary');
    }
    
    if (writingAnalysis?.analysis?.creativity < 60) {
      recommendations.push('Try more descriptive language');
      recommendations.push('Use figurative language');
    }
    
    if (grammarAnalysis?.analysis?.score > 85 && writingAnalysis?.analysis?.score > 85) {
      recommendations.push('Challenge with more complex content');
      recommendations.push('Explore advanced writing techniques');
    }
    
    return recommendations;
  }

  // Generate personalized learning path
  generatePersonalizedPath(userId: string, goals: string[]): any {
    const profile = this.personalizationEngine.getUserProfile(userId);
    const predictions = this.learningPredictor.generateForecast(userId, 'monthly');
    
    return {
      userId,
      goals,
      path: this.createAdaptivePath(profile, predictions),
      adaptations: profile?.adaptationHistory?.adaptations || [],
      estimatedDuration: this.calculatePathDuration(profile, goals),
      confidence: this.calculatePathConfidence(profile, predictions)
    };
  }

  // Create adaptive path
  private createAdaptivePath(profile: any, predictions: any): any {
    const path = {
      modules: [],
      sequence: [],
      adaptations: []
    };
    
    // This would integrate with Learning Engine
    // For now, simplified logic
    if (profile?.performance?.averageAccuracy > 80) {
      path.modules.push('advanced_grammar', 'creative_writing', 'critical_thinking');
      path.sequence.push(['advanced_grammar', 'creative_writing', 'critical_thinking']);
    } else {
      path.modules.push('foundational_grammar', 'basic_writing', 'reading_comprehension');
      path.sequence.push(['foundational_grammar', 'basic_writing', 'reading_comprehension']);
    }
    
    return path;
  }

  // Calculate path duration
  private calculatePathDuration(profile: any, goals: string[]): number {
    const skillLevel = profile?.performance?.averageAccuracy || 50;
    const goalCount = goals.length;
    
    // Simplified duration calculation
    return Math.max(30, skillLevel * 2 * goalCount);
  }

  // Calculate path confidence
  private calculatePathConfidence(profile: any, predictions: any): number {
    const profileAccuracy = profile?.performance?.averageAccuracy || 50;
    const predictionConfidence = predictions?.confidence || 50;
    
    return Math.min(95, (profileAccuracy + predictionConfidence) / 2);
  }

  // Start AI coaching session
  startAICoachingSession(
    userId: string,
    sessionType: CoachingSession['type'],
    topic: string,
    skillLevel: number,
    objectives: string[]
  ): string {
    const session = this.coaching.startCoachingSession(userId, sessionType, topic, skillLevel, objectives);
    
    // Add AI-powered initial activity
    this.coaching.addActivity(session.id, {
      type: 'explanation',
      title: 'AI Coach Introduction',
      description: 'Your AI coach is ready to help!',
      duration: 2,
      materials: ['ai_interface'],
      instructions: 'Meet your AI coach who will guide your learning journey',
      interactive: true
    });
    
    return session.id;
  }

  // Get AI coaching response
  getAIResponse(sessionId: string, userInput: string): string {
    return this.coaching.generateAIResponse(sessionId, userInput);
  }

  // Update AI system metrics
  updateMetrics(userId: string, interaction: any): void {
    const currentMetrics = this.metrics.get(userId) || {
      userId,
      totalInteractions: 0,
      accuracy: 0,
      engagement: 0,
      learningVelocity: 0,
      adaptationEffectiveness: 0,
      aiModelPerformance: {
        grammarAccuracy: 0,
        writingAccuracy: 0,
        predictionAccuracy: 0,
        coachingEffectiveness: 0
      },
      timestamp: new Date()
    };

    // Update interaction count
    currentMetrics.totalInteractions += 1;
    
    // Update metrics based on interaction
    if (interaction.type === 'grammar_analysis') {
      currentMetrics.aiModelPerformance.grammarAccuracy = this.updateModelAccuracy('grammar', interaction.accuracy);
    }
    
    if (interaction.type === 'writing_evaluation') {
      currentMetrics.aiModelPerformance.writingAccuracy = this.updateModelAccuracy('writing', interaction.accuracy);
    }
    
    if (interaction.type === 'prediction') {
      currentMetrics.aiModelPerformance.predictionAccuracy = this.updateModelAccuracy('prediction', interaction.accuracy);
    }
    
    if (interaction.type === 'coaching') {
      currentMetrics.aiModelPerformance.coachingEffectiveness = this.updateModelAccuracy('coaching', interaction.effectiveness || 80);
    }
    
    // Calculate derived metrics
    currentMetrics.accuracy = (currentMetrics.aiModelPerformance.grammarAccuracy + currentMetrics.aiModelPerformance.writingAccuracy) / 2;
    currentMetrics.engagement = this.calculateEngagement(currentMetrics);
    currentMetrics.learningVelocity = this.calculateLearningVelocity(currentMetrics);
    currentMetrics.adaptationEffectiveness = this.calculateAdaptationEffectiveness(currentMetrics);
    
    this.metrics.set(userId, [currentMetrics, ...(this.metrics.get(userId) || [])].slice(-30));
  }

  // Update model accuracy
  private updateModelAccuracy(modelType: string, accuracy: number): number {
    const currentAccuracy = this.config.aiModel.performance[modelType] || 0.8;
    const newAccuracy = (currentAccuracy * 0.9) + (accuracy * 0.1);
    
    this.config.aiModel.performance[modelType] = Math.max(0.1, Math.min(1.0, newAccuracy));
    
    return newAccuracy;
  }

  // Calculate engagement
  private calculateEngagement(metrics: AISystemMetrics): number {
    const recentMetrics = metrics.slice(-10);
    if (recentMetrics.length === 0) return 50;
    
    const avgEngagement = recentMetrics.reduce((sum, metric) => sum + metric.engagement, 0) / recentMetrics.length;
    const interactionFrequency = recentMetrics.length / 10; // Last 10 interactions
    
    return Math.min(100, avgEngagement + (interactionFrequency * 5));
  }

  // Calculate learning velocity
  private calculateLearningVelocity(metrics: AISystemMetrics): number {
    const recentMetrics = metrics.slice(-30);
    if (recentMetrics.length < 2) return 0;
    
    const improvementRate = recentMetrics[recentMetrics.length - 1].accuracy - recentMetrics[0].accuracy;
    const avgAccuracy = recentMetrics.reduce((sum, metric) => sum + metric.accuracy, 0) / recentMetrics.length;
    
    return Math.max(0, (improvementRate * 10 + avgAccuracy * 5));
  }

  // Calculate adaptation effectiveness
  private calculateAdaptationEffectiveness(metrics: AISystemMetrics): number {
    const recentMetrics = metrics.slice(-30);
    if (recentMetrics.length === 0) return 50;
    
    const adaptationEffectiveness = recentMetrics.reduce((sum, metric) => sum + metric.adaptationEffectiveness, 0) / recentMetrics.length;
    const modelAccuracy = (metrics.aiModelPerformance.grammarAccuracy + metrics.aiModelPerformance.writingAccuracy + metrics.aiModelPerformance.predictionAccuracy) / 3;
    
    return Math.min(100, (adaptationEffectiveness * 0.7 + modelAccuracy * 0.3));
  }

  // Get system metrics
  getMetrics(userId: string): AISystemMetrics[] {
    return this.metrics.get(userId) || [];
  }

  // Get AI system configuration
  getConfig(): AISystemConfig {
    return this.config;
  }

  // Update configuration
  updateConfig(newConfig: Partial<AISystemConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Re-initialize components with new config
    if (newConfig.aiModel) {
      this.config.aiModel = { ...this.config.aiModel, ...newConfig.aiModel };
    }
    
    if (newConfig.personalization) {
      this.config.personalization = { ...this.config.personalization, ...newConfig.personalization };
    }
    
    // Update AI models with new configuration
    this.grammarAnalyzer = new AIGrammarAnalyzer();
    this.writingEvaluator = new AIWritingEvaluator();
    this.personalizationEngine = new AIPersonalizationEngine();
    this.learningPredictor = new AILearningPredictor();
    this.coaching = new AICoaching();
  }

  // Get AI system status
  getSystemStatus(): any {
    const enabledModules = {
      grammarAnalyzer: this.config.enableGrammarAnalyzer,
      writingEvaluator: this.config.enableWritingEvaluator,
      personalizationEngine: this.config.enablePersonalizationEngine,
      learningPredictor: this.config.enableLearningPredictor,
      coaching: this.config.enableCoaching
    };
    
    const modelPerformance = {
      grammarAccuracy: this.config.aiModel.performance.grammarAccuracy,
      writingAccuracy: this.config.aiModel.performance.writingAccuracy,
      predictionAccuracy: this.config.aiModel.performance.predictionAccuracy,
      coachingEffectiveness: this.config.aiModel.performance.coachingEffectiveness
    };
    
    return {
      enabledModules,
      modelPerformance,
      config: this.config,
      uptime: 'active',
      lastUpdate: new Date()
    };
  }
}

export default AISystem;
export type { 
  AISystemConfig, 
  AISystemMetrics, 
  AISystem as AISystemType 
};
