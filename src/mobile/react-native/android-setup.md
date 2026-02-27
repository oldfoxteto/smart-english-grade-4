# 🔧 Android Setup for Firebase

## 📋 **Step 1: Add google-services.json**
```
1. Download google-services.json from Firebase Console
2. Place it in: android/app/google-services.json
3. Make sure the file is in the correct location
```

## 📝 **Step 2: Update android/app/build.gradle**
```gradle
// Add this at the bottom of the file
apply plugin: 'com.google.gms.google-services'
```

## 📝 **Step 3: Update android/build.gradle**
```gradle
// Add this in the dependencies block
classpath 'com.google.gms:google-services:4.3.15'
```

## 📝 **Step 4: Update android/settings.gradle**
```gradle
// Add this in the repositories block if not present
google()
mavenCentral()
```

## 📝 **Step 5: Update android/gradle.properties**
```properties
# Add these lines
android.useAndroidX=true
android.enableJetifier=true
```

## 📝 **Step 6: Update AndroidManifest.xml**
```xml
<!-- Add to android/app/src/main/AndroidManifest.xml -->
<application>
    <!-- Add these permissions if not present -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Add this inside the application tag -->
    <meta-data
        android:name="com.google.firebase.messaging.default_notification_icon"
        android:resource="@mipmap/ic_launcher" />
    <meta-data
        android:name="com.google.firebase.messaging.default_notification_color"
        android:resource="@color/colorAccent" />
</application>
```

## 🚀 **Step 7: Build and Run**
```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew build

# Go back to root and run
cd ..
npm run android
```

## 🔍 **Troubleshooting**
```
If you get "GoogleService failed to initialize":
- Check if google-services.json is in the correct location
- Verify the package name matches Firebase config
- Clean and rebuild the project

If you get "Could not find com.google.gms:google-services":
- Make sure you added the classpath in android/build.gradle
- Check your internet connection
- Try running 'gradlew build --refresh-dependencies'
```

## ✅ **Verification**
```
To verify Firebase is working:
1. Run the app
2. Try to create an account
3. Check Firebase Console > Authentication
4. You should see the new user appear
```
