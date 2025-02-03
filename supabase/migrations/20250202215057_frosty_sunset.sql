/*
  # Initial schema setup for wedding guest management

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `weddings`
      - `id` (uuid, primary key)
      - `bride_name` (text)
      - `groom_name` (text)
      - `date` (date)
      - `venue_name` (text)
      - `venue_address` (text)
      - `venue_hall` (text)
      - `price_per_person` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_id` (uuid, foreign key)

    - `groups`
      - `id` (uuid, primary key)
      - `name` (text)
      - `side` (text)
      - `wedding_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `guests`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `phone` (text)
      - `attendance` (text)
      - `side` (text)
      - `group_id` (uuid, foreign key)
      - `notes` (text)
      - `wedding_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `companions`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `is_adult` (boolean)
      - `guest_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `gifts`
      - `id` (uuid, primary key)
      - `type` (text)
      - `description` (text)
      - `amount` (integer)
      - `guest_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Restrict access to profiles and weddings to their owners
    - Allow read/write access to related tables based on wedding ownership
*/

-- Create custom types
CREATE TYPE attendance_status AS ENUM ('yes', 'no', 'pending');
CREATE TYPE side_type AS ENUM ('bride', 'groom');
CREATE TYPE gift_type AS ENUM ('money', 'other');

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create weddings table
CREATE TABLE weddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bride_name text NOT NULL,
  groom_name text NOT NULL,
  date date NOT NULL,
  venue_name text NOT NULL,
  venue_address text NOT NULL,
  venue_hall text NOT NULL,
  price_per_person integer NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create groups table
CREATE TABLE groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  side side_type NOT NULL,
  wedding_id uuid REFERENCES weddings(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create guests table
CREATE TABLE guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  attendance attendance_status DEFAULT 'pending',
  side side_type NOT NULL,
  group_id uuid REFERENCES groups(id) ON DELETE SET NULL,
  notes text,
  wedding_id uuid REFERENCES weddings(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create companions table
CREATE TABLE companions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text,
  is_adult boolean NOT NULL DEFAULT true,
  guest_id uuid REFERENCES guests(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create gifts table
CREATE TABLE gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type gift_type NOT NULL,
  description text,
  amount integer CHECK (amount > 0),
  guest_id uuid REFERENCES guests(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_gift_data CHECK (
    (type = 'money' AND amount IS NOT NULL AND description IS NULL) OR
    (type = 'other' AND description IS NOT NULL AND amount IS NULL)
  )
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE companions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Weddings policies
CREATE POLICY "Users can view own weddings"
  ON weddings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create weddings"
  ON weddings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own weddings"
  ON weddings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own weddings"
  ON weddings FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Groups policies
CREATE POLICY "Users can view groups of their weddings"
  ON groups FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM weddings
    WHERE weddings.id = groups.wedding_id
    AND weddings.user_id = auth.uid()
  ));

CREATE POLICY "Users can create groups for their weddings"
  ON groups FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM weddings
    WHERE weddings.id = wedding_id
    AND weddings.user_id = auth.uid()
  ));

CREATE POLICY "Users can update groups of their weddings"
  ON groups FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM weddings
    WHERE weddings.id = groups.wedding_id
    AND weddings.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete groups of their weddings"
  ON groups FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM weddings
    WHERE weddings.id = groups.wedding_id
    AND weddings.user_id = auth.uid()
  ));

-- Guests policies
CREATE POLICY "Users can view guests of their weddings"
  ON guests FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM weddings
    WHERE weddings.id = guests.wedding_id
    AND weddings.user_id = auth.uid()
  ));

CREATE POLICY "Users can create guests for their weddings"
  ON guests FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM weddings
    WHERE weddings.id = wedding_id
    AND weddings.user_id = auth.uid()
  ));

CREATE POLICY "Users can update guests of their weddings"
  ON guests FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM weddings
    WHERE weddings.id = guests.wedding_id
    AND weddings.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete guests of their weddings"
  ON guests FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM weddings
    WHERE weddings.id = guests.wedding_id
    AND weddings.user_id = auth.uid()
  ));

-- Companions policies
CREATE POLICY "Users can view companions of their wedding guests"
  ON companions FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM guests
    JOIN weddings ON weddings.id = guests.wedding_id
    WHERE guests.id = companions.guest_id
    AND weddings.user_id = auth.uid()
  ));

CREATE POLICY "Users can create companions for their wedding guests"
  ON companions FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM guests
    JOIN weddings ON weddings.id = guests.wedding_id
    WHERE guests.id = guest_id
    AND weddings.user_id = auth.uid()
  ));

CREATE POLICY "Users can update companions of their wedding guests"
  ON companions FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM guests
    JOIN weddings ON weddings.id = guests.wedding_id
    WHERE guests.id = companions.guest_id
    AND weddings.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete companions of their wedding guests"
  ON companions FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM guests
    JOIN weddings ON weddings.id = guests.wedding_id
    WHERE guests.id = companions.guest_id
    AND weddings.user_id = auth.uid()
  ));

-- Gifts policies
CREATE POLICY "Users can view gifts of their wedding guests"
  ON gifts FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM guests
    JOIN weddings ON weddings.id = guests.wedding_id
    WHERE guests.id = gifts.guest_id
    AND weddings.user_id = auth.uid()
  ));

CREATE POLICY "Users can create gifts for their wedding guests"
  ON gifts FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM guests
    JOIN weddings ON weddings.id = guests.wedding_id
    WHERE guests.id = guest_id
    AND weddings.user_id = auth.uid()
  ));

CREATE POLICY "Users can update gifts of their wedding guests"
  ON gifts FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM guests
    JOIN weddings ON weddings.id = guests.wedding_id
    WHERE guests.id = gifts.guest_id
    AND weddings.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete gifts of their wedding guests"
  ON gifts FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM guests
    JOIN weddings ON weddings.id = guests.wedding_id
    WHERE guests.id = gifts.guest_id
    AND weddings.user_id = auth.uid()
  ));

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_weddings_updated_at
  BEFORE UPDATE ON weddings
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON groups
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_companions_updated_at
  BEFORE UPDATE ON companions
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_gifts_updated_at
  BEFORE UPDATE ON gifts
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();