import { useEffect, useState } from 'react'
import { COLORS } from '../constants'
import { ExamCard } from '../components/ExamCard'
import { useLang } from '../context/LangContext'
import { useIsMobile } from '../hooks/examHooks'
import { shouldDisablePlacementStart } from '../lib/placementCache'

export function SubjectLanding({
  onStartTrial,
  onStartPlacement,
  onRegisterOpenDoor,
  isPlacementActive,
  onBack,
}: {
  onStartTrial: () => void
  onStartPlacement: () => void
  onRegisterOpenDoor: () => void
  isPlacementActive: boolean | null
  onBack: () => void
}) {
  const { t } = useLang()
  const isMobile = useIsMobile()
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

  return (
    <div
      style={{
        background: 'var(--t-bg)',
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
              {t('landing.title1')}
              <br />
              <span style={{ color: COLORS.accent }}>
                {t('landing.title1') === 'Mathematics' ? 'Exams' : 'Экзамены'}
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
              {t('landing.desc')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 6,
                    background: 'color-mix(in srgb, var(--c-accent) 12%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--c-accent) 25%, transparent)',
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
                      color: 'var(--t-text)',
                    }}
                  >
                    {t('landing.trial.badge')}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--t-muted)', marginTop: 2 }}>
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
                      color: 'var(--t-text)',
                    }}
                  >
                    {t('landing.placement.badge')}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--t-muted)', marginTop: 2 }}>
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
                disabled={placementCachedOut}
                disabledHint={
                  placementCachedOut ? t('landing.placement.cacheDisabled') : undefined
                }
                disabledCta={
                  placementCachedOut ? t('landing.placement.cacheCta') : undefined
                }
              />
            )}
            <a
              onClick={(e) => {
                e.preventDefault()
                onRegisterOpenDoor()
              }}
              style={{
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                borderRadius: 10,
                border: `1px solid rgba(27,140,94,.35)`,
                background: `linear-gradient(145deg, rgba(27,140,94,.12) 0%, rgba(11,31,58,.4) 100%)`,
                padding: isMobile ? '18px 18px' : '22px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                fontFamily: 'inherit',
                textDecoration: 'none',
                color: 'inherit',
                boxSizing: 'border-box',
                transition: 'transform .15s, box-shadow .15s',
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 8,
                  background: 'rgba(27,140,94,.2)',
                  border: '1px solid rgba(27,140,94,.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                🚪
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: 'var(--t-text)',
                    marginBottom: 4,
                  }}
                >
                  {t('landing.openDoor.title')}
                </div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: COLORS.success,
                    marginBottom: 6,
                    letterSpacing: 0.2,
                  }}
                >
                  {t('openDoor.event.when')}
                </div>
                <div style={{ fontSize: 12, color: 'var(--t-muted)', lineHeight: 1.45 }}>
                  {t('landing.openDoor.desc')}
                </div>
              </div>
              <span
                style={{
                  flexShrink: 0,
                  fontWeight: 700,
                  fontSize: 12,
                  color: COLORS.success,
                  padding: '8px 14px',
                  borderRadius: 4,
                  background: 'rgba(27,140,94,.15)',
                  border: `1px solid rgba(27,140,94,.4)`,
                }}
              >
                {t('landing.openDoor.cta')}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
