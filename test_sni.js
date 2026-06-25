import pg from 'pg';

const dbPassword = 'ZUUtEtVPV0Kvks5T';
const host = 'aws-0-ap-southeast-1.pooler.supabase.com';

async function run() {
  const client = new pg.Client({
    host: host,
    port: 6543,
    user: 'postgres',
    password: dbPassword,
    database: 'postgres',
    ssl: {
      rejectUnauthorized: false,
      servername: 'db.jeipvqyetmcqsxvliwpp.supabase.co'
    }
  });

  try {
    await client.connect();
    console.log('🎉 SUCCESS! Connected to Supabase DB via pooler using SNI!');
    await client.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

run();
