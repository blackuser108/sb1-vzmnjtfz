/*
  # Create Daily Scores Table

  1. New Tables
    - `daily_scores`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `task_date` (date)
      - `gratitude_score` (integer 1-7, AI-scored)
      - `life_meaning_score` (integer 1-7, AI-scored)
      - `prosocial_behavior` (text, most selected behavior)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `daily_scores` table
    - Add policy for users to read their own scores
    - Add policy for users to insert/update their own scores
*/

CREATE TABLE IF NOT EXISTS daily_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_date date NOT NULL DEFAULT CURRENT_DATE,
  gratitude_score integer CHECK (gratitude_score >= 1 AND gratitude_score <= 7),
  life_meaning_score integer CHECK (life_meaning_score >= 1 AND life_meaning_score <= 7),
  prosocial_behavior text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, task_date)
);

ALTER TABLE daily_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own daily scores"
  ON daily_scores FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily scores"
  ON daily_scores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily scores"
  ON daily_scores FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_daily_scores_user_date ON daily_scores(user_id, task_date DESC);
