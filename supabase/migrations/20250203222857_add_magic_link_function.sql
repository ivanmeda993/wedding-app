/*
  # Dodavanje funkcije za slanje magic link emaila

  1. Nova funkcija
    - Šalje magic link email novom kolaboratoru
    - Poziva se iz handle_new_collaborator funkcije
*/

-- Create function to send magic link email
CREATE OR REPLACE FUNCTION send_magic_link_email(user_email text)
RETURNS void
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Send magic link email using Supabase's built-in email service
  SELECT auth.send_magic_link_email(user_email);
END;
$$;

-- Update handle_new_collaborator function to send magic link
CREATE OR REPLACE FUNCTION handle_new_collaborator()
RETURNS trigger
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_user_id uuid;
BEGIN
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

  -- Send magic link email
  PERFORM send_magic_link_email(NEW.email);

  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_wedding_collaborator_created ON wedding_collaborators;
CREATE TRIGGER on_wedding_collaborator_created
  AFTER INSERT ON wedding_collaborators
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_collaborator();
