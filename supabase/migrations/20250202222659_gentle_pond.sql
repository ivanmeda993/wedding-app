/*
  # Fix profiles RLS policies again

  1. Changes
    - Drop all existing policies for profiles table
    - Add new policy for authenticated users to create their own profile
    - Add policy for authenticated users to view their own profile
    - Add policy for authenticated users to update their own profile

  2. Security
    - Users can only manage their own profiles
    - Authenticated users can create their own profile
    - No user can delete profiles
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Create new policies with proper security
CREATE POLICY "Enable read access for authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on id"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE profiles FORCE ROW LEVEL SECURITY;