'use client';

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { ROUTES } from '@/lib/config/constants';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const is403 = error.message?.includes('Administrator access required') || 
                error.message?.includes('Unauthorized') ||
                error.message?.includes('FORBIDDEN');

  if (is403) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 max-w-md w-full p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-500 mb-6">
            You don&apos;t have administrator privileges to access this section. Please contact your system administrator if you believe this is an error.
          </p>
          <div className="flex flex-col gap-3">
            <Link 
              href={ROUTES.ACCOUNT}
              className="inline-flex items-center justify-center bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
            >
              Go to My Account
            </Link>
            <Link 
              href={ROUTES.HOME}
              className="inline-flex items-center justify-center text-slate-600 font-medium px-6 py-3 rounded-lg hover:bg-slate-100 transition-all"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Generic error fallback
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 max-w-md w-full p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Something Went Wrong</h1>
        <p className="text-slate-500 mb-6">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => reset()}
            className="inline-flex items-center justify-center bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
          >
            Try Again
          </button>
          <Link 
            href={ROUTES.HOME}
            className="inline-flex items-center justify-center text-slate-600 font-medium px-6 py-3 rounded-lg hover:bg-slate-100 transition-all"
          >
            Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
