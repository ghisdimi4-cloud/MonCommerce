const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim().replace(/"/g, '');
  return acc;
}, {});

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const product = {
    id: `p${Date.now()}`,
    name: 'Test Product',
    category: 'Alimentation',
    price: 1000,
    stock: 10,
    status: 'Disponible',
    image: 'loading',
    purchaseprice: 800
  };

  console.log("Inserting:", product);
  const { data, error } = await supabase.from('products').insert([product]).select();
  if (error) {
    console.error("ERROR INSERTING PRODUCT:", error);
  } else {
    console.log("SUCCESS PRODUCT:", data);
  }

  const activity = {
    id: `act_${Date.now()}`,
    client: "Système",
    type: "Nouveau Produit",
    amount: product.name,
    status: "Succès",
    date: "A l'instant",
    cost: 0
  };
  const { data: actData, error: actError } = await supabase.from('activities').insert([activity]).select();
  if (actError) {
    console.error("ERROR INSERTING ACTIVITY:", actError);
  } else {
    console.log("SUCCESS ACTIVITY:", actData);
  }
}

testInsert();
