INSERT INTO languages (code, name)
VALUES
  ('en', 'English'),
  ('el', 'Greek')
ON CONFLICT (code) DO NOTHING;

INSERT INTO roles (code, name)
VALUES
  ('learner', 'Learner'),
  ('admin', 'Administrator')
ON CONFLICT (code) DO NOTHING;

INSERT INTO levels (language_id, cefr_level, sort_order)
SELECT l.id, v.cefr_level, v.sort_order
FROM languages l
JOIN (
  VALUES
    ('A1', 1), ('A2', 2), ('B1', 3), ('B2', 4), ('C1', 5), ('C2', 6)
) AS v(cefr_level, sort_order) ON TRUE
WHERE l.code IN ('en', 'el')
ON CONFLICT (language_id, cefr_level) DO NOTHING;

INSERT INTO tracks (language_id, code, name, sort_order)
SELECT l.id, t.code, t.name, t.sort_order
FROM languages l
JOIN (
  VALUES
    ('daily-life-basics', 'Daily Life Basics', 1),
    ('survival-phrases', 'Survival Phrases', 2),
    ('pronunciation-basics', 'Pronunciation Basics', 3),
    ('travel-core', 'Travel Core', 4),
    ('work-communication', 'Work Communication', 5),
    ('job-interview-simulation', 'Job Interview Simulation', 6),
    ('airport-simulation', 'Airport Simulation', 7)
) AS t(code, name, sort_order) ON TRUE
WHERE l.code IN ('en', 'el')
ON CONFLICT (language_id, code) DO NOTHING;

WITH en_a1 AS (
  SELECT lv.id AS level_id
  FROM levels lv
  JOIN languages l ON l.id = lv.language_id
  WHERE l.code = 'en' AND lv.cefr_level = 'A1'
), en_tracks AS (
  SELECT t.id, t.code
  FROM tracks t
  JOIN languages l ON l.id = t.language_id
  WHERE l.code = 'en'
)
INSERT INTO units (track_id, level_id, title, sort_order)
SELECT et.id, ea.level_id,
  CASE et.code
    WHEN 'daily-life-basics' THEN 'Greetings and Introductions'
    WHEN 'survival-phrases' THEN 'Essential Everyday Phrases'
    WHEN 'pronunciation-basics' THEN 'Core Sounds and Stress'
    WHEN 'travel-core' THEN 'Travel and Transportation Basics'
    WHEN 'work-communication' THEN 'Workplace Small Talk'
    WHEN 'job-interview-simulation' THEN 'Interview Foundations'
    WHEN 'airport-simulation' THEN 'Airport Check-in Flow'
    ELSE 'General Unit'
  END,
  1
FROM en_tracks et
CROSS JOIN en_a1 ea
WHERE NOT EXISTS (
  SELECT 1 FROM units u WHERE u.track_id = et.id AND u.level_id = ea.level_id
);

INSERT INTO lessons (unit_id, lesson_type, title, est_minutes, sort_order)
SELECT u.id, 'quiz', 'Quick Lesson 1', 5, 1
FROM units u
WHERE NOT EXISTS (
  SELECT 1 FROM lessons l WHERE l.unit_id = u.id AND l.sort_order = 1
);

INSERT INTO lessons (unit_id, lesson_type, title, est_minutes, sort_order)
SELECT u.id, 'listening', 'Listening Drill', 6, 2
FROM units u
WHERE NOT EXISTS (
  SELECT 1 FROM lessons l WHERE l.unit_id = u.id AND l.sort_order = 2
);

-- Expanded curriculum tracks to support A1-C2 pathways and realistic scenarios.
INSERT INTO tracks (language_id, code, name, sort_order)
SELECT l.id, t.code, t.name, t.sort_order
FROM languages l
JOIN (
  VALUES
    ('daily-conversations', 'Daily Conversations', 8),
    ('grammar-foundations', 'Grammar Foundations', 9),
    ('story-listening', 'Story Listening', 10),
    ('expanded-grammar', 'Expanded Grammar', 11),
    ('professional-dialogues', 'Professional Dialogues', 12),
    ('interview-prep', 'Interview Prep', 13),
    ('fluency-drills', 'Fluency Drills', 14),
    ('argumentation', 'Argumentation', 15),
    ('academic-reading', 'Academic Reading', 16),
    ('advanced-speaking', 'Advanced Speaking', 17),
    ('native-like-precision', 'Native-like Precision', 18),
    ('domain-specialization', 'Domain Specialization', 19),
    ('high-stakes-speaking', 'High-stakes Speaking', 20),
    ('hotel-simulation', 'Hotel Simulation', 21),
    ('emergency-travel', 'Emergency Travel', 22),
    ('meeting-simulation', 'Meeting Simulation', 23),
    ('email-writing', 'Email Writing', 24),
    ('lecture-notes', 'Lecture Notes', 25),
    ('exam-speaking', 'Exam Speaking', 26),
    ('academic-writing', 'Academic Writing', 27),
    ('immigration-interview', 'Immigration Interview', 28),
    ('healthcare-visit', 'Healthcare Visit', 29),
    ('housing-utilities', 'Housing and Utilities', 30),
    ('shopping-simulation', 'Shopping Simulation', 31),
    ('restaurant-simulation', 'Restaurant Simulation', 32),
    ('daily-routines', 'Daily Routines', 33)
) AS t(code, name, sort_order) ON TRUE
WHERE l.code IN ('en', 'el')
ON CONFLICT (language_id, code) DO NOTHING;

WITH unit_seed(language_code, cefr_level, track_code, title, sort_order) AS (
  VALUES
    ('en', 'A1', 'daily-life-basics', 'Everyday Introductions and Family Life', 10),
    ('en', 'A1', 'travel-core', 'Airport Check-in and Boarding Basics', 11),
    ('en', 'A2', 'hotel-simulation', 'Hotel Check-in, Requests, and Complaints', 12),
    ('en', 'A2', 'work-communication', 'Task Updates and Professional Messaging', 13),
    ('en', 'B1', 'meeting-simulation', 'Weekly Meetings and Action Items', 14),
    ('en', 'B1', 'housing-utilities', 'Rent, Bills, and Maintenance Requests', 15),
    ('en', 'B1', 'immigration-interview', 'Residency Interview Preparation', 16),
    ('en', 'B2', 'job-interview-simulation', 'Behavioral Interview and STAR Answers', 17),
    ('en', 'B2', 'emergency-travel', 'Travel Disruptions and Emergency Help', 18),
    ('en', 'C1', 'argumentation', 'Policy Debate and Evidence-based Arguments', 19),
    ('en', 'C1', 'healthcare-visit', 'Healthcare Navigation and Insurance Calls', 20),
    ('en', 'C2', 'high-stakes-speaking', 'Executive Negotiation and Public Briefings', 21),
    ('en', 'C2', 'domain-specialization', 'Domain Terminology for Career Growth', 22),
    ('el', 'A1', 'daily-life-basics', 'Greek Alphabet, Greetings, and Daily Needs', 10),
    ('el', 'A1', 'travel-core', 'Greek Airport and Ferry Basics', 11),
    ('el', 'A2', 'restaurant-simulation', 'Ordering Food and Handling Mistakes', 12),
    ('el', 'A2', 'work-communication', 'Workplace Courtesy and Simple Reports', 13),
    ('el', 'B1', 'meeting-simulation', 'Team Meetings in Greek', 14),
    ('el', 'B1', 'immigration-interview', 'Public Services and Residency Steps', 15),
    ('el', 'B2', 'job-interview-simulation', 'Greek Job Interview Practice', 16),
    ('el', 'B2', 'healthcare-visit', 'Clinic Visits and Pharmacy Dialogue', 17),
    ('el', 'C1', 'argumentation', 'Structured Debate in Greek', 18),
    ('el', 'C1', 'housing-utilities', 'Rental Contracts and Utility Calls', 19),
    ('el', 'C2', 'high-stakes-speaking', 'Formal Presentations and Negotiation', 20),
    ('el', 'C2', 'domain-specialization', 'Professional Greek for Specialized Fields', 21)
)
INSERT INTO units (track_id, level_id, title, sort_order)
SELECT t.id, lv.id, s.title, s.sort_order
FROM unit_seed s
JOIN languages lang ON lang.code = s.language_code
JOIN levels lv ON lv.language_id = lang.id AND lv.cefr_level = s.cefr_level
JOIN tracks t ON t.language_id = lang.id AND t.code = s.track_code
WHERE NOT EXISTS (
  SELECT 1
  FROM units u
  WHERE u.track_id = t.id
    AND u.level_id = lv.id
    AND u.title = s.title
);

-- Upgrade placeholder lesson names to production-quality naming.
UPDATE lessons
SET title = 'Scenario Vocabulary Builder'
WHERE title = 'Quick Lesson 1';

UPDATE lessons
SET title = 'Guided Dialogue Listening'
WHERE title = 'Listening Drill';

UPDATE lessons
SET title = 'Guided Roleplay Speaking'
WHERE title = 'Speaking Drill';

-- Ensure all units have a richer 4-lesson microlearning arc.
WITH unit_pool AS (
  SELECT u.id, lv.cefr_level
  FROM units u
  JOIN levels lv ON lv.id = u.level_id
)
INSERT INTO lessons (unit_id, lesson_type, title, est_minutes, sort_order)
SELECT up.id, 'vocabulary', 'Scenario Vocabulary Builder', 5, 1
FROM unit_pool up
WHERE NOT EXISTS (
  SELECT 1 FROM lessons l WHERE l.unit_id = up.id AND l.sort_order = 1
);

WITH unit_pool AS (
  SELECT u.id, lv.cefr_level
  FROM units u
  JOIN levels lv ON lv.id = u.level_id
)
INSERT INTO lessons (unit_id, lesson_type, title, est_minutes, sort_order)
SELECT up.id, 'listening', 'Guided Dialogue Listening', 6, 2
FROM unit_pool up
WHERE NOT EXISTS (
  SELECT 1 FROM lessons l WHERE l.unit_id = up.id AND l.sort_order = 2
);

WITH unit_pool AS (
  SELECT u.id, lv.cefr_level
  FROM units u
  JOIN levels lv ON lv.id = u.level_id
)
INSERT INTO lessons (unit_id, lesson_type, title, est_minutes, sort_order)
SELECT
  up.id,
  CASE WHEN up.cefr_level IN ('A1', 'A2') THEN 'speaking' ELSE 'writing' END,
  CASE WHEN up.cefr_level IN ('A1', 'A2') THEN 'Guided Roleplay Speaking' ELSE 'Scenario Production Task' END,
  CASE WHEN up.cefr_level IN ('A1', 'A2') THEN 7 ELSE 8 END,
  3
FROM unit_pool up
WHERE NOT EXISTS (
  SELECT 1 FROM lessons l WHERE l.unit_id = up.id AND l.sort_order = 3
);

WITH unit_pool AS (
  SELECT u.id, lv.cefr_level
  FROM units u
  JOIN levels lv ON lv.id = u.level_id
)
INSERT INTO lessons (unit_id, lesson_type, title, est_minutes, sort_order)
SELECT
  up.id,
  CASE WHEN up.cefr_level IN ('A1', 'A2') THEN 'pronunciation' ELSE 'grammar' END,
  CASE WHEN up.cefr_level IN ('A1', 'A2') THEN 'Pronunciation and Stress Coaching' ELSE 'Grammar and Style Refinement' END,
  7,
  4
FROM unit_pool up
WHERE NOT EXISTS (
  SELECT 1 FROM lessons l WHERE l.unit_id = up.id AND l.sort_order = 4
);

WITH en_lang AS (
  SELECT id FROM languages WHERE code = 'en'
), inserted_test AS (
  INSERT INTO placement_tests (language_id, title, version, total_questions, is_active)
  SELECT el.id, 'English Placement Test v1', 1, 5, TRUE
  FROM en_lang el
  WHERE NOT EXISTS (
    SELECT 1 FROM placement_tests pt WHERE pt.language_id = el.id AND pt.version = 1
  )
  RETURNING id
), current_test AS (
  SELECT id FROM inserted_test
  UNION
  SELECT pt.id FROM placement_tests pt JOIN en_lang el ON pt.language_id = el.id WHERE pt.version = 1
  LIMIT 1
), q AS (
  INSERT INTO placement_questions (test_id, prompt, sort_order)
  SELECT ct.id, v.prompt, v.sort_order
  FROM current_test ct
  JOIN (
    VALUES
      ('Choose the correct sentence: "He ___ to school every day."', 1),
      ('Pick the correct greeting for morning time.', 2),
      ('Choose the best travel question at the airport.', 3),
      ('Select the correct past tense sentence.', 4),
      ('Pick the polite request.', 5)
  ) AS v(prompt, sort_order) ON TRUE
  WHERE NOT EXISTS (
    SELECT 1 FROM placement_questions pq WHERE pq.test_id = ct.id
  )
  RETURNING id, test_id, sort_order
), q_current AS (
  SELECT id, test_id, sort_order FROM q
  UNION
  SELECT pq.id, pq.test_id, pq.sort_order
  FROM placement_questions pq
  JOIN current_test ct ON ct.id = pq.test_id
)
INSERT INTO placement_options (test_id, question_id, option_text, is_correct, sort_order)
SELECT qc.test_id, qc.id, o.option_text, o.is_correct, o.sort_order
FROM q_current qc
JOIN (
  VALUES
    (1, 'go', TRUE, 1),
    (1, 'going', FALSE, 2),
    (1, 'gone', FALSE, 3),
    (2, 'Good morning', TRUE, 1),
    (2, 'Good night', FALSE, 2),
    (2, 'Bye yesterday', FALSE, 3),
    (3, 'Where is gate B12?', TRUE, 1),
    (3, 'I am gate B12', FALSE, 2),
    (3, 'Gate B12 eat now', FALSE, 3),
    (4, 'She visited Athens last year.', TRUE, 1),
    (4, 'She visit Athens last year.', FALSE, 2),
    (4, 'She visiting Athens last year.', FALSE, 3),
    (5, 'Could you help me, please?', TRUE, 1),
    (5, 'Help me now.', FALSE, 2),
    (5, 'You help me.', FALSE, 3)
) AS o(question_sort_order, option_text, is_correct, sort_order)
  ON o.question_sort_order = qc.sort_order
WHERE NOT EXISTS (
  SELECT 1 FROM placement_options po WHERE po.question_id = qc.id
);

INSERT INTO plans (code, name, billing_cycle, price_usd, features_json)
VALUES
  (
    'free',
    'Free',
    'monthly',
    0,
    '{"ads": true, "ai_tutor_messages_per_day": 5, "certificates": false}'::jsonb
  ),
  (
    'pro_monthly',
    'Pro Monthly',
    'monthly',
    8.99,
    '{"ads": false, "ai_tutor_messages_per_day": 200, "certificates": true}'::jsonb
  ),
  (
    'pro_yearly',
    'Pro Yearly',
    'yearly',
    69.99,
    '{"ads": false, "ai_tutor_messages_per_day": 300, "certificates": true}'::jsonb
  )
ON CONFLICT (code) DO NOTHING;

INSERT INTO lesson_bodies (lesson_id, body_json, qa_status, qa_notes, updated_at)
SELECT
  ls.id,
  jsonb_build_object(
    'languageCode', lang.code,
    'cefrLevel', lv.cefr_level,
    'trackCode', t.code,
    'unitTitle', u.title,
    'lessonTitle', ls.title,
    'lessonType', ls.lesson_type,
    'scenario', CASE
      WHEN t.code LIKE '%travel%' OR t.code IN ('airport-simulation', 'hotel-simulation', 'emergency-travel') THEN 'travel'
      WHEN t.code LIKE '%work%' OR t.code LIKE '%interview%' OR t.code = 'meeting-simulation' THEN 'work'
      WHEN t.code LIKE '%immigration%' OR t.code IN ('housing-utilities', 'healthcare-visit') THEN 'migration'
      ELSE 'daily'
    END,
    'dialogue', jsonb_build_array(
      jsonb_build_object('speaker', 'Learner', 'text', 'Hello, I need help with this situation.'),
      jsonb_build_object('speaker', 'Tutor', 'text', 'Sure. Tell me your goal in this scenario.'),
      jsonb_build_object('speaker', 'Learner', 'text', 'I want to communicate clearly and politely.'),
      jsonb_build_object('speaker', 'Tutor', 'text', 'Great. Let us practice with a realistic exchange.')
    ),
    'vocabulary', jsonb_build_array(
      jsonb_build_object('word', 'appointment', 'meaningAr', 'موعد', 'example', 'I have an appointment at 10.'),
      jsonb_build_object('word', 'boarding pass', 'meaningAr', 'بطاقة صعود الطائرة', 'example', 'Please show your boarding pass.'),
      jsonb_build_object('word', 'deadline', 'meaningAr', 'موعد نهائي', 'example', 'The deadline is next Friday.'),
      jsonb_build_object('word', 'residence permit', 'meaningAr', 'تصريح إقامة', 'example', 'I am applying for a residence permit.')
    ),
    'exercises', jsonb_build_array(
      jsonb_build_object(
        'type', 'fill_blank',
        'prompt', 'Complete: Could you ____ me with this form?',
        'choices', jsonb_build_array('help', 'helps', 'helping'),
        'answer', 'help'
      ),
      jsonb_build_object(
        'type', 'reorder',
        'prompt', 'Reorder: please / I / gate / where / is / ask / can / the',
        'answer', 'Can I ask where the gate is, please?'
      ),
      jsonb_build_object(
        'type', 'roleplay',
        'prompt', 'Say one polite sentence to solve the scenario in less than 12 words.',
        'sampleAnswer', 'Could you guide me to the correct office, please?'
      )
    ),
    'modelAnswers', jsonb_build_array(
      'Could you help me with this request, please?',
      'I would like to confirm the next step before I proceed.',
      'Thank you for your time and clear instructions.'
    ),
    'grammarFocus', CASE
      WHEN lv.cefr_level IN ('A1', 'A2') THEN 'Present simple, polite requests, basic word order'
      WHEN lv.cefr_level IN ('B1', 'B2') THEN 'Past/future forms, conditionals, linking ideas'
      ELSE 'Nuanced register, advanced connectors, precision and tone'
    END,
    'pronunciationTipsAr', jsonb_build_array(
      'ركز على نطق نهايات الكلمات بوضوح.',
      'خفف السرعة عند الجمل الطويلة.',
      'استخدم نبرة مهذبة في الطلبات الرسمية.'
    ),
    'teacherNotesAr', 'محتوى معتمد تربويًا: ابدأ بالمفردات ثم الحوار ثم الإنتاج الحر.',
    'estimatedOutcomeAr', 'بنهاية الدرس يستطيع المتعلم التعامل مع موقف واقعي بثقة أكبر.'
  )::jsonb,
  'approved',
  'Seeded production-ready lesson body with dialogue, exercises, and model answers.',
  NOW()
FROM lessons ls
JOIN units u ON u.id = ls.unit_id
JOIN levels lv ON lv.id = u.level_id
JOIN tracks t ON t.id = u.track_id
JOIN languages lang ON lang.id = t.language_id
ON CONFLICT (lesson_id)
DO UPDATE SET
  body_json = EXCLUDED.body_json,
  qa_status = EXCLUDED.qa_status,
  qa_notes = EXCLUDED.qa_notes,
  updated_at = NOW();
