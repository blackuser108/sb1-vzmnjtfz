/*
  # Tạo hệ thống khảo sát hành vi bầy đàn

  1. Bảng mới
    - `surveys` - Lưu thông tin các bài khảo sát
      - `id` (uuid, primary key)
      - `user_name` (text) - Tên người làm khảo sát
      - `user_age` (int) - Tuổi
      - `user_grade` (text) - Lớp
      - `user_school` (text) - Trường
      - `created_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `status` (text) - 'in_progress', 'completed'
    
    - `survey_responses` - Lưu câu trả lời
      - `id` (uuid, primary key)
      - `survey_id` (uuid, foreign key)
      - `question_id` (text)
      - `question_type` (text) - 'likert', 'multiple_choice', 'open_ended'
      - `answer` (jsonb) - Lưu câu trả lời dạng JSON
      - `created_at` (timestamptz)
    
    - `survey_results` - Lưu kết quả phân tích
      - `id` (uuid, primary key)
      - `survey_id` (uuid, foreign key)
      - `total_score` (int)
      - `risk_level` (text) - 'low', 'medium', 'high', 'critical'
      - `analysis` (jsonb) - Phân tích chi tiết
      - `recommendations` (text[]) - Các khuyến nghị
      - `created_at` (timestamptz)
    
    - `chat_history` - Lưu lịch sử chat với Gemini
      - `id` (uuid, primary key)
      - `session_id` (text)
      - `message` (text)
      - `role` (text) - 'user', 'assistant'
      - `created_at` (timestamptz)
    
    - `reviews` - Lưu đánh giá từ người dùng
      - `id` (uuid, primary key)
      - `name` (text)
      - `rating` (int)
      - `comment` (text)
      - `created_at` (timestamptz)

  2. Bảo mật
    - Cho phép mọi người đọc và ghi dữ liệu (public access cho mục đích giáo dục)
    - Bật RLS cho tất cả các bảng
*/

-- Tạo bảng surveys
CREATE TABLE IF NOT EXISTS surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  user_age int NOT NULL,
  user_grade text NOT NULL,
  user_school text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  status text DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed'))
);

-- Tạo bảng survey_responses
CREATE TABLE IF NOT EXISTS survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('likert', 'multiple_choice', 'open_ended')),
  answer jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Tạo bảng survey_results
CREATE TABLE IF NOT EXISTS survey_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  total_score int NOT NULL DEFAULT 0,
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  analysis jsonb NOT NULL DEFAULT '{}',
  recommendations text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Tạo bảng chat_history
CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  message text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at timestamptz DEFAULT now()
);

-- Tạo bảng reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Bật RLS
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Tạo policies cho public access (phù hợp với mục đích giáo dục)
CREATE POLICY "Anyone can insert surveys"
  ON surveys FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view surveys"
  ON surveys FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update surveys"
  ON surveys FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert responses"
  ON survey_responses FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view responses"
  ON survey_responses FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert results"
  ON survey_results FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view results"
  ON survey_results FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert chat"
  ON chat_history FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view chat"
  ON chat_history FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert reviews"
  ON reviews FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO anon
  USING (true);

-- Tạo index để tăng tốc truy vấn
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_results_survey_id ON survey_results(survey_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_session_id ON chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);