/*
  # Fix profiles policies and creation

  1. Changes
    - Drop all existing policies to start fresh
    - Create simplified policies that allow proper profile creation and management
    - Update trigger function to handle profile creation properly

  2. Security
    - Maintains RLS security
    - Ensures authenticated users can manage their own profiles
    - Allows proper profile creation during signup
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "allow_read" ON profiles;
DROP POLICY IF EXISTS "allow_insert" ON profiles;
DROP POLICY IF EXISTS "allow_update" ON profiles;

-- Create new simplified policies
CREATE POLICY "profiles_select"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "profiles_insert"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Update the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, updated_at)
  VALUES (new.id, new.email, CURRENT_TIMESTAMP)
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      updated_at = CURRENT_TIMESTAMP;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();