/*
  # Fix Database Security Issues
  
  1. Add Missing Indexes
    - Add indexes for all foreign key columns to improve query performance
  
  2. Fix RLS Policies
    - Drop duplicate policies
    - Recreate policies with optimized auth.uid() calls using (select auth.uid())
  
  3. Security Improvements
    - Optimize all RLS policies for better performance at scale
*/

-- Add missing indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON public.survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_results_survey_id ON public.survey_results(survey_id);
CREATE INDEX IF NOT EXISTS idx_surveys_user_id ON public.surveys(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON public.chat_history(user_id);

-- Drop all existing policies to recreate them with optimizations
DROP POLICY IF EXISTS "Users can create own surveys" ON public.surveys;
DROP POLICY IF EXISTS "Users can read own surveys" ON public.surveys;
DROP POLICY IF EXISTS "Users can update own surveys" ON public.surveys;
DROP POLICY IF EXISTS "Users can delete own surveys" ON public.surveys;
DROP POLICY IF EXISTS "public_insert_surveys" ON public.surveys;
DROP POLICY IF EXISTS "public_select_surveys" ON public.surveys;
DROP POLICY IF EXISTS "public_update_surveys" ON public.surveys;

DROP POLICY IF EXISTS "Users can create own survey responses" ON public.survey_responses;
DROP POLICY IF EXISTS "Users can read own survey responses" ON public.survey_responses;
DROP POLICY IF EXISTS "public_insert_survey_responses" ON public.survey_responses;
DROP POLICY IF EXISTS "public_select_survey_responses" ON public.survey_responses;

DROP POLICY IF EXISTS "Users can read own survey results" ON public.survey_results;
DROP POLICY IF EXISTS "System can create survey results" ON public.survey_results;
DROP POLICY IF EXISTS "public_insert_survey_results" ON public.survey_results;
DROP POLICY IF EXISTS "public_select_survey_results" ON public.survey_results;

DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can read reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;
DROP POLICY IF EXISTS "public_insert_reviews" ON public.reviews;
DROP POLICY IF EXISTS "public_select_reviews" ON public.reviews;

DROP POLICY IF EXISTS "Users can read own chat history" ON public.chat_history;
DROP POLICY IF EXISTS "Users can create own chat messages" ON public.chat_history;
DROP POLICY IF EXISTS "Users can update own chat messages" ON public.chat_history;
DROP POLICY IF EXISTS "Users can delete own chat messages" ON public.chat_history;
DROP POLICY IF EXISTS "public_insert_chat_history" ON public.chat_history;
DROP POLICY IF EXISTS "public_select_chat_history" ON public.chat_history;

-- Recreate optimized policies for surveys
CREATE POLICY "Users can create own surveys"
  ON public.surveys FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can read own surveys"
  ON public.surveys FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own surveys"
  ON public.surveys FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own surveys"
  ON public.surveys FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Recreate optimized policies for survey_responses
CREATE POLICY "Users can create own survey responses"
  ON public.survey_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.surveys
      WHERE surveys.id = survey_responses.survey_id
      AND surveys.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can read own survey responses"
  ON public.survey_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.surveys
      WHERE surveys.id = survey_responses.survey_id
      AND surveys.user_id = (select auth.uid())
    )
  );

-- Recreate optimized policies for survey_results
CREATE POLICY "Users can read own survey results"
  ON public.survey_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.surveys
      WHERE surveys.id = survey_results.survey_id
      AND surveys.user_id = (select auth.uid())
    )
  );

CREATE POLICY "System can create survey results"
  ON public.survey_results FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.surveys
      WHERE surveys.id = survey_results.survey_id
      AND surveys.user_id = (select auth.uid())
    )
  );

-- Recreate optimized policies for reviews
CREATE POLICY "Anyone can read reviews"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own reviews"
  ON public.reviews FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Recreate optimized policies for chat_history
CREATE POLICY "Users can read own chat history"
  ON public.chat_history FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create own chat messages"
  ON public.chat_history FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own chat messages"
  ON public.chat_history FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own chat messages"
  ON public.chat_history FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);
