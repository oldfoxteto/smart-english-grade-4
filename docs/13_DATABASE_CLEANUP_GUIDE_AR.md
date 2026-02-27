# 🗑️ حذف وتنظيف بيانات المستخدمين

**تاريخ:** 22 فبراير، 2026

---

## 📋 الخيارات المتاحة

### 1️⃣ حذف جميع بيانات المستخدمين (Safe Clean)

هذا يحذف جميع المستخدمين والبيانات المرتبطة بهم مع الحفاظ على **بنية قاعدة البيانات**:

```bash
cd backend
npm run db:clean
```

**ما الذي يتم حذفه:**
- ✓ جميع حسابات المستخدمين (users)
- ✓ السجلات والمظاهر (profiles)
- ✓ بيانات الاشتراكات (subscriptions)
- ✓ نقاط الـ XP (xp_ledger)
- ✓ السلاسل (streaks)
- ✓ الـ tokens (refresh_tokens)
- ✓ مسارات التعلم (user_learning_paths)
- ✓ نتائج الاختبارات (placement_results)
- ✓ سجلات الأحداث (analytics_events)

**ما الذي يبقى:**
- ✓ جداول المحتوى (lessons, units, tracks)
- ✓ الأسئلة والخيارات (placement_tests, placement_questions)
- ✓ الأدوار والخطط (roles, plans)
- ✓ بنية الجداول والفهارس

---

### 2️⃣ إعادة تعيين كاملة (Full Reset)

هذا يعيد قاعدة البيانات إلى الحالة الأولية:

```bash
cd backend
npm run db:reset
```

**الترتيب:**
1. تشغيل schema migration (`001_init_schema.sql`)
2. تحميل البيانات الأساسية (`002_seed_core.sql`)

---

### 3️⃣ النسخ الاحتياطية

قبل حذف أي بيانات، **احفظ نسخة احتياطية**:

```bash
cd backend
npm run db:backup
```

**يتم الحفظ في:**
```
backups/
├── pre-audit-YYYYMMDD-HHMMSS/
│   ├── users.sql
│   ├── profiles.sql
│   ├── subscriptions.sql
│   └── ...
```

---

## 🔄 خطوات الحذف الآمنة

### الطريقة الموصى:

```bash
# Step 1: انشئ نسخة احتياطية
npm run db:backup

# Step 2: انتظر التأكيد ✓

# Step 3: حذف بيانات المستخدمين
npm run db:clean

# Step 4: تحقق من النتيجة
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
# Expected: 0
```

---

## 💾 استعادة البيانات

### من النسخة الاحتياطية:

```bash
# اسرد النسخ المتاحة
ls backups/

# استعد من نسخة معينة
npm run db:restore -- backups/pre-audit-20260222-012218/
```

---

## ⚠️ تحذيرات مهمة

### 1. **لا يمكن التراجع**
- حذف البيانات **دائم** إذا لم تكن هناك نسخة احتياطية
- تأكد من عمل backup قبل الحذف

### 2. **التحقق من الاتصال**
```bash
# تحقق من DATABASE_URL
echo $DATABASE_URL

# اختبر الاتصال
psql $DATABASE_URL -c "SELECT version();"
```

### 3. **الأداء أثناء الحذف**
- الحذف قد يستغرق دقيقة أو أكثر (حسب حجم البيانات)
- لا تقاطع العملية أثناء التشغيل

### 4. **الـ Triggers والعلاقات**
- السكريبت يعطل Triggers مؤقتاً
- يتم إعادتها تفعيل تلقائياً
- إذا حدث خطأ، يتم عكس جميع التغييرات

---

## 📊 التحقق من الحذف

### قبل الحذف:

```bash
psql $DATABASE_URL << EOF
SELECT 'Users' AS table_name, COUNT(*) FROM users
UNION ALL
SELECT 'Profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'Subscriptions', COUNT(*) FROM subscriptions
UNION ALL
SELECT 'XP Ledger', COUNT(*) FROM xp_ledger;
EOF
```

### بعد الحذف:

```bash
# جميع يجب أن تكون 0
psql $DATABASE_URL -c "SELECT COUNT(*) AS total_users FROM users;"
```

---

## 🆘 استكشاف الأخطاء

### المشكلة: "Cannot connect to database"

```bash
# تحقق من الـ URL
echo $DATABASE_URL

# تحقق من خادم PostgreSQL
pg_isready -h localhost -p 5432
```

### المشكلة: "Permission denied"

```bash
# تحقق من صلاحيات database user
psql $DATABASE_URL -c "\du"

# قد تحتاج superuser permissions للـ DROP
```

### المشكلة: "Foreign key constraint failed"

```bash
# قد تكون علاقة لم يتم حذفها
# السكريبت يجب أن يتعامل معها تلقائياً

# يمكنك تفعيل الـ cascade delete:
psql $DATABASE_URL -c "SELECT constraint_name FROM information_schema.table_constraints WHERE table_name='users' AND constraint_type='FOREIGN KEY';"
```

---

## 🧪 اختبار الحذف

### محاكاة الحذف (Test Mode):

```bash
# انسخ السكريبت وعدّل ليكون للـ SELECT بدل DELETE
cp scripts/clean-database.js scripts/test-clean.js

# ثم عدّل جميع المسافات DELETE إلى SELECT COUNT(*)
```

---

## 📝 السيناريوهات الشائعة

### السيناريو 1: مسح البيانات الاختبارية
```bash
npm run db:clean
```

### السيناريو 2: إعادة تعيين للإنتاج
```bash
# 1. Backup أولاً
npm run db:backup

# 2. حذف البيانات
npm run db:clean

# 3. إعادة التحميل
npm run db:seed
```

### السيناريو 3: مسح مستخدم واحد
```bash
# استخدم psql مباشرة
psql $DATABASE_URL -c "DELETE FROM users WHERE email = 'user@example.com';"
```

---

## ✅ قائمة التحقق

قبل تشغيل الحذف:

- [ ] عملت backup
- [ ] تحققت من DATABASE_URL
- [ ] تأكدت من وجود نسخة احتياطية
- [ ] قرأت التحذيرات
- [ ] لديك صلاحيات الحذف
- [ ] الـ Backend متوقف (اختياري لكن موصى)

---

**حالة الدعم:** 🟢 **جاهز**
