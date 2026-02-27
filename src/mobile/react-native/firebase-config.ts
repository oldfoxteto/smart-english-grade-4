import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import analytics from '@react-native-firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6qPkFaPtro8clMrzSZU6PMt3KNo1ye4M",
  authDomain: "ai-english-master.firebaseapp.com",
  projectId: "ai-english-master",
  storageBucket: "ai-english-master.firebasestorage.app",
  messagingSenderId: "1024060586198",
  appId: "1:1024060586198:web:55a72ac8f547ae5797b177",
  measurementId: "G-CT3J8HKTTP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const authInstance = auth();
export const db = firestore();
export const storageInstance = storage();
export const analyticsInstance = analytics();

export default app;
