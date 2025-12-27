/*
  # Revert Security Optimizations
  
  1. Changes
    - Remove indexes that were added for foreign keys (except those from earlier migrations)
    - Restore original RLS policies with auth.uid() syntax
  
  2. Restores
    - Original policy structure from before security fixes
    - Original auth.uid() calls without select wrapper
*/

-- Drop the newly added indexes (keep idx_chat_history_user_id as it was from an earlier migration)
DROP INDEX IF EXISTS idx_reviews_user_id;
DROP INDEX IF EXISTS idx_survey_responses_survey_id;
DROP INDEX IF EXISTS idx_survey_results_survey_id;
DROP INDEX IF EXISTS idx_surveys_user_id;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can create own surveys" ON public.surveys;
DROP POLICY IF EXISTS "Users can read own surveys" ON public.surveys;
DROP POLICY IF EXISTS "Users can update own surveys" ON public.surveys;
DROP POLICY IF EXISTS "Users can delete own surveys" ON public.surveys;

DROP POLICY IF EXISTS "Users can create own survey responses" ON public.survey_responses;
DROP POLICY IF EXISTS "Users can read own survey responses" ON public.survey_responses;

DROP POLICY IF EXISTS "Users can read own survey results" ON public.survey_results;
DROP POLICY IF EXISTS "System can create survey results" ON public.survey_results;

DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can read reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;

DROP POLICY IF EXISTS "Users can read own chat history" ON public.chat_history;
DROP POLICY IF EXISTS "Users can create own chat messages" ON public.chat_history;
DROP POLICY IF EXISTS "Users can update own chat messages" ON public.chat_history;
DROP POLICY IF EXISTS "Users can delete own chat messages" ON public.chat_history;

-- Recreate original policies for surveys (with auth.uid() without select wrapper)
CREATE POLICY "Users can create own surveys"
  ON surveys FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own surveys"
  ON surveys FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own surveys"
  ON surveys FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own surveys"
  ON surveys FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Recreate original policies for survey_responses
CREATE POLICY "Users can create own survey responses"
  ON survey_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM surveys
      WHERE surveys.id = survey_responses.survey_id
      AND surveys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read own survey responses"
  ON survey_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM surveys
      WHERE surveys.id = survey_responses.survey_id
      AND surveys.user_id = auth.uid()
    )
  );

-- Recreate original policies for survey_results
CREATE POLICY "Users can read own survey results"
  ON survey_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM surveys
      WHERE surveys.id = survey_results.survey_id
      AND surveys.user_id = auth.uid()
    )
  );

CREATE POLICY "System can create survey results"
  ON survey_results FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM surveys
      WHERE surveys.id = survey_results.survey_id
      AND surveys.user_id = auth.uid()
    )
  );

-- Recreate original policies for reviews
CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Recreate original policies for chat_history
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
