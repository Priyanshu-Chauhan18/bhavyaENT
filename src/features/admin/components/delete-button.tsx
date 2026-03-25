'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { ActionResult } from '@/lib/api/action-response';

interface DeleteButtonProps {
  entityId: string;
  entityName: string;
  entityType: string;
  deleteAction: (id: string) => Promise<ActionResult<any>>;
  returnPath: string;
}

export function DeleteButton({ entityId, entityName, entityType, deleteAction, returnPath }: DeleteButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteAction(entityId);
      if (!result.success) {
        setError(result.error);
        setIsDeleting(false);
        return;
      }
      router.push(returnPath);
      router.refresh();
    } catch {
      setError('Unexpected error during deletion.');
      setIsDeleting(false);
    }
  };

  if (!showConfirm) {
    return (
      <button 
        onClick={() => setShowConfirm(true)}
        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors inline-block"
        title={`Delete ${entityType}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => !isDeleting && setShowConfirm(false)}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Delete {entityType}?</h3>
          <p className="text-sm text-slate-500 mt-2">
            Are you sure you want to permanently delete <strong className="text-slate-700">{entityName}</strong>? This action cannot be undone.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button 
            variant="outline" 
            className="flex-1 h-11" 
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-semibold"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</>
            ) : (
              <>Yes, Delete</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
