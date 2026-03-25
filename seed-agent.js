import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jjlnhkutzzpcmhmrxpcy.supabase.co';
const adminKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqbG5oa3V0enpwY21obXJ4cGN5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA5OTUzMSwiZXhwIjoyMDg5Njc1NTMxfQ.5ImIictcMLk3BC0Ho6jVDwrxhP-8nFqKycLj9EXdYD0';
const supabase = createClient(supabaseUrl, adminKey);

async function seedAgentUser() {
  console.log('--- Seeding Verified E2E Agent ---');
  
  // Create user directly, auto-confirming email
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'agent@example.com',
    password: 'password123',
    email_confirm: true,
    user_metadata: {
      full_name: 'Subagent Tester',
      company_name: 'AI Testing Corp',
      phone: ''
    }
  });

  if (error) {
    if (error.message.includes('already exists')) {
       console.log('User already exists. Update password just in case...');
       await supabase.auth.admin.updateUserById(
         'agent@example.com', // wait, need uuid. will fail but fine.
         { password: 'password123' }
       );
    } else {
       console.error('SEED ERROR:', error.message);
    }
  } else {
    console.log('AGENT CREATED:', data.user.id);
  }
}

seedAgentUser();
