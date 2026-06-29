import pg from 'pg';

const dbPassword = 'ZUUtEtVPV0Kvks5T';
const host = '54.255.219.82'; // IP of AWS load balancer for pooler

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
    console.log('Connected to Supabase. Querying exams...');
    
    const res = await client.query('SELECT * FROM exams');
    console.log('Exams:');
    console.log(JSON.stringify(res.rows, null, 2));

    const resEvents = await client.query('SELECT * FROM events');
    console.log('Events:');
    console.log(JSON.stringify(resEvents.rows, null, 2));

    await client.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
