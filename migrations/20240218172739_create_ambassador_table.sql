-- Create Ambassador Table
CREATE TABLE ambassador(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  college TEXT NOT NULL,
  contact TEXT NOT NULL,
  description TEXT NOT NULL,
  linkedin TEXT NOT NULL,
  twitter TEXT NOT NULL
);
