/* ── Design Tokens & Configuration ── */

const COLORS = {
  navy:"#0b1f3a", navy2:"#122848", blue:"#1565c0", blueLight:"#1976d2",
  accent:"#e8a020", white:"#ffffff", off:"#f4f6fa", border:"#dde3ed",
  text:"#1a2535", muted:"#6b7a95", success:"#1b8c5e", danger:"#c0392b", bg:"#f0f3f9",
};

const EXAM_CONFIG = { totalQuestions: 20, timeLimitSec: 3600, warningThresholdSec: 300, attempts: 1 };

const GRADE_SCALE = [
  { min: 80, label: "Excellent",         color: COLORS.success },
  { min: 65, label: "Good",              color: "#1976d2" },
  { min: 50, label: "Satisfactory",      color: COLORS.accent },
  { min: 0,  label: "Needs Improvement", color: COLORS.danger },
];

const TOPIC_NAMES = ["ALGEBRA","GEOMETRY","CALCULUS","STATISTICS","NUMBER THEORY"];
const LETTERS = ["A","B","C","D"];
const STEP_NAMES = ["Register","Instructions","Exam","Report"];

const PAGES = {
  landing:  { label:"college.edu.kg",        step:-1 },
  register: { label:"Step 1 — Registration", step:0 },
  intro:    { label:"Step 2 — Instructions",  step:1 },
  exam:     { label:"Step 3 — Exam",          step:2 },
  report:   { label:"Results",                step:3 },
};
