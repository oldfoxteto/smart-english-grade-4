# 🚀 Build Instructions for AI English Master App

## 📋 **Prerequisites**

### Required Software:
```bash
- Node.js (v16 or higher)
- npm or yarn
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS)
- Git
```

### Environment Setup:
```bash
# Install React Native CLI
npm install -g @react-native-cli

# Install Android dependencies
# Follow React Native docs for Android setup

# Install iOS dependencies
# Install Xcode from App Store
# Install Xcode Command Line Tools
```

---

## 🔧 **Installation Steps**

### 1. **Clone and Install Dependencies**
```bash
# Navigate to project directory
cd d:\sara\smart-english-grade-4\src\mobile\react-native

# Install dependencies
npm install

# For iOS
cd ios && pod install && cd ..
```

### 2. **Firebase Setup**
```bash
# Follow firebase-setup-instructions.md
# Create Firebase project
# Download configuration files
# Place in appropriate directories
```

### 3. **Environment Configuration**
```bash
# Create .env file
cp .env.example .env

# Add your Firebase configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

---

## 🏃‍♂️ **Running the App**

### **Android:**
```bash
# Start Metro bundler
npm start

# Run on Android device/emulator
npm run android

# Or build APK
npm run build:android
```

### **iOS:**
```bash
# Start Metro bundler
npm start

# Run on iOS simulator/device
npm run ios

# Or build IPA
npm run build:ios
```

---

## 🐛 **Common Issues & Solutions**

### **Metro Bundler Issues:**
```bash
# Clear Metro cache
npx react-native start --reset-cache

# Clear node modules
rm -rf node_modules && npm install
```

### **Android Build Issues:**
```bash
# Clean Android build
cd android && ./gradlew clean && ./gradlew build

# Check Android configuration
npx react-native doctor
```

### **iOS Build Issues:**
```bash
# Clean iOS build
cd ios && xcodebuild clean

# Reinstall pods
rm -rf Pods && pod install
```

### **Firebase Issues:**
```bash
# Check Firebase configuration
# Verify google-services.json (Android)
# Verify GoogleService-Info.plist (iOS)
# Check Firebase console settings
```

---

## 📱 **Development Workflow**

### **1. Start Development:**
```bash
# Terminal 1: Start Metro
npm start

# Terminal 2: Run app
npm run android  # or npm run ios
```

### **2. Hot Reloading:**
```bash
# Android: Press 'r' in Metro terminal
# iOS: Press 'r' in Metro terminal
# Or shake device and press 'Reload'
```

### **3. Debugging:**
```bash
# Open Chrome DevTools
# Go to http://localhost:8081/debugger-ui/
# Enable remote debugging
```

---

## 🔍 **Testing**

### **Run Tests:**
```bash
# Run all tests
npm test

# Run specific test
npm test -- --testNamePattern="WelcomeScreen"

# Watch mode
npm test -- --watch
```

### **Linting:**
```bash
# Check code style
npm run lint

# Fix linting issues
npm run lint -- --fix
```

---

## 📦 **Build for Production**

### **Android:**
```bash
# Generate release APK
cd android && ./gradlew assembleRelease

# Find APK at:
# android/app/build/outputs/apk/release/app-release.apk
```

### **iOS:**
```bash
# Build for iOS
cd ios && xcodebuild -workspace SmartEnglishGrade4.xcworkspace -scheme SmartEnglishGrade4 -configuration Release -destination generic/platform=iOS archive

# Export IPA from Xcode
```

---

## 🚀 **Deployment**

### **Google Play Store:**
```bash
# Generate signed APK
# Follow Google Play Console instructions
# Upload APK/AAB
# Fill store listing
# Submit for review
```

### **Apple App Store:**
```bash
# Build IPA with provisioning profile
# Use Xcode to archive
# Upload to App Store Connect
# Fill app information
# Submit for review
```

---

## 📊 **Performance Optimization**

### **Bundle Size:**
```bash
# Analyze bundle size
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android-bundle.js

# Optimize images
# Use WebP format
# Compress assets
```

### **Performance:**
```bash
# Enable Hermes (Android)
# Use Flipper for debugging
# Monitor performance with React Native Debugger
```

---

## 🔧 **Troubleshooting**

### **Common Errors:**
```bash
# "Unable to resolve module"
→ Check package.json dependencies
→ Run npm install

# "Metro bundler not running"
→ Start Metro with npm start
→ Check port 8081 availability

# "Build failed"
→ Clean build directory
→ Check configuration files
→ Verify environment setup
```

### **Get Help:**
```bash
# React Native docs: https://reactnative.dev
# Firebase docs: https://firebase.google.com/docs
# GitHub issues: Check repository issues
# Stack Overflow: Search for specific errors
```

---

## 🎯 **Next Steps**

1. **Set up Firebase project**
2. **Install dependencies**
3. **Configure environment**
4. **Run on device/emulator**
5. **Test all features**
6. **Build for production**
7. **Deploy to stores**

---

**🎉 Your AI English Master app is ready to build and run!**

**For detailed Firebase setup, see `firebase-setup-instructions.md`**
