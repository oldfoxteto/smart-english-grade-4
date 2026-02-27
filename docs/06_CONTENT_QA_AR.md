# QA تربوي/لغوي للمحتوى

هذا المستند يحدد معايير الجودة قبل نشر أي محتوى EN/EL.

## 1) معايير تربوية

- تغطية CEFR كاملة لكل لغة: `A1, A2, B1, B2, C1, C2`
- كل وحدة تحتوي على 3 دروس كحد أدنى.
- كل وحدة تتبع قوس تعليمي واضح:
  - مفردات
  - استماع/فهم
  - إنتاج لغوي (تحدث/كتابة)
  - ضبط نطق/قواعد

## 2) معايير لغوية

- منع عناوين placeholder مثل:
  - `Quick Lesson 1`
  - `Listening Drill`
  - `Speaking Drill`
- صياغة عناوين واقعية مرتبطة بالموقف.
- توافق المستوى مع تعقيد المهمة (A1 بسيط، C1/C2 متقدم).

## 3) تغطية سيناريوهات إنتاج

يجب توفر وحدات فعلية لكل لغة في:

- السفر: `travel-core`, `airport-simulation`, `hotel-simulation`, `emergency-travel`
- العمل: `work-communication`, `meeting-simulation`, `job-interview-simulation`, `email-writing`
- الهجرة: `immigration-interview`, `housing-utilities`, `healthcare-visit`

## 4) أداة QA آلية

تشغيل:

```bash
cd backend
npm run content:qa
```

الأداة تتحقق من:
- تغطية المستويات لكل لغة
- تغطية السيناريوهات الأساسية
- عدم وجود placeholder titles
- الحد الأدنى لعدد الدروس في كل وحدة

إذا ظهرت violations يجب إصلاحها قبل النشر.
