import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
console.log('URL:', supabaseUrl)
if(!supabaseUrl) process.exit(0);

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data: users, error: uErr } = await supabase.auth.admin.listUsers()
  console.log('Users:', users?.users?.length, uErr)
  
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('*')
  console.log('Profiles:', profiles?.length, pErr)
  console.log('Profiles data:', profiles)
}
test()
