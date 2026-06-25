import { createClient } from '@supabase/supabase-js';

const url = 'https://jeipvqyetmcqsxvliwpp.supabase.co';
const key = 'sb_publishable_xLw_44i9tOTEfWTGcDQ41Q_DLWbaC1o';

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.from('questions').select('*').limit(1);
  if (error) {
    console.error('Query error:', error.message);
  } else {
    console.log('Query success! Data:', data);
  }
}

run();
