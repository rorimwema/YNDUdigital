import { supabase } from './client/src/utils/supabase';

async function createAdminUser() {
  try {
    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'sunda@yndufountain.com',
      password: 'Sunda@Admin2025!', // Strong password
      options: {
        data: {
          first_name: 'Sunda',
          last_name: 'Admin',
          role: 'admin'
        }
      }
    });
    
    if (authError) {
      console.error('Error creating auth user:', authError);
      return;
    }
    
    console.log('Auth user created:', authData);
    
    // 2. Insert the user into the users table with admin role
    if (authData.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            username: 'sunda',
            email: 'sunda@yndufountain.com',
            role: 'admin',
            created_at: new Date()
          }
        ]);
      
      if (userError) {
        console.error('Error creating user record:', userError);
        return;
      }
      
      console.log('Admin user created successfully!');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createAdminUser();
