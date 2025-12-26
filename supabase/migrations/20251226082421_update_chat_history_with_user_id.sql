/*
  # Update Chat History Table for User-Specific Chat

  1. Modifications
    - Add `user_id` column to link chats to authenticated users
    - Add `title` column to name each chat session
    - Update RLS policies to restrict access to user's own chats
    - Add index for better query performance
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_history' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE chat_history ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_history' AND column_name = 'title'
  ) THEN
    ALTER TABLE chat_history ADD COLUMN title text DEFAULT 'Cuộc trò chuyện';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_session_user ON chat_history(session_id, user_id);

DROP POLICY IF EXISTS "Everyone can read chat history" ON chat_history;
DROP POLICY IF EXISTS "Everyone can create chat messages" ON chat_history;

CREATE POLICY "Users can read own chat history"
  ON chat_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chat messages"
  ON chat_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat messages"
  ON chat_history FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat messages"
  ON chat_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
