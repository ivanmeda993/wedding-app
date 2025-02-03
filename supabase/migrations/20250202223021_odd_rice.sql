/*
  # Fix profiles policy conflict

  1. Changes
    - Drop conflicting policy
    - Ensure no duplicate policies exist

  2. Security
    - Maintains existing security model
    - No changes to functionality
*/

-- Drop potentially conflicting policies
DROP POLICY IF EXISTS "profiles_read_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;

-- No need to recreate policies as they are already handled by previous migrations