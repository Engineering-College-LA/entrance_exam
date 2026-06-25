import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbPassword = process.env.SUPABASE_DB_PASSWORD || 'ZUUtEtVPV0Kvks5T';
const host = 'db.jeipvqyetmcqsxvliwpp.supabase.co';

console.log('Connecting to database for questions migration...');
const client = new pg.Client({
  connectionString: `postgresql://postgres:${dbPassword}@${host}:6543/postgres?sslmode=require`
});

const BASE_QUESTIONS = [
  // Fractions
  { topic: "FRACTIONS", topicKey: "topic.fractions", text: "3/4 + 1/4 =", textRu: "3/4 + 1/4 =", opts: ["3/8", "1", "4/5", "1/2"], correct: 1 },
  { topic: "FRACTIONS", topicKey: "topic.fractions", text: "5/6 − 1/3 =", textRu: "5/6 − 1/3 =", opts: ["1/2", "2/3", "1/3", "4/6"], correct: 0 },
  { topic: "FRACTIONS", topicKey: "topic.fractions", text: "3/5 ÷ 9/10 =", textRu: "3/5 ÷ 9/10 =", opts: ["2/3", "5/6", "2/5", "3/2"], correct: 0 },
  // Linear Equations
  { topic: "LINEAR_EQUATIONS", topicKey: "topic.linearEquations", text: "x + 7 = 12, find x", textRu: "x + 7 = 12", opts: ["3", "4", "5", "6"], correct: 2 },
  { topic: "LINEAR_EQUATIONS", topicKey: "topic.linearEquations", text: "3x = 18, find x", textRu: "3x = 18", opts: ["3", "6", "9", "12"], correct: 1 },
  { topic: "LINEAR_EQUATIONS", topicKey: "topic.linearEquations", text: "2x + 5 = 17, find x", textRu: "2x + 5 = 17", opts: ["5", "6", "7", "8"], correct: 1 },
  // Geometry
  { topic: "GEOMETRY", topicKey: "topic.geometry", text: "The sum of angles in a triangle is:", textRu: "Сумма углов треугольника равна:", opts: ["90°", "180°", "270°", "360°"], correct: 1 },
  { topic: "GEOMETRY", topicKey: "topic.geometry", text: "Rectangle: length 8, width 5. Find the area.", textRu: "Прямоугольник: длина 8, ширина 5. Найдите площадь.", opts: ["13", "26", "40", "80"], correct: 2 },
  { topic: "GEOMETRY", topicKey: "topic.geometry", text: "The legs of a right triangle are 6 and 8. Find the hypotenuse.", textRu: "Катеты прямоугольного треугольника 6 и 8. Найдите гипотенузу.", opts: ["10", "12", "14", "16"], correct: 0 },
  // Algebraic Identities
  { topic: "IDENTITIES", topicKey: "topic.identities", text: "(a + b)² =", textRu: "(a + b)² =", opts: ["a² + b²", "a² + 2ab + b²", "a² − b²", "2a² + b²"], correct: 1 },
  { topic: "IDENTITIES", topicKey: "topic.identities", text: "(5 + x)² =", textRu: "(5 + x)² =", opts: ["x² + 10x + 25", "x² + 5x + 25", "x² + 25", "x² + 10x"], correct: 0 },
  { topic: "IDENTITIES", topicKey: "topic.identities", text: "(3x − 2)² =", textRu: "(3x − 2)² =", opts: ["9x² − 12x + 4", "9x² − 4", "9x² − 6x + 4", "6x² − 12x + 4"], correct: 0 },
  // Order of Operations
  { topic: "ORDER_OF_OPS", topicKey: "topic.orderOfOps", text: "5 + 3 × 2 =", textRu: "5 + 3 × 2 =", opts: ["16", "11", "10", "13"], correct: 1 },
  { topic: "ORDER_OF_OPS", topicKey: "topic.orderOfOps", text: "(8 + 4) ÷ 3 =", textRu: "(8 + 4) ÷ 3 =", opts: ["4", "6", "3", "12"], correct: 0 },
  { topic: "ORDER_OF_OPS", topicKey: "topic.orderOfOps", text: "6 + 4(5 − 2)² =", textRu: "6 + 4(5 − 2)² =", opts: ["30", "42", "18", "36"], correct: 1 },
  // Decimals
  { topic: "DECIMALS", topicKey: "topic.decimals", text: "0.5 + 0.3 =", textRu: "0.5 + 0.3 =", opts: ["0.8", "0.53", "0.15", "0.35"], correct: 0 },
  { topic: "DECIMALS", topicKey: "topic.decimals", text: "1.2 × 3 =", textRu: "1.2 × 3 =", opts: ["3.2", "3.6", "4.2", "3.8"], correct: 1 },
  { topic: "DECIMALS", topicKey: "topic.decimals", text: "4.5 ÷ 0.5 =", textRu: "4.5 ÷ 0.5 =", opts: ["2.25", "4", "9", "8"], correct: 2 },
  // Powers
  { topic: "POWERS", topicKey: "topic.powers", text: "2³ =", textRu: "2³ =", opts: ["6", "8", "9", "16"], correct: 1 },
  { topic: "POWERS", topicKey: "topic.powers", text: "3⁴ =", textRu: "3⁴ =", opts: ["12", "27", "64", "81"], correct: 3 },
  { topic: "POWERS", topicKey: "topic.powers", text: "2³ × 2⁴ =", textRu: "2³ × 2⁴ =", opts: ["16", "64", "128", "256"], correct: 2 },
  // Square Roots
  { topic: "ROOTS", topicKey: "topic.roots", text: "√36 =", textRu: "√36 =", opts: ["4", "5", "6", "8"], correct: 2 },
  { topic: "ROOTS", topicKey: "topic.roots", text: "√121 =", textRu: "√121 =", opts: ["9", "10", "11", "12"], correct: 2 },
  { topic: "ROOTS", topicKey: "topic.roots", text: "√(144 + 81) =", textRu: "√(144 + 81) =", opts: ["12", "13", "15", "17"], correct: 2 },
  // Percentages
  { topic: "PERCENTAGES", topicKey: "topic.percentages", text: "25% of 80 =", textRu: "25% от 80 =", opts: ["10", "15", "20", "25"], correct: 2 },
  { topic: "PERCENTAGES", topicKey: "topic.percentages", text: "A shirt costs $50. Discount 20%. New price:", textRu: "Рубашка стоит $50. Скидка 20%. Новая цена:", opts: ["$30", "$35", "$40", "$45"], correct: 2 },
  { topic: "PERCENTAGES", topicKey: "topic.percentages", text: "A number increased from 80 to 100. Percentage increase:", textRu: "Число увеличилось с 80 до 100. Процент увеличения:", opts: ["20%", "25%", "30%", "40%"], correct: 1 },
  // Sequences
  { topic: "SEQUENCES", topicKey: "topic.sequences", text: "2, 4, 6, 8, ___", textRu: "2, 4, 6, 8, ___", opts: ["9", "10", "11", "12"], correct: 1 },
  { topic: "SEQUENCES", topicKey: "topic.sequences", text: "3, 6, 12, 24, ___", textRu: "3, 6, 12, 24, ___", opts: ["36", "42", "48", "60"], correct: 2 },
  { topic: "SEQUENCES", topicKey: "topic.sequences", text: "1, 4, 9, 16, ___", textRu: "1, 4, 9, 16, ___", opts: ["20", "24", "25", "36"], correct: 2 }
];

const EXTRA_QUESTIONS = [
  { topic: "ROOTS", topicKey: "topic.roots", text: "√64 =", textRu: "√64 =", opts: ["8", "16", "32", "64"], correct: 0 },
  { topic: "LINEAR_EQUATIONS", topicKey: "topic.linearEquations", text: "2x + 5 = 13", textRu: "2x + 5 = 13", opts: ["2", "3", "6", "4"], correct: 3 },
  { topic: "DECIMALS", topicKey: "topic.decimals", text: "0.35 as a fraction =", textRu: "0.35 в виде дроби =", opts: ["7/20", "7/10", "3/5", "1/4"], correct: 0 },
  { topic: "PERCENTAGES", topicKey: "topic.percentages", text: "3/4 as a percentage =", textRu: "3/4 в процентах =", opts: ["25%", "33.33%", "65%", "75%"], correct: 3 },
  { topic: "DECIMALS", topicKey: "topic.decimals", text: "12.5 ÷ 2.5 =", textRu: "12.5 ÷ 2.5 =", opts: ["15", "10", "7", "5"], correct: 3 },
  { topic: "PERCENTAGES", topicKey: "topic.percentages", text: "15% of 240 =", textRu: "15% от 240 =", opts: ["36", "48", "60", "72"], correct: 0 },
  { topic: "IDENTITIES", topicKey: "topic.identities", text: "x² = 81. Find x.", textRu: "x² = 81. Найдите x.", opts: ["±9", "±10", "±11", "±12"], correct: 0 },
  { topic: "PERCENTAGES", topicKey: "topic.percentages", text: "Price is 2500. Discount 20%. New price:", textRu: "Цена 2500 сом. Скидка 20%. Новая цена:", opts: ["1500", "2000", "2500", "3000"], correct: 1 },
  { topic: "WORD_PROBLEMS", topicKey: "topic.wordProblems", text: "A train travels 60 km/h. How far in 2.5 hours?", textRu: "Поезд едет 60 км/ч. Сколько за 2.5 часа?", opts: ["120", "135", "150", "165"], correct: 2 },
  { topic: "GEOMETRY", topicKey: "topic.geometry", text: "Area is 120 m², length is 15 m. Find the width.", textRu: "Площадь 120 м², длина 15 м. Найдите ширину.", opts: ["8", "9", "10", "11"], correct: 0 },
  { topic: "RATIOS", topicKey: "topic.ratios", text: "12 buns need 2 cups of flour. How many cups for 30 buns?", textRu: "12 булочек = 2 чашки муки. Сколько на 30 булочек?", opts: ["3", "4", "5", "6"], correct: 2 },
  { topic: "ORDER_OF_OPS", topicKey: "topic.orderOfOps", text: "20 + 20 × 0.5 =", textRu: "20 + 20 × 0.5 =", opts: ["25", "14", "28", "30"], correct: 3 },
  { topic: "SEQUENCES", topicKey: "topic.sequences", text: "2, 6, 12, 20, ___", textRu: "2, 6, 12, 20, ___", opts: ["24", "30", "36", "40"], correct: 1 },
  { topic: "LOGIC", topicKey: "topic.logic", text: "Tom is taller than Jerry. Jerry is shorter than Bob but taller than Alice. Who is the shortest?", textRu: "Том выше Джерри. Джерри ниже Боба, но выше Алисы. Кто самый низкий?", opts: ["Tom", "Jerry", "Bob", "Alice"], optsRu: ["Том", "Джерри", "Боб", "Алиса"], correct: 3 },
  { topic: "FUNCTIONS", topicKey: "topic.functions", text: "f(x) = 2x + 3. Find f(4).", textRu: "f(x) = 2x + 3. Найдите f(4).", opts: ["7", "11", "5", "9"], correct: 1 }
];

async function run() {
  try {
    await client.connect();
    console.log('Connected successfully. Creating table public.questions...');

    // Create public.questions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.questions (
        id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        topic TEXT NOT NULL,
        topic_key TEXT,
        text TEXT NOT NULL,
        text_ru TEXT,
        opts TEXT[] NOT NULL,
        opts_ru TEXT[],
        correct INT NOT NULL,
        exam_type TEXT NOT NULL DEFAULT 'all',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
    console.log('Table public.questions verified/created.');

    // Enable RLS and grants
    await client.query(`
      ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
      GRANT ALL ON public.questions TO anon;
      GRANT ALL ON public.questions TO authenticated;
      GRANT ALL ON public.questions TO service_role;
    `);
    console.log('RLS enabled and permissions granted on public.questions.');

    // Create policies
    await client.query(`
      DROP POLICY IF EXISTS "Allow anon select questions" ON public.questions;
      DROP POLICY IF EXISTS "Allow anon insert questions" ON public.questions;
      DROP POLICY IF EXISTS "Allow anon update questions" ON public.questions;
      DROP POLICY IF EXISTS "Allow anon delete questions" ON public.questions;

      CREATE POLICY "Allow anon select questions" ON public.questions FOR SELECT TO anon USING (true);
      CREATE POLICY "Allow anon insert questions" ON public.questions FOR INSERT TO anon WITH CHECK (true);
      CREATE POLICY "Allow anon update questions" ON public.questions FOR UPDATE TO anon USING (true) WITH CHECK (true);
      CREATE POLICY "Allow anon delete questions" ON public.questions FOR DELETE TO anon USING (true);
    `);
    console.log('RLS policies configured.');

    // Check if table is empty
    const checkEmpty = await client.query('SELECT COUNT(*) FROM public.questions;');
    const count = parseInt(checkEmpty.rows[0].count, 10);
    
    if (count === 0) {
      console.log('Table is empty. Populating with default questions...');

      // Insert base questions (exam_type = 'all')
      for (const q of BASE_QUESTIONS) {
        await client.query(
          `INSERT INTO public.questions (topic, topic_key, text, text_ru, opts, opts_ru, correct, exam_type)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
          [q.topic, q.topicKey, q.text, q.textRu, q.opts, q.optsRu || q.opts, q.correct, 'all']
        );
      }

      // Insert extra questions (exam_type = 'placement')
      for (const q of EXTRA_QUESTIONS) {
        await client.query(
          `INSERT INTO public.questions (topic, topic_key, text, text_ru, opts, opts_ru, correct, exam_type)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
          [q.topic, q.topicKey, q.text, q.textRu, q.opts, q.optsRu || q.opts, q.correct, 'placement']
        );
      }

      console.log(`Successfully populated public.questions table with ${BASE_QUESTIONS.length + EXTRA_QUESTIONS.length} default questions.`);
    } else {
      console.log(`Table already has ${count} questions. Skipping population.`);
    }

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
