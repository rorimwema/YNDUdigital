import { supabase, db } from './db';
import * as schema from '@shared/schema';
import { supabaseConfig } from '@shared/config';

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Check Supabase project info
    console.log('Supabase Project Info:');
    console.log('URL:', supabaseConfig.url);
    
    // Check if we can connect to Supabase at all
    console.log('\nTesting basic Supabase connectivity:');
    const { data: serviceStatus, error: serviceError } = await supabase.from('_service_status').select('*');
    if (serviceError) {
      console.log('Could not connect to Supabase service status:', serviceError.message);
    } else {
      console.log('Successfully connected to Supabase!');
    }
    
    // List all tables in the public schema
    console.log('\nListing all tables in Supabase:');
    const { data, error } = await supabase.rpc('get_tables');
    
    if (error) {
      console.error('Error listing tables:', error);
      console.log('\nTrying alternative method to list tables...');
      
      // Try direct SQL query using system tables
      const { data: tables, error: tablesError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public');
      
      if (tablesError) {
        console.error('Error accessing pg_tables:', tablesError);
        console.log('\nFinal attempt to check tables...');
        
        // Try to access some common tables directly
        const tableNames = ['users', 'products', 'orders', 'product_categories'];
        for (const tableName of tableNames) {
          const { error: tableError } = await supabase.from(tableName).select('count(*)', { count: 'exact', head: true });
          console.log(`Table '${tableName}' exists: ${!tableError}`);
          if (tableError) {
            console.log(`  Error: ${tableError.message}`);
          }
        }
      } else {
        console.log('Tables found in public schema:', tables.map(t => t.tablename));
      }
    } else {
      console.log('Tables found:', data);
    }
    
    console.log('\nTo create tables in Supabase:');
    console.log('1. Go to https://app.supabase.com and open your project');
    console.log('2. Navigate to the SQL Editor');
    console.log('3. Copy and paste the SQL from supabase-schema.sql');
    console.log('4. Run the SQL to create all your tables');
    
  } catch (e) {
    console.error('Unexpected error:', e);
  }
}

// Run the test
testSupabaseConnection()
  .then(() => console.log('Test completed'))
  .catch(err => console.error('Test failed:', err))
  .finally(() => process.exit());
