import { createClient } from '@supabase/supabase-js';

import { SUPABASE_URL, SUPABASE_SECRET_KEY } from './environment';

if (!SUPABASE_URL) {
  throw new Error('SUPABASE_URL is not defined');
}

if (!SUPABASE_SECRET_KEY) {
  throw new Error('SUPABASE_API_KEY is not defined');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);
