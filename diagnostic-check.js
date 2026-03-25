import { Client } from 'pg';

const connectionString = 'postgresql://postgres:D3BvP2MB475ULZwu@db.jjlnhkutzzpcmhmrxpcy.supabase.co:5432/postgres';

async function checkTrigger() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('--- Checking profiles for 5bf233e4 ---');
    
    const res = await client.query(`
      SELECT * FROM public.profiles WHERE id = '5bf233e4-2eac-4c08-9af3-52c4b3456068';
    `);
    
    console.log('Profile found:', res.rows.length);
    if(res.rows.length > 0) console.log(res.rows[0]);

  } catch (err) {
    console.error('QUERY FAILED:', err.message);
  } finally {
    await client.end();
  }
}

checkTrigger();
