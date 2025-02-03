/*
  # Fix profiles policies

  1. Changes
    - Drop all existing policies for profiles table
    - Add new policies with proper security
    - Ensure RLS is enabled

  2. Security
    - Users can view all profiles (needed for collaboration)
    - Users can only create their own profile
    - Users can only update their own profile
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Create new policies with proper security
CREATE POLICY "profiles_read_policy"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "profiles_insert_policy"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE profiles FORCE ROW LEVEL SECURITY;