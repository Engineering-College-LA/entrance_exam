import pg from 'pg';

const dbPassword = 'ZUUtEtVPV0Kvks5T';
const host = 'aws-0-ap-southeast-1.pooler.supabase.com';

const options = [
  { user: 'postgres.jeipvqyetmcqsxvliwpp', database: 'postgres', useSslServername: false },
  { user: 'postgres.jeipvqyetmcqsxvliwpp', database: 'postgres', useSslServername: true },
  { user: 'postgres.jeipvqyetmcqsxvliwpp', database: 'postgres.jeipvqyetmcqsxvliwpp', useSslServername: false },
  { user: 'postgres', database: 'postgres', useSslServername: true }
];

async function run() {
  for (let i = 0; i < options.length; i++) {
    const opt = options[i];
    console.log(`\nTesting option ${i + 1}: user=${opt.user}, database=${opt.database}, useSslServername=${opt.useSslServername}`);
    const ssl = { rejectUnauthorized: false };
    if (opt.useSslServername) {
      ssl.servername = 'db.jeipvqyetmcqsxvliwpp.supabase.co';
    }
    const client = new pg.Client({
      host,
      port: 6543,
      user: opt.user,
      password: dbPassword,
      database: opt.database,
      ssl
    });

    try {
      await client.connect();
      console.log(`🎉 SUCCESS! Connected with Option ${i + 1}!`);
      await client.end();
      return;
    } catch (err) {
      console.log(`Option ${i + 1} failed:`, err.message);
    }
  }
}

run();
