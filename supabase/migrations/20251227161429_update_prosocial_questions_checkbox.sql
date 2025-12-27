/*
  # Update Prosocial Questions to Checkbox List

  1. Changes
    - Remove old prosocial questions
    - Add 14 new prosocial behavior questions as checkboxes
    - Questions are derived from bot_asker.txt file
    
  2. New Questions (Checkbox format)
    - 14 prosocial behavior items
    - Each can be checked/unchecked by users
    - Last item is "Hôm nay tôi chưa thực hiện được hành động ủng hộ xã hội nào"
*/

-- Remove old prosocial questions
DELETE FROM task_questions WHERE task_type = 'prosocial';

-- Add new prosocial behavior checkbox questions
INSERT INTO task_questions (task_type, question_text, question_order, is_active) VALUES
  ('prosocial', 'Chủ động hỏi thăm, quan tâm đến cảm xúc của người khác', 1, true),
  ('prosocial', 'Lắng nghe người khác chia sẻ mà không phán xét', 2, true),
  ('prosocial', 'Giúp đỡ ai đó một việc nhỏ (học tập, công việc, sinh hoạt)', 3, true),
  ('prosocial', 'Hỗ trợ bạn bè / người thân khi họ gặp khó khăn', 4, true),
  ('prosocial', 'Nói lời cảm ơn hoặc xin lỗi một cách chân thành', 5, true),
  ('prosocial', 'Động viên, khích lệ người khác khi họ buồn hoặc nản chí', 6, true),
  ('prosocial', 'Chia sẻ kiến thức, kinh nghiệm hoặc thông tin hữu ích', 7, true),
  ('prosocial', 'Hợp tác, làm việc nhóm một cách tích cực', 8, true),
  ('prosocial', 'Nhường nhịn, cư xử kiên nhẫn trong tình huống dễ căng thẳng', 9, true),
  ('prosocial', 'Bảo vệ hoặc lên tiếng cho người yếu thế', 10, true),
  ('prosocial', 'Tham gia hoặc ủng hộ hoạt động vì cộng đồng / tập thể', 11, true),
  ('prosocial', 'Cư xử tử tế với người lạ', 12, true),
  ('prosocial', 'Giúp người khác mà không mong nhận lại lợi ích', 13, true),
  ('prosocial', 'Tránh gây tổn thương người khác bằng lời nói hoặc hành động', 14, true),
  ('prosocial', 'Hôm nay tôi chưa thực hiện được hành động ủng hộ xã hội nào', 15, true);
