-- Drop existing check constraints
ALTER TABLE gifts DROP CONSTRAINT IF EXISTS valid_gift_data;
ALTER TABLE gifts DROP CONSTRAINT IF EXISTS gifts_amount_check;

-- Make type column nullable
ALTER TABLE gifts ALTER COLUMN type DROP NOT NULL;

-- Add new check constraints
ALTER TABLE gifts ADD CONSTRAINT valid_gift_data CHECK (
  (type IS NULL) OR
  (type = 'money' AND amount IS NOT NULL AND description IS NULL) OR
  (type = 'other' AND description IS NOT NULL AND amount IS NULL)
);

ALTER TABLE gifts ADD CONSTRAINT gifts_amount_check CHECK (
  amount IS NULL OR amount > 0
); 