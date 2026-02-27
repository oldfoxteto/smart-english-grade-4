# 🎯 GLIDE CHEAT SHEET - QUICK REFERENCE

## 🚀 QUICK START GUIDE

### 📱 STEP 1: CREATE APP
```
1. Go: https://www.glideapps.com
2. Click: "Start building for free"
3. Choose: "Start from data"
4. Select: Google Sheets
5. Pick: "Smart English Grade 4 Data"
6. Wait: 1-2 minutes for loading
```

### 🎨 STEP 2: BASIC SETTINGS
```
App Name: AI English Master
Icon: 🤖
Description: Learn English from Zero to Mastery
Colors: Green (#4CAF50) + White
```

### 📊 STEP 3: DATA TABS CHECKLIST
```
✅ users - 3 users with levels and XP
✅ lessons - 10 lessons with different types
✅ tests - 5 tests with questions
✅ achievements - 10 achievements with rewards
✅ progress - 10 progress records
```

---

## 🎮 SCREEN SETUP QUICK GUIDE

### 🏠 WELCOME SCREEN
```
Type: Details
Components:
- Title: "🤖 AI English Master"
- Subtitle: "Learn English from Zero to Mastery"
- Button: "Start Learning" → Navigate to Assessment
- Image: Learning/education image
```

### 📊 ASSESSMENT SCREEN
```
Type: Form
Questions:
1. What's your name? (Text)
2. Current level? (Dropdown: Beginner/Intermediate/Advanced)
3. Learning goal? (Dropdown: Travel/Study/Business/Conversation)
4. Daily time? (Dropdown: 15min/30min/1hour)
5. Why learn English? (Text)
Button: "Get My Level" → Navigate to Dashboard
```

### 📈 DASHBOARD SCREEN
```
Type: List/Details
Data Source: users table
Components:
- User Profile Card: Name, Level, XP, Streak
- Lessons Grid: Filtered by user level
- "Chat with AI" Button
- Progress Charts
```

---

## 🤖 AI SETUP QUICK GUIDE

### 🔑 CHATGPT API
```
1. Go: https://platform.openai.com
2. Settings > API Keys
3. Create new secret key
4. Copy the key
5. In Glide: Settings > Integrations > OpenAI
6. Paste API key
7. Choose model: gpt-3.5-turbo
8. Test connection
```

### 💬 AI PROMPTS
```
System Prompt:
"You are AI English Master, expert English teacher. Be friendly, encouraging, and provide clear explanations."

Level Assessment:
"Ask 5 questions to determine English level: 1) Self-introduction, 2) Grammar knowledge, 3) Vocabulary range, 4) Learning goal, 5) Time availability"

Lesson Help:
"Explain {topic} for {level} level in simple terms. Provide examples and practice exercises."

Grammar Correction:
"Correct this sentence: '{user_sentence}'. Explain the error and provide 3 correct alternatives."
```

---

## 🎮 GAMIFICATION QUICK SETUP

### 📊 XP SYSTEM
```
Level Calculations:
- A1: 0-500 XP
- A2: 501-1500 XP  
- B1: 1501-3000 XP
- B2: 3001-6000 XP
- C1: 6001-10000 XP
- C2: 10000+ XP

XP Rewards:
- Complete lesson: +50 XP
- Perfect test score: +100 XP
- Daily streak: +20 XP
- Level up: +200 XP
```

### 🏆 ACHIEVEMENTS
```
Key Achievements:
- First Lesson: Complete first lesson (50 XP)
- Week Streak: 7 consecutive days (100 XP)
- Level Up: Reach next level (200 XP)
- Perfect Score: 100% on test (150 XP)
- Travel Expert: Complete all travel lessons (300 XP)
```

---

## 🔧 TROUBLESHOOTING QUICK GUIDE

### ❌ COMMON ISSUES
```
API Not Working:
- Check OpenAI key is correct
- Verify you have credits in OpenAI account
- Try gpt-3.5-turbo instead of gpt-4

Data Not Loading:
- Check Google Sheets permissions
- Verify tab names match exactly
- Refresh the data source

App Slow:
- Reduce image sizes
- Limit data per screen
- Use filters effectively

AI Not Responding:
- Check prompt formatting
- Verify API connection
- Reduce max tokens
```

### ✅ QUICK FIXES
```
Data Issues:
- Refresh data source
- Check column names
- Verify data types

Performance:
- Optimize images
- Reduce data loading
- Use lazy loading

UI Issues:
- Check screen sizes
- Test on mobile
- Simplify layout
```

---

## 📱 TESTING CHECKLIST

### 🧪 BEFORE PUBLISHING
```
✅ Test all screens work
✅ Test AI chat functionality
✅ Test data saving
✅ Test on mobile phone
✅ Test with different users
✅ Check all buttons work
✅ Verify progress tracking
✅ Test achievements unlock
```

### 🚀 PUBLISHING
```
1. Click "Publish"
2. Set app URL
3. Choose app icon
4. Write description
5. Click "Publish now"
6. Share the link
7. Collect feedback
8. Make improvements
```

---

## 📞 GETTING HELP

### 🆘 SUPPORT RESOURCES
```
Glide Help: https://help.glideapps.com
OpenAI Status: https://status.openai.com
Community Forums: https://community.glideapps.com
Video Tutorials: Search "Glide tutorials" on YouTube
```

### 💬 ASKING FOR HELP
```
When asking for help, provide:
1. What you're trying to do
2. What you've tried
3. What's not working
4. Screenshots if possible
5. Error messages
```

---

## 🎯 SUCCESS METRICS

### 📊 TRACK THESE
```
- Number of active users
- Lesson completion rate
- Average session duration
- AI chat usage
- Achievement unlock rate
- User retention rate
- Feedback scores
```

### 🚀 IMPROVEMENT AREAS
```
- Lesson content quality
- AI response accuracy
- User interface simplicity
- Loading speed
- Mobile experience
- Onboarding flow
```

---

**🎉 Keep this guide handy while building your app!**
