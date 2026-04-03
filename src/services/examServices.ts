import { EXAM_CONFIG, GRADE_SCALE, TOPIC_NAMES } from '../constants'
import type { ExamQuestion } from '../types/exam'
import { BASE_QUESTIONS, EXTRA_QUESTIONS } from '../data/questionsData'

export const QuestionService = {
  shuffle<T>(arr: T[]): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j]!, a[i]!]
    }
    return a
  },
  build(base: ExamQuestion[], total: number): ExamQuestion[] {
    const qs: ExamQuestion[] = [...base]
    while (qs.length < total) {
      const idx = qs.length
      const topicKeys = [
        'topic.fractions',
        'topic.linearEquations',
        'topic.geometry',
        'topic.identities',
        'topic.orderOfOps',
        'topic.decimals',
        'topic.powers',
        'topic.roots',
        'topic.percentages',
        'topic.sequences',
      ]
      qs.push({
        topic: TOPIC_NAMES[idx % TOPIC_NAMES.length]!,
        topicKey: topicKeys[idx % topicKeys.length],
        text: `Question ${idx + 1}: Solve the given mathematical expression.`,
        textRu: `Вопрос ${idx + 1}: Решите данное математическое выражение.`,
        opts: ['Option A', 'Option B', 'Option C', 'Option D'],
        optsRu: ['Вариант A', 'Вариант B', 'Вариант C', 'Вариант D'],
        correct: idx % 4,
      })
    }
    return qs
  },
}

export const TRIAL_QUESTIONS_BASE = QuestionService.build(BASE_QUESTIONS, 30)
export const PLACEMENT_QUESTIONS_BASE: ExamQuestion[] = [
  ...BASE_QUESTIONS,
  ...EXTRA_QUESTIONS,
]

export const GradingService = {
  score(answers: Record<number, number>, questions: ExamQuestion[]) {
    let correct = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++
    })
    return correct
  },
  percentage(correct: number, total: number) {
    return Math.round((correct / total) * 100)
  },
  grade(pct: number) {
    return (
      GRADE_SCALE.find((g) => pct >= g.min) ?? GRADE_SCALE[GRADE_SCALE.length - 1]!
    )
  },
  topicBreakdown(answers: Record<number, number>, questions: ExamQuestion[]) {
    const topics: Record<string, { correct: number; total: number }> = {}
    questions.forEach((q, i) => {
      const key = q.topicKey ?? 'topic.unknown'
      if (!topics[key]) topics[key] = { correct: 0, total: 0 }
      topics[key]!.total++
      if (answers[i] === q.correct) topics[key]!.correct++
    })
    return Object.entries(topics).map(([nameKey, { correct, total }]) => ({
      nameKey,
      pct: Math.round((correct / total) * 100),
    }))
  },
}

export const TimeService = {
  format(seconds: number) {
    return {
      mm: String(Math.floor(seconds / 60)).padStart(2, '0'),
      ss: String(seconds % 60).padStart(2, '0'),
    }
  },
  isWarning(seconds: number) {
    return seconds < EXAM_CONFIG.warningThresholdSec
  },
}

export type RegistrationForm = Record<string, string>

export const ValidationService = {
  registrationErrors(form: RegistrationForm, examType: string) {
    const errs: Record<string, string> = {}
    if (!form.firstName) errs.firstName = 'error.firstName'
    if (!form.lastName) errs.lastName = 'error.lastName'
    if (!/^\+996\d{9}$/.test(form.phone ?? '')) errs.phone = 'error.phone'
    if (!form.grade) errs.grade = 'error.grade'
    if (examType === 'placement') {
      if (!/^\+996\d{9}$/.test(form.parentPhone ?? ''))
        errs.parentPhone = 'error.parentPhone'
      if (!form.parentName?.trim()) errs.parentName = 'error.parentName'
      if (!form.attended) errs.attended = 'error.attended'
      const studentPhoneOk = /^\+996\d{9}$/.test(form.phone ?? '')
      const parentPhoneOk = /^\+996\d{9}$/.test(form.parentPhone ?? '')
      if (
        studentPhoneOk &&
        parentPhoneOk &&
        (form.phone ?? '').trim() === (form.parentPhone ?? '').trim()
      ) {
        errs.parentPhone = 'error.parentPhoneMustDiffer'
      }
    }
    return errs
  },
  registration(form: RegistrationForm, examType: string) {
    const errs = this.registrationErrors(form, examType)
    const valid = Object.keys(errs).length === 0
    return { valid, errs }
  },
}
