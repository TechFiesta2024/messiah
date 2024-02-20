-- Create Users Table
CREATE TABLE users(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  college TEXT NOT NULL,
  contact TEXT NOT NULL,
  stream TEXT NOT NULL,
  year TEXT NOT NULL
);

