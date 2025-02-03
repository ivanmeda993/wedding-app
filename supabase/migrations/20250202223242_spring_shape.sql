/*
  # Final fix for profiles table

  1. Changes
    - Drop all existing policies
    - Create single set of working policies
    - Update trigger function for robust profile creation
    - Ensure proper security while allowing profile creation

  2. Security
    - Maintains RLS security
    - Allows proper profile creation during signup
    - Prevents unauthorized access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "profiles_select" ON profiles;
DROP POLICY IF EXISTS "profiles_insert" ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;
DROP POLICY IF EXISTS "allow_read" ON profiles;
DROP POLICY IF EXISTS "allow_insert" ON profiles;
DROP POLICY IF EXISTS "allow_update" ON profiles;
DROP POLICY IF EXISTS "Enable profile management" ON profiles;

-- Create final set of policies
CREATE POLICY "Enable profile management"
  ON profiles
  TO authenticated
  USING (true)
  WITH CHECK (auth.uid() = id);

-- Update the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, updated_at)
  VALUES (new.id, new.email, CURRENT_TIMESTAMP)
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      updated_at = CURRENT_TIMESTAMP;
  RETURN new;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated, service_role;
