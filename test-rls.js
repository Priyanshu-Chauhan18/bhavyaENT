import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jjlnhkutzzpcmhmrxpcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqbG5oa3V0enpwY21obXJ4cGN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTk1MzEsImV4cCI6MjA4OTY3NTUzMX0._4BOIuZANaceGYa38NuxGld1UnH4j_fRM5Uzs1DqXrg'; 
const supabase = createClient(supabaseUrl, supabaseKey);

async function testRls() {
  console.log('--- Testing RLS ---');
  // Log in with priyanshu's account assuming email confirmation is not an issue if we just sign in
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'priyanshuchauhan1729@gmail.com',
    password: 'password123' // assuming default test password, or we can use another user
  });

  if (authErr) {
    console.error('Login Failed', authErr.message);
    return;
  }
  
  console.log('Logged in as:', authData.user.id);
  
  // Now query profiles WITH the user's JWT
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileErr) {
    console.error('RLS/Profile ERROR:', JSON.stringify(profileErr, null, 2));
  } else {
    console.log('RLS/Profile SUCCESS:', profile);
  }
}

testRls();
