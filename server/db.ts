import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";
import { supabaseConfig } from "@shared/config";

// Use the shared configuration file
const supabaseUrl = supabaseConfig.url;
const supabaseKey = supabaseConfig.anonKey;
const dbPassword = supabaseConfig.dbPassword;

console.log('Using Supabase configuration from shared config file');

// Create Supabase client for auth and storage
export const supabase = createClient(supabaseUrl, supabaseKey);

// For database operations, we'll use the Supabase PostgreSQL connection
// For Supabase, we'll use the Supabase client directly for database operations
// instead of trying to connect to the PostgreSQL database directly

// This approach uses the Supabase Data API which is more reliable than direct PostgreSQL connections
export const db = {
  // Create a query method that uses Supabase's data API
  async query(tableName: string, query: any = {}) {
    const { data, error } = await supabase
      .from(tableName)
      .select(query.select || '*')
      .limit(query.limit || 50);
      
    if (error) throw error;
    return data;
  },
  
  // Wrapper methods for common operations
  async select() {
    return {
      from: (table: any) => ({
        limit: (limit: number) => db.query(table._.name.name, { limit })
      })
    };
  },
  
  // Add more methods as needed for your application
};

// Log that we're using the Supabase Data API
console.log('Using Supabase Data API for database operations');