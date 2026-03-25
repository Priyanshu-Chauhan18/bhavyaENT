import { createServerSupabaseClient } from '@/lib/db/server';

/**
 * Logs the successfully generated WhatsApp enquiry securely to the DB.
 * Failures here are gracefully swallowed so they do not hard-block the user's redirect intent.
 */
export async function logEnquiry(
  userId: string,
  productId: string,
  generatedMessage: string
): Promise<void> {
  try {
    const supabase = await createServerSupabaseClient();
    
    await supabase.from('enquiries').insert({
      user_id: userId,
      product_id: productId,
      channel: 'whatsapp',
      generated_message: generatedMessage,
    });
  } catch (error) {
    console.error('Failed to log enquiry, but continuing redirect flow:', error);
  }
}
