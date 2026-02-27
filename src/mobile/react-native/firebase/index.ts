// Firebase services export
export { default as AuthService } from './auth';
export { default as FirestoreService } from './firestore';
export { default as StorageService } from './storage';

// Types export
export type { User } from './auth';
export type { Lesson, Progress, Achievement, UserProgress } from './firestore';

// Firebase config export
export { authInstance, db, storageInstance, analyticsInstance } from '../firebase-config';
