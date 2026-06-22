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

function AppInner() {
  const { lang, t } = useLang()
  const nav = usePageNav()
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [isPlacementActive, setIsPlacementActive] = useState<boolean | null>(null)
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

  useEffect(() => {
    const fetchEvents = async () => {
      if (!supabase) return
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) {
        setEvents(data)
      }
    }
    void fetchEvents()
  }, [])

  useEffect(() => {
    // Subscribe first, then fetch — so no realtime change can arrive
    // between fetch completion and subscription setup and be missed.
    const channel = supabase
      ?.channel('settings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'settings' },
        (payload) => {
          const row = payload.new as { key?: string; value?: string } | undefined
          if (row?.key === 'placement_active') {
            setIsPlacementActive(row.value === 'true')
          }
        },
      )
      .subscribe(async () => {
        // Fetch initial value only after subscription is active
        if (!supabase) { setIsPlacementActive(false); return }
        const { data, error } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'placement_active')
          .single()
        if (error || !data) { setIsPlacementActive(false); return }
        setIsPlacementActive(data.value === 'true')
      })

    return () => {
      void supabase?.removeChannel(channel!)
    }
  }, [])

  useEffect(() => {
    if (nav.selectedEventId && nav.page === 'landing') {
      nav.go('register', { examType: 'openDoor', eventId: nav.selectedEventId })
    }
  }, [nav.selectedEventId, nav.page, nav.go])

  const timeLimitSec = 3600

  const handleStartTrial = () => {
    setQuestions(QuestionService.shuffle(TRIAL_QUESTIONS_BASE))
    nav.go('register', { examType: 'trial' })
  }
  const handleStartPlacement = () => {
    clearLastRegisteredPhone()
    setQuestions(QuestionService.shuffle(PLACEMENT_QUESTIONS_BASE))
    nav.go('register', { examType: 'placement' })
  }
  const handleRegisterOpenDoor = (eventId?: string) => {
    nav.go('register', { examType: 'openDoor', eventId })
  }

  const handleRegister = (form: Record<string, string>) => {
    if (nav.examType === 'openDoor') {
      void (async () => {
        const { error } = await insertOpenDoorRegistration(form, lang, nav.selectedEventId || undefined)
        if (error) {
          window.alert(
            `${t('register.openDoor.error')}\n\n${error.message}`,
          )
          return
        }
        if (nav.selectedEventId) {
          localStorage.setItem(`registered_event_${nav.selectedEventId}`, 'true')
          setRegisteredEventIds(prev => [...prev, nav.selectedEventId!])
          if (nav.selectedEventId === 'project-fest') {
            localStorage.setItem('project_fest_registered', 'true')
            setIsRegisteredOpenDoor(true)
          }
        } else {
          localStorage.setItem('project_fest_registered', 'true')
          setIsRegisteredOpenDoor(true)
        }
        nav.setStudent(form)
        nav.go('openDoorThanks')
      })()
      return
    }
    setLastRegisteredPhone(form.phone ?? '')
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
          onSelectSubject={(pageId) => nav.go(pageId)}
          onRegisterOpenDoor={handleRegisterOpenDoor}
          isPlacementActive={isPlacementActive}
          isRegisteredOpenDoor={isRegisteredOpenDoor}
          events={events}
          registeredEventIds={registeredEventIds}
        />
      )}
      {nav.page === 'subject' && (
        <SubjectLanding
          onStartTrial={handleStartTrial}
          onStartPlacement={handleStartPlacement}
          onRegisterOpenDoor={handleRegisterOpenDoor}
          isPlacementActive={isPlacementActive}
          onBack={() => nav.go('landing')}
          isRegisteredOpenDoor={isRegisteredOpenDoor}
          events={events}
          registeredEventIds={registeredEventIds}
        />
      )}
      {nav.page === 'register' && (
        <Register
          onSubmit={handleRegister}
          onBack={() => nav.go(nav.examType === 'openDoor' ? 'landing' : 'subject')}
          examType={nav.examType}
          selectedEvent={events.find(e => e.id === nav.selectedEventId)}
        />
      )}
      {nav.page === 'intro' && (
        <Instructions
          student={nav.student}
          onStart={() => nav.go('exam')}
          totalQuestions={questions.length}
          timeLimitSec={timeLimitSec}
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
