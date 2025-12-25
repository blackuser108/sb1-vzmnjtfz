/*
  # Create tutor knowledge table
  
  1. New Tables
    - `tutor_knowledge`
      - `id` (uuid, primary key)
      - `topic` (text) - the topic/section (e.g., "Lòng biết ơn", "Ý nghĩa cuộc sống")
      - `question` (text) - the question asked
      - `answer` (text) - the answer to the question
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `tutor_knowledge` table
    - Add policy for authenticated users to read all tutor knowledge
    - Add policy for authenticated users to create tutor knowledge
*/

CREATE TABLE IF NOT EXISTS tutor_knowledge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tutor_knowledge ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tutor knowledge"
  ON tutor_knowledge
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create knowledge"
  ON tutor_knowledge
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
