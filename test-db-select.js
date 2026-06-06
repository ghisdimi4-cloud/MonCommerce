const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim().replace(/"/g, '');
  return acc;
}, {});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testSelect() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) console.error("ERROR SELECTING PRODUCTS:", error);
  else console.log("SUCCESS SELECTING:", data.length, "products found.");
}

testSelect();
