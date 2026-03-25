import { Suspense } from 'react';
import { getAdminAuditLogsList, getAuditLogFilterOptions } from '@/features/admin/db/audit';
import { AuditLogFilters } from '@/features/admin/components/audit-log-filters';
import { ShieldCheck, Database, Trash2, Edit, Plus } from 'lucide-react';

function ActionIcon({ action }: { action: string }) {
  const normalized = action.toLowerCase();
  
  if (normalized === 'create' || normalized === 'insert') {
    return <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shadow-sm"><Plus className="w-4 h-4" /></div>;
  }
  if (normalized === 'update' || normalized === 'edit') {
    return <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shadow-sm"><Edit className="w-4 h-4" /></div>;
  }
  if (normalized === 'archive' || normalized === 'delete') {
    return <div className="p-2 bg-red-100 text-red-700 rounded-lg shadow-sm"><Trash2 className="w-4 h-4" /></div>;
  }
  return <div className="p-2 bg-slate-100 text-slate-700 rounded-lg shadow-sm"><Database className="w-4 h-4" /></div>;
}

export default async function AdminAuditLogsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ entity?: string; action?: string }> 
}) {
  const params = await searchParams;
  
  const [logs, filterOptions] = await Promise.all([
    getAdminAuditLogsList({
      entityType: params.entity || undefined,
      action: params.action || undefined
    }),
    getAuditLogFilterOptions()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Audit Trace</h1>
          <p className="text-sm text-slate-500 mt-1">Immutable chronological ledger of all privileged administrative mutations.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <Suspense fallback={<div className="text-sm text-slate-400">Loading filters...</div>}>
          <AuditLogFilters 
            entityTypes={filterOptions.entityTypes} 
            actions={filterOptions.actions} 
          />
        </Suspense>
      </div>

      <div className="bg-white border text-sm border-slate-200 shadow-sm rounded-xl overflow-hidden p-6 max-w-5xl">
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          
          {logs.length === 0 ? (
            <div className="text-center text-slate-500 py-12">
              {(params.entity || params.action) 
                ? 'No audit logs match the current filters.' 
                : 'No mutations tracked yet.'}
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                {/* Timeline Icon Marker */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                  <ActionIcon action={log.action} />
                </div>
                
                {/* Event Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-800 capitalize tracking-tight flex items-center gap-1.5">
                      {log.action} <span className="text-slate-400 font-normal">on {log.entity_type.replace(/_/g, ' ')}</span>
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="text-sm text-slate-600 space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">{log.actor?.full_name || 'Unknown'}</span> 
                      <span className="text-slate-400 text-xs">(ID: {log.actor_user_id?.split('-')[0]}...)</span>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 overflow-x-auto">
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                         <div>
                           <div className="text-slate-400 mb-1 border-b border-slate-200 pb-1">Previous Snapshot</div>
                           <pre className="text-slate-600 break-words whitespace-pre-wrap">{log.before_json ? JSON.stringify(log.before_json, null, 2).substring(0, 100) + '...' : '{ null }'}</pre>
                         </div>
                         <div>
                           <div className="text-emerald-500 mb-1 border-b border-emerald-100 pb-1">Committed Payload</div>
                           <pre className="text-slate-700 break-words whitespace-pre-wrap">{log.after_json ? JSON.stringify(log.after_json, null, 2).substring(0, 100) + '...' : '{ null }'}</pre>
                         </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
}
