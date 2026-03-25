import { Client } from 'pg';

const connectionString = 'postgresql://postgres:D3BvP2MB475ULZwu@db.jjlnhkutzzpcmhmrxpcy.supabase.co:5432/postgres';

async function verifyEnquiryLog() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('--- Database Audit Proof for Phase 6 Enquiry Logger ---');

    const res = await client.query(`
      SELECT e.id, e.user_id, e.product_id, e.generated_message, e.created_at, p.sku
      FROM public.enquiries e
      JOIN public.products p ON e.product_id = p.id
      ORDER BY e.created_at DESC
      LIMIT 1;
    `);

    if (res.rows.length === 0) {
      console.log('No enquiries logged! The Audit failed.');
    } else {
      console.log('Audit Success! Latest Row:');
      console.log(JSON.stringify(res.rows[0], null, 2));
    }
  } catch (err) {
    console.error('Audit Database Query Failed:', err.message);
  } finally {
    await client.end();
  }
}

verifyEnquiryLog();
