import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let finalUrl = supabaseUrl;
if (!finalUrl || finalUrl === 'YOUR_SUPABASE_URL_HERE' || !finalUrl.startsWith('http')) {
  console.warn('⚠️ Supabase credentials are missing or invalid. Please add a valid VITE_SUPABASE_URL to your .env file.');
  finalUrl = 'https://placeholder-project.supabase.co';
}

let finalKey = supabaseAnonKey;
if (!finalKey || finalKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
  finalKey = 'placeholder-anon-key';
}

export const supabase = createClient(finalUrl, finalKey);
