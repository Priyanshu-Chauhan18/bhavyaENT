import { Client } from 'pg';

const connectionString = 'postgresql://postgres:D3BvP2MB475ULZwu@db.jjlnhkutzzpcmhmrxpcy.supabase.co:5432/postgres';

async function testRLS() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('--- Testing RLS Recursion ---');
    
    // Simulate authenticated role
    await client.query("SET ROLE authenticated;");
    // Set auth.uid() to priyanshuchauhan1729's UUID
    await client.query("SET request.jwt.claim.sub TO 'd5a91d33-6697-4be8-9ae3-abb5ba49d4c2';");
    
    // Execute the exact query requireAuth() tries
    const res = await client.query("SELECT * FROM public.profiles WHERE id = 'd5a91d33-6697-4be8-9ae3-abb5ba49d4c2';");
    
    console.log('RLS SUCCESS! Found:', res.rows.length);

  } catch (err) {
    console.error('RLS FAILED EXACTLY AS PREDICTED:', err.message);
  } finally {
    await client.end();
  }
}

testRLS();
