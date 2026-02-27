import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function cleanDatabase() {
  console.log('🗑️  سيتم حذف جميع بيانات المستخدمين...');
  console.log('⚠️  تأكد من عمل نسخة احتياطية قبل المتابعة!');
  console.log('');

  const answer = await question('هل تريد المتابعة؟ (y/n): ');
  
  if (answer.toLowerCase() !== 'y') {
    console.log('تم الإلغاء.');
    rl.close();
    process.exit(0);
  }

  const client = await pool.connect();

  try {
    console.log('جاري الحذف...');

    // Start transaction
    await client.query('BEGIN');

    // Disable triggers
    const disableTriggers = [
      'ALTER TABLE user_roles DISABLE TRIGGER ALL',
      'ALTER TABLE profiles DISABLE TRIGGER ALL',
      'ALTER TABLE placement_results DISABLE TRIGGER ALL',
      'ALTER TABLE user_learning_paths DISABLE TRIGGER ALL',
      'ALTER TABLE refresh_tokens DISABLE TRIGGER ALL',
      'ALTER TABLE xp_ledger DISABLE TRIGGER ALL',
      'ALTER TABLE streaks DISABLE TRIGGER ALL',
      'ALTER TABLE subscriptions DISABLE TRIGGER ALL',
      'ALTER TABLE analytics_events DISABLE TRIGGER ALL'
    ];

    for (const query of disableTriggers) {
      await client.query(query);
    }

    // Delete user data
    const deleteQueries = [
      { query: 'DELETE FROM analytics_events WHERE user_id IS NOT NULL', name: 'analytics_events' },
      { query: 'DELETE FROM subscriptions', name: 'subscriptions' },
      { query: 'DELETE FROM xp_ledger', name: 'xp_ledger' },
      { query: 'DELETE FROM streaks', name: 'streaks' },
      { query: 'DELETE FROM refresh_tokens', name: 'refresh_tokens' },
      { query: 'DELETE FROM user_learning_paths', name: 'user_learning_paths' },
      { query: 'DELETE FROM placement_results', name: 'placement_results' },
      { query: 'DELETE FROM profiles', name: 'profiles' },
      { query: 'DELETE FROM user_roles', name: 'user_roles' },
      { query: 'DELETE FROM users', name: 'users' }
    ];

    for (const item of deleteQueries) {
      const result = await client.query(item.query);
      console.log(`  ✓ ${item.name}: ${result.rowCount} صف محذوف`);
    }

    // Re-enable triggers
    const enableTriggers = [
      'ALTER TABLE user_roles ENABLE TRIGGER ALL',
      'ALTER TABLE profiles ENABLE TRIGGER ALL',
      'ALTER TABLE placement_results ENABLE TRIGGER ALL',
      'ALTER TABLE user_learning_paths ENABLE TRIGGER ALL',
      'ALTER TABLE refresh_tokens ENABLE TRIGGER ALL',
      'ALTER TABLE xp_ledger ENABLE TRIGGER ALL',
      'ALTER TABLE streaks ENABLE TRIGGER ALL',
      'ALTER TABLE subscriptions ENABLE TRIGGER ALL',
      'ALTER TABLE analytics_events ENABLE TRIGGER ALL'
    ];

    for (const query of enableTriggers) {
      await client.query(query);
    }

    // Commit transaction
    await client.query('COMMIT');

    console.log('');
    console.log('✅ تم حذف بيانات المستخدمين بنجاح!');
    console.log('');
    console.log('الجداول الفارغة الآن:');
    console.log('  - users');
    console.log('  - profiles');
    console.log('  - user_roles');
    console.log('  - subscriptions');
    console.log('  - refresh_tokens');
    console.log('  - xp_ledger');
    console.log('  - streaks');
    console.log('  - user_learning_paths');
    console.log('  - placement_results');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ حدث خطأ:', error.message);
    process.exit(1);
  } finally {
    client.release();
    rl.close();
    await pool.end();
  }
}

cleanDatabase();
