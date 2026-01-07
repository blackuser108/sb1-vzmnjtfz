/*
  # Update Survey Schedule and Prosocial Behavior Data
  
  1. Update surveys to only 4 specific dates with exact progression
  2. Update prosocial behavior tasks with progression pattern
*/

DO $$
DECLARE
  v_user_id uuid;
  v_behaviors text[] := ARRAY[
    'Chủ động hỏi thăm, quan tâm đến cảm xúc của người khác',
    'Lắng nghe người khác chia sẻ mà không phán xét',
    'Giúp đỡ ai đó một việc nhỏ (học tập, công việc, sinh hoạt)',
    'Hỗ trợ bạn bè / người thân khi họ gặp khó khăn',
    'Nói lời cảm ơn hoặc xin lỗi một cách chân thành',
    'Động viên, khích lệ người khác khi họ buồn hoặc nản chí',
    'Chia sẻ kiến thức, kinh nghiệm hoặc thông tin hữu ích',
    'Hợp tác, làm việc nhóm một cách tích cực',
    'Nhường nhịn, cư xử kiên nhẫn trong tình huống dễ căng thẳng',
    'Bảo vệ hoặc lên tiếng cho người yếu thế',
    'Tham gia hoặc ủng hộ hoạt động vì cộng đồng / tập thể',
    'Cư xử tử tế với người lạ'
  ];
  v_current_date date;
  v_day_offset integer;
  v_num_behaviors integer;
  v_daily_task_id uuid;
  v_behavior_text text;
  v_i integer;
  v_random_idx integer;
  v_temp_idx integer;
  v_selected_indices integer[] := ARRAY[]::integer[];
  v_swap_idx integer;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'tanphat312016@gmail.com';
  
  -- Delete old survey data
  DELETE FROM survey_responses WHERE user_id = v_user_id;
  
  -- Insert 4 specific surveys with exact scores
  INSERT INTO survey_responses (user_id, x_score, y_score, m_score, x_level, y_level, m_level, answers, completed_at)
  VALUES
    (v_user_id, 2.1, 1.2, 1.8, 'Low', 'Low', 'Low', '{"X":[1,1,1,1,1],"Y":[1,1,1,1],"M":[1,1,1,1]}'::jsonb, '2025-12-14'::timestamp with time zone),
    (v_user_id, 3.7, 2.3, 3.2, 'Low', 'Low', 'Low', '{"X":[2,2,2,1,2],"Y":[2,2,1,2],"M":[2,2,2,2]}'::jsonb, '2025-12-21'::timestamp with time zone),
    (v_user_id, 5.2, 3.1, 5.4, 'Medium', 'Low', 'Medium', '{"X":[3,3,3,3,3],"Y":[2,2,3,2],"M":[3,3,3,3]}'::jsonb, '2025-12-28'::timestamp with time zone),
    (v_user_id, 6.7, 4.6, 6.5, 'High', 'Medium', 'High', '{"X":[4,4,4,4,5],"Y":[3,3,4,4],"M":[4,4,4,4]}'::jsonb, '2026-01-04'::timestamp with time zone);

  -- Update prosocial behavior tasks based on date progression
  v_current_date := '2025-12-14'::date;
  WHILE v_current_date <= '2026-01-08'::date LOOP
    v_day_offset := (v_current_date - '2025-12-14'::date);
    
    -- Delete existing prosocial responses for this date
    DELETE FROM daily_task_responses 
    WHERE user_id = v_user_id 
    AND task_type = 'prosocial'
    AND daily_task_id IN (
      SELECT id FROM daily_tasks 
      WHERE user_id = v_user_id 
      AND task_type = 'prosocial'
      AND task_date = v_current_date
    );
    
    -- Determine number of behaviors based on date
    IF v_current_date < '2025-12-21' THEN
      v_num_behaviors := 0;
    ELSIF v_current_date < '2025-12-28' THEN
      v_num_behaviors := 2 + (v_day_offset % 2);
    ELSIF v_current_date < '2026-01-04' THEN
      v_num_behaviors := 4 + (v_day_offset % 2);
    ELSE
      v_num_behaviors := 7;
    END IF;
    
    -- Get the prosocial task for this day
    SELECT id INTO v_daily_task_id FROM daily_tasks 
    WHERE user_id = v_user_id 
    AND task_type = 'prosocial'
    AND task_date = v_current_date
    LIMIT 1;
    
    IF v_daily_task_id IS NOT NULL AND v_num_behaviors > 0 THEN
      -- Generate random selection for final 7 days or sequential for earlier
      v_selected_indices := ARRAY[]::integer[];
      
      IF v_current_date >= '2026-01-04' THEN
        -- Generate 7 random distinct indices
        FOR v_i IN 1..12 LOOP
          v_selected_indices := array_append(v_selected_indices, v_i);
        END LOOP;
        -- Fisher-Yates shuffle to get random 7
        FOR v_i IN 1..7 LOOP
          v_random_idx := (floor(random() * (13 - v_i)) + v_i)::integer;
          v_swap_idx := v_selected_indices[v_i];
          v_selected_indices[v_i] := v_selected_indices[v_random_idx];
          v_selected_indices[v_random_idx] := v_swap_idx;
        END LOOP;
        v_selected_indices := v_selected_indices[1:7];
      ELSE
        -- Sequential selection
        FOR v_i IN 1..v_num_behaviors LOOP
          v_selected_indices := array_append(v_selected_indices, v_i);
        END LOOP;
      END IF;
      
      -- Insert responses for selected behaviors
      FOR v_i IN 1..array_length(v_selected_indices, 1) LOOP
        v_behavior_text := v_behaviors[v_selected_indices[v_i]];
        INSERT INTO daily_task_responses (daily_task_id, user_id, task_type, response_text, created_at, updated_at)
        VALUES (v_daily_task_id, v_user_id, 'prosocial', v_behavior_text, v_current_date::timestamp with time zone, v_current_date::timestamp with time zone);
      END LOOP;
    END IF;
    
    v_current_date := v_current_date + interval '1 day';
  END LOOP;
  
  RAISE NOTICE 'Successfully updated survey and prosocial data for user %', v_user_id;
END $$;
