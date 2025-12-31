/*
  # Add display order to survey sections

  1. Changes
    - Add `display_order` column to `survey_sections` table
    - Set correct display order for sections:
      - X (Lòng biết ơn): order 1
      - Y (Hành vi ủng hộ xã hội): order 2
      - M (Ý nghĩa cuộc sống): order 3
  
  2. Purpose
    - Ensure sections appear in correct order: X → Y → M
    - Matches the order in bang_hoi.txt document
*/

-- Add display_order column
ALTER TABLE survey_sections ADD COLUMN IF NOT EXISTS display_order INT;

-- Update display order for each section
UPDATE survey_sections SET display_order = 1 WHERE code = 'X';
UPDATE survey_sections SET display_order = 2 WHERE code = 'Y';
UPDATE survey_sections SET display_order = 3 WHERE code = 'M';

-- Add not null constraint after setting values
ALTER TABLE survey_sections ALTER COLUMN display_order SET NOT NULL;
