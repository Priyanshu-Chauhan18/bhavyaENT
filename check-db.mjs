import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: catalogs } = await supabase.from('catalogs').select('id, name, is_active');
  console.log('Catalogs:', catalogs);
  
  const { data: categories } = await supabase.from('categories').select('id, name, is_active, catalog_id');
  console.log('Categories:', categories);
  
  const { data: products } = await supabase.from('products').select('id, name, is_active, category_id, publish_status');
  console.log('Products:', products.map(p => ({
    name: p.name,
    is_active: p.is_active,
    published: p.publish_status,
    category_id: p.category_id
  })));
}
run();
