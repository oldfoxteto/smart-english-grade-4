# 🔥 Firebase Studio Import Setup

## 🌐 Step 1: Open Firebase Studio
1. Go to: https://studio.firebase.google.com/import
2. Click on "Import project"

## 📱 Step 2: Import from GitHub
1. Choose "Import from GitHub"
2. Select your repository: ai-english-master
3. Connect your GitHub account if prompted
4. Select the main branch
5. Click "Import"

## 🔧 Step 3: Configure Firebase Hosting
1. Firebase will detect it's a React Native app
2. Select "Web app" for hosting
3. Configure build settings:
   - Build command: npm run build-web
   - Output directory: dist
   - Node version: 16

## 📦 Step 4: Add Firebase Functions (Optional)
1. Click "Add Functions"
2. Select Node.js runtime
3. Configure environment variables if needed

## 🚀 Step 5: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be available at: https://ai-english-master.web.app

## 📋 Step 6: Connect to Existing Firebase Project
1. In Firebase Studio, go to Project Settings
2. Under "Your apps", add your existing Firebase project
3. Use project ID: ai-english-master
4. This will connect your existing Firestore, Auth, and Storage

## ✅ Verification
1. Check that your app is deployed
2. Test Firebase features
3. Verify all services are connected

## 🔄 Continuous Deployment
Firebase Studio will automatically deploy when you push to GitHub:
1. Make changes to your code
2. git add . && git commit -m "Update"
3. git push
4. Firebase Studio will auto-deploy
