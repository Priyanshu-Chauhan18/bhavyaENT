import { Client } from 'pg';

const connectionString = 'postgresql://postgres:D3BvP2MB475ULZwu@db.jjlnhkutzzpcmhmrxpcy.supabase.co:5432/postgres';

async function check() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('--- Triggers on auth.users ---');
    const res = await client.query(`
      SELECT tgname, tgenabled, tgtype 
      FROM pg_trigger t
      JOIN pg_class c ON t.tgrelid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE c.relname = 'users' AND n.nspname = 'auth';
    `);
    console.log(res.rows);

    console.log('--- Trigger Function Definition ---');
    const funcRes = await client.query(`
      SELECT prosrc 
      FROM pg_proc 
      WHERE proname = 'handle_new_user';
    `);
    console.log(funcRes.rows);
  } catch (err) {
    console.error('PG ERROR:', err);
  } finally {
    await client.end();
  }
}

check();
