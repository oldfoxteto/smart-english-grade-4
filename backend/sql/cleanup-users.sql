-- Database Cleanup Script
-- حذف بيانات المستخدمين بشكل آمن
-- Safe: لا تحذف جداول أو schema، فقط البيانات

-- ⚠️ تحذير: هذا يحذف جميع بيانات المستخدمين
-- ✅ يمكن التراجع عنه إذا كان هناك backup

BEGIN;

-- تعطيل الـ Triggers مؤقتاً
ALTER TABLE user_roles DISABLE TRIGGER ALL;
ALTER TABLE profiles DISABLE TRIGGER ALL;
ALTER TABLE placement_results DISABLE TRIGGER ALL;
ALTER TABLE user_learning_paths DISABLE TRIGGER ALL;
ALTER TABLE refresh_tokens DISABLE TRIGGER ALL;
ALTER TABLE xp_ledger DISABLE TRIGGER ALL;
ALTER TABLE streaks DISABLE TRIGGER ALL;
ALTER TABLE subscriptions DISABLE TRIGGER ALL;
ALTER TABLE analytics_events DISABLE TRIGGER ALL;

-- عرض العدد قبل الحذف
SELECT COUNT(*) AS "عدد المستخدمين قبل الحذف" FROM users;

-- حذف بيانات المستخدمين
-- الترتيب مهم (الجداول التابعة أولاً)
DELETE FROM analytics_events WHERE user_id IS NOT NULL;
DELETE FROM subscriptions;
DELETE FROM xp_ledger;
DELETE FROM streaks;
DELETE FROM refresh_tokens;
DELETE FROM user_learning_paths;
DELETE FROM placement_results;
DELETE FROM profiles;
DELETE FROM user_roles;
DELETE FROM users;

-- إعادة تفعيل الـ Triggers
ALTER TABLE user_roles ENABLE TRIGGER ALL;
ALTER TABLE profiles ENABLE TRIGGER ALL;
ALTER TABLE placement_results ENABLE TRIGGER ALL;
ALTER TABLE user_learning_paths ENABLE TRIGGER ALL;
ALTER TABLE refresh_tokens ENABLE TRIGGER ALL;
ALTER TABLE xp_ledger ENABLE TRIGGER ALL;
ALTER TABLE streaks ENABLE TRIGGER ALL;
ALTER TABLE subscriptions ENABLE TRIGGER ALL;
ALTER TABLE analytics_events ENABLE TRIGGER ALL;

-- التحقق من الحذف
SELECT COUNT(*) AS "عدد المستخدمين بعد الحذف" FROM users;
SELECT COUNT(*) AS "عدد الملفات الشخصية" FROM profiles;
SELECT COUNT(*) AS "عدد النقاط" FROM xp_ledger;

-- التأكيد
COMMIT;

-- طباعة الرسالة
DO $$
BEGIN
  RAISE NOTICE 'تم حذف جميع بيانات المستخدمين بنجاح!';
  RAISE NOTICE 'الجداول الفارغة:';
  RAISE NOTICE '  - users';
  RAISE NOTICE '  - profiles';
  RAISE NOTICE '  - subscriptions';
  RAISE NOTICE '  - xp_ledger';
  RAISE NOTICE '  - streaks';
  RAISE NOTICE 'البيانات الأساسية (المحتوى، الأسئلة، إلخ) محفوظة بأمان';
END $$;
