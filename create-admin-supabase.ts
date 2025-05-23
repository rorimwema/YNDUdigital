import { createClient } from '@supabase/supabase-js';

// Supabase configuration from shared config
const supabaseUrl = 'https://notbndkdvyuxavvarcbj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdGJuZGtkdnl1eGF2dmFyY2JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MjkxMDcsImV4cCI6MjA2MzUwNTEwN30.c2sEJoqYa4mrWOB8QAkQLArKgssnPxDXvycJgM15E40';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  try {
    console.log('Creating admin user in Supabase Auth...');
    
    // Admin user details
    const email = 'sunda@example.com'; // Using a standard email format that will pass validation
    const password = 'Yndu@Admin2025!';
    
    // Create the admin user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: 'sunda',
          role: 'admin'
        }
      }
    });
    
    if (error) {
      // Check if the error is because the user already exists
      if (error.message.includes('already registered')) {
        console.log('Admin user already exists in Supabase Auth');
        
        // Try to sign in with the credentials to verify
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.error('Error signing in as admin user:', signInError.message);
          console.log('If you forgot the password, use the password reset functionality in Supabase dashboard');
        } else {
          console.log('Successfully signed in as admin user');
          console.log('User ID:', signInData.user?.id);
          console.log('Email:', signInData.user?.email);
          console.log('Role:', signInData.user?.user_metadata?.role);
          
          // Sign out after verification
          await supabase.auth.signOut();
        }
      } else {
        console.error('Error creating admin user:', error.message);
      }
      return;
    }
    
    console.log('Admin user created successfully in Supabase Auth');
    console.log('User ID:', data.user?.id);
    console.log('Email:', data.user?.email);
    console.log('Role:', data.user?.user_metadata?.role);
    
    // Note: In a real production environment, you would need to confirm the user's email
    // Here we're assuming the user will confirm via the email link
    console.log('\nIMPORTANT: Check the email inbox for sunda@yndufountain.com to confirm the account');
    
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
  }
}

createAdminUser();
