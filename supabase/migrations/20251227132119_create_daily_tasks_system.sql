/*
  # Create Daily Tasks System

  1. New Tables
    - `daily_tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `task_type` (text) - 'gratitude', 'meaning', 'prosocial'
      - `task_date` (date) - the date for this task
      - `completed` (boolean) - whether task is completed
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `task_questions`
      - `id` (uuid, primary key)
      - `task_type` (text) - 'gratitude', 'meaning', 'prosocial'
      - `question_text` (text)
      - `question_order` (integer)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
    
    - `daily_task_responses`
      - `id` (uuid, primary key)
      - `daily_task_id` (uuid, references daily_tasks)
      - `user_id` (uuid, references auth.users)
      - `task_type` (text)
      - `response_text` (text) - for essay responses
      - `response_value` (integer) - for multiple choice (1-5 scale)
      - `question_id` (uuid, references task_questions)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own tasks and responses
    - Task questions are readable by all authenticated users
*/

-- Create daily_tasks table
CREATE TABLE IF NOT EXISTS daily_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_type text NOT NULL CHECK (task_type IN ('gratitude', 'meaning', 'prosocial')),
  task_date date NOT NULL DEFAULT CURRENT_DATE,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, task_type, task_date)
);

-- Create task_questions table
CREATE TABLE IF NOT EXISTS task_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_type text NOT NULL CHECK (task_type IN ('gratitude', 'meaning', 'prosocial')),
  question_text text NOT NULL,
  question_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create daily_task_responses table
CREATE TABLE IF NOT EXISTS daily_task_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_task_id uuid REFERENCES daily_tasks(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_type text NOT NULL CHECK (task_type IN ('gratitude', 'meaning', 'prosocial')),
  response_text text,
  response_value integer CHECK (response_value >= 1 AND response_value <= 5),
  question_id uuid REFERENCES task_questions(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_date ON daily_tasks(user_id, task_date);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_type_date ON daily_tasks(user_id, task_type, task_date);
CREATE INDEX IF NOT EXISTS idx_task_questions_type ON task_questions(task_type, question_order);
CREATE INDEX IF NOT EXISTS idx_daily_task_responses_task ON daily_task_responses(daily_task_id);
CREATE INDEX IF NOT EXISTS idx_daily_task_responses_user ON daily_task_responses(user_id);

-- Enable RLS
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_task_responses ENABLE ROW LEVEL SECURITY;

-- Policies for daily_tasks
CREATE POLICY "Users can create own daily tasks"
  ON daily_tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own daily tasks"
  ON daily_tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own daily tasks"
  ON daily_tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily tasks"
  ON daily_tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for task_questions (all authenticated users can read)
CREATE POLICY "Authenticated users can read task questions"
  ON task_questions FOR SELECT
  TO authenticated
  USING (true);

-- Policies for daily_task_responses
CREATE POLICY "Users can create own responses"
  ON daily_task_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own responses"
  ON daily_task_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own responses"
  ON daily_task_responses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own responses"
  ON daily_task_responses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert default questions for each task type

-- Gratitude (Nhật ký Lòng Biết Ơn)
INSERT INTO task_questions (task_type, question_text, question_order, is_active) VALUES
  ('gratitude', 'Hôm nay, điều gì khiến bạn cảm thấy biết ơn nhất?', 1, true),
  ('gratitude', 'Viết về một người hoặc điều gì đó mà bạn trân trọng trong cuộc sống.', 2, true);

-- Meaning of Life (Ý Nghĩa Cuộc Sống)
INSERT INTO task_questions (task_type, question_text, question_order, is_active) VALUES
  ('meaning', 'Điều gì mang lại ý nghĩa cho cuộc sống của bạn ngày hôm nay?', 1, true),
  ('meaning', 'Mục tiêu nào của bạn đang tiến gần hơn đến?', 2, true);

-- Prosocial Behavior (Hành Vi Ủng Hộ Xã Hội) - Multiple choice questions
INSERT INTO task_questions (task_type, question_text, question_order, is_active) VALUES
  ('prosocial', 'Hôm nay tôi đã giúp đỡ người khác', 1, true),
  ('prosocial', 'Hôm nay tôi đã lắng nghe ai đó một cách chân thành', 2, true),
  ('prosocial', 'Hôm nay tôi đã chia sẻ điều gì đó với người khác', 3, true),
  ('prosocial', 'Hôm nay tôi đã thể hiện sự tử tế với người xung quanh', 4, true),
  ('prosocial', 'Hôm nay tôi đã làm việc gì đó có ích cho cộng đồng', 5, true);
