import { authInstance } from '../firebase-config';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// User types
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  level: string;
  xp: number;
  streak: number;
  goal: string;
  track: string;
  joinedDate: Date;
  lastActive: Date;
}

// Authentication Service
class AuthService {
  // Sign up with email and password
  async signUp(email: string, password: string, displayName: string): Promise<User> {
    try {
      const userCredential = await authInstance().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Update display name
      await user.updateProfile({ displayName });
      
      // Create user profile in Firestore
      const userProfile: User = {
        uid: user.uid,
        email: user.email!,
        displayName,
        level: 'A1',
        xp: 0,
        streak: 0,
        goal: 'general',
        track: 'general',
        joinedDate: new Date(),
        lastActive: new Date(),
      };
      
      await this.createUserProfile(userProfile);
      
      return userProfile;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await authInstance().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      const userProfile = await this.getUserProfile(user.uid);
      
      // Update last active
      await this.updateLastActive(user.uid);
      
      return userProfile;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<User> {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = authInstance.GoogleAuthProvider.credential(idToken);
      const userCredential = await authInstance().signInWithCredential(googleCredential);
      const user = userCredential.user;
      
      // Check if user exists in Firestore
      let userProfile = await this.getUserProfile(user.uid);
      
      if (!userProfile) {
        // Create new user profile
        userProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || 'User',
          photoURL: user.photoURL,
          level: 'A1',
          xp: 0,
          streak: 0,
          goal: 'general',
          track: 'general',
          joinedDate: new Date(),
          lastActive: new Date(),
        };
        
        await this.createUserProfile(userProfile);
      } else {
        // Update last active
        await this.updateLastActive(user.uid);
      }
      
      return userProfile;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await authInstance().signOut();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    const currentUser = authInstance().currentUser;
    if (currentUser) {
      return {
        uid: currentUser.uid,
        email: currentUser.email!,
        displayName: currentUser.displayName || 'User',
        photoURL: currentUser.photoURL,
        level: 'A1',
        xp: 0,
        streak: 0,
        goal: 'general',
        track: 'general',
        joinedDate: new Date(),
        lastActive: new Date(),
      };
    }
    return null;
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await authInstance().sendPasswordResetEmail(email);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<void> {
    try {
      const currentUser = authInstance().currentUser;
      if (!currentUser) throw new Error('No user logged in');
      
      // Update Firebase Auth profile if needed
      if (updates.displayName) {
        await currentUser.updateProfile({ displayName: updates.displayName });
      }
      
      // Update Firestore profile
      const { db } = require('../firebase-config');
      await db().collection('users').doc(currentUser.uid).update(updates);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Create user profile in Firestore
  private async createUserProfile(userProfile: User): Promise<void> {
    try {
      const { db } = require('../firebase-config');
      await db().collection('users').doc(userProfile.uid).set(userProfile);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Get user profile from Firestore
  private async getUserProfile(uid: string): Promise<User | null> {
    try {
      const { db } = require('../firebase-config');
      const doc = await db().collection('users').doc(uid).get();
      
      if (doc.exists) {
        return doc.data() as User;
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Update last active timestamp
  private async updateLastActive(uid: string): Promise<void> {
    try {
      const { db } = require('../firebase-config');
      await db().collection('users').doc(uid).update({
        lastActive: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return authInstance().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await this.getUserProfile(firebaseUser.uid);
        callback(userProfile);
      } else {
        callback(null);
      }
    });
  }
}

export default new AuthService();
