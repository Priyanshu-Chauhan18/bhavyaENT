import { Client } from 'pg';

const connectionString = 'postgresql://postgres:D3BvP2MB475ULZwu@db.jjlnhkutzzpcmhmrxpcy.supabase.co:5432/postgres';

async function fixRls() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('--- Applying RLS Fix ---');

    await client.query(`
      CREATE OR REPLACE FUNCTION public.is_admin()
      RETURNS boolean
      LANGUAGE plpgsql
      SECURITY DEFINER SET search_path = public
      AS $$
      BEGIN
        RETURN EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role_key = 'admin'
        );
      END;
      $$;
    `);

    await client.query(`
      DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
      CREATE POLICY "Admins can read all profiles" 
      ON public.profiles FOR SELECT 
      TO authenticated 
      USING (public.is_admin());

      DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
      CREATE POLICY "Admins can update all profiles" 
      ON public.profiles FOR UPDATE 
      TO authenticated 
      USING (public.is_admin());
    `);

    console.log('--- Fixing Done ---');
  } catch (err) {
    console.error('FIX FAILED:', err.message);
  } finally {
    await client.end();
  }
}

fixRls();
