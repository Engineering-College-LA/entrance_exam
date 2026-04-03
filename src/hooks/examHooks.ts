import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import type { ExamQuestion, ExamResult, ExamType, PageId } from '../types/exam'
import { TimeService } from '../services/examServices'
import type { RegistrationField } from '../types/exam'

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  )
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

export function useTimer(duration: number, onExpire: () => void) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const onExpireRef = useRef(onExpire)
  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])
  useEffect(() => {
    const id = window.setInterval(
      () =>
        setTimeLeft((t) => {
          if (t <= 1) {
            window.clearInterval(id)
            onExpireRef.current()
            return 0
          }
          return t - 1
        }),
      1000,
    )
    return () => window.clearInterval(id)
  }, [])
  return {
    timeLeft,
    ...TimeService.format(timeLeft),
    isWarning: TimeService.isWarning(timeLeft),
  }
}

export function useExamState(questions: ExamQuestion[]) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [startTime] = useState(() => Date.now())
  const select = useCallback(
    (i: number) => setAnswers((a) => ({ ...a, [current]: i })),
    [current],
  )
  const next = useCallback(
    () => setCurrent((c) => Math.min(questions.length - 1, c + 1)),
    [questions.length],
  )
  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), [])
  const goTo = useCallback((i: number) => setCurrent(i), [])
  const elapsed = useCallback(
    () => Math.floor((Date.now() - startTime) / 1000),
    [startTime],
  )
  const answeredCount = Object.keys(answers).length
  const isFirst = current === 0
  const isLast = current === questions.length - 1
  return {
    current,
    answers,
    select,
    next,
    prev,
    goTo,
    elapsed,
    answeredCount,
    isFirst,
    isLast,
    question: questions[current],
  }
}

export function useFormState(fields: RegistrationField[]) {
  const initial: Record<string, string> = {}
  fields.forEach((f) => {
    initial[f.key] = f.initialValue ?? ''
  })
  const [form, setForm] = useState(initial)
  const set = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
    [],
  )
  return { form, set }
}

export function usePageNav() {
  const [page, setPage] = useState<PageId>('landing')
  const [student, setStudent] = useState<Record<string, string>>({})
  const [result, setResult] = useState<ExamResult | null>(null)
  const [examType, setExamType] = useState<ExamType>('trial')
  const go = useCallback((p: PageId) => setPage(p), [])
  return {
    page,
    go,
    student,
    setStudent,
    result,
    setResult,
    examType,
    setExamType,
  }
}
