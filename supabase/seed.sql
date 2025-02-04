-- Reset tables
TRUNCATE TABLE auth.users CASCADE;
TRUNCATE TABLE public.profiles CASCADE;
TRUNCATE TABLE public.weddings CASCADE;
TRUNCATE TABLE public.groups CASCADE;
TRUNCATE TABLE public.guests CASCADE;
TRUNCATE TABLE public.companions CASCADE;
TRUNCATE TABLE public.gifts CASCADE;

-- Seed data for testing
-- First, clean up existing data
TRUNCATE weddings, groups, guests, companions, gifts, wedding_collaborators CASCADE;

-- Create test user if not exists
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Test User", "wedding_id": "e52c654e-c4fb-4f8d-8ee3-6bd65e8b816b"}',
  false,
  now(),
  now(),
  NULL,
  NULL,
  '',
  '',
  '',
  ''
);

-- Create profile for test user
INSERT INTO public.profiles (id, email, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'test@example.com',
  now()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

-- Insert test wedding
INSERT INTO weddings (id, bride_name, groom_name, date, venue_name, venue_address, venue_hall, price_per_person, user_id)
VALUES (
  'e52c654e-c4fb-4f8d-8ee3-6bd65e8b816b',
  'Sandra',
  'Ivan',
  '2024-09-15',
  'Hotel Moskva',
  'Balkanska 1',
  'Sala A',
  50,
  '00000000-0000-0000-0000-000000000000'
) RETURNING id;

-- Insert groups
INSERT INTO groups (id, name, side, wedding_id) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Porodica', 'bride', 'e52c654e-c4fb-4f8d-8ee3-6bd65e8b816b'),
  ('22222222-2222-2222-2222-222222222222', 'Prijatelji', 'bride', 'e52c654e-c4fb-4f8d-8ee3-6bd65e8b816b'),
  ('33333333-3333-3333-3333-333333333333', 'Porodica', 'groom', 'e52c654e-c4fb-4f8d-8ee3-6bd65e8b816b'),
  ('44444444-4444-4444-4444-444444444444', 'Prijatelji', 'groom', 'e52c654e-c4fb-4f8d-8ee3-6bd65e8b816b');

-- Insert guests
INSERT INTO guests (id, first_name, last_name, phone, attendance, side, group_id, notes, wedding_id) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Marko', 'Marković', '+381641234567', 'yes', 'bride', '11111111-1111-1111-1111-111111111111', 'Alergičan na kikiriki', 'e52c654e-c4fb-4f8d-8ee3-6bd65e8b816b'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Jana', 'Janković', '+381642345678', 'pending', 'bride', '22222222-2222-2222-2222-222222222222', NULL, 'e52c654e-c4fb-4f8d-8ee3-6bd65e8b816b'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Petar', 'Petrović', '+381643456789', 'yes', 'groom', '33333333-3333-3333-3333-333333333333', NULL, 'e52c654e-c4fb-4f8d-8ee3-6bd65e8b816b'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Ana', 'Anić', '+381644567890', 'no', 'groom', '44444444-4444-4444-4444-444444444444', 'Na putu', 'e52c654e-c4fb-4f8d-8ee3-6bd65e8b816b');

-- Insert companions
INSERT INTO companions (id, first_name, last_name, is_adult, guest_id) VALUES
  ('11111111-aaaa-bbbb-cccc-dddddddddddd', 'Mila', 'Marković', true, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('22222222-aaaa-bbbb-cccc-dddddddddddd', 'Stefan', 'Marković', false, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('33333333-aaaa-bbbb-cccc-dddddddddddd', 'Lena', 'Janković', true, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('44444444-aaaa-bbbb-cccc-dddddddddddd', 'Nina', 'Petrović', true, 'cccccccc-cccc-cccc-cccc-cccccccccccc');

-- Insert gifts
INSERT INTO gifts (id, type, amount, description, guest_id) VALUES
  ('55555555-5555-5555-5555-555555555555', 'money', 200, NULL, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('66666666-6666-6666-6666-666666666666', 'other', NULL, 'Escajg', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('77777777-7777-7777-7777-777777777777', 'money', 150, NULL, 'cccccccc-cccc-cccc-cccc-cccccccccccc'); 