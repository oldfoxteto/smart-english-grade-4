// Mastery Engine Implementation for Learning Engine
import { SkillGraph, UserSkillProgress } from './SkillGraph';

export interface MasteryLevel {
  level: number; // 0-100
  name: string;
  description: string;
  criteria: {
    minScore: number;
    practiceCount: number;
    timeSpent: number;
    consistencyBonus: number;
  };
  badges: string[];
  rewards: string[];
}

export interface MasteryAssessment {
  skillId: string;
  userId: string;
  assessmentType: 'diagnostic' | 'practice' | 'review' | 'challenge';
  score: number;
  maxScore: number;
  timeSpent: number;
  attempts: number;
  feedback: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    nextSteps: string[];
  };
  timestamp: Date;
}

export interface MasteryProgress {
  skillId: string;
  userId: string;
  currentLevel: MasteryLevel;
  progressHistory: {
    date: Date;
    level: number;
    score: number;
    timeSpent: number;
  }[];
  streakDays: number;
  totalPracticeTime: number;
  averageScore: number;
  improvementRate: number; // percentage
}

export interface MasteryGoal {
  id: string;
  userId: string;
  skillId: string;
  targetLevel: number;
  targetDate: Date;
  milestones: {
    level: number;
    description: string;
    completed: boolean;
    completedDate?: Date;
  }[];
  rewards: {
    type: 'badge' | 'points' | 'certificate' | 'unlock';
    value: string | number;
    description: string;
  }[];
}

class MasteryEngine {
  private skillGraph: SkillGraph;
  private masteryLevels: MasteryLevel[] = [];
  private userProgress: Map<string, MasteryProgress> = new Map();
  private assessments: Map<string, MasteryAssessment[]> = new Map();
  private goals: Map<string, MasteryGoal> = new Map();

  constructor(skillGraph: SkillGraph) {
    this.skillGraph = skillGraph;
    this.initializeMasteryLevels();
  }

  // Initialize mastery levels
  private initializeMasteryLevels(): void {
    this.masteryLevels = [
      {
        level: 0,
        name: 'Not Started',
        description: 'No practice or assessment completed',
        criteria: { minScore: 0, practiceCount: 0, timeSpent: 0, consistencyBonus: 0 },
        badges: [],
        rewards: []
      },
      {
        level: 10,
        name: 'Beginner',
        description: 'Basic understanding and application',
        criteria: { minScore: 60, practiceCount: 3, timeSpent: 30, consistencyBonus: 5 },
        badges: ['first-steps', 'beginner-learner'],
        rewards: ['access-to-next-level', '10-points']
      },
      {
        level: 25,
        name: 'Developing',
        description: 'Growing competence with some guidance',
        criteria: { minScore: 70, practiceCount: 5, timeSpent: 60, consistencyBonus: 10 },
        badges: ['consistent-practice', 'skill-builder'],
        rewards: ['25-points', 'new-exercise-unlock']
      },
      {
        level: 50,
        name: 'Proficient',
        description: 'Good understanding and independent application',
        criteria: { minScore: 80, practiceCount: 10, timeSpent: 120, consistencyBonus: 15 },
        badges: ['proficient-learner', 'skill-master'],
        rewards: ['50-points', 'certificate-eligible']
      },
      {
        level: 75,
        name: 'Advanced',
        description: 'Excellent understanding and creative application',
        criteria: { minScore: 85, practiceCount: 15, timeSpent: 180, consistencyBonus: 20 },
        badges: ['advanced-learner', 'skill-expert'],
        rewards: ['75-points', 'special-feature-unlock']
      },
      {
        level: 90,
        name: 'Expert',
        description: 'Mastery with teaching capabilities',
        criteria: { minScore: 90, practiceCount: 20, timeSpent: 240, consistencyBonus: 25 },
        badges: ['expert-learner', 'teaching-assistant'],
        rewards: ['90-points', 'mentor-badge']
      },
      {
        level: 100,
        name: 'Master',
        description: 'Complete mastery with ability to teach others',
        criteria: { minScore: 95, practiceCount: 25, timeSpent: 300, consistencyBonus: 30 },
        badges: ['master-learner', 'skill-ambassador'],
        rewards: ['100-points', 'completion-certificate']
      }
    ];
  }

  // Calculate mastery level based on assessment
  calculateMasteryLevel(skillId: string, assessment: MasteryAssessment): MasteryLevel {
    const currentProgress = this.getUserProgress(skillId);
    const score = assessment.score;
    const maxScore = assessment.maxScore;
    
    // Calculate base score percentage
    const scorePercentage = (score / maxScore) * 100;
    
    // Get current mastery level
    const currentLevel = currentProgress?.currentLevel || this.masteryLevels[0];
    
    // Check if user can level up
    if (scorePercentage >= currentLevel.criteria.minScore) {
      // Find the appropriate mastery level
      let newLevel = currentLevel;
      for (const level of this.masteryLevels) {
        if (scorePercentage >= level.criteria.minScore) {
          newLevel = level;
        } else {
          break;
        }
      }
      
      return newLevel;
    }
    
    return currentLevel;
  }

  // Update user progress
  updateUserProgress(skillId: string, userId: string, assessment: MasteryAssessment): void {
    const currentProgress = this.getUserProgress(skillId) || {
      skillId,
      userId,
      currentLevel: this.masteryLevels[0],
      progressHistory: [],
      streakDays: 0,
      totalPracticeTime: 0,
      averageScore: 0,
      improvementRate: 0
    };

    // Add assessment to history
    currentProgress.progressHistory.push({
      date: assessment.timestamp,
      level: this.calculateMasteryLevel(skillId, assessment).level,
      score: assessment.score,
      timeSpent: assessment.timeSpent
    });

    // Update streak days
    const today = new Date();
    const lastPractice = currentProgress.progressHistory[currentProgress.progressHistory.length - 2];
    if (lastPractice) {
      const daysDiff = Math.floor((today.getTime() - lastPractice.date.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 1) {
        currentProgress.streakDays += 1;
      } else {
        currentProgress.streakDays = 1;
      }
    } else {
      currentProgress.streakDays = 1;
    }

    // Update total practice time
    currentProgress.totalPracticeTime += assessment.timeSpent;

    // Calculate average score
    const totalScore = currentProgress.progressHistory.reduce((sum, entry) => sum + entry.score, 0);
    currentProgress.averageScore = totalScore / currentProgress.progressHistory.length;

    // Calculate improvement rate
    if (currentProgress.progressHistory.length >= 2) {
      const recentScores = currentProgress.progressHistory.slice(-5);
      const olderScores = currentProgress.progressHistory.slice(-10, -5);
      const recentAvg = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
      const olderAvg = olderScores.reduce((sum, score) => sum + score, 0) / olderScores.length;
      currentProgress.improvementRate = ((recentAvg - olderAvg) / olderAvg) * 100;
    }

    // Update current level
    currentProgress.currentLevel = this.calculateMasteryLevel(skillId, assessment);

    // Store updated progress
    this.userProgress.set(`${userId}-${skillId}`, currentProgress);

    // Store assessment
    if (!this.assessments.has(skillId)) {
      this.assessments.set(skillId, []);
    }
    this.assessments.get(skillId)!.push(assessment);
  }

  // Get user progress for a skill
  getUserProgress(skillId: string, userId?: string): MasteryProgress | undefined {
    if (userId) {
      return this.userProgress.get(`${userId}-${skillId}`);
    }
    
    // Return the most recent progress for any user
    const allProgress = Array.from(this.userProgress.values())
      .filter(progress => progress.skillId === skillId)
      .sort((a, b) => b.progressHistory[b.progressHistory.length - 1].date.getTime() - a.progressHistory[a.progressHistory.length - 1].date.getTime());
    
    return allProgress[0];
  }

  // Get mastery level details
  getMasteryLevel(level: number): MasteryLevel | undefined {
    return this.masteryLevels.find(l => l.level === level);
  }

  // Check if user has mastered a skill
  hasMasteredSkill(skillId: string, userId: string): boolean {
    const progress = this.getUserProgress(skillId, userId);
    return progress ? progress.currentLevel.level >= 100 : false;
  }

  // Get next level requirements
  getNextLevelRequirements(skillId: string, userId: string): {
    currentLevel: MasteryLevel;
    nextLevel: MasteryLevel | null;
    requirements: {
      scoreNeeded: number;
      practiceNeeded: number;
      timeNeeded: number;
      consistencyNeeded: number;
    } | null {
    const progress = this.getUserProgress(skillId, userId);
    if (!progress) return null;

    const currentLevel = progress.currentLevel;
    const currentIndex = this.masteryLevels.findIndex(l => l.level === currentLevel.level);
    
    if (currentIndex < this.masteryLevels.length - 1) {
      const nextLevel = this.masteryLevels[currentIndex + 1];
      const currentScore = progress.progressHistory[progress.progressHistory.length - 1]?.score || 0;
      
      return {
        currentLevel,
        nextLevel,
        requirements: {
          scoreNeeded: nextLevel.criteria.minScore - currentScore,
          practiceNeeded: nextLevel.criteria.practiceCount - (progress.progressHistory.length - 1),
          timeNeeded: nextLevel.criteria.timeSpent - progress.totalPracticeTime,
          consistencyNeeded: nextLevel.criteria.consistencyBonus - this.calculateConsistencyScore(progress)
        }
      };
    }

    return null;
  }

  // Calculate consistency score
  private calculateConsistencyScore(progress: MasteryProgress): number {
    if (progress.progressHistory.length < 3) return 0;

    const recentScores = progress.progressHistory.slice(-7).map(entry => entry.score);
    const average = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
    const variance = recentScores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / recentScores.length;
    
    // Lower variance = higher consistency
    const maxVariance = 100; // Maximum possible variance
    const consistencyScore = Math.max(0, Math.round(((maxVariance - variance) / maxVariance) * 25));
    
    return consistencyScore;
  }

  // Create mastery goal
  createGoal(userId: string, skillId: string, targetLevel: number, targetDate: Date): MasteryGoal {
    const goal: MasteryGoal = {
      id: `goal-${userId}-${skillId}-${Date.now()}`,
      userId,
      skillId,
      targetLevel,
      targetDate,
      milestones: [],
      rewards: []
    };

    // Generate milestones
    const targetMasteryLevel = this.getMasteryLevel(targetLevel);
    if (targetMasteryLevel) {
      const currentProgress = this.getUserProgress(skillId, userId);
      const currentLevel = currentProgress?.currentLevel || this.masteryLevels[0];
      
      // Create milestones for each level between current and target
      let currentLevelIndex = this.masteryLevels.findIndex(l => l.level === currentLevel.level);
      const targetLevelIndex = this.masteryLevels.findIndex(l => l.level === targetLevel);
      
      for (let i = currentLevelIndex + 1; i <= targetLevelIndex; i++) {
        const level = this.masteryLevels[i];
        goal.milestones.push({
          level: level.level,
          description: `Reach ${level.name} level`,
          completed: false
        });
      }
      
      // Mark target milestone as the goal
      if (goal.milestones.length > 0) {
        goal.milestones[goal.milestones.length - 1].completed = true;
        goal.milestones[goal.milestones.length - 1].completedDate = targetDate;
      }
    }

    this.goals.set(goal.id, goal);
    return goal;
  }

  // Get user goals
  getUserGoals(userId: string): MasteryGoal[] {
    return Array.from(this.goals.values()).filter(goal => goal.userId === userId);
  }

  // Update goal progress
  updateGoalProgress(goalId: string, skillId: string, userId: string): void {
    const goal = this.goals.get(goalId);
    const progress = this.getUserProgress(skillId, userId);
    
    if (goal && progress) {
      const currentLevel = progress.currentLevel.level;
      
      // Update milestones
      goal.milestones.forEach(milestone => {
        if (!milestone.completed && milestone.level <= currentLevel) {
          milestone.completed = true;
          milestone.completedDate = new Date();
        }
      });
      
      // Add rewards for completed milestones
      const completedMilestones = goal.milestones.filter(m => m.completed);
      completedMilestones.forEach(milestone => {
        const level = this.getMasteryLevel(milestone.level);
        if (level) {
          level.rewards.forEach(reward => {
            if (!goal.rewards.find(r => r.type === reward.type && r.value === reward.value)) {
              goal.rewards.push({
                type: reward.type,
                value: reward.value,
                description: `Completed ${milestone.description}: ${reward.description}`
              });
            }
          });
        }
      });
      
      this.goals.set(goalId, goal);
    }
  }

  // Generate mastery report
  generateMasteryReport(userId: string, skillId: string): {
    skill: any;
    progress: MasteryProgress | null;
    assessments: MasteryAssessment[];
    goals: MasteryGoal[];
    recommendations: string[];
  } {
    const skill = this.skillGraph.getSkill(skillId);
    const progress = this.getUserProgress(skillId, userId);
    const assessments = this.assessments.get(skillId) || [];
    const goals = this.getUserGoals(userId);
    
    const recommendations: string[] = [];
    
    if (progress) {
      // Analyze progress and generate recommendations
      if (progress.currentLevel.level < 50) {
        recommendations.push('Focus on basic practice exercises to build foundation');
        recommendations.push('Review prerequisite skills if struggling');
      } else if (progress.currentLevel.level < 75) {
        recommendations.push('Try more challenging exercises to push to next level');
        recommendations.push('Practice with real-world examples');
      } else {
        recommendations.push('Explore advanced topics and creative applications');
        recommendations.push('Consider helping other learners');
      }
      
      // Consistency recommendations
      if (progress.streakDays < 3) {
        recommendations.push('Practice more consistently to build momentum');
      }
      
      // Improvement recommendations
      if (progress.improvementRate < 10) {
        recommendations.push('Review previous assessments to identify areas for improvement');
      }
    }
    
    return {
      skill,
      progress,
      assessments,
      goals,
      recommendations
    };
  }

  // Get leaderboards for a skill
  getLeaderboard(skillId: string, limit: number = 10): Array<{
    userId: string;
    masteryLevel: number;
    totalScore: number;
    practiceTime: number;
  }> {
    const allProgress = Array.from(this.userProgress.values())
      .filter(progress => progress.skillId === skillId)
      .sort((a, b) => b.currentLevel.level - a.currentLevel.level)
      .slice(0, limit);
    
    return allProgress.map(progress => ({
      userId: progress.userId,
      masteryLevel: progress.currentLevel.level,
      totalScore: progress.averageScore * progress.progressHistory.length,
      practiceTime: progress.totalPracticeTime
    }));
  }
}

export default MasteryEngine;
export type { MasteryLevel, MasteryAssessment, MasteryProgress, MasteryGoal };
