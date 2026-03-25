const { createClient } = require('@supabase/supabase-js');
// using node --env-file
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateSEO() {
  console.log('Fetching site_settings...');
  const { data, error } = await supabase.from('site_settings').select('*');
  
  if (error) {
    console.error('Error fetching:', error);
    return;
  }

  const tables = ['products', 'categories'];
  for (const table of tables) {
    console.log(`Checking ${table}...`);
    const { data: rows } = await supabase.from(table).select('*');
    if (!rows) continue;
    
    const dbUpdates = [];
    for (const row of rows) {
      let needsUpdate = false;
      let newRow = { ...row };
      
      const checkAndReplace = (field) => {
        if (newRow[field] && typeof newRow[field] === 'string' &&
            (newRow[field].includes('BottleCap') || newRow[field].includes('Avtaran'))) {
          newRow[field] = newRow[field]
            .replace(/BottleCap Industries/g, 'Bhavya closures')
            .replace(/BottleCap/g, 'Bhavya closures')
            .replace(/Avtaran/g, 'Bhavya')
            .replace(/avtaranmanufacturing\.com/g, 'bhavya.com');
          needsUpdate = true;
        }
      };

      checkAndReplace('meta_title');
      checkAndReplace('meta_description');
      checkAndReplace('name');
      checkAndReplace('short_description');
      
      if (needsUpdate) {
        console.log(`Updating ${table} row ${row.slug || row.id}`);
        dbUpdates.push(newRow);
      }
    }
    
    if (dbUpdates.length > 0) {
      await supabase.from(table).upsert(dbUpdates);
      console.log(`Successfully updated ${dbUpdates.length} rows in ${table}!`);
    } else {
      console.log(`No outdated SEO found in ${table}.`);
    }
  }
}

updateSEO();
