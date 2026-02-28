import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import analytics from '@react-native-firebase/analytics';

const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

// Firebase configuration (use .env / CI secrets in real environments)
const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY ?? "your_api_key_here",
  authDomain: env.FIREBASE_AUTH_DOMAIN ?? "your_project.firebaseapp.com",
  projectId: env.FIREBASE_PROJECT_ID ?? "your_project_id",
  storageBucket: env.FIREBASE_STORAGE_BUCKET ?? "your_project.firebasestorage.app",
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID ?? "your_sender_id",
  appId: env.FIREBASE_APP_ID ?? "your_app_id",
  measurementId: env.FIREBASE_MEASUREMENT_ID ?? "your_measurement_id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const authInstance = auth();
export const db = firestore();
export const storageInstance = storage();
export const analyticsInstance = analytics();

export default app;
