/*
  # Update Survey Questions from bang_hoi.txt

  1. Updates
    - Clear all existing survey questions
    - Insert exact questions from bang_hoi.txt document
    - Maintain correct question order and text
    
  2. Question Breakdown
    - Section X (Lòng biết ơn): 6 questions, scale 1-7
    - Section Y (Hành vi ủng hộ xã hội): 16 questions, scale 1-5
    - Section M (Ý nghĩa cuộc sống): 10 questions, scale 1-7
    - Total: 32 questions
    
  3. Changes
    - Questions now match exact wording from official survey document
    - All questions maintain original Vietnamese text without modification
*/

-- Clear existing questions
DELETE FROM survey_questions;

-- Insert Section X questions (GQ-6 scale)
INSERT INTO survey_questions (section_code, question_text, question_order) VALUES
  ('X', 'Tôi có rất nhiều điều trong cuộc sống để biết ơn.', 1),
  ('X', 'Nếu phải liệt kê tất cả những điều khiến tôi cảm thấy biết ơn, danh sách ấy hẳn sẽ rất dài.', 2),
  ('X', 'Khi nhìn ra thế giới, tôi không thấy có nhiều điều để biết ơn.', 3),
  ('X', 'Tôi biết ơn nhiều người trong cuộc sống.', 4),
  ('X', 'Càng lớn tuổi, tôi càng thấy bản thân biết trân trọng hơn những con người, sự kiện và hoàn cảnh đã là một phần trong lịch sử cuộc đời tôi.', 5),
  ('X', 'Phải mất một khoảng thời gian dài tôi mới cảm thấy biết ơn một ai đó hoặc một điều gì đó.', 6);

-- Insert Section Y questions (PSA scale)
INSERT INTO survey_questions (section_code, question_text, question_order) VALUES
  ('Y', 'Tôi vui vẻ giúp đỡ bạn bè/đồng nghiệp trong các hoạt động của họ.', 1),
  ('Y', 'Tôi chia sẻ những thứ tôi có với bạn bè.', 2),
  ('Y', 'Tôi cố gắng giúp đỡ người khác.', 3),
  ('Y', 'Tôi sẵn sàng tham gia các hoạt động tình nguyện để giúp những người cần hỗ trợ.', 4),
  ('Y', 'Tôi đồng cảm với những người đang gặp khó khăn.', 5),
  ('Y', 'Tôi giúp đỡ ngay lập tức những người cần hỗ trợ.', 6),
  ('Y', 'Tôi làm những gì có thể để giúp người khác tránh gặp rắc rối.', 7),
  ('Y', 'Tôi cảm nhận sâu sắc những gì người khác đang cảm thấy.', 8),
  ('Y', 'Tôi sẵn sàng chia sẻ kiến thức và khả năng của mình với người khác.', 9),
  ('Y', 'Tôi cố gắng an ủi những người đang buồn.', 10),
  ('Y', 'Tôi dễ dàng cho người khác mượn tiền hoặc những thứ khác.', 11),
  ('Y', 'Tôi dễ dàng đặt mình vào hoàn cảnh của những người đang cảm thấy không thoải mái/khó chịu.', 12),
  ('Y', 'Tôi cố gắng gần gũi và chăm sóc những người cần hỗ trợ.', 13),
  ('Y', 'Tôi dễ dàng chia sẻ với bạn bè bất kỳ cơ hội tốt nào đến với tôi.', 14),
  ('Y', 'Tôi dành thời gian cho những người bạn đang cảm thấy cô đơn.', 15),
  ('Y', 'Tôi nhận ra ngay lập tức sự khó chịu của bạn bè, ngay cả khi họ không trực tiếp nói ra.', 16);

-- Insert Section M questions (MLQ scale)
INSERT INTO survey_questions (section_code, question_text, question_order) VALUES
  ('M', 'Tôi đã hiểu ý nghĩa cuộc sống của tôi.', 1),
  ('M', 'Tôi đang tìm kiếm thứ khiến tôi cảm thấy cuộc sống của mình có ý nghĩa.', 2),
  ('M', 'Tôi luôn có kế hoạch tìm kiếm mục đích cho cuộc sống của mình.', 3),
  ('M', 'Cuộc sống của tôi có mục đích rõ ràng.', 4),
  ('M', 'Tôi hiểu rõ điều gì khiến cuộc sống của mình có ý nghĩa.', 5),
  ('M', 'Tôi đã tìm ra mục đích sống khiến tôi hài lòng.', 6),
  ('M', 'Tôi luôn tìm kiếm thứ khiến tôi cảm thấy cuộc sống của mình quan trọng.', 7),
  ('M', 'Tôi đang tìm kiếm một mục đích hay một sứ mệnh cho cuộc đời mình.', 8),
  ('M', 'Cuộc sống của tôi không có mục đích rõ ràng.', 9),
  ('M', 'Tôi đang tìm ý nghĩa cho cuộc sống của mình.', 10);
