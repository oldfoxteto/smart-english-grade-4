# خريطة الطريق التنفيذية الرئيسية

آخر تحديث: 2026-03-15

## الهدف
تحويل قائمة "ما هو ناقص" من ملاحظات عامة إلى خطة تنفيذ قابلة للمتابعة، مع تحديد:
- الوضع الحالي
- المطلوب
- الأولوية
- معايير الإغلاق
- حالة التنفيذ

## القرار المعماري الحالي
- الباكند الرسمي للويب في المرحلة الحالية هو: `server/server.js`
- السبب:
  - الواجهة الحالية تعمل عليه فعليًا
  - تسجيل الدخول والـ progress والـ AI والـ analytics مرتبطة به الآن
  - البيئة المحلية جاهزة له أكثر من `backend/`
- يبقى `backend/` مسار ترحيل لاحق إلى PostgreSQL، وليس المصدر الرسمي الحالي حتى تجهز الهجرة والاختبارات والبيئة المحلية

## الحالة الحالية المختصرة
- الواجهة الأساسية: موجودة وتعمل
- الهوية البصرية: موحّدة بدرجة كبيرة
- الصفحات الأساسية: تعمل
- البيانات الحقيقية: ما زالت غير مكتملة في عدة مواضع
- المحتوى الحقيقي: أقل بكثير من المخطط
- مسار الباكند: مزدوج ويحتاج حسمًا وتشغيلًا مرحليًا

## مسارات العمل

### 1. المحتوى التعليمي الحقيقي
الحالة الحالية:
- الملف [a1Content.ts](D:/sara/smart-english-grade-4/src/core/a1Content.ts) يعلن محتوى A1 واسعًا
- الموجود فعليًا أقرب إلى عينة أولية وليس مكتبة 50 درسًا

المشكلة:
- فجوة بين ما يعلنه المنتج وما هو متاح فعليًا
- صعوبة الاعتماد على المنصة كرحلة تعليم كاملة

المطلوب:
- بناء مكتبة A1 كاملة
- توحيد بنية الدرس والتمرين والقراءة والاستماع
- اعتماد مراجعة جودة للمحتوى العربي والإنجليزي

خطة التنفيذ:
1. حصر الدروس الحالية وتحديد ما هو ناقص لكل وحدة.
2. تقسيم 50 درسًا إلى وحدات إنتاجية صغيرة.
3. إنشاء قالب موحد لكل درس.
4. إضافة المحتوى على دفعات قابلة للمراجعة.
5. إضافة QA للمفردات والترجمة والإجابات.

معيار الإغلاق:
- وجود 50 درسًا فعليًا داخل مصدر بيانات مع تمارين قابلة للتشغيل
- عدم وجود فروق بين التوثيق والعدد الحقيقي

الأولوية:
- حرجة

الحالة:
- `in_progress`

تحديث التنفيذ:
- تم توسيع مكتبة `A1` من النواة الحالية إلى 50 درسًا فعليًا عبر [a1GeneratedLessons.ts](D:/sara/smart-english-grade-4/src/core/a1GeneratedLessons.ts) وربطها مع [a1Content.ts](D:/sara/smart-english-grade-4/src/core/a1Content.ts)

### 2. الصفحات التي ما زالت تعتمد على mock data
الحالة الحالية:
- [PracticePage.tsx](D:/sara/smart-english-grade-4/src/pages/PracticePage.tsx)
- [SettingsPage.tsx](D:/sara/smart-english-grade-4/src/pages/SettingsPage.tsx)
- [LeaderboardPage.tsx](D:/sara/smart-english-grade-4/src/pages/LeaderboardPage.tsx)
- [ReadingQuestPage.tsx](D:/sara/smart-english-grade-4/src/pages/ReadingQuestPage.tsx)

المشكلة:
- الواجهة جميلة لكن بعض البيانات ليست حقيقية بعد
- المستخدم قد يظن أن الوظائف مكتملة وهي ما زالت تجريبية

المطلوب:
- ربط الصفحات بواجهات API فعلية
- إلغاء البيانات الثابتة كلما توفر endpoint واضح

خطة التنفيذ:
1. تعريف endpoint لكل صفحة.
2. إنشاء service layer موحد للصفحات الأربع.
3. استبدال mock data تدريجيًا.
4. إضافة loading وempty وerror states حقيقية.
5. إضافة اختبارات تكامل لهذه المسارات.

معيار الإغلاق:
- كل صفحة تقرأ وتكتب من API فعلية
- عدم وجود mock data في المسارات الإنتاجية

الأولوية:
- حرجة

الحالة:
- `in_progress`

ملاحظة تنفيذية:
- تم توحيد الشكل البصري لهذه الصفحات
- وتم ربط [PracticePage.tsx](D:/sara/smart-english-grade-4/src/pages/PracticePage.tsx) و [SettingsPage.tsx](D:/sara/smart-english-grade-4/src/pages/SettingsPage.tsx) و [LeaderboardPage.tsx](D:/sara/smart-english-grade-4/src/pages/LeaderboardPage.tsx) و [ReadingQuestPage.tsx](D:/sara/smart-english-grade-4/src/pages/ReadingQuestPage.tsx) بواجهات فعلية في [server.js](D:/sara/smart-english-grade-4/server/server.js)

### 3. الازدواجية في الصفحات والنسخ
الحالة الحالية:
- [LessonsPage.tsx](D:/sara/smart-english-grade-4/src/pages/LessonsPage.tsx)
- [LessonsPageFixed.tsx](D:/sara/smart-english-grade-4/src/pages/LessonsPageFixed.tsx)
- [SettingsPage.tsx](D:/sara/smart-english-grade-4/src/pages/SettingsPage.tsx)
- [SettingsPageFixed.tsx](D:/sara/smart-english-grade-4/src/pages/SettingsPageFixed.tsx)
- [SettingsPageSimple.tsx](D:/sara/smart-english-grade-4/src/pages/SettingsPageSimple.tsx)
- [PracticePage.tsx](D:/sara/smart-english-grade-4/src/pages/PracticePage.tsx)
- [PracticePageSimple.tsx](D:/sara/smart-english-grade-4/src/pages/PracticePageSimple.tsx)
- [PracticePageWorking.tsx](D:/sara/smart-english-grade-4/src/pages/PracticePageWorking.tsx)
- توجد كذلك نسخ "Professional" لبعض الصفحات

المشكلة:
- صعوبة معرفة الصفحة الرسمية
- احتمال الرجوع لنسخ قديمة عبر import أو preload

المطلوب:
- اعتماد نسخة واحدة لكل صفحة
- وسم البقية كمرشحة للأرشفة أو الحذف

خطة التنفيذ:
1. تحديد الملفات المعتمدة فعليًا من `App.tsx`.
2. تحديد الملفات المستخدمة في preloading أو الأدوات الداخلية.
3. تحويل كل المسارات المساعدة إلى النسخة الرسمية.
4. نقل النسخ القديمة إلى مجلد `archive/` أو حذفها بعد التأكد.

معيار الإغلاق:
- ملف واحد رسمي لكل صفحة إنتاجية
- عدم وجود imports تشير لنسخ قديمة

الأولوية:
- عالية

الحالة:
- `in_progress`

تنفيذ اليوم:
- تم توحيد [PerformanceOptimized.tsx](D:/sara/smart-english-grade-4/src/components/common/PerformanceOptimized.tsx) ليستخدم [PracticePage.tsx](D:/sara/smart-english-grade-4/src/pages/PracticePage.tsx) و [SettingsPage.tsx](D:/sara/smart-english-grade-4/src/pages/SettingsPage.tsx) بدل نسخ أقدم

### 4. عدم توحيد مصدر البيانات
الحالة الحالية:
- بعض البيانات تأتي من ملفات محلية ثابتة
- بعض المسارات تعتمد `server/server.js`
- مسار `backend/` ينتظر PostgreSQL

المشكلة:
- مصادر متعددة للحقيقة
- صعوبة التوسع والاختبار

المطلوب:
- تعريف `Source of Truth` واحد للويب
- وضع خطة ترحيل من المحلي إلى API

خطة التنفيذ:
1. توثيق أن `server/` هو المسار الرسمي الحالي.
2. إنشاء جدول يربط كل صفحة بمصدر بياناتها الحالي والمستهدف.
3. نقل بيانات الدروس والـ quests والـ leaderboard تدريجيًا إلى API.
4. حصر ما سيبقى local وما يجب أن يصبح server-driven.

معيار الإغلاق:
- كل صفحة إنتاجية لها مصدر بيانات واضح وموحّد
- توقف الاعتماد على ملفات محلية في المسارات الأساسية

الأولوية:
- حرجة

الحالة:
- `in_progress`

### 5. backend غير مفعّل محليًا بالكامل
الحالة الحالية:
- [backend/package.json](D:/sara/smart-english-grade-4/backend/package.json) يعتمد PostgreSQL
- جزء من الاختبارات يُتخطى لغياب البيئة المحلية

المشكلة:
- لا يمكن اعتباره جاهزًا كمسار رسمي حاليًا

المطلوب:
- جعل تشغيله محليًا سهلاً أو تأجيله بوضوح

خطة التنفيذ:
1. توفير ملف تشغيل PostgreSQL محلي واضح.
2. إضافة `.env.example` وseed/reset موثوق.
3. جعل الاختبارات تعمل على بيئة معروفة.
4. مقارنة جاهزيته مع `server/` قبل أي تحويل رسمي.

معيار الإغلاق:
- `backend npm test` يعمل بالكامل محليًا دون تخطي بسبب البيئة

الأولوية:
- عالية

الحالة:
- `completed`

تحديث التنفيذ:
- تم عزل الموبايل كمسار `Phase 2 / preview` داخل [AIChatScreen.tsx](D:/sara/smart-english-grade-4/src/mobile/react-native/screens/AIChatScreen.tsx) و [LessonDetailScreen.tsx](D:/sara/smart-english-grade-4/src/mobile/react-native/screens/LessonDetailScreen.tsx)
- تم تشغيل PostgreSQL محليًا عبر Docker Compose
- نجحت أوامر `npm run db:migrate` و `npm run db:seed`
- نجحت اختبارات `backend npm test` و `backend npm run test:e2e` و `backend npm run test:security` بدون `skipped`

### 6. realtime voice في الباكند الحالي تم تحسينه ولم يعد placeholder بسيطًا
الحالة الحالية:
- [server.js](D:/sara/smart-english-grade-4/server/server.js) يحتوي على بث socket وصيغة تشغيل فعلية لـ STT/TTS مع rate limiting ورسائل status/error أوضح
- الواجهة في [AITutorPage.tsx](D:/sara/smart-english-grade-4/src/pages/AITutorPage.tsx) أصبحت تدير lifecycle الجلسة والتنظيف وإعادة الاتصال بشكل أفضل
- المسار الحالي أقرب كثيرًا للجاهزية، لكنه ليس تجربة production-grade نهائية بعد

المشكلة:
- الأداء والاستقرار وجودة التدفق الصوتي غير مضمونة

المطلوب:
- بروتوكول واضح للصوت
- إدارة أفضل للجلسة والمعدلات والأخطاء

خطة التنفيذ:
1. فصل منطق الصوت في module مستقل.
2. توضيح codec وحجم الإطارات.
3. إضافة retries وtimeouts وtelemetry خاصة بالصوت.
4. بناء fallback واضح عند فشل الصوت.
5. إضافة اختبار smoke للصوت إن أمكن.

معيار الإغلاق:
- جلسة صوتية مستقرة مع fallback صالح ومراقبة واضحة

الأولوية:
- عالية

الحالة:
- `pending`

### 7. تطبيق الموبايل غير مكتمل إنتاجيًا
الحالة الحالية:
- [AIChatScreen.tsx](D:/sara/smart-english-grade-4/src/mobile/react-native/screens/AIChatScreen.tsx) يحتوي AI simulated
- [LessonDetailScreen.tsx](D:/sara/smart-english-grade-4/src/mobile/react-native/screens/LessonDetailScreen.tsx) لا يملك تشغيل صوت مكتمل

المشكلة:
- فتح مسار موبايل قبل تثبيت الويب يشتت التنفيذ

المطلوب:
- قرار إداري وتقني واضح: تجميد مرحلي أو استكمال فعلي

خطة التنفيذ:
1. تصنيف الموبايل كـ `Phase 2` رسميًا.
2. وضع لافتة داخل الكود والوثائق أنه غير جاهز إنتاجيًا.
3. منع تسويق الموبايل كميزة جاهزة.
4. العودة إليه فقط بعد إغلاق web core gaps.

معيار الإغلاق:
- إما نسخة موبايل تعمل فعليًا
- أو فصل رسمي واضح يمنع الخلط

الأولوية:
- متوسطة

الحالة:
- `pending`

## النواقص الوظيفية من منظور المنتج

### مكتبة دروس كاملة
- ترتبط بمسار العمل رقم 1
- لا يُعتبر المنتج مكتملًا بدونها

### تمارين متنوعة مرتبطة بقاعدة بيانات
- ترتبط بمساري 1 و2 و4
- الأولوية: حرجة

### إعدادات حقيقية مرتبطة بباكند
- ترتبط بمساري 2 و4
- الأولوية: عالية

### leaderboard حقيقي
- ترتبط بمساري 2 و4
- الأولوية: عالية

### reading quests حقيقية
- ترتبط بمساري 1 و2 و4
- الأولوية: عالية

### توحيد web + backend
- ترتبط بمسارات 3 و4 و5
- الأولوية: حرجة

### voice AI مستقر
- ترتبط بمسار 6
- الأولوية: عالية

### إنهاء أو تجميد الموبايل
- ترتبط بمسار 7
- الأولوية: متوسطة

## الجودة الحالية
- `npm run type-check`: ناجح
- `npm run build`: ناجح
- `npm run lint`: ناجح مع تحذيرين قديمين في `scripts`
- اختبارات الواجهة الأساسية كانت ناجحة سابقًا
- اختبارات `backend/` ما زالت جزئية لعدم اكتمال البيئة

مهم:
- اختبارات Playwright الحالية لا تكفي كتكامل حقيقي نهائي لأنها تستخدم mocking في بعض المسارات

## المخاطر الحالية
1. الشكل العام متقدم أكثر من البيانات الحقيقية
2. تعدد مسارات الباكند يربك التطوير والنشر
3. النسخ المتعددة من الصفحات تزيد احتمالية التناقض
4. الوثائق القديمة لا تعكس الواقع الحالي كاملًا
5. الموبايل قد يسحب الجهد من نسخة الويب

## التقييم التنفيذي الحالي
- البنية التقنية: قوية
- أساس الكود: جيد
- إطلاق داخلي/تجريبي: جيد
- إطلاق عام: متوسط
- اكتمال المنتج: غير مكتمل بعد

## النسب التقديرية الحالية
- البنية التقنية والبيئة: 80%
- الواجهة الأساسية: 75%
- الباكند الأساسي: 70%
- المحتوى الحقيقي: 25%
- الجاهزية النهائية كمنتج: 55%

## ترتيب التنفيذ المقترح
### المرحلة 1
- توحيد المسار المعماري
- تقليل الازدواجية في الصفحات
- تثبيت مصدر الحقيقة للويب

### المرحلة 2
- تحويل الصفحات الأساسية من mock إلى real data
- ربط الإعدادات والتمارين والـ leaderboard والـ reading quests بواجهات فعلية

### المرحلة 3
- استكمال المحتوى الحقيقي
- إدخال QA للمحتوى

### المرحلة 4
- تثبيت الاختبارات التكاملية الحقيقية
- إنهاء قرار `backend/`
- بناء مسار الصوت الحقيقي

### المرحلة 5
- مراجعة قرار الموبايل
- إما الاستكمال أو الفصل الرسمي

## سجل التنفيذ
- [x] توحيد الهوية البصرية للصفحات الأساسية
- [x] توحيد `PerformanceOptimized.tsx` مع الصفحات الرسمية الحالية
- [x] إنشاء هذه الخريطة التنفيذية الرئيسية
- [x] إنشاء مصفوفة مصادر البيانات
- [x] تحويل `Practice` إلى بيانات حقيقية
- [x] تحويل `Settings` إلى بيانات حقيقية
- [x] تحويل `Leaderboard` إلى بيانات حقيقية
- [x] تحويل `Reading Quest` إلى بيانات حقيقية
- [x] توسيع `A1` إلى 50 درسًا فعليًا
- [x] عزل مسار الموبايل كمرحلة لاحقة بوضوح
- [ ] بناء جدول ربط لكل صفحة مع مصدر بياناتها الحالي والمستهدف
- [ ] تنظيف النسخ القديمة غير المستخدمة
- [x] تجهيز `backend/` محليًا بالكامل أو تجميده رسميًا
- [x] نقل الصوت من placeholder إلى مسار أكثر استقرارًا وجاهزية للإنتاج
