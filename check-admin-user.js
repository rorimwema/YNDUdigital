// Script to check and create admin user in Supabase
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://notbndkdvyuxavvarcbj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdGJuZGtkdnl1eGF2dmFyY2JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MjkxMDcsImV4cCI6MjA2MzUwNTEwN30.c2sEJoqYa4mrWOB8QAkQLArKgssnPxDXvycJgM15E40';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdminUser() {
  console.log('Checking admin user in Supabase...');
  
  try {
    // Try to sign in with admin credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'Yndu@Admin2025!'
    });
    
    if (error) {
      console.error('Error signing in:', error.message);
      
      if (error.message.includes('Invalid login credentials')) {
        console.log('Admin user does not exist or has incorrect password. Creating new admin user...');
        
        // Create new admin user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: 'admin@example.com',
          password: 'Yndu@Admin2025!',
          options: {
            data: {
              username: 'admin',
              role: 'admin'
            }
          }
        });
        
        if (signUpError) {
          console.error('Error creating admin user:', signUpError.message);
        } else {
          console.log('Admin user created successfully!');
          console.log('User ID:', signUpData.user.id);
          console.log('Email:', signUpData.user.email);
          console.log('Role:', signUpData.user.user_metadata.role);
          console.log('\nIMPORTANT: Check the email inbox for admin@example.com to confirm the account');
        }
      }
    } else {
      console.log('Successfully signed in as admin user');
      console.log('User ID:', data.user.id);
      console.log('Email:', data.user.email);
      console.log('Role:', data.user.user_metadata.role);
      
      // Sign out after verification
      await supabase.auth.signOut();
    }
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

checkAdminUser();
