import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: catalogs } = await supabase.from('catalogs').select('*');
  console.log('Catalogs:', catalogs);
  const { data: categories } = await supabase.from('categories').select('*');
  console.log('Categories:', categories);
  const { data: products } = await supabase.from('products').select('*');
  console.log('Products:', products.length);
}
run();
