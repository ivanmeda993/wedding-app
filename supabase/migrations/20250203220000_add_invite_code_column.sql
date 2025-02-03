ALTER TABLE weddings ADD COLUMN IF NOT EXISTS invite_code uuid DEFAULT gen_random_uuid() NOT NULL; CREATE UNIQUE INDEX IF NOT EXISTS weddings_invite_code_idx ON weddings(invite_code);
