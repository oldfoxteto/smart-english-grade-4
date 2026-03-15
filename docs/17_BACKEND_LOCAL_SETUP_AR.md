# دليل التشغيل المحلي لـ backend/PostgreSQL

آخر تحديث: 2026-03-15

## الهدف
تشغيل `backend/` محليًا بشكل واضح وقابل للتكرار، مع توضيح سبب بقاء بعض الاختبارات `skipped` عندما لا تكون البيئة جاهزة.

## الوضع الحالي
- اختبارات `backend npm test` تعمل جزئيًا: `6 passed / 8 skipped`
- سبب التخطي ليس خطأ بالكود
- السبب الحالي هو غياب PostgreSQL المحلي الجاهز وقت التشغيل
- في هذه البيئة تحديدًا كان `Docker daemon` غير شغال، ولا يوجد `psql` أو خدمة PostgreSQL محلية

## أسرع مسار تشغيل
1. شغّل Docker Desktop وتأكد أن المحرك يعمل فعليًا.
2. من جذر المشروع شغّل:

```bash
docker compose -f docker-compose.dev.yml up -d db
```

3. ادخل إلى مجلد `backend/` ثم شغّل:

```bash
npm install
npm run db:migrate
npm run db:seed
npm test
```

## التحقق المطلوب
- نجاح `npm run db:migrate`
- نجاح `npm run db:seed`
- نجاح `npm test` بدون `skipped` المرتبطة بقاعدة البيانات

## إذا فشل Docker
- تأكد أن Docker Desktop مفتوح وليس مجرد مثبت
- تأكد أن خدمة Linux engine أو WSL backend تعمل
- أعد تنفيذ:

```bash
docker ps
docker compose version
```

إذا فشل `docker ps` أو ظهر خطأ pipe/engine، فهذا عطل بيئي وليس عطل مشروع.

## بديل بدون Docker
- تثبيت PostgreSQL محليًا
- ضبط `DATABASE_URL` داخل `backend/.env`
- ثم تشغيل:

```bash
npm run db:migrate
npm run db:seed
npm test
```

## قرار تنفيذي
- إلى أن ينجح هذا المسار محليًا بالكامل، يبقى `server/server.js` هو الباكند التشغيلي الرسمي للويب
- ويظل `backend/` مسار ترحيل/تجهيز، وليس المصدر الرسمي للإطلاق الحالي
