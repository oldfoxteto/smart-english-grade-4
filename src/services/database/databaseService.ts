import { openDB, IDBPDatabase, DBSchema } from 'idb';
import { Student, Exercise, Lesson, Progress, Achievement } from '../../types';

// Database Schema
interface SmartEnglishDB extends DBSchema {
  // Users and Authentication
  users: {
    key: string;
    value: {
      id: string;
      username: string;
      email: string;
      role: 'student' | 'teacher' | 'admin';
      profile: any;
      settings: any;
      createdAt: string;
      updatedAt: string;
    };
    indexes: {
      'by-email': string;
      'by-role': string;
      'by-username': string;
    };
  };

  // Students
  students: {
    key: string;
    value: Student;
    indexes: {
      'by-class': string;
      'by-level': string;
      'by-name': string;
      'by-progress': number;
    };
  };

  // Lessons
  lessons: {
    key: string;
    value: Lesson;
    indexes: {
      'by-grade': string;
      'by-subject': string;
      'by-difficulty': string;
      'by-status': string;
      'by-teacher': string;
    };
  };

  // Exercises
  exercises: {
    key: string;
    value: Exercise;
    indexes: {
      'by-lesson': string;
      'by-type': string;
      'by-difficulty': string;
      'by-status': string;
    };
  };

  // Progress Tracking
  progress: {
    key: string;
    value: Progress;
    indexes: {
      'by-student': string;
      'by-lesson': string;
      'by-exercise': string;
      'by-date': string;
      'by-skill': string;
    };
  };

  // Achievements
  achievements: {
    key: string;
    value: Achievement;
    indexes: {
      'by-student': string;
      'by-type': string;
      'by-date': string;
      'by-status': string;
    };
  };

  // Cache for offline data
  cache: {
    key: string;
    value: {
      data: any;
      timestamp: number;
      expiresAt: number;
      endpoint: string;
    };
    indexes: {
      'by-endpoint': string;
      'by-expires': number;
    };
  };

  // Offline queue for sync
  syncQueue: {
    key: string;
    value: {
      id: string;
      method: 'POST' | 'PUT' | 'DELETE';
      endpoint: string;
      data: any;
      timestamp: number;
      retries: number;
      status: 'pending' | 'syncing' | 'failed';
    };
    indexes: {
      'by-status': string;
      'by-timestamp': number;
    };
  };

  // Settings
  settings: {
    key: string;
    value: {
      key: string;
      value: any;
      updatedAt: string;
    };
    indexes: {
      'by-key': string;
    };
  };
}

// Database Service Class
class DatabaseService {
  private db: IDBPDatabase<SmartEnglishDB> | null = null;
  private readonly DB_NAME = 'SmartEnglishDB';
  private readonly DB_VERSION = 1;

  // Initialize database
  async init(): Promise<void> {
    try {
      this.db = await openDB<SmartEnglishDB>(this.DB_NAME, this.DB_VERSION, {
        upgrade(db) {
          // Users store
          if (!db.objectStoreNames.contains('users')) {
            const usersStore = db.createObjectStore('users', { keyPath: 'id' });
            usersStore.createIndex('by-email', 'email');
            usersStore.createIndex('by-role', 'role');
            usersStore.createIndex('by-username', 'username');
          }

          // Students store
          if (!db.objectStoreNames.contains('students')) {
            const studentsStore = db.createObjectStore('students', { keyPath: 'id' });
            studentsStore.createIndex('by-class', 'classId');
            studentsStore.createIndex('by-level', 'level');
            studentsStore.createIndex('by-name', ['firstName', 'lastName']);
            studentsStore.createIndex('by-progress', 'progress');
          }

          // Lessons store
          if (!db.objectStoreNames.contains('lessons')) {
            const lessonsStore = db.createObjectStore('lessons', { keyPath: 'id' });
            lessonsStore.createIndex('by-grade', 'grade');
            lessonsStore.createIndex('by-subject', 'subject');
            lessonsStore.createIndex('by-difficulty', 'difficulty');
            lessonsStore.createIndex('by-status', 'status');
            lessonsStore.createIndex('by-teacher', 'teacherId');
          }

          // Exercises store
          if (!db.objectStoreNames.contains('exercises')) {
            const exercisesStore = db.createObjectStore('exercises', { keyPath: 'id' });
            exercisesStore.createIndex('by-lesson', 'lessonId');
            exercisesStore.createIndex('by-type', 'type');
            exercisesStore.createIndex('by-difficulty', 'difficulty');
            exercisesStore.createIndex('by-status', 'status');
          }

          // Progress store
          if (!db.objectStoreNames.contains('progress')) {
            const progressStore = db.createObjectStore('progress', { keyPath: 'id' });
            progressStore.createIndex('by-student', 'studentId');
            progressStore.createIndex('by-lesson', 'lessonId');
            progressStore.createIndex('by-exercise', 'exerciseId');
            progressStore.createIndex('by-date', 'date');
            progressStore.createIndex('by-skill', 'skill');
          }

          // Achievements store
          if (!db.objectStoreNames.contains('achievements')) {
            const achievementsStore = db.createObjectStore('achievements', { keyPath: 'id' });
            achievementsStore.createIndex('by-student', 'studentId');
            achievementsStore.createIndex('by-type', 'type');
            achievementsStore.createIndex('by-date', 'date');
            achievementsStore.createIndex('by-status', 'status');
          }

          // Cache store
          if (!db.objectStoreNames.contains('cache')) {
            const cacheStore = db.createObjectStore('cache', { keyPath: 'id' });
            cacheStore.createIndex('by-endpoint', 'endpoint');
            cacheStore.createIndex('by-expires', 'expiresAt');
          }

          // Sync queue store
          if (!db.objectStoreNames.contains('syncQueue')) {
            const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
            syncStore.createIndex('by-status', 'status');
            syncStore.createIndex('by-timestamp', 'timestamp');
          }

          // Settings store
          if (!db.objectStoreNames.contains('settings')) {
            const settingsStore = db.createObjectStore('settings', { keyPath: 'key' });
            settingsStore.createIndex('by-key', 'key');
          }
        },
      });

      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  // Get database instance
  private getDB(): IDBPDatabase<SmartEnglishDB> {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.');
    }
    return this.db;
  }

  // Users Operations
  async createUser(user: SmartEnglishDB['users']['value']): Promise<void> {
    const db = this.getDB();
    await db.add('users', user);
  }

  async getUser(id: string): Promise<SmartEnglishDB['users']['value'] | undefined> {
    const db = this.getDB();
    return await db.get('users', id);
  }

  async getUserByEmail(email: string): Promise<SmartEnglishDB['users']['value'] | undefined> {
    const db = this.getDB();
    return await db.getFromIndex('users', 'by-email', email);
  }

  async updateUser(user: SmartEnglishDB['users']['value']): Promise<void> {
    const db = this.getDB();
    await db.put('users', user);
  }

  async deleteUser(id: string): Promise<void> {
    const db = this.getDB();
    await db.delete('users', id);
  }

  // Students Operations
  async createStudent(student: Student): Promise<void> {
    const db = this.getDB();
    await db.add('students', student);
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const db = this.getDB();
    return await db.get('students', id);
  }

  async getStudentsByClass(classId: string): Promise<Student[]> {
    const db = this.getDB();
    return await db.getAllFromIndex('students', 'by-class', classId);
  }

  async updateStudent(student: Student): Promise<void> {
    const db = this.getDB();
    await db.put('students', student);
  }

  async deleteStudent(id: string): Promise<void> {
    const db = this.getDB();
    await db.delete('students', id);
  }

  // Lessons Operations
  async createLesson(lesson: Lesson): Promise<void> {
    const db = this.getDB();
    await db.add('lessons', lesson);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    const db = this.getDB();
    return await db.get('lessons', id);
  }

  async getLessonsByGrade(grade: string): Promise<Lesson[]> {
    const db = this.getDB();
    return await db.getAllFromIndex('lessons', 'by-grade', grade);
  }

  async updateLesson(lesson: Lesson): Promise<void> {
    const db = this.getDB();
    await db.put('lessons', lesson);
  }

  async deleteLesson(id: string): Promise<void> {
    const db = this.getDB();
    await db.delete('lessons', id);
  }

  // Exercises Operations
  async createExercise(exercise: Exercise): Promise<void> {
    const db = this.getDB();
    await db.add('exercises', exercise);
  }

  async getExercise(id: string): Promise<Exercise | undefined> {
    const db = this.getDB();
    return await db.get('exercises', id);
  }

  async getExercisesByLesson(lessonId: string): Promise<Exercise[]> {
    const db = this.getDB();
    return await db.getAllFromIndex('exercises', 'by-lesson', lessonId);
  }

  async updateExercise(exercise: Exercise): Promise<void> {
    const db = this.getDB();
    await db.put('exercises', exercise);
  }

  async deleteExercise(id: string): Promise<void> {
    const db = this.getDB();
    await db.delete('exercises', id);
  }

  // Progress Operations
  async createProgress(progress: Progress): Promise<void> {
    const db = this.getDB();
    await db.add('progress', progress);
  }

  async getProgress(id: string): Promise<Progress | undefined> {
    const db = this.getDB();
    return await db.get('progress', id);
  }

  async getProgressByStudent(studentId: string): Promise<Progress[]> {
    const db = this.getDB();
    return await db.getAllFromIndex('progress', 'by-student', studentId);
  }

  async updateProgress(progress: Progress): Promise<void> {
    const db = this.getDB();
    await db.put('progress', progress);
  }

  async deleteProgress(id: string): Promise<void> {
    const db = this.getDB();
    await db.delete('progress', id);
  }

  // Achievements Operations
  async createAchievement(achievement: Achievement): Promise<void> {
    const db = this.getDB();
    await db.add('achievements', achievement);
  }

  async getAchievement(id: string): Promise<Achievement | undefined> {
    const db = this.getDB();
    return await db.get('achievements', id);
  }

  async getAchievementsByStudent(studentId: string): Promise<Achievement[]> {
    const db = this.getDB();
    return await db.getAllFromIndex('achievements', 'by-student', studentId);
  }

  async updateAchievement(achievement: Achievement): Promise<void> {
    const db = this.getDB();
    await db.put('achievements', achievement);
  }

  async deleteAchievement(id: string): Promise<void> {
    const db = this.getDB();
    await db.delete('achievements', id);
  }

  // Cache Operations
  async cacheData(endpoint: string, data: any, ttl: number = 3600000): Promise<void> {
    const db = this.getDB();
    const id = `cache_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const timestamp = Date.now();
    const expiresAt = timestamp + ttl;

    await db.put('cache', {
      id,
      data,
      timestamp,
      expiresAt,
      endpoint,
    });
  }

  async getCachedData(endpoint: string): Promise<any | null> {
    const db = this.getDB();
    const id = `cache_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const cached = await db.get('cache', id);

    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      await db.delete('cache', id);
      return null;
    }

    return cached.data;
  }

  async clearExpiredCache(): Promise<void> {
    const db = this.getDB();
    const now = Date.now();
    const expiredKeys = await db.getAllKeysFromIndex('cache', 'by-expires', IDBKeyRange.upperBound(now));
    
    for (const key of expiredKeys) {
      await db.delete('cache', key);
    }
  }

  async clearCache(): Promise<void> {
    const db = this.getDB();
    await db.clear('cache');
  }

  // Sync Queue Operations
  async addToSyncQueue(item: Omit<SmartEnglishDB['syncQueue']['value'], 'id' | 'timestamp' | 'retries' | 'status'>): Promise<void> {
    const db = this.getDB();
    const id = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await db.put('syncQueue', {
      id,
      timestamp: Date.now(),
      retries: 0,
      status: 'pending',
      ...item,
    });
  }

  async getSyncQueueItems(status?: string): Promise<SmartEnglishDB['syncQueue']['value'][]> {
    const db = this.getDB();
    
    if (status) {
      return await db.getAllFromIndex('syncQueue', 'by-status', status);
    }
    
    return await db.getAll('syncQueue');
  }

  async updateSyncQueueItem(item: SmartEnglishDB['syncQueue']['value']): Promise<void> {
    const db = this.getDB();
    await db.put('syncQueue', item);
  }

  async deleteSyncQueueItem(id: string): Promise<void> {
    const db = this.getDB();
    await db.delete('syncQueue', id);
  }

  // Settings Operations
  async setSetting(key: string, value: any): Promise<void> {
    const db = this.getDB();
    await db.put('settings', {
      key,
      value,
      updatedAt: new Date().toISOString(),
    });
  }

  async getSetting(key: string): Promise<any | undefined> {
    const db = this.getDB();
    const setting = await db.get('settings', key);
    return setting?.value;
  }

  async getAllSettings(): Promise<Record<string, any>> {
    const db = this.getDB();
    const settings = await db.getAll('settings');
    const result: Record<string, any> = {};
    
    settings.forEach(setting => {
      result[setting.key] = setting.value;
    });
    
    return result;
  }

  // Database Maintenance
  async clearAllData(): Promise<void> {
    const db = this.getDB();
    const storeNames = db.objectStoreNames;
    
    for (const storeName of storeNames) {
      await db.clear(storeName);
    }
  }

  async getDatabaseInfo(): Promise<any> {
    const db = this.getDB();
    const info: any = {};
    
    for (const storeName of db.objectStoreNames) {
      const count = await db.count(storeName);
      info[storeName] = count;
    }
    
    return info;
  }

  // Backup and Restore
  async exportData(): Promise<any> {
    const db = this.getDB();
    const backup: any = {};
    
    for (const storeName of db.objectStoreNames) {
      backup[storeName] = await db.getAll(storeName);
    }
    
    return backup;
  }

  async importData(data: any): Promise<void> {
    const db = this.getDB();
    
    for (const storeName of db.objectStoreNames) {
      if (data[storeName]) {
        await db.clear(storeName);
        for (const item of data[storeName]) {
          await db.add(storeName, item);
        }
      }
    }
  }

  // Close database
  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Create singleton instance
const databaseService = new DatabaseService();

export default databaseService;
export { SmartEnglishDB };
