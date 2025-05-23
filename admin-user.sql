-- SQL script to create admin user for session-based authentication
-- Run this in the Supabase SQL Editor (https://app.supabase.com)

-- First, check if the users table exists, if not create it
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Temporarily disable RLS to allow direct insertion
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Insert admin user if not exists
INSERT INTO users (username, password, email, role, created_at)
VALUES (
  'sunda', 
  'Yndu@Admin2025!', -- Strong password
  'sunda@yndufountain.com', 
  'admin', 
  NOW()
)
ON CONFLICT (username) 
DO UPDATE SET 
  password = 'Yndu@Admin2025!',
  role = 'admin';

-- Re-enable RLS if needed
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Verify the admin user was created
SELECT id, username, email, role FROM users WHERE username = 'sunda';
