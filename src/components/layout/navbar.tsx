import { createServerSupabaseClient } from '@/lib/db/server';
import { NavbarClient } from './navbar-client';

export async function Navbar() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role = 'guest';
  if (user?.id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role_key')
      .eq('id', user.id)
      .single();
    if (profile) {
      role = profile.role_key;
    }
  }

  return <NavbarClient role={role} />;
}
