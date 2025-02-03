/*
  # Ažuriranje handle_new_collaborator funkcije

  1. Izmene
    - Uklonjena funkcija za slanje magic linka (koristiće se Supabase Auth API)
    - Dodata provera da li korisnik već postoji kao kolaborator
*/

-- Update handle_new_collaborator function
CREATE OR REPLACE FUNCTION handle_new_collaborator()
RETURNS trigger
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_user_id uuid;
  existing_collaborator_id uuid;
BEGIN
  -- Check if collaborator already exists
  SELECT id INTO existing_collaborator_id
  FROM wedding_collaborators
  WHERE wedding_id = NEW.wedding_id AND email = NEW.email;

  IF existing_collaborator_id IS NOT NULL THEN
    RETURN NULL; -- Skip if already exists
  END IF;

  -- Check if user exists
  SELECT id INTO new_user_id
  FROM auth.users
  WHERE email = NEW.email;

  -- If user doesn't exist, create one
  IF new_user_id IS NULL THEN
    new_user_id := gen_random_uuid();
    
    -- Create user in auth.users
    INSERT INTO auth.users (
      id,
      email,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      raw_app_meta_data
    )
    VALUES (
      new_user_id,
      NEW.email,
      now(),
      now(),
      now(),
      jsonb_build_object('provider', 'email'),
      jsonb_build_object('provider', 'email', 'providers', ARRAY['email'])
    );

    -- Profile will be created by handle_new_user trigger
  END IF;

  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_wedding_collaborator_created ON wedding_collaborators;
CREATE TRIGGER on_wedding_collaborator_created
  AFTER INSERT ON wedding_collaborators
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_collaborator();
