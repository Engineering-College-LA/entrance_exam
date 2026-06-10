import { COLORS } from '../constants'
import { ExamCard } from '../components/ExamCard'
import { useLang } from '../context/LangContext'
import { useIsMobile } from '../hooks/examHooks'

export function Landing({
  onSelectSubject,
  onRegisterOpenDoor,
  isPlacementActive,
}: {
  onSelectSubject: (pageId: 'subject') => void
  onRegisterOpenDoor: () => void
  isPlacementActive: boolean | null
}) {
  const { t } = useLang()
  const isMobile = useIsMobile()
  const isEn = t('landing.title1') === 'Mathematics'

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
          {/* Card 1: Mathematics */}
          <ExamCard
            badge={t('dashboard.subject.math.title')}
            desc={t('dashboard.subject.math.desc')}
            ctaLabel={t('dashboard.subject.math.cta')}
            onStart={() => onSelectSubject('subject')}
            accent={COLORS.accent}
            icon="∑"
            showAttempts={false}
            customRows={[
              [t('landing.card.format'), 'MCQ'],
              [
                isEn ? 'Tests' : 'Тесты',
                isPlacementActive ? '2 (Trial & Placement)' : '1 (Trial)',
              ],
              [isEn ? 'Languages' : 'Языки', 'RU & EN'],
            ]}
          />

          {/* Card 2: English Language (Coming Soon) */}
          <ExamCard
            badge={t('dashboard.subject.english.title')}
            desc={t('dashboard.subject.english.desc')}
            ctaLabel={t('dashboard.subject.english.comingSoon')}
            onStart={() => {}}
            accent={COLORS.blue}
            icon="🔤"
            disabled={true}
            disabledHint={t('dashboard.subject.english.comingSoon')}
            disabledCta={t('dashboard.subject.english.comingSoon')}
            showAttempts={false}
            customRows={[
              [t('landing.card.format'), 'MCQ / Grammar'],
              [isEn ? 'Tests' : 'Тесты', isEn ? 'Coming Soon' : 'Скоро'],
              [isEn ? 'Languages' : 'Языки', 'EN'],
            ]}
          />

          {/* Card 3: Project Fest Event Card */}
          <ExamCard
            badge={t('landing.openDoor.title')}
            desc={t('landing.openDoor.desc')}
            ctaLabel={t('landing.openDoor.cta')}
            onStart={onRegisterOpenDoor}
            accent={COLORS.success}
            icon="🚪"
            showAttempts={false}
            customRows={[
              [t('landing.openDoor.date'), t('landing.openDoor.date.val')],
              [t('landing.openDoor.time'), t('landing.openDoor.time.val')],
              [t('landing.card.format'), t('landing.openDoor.format.val')],
              [t('landing.openDoor.req'), t('landing.openDoor.req.val')],
            ]}
          />
        </div>
      </div>
    </div>
  )
}
