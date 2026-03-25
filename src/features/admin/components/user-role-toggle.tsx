'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleUserRoleAction } from '../actions/users';
import { Loader2, ArrowLeftRight } from 'lucide-react';

export function UserRoleToggle({ 
  profileId, 
  currentRole 
}: { 
  profileId: string; 
  currentRole: 'admin' | 'customer';
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async () => {
    setIsPending(true);
    try {
      const res = await toggleUserRoleAction(profileId, currentRole);
      if (!res.success) {
        alert(res.error); // Simple fallback for edge cases
      } else {
        router.refresh(); // Update grid without losing scroll
      }
    } catch (e) {
      alert('Network failure syncing identity roles.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors
        ${currentRole === 'admin' 
          ? 'bg-slate-50 text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200' 
          : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600'
        }
      `}
      title={`Currently ${currentRole}. Click to toggle.`}
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <ArrowLeftRight className="w-3.5 h-3.5" /> 
      )}
      {currentRole === 'admin' ? 'Demote' : 'Elevate'}
    </button>
  );
}
