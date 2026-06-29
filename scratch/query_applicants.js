import pg from 'pg';

const dbPassword = 'ZUUtEtVPV0Kvks5T';
const host = 'aws-0-ap-southeast-1.pooler.supabase.com';

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
    console.log('Connected to Supabase. Querying applicants...');
    const res = await client.query('SELECT count(*), completed_at::date as date FROM applicants GROUP BY completed_at::date ORDER BY date DESC');
    console.log('Applicant counts by date:');
    console.log(res.rows);
    
    const countNull = await client.query('SELECT count(*) FROM applicants WHERE completed_at IS NULL');
    console.log('Applicants with null completed_at:', countNull.rows[0].count);

    const selectSample = await client.query('SELECT first_name, last_name, completed_at, exam_type FROM applicants ORDER BY completed_at DESC LIMIT 15');
    console.log('Sample applicants:');
    console.log(selectSample.rows);

    await client.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
