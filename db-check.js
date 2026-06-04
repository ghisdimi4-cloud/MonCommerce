const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:9Z3u7uqej490lXMc@db.apuamfqkmnookungjwhm.supabase.co:5432/postgres'
});

async function run() {
  try {
    await client.connect();
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('TABLES:', res.rows.map(r => r.table_name));
  } catch (err) {
    console.error('Error connecting or querying:', err.message);
  } finally {
    await client.end();
  }
}

run();
