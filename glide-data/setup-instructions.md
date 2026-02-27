# 🚀 GLIDE SETUP INSTRUCTIONS

## 📋 STEP 1: CREATE GOOGLE SHEETS

### 1.1 Open Google Sheets
- Go to: https://sheets.google.com
- Click "Blank" to create new spreadsheet
- Name it: "Smart English Grade 4 Data"

### 1.2 Create Tabs
Create these tabs in your spreadsheet:
1. `users` - Paste content from users.csv
2. `lessons` - Paste content from lessons.csv  
3. `tests` - Paste content from tests.csv
4. `achievements` - Paste content from achievements.csv
5. `progress` - Paste content from progress.csv

### 1.3 Import Data
For each tab:
- Click File > Import
- Upload the corresponding CSV file
- Choose "Replace spreadsheet"
- Click "Import data"

---

## 📱 STEP 2: CREATE GLIDE APP

### 2.1 Start New App
1. Go to: https://www.glideapps.com
2. Click "Start building for free"
3. Choose "Start from data"
4. Select Google Sheets
5. Choose your "Smart English Grade 4 Data" spreadsheet
6. Wait for data to load (1-2 minutes)

### 2.2 Basic Setup
1. App Name: "AI English Master"
2. App Icon: 🤖 or 📚
3. App Description: "Learn English from Zero to Mastery with AI"
4. Theme: Green and White colors

---

## 🤖 STEP 3: SETUP CHATGPT INTEGRATION

### 3.1 Get OpenAI API Key
1. Go to: https://platform.openai.com
2. Sign up/login
3. Go to Settings > API Keys
4. Click "Create new secret key"
5. Copy the key (save it securely!)

### 3.2 Connect to Glide
1. In Glide: Click "Settings" (gear icon)
2. Click "Integrations"
3. Find "OpenAI" or "Custom API"
4. Paste your API key
5. Choose model: "gpt-3.5-turbo" (cheaper) or "gpt-4" (better)
6. Test connection

---

## 🎨 STEP 4: DESIGN MAIN SCREENS

### 4.1 Welcome Screen
1. Click "Add Screen" > "Details"
2. Name: "Welcome"
3. Add components:
   - Title: "🤖 AI English Master"
   - Subtitle: "Learn English from Zero to Mastery"
   - Button: "Start Learning" → Navigate to "Assessment"
   - Image: Add learning/education image

### 4.2 Assessment Screen
1. Add Screen > "Form"
2. Name: "Level Assessment"
3. Add 5 questions:
   - Q1: What's your name?
   - Q2: Current English level?
   - Q3: Learning goal?
   - Q4: Daily time commitment?
   - Q5: Preferred track?
4. Button: "Get My Level" → Calculate level → Navigate to "Dashboard"

### 4.3 Dashboard Screen
1. Add Screen > "List/Details"
2. Name: "Dashboard"
3. Add user profile card:
   - Name: `[Name]` from users table
   - Level: `[Level]` 
   - XP: `[XP]`
   - Streak: `[Streak]`
4. Add lessons grid
5. Add "Chat with AI" button

---

## 📚 STEP 5: SETUP LESSONS

### 5.1 Lessons List
1. Add Screen > "List"
2. Data Source: `lessons` table
3. Filter by user's level and track
4. Display: Title, Type, Duration, XP
5. On tap: Navigate to "Lesson Details"

### 5.2 Lesson Details
1. Add Screen > "Details"
2. Show: Title, Content, Type, Duration
3. Add "Start Lesson" button
4. Add "Mark Complete" button
5. When complete: Add XP to user, Update progress

---

## 🤖 STEP 6: SETUP AI CHAT

### 6.1 Create AI Chat Screen
1. Add Screen > "Chat"
2. Add "AI Assistant" component
3. Configure with prompts from `ai-prompts.txt`
4. Add message input field
5. Add send button

### 6.2 AI Prompts Setup
Use these prompts in your AI component:
```
System Prompt: "You are AI English Master, an expert English teacher. Your name is AI English Master. You teach English from beginner to advanced levels. Be friendly, encouraging, and provide clear explanations."

Level Assessment: "Ask 5 questions to determine English level: 1) Self-introduction, 2) Grammar knowledge, 3) Vocabulary range, 4) Learning goal, 5) Time availability"

Lesson Help: "Explain {topic} for {level} level in simple terms. Provide examples and practice exercises."
```

---

## 🎮 STEP 7: SETUP GAMIFICATION

### 7.1 XP System
1. In users table, ensure XP column exists
2. Create formula: XP = Previous XP + Lesson XP
3. Update when lesson completed

### 7.2 Level System
1. Create level calculation:
   - A1: 0-500 XP
   - A2: 501-1500 XP  
   - B1: 1501-3000 XP
   - B2: 3001-6000 XP
   - C1: 6001-10000 XP
   - C2: 10000+ XP

### 7.3 Achievements
1. Create achievements screen
2. Data source: `achievements` table
3. Check conditions and unlock badges

---

## 📊 STEP 8: PROGRESS TRACKING

### 8.1 Progress Table
1. Track lesson completion
2. Track test scores
3. Track study time
4. Generate progress reports

### 8.2 Analytics
1. Add progress charts
2. Show learning streaks
3. Display skill breakdown
4. Achievement progress

---

## 🚀 STEP 9: PUBLISH APP

### 9.1 Test Thoroughly
1. Test all screens
2. Test AI chat
3. Test data saving
4. Test on mobile phone

### 9.2 Publish
1. Click "Publish" in Glide
2. Choose app URL
3. Set app icon
4. Add description
5. Click "Publish now"
6. Share the link!

---

## 💡 TROUBLESHOOTING

### Common Issues:
- **API not working**: Check OpenAI key and credits
- **Data not loading**: Check Google Sheets permissions
- **App slow**: Reduce images and optimize data
- **AI not responding**: Check prompt formatting

### Support:
- Glide Help: https://help.glideapps.com
- OpenAI Status: https://status.openai.com

---

## 🎯 NEXT STEPS

After publishing:
1. Share with friends for testing
2. Collect feedback
3. Improve based on usage
4. Consider premium features
5. Plan marketing strategy

---

**🎉 Your AI English Master app is ready to launch!**
