/*
  # Fix profiles RLS policies

  1. Changes
    - Add policy for inserting own profile
    - Add policy for updating own profile
    - Add policy for viewing own profile

  2. Security
    - Users can only manage their own profiles
    - Authenticated users can create their own profile
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policies
CREATE POLICY "Users can manage own profile"
  ON profiles
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);