/*
  # Add trigger for updating user metadata on wedding creation

  1. Changes
    - Add trigger to update auth.users.raw_user_meta_data when wedding is created
    - Ensures wedding_id is always present in user metadata
*/

-- Create function to handle new wedding
CREATE OR REPLACE FUNCTION public.handle_new_wedding()
RETURNS trigger
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update user metadata to include wedding_id
  UPDATE auth.users
  SET raw_user_meta_data = 
    CASE 
      WHEN raw_user_meta_data IS NULL THEN 
        jsonb_build_object('wedding_id', NEW.id)
      ELSE 
        raw_user_meta_data || jsonb_build_object('wedding_id', NEW.id)
    END
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_wedding_created ON weddings;
CREATE TRIGGER on_wedding_created
  AFTER INSERT ON weddings
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_wedding(); 