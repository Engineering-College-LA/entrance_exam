export const COLORS = {
  navy: '#0b1f3a',
  navy2: '#122848',
  blue: '#1565c0',
  blueLight: '#1976d2',
  accent: '#e8a020',
  white: '#ffffff',
  off: '#f4f6fa',
  border: '#dde3ed',
  text: '#1a2535',
  muted: '#6b7a95',
  success: '#1b8c5e',
  danger: '#c0392b',
  bg: '#f0f3f9',
} as const

export const EXAM_CONFIG = {
  totalQuestions: 30,
  timeLimitSec: 3600,
  warningThresholdSec: 300,
  attempts: 1,
} as const

export const GRADE_SCALE = [
  { min: 80, labelKey: 'grade.excellent', color: COLORS.success },
  { min: 65, labelKey: 'grade.good', color: '#1976d2' },
  { min: 50, labelKey: 'grade.satisfactory', color: COLORS.accent },
  { min: 0, labelKey: 'grade.needsImprovement', color: COLORS.danger },
] as const

export const TOPIC_NAMES = [
  'FRACTIONS',
  'LINEAR_EQUATIONS',
  'GEOMETRY',
  'IDENTITIES',
  'ORDER_OF_OPS',
  'DECIMALS',
  'POWERS',
  'ROOTS',
  'PERCENTAGES',
  'SEQUENCES',
] as const

export const LETTERS = ['A', 'B', 'C', 'D'] as const

export const PAGES = {
  landing: { labelKey: 'page.landing', step: -1 },
  register: { labelKey: 'page.register', step: 0 },
  intro: { labelKey: 'page.intro', step: 1 },
  exam: { labelKey: 'page.exam', step: 2 },
  report: { labelKey: 'page.report', step: 3 },
} as const

export const STEP_KEYS = [
  'step.register',
  'step.intro',
  'step.exam',
  'step.report',
] as const
