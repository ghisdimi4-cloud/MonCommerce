const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim().replace(/"/g, '');
  return acc;
}, {});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testAuthInsert() {
  // 1. Try to sign up a dummy user to get an authenticated session
  const email = `test_${Date.now()}@example.com`;
  const password = "testpassword123";
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError) {
    console.error("ERROR SIGNING UP:", authError);
    return;
  }
  console.log("SUCCESS SIGNING UP! Authenticated user ID:", authData.user.id);

  // 2. Try the insert with the authenticated session
  const product = {
    id: `p${Date.now()}`,
    name: 'Test Product Auth',
    category: 'Alimentation',
    price: 1000,
    stock: 10,
    status: 'Disponible',
    image: 'loading',
    purchaseprice: 800
  };

  console.log("Inserting as authenticated:", product);
  const { data, error } = await supabase.from('products').insert([product]).select();
  
  if (error) {
    console.error("ERROR INSERTING PRODUCT (AUTH):", error);
  } else {
    console.log("SUCCESS PRODUCT (AUTH):", data);
  }
}

testAuthInsert();
