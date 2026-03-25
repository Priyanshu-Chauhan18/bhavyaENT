import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jjlnhkutzzpcmhmrxpcy.supabase.co';
const adminKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqbG5oa3V0enpwY21obXJ4cGN5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA5OTUzMSwiZXhwIjoyMDg5Njc1NTMxfQ.5ImIictcMLk3BC0Ho6jVDwrxhP-8nFqKycLj9EXdYD0';

const supabase = createClient(supabaseUrl, adminKey);

// Target base product: '26mm Standard Crown' (id: d1111111-0000-0000-0000-000000000001)

async function runVerification() {
  console.log('--- 1. Injecting Product-Specific Template ---');
  await supabase.from('enquiry_templates').insert({
    product_id: 'd1111111-0000-0000-0000-000000000001',
    template_name: 'Product Specific Crown Template',
    template_text: 'PRODUCT_OVERRIDE_MATCH: Hi, I want the {{product_name}} ({{sku}}) in {{color}}!',
    whatsapp_number: '+19999999999',
    is_active: true
  });

  console.log('--- 2. Authenticating Agent User ---');
  // We use standard auth sign in to get the session string
  const authClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy'); 
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'agent@example.com',
    password: 'password123'
  });

  if (authErr) {
    console.error('Failed to auth agent:', authErr.message);
    return;
  }

  // To hit localhost:3000 Next.js exactly as the browser does, we must map the Cookie
  // Supabase SSR uses sb-[project]-auth-token
  const cookieName = 'sb-jjlnhkutzzpcmhmrxpcy-auth-token';
  const cookieValue = JSON.stringify([
    authData.session.access_token,
    authData.session.refresh_token,
    '', '', ''
  ]);
  
  const encodedCookie = `${cookieName}=${encodeURIComponent(cookieValue)}`;

  console.log('--- 3. Triggering API Route to Build URL ---');
  try {
    const res = await fetch('http://localhost:3000/api/enquiries/preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': encodedCookie
      },
      body: JSON.stringify({
        productId: 'd1111111-0000-0000-0000-000000000001',
        currentUrl: 'http://localhost:3000/product/26mm-standard-crown'
      })
    });

    const data = await res.json();
    console.log('API Response Status:', res.status);
    console.log('API Returned Data:', data);
  } catch(e) {
    console.error('Fetch crashed:', e);
  }

  console.log('--- 4. Checking Postgres Database Enquiries Tabe ---');
  const { data: enquiries, error: dbErr } = await supabase
    .from('enquiries')
    .select('*')
    .eq('user_id', authData.user.id);
    
  console.log('DB Read Result Error:', dbErr?.message || 'None');
  console.log('Enquiries Row Count:', enquiries?.length || 0);

  if (enquiries && enquiries.length > 0) {
    console.log('LATEST ENQUIRY:', enquiries[0].generated_message);
  }

  // Cleanup testing template
  await supabase.from('enquiry_templates').delete().eq('product_id', 'd1111111-0000-0000-0000-000000000001');
}

runVerification();
