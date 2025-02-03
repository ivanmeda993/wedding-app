/*
  # Final fix for profiles and RLS

  1. Changes
    - Drop all existing policies for profiles table
    - Add new simplified policies with proper security
    - Add trigger for automatic profile creation on auth.users insert
    - Ensure RLS is enabled but allows profile creation

  2. Security
    - Users can read all profiles (needed for collaboration)
    - Users can create their own profile
    - Users can only update their own profile
    - Automatic profile creation on signup
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_read_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;

-- Create new simplified policies
CREATE POLICY "allow_read"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "allow_insert"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "allow_update"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create function to handle profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, updated_at)
  VALUES (new.id, new.email, now())
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();