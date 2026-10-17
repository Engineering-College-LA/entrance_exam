export const COLORS = {
  navy: 'var(--c-navy)',
  navy2: 'var(--c-navy2)',
  blue: 'var(--c-blue)',
  blueLight: 'var(--c-blueLight)',
  accent: 'var(--c-accent)',
  white: 'var(--c-white)',
  off: 'var(--c-off)',
  border: 'var(--t-border)',
  text: 'var(--t-text)',
  muted: 'var(--t-muted)',
  success: 'var(--c-success)',
  danger: 'var(--c-danger)',
  bg: 'var(--t-bg)',
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

// "November 31" isn't a real date — defaults to Nov 30 until an admin sets
// a real one from the dashboard (settings key "exam_countdown_at").
export const DEFAULT_COUNTDOWN_AT = '2026-11-30T00:00:00+06:00'

// TODO: replace with the real WhatsApp channel invite link.
export const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/REPLACE_ME'

export const PAGES = {
  landing: { labelKey: 'page.landing', step: -1 },
  register: { labelKey: 'page.register', step: 0 },
  intro: { labelKey: 'page.intro', step: 1 },
  exam: { labelKey: 'page.exam', step: 2 },
  report: { labelKey: 'page.report', step: 3 },
  openDoorThanks: { labelKey: 'page.openDoorThanks', step: -1 },
  subject: { labelKey: 'page.subject', step: -1 },
  paymentResult: { labelKey: 'page.paymentResult', step: -1 },
  olympiadThanks: { labelKey: 'page.olympiadThanks', step: -1 },
  profile: { labelKey: 'page.profile', step: -1 },
} as const

export const STEP_KEYS = [
  'step.register',
  'step.intro',
  'step.exam',
  'step.report',
] as const
