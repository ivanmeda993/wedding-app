/*
  # Update metadata for existing users with weddings

  1. Changes
    - Add function to update metadata for all existing users
    - Execute function to update all existing users
*/

-- Create function to update all existing users
CREATE OR REPLACE FUNCTION public.update_all_users_wedding_meta()
RETURNS void
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  wedding_record RECORD;
BEGIN
  FOR wedding_record IN 
    SELECT w.id as wedding_id, w.user_id 
    FROM weddings w
  LOOP
    UPDATE auth.users
    SET raw_user_meta_data = 
      CASE 
        WHEN raw_user_meta_data IS NULL THEN 
          jsonb_build_object('wedding_id', wedding_record.wedding_id)
        ELSE 
          raw_user_meta_data || jsonb_build_object('wedding_id', wedding_record.wedding_id)
      END
    WHERE id = wedding_record.user_id;
  END LOOP;
END;
$$;

-- Execute function to update all existing users
SELECT public.update_all_users_wedding_meta(); 