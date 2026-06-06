const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:9Z3u7uqej490lXMc@db.apuamfqkmnookungjwhm.supabase.co:5432/postgres'
});

async function run() {
  try {
    await client.connect();
    
    // Disable RLS on tables or create open policies
    // Disabling RLS is requested by SUPABASE_SETUP.md "La sécurité RLS est désactivée"
    
    const queries = [
      `ALTER TABLE "public"."products" DISABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE "public"."activities" DISABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE "public"."clients" DISABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE "public"."sales" DISABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE "public"."settings" DISABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE "public"."sale_items" DISABLE ROW LEVEL SECURITY;`
    ];

    for (let q of queries) {
      await client.query(q);
      console.log("Executed:", q);
    }
    
    console.log("All RLS disabled successfully.");
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

run();
