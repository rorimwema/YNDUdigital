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
    const email = 'sunda@yndufountain.com';
    const password = 'Yndu@Admin2025!';
    
    // First check if the user already exists
    const { data: existingUser, error: checkError } = await supabase.auth.admin.getUserByEmail(email);
    
    if (checkError && checkError.message !== 'User not found') {
      console.error('Error checking for existing user:', checkError.message);
      return;
    }
    
    if (existingUser) {
      console.log('Admin user already exists in Supabase Auth');
      
      // Update user metadata to ensure admin role
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { user_metadata: { role: 'admin' } }
      );
      
      if (updateError) {
        console.error('Error updating user role:', updateError.message);
      } else {
        console.log('Admin role updated successfully');
      }
      
      return;
    }
    
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
      console.error('Error creating admin user:', error.message);
      return;
    }
    
    console.log('Admin user created successfully in Supabase Auth');
    console.log('User ID:', data.user.id);
    console.log('Email:', data.user.email);
    console.log('Role:', data.user.user_metadata.role);
    
    // Note: In a real production environment, you would need to confirm the user's email
    // Here we're assuming the user will confirm via the email link
    console.log('\nIMPORTANT: Check the email inbox for sunda@yndufountain.com to confirm the account');
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

createAdminUser();
