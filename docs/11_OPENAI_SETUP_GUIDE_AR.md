# OpenAI Integration Guide - دليل ربط OpenAI
**التاريخ:** 22 فبراير، 2026

---

## 🚀 الخطوات السريعة

### 1. الحصول على OpenAI API Key

**أ. إنشاء حساب OpenAI:**
- اذهب إلى https://platform.openai.com/
- اشترك بحساب جديد أو دخول
- تأكد من إضافة بطاقة دفع

**ب. الحصول على API Key:**
1. اذهب إلى https://platform.openai.com/account/api-keys
2. اضغط على "Create new secret key"
3. انسخ الـ key (سيظهر مرة واحدة فقط!)
4. احفظه في مكان آمن

### 2. إعداد Environment Variables

**في `backend/.env`:**
```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4-mini
OPENAI_API_BASE=https://api.openai.com/v1

# لا تستخدم Google AI Studio (اترك هذا فارغاً إذا كان موجوداً)
# GOOGLE_AI_STUDIO_API_KEY=
```

**في `backend/.env.development`:**
```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4-mini
LOG_LEVEL=debug
```

### 3. تشغيل Backend

```bash
cd backend
npm install  # إذا لم تثبت بعد
npm start    # أو npm run dev
```

---

## ✅ اختبار الـ API

### طريقة 1: استخدام cURL

```bash
curl -X POST http://localhost:4000/api/ai/tutor/reply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "Hello, how are you?",
    "scenario": "casual_greeting",
    "proficiency": "A1"
  }'
```

### طريقة 2: استخدام Python

```python
import requests

TOKEN = "your_jwt_token_here"  # احصل عليه من تسجيل الدخول

response = requests.post(
    "http://localhost:4000/api/ai/tutor/reply",
    headers={
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json"
    },
    json={
        "message": "I go to school every day",
        "scenario": "daily_routine",
        "proficiency": "A1"
    }
)

print(response.json())
```

### طريقة 3: من الـ Frontend

الـ Frontend يستخدم الـ API تلقائياً عند فتح صفحة AITutorPage

---

## 📊 المعايرة والتكاليف

### استهلاك API (مثال):

| الـ Model | السعر لكل 1000 input tokens | السعر لكل 1000 output tokens |
|---------|--------------------------|----------------------------|
| gpt-4-mini | $0.00015 | $0.0006 |
| gpt-3.5-turbo | $0.0005 | $0.0015 |

### التقدير:
- رسالة واحدة: ~500 tokens = ~$0.0005
- 100 رسالة يومياً: ~$0.05
- 1000 مستخدم نشط: ~$50/يوم

**نصيحة:** استخدم Token limits في الـ .env:
```bash
OPENAI_MAX_TOKENS=450  # حد أقصى للإجابة
```

---

## 🧪 اختبار على localhost

### 1. سجل حساب اختبار جديد

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 2. سجل دخول

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!"
  }'
```

احصل على الـ `accessToken` من الـ Response

### 3. اختبر AI Tutor

```bash
curl -X POST http://localhost:3000/api/ai/tutor/reply \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I am student",
    "scenario": "introduction",
    "proficiency": "A1"
  }'
```

---

## 🔐 الأمان

### النقاط المهمة:

✅ **لا تعرض الـ API Key:**
- لا تضعها في الكود مباشرة
- استخدم `.env` files فقط
- أضف `.env` إلى `.gitignore`

✅ **استخدم الـ Token Limits:**
```bash
# في backend/.env
AI_TIMEOUT_MS=15000        # 15 ثانية
AI_RETRY_COUNT=2           # حد أقصى لعدد المحاولات
RATE_LIMIT_AI_MAX=100      # 100 طلب/دقيقة لكل مستخدم
```

✅ **مراقبة الاستخدام:**
- اذهب إلى https://platform.openai.com/account/usage/overview
- راقب استهلاكك اليومي
- اضبط الحد الأقصى للإنفاق

---

## ❌ استكشاف الأخطاء

### المشكلة: "OPENAI_API_KEY is not configured"

**الحل:**
```bash
# تحقق من .env
cat backend/.env | grep OPENAI_API_KEY

# إذا كان فارغاً، أضف الـ key:
OPENAI_API_KEY=sk-proj-xxxx
```

### المشكلة: "Invalid API key provided"

**الحل:**
- تحقق من الـ key من https://platform.openai.com/account/api-keys
- تأكد من عدم إضافة مسافات إضافية
- جرب key جديد إذا انتهت صلاحيته

### المشكلة: "Rate limit exceeded"

**الحل:**
```bash
# في .env قلل الـ limit مؤقتاً:
RATE_LIMIT_AI_MAX=50
AI_TIMEOUT_MS=20000
```

### المشكلة: "Timeout"

**الحل:**
```bash
# زد الـ timeout:
AI_TIMEOUT_MS=30000  # 30 ثانية
```

---

## 📝 اختبار كامل

### Backend Test Script:

```javascript
// backend/test-ai.js
import config from "./src/config.js";
import { generateTutorReply } from "./src/services/aiTutorService.js";

async function test() {
  console.log("Testing AI Tutor...");
  console.log("API Key configured:", !!config.openaiApiKey);
  console.log("Model:", config.openaiModel);
  
  try {
    const result = await generateTutorReply({
      message: "I am a student",
      scenario: "introduction",
      proficiency: "A1"
    });
    
    console.log("✅ Success!");
    console.log("Response:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

test();
```

**تشغيل:**
```bash
cd backend
node test-ai.js
```

---

## 🎯 الخطوة التالية

بعد إعداد OpenAI:
1. ✅ اختبر الـ API مع cURL
2. ✅ اختبر من الـ Frontend
3. ✅ اختبر مع استخدام حقيقي
4. ✅ راقب التكاليف
5. ✅ انتقل للمحتوى التعليمي

---

**حالة الإعداد:** 🟡 **في الانتظار**  
**المطلوب:** OpenAI API Key
