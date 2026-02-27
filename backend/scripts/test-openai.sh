#!/bin/bash
# Test OpenAI Connection
# اختبر الاتصال مع OpenAI

set -e

echo "🔍 فحص إعدادات OpenAI..."
echo ""

# تحقق من .env
if [ ! -f .env ]; then
  echo "❌ لم يتم العثور على ملف .env"
  exit 1
fi

# قراءة الـ API Key
OPENAI_API_KEY=$(grep "OPENAI_API_KEY=" .env | cut -d '=' -f2)
OPENAI_MODEL=$(grep "OPENAI_MODEL=" .env | cut -d '=' -f2)

if [ -z "$OPENAI_API_KEY" ]; then
  echo "❌ OPENAI_API_KEY فارغ في .env"
  exit 1
fi

echo "✅ OPENAI_API_KEY موجود"
echo "✅ النموذج: $OPENAI_MODEL"
echo ""

# اختبر الاتصال
echo "⏳ اختبار الاتصال مع OpenAI API..."
echo ""

RESPONSE=$(curl -s -X POST https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "'$OPENAI_MODEL'",
    "messages": [{"role": "user", "content": "Hello, test connection"}],
    "max_tokens": 50,
    "temperature": 0.7
  }')

# تحقق من الخطأ
if echo "$RESPONSE" | grep -q "error"; then
  ERROR_MSG=$(echo "$RESPONSE" | grep -o '"message":"[^"]*' | cut -d'"' -f4)
  echo "❌ خطأ في الاتصال:"
  echo "   $ERROR_MSG"
  exit 1
fi

# تحقق من النجاح
if echo "$RESPONSE" | grep -q "choices"; then
  REPLY=$(echo "$RESPONSE" | grep -o '"content":"[^"]*' | cut -d'"' -f4 | head -1)
  echo "✅ الاتصال نجح!"
  echo ""
  echo "الرد من OpenAI:"
  echo "   $REPLY"
  echo ""
  echo "✨ جاهز للاستخدام!"
else
  echo "⚠️  استجابة غير متوقعة:"
  echo "$RESPONSE"
fi
