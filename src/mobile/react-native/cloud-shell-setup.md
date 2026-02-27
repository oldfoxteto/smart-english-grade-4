# 🌐 Firebase Setup via Google Cloud Shell

## 🚀 **Step 1: Open Cloud Shell**
```
1. Go to: https://console.cloud.google.com
2. Sign in with your Google account
3. Click on Cloud Shell icon (>) in the top right
4. Wait for the terminal to open
```

## 📋 **Step 2: Verify Firebase CLI**
```bash
# Check if Firebase CLI is installed
firebase --version

# If not installed, install it
npm install -g firebase-tools

# Login to Firebase
firebase login
```

## 🔥 **Step 3: Create Firebase Project**
```bash
# Create new Firebase project
firebase projects:create ai-english-master

# List projects to verify
firebase projects:list

# Use the project
firebase use ai-english-master
```

## 📱 **Step 4: Initialize Firebase**
```bash
# Create a temporary directory
mkdir ai-english-firebase
cd ai-english-firebase

# Initialize Firebase
firebase init

# Follow the prompts:
# ? Which Firebase CLI features do you want to set up?
# → Firestore Database
# → Functions
# → Hosting
# → Storage

# ? Please select an option:
# → Use an existing project
# → ai-english-master

# ? What file should be used for Firestore rules?
# → firestore.rules

# ? What file should be used for Firestore indexes?
# → firestore.indexes.json

# ? What do you want to use as your public directory?
# → public

# ? Configure as a single-page app?
# → Yes

# ? Set up automatic builds and deploys with GitHub?
# → No
```

## 🔧 **Step 5: Configure Firestore Rules**
```bash
# Create firestore.rules file
cat > firestore.rules << 'EOF'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only read/write their own progress
    match /progress/{userId}/{documentId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read lessons (public content)
    match /lessons/{documentId} {
      allow read: if true;
      allow write: if false; // Only admin can write lessons
    }
    
    // Anyone can read achievements (public content)
    match /achievements/{documentId} {
      allow read: if true;
      allow write: if false; // Only admin can write achievements
    }
    
    // Users can only read/write their own overall progress
    match /userProgress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
EOF
```

## 📁 **Step 6: Configure Storage Rules**
```bash
# Create storage.rules file
cat > storage.rules << 'EOF'
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can only read/write their own avatars
    match /avatars/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read lesson content (public)
    match /lessons/{allPaths=**} {
      allow read: if true;
      allow write: if false; // Only admin can write
    }
    
    // Users can only read/write their own speech recordings
    match /speech/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only read/write their own files
    match /user-files/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
EOF
```

## 📊 **Step 7: Create Sample Data Script**
```bash
# Create data setup script
cat > setup-data.js << 'EOF'
const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'ai-english-master'
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
    content: "Learn essential airport vocabulary for check-in, security, boarding, and luggage handling.",
    isLocked: false,
    prerequisites: []
  },
  {
    title: "Hotel Check-in",
    type: "conversation",
    level: "A1",
    duration: 20,
    xp: 75,
    track: "travel",
    difficulty: "beginner",
    content: "Practice checking into hotels with real-world dialogues and phrases.",
    isLocked: false,
    prerequisites: []
  },
  {
    title: "Ordering Food",
    type: "conversation",
    level: "A1",
    duration: 15,
    xp: 60,
    track: "travel",
    difficulty: "beginner",
    content: "Learn how to order food in restaurants with common phrases and vocabulary.",
    isLocked: false,
    prerequisites: []
  },
  {
    title: "Business Meeting",
    type: "conversation",
    level: "B1",
    duration: 25,
    xp: 100,
    track: "business",
    difficulty: "intermediate",
    content: "Professional business meeting vocabulary and phrases for presentations and discussions.",
    isLocked: true,
    prerequisites: ["ordering-food"]
  }
];

// Sample achievements
const achievements = [
  {
    name: "First Lesson",
    description: "Complete your first lesson",
    xp: 50,
    reward: "Unlock next level",
    icon: "🎓",
    category: "milestone",
    isUnlocked: false
  },
  {
    name: "Week Streak",
    description: "Study for 7 consecutive days",
    xp: 100,
    reward: "Special badge",
    icon: "🔥",
    category: "streak",
    isUnlocked: false
  },
  {
    name: "XP Master",
    description: "Earn 1000 XP",
    xp: 100,
    reward: "Premium features",
    icon: "💎",
    category: "points",
    isUnlocked: false
  }
];

// Add lessons
async function addLessons() {
  console.log('Adding lessons...');
  for (const lesson of lessons) {
    await db.collection('lessons').add(lesson);
    console.log('✅ Added lesson:', lesson.title);
  }
}

// Add achievements
async function addAchievements() {
  console.log('Adding achievements...');
  for (const achievement of achievements) {
    await db.collection('achievements').add(achievement);
    console.log('✅ Added achievement:', achievement.name);
  }
}

// Run setup
async function setup() {
  try {
    await addLessons();
    await addAchievements();
    console.log('🎉 Firebase data setup complete!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

setup();
EOF
```

## 🔑 **Step 8: Generate Service Account Key**
```bash
# Create service account
gcloud iam service-accounts create firebase-admin --display-name="Firebase Admin"

# Grant necessary permissions
gcloud projects add-iam-policy-binding ai-english-master \
  --member="serviceAccount:firebase-admin@ai-english-master.iam.gserviceaccount.com" \
  --role="roles/editor"

# Generate and download key
gcloud iam service-accounts keys create ~/service-account-key.json \
  --iam-account=firebase-admin@ai-english-master.iam.gserviceaccount.com

# Copy key to current directory
cp ~/service-account-key.json .
```

## 📦 **Step 9: Install Dependencies and Run Setup**
```bash
# Install Firebase Admin SDK
npm init -y
npm install firebase-admin

# Run data setup
node setup-data.js
```

## 🚀 **Step 10: Deploy Rules**
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage
```

## 📱 **Step 11: Get Firebase Config**
```bash
# Get Firebase config
cat > firebase-config.json << 'EOF'
{
  "apiKey": "$(gcloud auth print-access-token)",
  "authDomain": "ai-english-master.firebaseapp.com",
  "projectId": "ai-english-master",
  "storageBucket": "ai-english-master.appspot.com",
  "messagingSenderId": "123456789012",
  "appId": "1:123456789012:web:abcdef123456789012345678"
}
EOF

echo "📋 Your Firebase config is ready in firebase-config.json"
echo "🔥 Firebase project setup complete!"
```

## ✅ **Step 12: Verification**
```bash
# List all collections
firebase firestore:lists

# Test database
firebase firestore:read --collection=lessons --limit=5

# Check deployment status
firebase deploy --list
```

## 📋 **Summary of Commands**
```bash
# Complete setup in one go:
firebase login
firebase projects:create ai-english-master
firebase use ai-english-master
mkdir ai-english-firebase && cd ai-english-firebase
firebase init
# (follow prompts)
# Copy the rules files and data script from above
gcloud iam service-accounts create firebase-admin --display-name="Firebase Admin"
gcloud projects add-iam-policy-binding ai-english-master --member="serviceAccount:firebase-admin@ai-english-master.iam.gserviceaccount.com" --role="roles/editor"
gcloud iam service-accounts keys create service-account-key.json --iam-account=firebase-admin@ai-english-master.iam.gserviceaccount.com"
npm init -y && npm install firebase-admin
node setup-data.js
firebase deploy --only firestore:rules
firebase deploy --only storage
```

## 🎉 **Result**
After completing these steps:
- ✅ Firebase project created
- ✅ Firestore database set up with rules
- ✅ Storage configured with rules
- ✅ Sample data added
- ✅ Service account created
- ✅ All configurations deployed

**Your Firebase backend is ready!** 🚀
