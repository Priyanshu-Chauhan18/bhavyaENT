require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data: users, error: err1 } = await supabase.auth.admin.listUsers();
  console.log("Users:", users?.users?.map(u => ({ id: u.id, email: u.email })));
  
  const { data: profiles, error: err2 } = await supabase.from('profiles').select('id, role_key');
  console.log("Profiles:", profiles);
}
check();
