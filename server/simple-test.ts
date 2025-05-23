import { supabase } from './db';

async function simpleTest() {
  console.log('Running simple Supabase test...');
  
  try {
    // 1. Check if we can connect to Supabase
    console.log('1. Testing Supabase connection...');
    
    // 2. Try to query the users table directly
    console.log('\n2. Checking if users table exists:');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (usersError) {
      console.log('Error accessing users table:', usersError.message);
      console.log('Users table does not exist or is not accessible.');
    } else {
      console.log('Users table exists!');
      console.log('Users data:', usersData);
    }
    
    // 3. Try to query the products table directly
    console.log('\n3. Checking if products table exists:');
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (productsError) {
      console.log('Error accessing products table:', productsError.message);
      console.log('Products table does not exist or is not accessible.');
    } else {
      console.log('Products table exists!');
      console.log('Products data:', productsData);
    }
    
    // 4. Try to query the product_categories table directly
    console.log('\n4. Checking if product_categories table exists:');
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('product_categories')
      .select('*')
      .limit(1);
    
    if (categoriesError) {
      console.log('Error accessing product_categories table:', categoriesError.message);
      console.log('Product_categories table does not exist or is not accessible.');
    } else {
      console.log('Product_categories table exists!');
      console.log('Categories data:', categoriesData);
    }
    
    // 5. Try to query the orders table directly
    console.log('\n5. Checking if orders table exists:');
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1);
    
    if (ordersError) {
      console.log('Error accessing orders table:', ordersError.message);
      console.log('Orders table does not exist or is not accessible.');
    } else {
      console.log('Orders table exists!');
      console.log('Orders data:', ordersData);
    }
    
  } catch (e) {
    console.error('Unexpected error:', e);
  }
}

// Run the test
simpleTest()
  .then(() => console.log('Simple test completed'))
  .catch(err => console.error('Simple test failed:', err))
  .finally(() => process.exit());
