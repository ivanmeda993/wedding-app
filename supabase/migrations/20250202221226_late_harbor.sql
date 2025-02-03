/*
  # Fix enum types

  1. Changes
    - Adds safe creation of enum types with existence checks
    - Ensures types are only created if they don't already exist
  
  2. Technical Details
    - Uses DO blocks to check type existence
    - Creates attendance_status, side_type, and gift_type enums if missing
*/

DO $$ 
BEGIN
    -- Create attendance_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_status') THEN
        CREATE TYPE attendance_status AS ENUM ('yes', 'no', 'pending');
    END IF;

    -- Create side_type enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'side_type') THEN
        CREATE TYPE side_type AS ENUM ('bride', 'groom');
    END IF;

    -- Create gift_type enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gift_type') THEN
        CREATE TYPE gift_type AS ENUM ('money', 'other');
    END IF;
END $$;