import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jjlnhkutzzpcmhmrxpcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqbG5oa3V0enpwY21obXJ4cGN5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA5OTUzMSwiZXhwIjoyMDg5Njc1NTMxfQ.5ImIictcMLk3BC0Ho6jVDwrxhP-8nFqKycLj9EXdYD0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('--- Testing Profiles Table ---');
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error('PROFILES ERROR:', error);
  } else {
    console.log('PROFILES DATA:', data);
  }

  console.log('--- Testing Users ---');
  const { data: users, error: uErr } = await supabase.auth.admin.listUsers();
  if (uErr) {
    console.error('USERS ERROR:', uErr);
  } else {
    console.log('USERS FOUND:', users.users.length);
    console.log(users.users.map(u => ({ id: u.id, email: u.email, meta: u.user_metadata })));
  }
}

check();
