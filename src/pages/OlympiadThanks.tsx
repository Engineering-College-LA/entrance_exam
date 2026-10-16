import { COLORS } from '../constants'
import { Styles } from '../styles'
import { useLang } from '../context/LangContext'

const CONFETTI = [
  { left: '8%', delay: '0s', color: COLORS.accent },
  { left: '22%', delay: '0.15s', color: COLORS.blue },
  { left: '38%', delay: '0.05s', color: COLORS.success },
  { left: '58%', delay: '0.2s', color: COLORS.blueLight },
  { left: '74%', delay: '0.1s', color: COLORS.accent },
  { left: '90%', delay: '0.25s', color: COLORS.blue },
]

export function OlympiadThanks({ onHome }: { onHome: () => void }) {
  const { t } = useLang()
  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '56px 20px' }}>
      <div
        style={{
          ...Styles.card,
          overflow: 'hidden',
          textAlign: 'center',
          animation: 'fadeInUp 0.35s ease both',
        }}
      >
        <div style={{ ...Styles.cardHeader, justifyContent: 'center' }}>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: COLORS.white }}>
              {t('olympiad.thanks.title')}
            </div>
            <div style={{ color: '#8fa3c0', fontSize: 13, marginTop: 4 }}>
              {t('olympiad.thanks.sub')}
            </div>
          </div>
        </div>
        <div style={{ padding: '40px 28px 32px' }}>
          <div
            style={{
              position: 'relative',
              width: 84,
              height: 84,
              margin: '0 auto 20px',
            }}
          >
            <span className="success-ring" />
            <span
              className="success-ring"
              style={{ animationDelay: '0.4s' }}
            />
            {CONFETTI.map((c, i) => (
              <span
                key={i}
                className="success-confetti"
                style={{
                  left: c.left,
                  width: 6,
                  height: 6,
                  background: c.color,
                  animationDelay: c.delay,
                }}
              />
            ))}
            <svg
              viewBox="0 0 84 84"
              width={84}
              height={84}
              style={{
                position: 'relative',
                animation: 'successPop 0.5s cubic-bezier(.34,1.56,.64,1) both',
              }}
            >
              <circle
                cx="42"
                cy="42"
                r="40"
                fill="color-mix(in srgb, var(--c-success) 12%, transparent)"
                stroke={COLORS.success}
                strokeWidth="2"
              />
              <path
                d="M26 43 L37 54 L58 30"
                fill="none"
                stroke={COLORS.success}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: 1,
                  animation: 'checkDraw 0.4s ease 0.35s forwards',
                }}
              />
            </svg>
          </div>
          <p
            style={{
              fontSize: 15,
              color: COLORS.muted,
              lineHeight: 1.65,
              marginBottom: 28,
            }}
          >
            {t('olympiad.thanks.body')}
          </p>
          <button type="button" onClick={onHome} style={Styles.btnPrimary()}>
            {t('olympiad.thanks.home')}
          </button>
        </div>
      </div>
    </div>
  )
}
