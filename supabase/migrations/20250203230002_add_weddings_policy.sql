-- Create function to check wedding access
CREATE OR REPLACE FUNCTION public.check_wedding_access(wedding_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM weddings w 
    LEFT JOIN wedding_collaborators wc ON wc.wedding_id = w.id 
    WHERE 
      w.id = wedding_id 
      AND (
        w.user_id = auth.uid() 
        OR wc.email = auth.jwt() ->> 'email'
      )
  );
$$;

-- Enable RLS
ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;

-- Allow users to see weddings where they are owner or collaborator
CREATE POLICY "Users can see their weddings"
ON weddings
FOR SELECT
TO authenticated
USING (
  check_wedding_access(id)
); 