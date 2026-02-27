# 🔧 iOS Setup for Firebase

## 📋 **Step 1: Add GoogleService-Info.plist**
```
1. Download GoogleService-Info.plist from Firebase Console
2. Open Xcode: ios/AIEnglishMaster.xcworkspace
3. Drag the file to the root of your project (next to Info.plist)
4. Make sure "Copy items if needed" is checked
5. Select your target in "Add to targets"
```

## 📝 **Step 2: Update Podfile**
```ruby
# Add these pods to your ios/Podfile
pod 'Firebase', :modular_headers => true
pod 'FirebaseCoreInternal', :modular_headers => true
pod 'GoogleUtilities', :modular_headers => true
pod 'FirebaseAuth', :modular_headers => true
pod 'FirebaseFirestore', :modular_headers => true
pod 'FirebaseStorage', :modular_headers => true
pod 'FirebaseAnalytics', :modular_headers => true

# Add this at the top of the Podfile
$RNFirebaseAsStaticFramework = true

# Add this at the bottom
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '12.0'
    end
  end
end
```

## 📝 **Step 3: Install Pods**
```bash
cd ios
pod install --repo-update
cd ..
```

## 📝 **Step 4: Update AppDelegate.m**
```objectivec
// Add to ios/AIEnglishMaster/AppDelegate.m

#import <Firebase.h>

// At the top of the file, after other imports

// In didFinishLaunchingWithOptions method, add:
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Add this line
  [FIRApp configure];
  
  // Rest of your existing code
  return YES;
}
```

## 📝 **Step 5: Update Info.plist**
```xml
<!-- Add to ios/AIEnglishMaster/Info.plist -->
<key>CFBundleDisplayName</key>
<string>AI English Master</string>

<!-- Add these keys if not present -->
<key>UIBackgroundModes</key>
<array>
    <string>background-fetch</string>
    <string>remote-notification</string>
</array>
```

## 📝 **Step 6: Enable Capabilities in Xcode**
```
1. Open Xcode: ios/AIEnglishMaster.xcworkspace
2. Select your project in the navigator
3. Select your target
4. Go to "Signing & Capabilities" tab
5. Click "+ Capability"
6. Add "Background Modes"
7. Check "Background fetch" and "Remote notifications"
```

## 🚀 **Step 7: Build and Run**
```bash
# Clean and rebuild
cd ios
xcodebuild clean
cd ..

# Run the app
npm run ios
```

## 🔍 **Troubleshooting**
```
If you get "Firebase failed to initialize":
- Check if GoogleService-Info.plist is in the project
- Verify the Bundle ID matches Firebase config
- Clean and rebuild the project

If you get "pod install fails":
- Try 'pod install --repo-update'
- Clear CocoaPods cache: pod cache clean --all
- Delete Pods directory and Podfile.lock, try again

If you get "build fails":
- Check Xcode for build errors
- Make sure all pods are properly linked
- Try building from Xcode directly
```

## ✅ **Verification**
```
To verify Firebase is working:
1. Run the app in simulator
2. Try to create an account
3. Check Firebase Console > Authentication
4. You should see the new user appear
```

## 📱 **Testing on Real Device**
```
1. Connect your iPhone to Mac
2. Trust the developer certificate on your device
3. Select your device in Xcode
4. Build and run
5. Test Firebase features
```
