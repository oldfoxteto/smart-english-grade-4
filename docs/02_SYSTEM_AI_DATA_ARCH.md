# System + AI + Data Architecture

## 1) High-Level Architecture
- Clients: Flutter Mobile + React Web + Admin Portal
- Edge: CDN + WAF + API Gateway
- Core Services:
  - Auth Service
  - User Profile Service
  - Curriculum Service
  - Lesson Runtime Service
  - Assessment Service
  - Gamification Service
  - Social Service
  - Billing Service
  - Notification Service
- AI Services:
  - AI Orchestrator
  - Placement Engine
  - Knowledge Tracing Engine
  - Recommendation Engine
  - Exercise Generation Engine
  - Grammar Feedback Engine
  - Speech/Pronunciation Engine
  - Conversation Tutor Engine
- Data Layer:
  - PostgreSQL (transactional)
  - Redis (sessions, streaks, leaderboards cache)
  - Object Storage (audio/images)
  - Analytics Warehouse (BigQuery/Redshift)
- Eventing:
  - Kafka/PubSub for telemetry and async pipelines

## 2) Database Schema (Core Tables)

### Identity & Access
- users(id, email, phone, password_hash, status, created_at)
- profiles(user_id, display_name, country, native_arabic_dialect, birth_year)
- roles(id, name)
- user_roles(user_id, role_id)

### Learning Domain
- languages(id, code, name) -- en/el
- levels(id, language_id, cefr_level)
- tracks(id, language_id, name) -- daily life, travel, work...
- units(id, track_id, level_id, title, sort_order)
- lessons(id, unit_id, lesson_type, title, est_minutes)
- exercises(id, lesson_id, exercise_type, difficulty)
- exercise_items(id, exercise_id, prompt, options_json, answer_key)
- attempts(id, user_id, exercise_item_id, answer_json, is_correct, latency_ms)
- mastery(user_id, skill_key, score, confidence, updated_at)
- srs_cards(id, user_id, token_key, interval_days, easiness, due_at)

### AI & Personalization
- learner_dna(user_id, motivation_type, focus_style, risk_of_churn, updated_at)
- brain_mode_profile(user_id, visual_weight, auditory_weight, kinesthetic_weight)
- emotion_checkins(id, user_id, mood_label, energy_level, created_at)
- ai_recommendations(id, user_id, rec_type, payload_json, accepted)
- ai_feedback(id, user_id, source, error_type, explanation_ar, created_at)
- tutor_sessions(id, user_id, mode, scenario_type, started_at, ended_at)
- tutor_messages(id, session_id, role, text, audio_url)
- pronunciation_scores(id, user_id, phoneme, score, lesson_id, created_at)

### Gamification
- xp_ledger(id, user_id, source, points, created_at)
- streaks(user_id, current_days, best_days, last_active_date)
- levels_progress(user_id, level_no, total_xp)
- badges(id, code, title, rarity)
- user_badges(user_id, badge_id, earned_at)
- missions(id, mission_type, target_json, reward_json, active_from, active_to)
- user_missions(user_id, mission_id, progress, completed_at)
- seasons(id, name, starts_at, ends_at)
- leaderboard_entries(id, season_id, user_id, rank_score)

### Economy & Billing
- wallets(user_id, balance_soft, balance_hard)
- wallet_txns(id, user_id, currency_type, amount, reason, created_at)
- shop_items(id, item_type, title, price_soft, price_hard, metadata_json)
- user_inventory(id, user_id, item_id, equipped)
- plans(id, code, billing_cycle, price, features_json)
- subscriptions(id, user_id, plan_id, status, started_at, renews_at)
- invoices(id, subscription_id, amount, currency, status, issued_at)

### Social
- friendships(user_id, friend_user_id, status, created_at)
- groups(id, name, owner_user_id, visibility)
- group_members(group_id, user_id, role)
- challenges(id, challenge_type, scope, config_json, starts_at, ends_at)
- challenge_participants(id, challenge_id, user_id, score)
- chat_rooms(id, room_type, linked_entity_id)
- chat_messages(id, room_id, sender_id, content, sent_at)

### Assessment & Certificates
- placement_tests(id, language_id, version, config_json)
- placement_results(id, user_id, test_id, estimated_cefr, score_json)
- exams(id, language_id, level_id, type)
- exam_attempts(id, user_id, exam_id, score, passed)
- certificates(id, user_id, exam_attempt_id, serial_no, issued_at)

## 3) AI Architecture (Execution)
- Input Signals:
  - attempts, latency, hint usage, pronunciation, mood, streak, session time
- Models:
  - Placement Model (initial level)
  - Bayesian Knowledge Tracing / DKT (mastery per skill)
  - Recommender (next best lesson)
  - Difficulty Controller (dynamic challenge)
  - Churn Risk Model (retention intervention)
- Generative Stack:
  - LLM + rule constraints for safe exercise generation
  - Arabic explanation templates with linguistic guardrails
- Speech Stack:
  - ASR for user speech
  - phoneme alignment for pronunciation scoring
  - TTS for tutor voice reply
- Safety:
  - scenario filters, age policy, profanity moderation, anti-bias checks

## 4) Core APIs (v1)
- POST /auth/register
- POST /auth/login
- GET /learning/path
- POST /learning/attempt
- GET /learning/review-due
- POST /ai/tutor/session
- POST /ai/tutor/message
- POST /ai/pronunciation/evaluate
- GET /gamification/status
- POST /missions/claim
- GET /leaderboard/current
- POST /billing/subscribe

## 5) Non-Functional Requirements
- p95 API latency < 250ms (non-AI endpoints)
- AI response < 2.5s median for chat turn
- uptime target: 99.9%
- multi-tenant support for schools/companies
- audit logs for certificates and exams
