import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Debug logging to help identify the issue
console.log('Environment variables:', {
  supabaseUrl: supabaseUrl ? 'Present' : 'Missing',
  supabaseKey: supabaseKey ? 'Present' : 'Missing',
});

if (!supabaseUrl) {
  throw new Error('REACT_APP_SUPABASE_URL is not defined. Please check your .env file.');
}

if (!supabaseKey) {
  throw new Error('REACT_APP_SUPABASE_ANON_KEY is not defined. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
