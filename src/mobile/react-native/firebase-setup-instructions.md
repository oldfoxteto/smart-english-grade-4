# 🔥 Firebase Setup Instructions

## 📋 **Required Firebase Packages**

```bash
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/storage @react-native-firebase/analytics
```

## 🔧 **Firebase Configuration**

### 1. **Create Firebase Project**
```
1. Go to: https://console.firebase.google.com
2. Create new project: "AI English Master"
3. Enable Authentication, Firestore, Storage
4. Download google-services.json (Android)
5. Download GoogleService-Info.plist (iOS)
```

### 2. **Android Setup**
```bash
# Place google-services.json in android/app/
# Add to android/app/build.gradle:
apply plugin: 'com.google.gms.google-services'

# Add to android/build.gradle:
classpath 'com.google.gms:google-services:4.3.15'
```

### 3. **iOS Setup**
```bash
# Place GoogleService-Info.plist in ios/AIEnglishMaster/
# Add to ios/Podfile:
pod 'Firebase', :modular_headers => true
pod 'FirebaseCoreInternal', :modular_headers => true
pod 'GoogleUtilities', :modular_headers => true
```

## 🔐 **Authentication Setup**

### Enable Auth Methods:
```
1. Firebase Console → Authentication → Sign-in method
2. Enable Email/Password
3. Enable Google Sign-in
4. Configure OAuth credentials
```

## 📊 **Firestore Setup**

### Create Collections:
```
- users (user profiles)
- lessons (lesson content)
- progress (user progress)
- achievements (achievement data)
- userProgress (overall progress)
```

### Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /progress/{userId}/{documentId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /lessons/{documentId} {
      allow read: if true;
    }
    match /achievements/{documentId} {
      allow read: if true;
    }
  }
}
```

## 📁 **Storage Setup**

### Security Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /lessons/{allPaths=**} {
      allow read: if true;
    }
    match /speech/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚀 **Usage Examples**

### Authentication:
```typescript
import { AuthService } from '../services';

// Sign up
const user = await AuthService.signUp(email, password, displayName);

// Sign in
const user = await AuthService.signIn(email, password);

// Sign out
await AuthService.signOut();
```

### Firestore:
```typescript
import { FirestoreService } from '../services';

// Get lessons
const lessons = await FirestoreService.getLessons('travel', 'A1');

// Add progress
await FirestoreService.addLessonProgress({
  userId: 'user123',
  lessonId: 'lesson123',
  completed: true,
  score: 85,
  xp: 50,
  timeSpent: 900
});
```

### Storage:
```typescript
import { StorageService } from '../services';

// Upload avatar
const avatarUrl = await StorageService.uploadAvatar(userId, imageUri);

// Upload speech
const speechUrl = await StorageService.uploadSpeechRecording(userId, lessonId, audioUri);
```

## 🔧 **Environment Variables**

Create `.env` file:
```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## 📱 **Testing**

```bash
# Run tests
npm test

# Test on device
npm run android
npm run ios
```

## 🐛 **Common Issues**

### 1. **Firebase not initialized**
```
Solution: Check firebase-config.ts and ensure all services are properly initialized
```

### 2. **Auth errors**
```
Solution: Verify Firebase Console auth settings and API keys
```

### 3. **Firestore permissions**
```
Solution: Update security rules in Firebase Console
```

### 4. **Storage upload failures**
```
Solution: Check storage rules and file paths
```

---

**🎉 Firebase setup complete! Your app is now ready for authentication and data storage.**
