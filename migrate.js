import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbPassword = process.env.SUPABASE_DB_PASSWORD || 'ZUUtEtVPV0Kvks5T';
const host = 'db.jeipvqyetmcqsxvliwpp.supabase.co';

console.log('Connecting to database...');
const client = new pg.Client({
  connectionString: `postgresql://postgres:${dbPassword}@${host}:6543/postgres?sslmode=require`
});

async function run() {
  try {
    await client.connect();
    console.log('Connected successfully. Running migration SQL...');

    // 1. Create events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.events (
        id TEXT PRIMARY KEY,
        title_ru TEXT NOT NULL,
        title_en TEXT NOT NULL,
        desc_ru TEXT NOT NULL,
        desc_en TEXT NOT NULL,
        date_ru TEXT NOT NULL,
        date_en TEXT NOT NULL,
        time_ru TEXT NOT NULL,
        time_en TEXT NOT NULL,
        format_ru TEXT NOT NULL,
        format_en TEXT NOT NULL,
        req_ru TEXT NOT NULL,
        req_en TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
    console.log('Table public.events verified/created.');

    // 2. Add event_id to open_door_registrations
    await client.query(`
      ALTER TABLE public.open_door_registrations 
      ADD COLUMN IF NOT EXISTS event_id TEXT;
    `);
    console.log('Column event_id verified/added to public.open_door_registrations.');

    // 3. Add foreign key index (optional but good practice)
    try {
      await client.query(`
        ALTER TABLE public.open_door_registrations
        ADD CONSTRAINT fk_open_door_registrations_event
        FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE SET NULL;
      `);
      console.log('Foreign key constraint fk_open_door_registrations_event added.');
    } catch (fkErr) {
      // Might already exist
      console.log('Foreign key constraint might already exist or skipped:', fkErr.message);
    }

    // 4. Enable RLS on events and grant permissions
    await client.query(`
      ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
      GRANT ALL ON public.events TO anon;
      GRANT ALL ON public.events TO authenticated;
      GRANT ALL ON public.events TO service_role;
    `);
    console.log('RLS enabled and permissions granted.');

    // 5. Create RLS Policies
    await client.query(`
      DROP POLICY IF EXISTS "Allow anon select events" ON public.events;
      DROP POLICY IF EXISTS "Allow anon insert events" ON public.events;
      DROP POLICY IF EXISTS "Allow anon update events" ON public.events;
      DROP POLICY IF EXISTS "Allow anon delete events" ON public.events;

      CREATE POLICY "Allow anon select events" ON public.events FOR SELECT TO anon USING (true);
      CREATE POLICY "Allow anon insert events" ON public.events FOR INSERT TO anon WITH CHECK (true);
      CREATE POLICY "Allow anon update events" ON public.events FOR UPDATE TO anon USING (true) WITH CHECK (true);
      CREATE POLICY "Allow anon delete events" ON public.events FOR DELETE TO anon USING (true);
    `);
    console.log('RLS policies configured.');

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
