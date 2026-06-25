import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbPassword = process.env.SUPABASE_DB_PASSWORD || 'ZUUtEtVPV0Kvks5T';
const host = 'db.jeipvqyetmcqsxvliwpp.supabase.co';

console.log('Connecting to database to migrate exams table...');
const client = new pg.Client({
  connectionString: `postgresql://postgres:${dbPassword}@${host}:6543/postgres?sslmode=require`
});

async function run() {
  try {
    await client.connect();
    console.log('Connected successfully. Creating table public.exams...');

    // 1. Create public.exams table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.exams (
        id TEXT PRIMARY KEY,
        title_en TEXT NOT NULL,
        title_ru TEXT NOT NULL,
        description_en TEXT,
        description_ru TEXT,
        subject TEXT NOT NULL DEFAULT 'math',
        time_limit_sec INT NOT NULL DEFAULT 3600,
        is_active BOOLEAN NOT NULL DEFAULT true,
        require_parent_info BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
    console.log('Table public.exams verified/created.');

    // 2. Enable RLS and grants
    await client.query(`
      ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
      GRANT ALL ON public.exams TO anon;
      GRANT ALL ON public.exams TO authenticated;
      GRANT ALL ON public.exams TO service_role;
    `);
    console.log('RLS enabled and permissions granted on public.exams.');

    // 3. Create policies
    await client.query(`
      DROP POLICY IF EXISTS "Allow anon select exams" ON public.exams;
      DROP POLICY IF EXISTS "Allow anon insert exams" ON public.exams;
      DROP POLICY IF EXISTS "Allow anon update exams" ON public.exams;
      DROP POLICY IF EXISTS "Allow anon delete exams" ON public.exams;

      CREATE POLICY "Allow anon select exams" ON public.exams FOR SELECT TO anon USING (true);
      CREATE POLICY "Allow anon insert exams" ON public.exams FOR INSERT TO anon WITH CHECK (true);
      CREATE POLICY "Allow anon update exams" ON public.exams FOR UPDATE TO anon USING (true) WITH CHECK (true);
      CREATE POLICY "Allow anon delete exams" ON public.exams FOR DELETE TO anon USING (true);
    `);
    console.log('RLS policies configured for public.exams.');

    // 4. Alter public.questions table to reference public.exams
    console.log('Adding exam_id column to public.questions...');
    await client.query(`
      ALTER TABLE public.questions 
      ADD COLUMN IF NOT EXISTS exam_id TEXT REFERENCES public.exams(id) ON DELETE CASCADE;
    `);
    console.log('Column exam_id verified/added to public.questions.');

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
