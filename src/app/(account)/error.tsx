'use client';

import Link from 'next/link';
import { ShieldAlert, UserX } from 'lucide-react';
import { ROUTES } from '@/lib/config/constants';

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isInactive = error.message?.includes('inactive') || 
                     error.message?.includes('FORBIDDEN_INACTIVE_USER');
  const isUnauth = error.message?.includes('Unauthorized') || 
                   error.message?.includes('UNAUTHORIZED');

  if (isInactive) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 max-w-md w-full p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
            <UserX className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Account Inactive</h1>
          <p className="text-slate-500 mb-6">
            Your account has been deactivated. Please contact the administrator to restore access.
          </p>
          <Link 
            href={ROUTES.CONTACT}
            className="inline-flex items-center justify-center bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-all w-full"
          >
            Contact Support
          </Link>
        </div>
      </div>
    );
  }

  if (isUnauth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 max-w-md w-full p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Login Required</h1>
          <p className="text-slate-500 mb-6">
            You need to sign in to access your account.
          </p>
          <Link 
            href={ROUTES.SIGN_IN}
            className="inline-flex items-center justify-center bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-all w-full"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Generic fallback
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 max-w-md w-full p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Something Went Wrong</h1>
        <p className="text-slate-500 mb-6">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <button 
          onClick={() => reset()}
          className="inline-flex items-center justify-center bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-all w-full"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
