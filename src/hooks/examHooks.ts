import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import type { ExamQuestion, ExamResult, ExamType, PageId } from '../types/exam'
import {
  pathForPage,
  resolveRoute,
} from '../lib/appRoutes'
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
  const initial =
    typeof window !== 'undefined'
      ? resolveRoute(window.location.pathname)
      : resolveRoute('/')

  const [page, setPage] = useState<PageId>(initial.page)
  const [student, setStudentState] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {}
    try {
      const raw = localStorage.getItem('ec_current_student')
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })
  const setStudent = useCallback((s: Record<string, string>) => {
    setStudentState(s)
    if (typeof window !== 'undefined') {
      localStorage.setItem('ec_current_student', JSON.stringify(s))
    }
  }, [])
  const [result, setResult] = useState<ExamResult | null>(null)
  const [examType, setExamType] = useState<ExamType>(initial.examType)
  const examTypeRef = useRef<ExamType>(initial.examType)

  const [subject, setSubject] = useState<string | null>(() => {
    return initial.subject || 'math'
  })

  useEffect(() => {
    examTypeRef.current = examType
  }, [examType])

  const [selectedEventId, setSelectedEventId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    return params.get('event') || params.get('eventId')
  })

  const syncUrlToState = useCallback((p: PageId, nextType: ExamType, eventId?: string | null, nextSubject?: string | null) => {
    if (typeof window === 'undefined') return
    const target = pathForPage(p, nextType, eventId, nextSubject)
    const cur = window.location.pathname + window.location.search
    if (target !== cur) {
      window.history.pushState(null, '', target)
    }
  }, [])

  const go = useCallback(
    (target: PageId, opts?: { examType?: ExamType; eventId?: string; subject?: string }) => {
      let nextType = examTypeRef.current
      if (opts?.examType !== undefined) {
        nextType = opts.examType
        examTypeRef.current = nextType
        setExamType(nextType)
      }
      let nextEventId = selectedEventId
      if (opts?.eventId !== undefined) {
        nextEventId = opts.eventId
        setSelectedEventId(opts.eventId)
      } else if (target === 'landing' || target === 'subject') {
        nextEventId = null
        setSelectedEventId(null)
      }
      let nextSubject = subject
      if (opts?.subject !== undefined) {
        nextSubject = opts.subject
        setSubject(opts.subject)
      }
      setPage(target)
      syncUrlToState(target, nextType, nextEventId, nextSubject)
    },
    [syncUrlToState, selectedEventId, subject],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onPop = () => {
      const resolved = resolveRoute(window.location.pathname)
      examTypeRef.current = resolved.examType
      setPage(resolved.page)
      setExamType(resolved.examType)
      setSubject(resolved.subject || 'math')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return {
    page,
    go,
    student,
    setStudent,
    result,
    setResult,
    examType,
    selectedEventId,
    subject,
  }
}
