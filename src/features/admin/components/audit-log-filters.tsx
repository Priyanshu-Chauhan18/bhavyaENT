'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function AuditLogFilters({ 
  entityTypes, 
  actions 
}: { 
  entityTypes: string[]; 
  actions: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentEntity = searchParams.get('entity') || '';
  const currentAction = searchParams.get('action') || '';

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const clearAll = () => {
    router.push('?');
  };

  const hasFilters = currentEntity || currentAction;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select 
        value={currentEntity}
        onChange={(e) => updateFilter('entity', e.target.value)}
        className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
      >
        <option value="">All Entities</option>
        {entityTypes.map(t => (
          <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
        ))}
      </select>

      <select 
        value={currentAction}
        onChange={(e) => updateFilter('action', e.target.value)}
        className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
      >
        <option value="">All Actions</option>
        {actions.map(a => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      {hasFilters && (
        <button 
          onClick={clearAll}
          className="text-sm text-slate-500 hover:text-red-600 transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
