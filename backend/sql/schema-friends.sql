-- Friends System Schema Extension

-- ============================================================
-- FRIENDS TABLES
-- ============================================================

-- Friend requests (pending, accepted, blocked)
CREATE TABLE IF NOT EXISTS friend_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requestee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, rejected, blocked
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  UNIQUE(requester_id, requestee_id),
  CHECK (requester_id != requestee_id)
);

-- Friends list (denormalized for fast queries)
CREATE TABLE IF NOT EXISTS friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_id_2 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  became_friends_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id_1, user_id_2),
  CHECK (user_id_1 < user_id_2) -- Ensure consistent ordering
);

-- Friend challenges/competitions
CREATE TABLE IF NOT EXISTS friend_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenger_nickname TEXT NOT NULL,
  challenged_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenged_nickname TEXT NOT NULL,
  challenge_type TEXT NOT NULL, -- 'daily_xp', 'lesson_race', 'quiz_battle'
  challenge_date DATE NOT NULL DEFAULT CURRENT_DATE,
  challenger_xp INT DEFAULT 0,
  challenged_xp INT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active', -- active, completed, expired
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(challenger_id, challenged_id, challenge_type, challenge_date)
);

-- Blocking system
CREATE TABLE IF NOT EXISTS blocked_users (
  blocker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_friend_requests_requester
  ON friend_requests(requester_id);

CREATE INDEX IF NOT EXISTS idx_friend_requests_requestee
  ON friend_requests(requestee_id);

CREATE INDEX IF NOT EXISTS idx_friend_requests_status
  ON friend_requests(status, requested_at DESC);

CREATE INDEX IF NOT EXISTS idx_friends_user_1
  ON friends(user_id_1);

CREATE INDEX IF NOT EXISTS idx_friends_user_2
  ON friends(user_id_2);

CREATE INDEX IF NOT EXISTS idx_friend_challenges_challenger
  ON friend_challenges(challenger_id, challenge_date DESC);

CREATE INDEX IF NOT EXISTS idx_friend_challenges_challenged
  ON friend_challenges(challenged_id, challenge_date DESC);

CREATE INDEX IF NOT EXISTS idx_blocked_users_blocker
  ON blocked_users(blocker_id);

CREATE INDEX IF NOT EXISTS idx_blocked_users_blocked
  ON blocked_users(blocked_id);

-- ============================================================
-- SAMPLE DATA (Test friendships)
-- ============================================================

-- Get some user IDs
WITH test_users AS (
  SELECT id, email FROM users LIMIT 5
),
user_list AS (
  SELECT array_agg(id) as ids FROM test_users
)
INSERT INTO friend_requests (requester_id, requestee_id, status)
SELECT 
  u1.id, 
  u2.id, 
  'accepted'
FROM users u1
CROSS JOIN users u2
WHERE u1.id != u2.id
  AND u1.email LIKE '%test%'
  AND u2.email LIKE '%test%'
LIMIT 3
ON CONFLICT (requester_id, requestee_id) DO NOTHING;
