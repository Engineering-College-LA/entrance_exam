import { COLORS } from '../constants'
import { useLang } from '../context/LangContext'

export function ExamCard({
  badge,
  desc,
  questions,
  time,
  ctaLabel,
  onStart,
  accent,
  disabled,
  disabledHint,
  disabledCta,
}: {
  badge: string
  desc: string
  questions: string
  time: string
  ctaLabel: string
  onStart: () => void
  accent: string
  disabled?: boolean
  /** When set, replaces the default “admin closed” disabled copy */
  disabledHint?: string
  disabledCta?: string
}) {
  const { t } = useLang()
  const rows = [
    [t('landing.card.subject'), t('landing.card.subject.val')],
    [t('landing.card.format'), t('landing.card.format.val')],
    [t('landing.card.questions'), questions],
    [t('landing.card.time'), time],
    [t('landing.card.results'), t('landing.card.results.val')],
  ]
  const isEn = t('landing.title1') === 'Mathematics'
  return (
    <div
      style={{
        background: disabled ? 'rgba(255,255,255,.02)' : 'rgba(255,255,255,.05)',
        border: `1px solid ${disabled ? 'rgba(255,255,255,.08)' : accent + '44'}`,
        borderRadius: 8,
        padding: 22,
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        opacity: disabled ? 0.55 : 1,
        transition: 'opacity .2s',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 14,
            color: COLORS.white,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              color: disabled ? '#526a8a' : accent,
              fontSize: 16,
            }}
          >
            ∑
          </span>{' '}
          {badge}
        </div>
        {disabled ? (
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 10,
              background: 'rgba(255,255,255,.06)',
              color: '#526a8a',
              border: '1px solid rgba(255,255,255,.1)',
              padding: '2px 8px',
              borderRadius: 2,
              letterSpacing: 1,
            }}
          >
            CLOSED
          </span>
        ) : (
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 10,
              background: `${accent}22`,
              color: accent,
              border: `1px solid ${accent}44`,
              padding: '2px 8px',
              borderRadius: 2,
              letterSpacing: 1,
            }}
          >
            MCQ
          </span>
        )}
      </div>
      <p
        style={{
          fontSize: 12,
          color: '#6a85a8',
          marginBottom: 14,
          lineHeight: 1.5,
        }}
      >
        {disabled
          ? disabledHint ??
            (isEn
              ? 'Registration is currently closed by the administrator.'
              : 'Регистрация временно закрыта администратором.')
          : desc}
      </p>
      {rows.map(([label, val]) => (
        <div
          key={String(label)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '9px 0',
            borderBottom: '1px solid rgba(255,255,255,.06)',
            fontSize: 13,
          }}
        >
          <span style={{ color: '#8fa3c0' }}>{label}</span>
          <span style={{ color: COLORS.white, fontWeight: 600 }}>{val}</span>
        </div>
      ))}
      <div
        style={{
          padding: '9px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 13,
        }}
      >
        <span style={{ color: '#8fa3c0' }}>{t('landing.card.attempts')}</span>
        <span
          style={{
            background: 'rgba(21,101,192,.3)',
            color: '#7fb3ff',
            fontFamily: 'monospace',
            fontSize: 11,
            padding: '2px 8px',
            borderRadius: 2,
          }}
        >
          {t('landing.card.attempts.val')}
        </span>
      </div>
      <button
        type="button"
        onClick={disabled ? undefined : onStart}
        disabled={disabled}
        style={{
          marginTop: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          background: disabled ? 'rgba(255,255,255,.06)' : accent,
          color: disabled ? '#526a8a' : COLORS.navy,
          fontWeight: 800,
          fontSize: 13,
          padding: '12px 20px',
          borderRadius: 3,
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          letterSpacing: 0.3,
        }}
      >
        {disabled
          ? disabledCta ?? (isEn ? 'Unavailable' : 'Недоступно')
          : ctaLabel}{' '}
        {!disabled && <span style={{ fontSize: 16 }}>→</span>}
      </button>
    </div>
  )
}
