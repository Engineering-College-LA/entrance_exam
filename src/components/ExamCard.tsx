import { useState } from 'react'
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
  customRows,
  showAttempts = true,
  icon,
  variant = 'primary',
  statusBadge,
  tooltipText,
}: {
  badge: string
  desc: string
  questions?: string
  time?: string
  ctaLabel: string
  onStart?: () => void
  accent: string
  disabled?: boolean
  /** When set, replaces the default “admin closed” disabled copy */
  disabledHint?: string
  disabledCta?: string
  customRows?: [string, string][]
  showAttempts?: boolean
  icon?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success'
  statusBadge?: string
  tooltipText?: string
}) {
  const { t, lang } = useLang()
  const [hovered, setHovered] = useState(false)

  const rows = customRows ?? [
    [t('landing.card.subject'), t('landing.card.subject.val')],
    [t('landing.card.format'), t('landing.card.format.val')],
    [t('landing.card.questions'), questions ?? ''],
    [t('landing.card.time'), time ?? ''],
    [t('landing.card.results'), t('landing.card.results.val')],
  ]
  const isEn = t('landing.title1') === 'Mathematics'

  const buttonEl = (
    <button
      type="button"
      onClick={disabled || variant === 'success' ? undefined : onStart}
      disabled={disabled}
      style={{
        marginTop: 20,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        background: disabled
          ? 'color-mix(in srgb, var(--t-text) 4%, transparent)'
          : variant === 'success'
          ? 'color-mix(in srgb, var(--c-success) 10%, transparent)'
          : variant === 'secondary'
          ? hovered
            ? accent
            : 'transparent'
          : accent,
        color: disabled
          ? 'color-mix(in srgb, var(--t-text) 30%, transparent)'
          : variant === 'success'
          ? 'var(--c-success)'
          : variant === 'secondary'
          ? hovered
            ? COLORS.white
            : accent
          : COLORS.navy,
        border: disabled
          ? '1px solid color-mix(in srgb, var(--t-text) 8%, transparent)'
          : variant === 'success'
          ? '1.5px solid color-mix(in srgb, var(--c-success) 25%, transparent)'
          : variant === 'secondary'
          ? `1.5px solid ${accent}`
          : 'none',
        fontWeight: 800,
        fontSize: 13,
        padding: '12px 20px',
        borderRadius: 6,
        cursor: disabled ? 'not-allowed' : variant === 'success' ? 'default' : 'pointer',
        letterSpacing: 0.3,
        boxShadow: hovered && !disabled && variant === 'primary'
          ? `0 4px 14px color-mix(in srgb, ${accent} 35%, transparent)`
          : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      {disabled
        ? disabledCta ?? (isEn ? 'Unavailable' : 'Недоступно')
        : ctaLabel}{' '}
      {!disabled && variant !== 'success' && (
        <span
          style={{
            fontSize: 16,
            transform: hovered ? 'translateX(4px)' : 'translateX(0)',
            transition: 'transform 0.2s ease',
            display: 'inline-block',
            lineHeight: 1,
          }}
        >
          →
        </span>
      )}
    </button>
  )

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: disabled
          ? 'color-mix(in srgb, var(--t-text) 3%, var(--t-card-bg))'
          : 'var(--t-card-bg)',
        border: `1.5px solid ${
          disabled
            ? 'color-mix(in srgb, var(--t-text) 10%, transparent)'
            : hovered
            ? accent
            : `color-mix(in srgb, ${accent} 25%, transparent)`
        }`,
        borderRadius: 12,
        padding: 24,
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        boxShadow: hovered && !disabled
          ? '0 20px 40px rgba(11, 31, 58, 0.16)'
          : 'var(--t-shadow)',
        transform: hovered && !disabled ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 14,
            color: disabled
              ? 'color-mix(in srgb, var(--t-text) 55%, transparent)'
              : 'var(--t-text)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {icon && (
            <span
              style={{
                color: disabled
                  ? 'color-mix(in srgb, var(--t-text) 40%, transparent)'
                  : accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </span>
          )}
          {badge}
        </div>
        
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {statusBadge && (
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 10,
                background: 'color-mix(in srgb, var(--c-success) 12%, transparent)',
                color: 'var(--c-success)',
                border: '1px solid color-mix(in srgb, var(--c-success) 25%, transparent)',
                padding: '3px 8px',
                borderRadius: 4,
                letterSpacing: 1,
                fontWeight: 600,
              }}
            >
              {statusBadge}
            </span>
          )}
          {disabled ? (
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 10,
                background: 'color-mix(in srgb, var(--t-text) 6%, transparent)',
                color: 'color-mix(in srgb, var(--t-text) 45%, transparent)',
                border: '1px solid color-mix(in srgb, var(--t-text) 12%, transparent)',
                padding: '3px 8px',
                borderRadius: 4,
                letterSpacing: 1,
                fontWeight: 600,
              }}
            >
              {lang === 'ru' ? 'СКОРО' : 'CLOSED'}
            </span>
          ) : (
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 10,
                background: `color-mix(in srgb, ${accent} 13%, transparent)`,
                color: accent,
                border: `1px solid color-mix(in srgb, ${accent} 27%, transparent)`,
                padding: '3px 8px',
                borderRadius: 4,
                letterSpacing: 1,
                fontWeight: 600,
              }}
            >
              MCQ
            </span>
          )}
        </div>
      </div>
      <p
        style={{
          fontSize: 12,
          color: disabled
            ? 'color-mix(in srgb, var(--t-text) 40%, transparent)'
            : 'var(--t-muted)',
          marginBottom: 16,
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
            padding: '10px 0',
            borderBottom: '1px solid color-mix(in srgb, var(--t-text) 6%, transparent)',
            fontSize: 13,
            gap: 16,
          }}
        >
          <span
            style={{
              color: disabled
                ? 'color-mix(in srgb, var(--t-text) 35%, transparent)'
                : 'var(--t-muted)',
              flexShrink: 0,
            }}
          >
            {label}
          </span>
          <span
            style={{
              color: disabled
                ? 'color-mix(in srgb, var(--t-text) 50%, transparent)'
                : 'var(--t-text)',
              fontWeight: 600,
              textAlign: 'right',
            }}
          >
            {val}
          </span>
        </div>
      ))}
      {showAttempts && (
        <div
          style={{
            padding: '10px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 13,
          }}
        >
          <span
            style={{
              color: disabled
                ? 'color-mix(in srgb, var(--t-text) 35%, transparent)'
                : 'var(--t-muted)',
            }}
          >
            {t('landing.card.attempts')}
          </span>
          <span
            style={{
              background: disabled
                ? 'color-mix(in srgb, var(--t-text) 4%, transparent)'
                : `color-mix(in srgb, ${accent} 18%, transparent)`,
              color: disabled
                ? 'color-mix(in srgb, var(--t-text) 40%, transparent)'
                : accent,
              border: `1px solid ${
                disabled
                  ? 'color-mix(in srgb, var(--t-text) 10%, transparent)'
                  : `color-mix(in srgb, ${accent} 40%, transparent)`
              }`,
              fontFamily: 'monospace',
              fontSize: 11,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 4,
              letterSpacing: 0.5,
            }}
          >
            {t('landing.card.attempts.val')}
          </span>
        </div>
      )}
      {tooltipText ? (
        <div className="tooltip-container" style={{ width: '100%' }}>
          {buttonEl}
          <span className="tooltip-content">{tooltipText}</span>
        </div>
      ) : (
        buttonEl
      )}
    </div>
  )
}

