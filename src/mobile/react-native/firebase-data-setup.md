# 📊 Firebase Data Setup

## 📚 **Step 1: Create Sample Lessons**

### 🗄️ **Method 1: Using Firebase Console**
```
1. Go to Firebase Console > Firestore Database
2. Click "Start collection"
3. Collection name: "lessons"
4. Add these documents:
```

### 📝 **Sample Lesson Documents:**

#### **Document 1: At the Airport**
```json
{
  "title": "At the Airport",
  "type": "vocabulary",
  "level": "A1",
  "duration": 15,
  "xp": 50,
  "track": "travel",
  "difficulty": "beginner",
  "content": "Learn essential airport vocabulary for check-in, security, boarding, and luggage handling.",
  "isLocked": false,
  "prerequisites": []
}
```

#### **Document 2: Hotel Check-in**
```json
{
  "title": "Hotel Check-in",
  "type": "conversation",
  "level": "A1",
  "duration": 20,
  "xp": 75,
  "track": "travel",
  "difficulty": "beginner",
  "content": "Practice checking into hotels with real-world dialogues and phrases.",
  "isLocked": false,
  "prerequisites": []
}
```

#### **Document 3: Ordering Food**
```json
{
  "title": "Ordering Food",
  "type": "conversation",
  "level": "A1",
  "duration": 15,
  "xp": 60,
  "track": "travel",
  "difficulty": "beginner",
  "content": "Learn how to order food in restaurants with common phrases and vocabulary.",
  "isLocked": false,
  "prerequisites": []
}
```

#### **Document 4: Business Meeting**
```json
{
  "title": "Business Meeting",
  "type": "conversation",
  "level": "B1",
  "duration": 25,
  "xp": 100,
  "track": "business",
  "difficulty": "intermediate",
  "content": "Professional business meeting vocabulary and phrases for presentations and discussions.",
  "isLocked": true,
  "prerequisites": ["ordering-food"]
}
```

## 🏆 **Step 2: Create Achievements**

### 📝 **Achievement Documents:**
```
Collection name: "achievements"
```

#### **First Lesson**
```json
{
  "name": "First Lesson",
  "description": "Complete your first lesson",
  "xp": 50,
  "reward": "Unlock next level",
  "icon": "🎓",
  "category": "milestone",
  "isUnlocked": false
}
```

#### **Week Streak**
```json
{
  "name": "Week Streak",
  "description": "Study for 7 consecutive days",
  "xp": 100,
  "reward": "Special badge",
  "icon": "🔥",
  "category": "streak",
  "isUnlocked": false
}
```

#### **XP Master**
```json
{
  "name": "XP Master",
  "description": "Earn 1000 XP",
  "xp": 100,
  "reward": "Premium features",
  "icon": "💎",
  "category": "points",
  "isUnlocked": false
}
```

## 🎯 **Step 3: Create Sample User Progress**

### 📝 **User Progress Document:**
```
Collection name: "userProgress"
Document ID: "demo-user"
```

```json
{
  "userId": "demo-user",
  "currentLevel": "A1",
  "totalXP": 0,
  "streak": 0,
  "lessonsCompleted": 0,
  "averageScore": 0,
  "timeSpent": 0,
  "lastStudyDate": "2024-01-01T00:00:00Z",
  "achievements": []
}
```

## 🔧 **Method 2: Using Script**

### 📝 **Create setup script:**
```javascript
// save as firebase-setup.js
const admin = require('firebase-admin');
const serviceAccount = require('./path-to-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Sample lessons
const lessons = [
  {
    title: "At the Airport",
    type: "vocabulary",
    level: "A1",
    duration: 15,
    xp: 50,
    track: "travel",
    difficulty: "beginner",
    content: "Learn essential airport vocabulary...",
    isLocked: false,
    prerequisites: []
  }
  // Add more lessons...
];

// Add lessons
lessons.forEach(async (lesson) => {
  await db.collection('lessons').add(lesson);
  console.log('Added lesson:', lesson.title);
});
```

### 🚀 **Run the script:**
```bash
npm install firebase-admin
node firebase-setup.js
```

## ✅ **Verification**

### 🔍 **Check Data in Console:**
```
1. Go to Firebase Console > Firestore Database
2. Verify collections exist:
   - lessons (4+ documents)
   - achievements (3+ documents)
   - userProgress (1 document)
3. Click on each document to verify structure
```

### 📱 **Test in App:**
```
1. Run the app
2. Go to Lessons screen
3. Verify lessons appear
4. Try to start a lesson
5. Check if data loads correctly
```

## 🔄 **Updating Data**

### 📝 **Add More Lessons:**
```
1. Go to Firestore Database
2. Select "lessons" collection
3. Click "Add document"
4. Fill in the lesson data
5. Click "Save"
```

### 📝 **Update Existing:**
```
1. Click on a lesson document
2. Click "Edit document"
3. Make changes
4. Click "Save"
```

## 🎯 **Next Steps**

1. ✅ Create sample lessons
2. ✅ Create achievements
3. ✅ Set up user progress
4. ✅ Test data loading in app
5. ✅ Verify all features work

**Your Firebase is now ready with sample data!** 🎉
