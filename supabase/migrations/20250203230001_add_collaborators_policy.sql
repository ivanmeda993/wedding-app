-- Enable RLS
ALTER TABLE wedding_collaborators ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including anon) to insert into wedding_collaborators
CREATE POLICY "Anyone can add collaborators"
ON wedding_collaborators
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only allow users to see their own collaborators
CREATE POLICY "Users can see their own collaborators"
ON wedding_collaborators
FOR SELECT
TO authenticated
USING (
  email = auth.jwt() ->> 'email'
  OR
  wedding_id IN (
    SELECT id FROM weddings WHERE user_id = auth.uid()
  )
); 