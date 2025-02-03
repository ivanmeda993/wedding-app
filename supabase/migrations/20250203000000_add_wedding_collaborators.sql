/*
  # Dodavanje tabele za saradnike na venčanju

  1. Nova tabela
    - `wedding_collaborators`
      - `id` (uuid, primary key)
      - `wedding_id` (uuid, foreign key)
      - `email` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Dodavanje policy-ja za pristup
*/

-- Create wedding collaborators table
CREATE TABLE wedding_collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid REFERENCES weddings(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE wedding_collaborators ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own weddings" ON weddings;
DROP POLICY IF EXISTS "Collaborators can view weddings" ON weddings;
DROP POLICY IF EXISTS "Users can view and manage weddings" ON weddings;
DROP POLICY IF EXISTS "Wedding access policy" ON weddings;
DROP POLICY IF EXISTS "Collaborator access policy" ON weddings;

-- Create a single policy for weddings
DROP POLICY IF EXISTS "Wedding access policy" ON weddings;
CREATE POLICY "Wedding access policy"
  ON weddings
  AS PERMISSIVE
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid() OR
    invite_code::text = current_setting('request.jwt.claims')::json->>'invite_code'
  );

-- Create policy for collaborators table
DROP POLICY IF EXISTS "Users can manage their own wedding collaborators" ON wedding_collaborators;
DROP POLICY IF EXISTS "Users can insert collaborators" ON wedding_collaborators;
DROP POLICY IF EXISTS "Users can view collaborators" ON wedding_collaborators;
DROP POLICY IF EXISTS "Users can delete collaborators" ON wedding_collaborators;
DROP POLICY IF EXISTS "Collaborators management" ON wedding_collaborators;
CREATE POLICY "Collaborators management"
  ON wedding_collaborators
  AS PERMISSIVE
  FOR ALL
  TO authenticated
  USING (
    wedding_id IN (
      SELECT id FROM weddings WHERE user_id = auth.uid()
    )
  );

-- Create a view for wedding access
CREATE OR REPLACE VIEW accessible_weddings AS
  SELECT w.* 
  FROM weddings w
  LEFT JOIN wedding_collaborators wc ON w.id = wc.wedding_id
  WHERE w.user_id = auth.uid() OR wc.email = auth.email();

-- Grant access to the view
GRANT SELECT ON accessible_weddings TO authenticated;

-- Create function to handle new collaborators
CREATE OR REPLACE FUNCTION handle_new_collaborator()
RETURNS TRIGGER AS $$
DECLARE
  invite_data JSONB;
  user_id UUID;
BEGIN
  -- Create invite data
  invite_data := jsonb_build_object(
    'wedding_id', NEW.wedding_id,
    'invited_by', auth.uid()
  );

  -- Create a new user if they don't exist
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_sent_at,
    is_sso_user,
    role
  )
  SELECT 
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000'::uuid,
    NEW.email,
    jsonb_build_object(
      'wedding_id', NEW.wedding_id,
      'invited_by', auth.uid(),
      'has_password', false
    ),
    now(),
    now(),
    now(),
    false,
    'authenticated'
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = NEW.email
  )
  RETURNING id INTO user_id;

  -- If we created a new user, send them a magic link
  IF user_id IS NOT NULL THEN
    -- Insert email into auth.identities
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      user_id,
      jsonb_build_object(
        'sub', user_id,
        'email', NEW.email
      ),
      'email',
      now(),
      now(),
      now()
    );

    -- Send magic link email
    PERFORM auth.send_magic_link_email(NEW.email);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new collaborators
DROP TRIGGER IF EXISTS on_collaborator_created ON wedding_collaborators;
CREATE TRIGGER on_collaborator_created
  AFTER INSERT ON wedding_collaborators
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_collaborator();

-- Add invite_code column to weddings table
ALTER TABLE weddings ADD COLUMN IF NOT EXISTS invite_code uuid DEFAULT gen_random_uuid() NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS weddings_invite_code_idx ON weddings(invite_code);

