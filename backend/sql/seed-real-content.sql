-- Real Educational Content for Smart English Grade 4
-- Simpler approach: Step by step

-- Step 1: Get the unit_id that we want to update
-- The unit should be: track='daily-life-basics', level='A1'

-- Step 2: Delete old lessons and their bodies
DELETE FROM lesson_bodies 
WHERE lesson_id IN (
  SELECT l.id FROM lessons l
  JOIN units u ON l.unit_id = u.id
  WHERE u.title LIKE '%Greetings%' OR l.title LIKE 'Quick Lesson%'
);

DELETE FROM lessons 
WHERE unit_id IN (
  SELECT u.id FROM units u
  JOIN tracks t ON u.track_id = t.id
  WHERE t.code = 'daily-life-basics'
  LIMIT 1
);

-- Step 3: Create new lessons for the first unit
-- Get the unit_id first - it's the first unit in daily-life-basics track for A1
INSERT INTO lessons (unit_id, lesson_type, title, est_minutes, sort_order)
SELECT u.id, 'grammar', 'الدرس 1: التحيات والتعريفات الأساسية', 10, 1
FROM units u
JOIN tracks t ON u.track_id = t.id
JOIN levels lv ON u.level_id = lv.id
WHERE t.code = 'daily-life-basics' AND lv.cefr_level = 'A1'
LIMIT 1;

INSERT INTO lessons (unit_id, lesson_type, title, est_minutes, sort_order)
SELECT u.id, 'grammar', 'الدرس 2: الأسئلة الأساسية', 10, 2
FROM units u
JOIN tracks t ON u.track_id = t.id
JOIN levels lv ON u.level_id = lv.id
WHERE t.code = 'daily-life-basics' AND lv.cefr_level = 'A1'
LIMIT 1;

INSERT INTO lessons (unit_id, lesson_type, title, est_minutes, sort_order)
SELECT u.id, 'vocabulary', 'الدرس 3: أفراد الأسرة', 10, 3
FROM units u
JOIN tracks t ON u.track_id = t.id
JOIN levels lv ON u.level_id = lv.id
WHERE t.code = 'daily-life-basics' AND lv.cefr_level = 'A1'
LIMIT 1;

INSERT INTO lessons (unit_id, lesson_type, title, est_minutes, sort_order)
SELECT u.id, 'vocabulary', 'الدرس 4: الأنشطة اليومية', 10, 4
FROM units u
JOIN tracks t ON u.track_id = t.id
JOIN levels lv ON u.level_id = lv.id
WHERE t.code = 'daily-life-basics' AND lv.cefr_level = 'A1'
LIMIT 1;

INSERT INTO lessons (unit_id, lesson_type, title, est_minutes, sort_order)
SELECT u.id, 'vocabulary', 'الدرس 5: الأرقام والوقت', 10, 5
FROM units u
JOIN tracks t ON u.track_id = t.id
JOIN levels lv ON u.level_id = lv.id
WHERE t.code = 'daily-life-basics' AND lv.cefr_level = 'A1'
LIMIT 1;

-- Step 4: Add lesson bodies for Lesson 1
INSERT INTO lesson_bodies (lesson_id, body_json, qa_status)
SELECT l.id, jsonb_build_object(
  'title', 'الدرس 1: التحيات والتعريفات الأساسية',
  'objectives', jsonb_build_array(
    'تعلم التحيات الأساسية (Hello, Hi, Good morning)',
    'كيفية تقديم نفسك (My name is...)',
    'الرد على السؤال (Nice to meet you)'
  ),
  'vocabulary', jsonb_build_array(
    jsonb_build_object('word', 'Hello', 'arabic', 'مرحبا'),
    jsonb_build_object('word', 'Hi', 'arabic', 'مرحبا'),
    jsonb_build_object('word', 'Good morning', 'arabic', 'صباح الخير'),
    jsonb_build_object('word', 'My name is', 'arabic', 'اسمي هو'),
    jsonb_build_object('word', 'Nice to meet you', 'arabic', 'يسعدني')
  ),
  'exercises', jsonb_build_array(
    jsonb_build_object('type', 'mc', 'question', 'Which greeting is used in the morning?', 'correct', 1),
    jsonb_build_object('type', 'mc', 'question', 'How do you introduce yourself?', 'correct', 1),
    jsonb_build_object('type', 'fill', 'question', 'Complete: Nice to ______ you!', 'correct', 1)
  )
), 'approved'
FROM lessons l
WHERE l.title = 'الدرس 1: التحيات والتعريفات الأساسية';

-- Step 5: Add lesson bodies for Lesson 2
INSERT INTO lesson_bodies (lesson_id, body_json, qa_status)
SELECT l.id, jsonb_build_object(
  'title', 'الدرس 2: الأسئلة الأساسية',
  'vocabulary', jsonb_build_array(
    jsonb_build_object('word', 'How are you?', 'arabic', 'كيف حالك؟'),
    jsonb_build_object('word', 'I''m fine', 'arabic', 'أنا بخير'),
    jsonb_build_object('word', 'Thank you', 'arabic', 'شكراً')
  ),
  'exercises', jsonb_build_array(
    jsonb_build_object('type', 'mc', 'question', 'What is the correct question?', 'correct', 1),
    jsonb_build_object('type', 'mc', 'question', 'What does I''m fine mean?', 'correct', 1)
  )
), 'approved'
FROM lessons l
WHERE l.title = 'الدرس 2: الأسئلة الأساسية';

-- Step 6: Add lesson bodies for Lesson 3
INSERT INTO lesson_bodies (lesson_id, body_json, qa_status)
SELECT l.id, jsonb_build_object(
  'title', 'الدرس 3: أفراد الأسرة',
  'vocabulary', jsonb_build_array(
    jsonb_build_object('word', 'Mother', 'arabic', 'أم'),
    jsonb_build_object('word', 'Father', 'arabic', 'أب'),
    jsonb_build_object('word', 'Sister', 'arabic', 'أخت'),
    jsonb_build_object('word', 'Brother', 'arabic', 'أخ'),
    jsonb_build_object('word', 'Grandmother', 'arabic', 'جدة')
  ),
  'exercises', jsonb_build_array(
    jsonb_build_object('type', 'mc', 'question', 'What is Mother in Arabic?', 'correct', 0),
    jsonb_build_object('type', 'fill', 'question', 'My ______ is a doctor', 'correct', 0)
  )
), 'approved'
FROM lessons l
WHERE l.title = 'الدرس 3: أفراد الأسرة';

-- Step 7: Add lesson bodies for Lesson 4
INSERT INTO lesson_bodies (lesson_id, body_json, qa_status)
SELECT l.id, jsonb_build_object(
  'title', 'الدرس 4: الأنشطة اليومية',
  'vocabulary', jsonb_build_array(
    jsonb_build_object('word', 'Wake up', 'arabic', 'استيقظ'),
    jsonb_build_object('word', 'Go to school', 'arabic', 'اذهب للمدرسة'),
    jsonb_build_object('word', 'Study', 'arabic', 'ادرس'),
    jsonb_build_object('word', 'Do homework', 'arabic', 'افعل الواجب'),
    jsonb_build_object('word', 'Go to bed', 'arabic', 'اذهب نم')
  ),
  'exercises', jsonb_build_array(
    jsonb_build_object('type', 'mc', 'question', 'What time do you go to school?', 'correct', 2),
    jsonb_build_object('type', 'fill', 'question', 'I ______ my homework', 'correct', 1)
  )
), 'approved'
FROM lessons l
WHERE l.title = 'الدرس 4: الأنشطة اليومية';

-- Step 8: Add lesson bodies for Lesson 5
INSERT INTO lesson_bodies (lesson_id, body_json, qa_status)
SELECT l.id, jsonb_build_object(
  'title', 'الدرس 5: الأرقام والوقت',
  'vocabulary', jsonb_build_array(
    jsonb_build_object('word', 'One', 'arabic', 'واحد'),
    jsonb_build_object('word', 'Two', 'arabic', 'اثنان'),
    jsonb_build_object('word', 'Three', 'arabic', 'ثلاثة'),
    jsonb_build_object('word', 'O''clock', 'arabic', 'الساعة'),
    jsonb_build_object('word', 'What time is it?', 'arabic', 'كم الساعة؟')
  ),
  'exercises', jsonb_build_array(
    jsonb_build_object('type', 'mc', 'question', 'How do you say 3 o''clock?', 'correct', 0),
    jsonb_build_object('type', 'fill', 'question', 'What ______ is it?', 'correct', 0)
  )
), 'approved'
FROM lessons l
WHERE l.title = 'الدرس 5: الأرقام والوقت';

-- Verify
SELECT COUNT(*) as total_lessons FROM lessons 
WHERE unit_id IN (
  SELECT u.id FROM units u
  JOIN tracks t ON u.track_id = t.id
  WHERE t.code = 'daily-life-basics'
  LIMIT 1
);

SELECT COUNT(*) as total_bodies FROM lesson_bodies 
WHERE lesson_id IN (
  SELECT l.id FROM lessons l
  WHERE l.title LIKE 'الدرس%'
);
