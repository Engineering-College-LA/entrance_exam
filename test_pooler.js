import pg from 'pg';

const dbPassword = 'ZUUtEtVPV0Kvks5T';
const host = 'aws-ap-southeast-1.pooler.supabase.com';

async function run() {
  const client = new pg.Client({
    host: host,
    port: 5432,
    user: 'postgres.jeipvqyetmcqsxvliwpp',
    password: dbPassword,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('🎉 SUCCESS! Connected to Supabase DB via pooler on port 5432!');
    await client.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

run();
