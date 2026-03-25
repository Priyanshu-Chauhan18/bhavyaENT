'use client';

import { useState } from 'react';
import { MessageCircle, Loader2 } from 'lucide-react';

export function WhatsappEnquiryButton({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEnquiry = async () => {
    if (isLoading) return; // Explicit duplicate-click protection
    
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const currentUrl = window.location.href;

      const response = await fetch('/api/enquiries/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'product', productId, currentUrl }),
      });

      const payload = await response.json();

      if (!payload.success) {
        // Fallback catch for API standard envelope errors
        throw new Error(payload.error?.message || 'Failed to generate enquiry. Please try again.');
      }

      if (payload.data?.whatsappUrl) {
        // Drop the user onto WhatsApp
        window.open(payload.data.whatsappUrl, '_blank');
      } else {
        throw new Error('Message generated but redirect URL was missing.');
      }

    } catch (err: any) {
      console.error('Enquiry Error:', err);
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-6">
      <button
        onClick={handleEnquiry}
        disabled={isLoading}
        className="w-full relative group overflow-hidden bg-[#25D366] text-white font-semibold flex items-center justify-center gap-2 px-8 py-4 rounded-xl hover:bg-[#1fa952] active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100"
      >
        {/* Subtle hover gradient wash */}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating Secure Link...</span>
          </>
        ) : (
          <>
            <MessageCircle className="w-5 h-5" />
            <span>Enquire on WhatsApp</span>
          </>
        )}
      </button>
      
      {/* Trust micro-copy */}
      <p className="text-center text-xs text-slate-500 mt-1 font-medium flex items-center justify-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
        Speak directly with our team • Avg reply: 10 mins
      </p>

      {errorMsg && (
        <p className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 mt-2">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
