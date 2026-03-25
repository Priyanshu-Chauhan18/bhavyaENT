import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jjlnhkutzzpcmhmrxpcy.supabase.co';
const adminKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqbG5oa3V0enpwY21obXJ4cGN5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA5OTUzMSwiZXhwIjoyMDg5Njc1NTMxfQ.5ImIictcMLk3BC0Ho6jVDwrxhP-8nFqKycLj9EXdYD0';

const supabase = createClient(supabaseUrl, adminKey);

async function seedTestTemplates() {
  console.log('--- Injecting Product-Specific Template ---');
  await supabase.from('enquiry_templates').upsert({
    id: 'e1111111-1111-1111-1111-111111111111',
    product_id: 'd1111111-0000-0000-0000-000000000001', // 26mm Crown
    template_name: 'Product Specific Crown Template',
    template_text: 'PRODUCT_OVERRIDE_MATCH: Hi, I want the {{product_name}} ({{sku}}) in {{color}}! My name is {{user_name}}.',
    whatsapp_number: '+19999999999',
    is_active: true
  });
  console.log('--- Ready for Browser Agent ---');
}

seedTestTemplates();
