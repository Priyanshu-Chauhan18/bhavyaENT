import { Client } from 'pg';

const connectionString = 'postgresql://postgres:D3BvP2MB475ULZwu@db.jjlnhkutzzpcmhmrxpcy.supabase.co:5432/postgres';

async function elevate() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const userRes = await client.query(`SELECT id FROM auth.users WHERE email = 'agent@example.com' LIMIT 1`);
    if (userRes.rows.length === 0) throw new Error('User missing from auth.users!');
    const userId = userRes.rows[0].id;

    await client.query(`
      UPDATE public.profiles 
      SET role_key = 'admin' 
      WHERE id = $1
    `, [userId]);

    console.log('Successfully mapped strictly to Admin privilege!');

  } catch(e) {
    console.error('Failed to elevate:', e.message);
  } finally {
    await client.end();
  }
}

elevate();
