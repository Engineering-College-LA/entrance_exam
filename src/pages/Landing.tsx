import { COLORS } from '../constants'
import { ExamCard } from '../components/ExamCard'
import { useLang } from '../context/LangContext'
import { useIsMobile } from '../hooks/examHooks'
import { MathIcon, EnglishIcon, EventIcon } from '../components/Icons'

export function Landing({
  onSelectSubject,
  onRegisterOpenDoor,
  isRegisteredOpenDoor,
  events = [],
  registeredEventIds = [],
  exams = [],
}: {
  onSelectSubject: (subject: string) => void
  onRegisterOpenDoor: (eventId?: string) => void
  isRegisteredOpenDoor: boolean
  events?: any[]
  registeredEventIds?: string[]
  exams?: any[]
}) {
  const { t } = useLang()
  const isMobile = useIsMobile()
  const isEn = t('landing.title1') === 'Mathematics'

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
      return isEn ? `Admissions and trial tests in ${title}.` : `Отборочный и пробный экзамены по предмету ${title}.`
    }
    const key = `dashboard.subject.${subject}.desc`
    const val = t(key)
    if (val !== key) return val
    if (subject === 'math') return isEn ? 'Admissions and trial tests in Mathematics.' : 'Отборочный и пробный экзамены по математике.'
    if (subject === 'english') return isEn ? 'Admissions test in English. Grammar, reading, and vocabulary.' : 'Вступительный экзамен по английскому. Грамматика, чтение и лексика.'
    if (subject === 'physics') return isEn ? 'Admissions test in Physics.' : 'Вступительный экзамен по физике.'
    return isEn ? `Tests in ${subject}.` : `Тесты по предмету ${subject}.`
  }

  const activeExams = exams || []
  const subjects = Array.from(new Set(activeExams.map((e) => e.subject)))
  if (subjects.length === 0) {
    subjects.push('math')
  }

  return (
    <div
      style={{
        background: 'var(--t-bg)',
        minHeight: 'calc(100vh - 60px)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isMobile ? '32px 20px 48px' : '64px 32px 80px',
        boxSizing: 'border-box',
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
          left: '50%',
          transform: 'translateX(-50%)',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background:
            'radial-gradient(circle,rgba(21,101,192,.18) 0%,transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Dashboard Area */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 1120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: isMobile ? 32 : 48,
        }}
      >
        {/* Welcome Dashboard Header */}
        <div style={{ textAlign: 'center', maxWidth: 640 }}>
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
              marginBottom: 18,
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
              fontSize: isMobile ? 28 : 42,
              lineHeight: 1.15,
              color: 'var(--t-text)',
              marginBottom: 14,
              letterSpacing: '-0.5px',
            }}
          >
            {t('landing.dashboard.title')}
          </h1>
          <p
            style={{
              fontSize: isMobile ? 14 : 16,
              color: 'var(--t-muted)',
              lineHeight: 1.6,
            }}
          >
            {t('landing.dashboard.subtitle')}
          </p>
        </div>

        {/* Dashboard Grid Container */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? '1fr'
              : 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
            width: '100%',
          }}
        >
          {subjects.map((subj) => {
            const subjExams = activeExams.filter((e) => e.subject === subj)
            const count = subjExams.length
            const subjectTitle = getSubjectTitle(subj)
            const subjectDesc = getSubjectDesc(subj)

            let accent: string = COLORS.accent
            let icon = <MathIcon size={20} />
            if (subj === 'english') {
              accent = COLORS.blue
              icon = <EnglishIcon size={20} />
            } else if (subj === 'physics') {
              accent = COLORS.blueLight
              icon = <MathIcon size={20} />
            }

            return (
              <ExamCard
                key={subj}
                badge={subjectTitle}
                desc={subjectDesc}
                ctaLabel={isEn ? 'Select Subject' : 'Выбрать предмет'}
                onStart={() => onSelectSubject(subj)}
                accent={accent}
                icon={icon}
                showAttempts={false}
                customRows={[
                  [t('landing.card.format'), 'MCQ'],
                  [
                    isEn ? 'Tests' : 'Тесты',
                    count > 0
                      ? `${count} (${subjExams.map((e) => (isEn ? e.title_en : e.title_ru)).join(', ')})`
                      : (isEn ? 'No tests available' : 'Нет доступных тестов'),
                  ],
                  [isEn ? 'Languages' : 'Языки', 'RU & EN'],
                ]}
              />
            )
          })}


          {/* Dynamic Events */}
          {(() => {
            const visibleEvents = events.filter(e => !(e.format_en && e.format_en.endsWith('__hidden')))
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
              const isRegistered = registeredEventIds.includes(event.id) || (event.id === 'project-fest' && isRegisteredOpenDoor)

              return (
                <ExamCard
                  key={event.id}
                  badge={title}
                  desc={desc}
                  ctaLabel={
                    isRegistered
                      ? isEn
                        ? 'View Pass'
                        : 'Показать билет'
                      : isEn
                      ? 'Register'
                      : 'Записаться'
                  }
                  onStart={() => onRegisterOpenDoor(event.id)}
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
  )
}
