/*
  # Create knowledge base table for theoretical content
  
  1. New Tables
    - `knowledge_base`
      - `id` (uuid, primary key)
      - `title` (text) - Title of the knowledge section
      - `content` (text) - Full content of the knowledge section
      - `category` (text) - Category (e.g., "lòng biết ơn", "hành vi ủng hộ xã hội", "ý nghĩa cuộc sống")
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `knowledge_base` table
    - Add policy for anyone to read knowledge base content
*/

CREATE TABLE IF NOT EXISTS knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read knowledge base"
  ON knowledge_base
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service role can insert knowledge base"
  ON knowledge_base
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update knowledge base"
  ON knowledge_base
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);