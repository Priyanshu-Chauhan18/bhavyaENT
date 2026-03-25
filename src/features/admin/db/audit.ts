import { createAdminSupabaseClient } from '@/lib/db/server';

export type AdminAuditLogRow = {
  id: string;
  actor_user_id: string | null;
  entity_type: string;
  entity_id: string | null;
  action: string;
  before_json: any;
  after_json: any;
  created_at: string;
  actor: { full_name: string } | null;
};

export type AuditLogFilters = {
  entityType?: string;
  action?: string;
};

export async function getAdminAuditLogsList(filters?: AuditLogFilters): Promise<AdminAuditLogRow[]> {
  const supabase = createAdminSupabaseClient();
  
  let query = supabase
    .from('audit_logs')
    .select(`
      *,
      actor:profiles(full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  // Apply filters
  if (filters?.entityType) {
    query = query.eq('entity_type', filters.entityType);
  }
  if (filters?.action) {
    query = query.eq('action', filters.action);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to fetch admin audit logs:', error);
    return [];
  }

  return data.map((row: any) => ({
    ...row,
    actor: row.actor ? { full_name: row.actor.full_name } : null
  })) as AdminAuditLogRow[];
}

/**
 * Get distinct entity types and actions for filter dropdowns.
 */
export async function getAuditLogFilterOptions(): Promise<{ entityTypes: string[]; actions: string[] }> {
  const supabase = createAdminSupabaseClient();

  const [entityResult, actionResult] = await Promise.all([
    supabase.from('audit_logs').select('entity_type').order('entity_type'),
    supabase.from('audit_logs').select('action').order('action')
  ]);

  const entityTypes = Array.from(new Set((entityResult.data || []).map((r: any) => String(r.entity_type)))) as string[];
  const actions = Array.from(new Set((actionResult.data || []).map((r: any) => String(r.action)))) as string[];

  return { entityTypes, actions };
}
