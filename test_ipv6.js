import pg from 'pg';
import dns from 'dns';

dns.setDefaultResultOrder('ipv6first');

const dbPassword = 'ZUUtEtVPV0Kvks5T';
const host = '2406:da1a:82a:9d01:8549:879c:3229:3d3c';

async function run() {
  const client = new pg.Client({
    host: host,
    port: 6543,
    user: 'postgres',
    password: dbPassword,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('🎉 SUCCESS! Connected directly to Supabase DB!');
    await client.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

run();
