# 🗑️ حذف بيانات المستخدمين - دليل سريع

**في 3 خطوات:**

---

## الخطوة 1: عمل Backup (اختياري لكن موصى) ⚡

```bash
cd backend
npm run db:backup
```

✅ سيتم حفظ نسخة احتياطية في `backups/`

---

## الخطوة 2: حذف البيانات 🗑️

### الطريقة السهلة (Node.js):

```bash
cd backend
npm run db:clean
```

**اضغط `y` عند السؤال**

---

### الطريقة المباشرة (SQL):

```bash
cd backend
psql $DATABASE_URL < sql/cleanup-users.sql
```

---

### الطريقة اليدوية (psql):

```bash
psql $DATABASE_URL

# ثم اكتب:
\i sql/cleanup-users.sql

# أو:
DELETE FROM users;
DELETE FROM profiles;
DELETE FROM subscriptions;
DELETE FROM xp_ledger;
DELETE FROM streaks;
```

---

## الخطوة 3: التحقق ✓

```bash
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

✅ يجب أن تكون النتيجة: **0**

---

## 🎯 النتيجة النهائية

```
✓ 0 مستخدمين
✓ 0 حسابات
✓ 0 بيانات شخصية
✓ المحتوى التعليمي محفوظ
✓ قاعدة البيانات نظيفة
```

---

## 🆘 إذا أردت الاسترجاع

```bash
npm run db:restore -- backups/pre-audit-XXXXXX-XXXXXX/
```

---

**التحديثات التالية:** 🚀 جاهز للمستخدمين الجدد!
