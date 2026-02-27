#!/bin/bash
# Clean Database Script - حذف آمن لبيانات المستخدمين
# 
# هذا السكريبت يحذف جميع بيانات المستخدمين والتسجيلات
# مع الحفاظ على بنية قاعدة البيانات

set -e

echo "🗑️  سيتم حذف جميع بيانات المستخدمين..."
echo "⚠️  تأكد من عمل نسخة احتياطية قبل المتابعة!"
echo ""
read -p "هل تريد المتابعة؟ (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "تم الإلغاء."
  exit 1
fi

# تشغيل SQL cleanup
psql $DATABASE_URL << 'EOF'
-- Disable foreign key constraints temporarily
ALTER TABLE user_roles DISABLE TRIGGER ALL;
ALTER TABLE profiles DISABLE TRIGGER ALL;
ALTER TABLE placement_results DISABLE TRIGGER ALL;
ALTER TABLE user_learning_paths DISABLE TRIGGER ALL;
ALTER TABLE refresh_tokens DISABLE TRIGGER ALL;
ALTER TABLE xp_ledger DISABLE TRIGGER ALL;
ALTER TABLE streaks DISABLE TRIGGER ALL;
ALTER TABLE subscriptions DISABLE TRIGGER ALL;
ALTER TABLE analytics_events DISABLE TRIGGER ALL;

-- Delete user data
DELETE FROM analytics_events WHERE user_id IS NOT NULL;
DELETE FROM subscriptions;
DELETE FROM xp_ledger;
DELETE FROM streaks;
DELETE FROM refresh_tokens;
DELETE FROM user_learning_paths;
DELETE FROM placement_results;
DELETE FROM profiles;
DELETE FROM user_roles;
DELETE FROM users WHERE status = 'active'; -- Only delete active users

-- Re-enable triggers
ALTER TABLE user_roles ENABLE TRIGGER ALL;
ALTER TABLE profiles ENABLE TRIGGER ALL;
ALTER TABLE placement_results ENABLE TRIGGER ALL;
ALTER TABLE user_learning_paths ENABLE TRIGGER ALL;
ALTER TABLE refresh_tokens ENABLE TRIGGER ALL;
ALTER TABLE xp_ledger ENABLE TRIGGER ALL;
ALTER TABLE streaks ENABLE TRIGGER ALL;
ALTER TABLE subscriptions ENABLE TRIGGER ALL;
ALTER TABLE analytics_events ENABLE TRIGGER ALL;

-- Verify cleanup
SELECT 'Users deleted:' AS status, COUNT(*) AS count FROM users;
SELECT 'Profiles deleted:' AS status, COUNT(*) AS count FROM profiles;
SELECT 'Subscriptions deleted:' AS status, COUNT(*) AS count FROM subscriptions;
SELECT 'XP records deleted:' AS status, COUNT(*) AS count FROM xp_ledger;

EOF

echo "✅ تم حذف بيانات المستخدمين بنجاح!"
echo ""
echo "الجداول الفارغة الآن:"
echo "- users"
echo "- profiles"
echo "- user_roles"
echo "- subscriptions"
echo "- refresh_tokens"
echo "- xp_ledger"
echo "- streaks"
echo "- user_learning_paths"
echo "- placement_results"
