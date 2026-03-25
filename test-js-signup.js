import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jjlnhkutzzpcmhmrxpcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqbG5oa3V0enpwY21obXJ4cGN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTk1MzEsImV4cCI6MjA4OTY3NTUzMX0._4BOIuZANaceGYa38NuxGld1UnH4j_fRM5Uzs1DqXrg'; // ANON KEY
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignUp() {
  console.log('--- Testing JS Sign Up ---');
  
  const { data, error } = await supabase.auth.signUp({
    email: 'js-trigger-test@example.com',
    password: 'Password123!',
    options: {
      data: {
        full_name: 'JS Test User',
        company_name: '',
        phone: ''
      }
    }
  });

  if (error) {
    console.error('SIGN UP FAILED:', error.message);
    return;
  }
  
  console.log('User created:', data.user?.id);
  
  // Now check if profile exists (using anon key it will fail due to RLS unless we sign in? Wait, signUp returns a session if email confirm is off. If email confirm is on, session is null, and anon key selects will return 0 rows).
  // We'll use the Admin client to verify existence directly.
  const adminKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqbG5oa3V0enpwY21obXJ4cGN5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA5OTUzMSwiZXhwIjoyMDg5Njc1NTMxfQ.5ImIictcMLk3BC0Ho6jVDwrxhP-8nFqKycLj9EXdYD0';
  const adminClient = createClient(supabaseUrl, adminKey);
  
  const { data: profile } = await adminClient.from('profiles').select('*').eq('id', data.user.id).single();
  console.log('Profile created by JS Trigger?', profile ? 'YES' : 'NO');
}

testSignUp();
