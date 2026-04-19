import { Client } from 'pg';

const connectionString = 'postgresql://postgres:D3BvP2MB475ULZwu@db.jjlnhkutzzpcmhmrxpcy.supabase.co:5432/postgres';

async function fixProductRls() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('--- Applying Product RLS Fix ---');

    await client.query(`
      -- Grant public (anon + authenticated) the right to SELECT active, published products
      DROP POLICY IF EXISTS "Allow authenticated read on active published products" ON public.products;
      DROP POLICY IF EXISTS "Allow public read on active published products" ON public.products;
      CREATE POLICY "Allow public read on active published products"
      ON public.products FOR SELECT
      TO anon, authenticated
      USING (is_active = true AND publish_status = 'published');

      -- Grant public (anon + authenticated) the right to SELECT all active specs
      DROP POLICY IF EXISTS "Allow authenticated read on all specs" ON public.product_specs;
      DROP POLICY IF EXISTS "Allow public read on all specs" ON public.product_specs;
      CREATE POLICY "Allow public read on all specs"
      ON public.product_specs FOR SELECT
      TO anon, authenticated
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
