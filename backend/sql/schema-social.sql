-- Social Feed & Content Management Schema

-- ============================================================
-- SOCIAL FEED TABLES
-- ============================================================

-- User posts
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL DEFAULT 'general', -- general, achievement, lesson_completed
  metadata_json JSONB DEFAULT '{}',
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments on posts
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Likes on posts
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Likes on comments
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Leaderboard view (materialized)
CREATE TABLE IF NOT EXISTS leaderboard_cache (
  rank INT PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  total_xp INT NOT NULL,
  level INT NOT NULL,
  streak_days INT NOT NULL,
  achievements_count INT NOT NULL,
  cached_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_posts_user
  ON posts(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_posts_created
  ON posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_posts_type
  ON posts(post_type);

CREATE INDEX IF NOT EXISTS idx_comments_post
  ON comments(post_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comments_user
  ON comments(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_post_likes_post
  ON post_likes(post_id);

CREATE INDEX IF NOT EXISTS idx_post_likes_user
  ON post_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_comment_likes_comment
  ON comment_likes(comment_id);

CREATE INDEX IF NOT EXISTS idx_comment_likes_user
  ON comment_likes(user_id);

-- ============================================================
-- LEADERBOARD VIEW (for fast queries)
-- ============================================================

CREATE OR REPLACE VIEW v_leaderboard AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(x.points), 0) DESC) as rank,
  u.id as user_id,
  p.display_name,
  COALESCE(SUM(x.points), 0) as total_xp,
  FLOOR(COALESCE(SUM(x.points), 0) / 100) + 1 as level,
  COALESCE(s.current_days, 0) as streak_days,
  0 as achievements_count
FROM users u
JOIN profiles p ON u.id = p.user_id
LEFT JOIN xp_ledger x ON u.id = x.user_id
LEFT JOIN streaks s ON u.id = s.user_id
GROUP BY u.id, p.display_name, s.current_days
ORDER BY total_xp DESC;

-- ============================================================
-- SAMPLE DATA
-- ============================================================

-- Create sample posts
WITH recent_users AS (
  SELECT u.id, p.display_name 
  FROM users u
  JOIN profiles p ON u.id = p.user_id
  LIMIT 3
)
INSERT INTO posts (user_id, content, post_type, metadata_json)
SELECT 
  id,
  'مجرد بدأت رحلتي في تعلم الإنجليزية! 🚀',
  'achievement',
  jsonb_build_object('level', 1)
FROM recent_users
ON CONFLICT DO NOTHING;
