import { useState } from 'react'
import { COLORS } from '../constants'
import { ExamCard } from '../components/ExamCard'
import { useLang } from '../context/LangContext'
import { useIsMobile } from '../hooks/examHooks'
import { MathIcon, EventIcon } from '../components/Icons'

type ViewMode = 'selection' | 'exams' | 'events'

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
  const [viewMode, setViewMode] = useState<ViewMode>('selection')

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

  const visibleEvents = events.filter(e => !(e.format_en && e.format_en.endsWith('__hidden')))
  const sortedEvents = [...visibleEvents].sort((a, b) => {
    if (a.id === 'project-fest') return -1
    if (b.id === 'project-fest') return 1
    return 0
  })

  /* ─────────────────────── SHARED BACKGROUND ─────────────────────── */
  const pageBackground = (
    <>
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
    </>
  )

  /* ─────────────────────── HERO HEADER ─────────────────────── */
  const heroHeader = (subtitle: string) => (
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
        {subtitle}
      </p>
    </div>
  )

  /* ─────────────────────── BACK BUTTON ─────────────────────── */
  const backButton = (
    <div style={{ width: '100%', maxWidth: 1120 }}>
      <button
        type="button"
        onClick={() => setViewMode('selection')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'color-mix(in srgb, var(--t-text) 6%, transparent)',
          border: '1px solid color-mix(in srgb, var(--t-text) 12%, transparent)',
          color: 'var(--t-text)',
          borderRadius: 8,
          padding: '8px 18px',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 0.18s ease, border-color 0.18s ease, transform 0.15s ease',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.background = 'color-mix(in srgb, var(--c-accent) 15%, transparent)'
          el.style.borderColor = 'var(--c-accent)'
          el.style.transform = 'translateX(-2px)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.background = 'color-mix(in srgb, var(--t-text) 6%, transparent)'
          el.style.borderColor = 'color-mix(in srgb, var(--t-text) 12%, transparent)'
          el.style.transform = 'translateX(0)'
        }}
      >
        {t('landing.category.back')}
      </button>
    </div>
  )

  /* ─────────────────────── CATEGORY SECTION HEADER ─────────────────────── */
  const sectionHeading = (icon: React.ReactNode, title: string, accent: string) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 18px',
        background: `color-mix(in srgb, ${accent} 10%, transparent)`,
        border: `1px solid color-mix(in srgb, ${accent} 25%, transparent)`,
        borderRadius: 8,
        alignSelf: 'flex-start',
      }}
    >
      <span style={{ color: accent, display: 'flex' }}>{icon}</span>
      <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--t-text)' }}>{title}</span>
    </div>
  )

  /* ─────────────────────── VIEWS ─────────────────────── */

  if (viewMode === 'exams') {
    return (
      <div
        style={{
          background: 'var(--t-bg)',
          minHeight: 'calc(100vh - 60px)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: isMobile ? '32px 20px 48px' : '48px 32px 80px',
          boxSizing: 'border-box',
          animation: 'fadeInUp 0.3s ease both',
        }}
      >
        {pageBackground}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: 1120,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: isMobile ? 24 : 32,
          }}
        >
          {backButton}

          {sectionHeading(
            <MathIcon size={18} />,
            isEn ? 'Admissions Tests' : 'Вступительные испытания',
            COLORS.accent,
          )}

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
              } else if (subj === 'physics') {
                accent = COLORS.blueLight
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
          </div>
        </div>
      </div>
    )
  }

  if (viewMode === 'events') {
    return (
      <div
        style={{
          background: 'var(--t-bg)',
          minHeight: 'calc(100vh - 60px)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: isMobile ? '32px 20px 48px' : '48px 32px 80px',
          boxSizing: 'border-box',
          animation: 'fadeInUp 0.3s ease both',
        }}
      >
        {pageBackground}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: 1120,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: isMobile ? 24 : 32,
          }}
        >
          {backButton}

          {sectionHeading(
            <EventIcon size={18} />,
            isEn ? 'Events & Fairs' : 'Мероприятия и выставки',
            COLORS.success,
          )}

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
            {sortedEvents.length === 0 && (
              <p style={{ color: 'var(--t-muted)', fontSize: 15 }}>
                {isEn ? 'No events available at the moment.' : 'Мероприятия пока не добавлены.'}
              </p>
            )}
            {sortedEvents.map((event) => {
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
                      ? isEn ? 'View Pass' : 'Показать билет'
                      : isEn ? 'Register' : 'Записаться'
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
            })}
          </div>
        </div>
      </div>
    )
  }

  /* ─────────────────────── SELECTION (default) ─────────────────────── */
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
      {pageBackground}

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 900,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: isMobile ? 36 : 56,
        }}
      >
        {heroHeader(t('landing.dashboard.subtitle'))}

        {/* Two category cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? 20 : 28,
            width: '100%',
          }}
        >
          {/* ── Exams Card ── */}
          <CategoryCard
            icon={<MathIcon size={36} />}
            title={t('landing.category.exams.title')}
            desc={t('landing.category.exams.desc')}
            ctaLabel={t('landing.category.exams.cta')}
            accent={COLORS.accent}
            countLabel={
              subjects.length > 0
                ? isEn
                  ? `${subjects.length} subject${subjects.length !== 1 ? 's' : ''}`
                  : `${subjects.length} предмет${subjects.length === 1 ? '' : subjects.length < 5 ? 'а' : 'ов'}`
                : isEn ? 'Available' : 'Доступно'
            }
            onClick={() => setViewMode('exams')}
          />

          {/* ── Events Card ── */}
          <CategoryCard
            icon={<EventIcon size={36} />}
            title={t('landing.category.events.title')}
            desc={t('landing.category.events.desc')}
            ctaLabel={t('landing.category.events.cta')}
            accent={COLORS.success}
            countLabel={
              sortedEvents.length > 0
                ? isEn
                  ? `${sortedEvents.length} event${sortedEvents.length !== 1 ? 's' : ''}`
                  : `${sortedEvents.length} мероприяти${sortedEvents.length === 1 ? 'е' : sortedEvents.length < 5 ? 'я' : 'й'}`
                : isEn ? 'Coming soon' : 'Скоро'
            }
            onClick={() => setViewMode('events')}
          />
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   CategoryCard — premium big card for the selection screen
═══════════════════════════════════════════════════════════ */
function CategoryCard({
  icon,
  title,
  desc,
  ctaLabel,
  accent,
  countLabel,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  ctaLabel: string
  accent: string
  countLabel: string
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(135deg, color-mix(in srgb, ${accent} 12%, var(--t-card-bg)), var(--t-card-bg))`
          : 'var(--t-card-bg)',
        border: `2px solid ${hovered ? accent : `color-mix(in srgb, ${accent} 28%, transparent)`}`,
        borderRadius: 16,
        padding: '40px 32px 32px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        boxShadow: hovered
          ? `0 24px 56px color-mix(in srgb, ${accent} 18%, rgba(0,0,0,0.12))`
          : 'var(--t-shadow)',
        transform: hovered ? 'translateY(-8px) scale(1.01)' : 'translateY(0) scale(1)',
        transition: 'all 0.28s cubic-bezier(0.25, 0.8, 0.25, 1)',
        userSelect: 'none',
        outline: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow blob */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: `radial-gradient(circle, color-mix(in srgb, ${accent} 20%, transparent) 0%, transparent 70%)`,
          pointerEvents: 'none',
          transition: 'opacity 0.28s ease',
          opacity: hovered ? 1 : 0.5,
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 14,
          background: `color-mix(in srgb, ${accent} 14%, transparent)`,
          border: `1.5px solid color-mix(in srgb, ${accent} 30%, transparent)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accent,
          marginBottom: 24,
          transition: 'transform 0.2s ease, background 0.25s ease',
          transform: hovered ? 'scale(1.08) rotate(-3deg)' : 'scale(1) rotate(0deg)',
        }}
      >
        {icon}
      </div>

      {/* Count badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '3px 10px',
          borderRadius: 20,
          background: `color-mix(in srgb, ${accent} 12%, transparent)`,
          border: `1px solid color-mix(in srgb, ${accent} 25%, transparent)`,
          color: accent,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          marginBottom: 14,
          alignSelf: 'flex-start',
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: accent,
            display: 'inline-block',
          }}
        />
        {countLabel}
      </div>

      {/* Title */}
      <h2
        style={{
          fontWeight: 800,
          fontSize: 22,
          color: 'var(--t-text)',
          marginBottom: 12,
          lineHeight: 1.2,
          letterSpacing: '-0.3px',
        }}
      >
        {title}
      </h2>

      {/* Description */}
      <p
        style={{
          fontSize: 14,
          color: 'var(--t-muted)',
          lineHeight: 1.65,
          marginBottom: 28,
          flexGrow: 1,
        }}
      >
        {desc}
      </p>

      {/* CTA */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '13px 24px',
          borderRadius: 10,
          background: hovered ? accent : `color-mix(in srgb, ${accent} 14%, transparent)`,
          color: hovered ? '#fff' : accent,
          fontWeight: 700,
          fontSize: 14,
          transition: 'background 0.22s ease, color 0.22s ease, transform 0.18s ease',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
          alignSelf: 'flex-start',
          border: `1.5px solid ${hovered ? accent : `color-mix(in srgb, ${accent} 40%, transparent)`}`,
        }}
      >
        {ctaLabel}
        <span
          style={{
            fontSize: 18,
            lineHeight: 1,
            transform: hovered ? 'translateX(3px)' : 'translateX(0)',
            transition: 'transform 0.18s ease',
            display: 'inline-block',
          }}
        >
          →
        </span>
      </div>
    </div>
  )
}
