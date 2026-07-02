import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { LangProvider, useLang } from './context/LangContext'
import { usePageNav } from './hooks/examHooks'
import { insertOpenDoorRegistration } from './lib/openDoorRegistration'
import { supabase } from './lib/supabase'
import { Exam } from './pages/Exam'
import { Instructions } from './pages/Instructions'
import { Landing } from './pages/Landing'
import { SubjectLanding } from './pages/SubjectLanding'
import { OpenDoorThanks } from './pages/OpenDoorThanks'
import { Register } from './pages/Register'
import { Report } from './pages/Report'
import {
  clearLastRegisteredPhone,
  setLastRegisteredPhone,
} from './lib/placementCache'
import {
  PLACEMENT_QUESTIONS_BASE,
  QuestionService,
  TRIAL_QUESTIONS_BASE,
} from './services/examServices'
import { Styles } from './styles'
import type { ExamQuestion, ExamResult } from './types/exam'
import { ThemeProvider } from './context/ThemeContext'

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <AppInner />
      </LangProvider>
    </ThemeProvider>
  )
}
const DEFAULT_EXAMS = [
  {
    id: 'math-trial',
    title_en: 'Mathematics Trial Test',
    title_ru: 'Пробный экзамен по математике',
    description_en: 'Practice math test to prepare for the main exam.',
    description_ru: 'Пробный тест по математике для подготовки к основному экзамену.',
    subject: 'math',
    time_limit_sec: 3600,
    is_active: true,
    require_parent_info: false
  },
  {
    id: 'math-placement',
    title_en: 'Mathematics Placement Test',
    title_ru: 'Отборочный экзамен по математике',
    description_en: 'Official placement test for engineering college admissions.',
    description_ru: 'Официальный отборочный тест для поступления в инженерный колледж.',
    subject: 'math',
    time_limit_sec: 3600,
    is_active: true,
    require_parent_info: true
  }
]

function AppInner() {
  const { lang, t } = useLang()
  const nav = usePageNav()
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [isRegisteredOpenDoor, setIsRegisteredOpenDoor] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('project_fest_registered') === 'true' || localStorage.getItem('registered_event_project-fest') === 'true'
  })
  const [events, setEvents] = useState<any[]>([])
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    const ids: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('registered_event_') && localStorage.getItem(key) === 'true') {
        ids.push(key.replace('registered_event_', ''))
      }
    }
    return ids
  })

  const [dbQuestions, setDbQuestions] = useState<ExamQuestion[] | null>(null)
  const [dbExams, setDbExams] = useState<any[] | null>(null)
  const [activeExam, setActiveExam] = useState<any | null>(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!supabase) return
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
        if (!error && data && data.length > 0) {
          const mapped: ExamQuestion[] = data.map((q: any) => ({
            id: q.id,
            topic: q.topic,
            topicKey: q.topic_key,
            text: q.text,
            textRu: q.text_ru,
            opts: q.opts,
            optsRu: q.opts_ru,
            correct: q.correct,
            exam_type: q.exam_id || q.exam_type
          }))
          setDbQuestions(mapped)
        } else {
          setDbQuestions([])
        }
      } catch (e) {
        console.error('Failed to load questions from Supabase:', e)
        setDbQuestions([])
      }
    }
    void fetchQuestions()
  }, [])

  useEffect(() => {
    const fetchExams = async () => {
      if (!supabase) {
        setDbExams(DEFAULT_EXAMS)
        return
      }
      try {
        const { data, error } = await supabase
          .from('exams')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true })
        if (!error && data && data.length > 0) {
          setDbExams(data)
        } else {
          setDbExams(DEFAULT_EXAMS)
        }
      } catch (e) {
        console.error('Failed to load exams from Supabase:', e)
        setDbExams(DEFAULT_EXAMS)
      }
    }
    void fetchExams()
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      if (!supabase) return
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
      if (!error && data) {
        setEvents(data)
      }
    }
    void fetchEvents()
  }, [])

  useEffect(() => {
    const checkRedirect = () => {
      if (nav.selectedEventId && nav.page === 'landing') {
        const targetEventId = nav.selectedEventId
        const isRegistered = registeredEventIds.includes(targetEventId) || (targetEventId === 'project-fest' && isRegisteredOpenDoor)
        if (isRegistered) {
          const savedInfo = localStorage.getItem(`registered_event_${targetEventId}_info`)
          let studentInfo = null
          if (savedInfo) {
            try {
              studentInfo = JSON.parse(savedInfo)
            } catch (e) {
              console.error(e)
            }
          }
          if (!studentInfo) {
            const globalStudent = localStorage.getItem('ec_current_student')
            if (globalStudent) {
              try {
                studentInfo = JSON.parse(globalStudent)
              } catch (e) {
                console.error(e)
              }
            }
          }
          if (studentInfo) {
            nav.setStudent(studentInfo)
          }
          nav.go('openDoorThanks', { eventId: targetEventId })
        } else {
          nav.go('register', { examType: 'openDoor', eventId: nav.selectedEventId })
        }
      }
    }
    checkRedirect()
  }, [nav.selectedEventId, nav.page, nav.go, registeredEventIds, isRegisteredOpenDoor])

  useEffect(() => {
    if (nav.page === 'register' && nav.examType === 'openDoor' && nav.selectedEventId) {
      const targetEventId = nav.selectedEventId
      const isRegistered = registeredEventIds.includes(targetEventId) || (targetEventId === 'project-fest' && isRegisteredOpenDoor)
      if (isRegistered) {
        const savedInfo = localStorage.getItem(`registered_event_${targetEventId}_info`)
        let studentInfo = null
        if (savedInfo) {
          try {
            studentInfo = JSON.parse(savedInfo)
          } catch (e) {
            console.error(e)
          }
        }
        if (!studentInfo) {
          const globalStudent = localStorage.getItem('ec_current_student')
          if (globalStudent) {
            try {
              studentInfo = JSON.parse(globalStudent)
            } catch (e) {
              console.error(e)
            }
          }
        }
        if (studentInfo) {
          nav.setStudent(studentInfo)
        }
        nav.go('openDoorThanks', { eventId: targetEventId })
      }
    }
  }, [nav.page, nav.examType, nav.selectedEventId, registeredEventIds, isRegisteredOpenDoor, nav.go])

  // Find resolved active exam from URL
  const resolvedActiveExam = activeExam || (dbExams || []).find(e => e.id === nav.examType) || DEFAULT_EXAMS.find(e => e.id === nav.examType)
  const timeLimitSec = resolvedActiveExam ? resolvedActiveExam.time_limit_sec : 3600

  const handleStartExam = async (exam: any) => {
    setActiveExam(exam)
    if (exam.id === 'math-placement' || exam.require_parent_info) {
      clearLastRegisteredPhone()
    }
    let baseQuestions: ExamQuestion[] = []
    if (dbQuestions && dbQuestions.length > 0) {
      baseQuestions = dbQuestions.filter(
        q => q.exam_type === exam.id || 
             (exam.id === 'math-trial' && q.exam_type === 'trial') || 
             (exam.id === 'math-placement' && q.exam_type === 'placement') || 
             q.exam_type === 'all'
      )
    }
    
    if (baseQuestions.length === 0) {
      if (exam.id === 'math-trial') {
        baseQuestions = TRIAL_QUESTIONS_BASE
      } else if (exam.id === 'math-placement') {
        baseQuestions = PLACEMENT_QUESTIONS_BASE
      } else {
        baseQuestions = QuestionService.build([], 30)
      }
    } else {
      if (exam.id === 'math-trial') {
        baseQuestions = QuestionService.build(baseQuestions, 30)
      }
    }
    setQuestions(QuestionService.shuffle(baseQuestions))
    nav.go('register', { examType: exam.id })
  }

  const handleRegisterOpenDoor = (eventId?: string) => {
    const targetEventId = eventId || 'project-fest'
    const isRegistered = registeredEventIds.includes(targetEventId) || (targetEventId === 'project-fest' && isRegisteredOpenDoor)
    
    if (isRegistered) {
      const savedInfo = localStorage.getItem(`registered_event_${targetEventId}_info`)
      let studentInfo = null
      if (savedInfo) {
        try {
          studentInfo = JSON.parse(savedInfo)
        } catch (e) {
          console.error(e)
        }
      }
      if (!studentInfo) {
        const globalStudent = localStorage.getItem('ec_current_student')
        if (globalStudent) {
          try {
            studentInfo = JSON.parse(globalStudent)
          } catch (e) {
            console.error(e)
          }
        }
      }
      if (studentInfo) {
        nav.setStudent(studentInfo)
      }
      nav.go('openDoorThanks', { eventId: targetEventId })
    } else {
      nav.go('register', { examType: 'openDoor', eventId })
    }
  }

  const handleRegister = (form: Record<string, string>) => {
    if (nav.examType === 'openDoor') {
      void (async () => {
        const { error, id } = await insertOpenDoorRegistration(form, lang, nav.selectedEventId || undefined)
        if (error) {
          window.alert(
            `${t('register.openDoor.error')}\n\n${error.message}`,
          )
          return
        }
        const formWithId = { ...form, id }
        const targetEventId = nav.selectedEventId || 'project-fest'
        localStorage.setItem(`registered_event_${targetEventId}`, 'true')
        localStorage.setItem(`registered_event_${targetEventId}_info`, JSON.stringify(formWithId))
        
        setRegisteredEventIds(prev => [...prev, targetEventId])
        if (targetEventId === 'project-fest') {
          localStorage.setItem('project_fest_registered', 'true')
          setIsRegisteredOpenDoor(true)
        }
        nav.setStudent(formWithId)
        nav.go('openDoorThanks')
      })()
      return
    }
    if (nav.examType === 'placement' || resolvedActiveExam?.require_parent_info) {
      setLastRegisteredPhone(form.phone ?? '')
    }
    nav.setStudent(form)
    nav.go('intro')
  }

  const handleFinish = (res: ExamResult) => {
    nav.setResult(res)
    nav.go('report')
  }
  const handleLogout = () => {
    localStorage.removeItem('ec_current_student')
    localStorage.removeItem('project_fest_registered')
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key && key.startsWith('registered_event_')) {
        localStorage.removeItem(key)
      }
    }
    setRegisteredEventIds([])
    nav.setStudent({})
    setIsRegisteredOpenDoor(false)
    nav.go('landing')
  }

  return (
    <div style={Styles.page}>
      <Header
        page={nav.page}
        onLogoClick={() => nav.go('landing')}
        student={nav.student}
        onLogout={handleLogout}
      />
      {nav.page === 'landing' && (
        <Landing
          onSelectSubject={(subject) => nav.go('subject', { subject })}
          onRegisterOpenDoor={handleRegisterOpenDoor}
          isRegisteredOpenDoor={isRegisteredOpenDoor}
          events={events}
          registeredEventIds={registeredEventIds}
          exams={dbExams || []}
        />
      )}
      {nav.page === 'subject' && (
        <SubjectLanding
          onStartExam={handleStartExam}
          onRegisterOpenDoor={handleRegisterOpenDoor}
          onBack={() => nav.go('landing')}
          isRegisteredOpenDoor={isRegisteredOpenDoor}
          events={events}
          registeredEventIds={registeredEventIds}
          exams={dbExams || []}
          subject={(nav as any).subject || 'math'}
          dbQuestions={dbQuestions}
        />
      )}
      {nav.page === 'register' && (
        <Register
          onSubmit={handleRegister}
          onBack={() => nav.go(nav.examType === 'openDoor' ? 'landing' : 'subject')}
          examType={nav.examType}
          selectedEvent={events.find(e => e.id === nav.selectedEventId)}
          requireParentInfo={resolvedActiveExam?.require_parent_info}
        />
      )}
      {nav.page === 'intro' && (
        <Instructions
          student={nav.student}
          onStart={() => nav.go('exam')}
          totalQuestions={questions.length}
          timeLimitSec={timeLimitSec}
          examType={nav.examType}
        />
      )}
      {nav.page === 'exam' && (
        <Exam
          questions={questions}
          timeLimitSec={timeLimitSec}
          onFinish={handleFinish}
        />
      )}
      {nav.page === 'report' && nav.result && (
        <Report
          student={nav.student}
          result={nav.result}
          examType={nav.examType}
          questions={questions}
          onHome={() => nav.go('landing')}
        />
      )}
      {nav.page === 'openDoorThanks' && (
        <OpenDoorThanks
          student={nav.student}
          selectedEvent={events.find(e => e.id === nav.selectedEventId)}
          onHome={() => nav.go('landing')}
        />
      )}
    </div>
  )
}
