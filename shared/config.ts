// Supabase configuration
// Load environment variables from .env file if in Node.js environment
const getEnvVariable = (key: string, defaultValue: string = ''): string => {
  // Check if we're in a browser or Node.js environment
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  
  // For client-side, use the NEXT_PUBLIC_ prefixed variables
  if (typeof window !== 'undefined') {
    const clientKey = `NEXT_PUBLIC_${key}`;
    // @ts-ignore - Access window environment variables
    return window[clientKey] || defaultValue;
  }
  
  return defaultValue;
};

export const supabaseConfig = {
  url: getEnvVariable('SUPABASE_URL', ''),
  anonKey: getEnvVariable('SUPABASE_KEY', ''),
  dbPassword: getEnvVariable('SUPABASE_DB_PASSWORD', '')
};
