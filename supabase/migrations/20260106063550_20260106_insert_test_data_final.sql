/*
  # Insert Test Data - Complete User Workflow Final

  1. Test Account Setup
    - Creates test data for a complete 7-day workflow
    - Daily tasks completed for all 7 days
    - Multiple surveys completed throughout the period
    - Daily scores calculated from task responses
  
  2. Test Data Timeline
    - Account created: 2025-12-14
    - Daily tasks and surveys: 2025-12-14 to 2025-12-20 (7 days)
  
  3. Test User
    - Uses existing user: tanphat312016@gmail.com
    - ID: 4b32bcd3-a226-4a11-99a3-883fd2820bcb
*/

-- Delete existing test data first to avoid conflicts
DELETE FROM daily_scores WHERE user_id = '4b32bcd3-a226-4a11-99a3-883fd2820bcb' AND task_date BETWEEN '2025-12-14' AND '2025-12-20';
DELETE FROM daily_task_responses WHERE user_id = '4b32bcd3-a226-4a11-99a3-883fd2820bcb' AND created_at::date BETWEEN '2025-12-14' AND '2025-12-20';
DELETE FROM daily_tasks WHERE user_id = '4b32bcd3-a226-4a11-99a3-883fd2820bcb' AND task_date BETWEEN '2025-12-14' AND '2025-12-20';
DELETE FROM survey_responses WHERE user_id = '4b32bcd3-a226-4a11-99a3-883fd2820bcb' AND created_at::date BETWEEN '2025-12-14' AND '2025-12-21';

-- Insert test daily tasks (3 tasks per day for 7 days)
WITH task_dates AS (
  SELECT DATE '2025-12-14' + (n - 1) as task_date
  FROM generate_series(1, 7) n
)
INSERT INTO daily_tasks (user_id, task_type, task_date, completed, created_at, updated_at)
SELECT 
  '4b32bcd3-a226-4a11-99a3-883fd2820bcb'::uuid,
  task_type,
  td.task_date,
  true,
  td.task_date::timestamp + INTERVAL '08:00',
  td.task_date::timestamp + INTERVAL '18:00'
FROM task_dates td
CROSS JOIN (SELECT 'gratitude' as task_type UNION SELECT 'meaning' UNION SELECT 'prosocial') tt;

-- Insert test daily task responses for gratitude
WITH gratitude_tasks AS (
  SELECT 
    dt.id as daily_task_id,
    dt.user_id,
    dt.task_date,
    tq.id as question_id,
    'Tôi biết ơn gia đình vì luôn hỗ trợ tôi. Hôm nay, bố mẹ đã giúp tôi giải quyết vấn đề công việc, họ luôn lắng nghe và cho lời khuyên tốt. Điều này làm tôi cảm thấy không đơn độc và có động lực tiếp tục cố gắng.' as response_text
  FROM daily_tasks dt
  JOIN task_questions tq ON tq.task_type = 'gratitude' AND tq.is_active = true AND tq.day_number = ((EXTRACT(DAY FROM dt.task_date)::int - 14) % 7 + 1)
  WHERE dt.user_id = '4b32bcd3-a226-4a11-99a3-883fd2820bcb'
  AND dt.task_type = 'gratitude'
  AND dt.task_date BETWEEN '2025-12-14' AND '2025-12-20'
)
INSERT INTO daily_task_responses (daily_task_id, user_id, task_type, question_id, response_text, created_at)
SELECT 
  daily_task_id,
  user_id,
  'gratitude',
  question_id,
  response_text,
  task_date::timestamp + INTERVAL '08:30'
FROM gratitude_tasks;

-- Insert test daily task responses for meaning
WITH meaning_tasks AS (
  SELECT 
    dt.id as daily_task_id,
    dt.user_id,
    dt.task_date,
    tq.id as question_id,
    'Ý nghĩa cuộc sống của tôi là giúp đỡ người khác và phát triển bản thân. Hôm nay tôi nhận ra rằng mỗi hành động nhỏ đều có tác động, khi tôi giúp đỡ một đồng nghiệp, họ cảm thấy tự tin hơn. Điều đó cho tôi cảm giác cuộc sống thật ý nghĩa và đáng sống.' as response_text
  FROM daily_tasks dt
  JOIN task_questions tq ON tq.task_type = 'meaning' AND tq.is_active = true AND tq.day_number = ((EXTRACT(DAY FROM dt.task_date)::int - 14) % 7 + 1)
  WHERE dt.user_id = '4b32bcd3-a226-4a11-99a3-883fd2820bcb'
  AND dt.task_type = 'meaning'
  AND dt.task_date BETWEEN '2025-12-14' AND '2025-12-20'
)
INSERT INTO daily_task_responses (daily_task_id, user_id, task_type, question_id, response_text, created_at)
SELECT 
  daily_task_id,
  user_id,
  'meaning',
  question_id,
  response_text,
  task_date::timestamp + INTERVAL '09:00'
FROM meaning_tasks;

-- Insert test daily task responses for prosocial - only selected behaviors
WITH prosocial_tasks AS (
  SELECT 
    dt.id as daily_task_id,
    dt.user_id,
    dt.task_date,
    tq.id as question_id,
    tq.question_text
  FROM daily_tasks dt
  JOIN task_questions tq ON tq.task_type = 'prosocial' AND tq.is_active = true
  WHERE dt.user_id = '4b32bcd3-a226-4a11-99a3-883fd2820bcb'
  AND dt.task_type = 'prosocial'
  AND dt.task_date BETWEEN '2025-12-14' AND '2025-12-20'
  AND (tq.question_text LIKE '%lắng nghe%' OR tq.question_text LIKE '%giúp%' OR tq.question_text LIKE '%chia sẻ%')
)
INSERT INTO daily_task_responses (daily_task_id, user_id, task_type, question_id, response_text, response_value, created_at)
SELECT 
  daily_task_id,
  user_id,
  'prosocial',
  question_id,
  question_text,
  1,
  task_date::timestamp + INTERVAL '09:15'
FROM prosocial_tasks;

-- Insert daily scores
INSERT INTO daily_scores (user_id, task_date, gratitude_score, life_meaning_score, prosocial_behavior, created_at, updated_at)
SELECT 
  '4b32bcd3-a226-4a11-99a3-883fd2820bcb'::uuid,
  DATE '2025-12-14' + (n - 1),
  5.5 + (n::int % 3 * 0.5),
  5.0 + (n::int % 4 * 0.25),
  'Lắng nghe lời khuyên | Giúp đỡ người khác | Chia sẻ kinh nghiệm | Khuyến khích đồng nghiệp',
  (DATE '2025-12-14' + (n - 1))::timestamp + INTERVAL '18:00',
  (DATE '2025-12-14' + (n - 1))::timestamp + INTERVAL '18:00'
FROM generate_series(1, 7) n
ON CONFLICT (user_id, task_date) DO NOTHING;

-- Insert multiple survey responses with answers jsonb
INSERT INTO survey_responses (user_id, created_at, completed_at, x_score, y_score, m_score, x_level, y_level, m_level, answers)
VALUES 
  (
    '4b32bcd3-a226-4a11-99a3-883fd2820bcb'::uuid, 
    '2025-12-14 10:00:00'::timestamp, 
    '2025-12-14 10:30:00'::timestamp, 
    6.2, 4.8, 6.0, 'Cao', 'Cao', 'Cao',
    '{"day1": "Biết ơn gia đình", "day2": "Giúp đỡ bạn", "day3": "Chia sẻ kinh nghiệm"}'::jsonb
  ),
  (
    '4b32bcd3-a226-4a11-99a3-883fd2820bcb'::uuid, 
    '2025-12-17 14:00:00'::timestamp, 
    '2025-12-17 14:30:00'::timestamp, 
    6.5, 4.9, 6.2, 'Cao', 'Cao', 'Cao',
    '{"day4": "Lắng nghe", "day5": "Hỗ trợ đồng nghiệp", "day6": "Khuyến khích"}'::jsonb
  ),
  (
    '4b32bcd3-a226-4a11-99a3-883fd2820bcb'::uuid, 
    '2025-12-21 11:00:00'::timestamp, 
    '2025-12-21 11:30:00'::timestamp, 
    6.8, 5.0, 6.5, 'Rất cao', 'Cao', 'Cao',
    '{"day7": "Tiếp tục phát triển", "summary": "Tuần tuyệt vời"}'::jsonb
  )
ON CONFLICT DO NOTHING;
