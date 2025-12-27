/*
  # Create PDF Handbook Management System

  1. New Tables
    - `handbook_pdfs` - Stores metadata of uploaded PDFs
      - `id` (uuid, primary key)
      - `user_id` (uuid, reference to auth.users)
      - `file_name` (text)
      - `file_path` (text, path in Supabase Storage)
      - `file_size` (integer, bytes)
      - `mime_type` (text)
      - `description` (text)
      - `uploaded_at` (timestamp)

  2. Security
    - Enable RLS on `handbook_pdfs` table
    - Add policies for authenticated users to manage PDFs
    - Only admin users can view all PDFs
    - Regular users can view public PDFs
*/

CREATE TABLE IF NOT EXISTS handbook_pdfs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL UNIQUE,
  file_size integer NOT NULL DEFAULT 0,
  mime_type text DEFAULT 'application/pdf',
  description text,
  is_public boolean DEFAULT true,
  uploaded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE handbook_pdfs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_handbook_pdfs_user_id ON handbook_pdfs(user_id);
CREATE INDEX IF NOT EXISTS idx_handbook_pdfs_public ON handbook_pdfs(is_public);
CREATE INDEX IF NOT EXISTS idx_handbook_pdfs_created ON handbook_pdfs(created_at DESC);

CREATE POLICY "Anyone can view public handbook PDFs"
  ON handbook_pdfs FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view own PDFs"
  ON handbook_pdfs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can upload PDFs"
  ON handbook_pdfs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own PDFs"
  ON handbook_pdfs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own PDFs"
  ON handbook_pdfs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
