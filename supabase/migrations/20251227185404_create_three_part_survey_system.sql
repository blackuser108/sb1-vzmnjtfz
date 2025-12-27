/*
  # Create Three-Part Survey System

  1. New Structure
    - Drop old survey tables
    - Create new survey_sections table for X, Y, M sections
    - Create new survey_questions table with section assignment
    - Create new survey_responses table with X, Y, M scores
    
  2. Survey Sections
    - X: Lòng biết ơn (Gratitude) - Scale 1-7
    - Y: Hành vi ủng hộ xã hội (Prosocial Behavior) - Scale 1-5
    - M: Ý nghĩa cuộc sống (Meaning in Life) - Scale 1-7
    
  3. Score Levels (based on image)
    X & M (1-7 scale):
    - Rất cao: 5.81-7.00
    - Cao: 4.61-5.80
    - Trung bình: 3.41-4.60
    - Thấp: 2.21-3.40
    - Rất thấp: 1.00-2.20
    
    Y (1-5 scale):
    - Rất cao: 4.21-5.00
    - Cao: 3.41-4.20
    - Trung bình: 2.61-3.40
    - Thấp: 1.81-2.60
    - Rất thấp: 1.00-1.80
    
  4. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Drop old tables
DROP TABLE IF EXISTS survey_responses CASCADE;
DROP TABLE IF EXISTS surveys CASCADE;

-- Create survey_sections table
CREATE TABLE IF NOT EXISTS survey_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL CHECK (code IN ('X', 'Y', 'M')),
  name text NOT NULL,
  description text,
  scale_min integer NOT NULL,
  scale_max integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE survey_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read survey sections"
  ON survey_sections FOR SELECT
  TO public
  USING (true);

-- Create survey_questions table
CREATE TABLE IF NOT EXISTS survey_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_code text NOT NULL REFERENCES survey_sections(code),
  question_text text NOT NULL,
  question_order integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active survey questions"
  ON survey_questions FOR SELECT
  TO public
  USING (is_active = true);

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  x_score decimal(3,2),
  y_score decimal(3,2),
  m_score decimal(3,2),
  x_level text,
  y_level text,
  m_level text,
  answers jsonb NOT NULL,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own survey responses"
  ON survey_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own survey responses"
  ON survey_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert survey sections
INSERT INTO survey_sections (code, name, description, scale_min, scale_max) VALUES
  ('X', 'Lòng biết ơn', 'Đo lường mức độ biết ơn và trân trọng trong cuộc sống', 1, 7),
  ('Y', 'Hành vi ủng hộ xã hội', 'Đo lường hành vi giúp đỡ và đóng góp cho cộng đồng', 1, 5),
  ('M', 'Ý nghĩa cuộc sống', 'Đo lường cảm nhận về ý nghĩa và mục đích sống', 1, 7);

-- Insert survey questions for Section X (Lòng biết ơn) - 6 questions
INSERT INTO survey_questions (section_code, question_text, question_order) VALUES
  ('X', 'Tôi có nhiều điều trong cuộc sống để biết ơn.', 1),
  ('X', 'Nếu tôi liệt kê mọi thứ tôi biết ơn, đó sẽ là một danh sách rất dài.', 2),
  ('X', 'Khi nhìn vào thế giới, tôi không thấy có nhiều điều để biết ơn.', 3),
  ('X', 'Tôi biết ơn rất nhiều người khác nhau.', 4),
  ('X', 'Khi tôi lớn tuổi hơn, tôi càng trân trọng những người, sự kiện và tình huống đã là một phần trong lịch sử cuộc đời tôi.', 5),
  ('X', 'Thời gian dài có thể trôi qua trước khi tôi cảm thấy biết ơn về điều gì đó hoặc ai đó.', 6);

-- Insert survey questions for Section Y (Hành vi ủng hộ xã hội) - 16 questions
INSERT INTO survey_questions (section_code, question_text, question_order) VALUES
  ('Y', 'Tôi có thể giúp đỡ ai đó đang gặp khó khăn.', 1),
  ('Y', 'Tôi có thể giúp đỡ ai đó không quen biết.', 2),
  ('Y', 'Tôi có thể chia sẻ đồ ăn với người khác.', 3),
  ('Y', 'Tôi có thể giúp đỡ người khác ngay cả khi không dễ dàng với tôi.', 4),
  ('Y', 'Tôi có thể cho một người đi nhờ xe.', 5),
  ('Y', 'Tôi có thể giúp đẩy chiếc xe bị hỏng của người lạ.', 6),
  ('Y', 'Tôi có thể cho tiền từ thiện.', 7),
  ('Y', 'Tôi có thể quyên góp hàng hóa hoặc quần áo cho tổ chức từ thiện.', 8),
  ('Y', 'Tôi có thể làm công việc tình nguyện cho tổ chức từ thiện.', 9),
  ('Y', 'Tôi có thể giúp đỡ ai đó mang hàng nặng.', 10),
  ('Y', 'Tôi có thể cho người khác biết đường đi.', 11),
  ('Y', 'Tôi có thể để người khác sử dụng điện thoại của tôi trong trường hợp khẩn cấp.', 12),
  ('Y', 'Tôi có thể giúp đỡ một người bạn trong việc học.', 13),
  ('Y', 'Tôi có thể giúp đỡ bạn bè với công việc của họ.', 14),
  ('Y', 'Tôi có thể chia sẻ kiến thức với người khác.', 15),
  ('Y', 'Tôi có thể cố gắng giúp đỡ người khác.', 16);

-- Insert survey questions for Section M (Ý nghĩa cuộc sống) - 10 questions
INSERT INTO survey_questions (section_code, question_text, question_order) VALUES
  ('M', 'Tôi hiểu rõ mục đích của cuộc sống tôi.', 1),
  ('M', 'Tôi đang tìm kiếm điều gì đó khiến cuộc sống tôi có ý nghĩa.', 2),
  ('M', 'Tôi luôn tìm kiếm điều gì đó khiến cuộc sống tôi trở nên có ý nghĩa.', 3),
  ('M', 'Cuộc sống của tôi có một mục đích rõ ràng.', 4),
  ('M', 'Tôi có một triết lý sống rõ ràng.', 5),
  ('M', 'Tôi đã khám phá ra một mục đích cuộc sống thỏa mãn.', 6),
  ('M', 'Tôi luôn tìm kiếm mục đích hoặc sứ mệnh của cuộc đời tôi.', 7),
  ('M', 'Cuộc sống của tôi không có mục đích hoặc ý nghĩa rõ ràng.', 8),
  ('M', 'Tôi đang tìm kiếm ý nghĩa trong cuộc sống của tôi.', 9),
  ('M', 'Tôi đã tìm thấy một mục đích cuộc sống đáng thỏa mãn.', 10);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_survey_questions_section ON survey_questions(section_code, question_order);
CREATE INDEX IF NOT EXISTS idx_survey_responses_user ON survey_responses(user_id, created_at DESC);
