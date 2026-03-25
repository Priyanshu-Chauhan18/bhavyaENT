import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jjlnhkutzzpcmhmrxpcy.supabase.co';
const adminKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqbG5oa3V0enpwY21obXJ4cGN5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA5OTUzMSwiZXhwIjoyMDg5Njc1NTMxfQ.5ImIictcMLk3BC0Ho6jVDwrxhP-8nFqKycLj9EXdYD0';
const adminClient = createClient(supabaseUrl, adminKey);

async function testInsert() {
  console.log('--- Testing Admin Profile Insert ---');
  // testperson123@gmail.com ID
  const userId = '817b6725-84fb-4c1d-a011-6575fc61ab2f';
  
  const { data, error } = await adminClient.from('profiles').insert({
    id: userId,
    full_name: 'Test Failure',
    company_name: '',
    phone: '',
    role_key: 'customer',
    is_active: true
  }).select();

  if (error) {
    console.error('ADMIN INSERT ERROR:', JSON.stringify(error, null, 2));
  } else {
    console.log('ADMIN INSERT SUCCESS:', data);
  }
}
testInsert();
