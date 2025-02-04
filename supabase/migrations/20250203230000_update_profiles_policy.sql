-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow insert for authenticated users
CREATE POLICY "Allow users to insert their own profile"
ON profiles FOR INSERT 
TO authenticated, anon
WITH CHECK (
  -- Allow insert only if email matches the user's email
  email = current_setting('request.jwt.claims', true)::json->>'email'
  OR
  -- Or if no user is logged in yet (for registration)
  current_setting('request.jwt.claims', true)::json->>'role' = 'anon'
); 