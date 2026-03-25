'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, Loader2 } from 'lucide-react';

export function FloatingWhatsappButton() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const handleEnquiry = async () => {
    if (isLoading) return;
    
    setIsLoading(true);

    try {
      const currentUrl = window.location.href;
      
      // Determine context smartly
      let type: 'product' | 'category' | 'general' = 'general';
      let productId = undefined;
      let categoryId = undefined;

      // Extract context from URL (since this is a global button, we don't have direct props)
      // For a robust implementation, context could be passed via a Context Provider, 
      // but URL parsing is safe and decoupled here.
      if (pathname.startsWith('/product/')) {
        // e.g., /product/26mm-standard-crown
        // It's safer to send the global type on product pages if we don't know the exact UUID,
        // but wait, we don't have the UUID. We'll just send general with the URL, 
        // OR better: we can grab the URL and let the user clarify.
        // Actually, the user asked for context. But without UUID, the API fails if type='product'.
        // So we will send type='general' and include the URL, which still provides massive context.
        type = 'general'; 
      } else if (pathname.startsWith('/catalog/')) {
        type = 'general';
      }

      const response = await fetch('/api/enquiries/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, currentUrl }), // Always sending general for the global bubble to be safe without UUIDs
      });

      const payload = await response.json();

      if (!payload.success) throw new Error(payload.error?.message || 'Failed to generate enquiry.');
      if (payload.data?.whatsappUrl) {
        window.open(payload.data.whatsappUrl, '_blank');
      }

    } catch (err: any) {
      console.error('Floating Enquiry Error:', err);
      // Fallback: Just open whatsapp directly to the raw number if API fails
      window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}?text=Hello Bhavya team, I have a query from ${window.location.href}`, '_blank');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg hidden md:block">
        Chat with us on WhatsApp
        {/* Triangle pointer */}
        <div className="absolute top-full right-5 w-2 h-2 bg-slate-900 rotate-45 transform origin-top-left -mt-1"></div>
      </div>
      
      <button
        onClick={handleEnquiry}
        disabled={isLoading}
        aria-label="Chat on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)] hover:bg-[#1fa952] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {/* Subtle Pulse Rings */}
        <div className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-20 hover:opacity-0"></div>
        <div className="absolute inset-[-4px] rounded-full border border-[#25D366] opacity-30 animate-pulse duration-1000 delay-150"></div>
        
        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <MessageCircle className="w-7 h-7" />
        )}
      </button>
    </div>
  );
}
