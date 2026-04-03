/* ── Questions, Registration Fields, Exam Rules ── */

const BASE_QUESTIONS = [
  // Дроби
  { topic: "FRACTIONS", text: "3/4 + 1/4 =", opts: ["3/8", "1", "4/5", "1/2"], correct: 1 },
  { topic: "FRACTIONS", text: "5/6 - 1/3 =", opts: ["1/2", "2/3", "3/6", "4/6"], correct: 0 },
  { topic: "FRACTIONS", text: "3/5 ÷ 9/10 =", opts: ["2/3", "5/6", "2/5", "3/2"], correct: 0 },

  // Линейные уравнения
  { topic: "LINEAR_EQUATIONS", text: "x + 7 = 12", opts: ["3", "4", "5", "6"], correct: 2 },
  { topic: "LINEAR_EQUATIONS", text: "3x = 18", opts: ["3", "6", "9", "12"], correct: 1 },
  { topic: "LINEAR_EQUATIONS", text: "2x + 5 = 17", opts: ["5", "6", "7", "8"], correct: 1 },

  // Геометрия
  { topic: "GEOMETRY", text: "Сумма углов треугольника равна:", opts: ["90°", "180°", "270°", "360°"], correct: 1 },
  { topic: "GEOMETRY", text: "Прямоугольник: длина 8, ширина 5. Найдите площадь.", opts: ["13", "26", "40", "80"], correct: 2 },
  { topic: "GEOMETRY", text: "Катеты прямоугольного треугольника 6 и 8. Найдите гипотенузу.", opts: ["10", "12", "14", "16"], correct: 0 },

  // Алгебраические тождества
  { topic: "IDENTITIES", text: "(a + b)^2 =", opts: ["a² + b²", "a² + 2ab + b²", "a² − b²", "2a² + b²"], correct: 1 },
  { topic: "IDENTITIES", text: "(5 + x)^2 =", opts: ["x² + 10x + 25", "x² + 5x + 25", "x² + 25", "x² + 10x"], correct: 0 },
  { topic: "IDENTITIES", text: "(3x − 2)^2 =", opts: ["9x² − 12x + 4", "9x² − 4", "9x² − 6x + 4", "6x² − 12x + 4"], correct: 0 },

  // Порядок действий
  { topic: "ORDER_OF_OPS", text: "5 + 3 × 2 =", opts: ["16", "11", "10", "13"], correct: 1 },
  { topic: "ORDER_OF_OPS", text: "(8 + 4) ÷ 3 =", opts: ["4", "6", "3", "12"], correct: 0 },
  { topic: "ORDER_OF_OPS", text: "6 + 4(5 − 2)^2 =", opts: ["30", "42", "18", "36"], correct: 1 },

  // Десятичные дроби
  { topic: "DECIMALS", text: "0.5 + 0.3 =", opts: ["0.8", "0.53", "0.15", "0.35"], correct: 0 },
  { topic: "DECIMALS", text: "1.2 × 3 =", opts: ["3.2", "3.6", "4.2", "3.8"], correct: 1 },
  { topic: "DECIMALS", text: "4.5 ÷ 0.5 =", opts: ["2.25", "4", "9", "8"], correct: 2 },

  // Степени
  { topic: "POWERS", text: "2^3 =", opts: ["6", "8", "9", "16"], correct: 1 },
  { topic: "POWERS", text: "3^4 =", opts: ["12", "27", "64", "81"], correct: 3 },
  { topic: "POWERS", text: "2^3 × 2^4 =", opts: ["16", "64", "128", "256"], correct: 2 },

  // Квадратные корни
  { topic: "ROOTS", text: "√36 =", opts: ["4", "5", "6", "8"], correct: 2 },
  { topic: "ROOTS", text: "√121 =", opts: ["9", "10", "11", "12"], correct: 2 },
  { topic: "ROOTS", text: "√(144 + 81) =", opts: ["12", "13", "15", "17"], correct: 2 },

  // Проценты
  { topic: "PERCENTAGES", text: "25% от 80 =", opts: ["10", "15", "20", "25"], correct: 2 },
  { topic: "PERCENTAGES", text: "Рубашка стоит $50. Скидка 20%. Новая цена:", opts: ["$30", "$35", "$40", "$45"], correct: 2 },
  { topic: "PERCENTAGES", text: "Число увеличилось с 80 до 100. Процент увеличения:", opts: ["20%", "25%", "30%", "40%"], correct: 1 },

  // Последовательности
  { topic: "SEQUENCES", text: "2, 4, 6, 8, ___", opts: ["9", "10", "11", "12"], correct: 1 },
  { topic: "SEQUENCES", text: "3, 6, 12, 24, ___", opts: ["36", "42", "48", "60"], correct: 2 },
  { topic: "SEQUENCES", text: "1, 4, 9, 16, ___", opts: ["20", "24", "25", "36"], correct: 2 },
];




const REGISTRATION_FIELDS = [
  { key: "firstName", label: "First Name", required: true, placeholder: "Aibek", type: "text" },
  { key: "lastName", label: "Last Name", required: true, placeholder: "Umarov", type: "text" },
  { key: "email", label: "Email", required: true, placeholder: "aibek@example.com", type: "email" },
  { key: "phone", label: "Phone", required: false, placeholder: "+996 700 000 000", type: "text" },
  { key: "school", label: "Previous School", required: false, placeholder: "School No. 1, Bishkek", type: "text" },
  { key: "year", label: "Graduation Year", required: false, type: "select", options: ["2026", "2025", "2024", "2023"] },
];

const EXAM_RULES = [
  { icon: "⏱", color: "#e8f0fb", title: "Timer Runs Continuously", desc: "The 60-minute timer starts when you click Start and cannot be paused." },
  { icon: "🚫", color: "#fdecea", title: "One Attempt Only", desc: "You cannot retake the exam. Once submitted, your answers are final." },
  { icon: "↔️", color: "#fef4e0", title: "Navigate Freely", desc: "You can go back and change answers at any time before submitting." },
  { icon: "📶", color: "#e7f5ee", title: "Stable Connection", desc: "Ensure a stable internet connection. Answers are saved as you progress." },
];

const PLACEMENT_TEST_QUESTIONS = [
  {
    topic: "ROOTS", topicKey: "topic.roots",
    text: "√64 =", textRu: "√64 =",
    opts: ["8", "16", "32", "64"], correct: 0
  },
  {
    topic: "LINEAR_EQUATIONS", topicKey: "topic.linearEquations",
    text: "2x + 5 = 13", textRu: "2x + 5 = 13",
    opts: ["2", "3", "6", "4"], correct: 3
  },
  {
    topic: "DECIMALS", topicKey: "topic.decimals",
    text: "0.35 as a fraction =", textRu: "0.35 в виде дроби =",
    opts: ["7/20", "35/120", "3/5", "1/4"], correct: 0
  },
  {
    topic: "PERCENTAGES", topicKey: "topic.percentages",
    text: "3/4 as a percentage =", textRu: "3/4 в процентах =",
    opts: ["25%", "33.33%", "65%", "75%"], correct: 3
  },
  {
    topic: "DECIMALS", topicKey: "topic.decimals",
    text: "12.5 ÷ 2.5 =", textRu: "12.5 ÷ 2.5 =",
    opts: ["15", "10", "7", "5"], correct: 3
  },
  {
    topic: "PERCENTAGES", topicKey: "topic.percentages",
    text: "15% of 240 =", textRu: "15% от 240 =",
    opts: ["36", "48", "60", "72"], correct: 0
  },
  {
    topic: "IDENTITIES", topicKey: "topic.identities",
    text: "x² = 81. Find x.", textRu: "x² = 81. Найдите x.",
    opts: ["±9", "±10", "±11", "±12"], correct: 0
  },
  {
    topic: "PERCENTAGES", topicKey: "topic.percentages",
    text: "Price is 2500. Discount 20%. New price:", textRu: "Цена 2500 сом. Скидка 20%. Новая цена:",
    opts: ["1500", "2000", "2500", "3000"], correct: 1
  },
  {
    topic: "WORD_PROBLEMS", topicKey: "topic.wordProblems",
    text: "A train travels 60 km/h. How far in 2.5 hours?", textRu: "Поезд едет 60 км/ч. Сколько за 2.5 часа?",
    opts: ["120", "135", "150", "165"], correct: 2
  },
  {
    topic: "GEOMETRY", topicKey: "topic.geometry",
    text: "Area is 120 m², length is 15 m. Find the width.", textRu: "Площадь 120 м², длина 15 м. Найдите ширину.",
    opts: ["8", "9", "10", "11"], correct: 0
  },
  {
    topic: "RATIOS", topicKey: "topic.ratios",
    text: "12 buns need 2 cups of flour. How many cups for 30 buns?", textRu: "12 булочек = 2 чашки муки. Сколько на 30 булочек?",
    opts: ["3", "4", "5", "6"], correct: 2
  },
  {
    topic: "ORDER_OF_OPS", topicKey: "topic.orderOfOps",
    text: "20 + 20 × 0.5 =", textRu: "20 + 20 × 0.5 =",
    opts: ["25", "14", "28", "30"], correct: 3
  },
  {
    topic: "SEQUENCES", topicKey: "topic.sequences",
    text: "2, 6, 12, 20, ___", textRu: "2, 6, 12, 20, ___",
    opts: ["24", "30", "36", "40"], correct: 1
  },
  {
    topic: "LOGIC", topicKey: "topic.logic",
    text: "Tom is taller than Jerry. Jerry is shorter than Bob but taller than Alice. Who is the shortest?",
    textRu: "Том выше Джерри. Джерри ниже Боба, но выше Алисы. Кто самый низкий?",
    opts: ["Tom", "Jerry", "Bob", "Alice"],
    optsRu: ["Том", "Джерри", "Боб", "Алиса"], correct: 3
  },
  {
    topic: "FUNCTIONS", topicKey: "topic.functions",
    text: "f(x) = 2x + 3. Find f(4).", textRu: "f(x) = 2x + 3. Найдите f(4).",
    opts: ["7", "11", "5", "9"], correct: 1
  },
];
