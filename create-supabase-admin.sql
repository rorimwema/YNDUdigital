-- SQL script to create admin user in Supabase Auth
-- Run this in the Supabase SQL Editor (https://app.supabase.com)

-- First, check if the auth.users table exists (it should in Supabase)
DO $$
DECLARE
    admin_uid UUID;
    admin_email TEXT := 'admin@example.com';
BEGIN
    -- Check if the admin user already exists
    SELECT id INTO admin_uid FROM auth.users WHERE email = admin_email;
    
    IF admin_uid IS NULL THEN
        -- Generate a new UUID for the user
        admin_uid := gen_random_uuid();
        
        -- Insert the admin user directly into auth.users
        INSERT INTO auth.users (
            id,
            email,
            encrypted_password,
            email_confirmed_at,
            role,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            recovery_token,
            email_change_token_new,
            email_change
        ) VALUES (
            admin_uid,
            admin_email,
            -- This is a hashed version of 'Yndu@Admin2025!' - in production, use a proper password hashing function
            crypt('Yndu@Admin2025!', gen_salt('bf')),
            now(),
            'authenticated',
            '{"provider": "email", "providers": ["email"]}',
            '{"username": "sunda", "role": "admin"}',
            now(),
            now(),
            '',
            '',
            '',
            ''
        );
        
        RAISE NOTICE 'Admin user created with ID: %', admin_uid;
    ELSE
        -- Update the existing user to have admin role
        UPDATE auth.users 
        SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"admin"')
        WHERE id = admin_uid;
        
        RAISE NOTICE 'Existing admin user updated with ID: %', admin_uid;
    END IF;
    
    -- Create a profile for the admin user in the public schema if needed
    -- Uncomment and modify this section based on your application's schema
    /*
    INSERT INTO public.profiles (id, username, role)
    VALUES (admin_uid, 'sunda', 'admin')
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin';
    */
END $$;

-- Verify the admin user was created
SELECT id, email, raw_user_meta_data->>'role' as role 
FROM auth.users 
WHERE email = 'admin@example.com';
