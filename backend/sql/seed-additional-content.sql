-- Additional Real Content for More Units (A1)
-- Units 2-4: Survival Phrases, Pronunciation, Travel

-- ============================================================
-- UNIT 2: SURVIVAL PHRASES
-- ============================================================

INSERT INTO lessons (unit_id, lesson_type, title, est_minutes, sort_order)
SELECT u.id, 'grammar', 'الدرس 1: عبارات الطوارئ', 10, 1
FROM units u
JOIN tracks t ON u.track_id = t.id
JOIN levels lv ON u.level_id = lv.id
WHERE t.code = 'survival-phrases' AND lv.cefr_level = 'A1'
LIMIT 1;

INSERT INTO lessons (unit_id, lesson_type, title, est_minutes, sort_order)
SELECT u.id, 'grammar', 'الدرس 2: الاستفسار والمساعدة', 10, 2
FROM units u
JOIN tracks t ON u.track_id = t.id
JOIN levels lv ON u.level_id = lv.id
WHERE t.code = 'survival-phrases' AND lv.cefr_level = 'A1'
LIMIT 1;

-- INSERT BODIES FOR SURVIVAL PHRASES LESSONS

INSERT INTO lesson_bodies (lesson_id, body_json, qa_status)
SELECT l.id, jsonb_build_object(
  'title', 'الدرس 1: عبارات الطوارئ',
  'vocabulary', jsonb_build_array(
    jsonb_build_object('word', 'Help!', 'arabic', 'ساعد!', 'example', 'Help! I need assistance!'),
    jsonb_build_object('word', 'Please', 'arabic', 'من فضلك', 'example', 'Please help me.'),
    jsonb_build_object('word', 'Thank you', 'arabic', 'شكراً', 'example', 'Thank you very much!'),
    jsonb_build_object('word', 'Sorry', 'arabic', 'آسف', 'example', 'I''m sorry for the trouble.'),
    jsonb_build_object('word', 'Excuse me', 'arabic', 'أعتذر', 'example', 'Excuse me, can you help?')
  ),
  'exercises', jsonb_build_array(
    jsonb_build_object('type', 'mc', 'question', 'What is "Help" in English?', 'correct', 0),
    jsonb_build_object('type', 'mc', 'question', 'Which phrase means "آسف"?', 'correct', 2)
  )
), 'approved'
FROM lessons l
WHERE l.title = 'الدرس 1: عبارات الطوارئ';

INSERT INTO lesson_bodies (lesson_id, body_json, qa_status)
SELECT l.id, jsonb_build_object(
  'title', 'الدرس 2: الاستفسار والمساعدة',
  'vocabulary', jsonb_build_array(
    jsonb_build_object('word', 'Where is...?', 'arabic', 'أين...؟', 'example', 'Where is the bathroom?'),
    jsonb_build_object('word', 'Do you speak English?', 'arabic', 'هل تتحدث الإنجليزية؟', 'example', 'Do you speak English?'),
    jsonb_build_object('word', 'I don''t understand', 'arabic', 'لا أفهم', 'example', 'I don''t understand.'),
    jsonb_build_object('word', 'Can you help me?', 'arabic', 'هل يمكنك مساعدتي؟', 'example', 'Can you help me?')
  )
), 'approved'
FROM lessons l
WHERE l.title = 'الدرس 2: الاستفسار والمساعدة';

-- ============================================================
-- UNIT 3: PRONUNCIATION BASICS
-- ============================================================

INSERT INTO lessons (unit_id, lesson_type, title, est_minutes, sort_order)
SELECT u.id, 'listening', 'الدرس 1: الأصوات الأساسية', 8, 1
FROM units u
JOIN tracks t ON u.track_id = t.id
JOIN levels lv ON u.level_id = lv.id
WHERE t.code = 'pronunciation-basics' AND lv.cefr_level = 'A1'
LIMIT 1;

INSERT INTO lesson_bodies (lesson_id, body_json, qa_status)
SELECT l.id, jsonb_build_object(
  'title', 'الدرس 1: الأصوات الأساسية',
  'pronunciation_guide', jsonb_build_array(
    jsonb_build_object('sound', 'a', 'word', 'cat', 'description', 'كما في كلمة "قطة"'),
    jsonb_build_object('sound', 'e', 'word', 'bed', 'description', 'كما في كلمة "سرير"'),
    jsonb_build_object('sound', 'i', 'word', 'sit', 'description', 'كما في كلمة "اجلس"'),
    jsonb_build_object('sound', 'o', 'word', 'hot', 'description', 'كما في كلمة "ساخن"'),
    jsonb_build_object('sound', 'u', 'word', 'put', 'description', 'كما في كلمة "ضع"')
  ),
  'exercises', jsonb_build_array(
    jsonb_build_object('type', 'listening', 'question', 'اسمع وحدد الصوت الصحيح', 'correct', 0)
  )
), 'approved'
FROM lessons l
WHERE l.title = 'الدرس 1: الأصوات الأساسية';

-- ============================================================
-- UNIT 4: TRAVEL CORE
-- ============================================================

INSERT INTO lessons (unit_id, lesson_type, title, est_minutes, sort_order)
SELECT u.id, 'grammar', 'الدرس 1: حجز فندق', 10, 1
FROM units u
JOIN tracks t ON u.track_id = t.id
JOIN levels lv ON u.level_id = lv.id
WHERE t.code = 'travel-core' AND lv.cefr_level = 'A1'
LIMIT 1;

INSERT INTO lessons (unit_id, lesson_type, title, est_minutes, sort_order)
SELECT u.id, 'grammar', 'الدرس 2: الطلب في مطعم', 10, 2
FROM units u
JOIN tracks t ON u.track_id = t.id
JOIN levels lv ON u.level_id = lv.id
WHERE t.code = 'travel-core' AND lv.cefr_level = 'A1'
LIMIT 1;

INSERT INTO lesson_bodies (lesson_id, body_json, qa_status)
SELECT l.id, jsonb_build_object(
  'title', 'الدرس 1: حجز فندق',
  'vocabulary', jsonb_build_array(
    jsonb_build_object('word', 'Hotel', 'arabic', 'فندق', 'example', 'I need a hotel room.'),
    jsonb_build_object('word', 'Room', 'arabic', 'غرفة', 'example', 'I want a double room.'),
    jsonb_build_object('word', 'Bed', 'arabic', 'سرير', 'example', 'The bed is comfortable.'),
    jsonb_build_object('word', 'Check-in', 'arabic', 'تسجيل الدخول', 'example', 'Check-in is at 3 PM.'),
    jsonb_build_object('word', 'Check-out', 'arabic', 'تسجيل المغادرة', 'example', 'Check-out is at 11 AM.')
  ),
  'dialogues', jsonb_build_array(
    jsonb_build_object(
      'english', 'A: I need a room for two nights.\nB: We have a double room available.\nA: Great! How much per night?',
      'arabic', 'أ: أحتاج إلى غرفة لليلتين.\nب: لدينا غرفة مزدوجة متاحة.\nأ: رائع! كم السعر في الليلة؟'
    )
  ),
  'exercises', jsonb_build_array(
    jsonb_build_object('type', 'mc', 'question', 'What is "فندق" in English?', 'correct', 0)
  )
), 'approved'
FROM lessons l
WHERE l.title = 'الدرس 1: حجز فندق';

INSERT INTO lesson_bodies (lesson_id, body_json, qa_status)
SELECT l.id, jsonb_build_object(
  'title', 'الدرس 2: الطلب في مطعم',
  'vocabulary', jsonb_build_array(
    jsonb_build_object('word', 'Restaurant', 'arabic', 'مطعم', 'example', 'Let''s go to a restaurant.'),
    jsonb_build_object('word', 'Menu', 'arabic', 'قائمة الطعام', 'example', 'Can I see the menu?'),
    jsonb_build_object('word', 'Food', 'arabic', 'الطعام', 'example', 'The food is delicious.'),
    jsonb_build_object('word', 'Drink', 'arabic', 'مشروب', 'example', 'What would you like to drink?'),
    jsonb_build_object('word', 'Bill', 'arabic', 'الفاتورة', 'example', 'Can I have the bill?')
  ),
  'dialogues', jsonb_build_array(
    jsonb_build_object(
      'english', 'A: What would you like to eat?\nB: I''ll have chicken and rice.\nA: And to drink?\nB: Water, please.',
      'arabic', 'أ: ماذا تريد أن تأكل؟\nب: سأتناول الدجاج والأرز.\nأ: وللشرب؟\nب: ماء من فضلك.'
    )
  )
), 'approved'
FROM lessons l
WHERE l.title = 'الدرس 2: الطلب في مطعم';

-- ============================================================
-- FINAL VERIFICATION
-- ============================================================

SELECT 
  t.code as track,
  COUNT(l.id) as lessons,
  STRING_AGG(DISTINCT l.title, ' | ') as titles
FROM lessons l
JOIN units u ON l.unit_id = u.id
JOIN tracks t ON u.track_id = t.id
WHERE l.title LIKE '%الدرس%'
GROUP BY t.code
ORDER BY t.code;
