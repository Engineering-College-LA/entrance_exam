import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { LangProvider } from './context/LangContext'
import { usePageNav } from './hooks/examHooks'
import { supabase } from './lib/supabase'
import { Exam } from './pages/Exam'
import { Instructions } from './pages/Instructions'
import { Landing } from './pages/Landing'
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

export default function App() {
  const nav = usePageNav()
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [isPlacementActive, setIsPlacementActive] = useState(true)

  useEffect(() => {
    const fetchSetting = async () => {
      if (!supabase) return
      const { data } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'placement_active')
        .single()
      if (data) setIsPlacementActive(data.value === 'true')
    }
    void fetchSetting()

    const channel = supabase
      ?.channel('settings-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'settings',
          filter: 'key=eq.placement_active',
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'value' in payload.new) {
            setIsPlacementActive((payload.new as { value: string }).value === 'true')
          }
        },
      )
      .subscribe()

    return () => {
      if (channel) void supabase?.removeChannel(channel)
    }
  }, [])

  const timeLimitSec = 3600

  const handleStartTrial = () => {
    nav.setExamType('trial')
    setQuestions(QuestionService.shuffle(TRIAL_QUESTIONS_BASE))
    nav.go('register')
  }
  const handleStartPlacement = () => {
    clearLastRegisteredPhone()
    nav.setExamType('placement')
    setQuestions(QuestionService.shuffle(PLACEMENT_QUESTIONS_BASE))
    nav.go('register')
  }
  const handleRegister = (form: Record<string, string>) => {
    setLastRegisteredPhone(form.phone ?? '')
    nav.setStudent(form)
    nav.go('intro')
  }
  const handleFinish = (res: ExamResult) => {
    nav.setResult(res)
    nav.go('report')
  }

  return (
    <LangProvider>
      <div style={Styles.page}>
        <Header page={nav.page} onLogoClick={() => nav.go('landing')} />
        {nav.page === 'landing' && (
          <Landing
            onStartTrial={handleStartTrial}
            onStartPlacement={handleStartPlacement}
            isPlacementActive={isPlacementActive}
          />
        )}
        {nav.page === 'register' && (
          <Register
            onSubmit={handleRegister}
            onBack={() => nav.go('landing')}
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
      </div>
    </LangProvider>
  )
}
