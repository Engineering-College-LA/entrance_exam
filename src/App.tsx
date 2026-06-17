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
    return localStorage.getItem('project_fest_registered') === 'true'
  })

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
  const handleRegisterOpenDoor = () => {
    nav.go('register', { examType: 'openDoor' })
  }

  const handleRegister = (form: Record<string, string>) => {
    if (nav.examType === 'openDoor') {
      void (async () => {
        const { error } = await insertOpenDoorRegistration(form, lang)
        if (error) {
          window.alert(
            `${t('register.openDoor.error')}\n\n${error.message}`,
          )
          return
        }
        localStorage.setItem('project_fest_registered', 'true')
        setIsRegisteredOpenDoor(true)
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
        />
      )}
      {nav.page === 'register' && (
        <Register
          onSubmit={handleRegister}
          onBack={() => nav.go(nav.examType === 'openDoor' ? 'landing' : 'subject')}
          examType={nav.examType}
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
        <OpenDoorThanks onHome={() => nav.go('landing')} />
      )}
    </div>
  )
}
