import dotenv from 'dotenv';
import { config as getConfig } from '../src/config.js';

dotenv.config();

async function testOpenAI() {
  console.log('🔍 فحص إعدادات OpenAI...\n');

  // قراءة الإعدادات
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4-mini';
  const apiBase = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';

  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY فارغ في .env');
    process.exit(1);
  }

  console.log('✅ OPENAI_API_KEY موجود');
  console.log(`✅ النموذج: ${model}`);
  console.log(`✅ الـ API Base: ${apiBase}`);
  console.log('');

  console.log('⏳ اختبار الاتصال مع OpenAI API...\n');

  try {
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'أنت معلم لغة إنجليزية لطيف'
          },
          {
            role: 'user',
            content: 'تصحيح الجملة: I am student'
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    const data = await response.json();

    // تحقق من الخطأ
    if (data.error) {
      console.error('❌ خطأ من OpenAI:');
      console.error(`   Code: ${data.error.code}`);
      console.error(`   Message: ${data.error.message}`);
      process.exit(1);
    }

    // عرض النتيجة
    if (data.choices && data.choices.length > 0) {
      const reply = data.choices[0].message.content;
      console.log('✅ الاتصال نجح!\n');
      console.log('الرد من AI Tutor:');
      console.log('-'.repeat(50));
      console.log(reply);
      console.log('-'.repeat(50));
      console.log('\n✨ جاهز للاستخدام!');
      console.log('\nمعلومات الاستخدام:');
      console.log(`  Input tokens: ${data.usage?.prompt_tokens || 0}`);
      console.log(`  Output tokens: ${data.usage?.completion_tokens || 0}`);
      console.log(`  Total tokens: ${data.usage?.total_tokens || 0}`);
    }
  } catch (error) {
    console.error('❌ خطأ في الاتصال:');
    console.error(`   ${error.message}`);
    process.exit(1);
  }
}

testOpenAI();
