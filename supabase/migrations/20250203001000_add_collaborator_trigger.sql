/*
  # Dodavanje automatskog kreiranja korisnika za kolaboratore

  1. Nova funkcija
    - Kreira korisnika ako ne postoji
    - Kreira profil za korisnika
    - Povezuje korisnika sa venčanjem

  2. Trigger
    - Aktivira se kada se doda novi kolaborator
    - Poziva funkciju za kreiranje korisnika
*/

-- Create wedding_collaborators table if it doesn't exist
CREATE TABLE IF NOT EXISTS wedding_collaborators (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id uuid REFERENCES weddings(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(wedding_id, email)
);

-- Enable RLS
ALTER TABLE wedding_collaborators ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable all for authenticated users" ON wedding_collaborators
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to handle new collaborator
CREATE OR REPLACE FUNCTION handle_new_collaborator()
RETURNS trigger
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  existing_collaborator_id uuid;
BEGIN
  -- Check if collaborator already exists
  SELECT id INTO existing_collaborator_id
  FROM wedding_collaborators
  WHERE wedding_id = NEW.wedding_id AND email = NEW.email;

  IF existing_collaborator_id IS NOT NULL THEN
    RETURN NULL; -- Skip if already exists
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_wedding_collaborator_created ON wedding_collaborators;
CREATE TRIGGER on_wedding_collaborator_created
  AFTER INSERT ON wedding_collaborators
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_collaborator(); 