/*
  # Populate Complete Test User Data
  
  1. Creates or finds test user tanphat312016@gmail.com
  2. Populates initial survey on 14/12/2025
  3. Adds daily tasks (gratitude, meaning, prosocial) for all days 14/12/2025 - 8/1/2026
  4. Marks all tasks as completed
  5. Adds daily task responses for all days
  6. Adds daily scores with progression from 1.3 to near maximum (6.5-7)
  7. Repeats survey on 4/1/2026 (weekly survey)
*/

DO $$
DECLARE
  v_user_id uuid;
  v_start_date date := '2025-12-14'::date;
  v_end_date date := '2026-01-08'::date;
  v_current_date date;
  v_day_count integer := 0;
  v_max_days integer;
  v_score_increment numeric;
  v_gratitude_score integer;
  v_meaning_score integer;
  v_response_value integer;
  v_daily_task_id uuid;
  v_task_types text[] := ARRAY['gratitude', 'meaning', 'prosocial'];
  v_task_type text;
  v_task_idx integer;
  v_question_id uuid;
BEGIN
  -- Get or create user
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'tanphat312016@gmail.com' LIMIT 1;
  
  IF v_user_id IS NULL THEN
    INSERT INTO auth.users (email, email_confirmed_at, created_at, updated_at)
    VALUES ('tanphat312016@gmail.com', now(), v_start_date::timestamp with time zone, now())
    RETURNING id INTO v_user_id;
  END IF;
  
  -- Delete existing data for this user to avoid duplicates
  DELETE FROM daily_task_responses WHERE user_id = v_user_id;
  DELETE FROM daily_tasks WHERE user_id = v_user_id;
  DELETE FROM daily_scores WHERE user_id = v_user_id;
  DELETE FROM survey_responses WHERE user_id = v_user_id;
  
  -- Calculate total days
  v_max_days := (v_end_date - v_start_date)::integer + 1;
  v_score_increment := (6.5 - 1.3) / v_max_days;
  
  -- Insert initial survey on 14/12/2025
  INSERT INTO survey_responses (user_id, x_score, y_score, m_score, x_level, y_level, m_level, answers, completed_at)
  VALUES (
    v_user_id,
    2.5,
    2.3,
    2.1,
    'Low',
    'Low',
    'Low',
    '{"X":[1,1,1,1,2],"Y":[1,1,1,1],"M":[1,1,1,1]}'::jsonb,
    v_start_date::timestamp with time zone
  );
  
  -- Loop through each day from 14/12/2025 to 8/1/2026
  v_current_date := v_start_date;
  WHILE v_current_date <= v_end_date LOOP
    v_day_count := v_day_count + 1;
    
    -- Calculate progressive scores (starting at 1.3, reaching ~6.5-7)
    v_gratitude_score := LEAST(7, GREATEST(1, FLOOR(1.3 + (v_score_increment * v_day_count))::integer));
    v_meaning_score := LEAST(7, GREATEST(1, FLOOR(1.3 + (v_score_increment * v_day_count) + 0.3)::integer));
    
    -- Calculate response value (capped at 5 for responses)
    v_response_value := LEAST(5, GREATEST(1, FLOOR(1 + (v_score_increment * v_day_count) / 1.3)::integer));
    
    -- Insert daily tasks for each type (gratitude, meaning, prosocial)
    FOREACH v_task_type IN ARRAY v_task_types LOOP
      INSERT INTO daily_tasks (user_id, task_type, task_date, completed, created_at, updated_at)
      VALUES (v_user_id, v_task_type, v_current_date, true, v_current_date::timestamp with time zone, v_current_date::timestamp with time zone)
      RETURNING id INTO v_daily_task_id;
      
      -- Get a random question for this task type
      SELECT id INTO v_question_id FROM task_questions 
      WHERE task_type = v_task_type 
      AND is_active = true 
      LIMIT 1;
      
      -- Insert task response
      IF v_question_id IS NOT NULL THEN
        INSERT INTO daily_task_responses (daily_task_id, user_id, task_type, response_text, response_value, question_id, created_at, updated_at)
        VALUES (
          v_daily_task_id,
          v_user_id,
          v_task_type,
          'Sample response for ' || v_task_type,
          v_response_value,
          v_question_id,
          v_current_date::timestamp with time zone,
          v_current_date::timestamp with time zone
        );
      END IF;
    END LOOP;
    
    -- Insert daily scores
    INSERT INTO daily_scores (user_id, task_date, gratitude_score, life_meaning_score, prosocial_behavior, created_at, updated_at)
    VALUES (
      v_user_id,
      v_current_date,
      v_gratitude_score,
      v_meaning_score,
      'Helped someone today',
      v_current_date::timestamp with time zone,
      v_current_date::timestamp with time zone
    );
    
    -- Move to next day
    v_current_date := v_current_date + interval '1 day';
  END LOOP;
  
  -- Insert repeat survey on 4/1/2026 (weekly survey)
  INSERT INTO survey_responses (user_id, x_score, y_score, m_score, x_level, y_level, m_level, answers, completed_at)
  VALUES (
    v_user_id,
    5.2,
    5.0,
    5.1,
    'High',
    'High',
    'High',
    '{"X":[4,4,4,4,5],"Y":[4,4,4,4],"M":[4,4,4,4]}'::jsonb,
    '2026-01-04'::timestamp with time zone
  );
  
  RAISE NOTICE 'Successfully populated data for user %', v_user_id;
END $$;
