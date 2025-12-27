/*
  # Add 7-Day Cycle to Task Questions

  1. Changes
    - Add day_number column to task_questions (1-7 for gratitude and meaning, null for prosocial)
    - Remove old gratitude and meaning questions
    - Add all 7 days of questions from bot_asker.txt
    
  2. Structure
    - Each day (1-7) has unique questions for gratitude and meaning
    - Questions cycle every 7 days based on calculation from a fixed date
*/

-- Add day_number column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'task_questions' AND column_name = 'day_number'
  ) THEN
    ALTER TABLE task_questions ADD COLUMN day_number integer CHECK (day_number >= 1 AND day_number <= 7);
  END IF;
END $$;

-- Remove old gratitude and meaning questions
DELETE FROM task_questions WHERE task_type IN ('gratitude', 'meaning');

-- NGÀY 1
INSERT INTO task_questions (task_type, question_text, question_order, day_number, is_active) VALUES
  ('gratitude', 'Hôm nay, hãy viết ra 1–3 điều khiến bạn cảm thấy biết ơn.', 1, 1, true),
  ('gratitude', 'Trong những điều vừa viết, điều nào khiến bạn cảm thấy tích cực nhất?', 2, 1, true),
  ('gratitude', 'Khi nghĩ về những điều này, cảm xúc hiện tại của bạn thay đổi như thế nào?', 3, 1, true),
  ('meaning', 'Những điều bạn vừa trân trọng nói gì về điều gì là quan trọng với bạn?', 1, 1, true),
  ('meaning', 'Bạn có cảm thấy cuộc sống của mình có giá trị hơn khi nhận ra những điều này không?', 2, 1, true),
  ('meaning', 'Vì sao những điều nhỏ lại có thể ảnh hưởng đến cảm nhận ý nghĩa sống?', 3, 1, true);

-- NGÀY 2
INSERT INTO task_questions (task_type, question_text, question_order, day_number, is_active) VALUES
  ('gratitude', 'Hôm nay, có ai đó khiến bạn cảm thấy biết ơn không?', 1, 2, true),
  ('gratitude', 'Bạn biết ơn người đó vì điều gì?', 2, 2, true),
  ('gratitude', 'Cảm xúc của bạn thay đổi ra sao khi nghĩ về người này?', 3, 2, true),
  ('meaning', 'Những mối quan hệ như vậy có ý nghĩa gì với cuộc sống của bạn?', 1, 2, true),
  ('meaning', 'Bạn có cảm thấy mình được kết nối với người khác hơn không?', 2, 2, true),
  ('meaning', 'Sự kết nối này ảnh hưởng thế nào đến cảm nhận ý nghĩa sống?', 3, 2, true);

-- NGÀY 3
INSERT INTO task_questions (task_type, question_text, question_order, day_number, is_active) VALUES
  ('gratitude', 'Hôm nay, có điều gì ở chính bạn mà bạn cảm thấy trân trọng không?', 1, 3, true),
  ('gratitude', 'Đó là một nỗ lực hay cố gắng nào?', 2, 3, true),
  ('gratitude', 'Việc ghi nhận điều này khiến bạn cảm thấy thế nào?', 3, 3, true),
  ('meaning', 'Những nỗ lực này phản ánh giá trị nào của bạn?', 1, 3, true),
  ('meaning', 'Bạn có cảm thấy mình đang sống đúng với con người mình không?', 2, 3, true),
  ('meaning', 'Điều này ảnh hưởng thế nào đến cảm nhận ý nghĩa cuộc sống?', 3, 3, true);

-- NGÀY 4
INSERT INTO task_questions (task_type, question_text, question_order, day_number, is_active) VALUES
  ('gratitude', 'Trong vài ngày qua, có điều tích cực nào bạn bắt đầu chú ý nhiều hơn không?', 1, 4, true),
  ('gratitude', 'Điều đó khiến bạn nhìn cuộc sống khác đi như thế nào?', 2, 4, true),
  ('gratitude', 'Bạn có cảm thấy mình biết ơn nhiều hơn so với trước không?', 3, 4, true),
  ('meaning', 'Khi bạn chú ý đến điều tích cực, bạn có cảm thấy cuộc sống ý nghĩa hơn không?', 1, 4, true),
  ('meaning', 'Ý nghĩa đó đến từ đâu?', 2, 4, true),
  ('meaning', 'Bạn muốn duy trì cảm nhận này như thế nào?', 3, 4, true);

-- NGÀY 5
INSERT INTO task_questions (task_type, question_text, question_order, day_number, is_active) VALUES
  ('gratitude', 'Bạn có từng được ai đó giúp bằng một hành động nhỏ nhưng khiến bạn nhớ lâu không?', 1, 5, true),
  ('gratitude', 'Khi nhớ lại điều đó, bạn cảm thấy thế nào?', 2, 5, true),
  ('gratitude', 'Bạn có trân trọng những hành động như vậy hơn không?', 3, 5, true),
  ('meaning', 'Những hành động tử tế nhỏ nói gì về giá trị cuộc sống?', 1, 5, true),
  ('meaning', 'Bạn có nghĩ sống tử tế làm cuộc sống đáng sống hơn không?', 2, 5, true),
  ('meaning', 'Vì sao?', 3, 5, true);

-- NGÀY 6
INSERT INTO task_questions (task_type, question_text, question_order, day_number, is_active) VALUES
  ('gratitude', 'Hôm nay, khi giúp người khác, bạn có cảm thấy biết ơn cuộc sống của mình hơn không?', 1, 6, true),
  ('gratitude', 'Cảm xúc đó thể hiện như thế nào?', 2, 6, true),
  ('gratitude', 'Bạn có muốn trải nghiệm cảm xúc này nhiều hơn không?', 3, 6, true),
  ('meaning', 'Việc giúp người khác ảnh hưởng thế nào đến cảm nhận ý nghĩa sống của bạn?', 1, 6, true),
  ('meaning', 'Bạn có cảm thấy mình đang sống có ích hơn không?', 2, 6, true),
  ('meaning', 'Điều đó quan trọng với bạn ra sao?', 3, 6, true);

-- NGÀY 7
INSERT INTO task_questions (task_type, question_text, question_order, day_number, is_active) VALUES
  ('gratitude', 'Sau 7 ngày, bạn có cảm thấy mình dễ nhận ra điều tích cực hơn không?', 1, 7, true),
  ('gratitude', 'Bạn trân trọng điều gì nhiều hơn so với trước?', 2, 7, true),
  ('gratitude', 'Lòng biết ơn của bạn đã thay đổi như thế nào?', 3, 7, true),
  ('meaning', 'Cảm nhận của bạn về ý nghĩa cuộc sống có thay đổi không?', 1, 7, true),
  ('meaning', 'Điều gì góp phần lớn nhất vào sự thay đổi đó?', 2, 7, true),
  ('meaning', 'Bạn muốn duy trì cảm nhận này như thế nào?', 3, 7, true);

-- Create index for efficient day_number queries
CREATE INDEX IF NOT EXISTS idx_task_questions_day ON task_questions(task_type, day_number, question_order);
