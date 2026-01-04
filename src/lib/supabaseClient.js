import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'REACT_APP_SUPABASE_URL is not defined. Please create a .env file in the project root ' +
    'and add your Supabase project URL. You can find this in your Supabase dashboard ' +
    'under Project Settings > API.'
  );
}

if (!supabaseKey) {
  throw new Error(
    'REACT_APP_SUPABASE_ANON_KEY is not defined. Please create a .env file in the project root ' +
    'and add your Supabase anon key. You can find this in your Supabase dashboard ' +
    'under Project Settings > API.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
