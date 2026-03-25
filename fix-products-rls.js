import { Client } from 'pg';

const connectionString = 'postgresql://postgres:D3BvP2MB475ULZwu@db.jjlnhkutzzpcmhmrxpcy.supabase.co:5432/postgres';

async function fixProductRls() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('--- Applying Product RLS Fix ---');

    await client.query(`
      -- Grant authenticated users the right to SELECT active, published products
      DROP POLICY IF EXISTS "Allow authenticated read on active published products" ON public.products;
      CREATE POLICY "Allow authenticated read on active published products"
      ON public.products FOR SELECT
      TO authenticated
      USING (is_active = true AND publish_status = 'published');

      -- Grant authenticated users the right to SELECT all active specs (private and public)
      DROP POLICY IF EXISTS "Allow authenticated read on all specs" ON public.product_specs;
      CREATE POLICY "Allow authenticated read on all specs"
      ON public.product_specs FOR SELECT
      TO authenticated
      USING (true);
    `);

    console.log('--- Fixing Done ---');
  } catch (err) {
    console.error('FIX FAILED:', err.message);
  } finally {
    await client.end();
  }
}

fixProductRls();
