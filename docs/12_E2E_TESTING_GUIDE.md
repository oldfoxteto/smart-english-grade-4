# 🧪 اختبار End-to-End - AI Tutor مع OpenAI
**التاريخ:** 22 فبراير، 2026

---

## 📋 قائمة المتطلبات

- [ ] Node.js 18+ مثبت
- [ ] PostgreSQL أو SQLite قيد التشغيل
- [ ] OpenAI API Key (من https://platform.openai.com/account/api-keys)
- [ ] npm أو yarn
- [ ] Postman أو curl (اختياري)

---

## 🚀 خطوات الاختبار

### الخطوة 1: إعداد البيئة

```bash
# 1. نسخ ملف البيئة
cd backend
cp .env.example .env

# 2. إضافة OpenAI API Key
# افتح .env وأضف:
# OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx

# 3. تثبيت المكتبات
npm install

# 4. إنشاء الـ migrations إذا لم تكن موجودة
npm run migrate  # (إذا كانت موجودة)
```

### الخطوة 2: تشغيل Backend

```bash
# في terminal منفصل:
cd backend
npm start

# ستشوف:
# [Server] listening on http://localhost:4000
# [Database] Connected successfully
# [AI] OpenAI configured: gpt-4-mini
```

### الخطوة 3: تشغيل Frontend

```bash
# في terminal آخر:
cd ..
npm run dev

# ستشوف:
# ➜  Local:   http://localhost:5173/
```

### الخطوة 4: التسجيل الأول

**في المتصفح:**
1. اذهب إلى http://localhost:5173
2. اضغط على "Sign Up"
3. أدخل البيانات:
   - Email: `test@example.com`
   - Password: `Test123!Pass`
   - First Name: Test
   - Last Name User
4. اضغط Sign Up

### الخطوة 5: The Onboarding Flow

1. اختر اللغة: English ✅
2. اختر الهدف: I want to learn for travel
3. اختر المستوى: Absolute Beginner
4. أكمل الـ Onboarding

### الخطوة 6: اختبار AI Tutor

1. من الصفحة الرئيسية، اضغط على "المدرب الذكي"
2. اكتب جملة بسيطة:
   ```
   "I am a student"
   ```
3. اضغط Send
4. **النتيجة المتوقعة:**
   - AI يجب أن يرد بتصحيح عربي
   - تشرح الأخطاء
   - يقدم شرح بالإنجليزية
   - يعطي مهمة تالية

---

## ✅ اختبارات Functional

### Test 1: Simple Message

**Input:**
```
I am student
```

**Expected Output:**
```json
{
  "correctionAr": "الخطأ: I am student\nالسبب: المادة \"a\" مفقودة",
  "tutorReply": "Feedback: ...\nNatural Alternative: I am a student",
  "nextStep": "Try another sentence"
}
```

### Test 2: Complex Scenario

**Input:**
```
Where I go yesterday?
```

**Expected Output:**
```json
{
  "correctionAr": "الخطأ: Where I go yesterday....",
  "tutorReply": "Feedback: ...\nNatural Alternative: Where did I go yesterday?",
  "nextStep": "Practice past tense questions"
}
```

### Test 3: Correct Sentence

**Input:**
```
Hello, how are you?
```

**Expected Output:**
```json
{
  "correctionAr": "صحيح! جملة بسيطة وسليمة...",
  "tutorReply": "Feedback: Perfect!\nNatural Alternative: (same as input)",
  "nextStep": "Try a more complex sentence"
}
```

---

## 🧬 اختبارات API (cURL)

### 1. في Terminal، احصل على JWT Token

```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!Pass"
  }'

# Copy the accessToken من الـ Response
# مثال: eyJhbGc....
```

### 2. Test AI Tutor API

```bash
# استبدل YOUR_TOKEN بـ token الفعلي
curl -X POST http://localhost:4000/api/ai/tutor/reply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "message": "I go to school",
    "scenario": "daily_routine",
    "proficiency": "A1"
  }' | jq .
```

---

## 📊 اختبارات Performance

### Test Load Time

```bash
# Frontend
curl -X GET http://localhost:5173 -w "Time: %{time_total}s\n"

# Backend
curl -X GET http://localhost:4000/health -w "Time: %{time_total}s\n"
```

### Expected Times:
- Frontend home: < 2s
- Backend health: < 100ms
- AI response: < 10s (OpenAI typical)

---

## 🔐 Security Tests

### Test 1: Invalid Auth

```bash
curl -X POST http://localhost:4000/api/ai/tutor/reply \
  -H "Content-Type: application/json" \
  -d '{
    "message": "test",
    "scenario": "test",
    "proficiency": "A1"
  }'

# Expected: 401 Unauthorized
```

### Test 2: Malicious Input

```bash
curl -X POST http://localhost:4000/api/ai/tutor/reply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "message": "<script>alert(1)</script>",
    "scenario": "test",
    "proficiency": "A1"
  }'

# Expected: صحيح تصحيح (sanitized)
```

### Test 3: Rate Limiting

```bash
# ارسل 50+ طلب بسرعة
for i in {1..60}; do
  curl -X POST http://localhost:4000/api/ai/tutor/reply \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -d '{"message":"test","scenario":"test","proficiency":"A1"}' &
done

# بعد 100 طلب/دقيقة: Expected 429 Too Many Requests
```

---

## 🐛 Debugging

### اختبر OpenAI Connection

```bash
# في backend directory
cat > test-openai.js << 'EOF'
import { config } from "./src/config.js";
import { generateTutorReply } from "./src/services/aiTutorService.js";

console.log("API Key configured:", !!config.openaiApiKey);
console.log("Model:", config.openaiModel);

try {
  const result = await generateTutorReply({
    message: "I am student",
    scenario: "introduction",
    proficiency: "A1"
  });
  console.log("✅ Success:", result);
} catch (e) {
  console.error("❌ Error:", e.message);
}
EOF

node test-openai.js
```

### مشاكل شائعة:

| المشكلة | الحل |
|--------|------|
| `OPENAI_API_KEY is not configured` | تحقق من .env يحتوي على `OPENAI_API_KEY=sk-proj-...` |
| `Invalid API key` | تأكد من الـ key من https://platform.openai.com |
| `Rate limit exceeded` | قلل `RATE_LIMIT_AI_MAX` في .env |
| `Timeout` | زد `AI_TIMEOUT_MS=30000` في .env |
| `Connection refused` | تأكد من تشغيل Backend على port 4000 |

---

## 📈 عند النجاح

اطبع الملخص:

```bash
echo "✅ Backend working: http://localhost:4000"
echo "✅ Frontend working: http://localhost:5173"
echo "✅ Database connected"
echo "✅ OpenAI AI Tutor configured"
echo "✅ Users can chat with AI"
echo ""
echo "🎉 Ready to add more features!"
```

---

## 🎯 الخطوة التالية

بعد التأكد من عمل AI Tutor:
1. ✅ أضف المحتوى التعليمي (Unit 1)
2. ✅ اختبر مع أكثر من user
3. ✅ اختبر مع لغة مختلفة (عربي)
4. ✅ اختبر Performance تحت حمل

---

**حالة الاختبار:** 🟢 **جاهز للبدء**
