-- Enable RLS on all tables
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE companions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;

-- Groups policies
CREATE POLICY "Users can see groups from their weddings"
ON groups
FOR SELECT
TO authenticated
USING (
  wedding_id IN (
    SELECT w.id 
    FROM weddings w 
    LEFT JOIN wedding_collaborators wc ON wc.wedding_id = w.id 
    WHERE w.user_id = auth.uid() OR wc.email = auth.jwt() ->> 'email'
  )
);

-- Guests policies
CREATE POLICY "Users can see guests from their weddings"
ON guests
FOR SELECT
TO authenticated
USING (
  wedding_id IN (
    SELECT w.id 
    FROM weddings w 
    LEFT JOIN wedding_collaborators wc ON wc.wedding_id = w.id 
    WHERE w.user_id = auth.uid() OR wc.email = auth.jwt() ->> 'email'
  )
);

-- Companions policies
CREATE POLICY "Users can see companions from their weddings"
ON companions
FOR SELECT
TO authenticated
USING (
  guest_id IN (
    SELECT g.id 
    FROM guests g
    JOIN weddings w ON w.id = g.wedding_id
    LEFT JOIN wedding_collaborators wc ON wc.wedding_id = w.id 
    WHERE w.user_id = auth.uid() OR wc.email = auth.jwt() ->> 'email'
  )
);

-- Gifts policies
CREATE POLICY "Users can see gifts from their weddings"
ON gifts
FOR SELECT
TO authenticated
USING (
  guest_id IN (
    SELECT g.id 
    FROM guests g
    JOIN weddings w ON w.id = g.wedding_id
    LEFT JOIN wedding_collaborators wc ON wc.wedding_id = w.id 
    WHERE w.user_id = auth.uid() OR wc.email = auth.jwt() ->> 'email'
  )
);