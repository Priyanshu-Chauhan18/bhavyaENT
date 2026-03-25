import { Client } from 'pg';

const connectionString = 'postgresql://postgres:D3BvP2MB475ULZwu@db.jjlnhkutzzpcmhmrxpcy.supabase.co:5432/postgres';

async function testTrigger() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('--- Triggering auth.users INSERT ---');
    
    // Generate a random UUID
    const randomUuid = crypto.randomUUID();
    
    const res = await client.query(`
      INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, raw_user_meta_data)
      VALUES (
        $1, 
        '00000000-0000-0000-0000-000000000000', 
        'authenticated', 
        'authenticated', 
        'test-trigger-xyz@example.com', 
        'xxxxx',
        '{"full_name": "Test Trigger", "company_name": "", "phone": ""}'::jsonb
      )
      RETURNING id;
    `, [randomUuid]);
    
    console.log('Inserted user ID:', res.rows[0].id);

  } catch (err) {
    console.error('INSERT FAILED:', err.message);
  } finally {
    await client.end();
  }
}

testTrigger();
