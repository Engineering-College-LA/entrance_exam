import { COLORS } from '../constants'
import { useLang } from '../context/LangContext'
import { useIsMobile } from '../hooks/examHooks'
import { ExamCard } from '../components/ExamCard'

export function Landing({
  onStartTrial,
  onStartPlacement,
  isPlacementActive,
}: {
  onStartTrial: () => void
  onStartPlacement: () => void
  isPlacementActive: boolean
}) {
  const { t } = useLang()
  const isMobile = useIsMobile()
  return (
    <div
      style={{
        background: COLORS.navy,
        minHeight: 'calc(100vh - 60px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
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
          padding: isMobile ? '48px 20px 40px' : '80px 32px 60px',
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
              background: 'rgba(232,160,32,.1)',
              border: '1px solid rgba(232,160,32,.3)',
              padding: '5px 14px',
              borderRadius: 2,
              marginBottom: 24,
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
              fontSize: isMobile ? 32 : 48,
              lineHeight: 1.05,
              color: COLORS.white,
              marginBottom: 18,
            }}
          >
            {t('landing.title1')}
            <br />
            <span style={{ color: COLORS.accent }}>
              {t('landing.title1') === 'Mathematics' ? 'Exams' : 'Экзамены'}
            </span>
          </h1>
          <p
            style={{
              fontSize: isMobile ? 14 : 16,
              color: '#8fa3c0',
              lineHeight: 1.7,
              maxWidth: 420,
              marginBottom: 40,
            }}
          >
            {t('landing.desc')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 6,
                  background: 'rgba(232,160,32,.12)',
                  border: '1px solid rgba(232,160,32,.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                📝
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: COLORS.white,
                  }}
                >
                  {t('landing.trial.badge')}
                </div>
                <div style={{ fontSize: 12, color: '#6a85a8', marginTop: 2 }}>
                  {t('landing.trial.questions')} · {t('landing.trial.time')}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 6,
                  background: 'rgba(21,101,192,.15)',
                  border: '1px solid rgba(21,101,192,.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                🎯
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: COLORS.white,
                  }}
                >
                  {t('landing.placement.badge')}
                </div>
                <div style={{ fontSize: 12, color: '#6a85a8', marginTop: 2 }}>
                  {t('landing.placement.questions')} ·{' '}
                  {t('landing.placement.time')}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ExamCard
            badge={t('landing.trial.badge')}
            desc={t('landing.trial.desc')}
            questions={t('landing.trial.questions')}
            time={t('landing.trial.time')}
            ctaLabel={t('landing.trial.cta')}
            onStart={onStartTrial}
            accent={COLORS.accent}
          />
          {isPlacementActive && (
            <ExamCard
              badge={t('landing.placement.badge')}
              desc={t('landing.placement.desc')}
              questions={t('landing.placement.questions')}
              time={t('landing.placement.time')}
              ctaLabel={t('landing.placement.cta')}
              onStart={onStartPlacement}
              accent={COLORS.blue}
            />
          )}
        </div>
      </div>
    </div>
  )
}
