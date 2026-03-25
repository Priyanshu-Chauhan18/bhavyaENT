import { createAdminSupabaseClient } from '@/lib/db/server';

export type AdminUserRow = {
  id: string;
  full_name: string;
  company_name: string | null;
  phone: string | null;
  role_key: 'customer' | 'admin';
  is_active: boolean;
  created_at: string;
};

export async function getAdminUsersList(): Promise<AdminUserRow[]> {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch admin users list:', error);
    return [];
  }
  return data as AdminUserRow[];
}
