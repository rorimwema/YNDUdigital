// Script to create a test user in Supabase
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://notbndkdvyuxavvarcbj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdGJuZGtkdnl1eGF2dmFyY2JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MjkxMDcsImV4cCI6MjA2MzUwNTEwN30.c2sEJoqYa4mrWOB8QAkQLArKgssnPxDXvycJgM15E40';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUser() {
  console.log('Creating test user in Supabase...');
  
  try {
    // Test user details
    const email = 'test@example.com';
    const password = 'Test123!';
    
    // Create the test user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: 'testuser',
          role: 'customer'
        }
      }
    });
    
    if (error) {
      console.error('Error creating test user:', error.message);
      return;
    }
    
    console.log('Test user created successfully!');
    console.log('User ID:', data.user.id);
    console.log('Email:', data.user.email);
    console.log('Role:', data.user.user_metadata.role);
    console.log('\nIMPORTANT: Check the email inbox for test@example.com to confirm the account');
    console.log('\nLogin credentials:');
    console.log('Email: test@example.com');
    console.log('Password: Test123!');
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

createTestUser();
