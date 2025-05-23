import { supabase } from './db';
import * as schema from '@shared/schema';

/**
 * This script creates all the necessary tables in Supabase based on your schema
 */
async function migrateToSupabase() {
  console.log('Starting migration to Supabase...');
  
  try {
    // Create users table
    console.log('Creating users table...');
    const createUsersResult = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          role TEXT NOT NULL DEFAULT 'customer',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
      `
    });
    
    if (createUsersResult.error) {
      console.error('Error creating users table:', createUsersResult.error);
    } else {
      console.log('✓ Users table created successfully');
    }
    
    // Create product_categories table
    console.log('Creating product_categories table...');
    const createCategoriesResult = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS product_categories (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT
        );
      `
    });
    
    if (createCategoriesResult.error) {
      console.error('Error creating product_categories table:', createCategoriesResult.error);
    } else {
      console.log('✓ Product categories table created successfully');
    }
    
    // Create products table
    console.log('Creating products table...');
    const createProductsResult = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          image_url TEXT,
          stock INTEGER NOT NULL DEFAULT 0,
          category_id INTEGER REFERENCES product_categories(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
      `
    });
    
    if (createProductsResult.error) {
      console.error('Error creating products table:', createProductsResult.error);
    } else {
      console.log('✓ Products table created successfully');
    }
    
    // Create order_status enum type
    console.log('Creating order_status enum type...');
    const createEnumResult = await supabase.rpc('execute_sql', {
      sql_query: `
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
            CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'delivered', 'cancelled');
          END IF;
        END
        $$;
      `
    });
    
    if (createEnumResult.error) {
      console.error('Error creating order_status enum:', createEnumResult.error);
    } else {
      console.log('✓ Order status enum created successfully');
    }
    
    // Create orders table
    console.log('Creating orders table...');
    const createOrdersResult = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          status order_status NOT NULL DEFAULT 'pending',
          total_amount DECIMAL(10, 2) NOT NULL,
          delivery_address TEXT NOT NULL,
          contact_phone TEXT NOT NULL,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
      `
    });
    
    if (createOrdersResult.error) {
      console.error('Error creating orders table:', createOrdersResult.error);
    } else {
      console.log('✓ Orders table created successfully');
    }
    
    // Create order_items table
    console.log('Creating order_items table...');
    const createOrderItemsResult = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id) NOT NULL,
          product_id INTEGER REFERENCES products(id) NOT NULL,
          quantity INTEGER NOT NULL,
          unit_price DECIMAL(10, 2) NOT NULL
        );
      `
    });
    
    if (createOrderItemsResult.error) {
      console.error('Error creating order_items table:', createOrderItemsResult.error);
    } else {
      console.log('✓ Order items table created successfully');
    }
    
    // Create farm_events table
    console.log('Creating farm_events table...');
    const createEventsResult = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS farm_events (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          event_date TIMESTAMP WITH TIME ZONE NOT NULL,
          start_time TEXT NOT NULL,
          end_time TEXT NOT NULL,
          location TEXT NOT NULL,
          image_url TEXT,
          category TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
      `
    });
    
    if (createEventsResult.error) {
      console.error('Error creating farm_events table:', createEventsResult.error);
    } else {
      console.log('✓ Farm events table created successfully');
    }
    
    // Create subscriptions table
    console.log('Creating subscriptions table...');
    const createSubscriptionsResult = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS subscriptions (
          id SERIAL PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          phone TEXT,
          active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
      `
    });
    
    if (createSubscriptionsResult.error) {
      console.error('Error creating subscriptions table:', createSubscriptionsResult.error);
    } else {
      console.log('✓ Subscriptions table created successfully');
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Unexpected error during migration:', error);
    console.log('You may need to enable the "pg_execute" extension in your Supabase project.');
    console.log('Go to the Supabase dashboard > Database > Extensions and enable pg_execute.');
  }
}

// Run the migration
migrateToSupabase()
  .then(() => console.log('Migration script completed'))
  .catch(err => console.error('Migration script failed:', err))
  .finally(() => process.exit());
