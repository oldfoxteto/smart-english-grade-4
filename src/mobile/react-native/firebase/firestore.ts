import { db } from '../firebase-config';

// Lesson types
export interface Lesson {
  id: string;
  title: string;
  type: 'vocabulary' | 'grammar' | 'conversation' | 'listening' | 'reading';
  level: string;
  duration: number;
  content: string;
  xp: number;
  track: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isLocked: boolean;
  prerequisites?: string[];
}

// Progress types
export interface Progress {
  userId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  date: Date;
  xp: number;
  timeSpent: number;
}

// Achievement types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  xp: number;
  reward: string;
  icon: string;
  category: string;
  isUnlocked: boolean;
  unlockedDate?: Date;
}

// User Progress types
export interface UserProgress {
  userId: string;
  currentLevel: string;
  totalXP: number;
  streak: number;
  lessonsCompleted: number;
  averageScore: number;
  timeSpent: number;
  lastStudyDate: Date;
  achievements: string[];
}

// Firestore Service
class FirestoreService {
  // Lessons
  async getLessons(track?: string, level?: string): Promise<Lesson[]> {
    try {
      let query = db().collection('lessons');
      
      if (track) {
        query = query.where('track', '==', track);
      }
      
      if (level) {
        query = query.where('level', '==', level);
      }
      
      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getLessonById(id: string): Promise<Lesson | null> {
    try {
      const doc = await db().collection('lessons').doc(id).get();
      
      if (doc.exists) {
        return { id: doc.id, ...doc.data() } as Lesson;
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createLesson(lesson: Omit<Lesson, 'id'>): Promise<string> {
    try {
      const docRef = await db().collection('lessons').add(lesson);
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async updateLesson(id: string, updates: Partial<Lesson>): Promise<void> {
    try {
      await db().collection('lessons').doc(id).update(updates);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Progress
  async getUserProgress(userId: string): Promise<UserProgress | null> {
    try {
      const doc = await db().collection('userProgress').doc(userId).get();
      
      if (doc.exists) {
        return doc.data() as UserProgress;
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async updateUserProgress(userId: string, updates: Partial<UserProgress>): Promise<void> {
    try {
      await db().collection('userProgress').doc(userId).update(updates);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createUserProgress(userId: string): Promise<void> {
    try {
      const userProgress: UserProgress = {
        userId,
        currentLevel: 'A1',
        totalXP: 0,
        streak: 0,
        lessonsCompleted: 0,
        averageScore: 0,
        timeSpent: 0,
        lastStudyDate: new Date(),
        achievements: [],
      };
      
      await db().collection('userProgress').doc(userId).set(userProgress);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async addLessonProgress(progress: Omit<Progress, 'date'>): Promise<void> {
    try {
      const progressWithDate = {
        ...progress,
        date: new Date(),
      };
      
      await db().collection('progress').add(progressWithDate);
      
      // Update user progress
      await this.updateUserProgressFromLesson(progress);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getLessonProgress(userId: string, lessonId?: string): Promise<Progress[]> {
    try {
      let query = db().collection('progress').where('userId', '==', userId);
      
      if (lessonId) {
        query = query.where('lessonId', '==', lessonId);
      }
      
      const snapshot = await query.get();
      return snapshot.docs.map(doc => doc.data() as Progress);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    try {
      const snapshot = await db().collection('achievements').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Achievement));
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    try {
      const userProgress = await this.getUserProgress(userId);
      if (!userProgress) return [];
      
      const achievements = await this.getAchievements();
      return achievements.filter(achievement => 
        userProgress.achievements.includes(achievement.id)
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    try {
      const userProgress = await this.getUserProgress(userId);
      if (!userProgress) return;
      
      if (!userProgress.achievements.includes(achievementId)) {
        userProgress.achievements.push(achievementId);
        await this.updateUserProgress(userId, userProgress);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Helper methods
  private async updateUserProgressFromLesson(progress: Omit<Progress, 'date'>): Promise<void> {
    try {
      const userProgress = await this.getUserProgress(progress.userId);
      if (!userProgress) return;
      
      // Update total XP
      userProgress.totalXP += progress.xp;
      
      // Update lessons completed
      if (progress.completed) {
        userProgress.lessonsCompleted += 1;
      }
      
      // Update average score
      const lessonProgresses = await this.getLessonProgress(progress.userId);
      const completedLessons = lessonProgresses.filter(p => p.completed);
      if (completedLessons.length > 0) {
        const totalScore = completedLessons.reduce((sum, p) => sum + p.score, 0);
        userProgress.averageScore = totalScore / completedLessons.length;
      }
      
      // Update streak
      const today = new Date();
      const lastStudy = userProgress.lastStudyDate;
      const daysDiff = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        userProgress.streak += 1;
      } else if (daysDiff > 1) {
        userProgress.streak = 1;
      }
      
      userProgress.lastStudyDate = today;
      
      // Update level based on XP
      userProgress.currentLevel = this.calculateLevel(userProgress.totalXP);
      
      await this.updateUserProgress(progress.userId, userProgress);
      
      // Check for new achievements
      await this.checkAchievements(progress.userId, userProgress);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  private calculateLevel(xp: number): string {
    if (xp >= 5000) return 'C2';
    if (xp >= 4000) return 'C1';
    if (xp >= 3000) return 'B2';
    if (xp >= 2000) return 'B1';
    if (xp >= 1000) return 'A2';
    return 'A1';
  }

  private async checkAchievements(userId: string, userProgress: UserProgress): Promise<void> {
    try {
      const achievements = await this.getAchievements();
      
      for (const achievement of achievements) {
        if (userProgress.achievements.includes(achievement.id)) continue;
        
        let shouldUnlock = false;
        
        switch (achievement.id) {
          case 'first_lesson':
            shouldUnlock = userProgress.lessonsCompleted >= 1;
            break;
          case 'week_streak':
            shouldUnlock = userProgress.streak >= 7;
            break;
          case 'month_streak':
            shouldUnlock = userProgress.streak >= 30;
            break;
          case 'xp_100':
            shouldUnlock = userProgress.totalXP >= 100;
            break;
          case 'xp_500':
            shouldUnlock = userProgress.totalXP >= 500;
            break;
          case 'xp_1000':
            shouldUnlock = userProgress.totalXP >= 1000;
            break;
          case 'level_a2':
            shouldUnlock = userProgress.currentLevel === 'A2';
            break;
          case 'level_b1':
            shouldUnlock = userProgress.currentLevel === 'B1';
            break;
          case 'level_b2':
            shouldUnlock = userProgress.currentLevel === 'B2';
            break;
          case 'level_c1':
            shouldUnlock = userProgress.currentLevel === 'C1';
            break;
          case 'level_c2':
            shouldUnlock = userProgress.currentLevel === 'C2';
            break;
        }
        
        if (shouldUnlock) {
          await this.unlockAchievement(userId, achievement.id);
        }
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Real-time listeners
  onUserProgressChange(userId: string, callback: (progress: UserProgress | null) => void): () => void {
    return db().collection('userProgress').doc(userId).onSnapshot((doc) => {
      if (doc.exists) {
        callback(doc.data() as UserProgress);
      } else {
        callback(null);
      }
    });
  }

  onLessonsChange(callback: (lessons: Lesson[]) => void): () => void {
    return db().collection('lessons').onSnapshot((snapshot) => {
      const lessons = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
      callback(lessons);
    });
  }
}

export default new FirestoreService();
