import { Client } from 'pg';

const connectionString = 'postgresql://postgres:D3BvP2MB475ULZwu@db.jjlnhkutzzpcmhmrxpcy.supabase.co:5432/postgres';

async function fixEnquiryRls() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('--- Applying Phase 6 Enquiry RLS Fixes ---');

    await client.query(`
      -- 1. Grant authenticated users the right to SELECT active templates
      DROP POLICY IF EXISTS "Allow authenticated read on active templates" ON public.enquiry_templates;
      CREATE POLICY "Allow authenticated read on active templates"
      ON public.enquiry_templates FOR SELECT
      TO authenticated
      USING (is_active = true);

      -- 2. Grant authenticated users the right to INSERT into enquiries mapping to their own ID
      DROP POLICY IF EXISTS "Allow authenticated insert to own enquiries" ON public.enquiries;
      CREATE POLICY "Allow authenticated insert to own enquiries"
      ON public.enquiries FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);

      -- 3. Grant authenticated users the right to SELECT their own enquiries
      DROP POLICY IF EXISTS "Allow authenticated select on own enquiries" ON public.enquiries;
      CREATE POLICY "Allow authenticated select on own enquiries"
      ON public.enquiries FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
    `);

    console.log('--- RLS Fixes Patched! ---');
  } catch (err) {
    console.error('FIX FAILED:', err.message);
  } finally {
    await client.end();
  }
}

fixEnquiryRls();
