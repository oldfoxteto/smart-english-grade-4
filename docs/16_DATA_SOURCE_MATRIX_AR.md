# مصفوفة مصادر البيانات

آخر تحديث: 2026-03-15

## الهدف
تحديد مصدر البيانات الحالي والمستهدف لكل صفحة رئيسية حتى لا يبقى المشروع موزعًا بين:
- ملفات محلية
- بيانات mock
- `server/`
- `backend/`

## القرار التنفيذي الحالي
- مصدر الحقيقة الرسمي لنسخة الويب الآن: `server/server.js`
- `backend/` يبقى مسار ترحيل لاحق إلى PostgreSQL وليس المصدر التشغيلي الحالي

## الصفحات الأساسية

| الصفحة | المصدر الحالي | الحالة | المصدر المستهدف | ملاحظات |
|---|---|---|---|---|
| `Login` | `server/` | حي | `server/` ثم ترحيل لاحق | مكتمل وظيفيًا |
| `Onboarding` | واجهة + API حالية | جزئي | `server/` | يحتاج تثبيت المسار التعليمي النهائي |
| `Home` | local + progress | جزئي | `server/` | يحتاج بعض المقاييس الموحدة |
| `Lessons` | `a1Content.ts` + progress API | جزئي | محتوى موحد من API | ما زال المحتوى نفسه غير مكتمل |
| `Lesson` | `a1Content.ts` + progress API | جزئي | API موحد | يعتمد على محتوى محلي |
| `Practice` | `server/` | تم التحويل | `server/` | تم ربط الكتالوج والتقدم |
| `Settings` | `server/` | تم التحويل | `server/` | تم ربط القراءة والحفظ |
| `Leaderboard` | `server/` | تم التحويل | `server/` | الآن يقرأ ترتيبًا حيًا من المستخدمين الفعليين |
| `Reading Quest` | `server/` | تم التحويل | `server/` | تم ربط جلب القصة والتقدم |
| `AI Tutor` | `server/` | حي | `server/` | يحتاج تحسين مسار الصوت |
| `Analytics` | `server/` | حي | `server/` | جيد حاليًا |

## المسارات التي ما زالت بحاجة تحويل

### محتوى الدروس
- الحالي: [a1Content.ts](D:/sara/smart-english-grade-4/src/core/a1Content.ts)
- المستهدف: endpoint موحد للمحتوى أو خدمة content داخل `server/`
- الأولوية: حرجة

### القراءة والمفردات والقواعد
- الحالي: صفحات تعتمد على local content
- المستهدف: مصدر محتوى موحد من الباكند
- الأولوية: عالية

### الاختبارات التكاملية
- الحالي: جزء منها mock
- المستهدف: تشغيل flows حقيقية ضد `server/`
- الأولوية: عالية

## ما تم تحويله فعليًا اليوم
- [SettingsPage.tsx](D:/sara/smart-english-grade-4/src/pages/SettingsPage.tsx)
- [LeaderboardPage.tsx](D:/sara/smart-english-grade-4/src/pages/LeaderboardPage.tsx)
- [PracticePage.tsx](D:/sara/smart-english-grade-4/src/pages/PracticePage.tsx)
- [ReadingQuestPage.tsx](D:/sara/smart-english-grade-4/src/pages/ReadingQuestPage.tsx)
- إضافة endpoints في [server.js](D:/sara/smart-english-grade-4/server/server.js)
- إضافة API client methods في [api.ts](D:/sara/smart-english-grade-4/src/core/api.ts)

## الخطوة التالية
1. نقل مصدر محتوى `Lessons` و`Lesson` من local إلى API موحد
2. حصر وإزالة الصفحات المكررة غير المستخدمة
3. تثبيت اختبارات تكامل حقيقية ضد الـ API الفعلية
