/*
  # Update Reviews Policy for Public Read Access

  1. Changes
    - Allow public (unauthenticated) users to read reviews
    - Keep authentication required for creating, updating, and deleting reviews

  2. Security
    - Anyone can read reviews (SELECT)
    - Only authenticated users can create reviews (INSERT)
    - Only review owners can update their reviews (UPDATE)
    - Only review owners can delete their reviews (DELETE)
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Anyone can read reviews" ON reviews;

-- Create new policy allowing public read access
CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  USING (true);
