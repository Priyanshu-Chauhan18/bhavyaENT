import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jjlnhkutzzpcmhmrxpcy.supabase.co';
const adminKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqbG5oa3V0enpwY21obXJ4cGN5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA5OTUzMSwiZXhwIjoyMDg5Njc1NTMxfQ.5ImIictcMLk3BC0Ho6jVDwrxhP-8nFqKycLj9EXdYD0';
const supabase = createClient(supabaseUrl, adminKey);

async function testFetch() {
  const productId = 'd1111111-0000-0000-0000-000000000001';
  const categoryId = 'c1111111-1111-1111-1111-111111111111';

  let orClause = `product_id.eq.${productId},is_default.eq.true`;
  if (categoryId) {
    orClause += `,category_id.eq.${categoryId}`;
  }

  const { data: templates, error } = await supabase
    .from('enquiry_templates')
    .select('id, product_id, category_id, is_default, template_text, whatsapp_number')
    .eq('is_active', true)
    .or(orClause);

  console.log('Resulting Data:', templates);
  console.log('Resulting Error:', error?.message);
}

testFetch();
