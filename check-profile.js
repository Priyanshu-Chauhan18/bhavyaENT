import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if(!supabaseUrl || !supabaseKey) { console.error("Missing ENV"); process.exit(1); }

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data: users, error: uErr } = await supabase.auth.admin.listUsers()
  console.log('--- ALL USERS ---')
  console.log(users?.users?.map(u => ({ id: u.id, email: u.email, meta: u.raw_user_meta_data })))
  
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('*')
  console.log('--- ALL PROFILES ---')
  console.log(profiles)
  console.log('Profile Fetch Error:', pErr)
}
test()
