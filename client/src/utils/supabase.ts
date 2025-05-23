import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@shared/config";

// Use the shared configuration file
const supabaseUrl = supabaseConfig.url;
const supabaseKey = supabaseConfig.anonKey;

export const supabase = createClient(supabaseUrl, supabaseKey);
