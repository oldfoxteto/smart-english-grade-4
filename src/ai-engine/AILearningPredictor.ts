// AI Learning Predictor Implementation
export interface LearningPrediction {
  id: string;
  userId: string;
  timestamp: Date;
  prediction: {
    type: 'performance' | 'completion' | 'retention' | 'engagement' | 'difficulty' | 'time_to_mastery';
    timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    confidence: number; // 0-100
    value: number;
    unit: string;
    description: string;
  };
  factors: {
    demographics: {
      age: number;
      gradeLevel: string;
      languageLevel: string;
      timezone: string;
    };
    historical: {
      averageAccuracy: number;
      improvementRate: number;
      consistency: number;
      streakDays: number;
      totalSessions: number;
      averageSessionDuration: number;
    };
    contextual: {
      timeOfDay: string;
      dayOfWeek: string;
      season: string;
      recentTopics: string[];
      currentMood: string;
      deviceType: string;
    };
    content: {
      difficultyLevel: number;
      contentType: string;
      estimatedTime: number;
      prerequisites: string[];
      relatedSkills: string[];
    };
    environmental: {
      notifications: boolean;
      soundEffects: boolean;
      animations: boolean;
      theme: string;
      interruptions: number;
      multitasking: boolean;
    };
  };
  model: {
    algorithm: string;
    version: string;
    accuracy: number; // Historical accuracy
    parameters: {
      learningRate: number;
      retentionFactor: number;
      difficultyAdjustment: number;
      personalizationWeight: number;
      seasonality: number;
      fatigue: number;
    };
  };
}

export interface PredictionModel {
  id: string;
  name: string;
  description: string;
  algorithm: string;
  features: string[];
  target: string;
  accuracy: number;
  lastTrained: Date;
  parameters: any;
}

export interface LearningForecast {
  userId: string;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  predictions: LearningPrediction[];
  confidence: number; // Overall confidence
  recommendations: {
    content: string[];
    schedule: string[];
    adjustments: string[];
    goals: string[];
  };
  timestamp: Date;
}

class AILearningPredictor {
  private predictionModels: Map<string, PredictionModel> = new Map();
  private userHistory: Map<string, any[]> = new Map();
  private forecasts: Map<string, LearningForecast[]> = new Map();
  private modelAccuracy: Map<string, number> = new Map();

  constructor() {
    this.initializePredictionModels();
  }

  // Initialize prediction models
  private initializePredictionModels(): void {
    const models: PredictionModel[] = [
      {
        id: 'performance-predictor',
        name: 'Performance Prediction Model',
        description: 'Predicts future learning performance based on historical data',
        algorithm: 'random_forest',
        features: ['accuracy', 'time_spent', 'session_count', 'difficulty_level', 'consistency', 'streak_days'],
        target: 'accuracy_score',
        accuracy: 0.85,
        lastTrained: new Date(),
        parameters: {
          n_estimators: 100,
          max_depth: 10,
          learning_rate: 0.1,
          random_state: 42
        }
      },
      {
        id: 'completion-predictor',
        name: 'Completion Prediction Model',
        description: 'Predicts likelihood of completing learning activities',
        algorithm: 'logistic_regression',
        features: ['difficulty_level', 'time_available', 'motivation_level', 'previous_completion_rate', 'content_type'],
        target: 'completion_probability',
        accuracy: 0.78,
        lastTrained: new Date(),
        parameters: {
          C: 1.0,
          penalty: 'l2',
          solver: 'liblinear'
        }
      },
      {
        id: 'retention-predictor',
        name: 'Retention Prediction Model',
        description: 'Predicts knowledge retention over time',
        algorithm: 'gradient_boosting',
        features: ['accuracy', 'time_to_master', 'review_frequency', 'difficulty_level', 'content_complexity', 'session_duration'],
        target: 'retention_rate',
        accuracy: 0.82,
        lastTrained: new Date(),
        parameters: {
          n_estimators: 50,
          learning_rate: 0.05,
          max_depth: 5
        }
      },
      {
        id: 'engagement-predictor',
        name: 'Engagement Prediction Model',
        description: 'Predicts user engagement levels',
        algorithm: 'neural_network',
        features: ['session_frequency', 'session_duration', 'content_type', 'difficulty_level', 'time_of_day', 'device_type', 'previous_engagement'],
        target: 'engagement_score',
        accuracy: 0.75,
        lastTrained: new Date(),
        parameters: {
          hidden_layer_sizes: [64, 32, 16],
          activation: 'relu',
          learning_rate: 0.001,
          epochs: 100
        }
      },
      {
        id: 'difficulty-adaptation',
        name: 'Difficulty Adaptation Model',
        description: 'Predicts optimal difficulty level for users',
        algorithm: 'reinforcement_learning',
        features: ['current_accuracy', 'improvement_rate', 'frustration_level', 'time_per_question', 'hint_usage', 'retry_count', 'content_type'],
        target: 'optimal_difficulty',
        accuracy: 0.80,
        lastTrained: new Date(),
        parameters: {
          learning_rate: 0.1,
          gamma: 0.95,
          epsilon: 0.1,
          n_steps: 1000
        }
      },
      {
        id: 'time-to-mastery',
        name: 'Time to Mastery Prediction Model',
        description: 'Predicts time required to master skills',
        algorithm: 'linear_regression',
        features: ['skill_complexity', 'user_level', 'learning_rate', 'consistency', 'previous_mastery_times', 'content_type', 'support_level'],
        target: 'days_to_mastery',
        accuracy: 0.83,
        lastTrained: new Date(),
        parameters: {
          fit_intercept: true,
          normalize: true
        }
      }
    ];

    models.forEach(model => {
      this.predictionModels.set(model.id, model);
    });
  }

  // Generate learning prediction
  generatePrediction(
    userId: string,
    predictionType: LearningPrediction['prediction']['type'],
    timeframe: LearningPrediction['prediction']['timeframe'],
    features?: Partial<LearningPrediction['factors']>
  ): LearningPrediction {
    const model = this.getPredictionModel(predictionType);
    if (!model) {
      return this.createDefaultPrediction(userId, predictionType, timeframe);
    }

    const userFeatures = this.extractUserFeatures(userId, features);
    const prediction = this.makePrediction(model, userFeatures);
    
    const learningPrediction: LearningPrediction = {
      id: `prediction-${userId}-${Date.now()}`,
      userId,
      timestamp: new Date(),
      prediction: {
        type: predictionType,
        timeframe,
        confidence: this.calculatePredictionConfidence(model, userFeatures),
        value: prediction.value,
        unit: this.getPredictionUnit(predictionType),
        description: this.generatePredictionDescription(predictionType, prediction.value, userFeatures)
      },
      factors: userFeatures
    };

    // Store prediction
    this.storePrediction(learningPrediction);

    return learningPrediction;
  }

  // Get prediction model
  private getPredictionModel(predictionType: string): PredictionModel | undefined {
    const modelMap: Record<string, string> = {
      'performance': 'performance-predictor',
      'completion': 'completion-predictor',
      'retention': 'retention-predictor',
      'engagement': 'engagement-predictor',
      'difficulty': 'difficulty-adaptation',
      'time_to_mastery': 'time-to-mastery'
    };

    return this.predictionModels.get(modelMap[predictionType]);
  }

  // Extract user features
  private extractUserFeatures(userId: string, additionalFeatures?: Partial<LearningPrediction['factors']>): LearningPrediction['factors'] {
    const history = this.getUserHistory(userId);
    
    const baseFeatures: LearningPrediction['factors'] = {
      demographics: {
        age: 10,
        gradeLevel: '4',
        languageLevel: 'beginner',
        timezone: 'UTC',
        deviceType: 'desktop'
      },
      historical: {
        averageAccuracy: this.calculateAverageAccuracy(history),
        improvementRate: this.calculateImprovementRate(history),
        consistency: this.calculateConsistency(history),
        streakDays: this.calculateStreakDays(history),
        totalSessions: history.length,
        averageSessionDuration: this.calculateAverageSessionDuration(history)
      },
      contextual: {
        timeOfDay: new Date().getHours().toString(),
        dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
        season: this.getCurrentSeason(),
        recentTopics: this.getRecentTopics(history),
        currentMood: 'neutral',
        deviceType: 'desktop'
      },
      content: {
        difficultyLevel: 5,
        contentType: 'interactive',
        estimatedTime: 30,
        prerequisites: ['basics'],
        relatedSkills: ['vocabulary', 'grammar']
      },
      environmental: {
        notifications: true,
        soundEffects: true,
        animations: true,
        theme: 'light',
        interruptions: 0,
        multitasking: false
      }
    };

    return { ...baseFeatures, ...additionalFeatures };
  }

  // Calculate average accuracy
  private calculateAverageAccuracy(history: any[]): number {
    if (history.length === 0) return 70;
    
    const recentSessions = history.slice(-20);
    const totalAccuracy = recentSessions.reduce((sum, session) => sum + (session.accuracy || 70), 0);
    
    return totalAccuracy / recentSessions.length;
  }

  // Calculate improvement rate
  private calculateImprovementRate(history: any[]): number {
    if (history.length < 2) return 0;
    
    const recentSessions = history.slice(-10);
    let totalImprovement = 0;
    
    for (let i = 1; i < recentSessions.length; i++) {
      const improvement = (recentSessions[i].accuracy || 0) - (recentSessions[i-1].accuracy || 0);
      totalImprovement += improvement;
    }
    
    return totalImprovement / (recentSessions.length - 1);
  }

  // Calculate consistency
  private calculateConsistency(history: any[]): number {
    if (history.length === 0) return 0.5;
    
    const recentSessions = history.slice(-30);
    const sessionDates = recentSessions.map(session => new Date(session.date));
    
    // Calculate variance in session frequency
    const dayFrequency = new Map<string, number>();
    sessionDates.forEach(date => {
      const dayKey = date.toDateString();
      dayFrequency.set(dayKey, (dayFrequency.get(dayKey) || 0) + 1);
    });
    
    const frequencies = Array.from(dayFrequency.values());
    const avgFrequency = frequencies.reduce((sum, freq) => sum + freq, 0) / frequencies.length;
    const frequencyVariance = frequencies.reduce((sum, freq) => sum + Math.pow(freq - avgFrequency, 2), 0) / frequencies.length;
    
    // Higher consistency = lower variance
    const consistency = Math.max(0, 1 - (frequencyVariance / Math.pow(avgFrequency, 2)));
    
    return consistency;
  }

  // Calculate streak days
  private calculateStreakDays(history: any[]): number {
    if (history.length === 0) return 0;
    
    let currentStreak = 0;
    const sortedHistory = history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (let i = sortedHistory.length - 1; i >= 0; i--) {
      const session = sortedHistory[i];
      const sessionDate = new Date(session.date);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 1) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    return currentStreak;
  }

  // Calculate average session duration
  private calculateAverageSessionDuration(history: any[]): number {
    if (history.length === 0) return 30;
    
    const recentSessions = history.slice(-10);
    const totalDuration = recentSessions.reduce((sum, session) => sum + (session.duration || 30), 0);
    
    return totalDuration / recentSessions.length;
  }

  // Get current season
  private getCurrentSeason(): string {
    const month = new Date().getMonth();
    
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'fall';
    return 'winter';
  }

  // Get recent topics
  private getRecentTopics(history: any[]): string[] {
    if (history.length === 0) return [];
    
    const recentSessions = history.slice(-5);
    const topics = recentSessions
      .filter(session => session.topics)
      .flatMap(session => session.topics || []);
    
    return [...new Set(topics)];
  }

  // Make prediction using model
  private makePrediction(model: PredictionModel, features: LearningPrediction['factors']): { value: number; confidence: number } {
    // This would use the actual ML model
    // For now, using rule-based prediction
    
    switch (model.algorithm) {
      case 'random_forest':
        return this.predictWithRandomForest(features);
      case 'logistic_regression':
        return this.predictWithLogisticRegression(features);
      case 'gradient_boosting':
        return this.predictWithGradientBoosting(features);
      case 'neural_network':
        return this.predictWithNeuralNetwork(features);
      case 'linear_regression':
        return this.predictWithLinearRegression(features);
      case 'reinforcement_learning':
        return this.predictWithReinforcementLearning(features);
      default:
        return this.predictWithSimpleRules(features);
    }
  }

  // Predict with Random Forest (simplified)
  private predictWithRandomForest(features: LearningPrediction['factors']): { value: number; confidence: number } {
    const accuracy = features.historical.averageAccuracy;
    const consistency = features.historical.consistency;
    const improvement = features.historical.improvementRate;
    
    // Simplified random forest logic
    let value = 75; // Default prediction
    let confidence = 70; // Default confidence
    
    if (accuracy > 85 && consistency > 0.7) {
      value = 90;
      confidence = 85;
    } else if (accuracy > 75 && improvement > 5) {
      value = 80;
      confidence = 80;
    } else if (consistency > 0.8) {
      value = 85;
      confidence = 75;
    } else if (accuracy < 60) {
      value = 65;
      confidence = 65;
    }
    
    return { value, confidence };
  }

  // Predict with Logistic Regression (simplified)
  private predictWithLogisticRegression(features: LearningPrediction['factors']): { value: number; confidence: number } {
    const accuracy = features.historical.averageAccuracy;
    const difficulty = features.content.difficultyLevel;
    const timeAvailable = 30; // Placeholder
    
    // Simplified logistic regression
    const logit = (accuracy * 0.3 + difficulty * 0.2 + timeAvailable * 0.1 - 5);
    const probability = 1 / (1 + Math.exp(-logit));
    
    const value = probability * 100;
    const confidence = Math.min(95, Math.abs(probability - 0.5) * 100 + 50);
    
    return { value, confidence };
  }

  // Predict with Gradient Boosting (simplified)
  private predictWithGradientBoosting(features: LearningPrediction['factors']): { value: number; confidence: number } {
    const accuracy = features.historical.averageAccuracy;
    const improvement = features.historical.improvementRate;
    const consistency = features.historical.consistency;
    
    // Simplified gradient boosting logic
    let value = accuracy;
    let confidence = 70;
    
    if (improvement > 10) {
      value += 15;
      confidence += 15;
    }
    
    if (consistency > 0.8) {
      value += 10;
      confidence += 10;
    }
    
    if (accuracy > 80) {
      value += 5;
      confidence += 5;
    }
    
    return { value: Math.min(100, value), confidence: Math.min(95, confidence) };
  }

  // Predict with Neural Network (simplified)
  private predictWithNeuralNetwork(features: LearningPrediction['factors']): { value: number; confidence: number } {
    const accuracy = features.historical.averageAccuracy;
    const engagement = features.historical.totalSessions > 10 ? 80 : 60;
    const timeOfDay = parseInt(features.contextual.timeOfDay);
    
    // Simplified neural network logic
    const input1 = (accuracy / 100) * 2 - 1;
    const input2 = (engagement / 100) * 3 - 1.5;
    const input3 = (timeOfDay / 24) * 2 - 1;
    
    // Simple activation and output
    const hidden1 = Math.max(0, input1);
    const hidden2 = Math.max(0, input2);
    const hidden3 = Math.max(0, input3);
    
    const output = Math.tanh(hidden1 + hidden2 + hidden3) * 50 + 50;
    const confidence = Math.min(90, Math.abs(output - 50) + 40);
    
    return { value: Math.max(0, Math.min(100, output)), confidence };
  }

  // Predict with Linear Regression (simplified)
  private predictWithLinearRegression(features: LearningPrediction['factors']): { value: number; confidence: number } {
    const accuracy = features.historical.averageAccuracy;
    const difficulty = features.content.difficultyLevel;
    const consistency = features.historical.consistency;
    
    // Simplified linear regression
    const value = (accuracy * 0.4) + (10 - difficulty) * 0.3 + (consistency * 10) + 20;
    const confidence = Math.min(85, Math.abs(accuracy - 75) + 60);
    
    return { value: Math.max(0, Math.min(100, value)), confidence };
  }

  // Predict with Reinforcement Learning (simplified)
  private predictWithReinforcementLearning(features: LearningPrediction['factors']): { value: number; confidence: number } {
    const accuracy = features.historical.averageAccuracy;
    const improvement = features.historical.improvementRate;
    const difficulty = features.content.difficultyLevel;
    
    // Simplified Q-learning logic
    let value = difficulty;
    let confidence = 70;
    
    if (accuracy > 80 && improvement > 5) {
      value = Math.min(10, difficulty + 2);
      confidence = 85;
    } else if (accuracy < 70) {
      value = Math.max(1, difficulty - 1);
      confidence = 60;
    }
    
    return { value, confidence };
  }

  // Predict with simple rules
  private predictWithSimpleRules(features: LearningPrediction['factors']): { value: number; confidence: number } {
    const accuracy = features.historical.averageAccuracy;
    const consistency = features.historical.consistency;
    
    // Simple rule-based prediction
    let value = accuracy;
    let confidence = 70;
    
    if (accuracy > 85) {
      value += 10;
      confidence = 85;
    }
    
    if (consistency > 0.8) {
      value += 5;
      confidence += 10;
    }
    
    return { value: Math.max(0, Math.min(100, value)), confidence };
  }

  // Calculate prediction confidence
  private calculatePredictionConfidence(model: PredictionModel, features: LearningPrediction['factors']): number {
    const modelAccuracy = this.modelAccuracy.get(model.id) || 0.8;
    const featureQuality = this.assessFeatureQuality(features);
    const dataRecency = this.assessDataRecency(features);
    
    return Math.min(95, modelAccuracy * featureQuality * dataRecency);
  }

  // Assess feature quality
  private assessFeatureQuality(features: LearningPrediction['factors']): number {
    let quality = 1.0; // Base quality
    
    if (features.historical.averageAccuracy > 0) quality += 0.1;
    if (features.historical.totalSessions > 5) quality += 0.1;
    if (features.historical.consistency > 0.5) quality += 0.1;
    
    return Math.min(1.5, quality);
  }

  // Assess data recency
  private assessDataRecency(features: LearningPrediction['factors']): number {
    const recentSessions = features.historical.totalSessions;
    
    if (recentSessions > 20) return 1.0;
    if (recentSessions > 10) return 0.8;
    if (recentSessions > 5) return 0.6;
    return 0.4;
  }

  // Get prediction unit
  private getPredictionUnit(predictionType: string): string {
    const units: Record<string, string> = {
      'performance': 'score',
      'completion': 'probability',
      'retention': 'rate',
      'engagement': 'score',
      'difficulty': 'level',
      'time_to_mastery': 'days'
    };
    
    return units[predictionType] || 'value';
  }

  // Generate prediction description
  private generatePredictionDescription(
    predictionType: string,
    value: number,
    features: LearningPrediction['factors']
  ): string {
    const unit = this.getPredictionUnit(predictionType);
    
    switch (predictionType) {
      case 'performance':
        if (value > 85) return `Excellent performance predicted (${value} ${unit})`;
        if (value > 70) return `Good performance predicted (${value} ${unit})`;
        return `Moderate performance predicted (${value} ${unit})`;
      case 'completion':
        if (value > 80) return `High completion likelihood (${value} ${unit})`;
        if (value > 60) return `Moderate completion likelihood (${value} ${unit})`;
        return `Low completion likelihood (${value} ${unit})`;
      case 'retention':
        if (value > 80) return `Strong retention predicted (${value} ${unit})`;
        if (value > 60) return `Moderate retention predicted (${value} ${unit})`;
        return `Weak retention predicted (${value} ${unit})`;
      case 'engagement':
        if (value > 80) return `High engagement predicted (${value} ${unit})`;
        if (value > 60) return `Moderate engagement predicted (${value} ${unit})`;
        return `Low engagement predicted (${value} ${unit})`;
      case 'difficulty':
        if (value > 7) return `High difficulty recommended (${value} ${unit})`;
        if (value > 4) return `Moderate difficulty recommended (${value} ${unit})`;
        return `Low difficulty recommended (${value} ${unit})`;
      case 'time_to_mastery':
        if (value > 30) return `Extended time to mastery (${value} ${unit})`;
        if (value > 14) return `Moderate time to mastery (${value} ${unit})`;
        return `Quick time to mastery (${value} ${unit})`;
      default:
        return `Prediction: ${value} ${unit}`;
    }
  }

  // Create default prediction
  private createDefaultPrediction(
    userId: string,
    predictionType: LearningPrediction['prediction']['type'],
    timeframe: LearningPrediction['prediction']['timeframe']
  ): LearningPrediction {
    return {
      id: `prediction-${userId}-${Date.now()}`,
      userId,
      timestamp: new Date(),
      prediction: {
        type: predictionType,
        timeframe,
        confidence: 50,
        value: 50,
        unit: this.getPredictionUnit(predictionType),
        description: 'Default prediction - insufficient data'
      },
      factors: {
        demographics: {
          age: 10,
          gradeLevel: '4',
          languageLevel: 'beginner',
          timezone: 'UTC',
          deviceType: 'desktop'
        },
        historical: {
          averageAccuracy: 70,
          improvementRate: 0,
          consistency: 0.5,
          streakDays: 0,
          totalSessions: 0,
          averageSessionDuration: 30
        },
        contextual: {
          timeOfDay: new Date().getHours().toString(),
          dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
          season: this.getCurrentSeason(),
          recentTopics: [],
          currentMood: 'neutral',
          deviceType: 'desktop'
        },
        content: {
          difficultyLevel: 5,
          contentType: 'interactive',
          estimatedTime: 30,
          prerequisites: ['basics'],
          relatedSkills: ['vocabulary', 'grammar']
        },
        environmental: {
          notifications: true,
          soundEffects: true,
          animations: true,
          theme: 'light',
          interruptions: 0,
          multitasking: false
        }
      },
      model: {
        algorithm: 'simple_rules',
        version: '1.0.0',
        accuracy: 0.5,
        parameters: {}
      }
    };
  }

  // Store prediction
  private storePrediction(prediction: LearningPrediction): void {
    // This would store in database
    console.log('Prediction stored:', prediction);
  }

  // Get user history
  getUserHistory(userId: string): any[] {
    return this.userHistory.get(userId) || [];
  }

  // Update user history
  updateUserHistory(userId: string, data: any): void {
    if (!this.userHistory.has(userId)) {
      this.userHistory.set(userId, []);
    }
    
    const history = this.userHistory.get(userId)!;
    history.push({
      timestamp: new Date(),
      ...data
    });
    
    // Keep only last 100 entries
    if (history.length > 100) {
      this.userHistory.set(userId, history.slice(-100));
    }
  }

  // Generate learning forecast
  generateForecast(userId: string, timeframe: LearningForecast['timeframe']): LearningForecast {
    const predictions: LearningPrediction[] = [];
    
    // Generate predictions for the specified timeframe
    const periods = this.getTimeframePeriods(timeframe);
    
    periods.forEach((period, index) => {
      const prediction = this.generatePrediction(userId, 'performance', timeframe);
      if (index > 0) {
        // Adjust future predictions based on previous ones
        const previousPrediction = predictions[index - 1];
        if (previousPrediction) {
          prediction.prediction.value = Math.min(100, previousPrediction.prediction.value + Math.random() * 10 - 5);
          prediction.prediction.confidence = Math.max(50, previousPrediction.prediction.confidence - 2);
        }
      }
      
      predictions.push(prediction);
    });
    
    const forecast: LearningForecast = {
      userId,
      timeframe,
      predictions,
      confidence: this.calculateForecastConfidence(predictions),
      recommendations: this.generateForecastRecommendations(predictions),
      timestamp: new Date()
    };
    
    // Store forecast
    this.forecasts.set(`${userId}-${timeframe}`, forecast);
    
    return forecast;
  }

  // Get timeframe periods
  private getTimeframePeriods(timeframe: string): string[] {
    const periods: Record<string, string[]> = {
      'daily': ['today', 'tomorrow', 'day_after'],
      'weekly': ['this_week', 'next_week', 'week_after'],
      'monthly': ['this_month', 'next_month', 'month_after'],
      'quarterly': ['this_quarter', 'next_quarter', 'quarter_after'],
      'yearly': ['this_year', 'next_year']
    };
    
    return periods[timeframe] || ['today'];
  }

  // Calculate forecast confidence
  private calculateForecastConfidence(predictions: LearningPrediction[]): number {
    if (predictions.length === 0) return 50;
    
    const avgConfidence = predictions.reduce((sum, pred) => sum + pred.prediction.confidence, 0) / predictions.length;
    const confidenceVariance = predictions.reduce((sum, pred) => sum + Math.pow(pred.prediction.confidence - avgConfidence, 2), 0) / predictions.length;
    
    // Higher confidence = lower variance
    return Math.max(30, Math.min(95, avgConfidence - (confidenceVariance * 2)));
  }

  // Generate forecast recommendations
  private generateForecastRecommendations(predictions: LearningPrediction[]): LearningForecast['recommendations'] {
    const recommendations = {
      content: [],
      schedule: [],
      adjustments: [],
      goals: []
    };
    
    const avgPerformance = predictions.reduce((sum, pred) => sum + pred.prediction.value, 0) / predictions.length;
    
    if (avgPerformance < 60) {
      recommendations.content.push('Focus on foundational skills');
      recommendations.schedule.push('Increase practice frequency');
      recommendations.adjustments.push('Reduce difficulty level');
      recommendations.goals.push('Master basic concepts first');
    } else if (avgPerformance > 85) {
      recommendations.content.push('Challenge with advanced content');
      recommendations.schedule.push('Maintain current schedule');
      recommendations.adjustments.push('Increase difficulty level');
      recommendations.goals.push('Aim for mastery of complex topics');
    }
    
    return recommendations;
  }

  // Get forecast
  getForecast(userId: string, timeframe: string): LearningForecast | undefined {
    return this.forecasts.get(`${userId}-${timeframe}`);
  }

  // Update model accuracy
  updateModelAccuracy(modelId: string, accuracy: number): void {
    const currentAccuracy = this.modelAccuracy.get(modelId) || 0.5;
    const newAccuracy = (currentAccuracy * 0.9) + (accuracy * 0.1); // Weighted average
    this.modelAccuracy.set(modelId, newAccuracy);
  }

  // Get all models
  getAllModels(): PredictionModel[] {
    return Array.from(this.predictionModels.values());
  }

  // Get model accuracy
  getModelAccuracy(modelId: string): number {
    return this.modelAccuracy.get(modelId) || 0.5;
  }
}

export default AILearningPredictor;
export type { LearningPrediction, PredictionModel, LearningForecast };
