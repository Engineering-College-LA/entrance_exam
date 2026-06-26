import { useEffect, useState } from 'react'
import { COLORS } from '../constants'
import { ExamCard } from '../components/ExamCard'
import { useLang } from '../context/LangContext'
import { useIsMobile } from '../hooks/examHooks'
import { shouldDisablePlacementStart } from '../lib/placementCache'
import { MathIcon, EventIcon, FileTextIcon, TargetIcon } from '../components/Icons'

export function SubjectLanding({
  onStartExam,
  onRegisterOpenDoor,
  onBack,
  isRegisteredOpenDoor,
  events = [],
  registeredEventIds = [],
  exams = [],
  subject = 'math',
  dbQuestions = null,
}: {
  onStartExam: (exam: any) => void
  onRegisterOpenDoor: (eventId?: string) => void
  onBack: () => void
  isRegisteredOpenDoor: boolean
  events?: any[]
  registeredEventIds?: string[]
  exams?: any[]
  subject?: string
  dbQuestions?: any[] | null
}) {
  const { t } = useLang()
  const isMobile = useIsMobile()
  const isEn = t('landing.title1') === 'Mathematics'
  const [placementCachedOut, setPlacementCachedOut] = useState(
    shouldDisablePlacementStart,
  )

  useEffect(() => {
    const refresh = () => setPlacementCachedOut(shouldDisablePlacementStart())
    refresh()
    window.addEventListener('storage', refresh)
    window.addEventListener('focus', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [])

  const getSubjectTitle = (subject: string) => {
    if (subject && subject.includes('|')) {
      const parts = subject.split('|')
      return isEn ? parts[0] : (parts[1] || parts[0])
    }
    const key = `dashboard.subject.${subject}.title`
    const val = t(key)
    if (val !== key) return val
    if (subject === 'math') return isEn ? 'Mathematics' : 'Математика'
    if (subject === 'english') return isEn ? 'English Language' : 'Английский язык'
    if (subject === 'physics') return isEn ? 'Physics' : 'Физика'
    return subject.charAt(0).toUpperCase() + subject.slice(1)
  }

  const getSubjectDesc = (subject: string) => {
    if (subject && subject.includes('|')) {
      const title = getSubjectTitle(subject)
      return isEn ? `Demonstrate your aptitude in ${title} for admission to E|C Engineering College.` : `Продемонстрируйте свои способности по предмету ${title} для поступления в ИТ-Колледж E|C.`
    }
    const key = `dashboard.subject.${subject}.desc`
    const val = t(key)
    if (val !== key) return val
    if (subject === 'math') return isEn ? 'Demonstrate your mathematical aptitude for admission to E|C Engineering College.' : 'Продемонстрируйте свои математические способности для поступления в ИТ-Колледж E|C.'
    if (subject === 'english') return isEn ? 'Admissions test in English. Grammar, reading, and vocabulary.' : 'Вступительный экзамен по английскому. Грамматика, чтение и лексика.'
    if (subject === 'physics') return isEn ? 'Admissions test in Physics.' : 'Вступительный экзамен по физике.'
    return isEn ? `Tests in ${subject}.` : `Тесты по предмету ${subject}.`
  }

  const activeExams = exams || []
  const subjExams = activeExams.filter((e) => e.subject === subject)

  return (
    <div
      style={{
        background: 'var(--t-bg)',
        minHeight: 'calc(100vh - 60px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background patterns */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            'linear-gradient(var(--t-navy-mix) 1px,transparent 1px),linear-gradient(90deg,var(--t-navy-mix) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: -200,
          right: -200,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background:
            'radial-gradient(circle,rgba(21,101,192,.25) 0%,transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1060,
          margin: '0 auto',
          padding: isMobile ? '24px 20px 40px' : '40px 32px 60px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Back to Portal Button */}
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            color: 'var(--t-muted)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: 4,
            transition: 'background .15s, color .15s',
            alignSelf: 'flex-start',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'color-mix(in srgb, var(--t-text) 8%, transparent)'
            e.currentTarget.style.color = 'var(--t-text)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none'
            e.currentTarget.style.color = 'var(--t-muted)'
          }}
        >
          {t('dashboard.backToPortal')}
        </button>

        {/* Content Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 420px',
            gap: isMobile ? 32 : 60,
            alignItems: 'start',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'monospace',
                fontSize: 11,
                color: COLORS.accent,
                letterSpacing: 2,
                textTransform: 'uppercase',
                background: 'color-mix(in srgb, var(--c-accent) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--c-accent) 30%, transparent)',
                padding: '5px 14px',
                borderRadius: 2,
                marginBottom: 24,
              }}
            >
              <span
                className="live-pulse"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: COLORS.accent,
                  display: 'inline-block',
                }}
              />
              {t('landing.admissions')}
            </div>
            <h1
              style={{
                fontWeight: 800,
                fontSize: isMobile ? 32 : 48,
                lineHeight: 1.05,
                color: 'var(--t-text)',
                marginBottom: 18,
              }}
            >
              {getSubjectTitle(subject)}
              <br />
              <span style={{ color: COLORS.accent }}>
                {isEn ? 'Exams' : 'Экзамены'}
              </span>
            </h1>
            <p
              style={{
                fontSize: isMobile ? 14 : 16,
                color: 'var(--t-muted)',
                lineHeight: 1.7,
                maxWidth: 420,
                marginBottom: 40,
              }}
            >
              {getSubjectDesc(subject)}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {subjExams.map((exam) => {
                const isPlacement = exam.id === 'math-placement' || exam.require_parent_info

                const examTitle = isEn ? exam.title_en : exam.title_ru
                const minutes = Math.round(exam.time_limit_sec / 60)

                // Count questions
                let qCount = 30
                if (exam.id === 'math-placement') qCount = 45
                if (dbQuestions) {
                  const count = dbQuestions.filter((q) => q.exam_type === exam.id).length
                  if (count > 0) qCount = count
                }

                const questionsLabel = isEn ? `${qCount} questions` : `${qCount} вопросов`
                const timeLabel = isEn ? `${minutes} minutes` : `${minutes} минут`

                return (
                  <div key={exam.id} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 6,
                        background: isPlacement
                          ? 'rgba(21,101,192,.15)'
                          : 'color-mix(in srgb, var(--c-accent) 12%, transparent)',
                        border: isPlacement
                          ? '1px solid rgba(21,101,192,.3)'
                          : '1px solid color-mix(in srgb, var(--c-accent) 25%, transparent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isPlacement ? COLORS.blue : COLORS.accent,
                        flexShrink: 0,
                      }}
                    >
                      {isPlacement ? <TargetIcon size={20} /> : <FileTextIcon size={20} />}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 13,
                          color: 'var(--t-text)',
                        }}
                      >
                        {examTitle}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--t-muted)', marginTop: 2 }}>
                        {questionsLabel} · {timeLabel}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {subjExams.map((exam) => {
              const isPlacement = exam.id === 'math-placement' || exam.require_parent_info
              const isCachedOut = isPlacement && placementCachedOut

              const examTitle = isEn ? exam.title_en : exam.title_ru
              const examDesc = isEn ? exam.description_en : exam.description_ru
              const minutes = Math.round(exam.time_limit_sec / 60)

              // Count questions
              let qCount = 30
              if (exam.id === 'math-placement') qCount = 45
              if (dbQuestions) {
                const count = dbQuestions.filter((q) => q.exam_type === exam.id).length
                if (count > 0) qCount = count
              }

              const questionsLabel = isEn ? `${qCount} questions` : `${qCount} вопросов`
              const timeLabel = isEn ? `${minutes} minutes` : `${minutes} минут`

              return (
                <ExamCard
                  key={exam.id}
                  badge={examTitle}
                  desc={examDesc}
                  questions={questionsLabel}
                  time={timeLabel}
                  ctaLabel={
                    isPlacement
                      ? isEn
                        ? 'Start Placement Test'
                        : 'Пройти Отборочный Экзамен'
                      : isEn
                        ? 'Start Trial Test'
                        : 'Пройти Пробный Экзамен'
                  }
                  onStart={() => onStartExam(exam)}
                  accent={isPlacement ? COLORS.blue : COLORS.accent}
                  disabled={isPlacement && isCachedOut}
                  disabledHint={
                    isPlacement && isCachedOut ? t('landing.placement.cacheDisabled') : undefined
                  }
                  disabledCta={
                    isPlacement && isCachedOut ? t('landing.placement.cacheCta') : undefined
                  }
                  tooltipText={
                    isPlacement && isCachedOut ? t('landing.placement.cacheDisabled') : undefined
                  }
                  icon={isPlacement ? <TargetIcon size={20} /> : <MathIcon size={20} />}
                  variant="primary"
                />
              )
            })}

            {/* Dynamic Events */}
            {(() => {
              const visibleEvents = events.filter((e) => !(e.format_en && e.format_en.endsWith('__hidden')))
              const sortedEvents = [...visibleEvents].sort((a, b) => {
                if (a.id === 'project-fest') return -1
                if (b.id === 'project-fest') return 1
                return 0
              })

              return sortedEvents.map((event) => {
                const title = isEn ? event.title_en : event.title_ru
                const desc = isEn ? event.desc_en : event.desc_ru
                const date = isEn ? event.date_en : event.date_ru
                const time = isEn ? event.time_en : event.time_ru

                let format = isEn ? event.format_en : event.format_ru
                if (format) format = format.replace(/__hidden$/, '')

                const req = isEn ? event.req_en : event.req_ru
                const isRegistered =
                  registeredEventIds.includes(event.id) ||
                  (event.id === 'project-fest' && isRegisteredOpenDoor)

                return (
                  <ExamCard
                    key={event.id}
                    badge={title}
                    desc={desc}
                    ctaLabel={
                      isRegistered
                        ? isEn
                          ? 'Registered ✓'
                          : 'Вы записаны ✓'
                        : isEn
                          ? 'Register'
                          : 'Записаться'
                    }
                    onStart={isRegistered ? undefined : () => onRegisterOpenDoor(event.id)}
                    accent={COLORS.success}
                    icon={<EventIcon size={20} />}
                    variant={isRegistered ? 'success' : 'secondary'}
                    showAttempts={false}
                    statusBadge={isRegistered ? (isEn ? 'Active' : 'Вы участвуете') : undefined}
                    customRows={[
                      [t('landing.openDoor.date'), date],
                      [t('landing.openDoor.time'), time],
                      [t('landing.card.format'), format],
                      [t('landing.openDoor.req'), req],
                    ]}
                  />
                )
              })
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
