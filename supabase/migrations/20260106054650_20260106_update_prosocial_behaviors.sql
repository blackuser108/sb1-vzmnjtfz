/*
  # Update Prosocial Behaviors to Match 15 Specific Actions

  1. Changes
    - Delete old prosocial questions (limited to 5 generic ones)
    - Add 15 specific prosocial behaviors as defined by user requirements
    - Each behavior is a checkbox question that users can select
  
  2. New Behaviors Added
    1. Chủ động hỏi thăm, quan tâm đến cảm xúc của người khác
    2. Lắng nghe người khác chia sẻ mà không phán xét
    3. Giúp đỡ ai đó một việc nhỏ (học tập, công việc, sinh hoạt)
    4. Hỗ trợ bạn bè/người thân khi họ gặp khó khăn
    5. Nói lời cảm ơn hoặc xin lỗi một cách chân thành
    6. Động viên, khích lệ người khác khi họ buồn hoặc nản chí
    7. Chia sẻ kiến thức, kinh nghiệm hoặc thông tin hữu ích
    8. Hợp tác, làm việc nhóm một cách tích cực
    9. Nhường nhịn, cư xử kiên nhẫn trong tình huống dễ căng thẳng
    10. Bảo vệ hoặc lên tiếng cho người yếu thế
    11. Tham gia hoặc ủng hộ hoạt động vì cộng đồng/tập thể
    12. Cư xử tử tế với người lạ
    13. Giúp người khác mà không mong nhận lại lợi ích
    14. Tránh gây tổn thương người khác bằng lời nói hoặc hành động
    15. Hôm nay tôi chưa thực hiện được hành động ủng hộ xã hội nào
*/

DELETE FROM task_questions 
WHERE task_type = 'prosocial' AND question_order > 0;

INSERT INTO task_questions (task_type, question_text, question_order, is_active) VALUES
  ('prosocial', 'Chủ động hỏi thăm, quan tâm đến cảm xúc của người khác', 1, true),
  ('prosocial', 'Lắng nghe người khác chia sẻ mà không phán xét', 2, true),
  ('prosocial', 'Giúp đỡ ai đó một việc nhỏ (học tập, công việc, sinh hoạt)', 3, true),
  ('prosocial', 'Hỗ trợ bạn bè/người thân khi họ gặp khó khăn', 4, true),
  ('prosocial', 'Nói lời cảm ơn hoặc xin lỗi một cách chân thành', 5, true),
  ('prosocial', 'Động viên, khích lệ người khác khi họ buồn hoặc nản chí', 6, true),
  ('prosocial', 'Chia sẻ kiến thức, kinh nghiệm hoặc thông tin hữu ích', 7, true),
  ('prosocial', 'Hợp tác, làm việc nhóm một cách tích cực', 8, true),
  ('prosocial', 'Nhường nhịn, cư xử kiên nhẫn trong tình huống dễ căng thẳng', 9, true),
  ('prosocial', 'Bảo vệ hoặc lên tiếng cho người yếu thế', 10, true),
  ('prosocial', 'Tham gia hoặc ủng hộ hoạt động vì cộng đồng/tập thể', 11, true),
  ('prosocial', 'Cư xử tử tế với người lạ', 12, true),
  ('prosocial', 'Giúp người khác mà không mong nhận lại lợi ích', 13, true),
  ('prosocial', 'Tránh gây tổn thương người khác bằng lời nói hoặc hành động', 14, true),
  ('prosocial', 'Hôm nay tôi chưa thực hiện được hành động ủng hộ xã hội nào', 15, true);
