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

-- Create policies
CREATE POLICY "Users can view collaborators of their weddings"
  ON wedding_collaborators FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM weddings
    WHERE weddings.id = wedding_collaborators.wedding_id
    AND weddings.user_id = auth.uid()
  ));

CREATE POLICY "Users can add collaborators to their weddings"
  ON wedding_collaborators FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM weddings
    WHERE weddings.id = wedding_id
    AND weddings.user_id = auth.uid()
  ));

CREATE POLICY "Users can remove collaborators from their weddings"
  ON wedding_collaborators FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM weddings
    WHERE weddings.id = wedding_collaborators.wedding_id
    AND weddings.user_id = auth.uid()
  ));

-- Add policy to weddings table to allow collaborators to view
CREATE POLICY "Collaborators can view weddings"
  ON weddings FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM wedding_collaborators
    WHERE wedding_collaborators.wedding_id = id
    AND wedding_collaborators.email = auth.email()
  ));
