/*
  # Add get_wedding_by_invite_code function

  1. Function
    - Takes invite code as parameter
    - Returns wedding details if found
    - Used for validating invite links
*/

-- Create function to get wedding by invite code
CREATE OR REPLACE FUNCTION get_wedding_by_invite_code(code text)
RETURNS TABLE (
  id uuid,
  bride_name text,
  groom_name text
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT w.id, w.bride_name, w.groom_name
  FROM weddings w
  WHERE w.invite_code = code::uuid;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_wedding_by_invite_code(text) TO authenticated; 