import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
  const { data: cat } = await supabase.from('catalogs').select('id').limit(1);
  const { data: catg } = await supabase.from('categories').select('id').limit(1);
  const { data: prod } = await supabase.from('products').select('id').limit(1);
  console.log('Catalogs:', cat);
  console.log('Categories:', catg);
  console.log('Products:', prod);
}
run();
