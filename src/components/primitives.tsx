import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from 'react'
import { COLORS } from '../constants'
import { PAGES, STEP_KEYS } from '../constants'
import { useLang } from '../context/LangContext'
import { Styles } from '../styles'
import type { RegistrationField } from '../types/exam'

export function Breadcrumb({
  items,
}: {
  items: { text: string; highlight?: boolean; color?: string }[]
}) {
  return (
    <div style={Styles.breadcrumb}>
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && ' → '}
          {item.highlight ? (
            <span style={{ color: item.color || COLORS.blue }}>{item.text}</span>
          ) : (
            item.text
          )}
        </span>
      ))}
    </div>
  )
}

export function StepBar({ current }: { current: keyof typeof PAGES }) {
  const { t } = useLang()
  const active = PAGES[current]?.step ?? -1
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
      {STEP_KEYS.map((key, i) => (
        <div
          key={key}
          style={{
            display: 'flex',
            alignItems: 'center',
            flex: i < STEP_KEYS.length - 1 ? 1 : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontFamily: 'monospace',
                fontWeight: 600,
                flexShrink: 0,
                background:
                  i < active
                    ? COLORS.success
                    : i === active
                      ? '#e8f0fb'
                      : COLORS.white,
                color:
                  i < active
                    ? COLORS.white
                    : i === active
                      ? COLORS.blue
                      : COLORS.muted,
                border: `2px solid ${
                  i < active
                    ? COLORS.success
                    : i === active
                      ? COLORS.blue
                      : COLORS.border
                }`,
              }}
            >
              {i < active ? '✓' : i + 1}
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                color:
                  i === active
                    ? COLORS.blue
                    : i < active
                      ? COLORS.success
                      : COLORS.muted,
              }}
            >
              {t(key)}
            </span>
          </div>
          {i < STEP_KEYS.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 2,
                margin: '0 8px',
                background: i < active ? COLORS.success : COLORS.border,
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export function StatBox({
  value,
  label,
  color,
}: {
  value: string | number
  label: string
  color: string
}) {
  return (
    <div
      style={{
        ...Styles.card,
        padding: 18,
        textAlign: 'center',
        boxShadow: 'none',
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 24, color }}>{value}</div>
      <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>
        {label}
      </div>
    </div>
  )
}

export function ScoreRing({ pct, color }: { pct: number; color: string }) {
  const { t } = useLang()
  const c = 2 * Math.PI * 54
  const offset = c - (pct / 100) * c
  return (
    <div style={{ position: 'relative', width: 140, height: 140 }}>
      <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          stroke="rgba(255,255,255,.1)"
          strokeWidth="8"
        />
        <circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 28, color: COLORS.white }}>
          {pct}%
        </div>
        <div style={{ fontSize: 11, color: '#8fa3c0' }}>{t('report.score')}</div>
      </div>
    </div>
  )
}

export function TopicBar({ nameKey, pct }: { nameKey: string; pct: number }) {
  const { t } = useLang()
  const c =
    pct >= 70 ? COLORS.success : pct >= 50 ? COLORS.accent : COLORS.danger
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '13px 22px',
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{t(nameKey)}</div>
      <div
        style={{
          flex: 2,
          height: 8,
          background: COLORS.border,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            background: c,
            borderRadius: 4,
            width: `${pct}%`,
          }}
        />
      </div>
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: 11,
          color: COLORS.muted,
          minWidth: 36,
          textAlign: 'right',
        }}
      >
        {pct}%
      </div>
    </div>
  )
}

export function OptionCard({
  letter,
  text,
  selected,
  onClick,
}: {
  letter: string
  text: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '13px 16px',
        borderRadius: 6,
        border: `1.5px solid ${selected ? COLORS.blue : COLORS.border}`,
        background: selected ? '#e8f0fb' : COLORS.white,
        cursor: 'pointer',
        fontSize: 14,
        transition: 'all .12s',
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          fontSize: 12,
          fontWeight: 500,
          flexShrink: 0,
          background: selected ? COLORS.blue : COLORS.off,
          color: selected ? COLORS.white : COLORS.muted,
          transition: 'all .12s',
        }}
      >
        {letter}
      </span>
      {text}
    </div>
  )
}

export function NavDot({
  index,
  isCurrent,
  isAnswered,
  onClick,
}: {
  index: number
  isCurrent: boolean
  isAnswered: boolean
  onClick: () => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      style={{
        width: 30,
        height: 30,
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        fontSize: 11,
        cursor: 'pointer',
        fontWeight: isCurrent ? 700 : 400,
        background: isCurrent ? COLORS.blue : isAnswered ? COLORS.navy : COLORS.off,
        color: isCurrent || isAnswered ? COLORS.white : COLORS.muted,
        border: `1.5px solid ${
          isCurrent ? COLORS.blue : isAnswered ? COLORS.navy : COLORS.border
        }`,
      }}
    >
      {index + 1}
    </div>
  )
}

export function RuleCard({
  icon,
  color,
  titleKey,
  descKey,
}: {
  icon: string
  color: string
  titleKey: string
  descKey: string
}) {
  const { t } = useLang()
  return (
    <div
      style={{
        ...Styles.card,
        padding: 18,
        display: 'flex',
        gap: 12,
        boxShadow: 'none',
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 6,
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
          {t(titleKey)}
        </div>
        <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.5 }}>
          {t(descKey)}
        </div>
      </div>
    </div>
  )
}

export function FormField({
  field,
  value,
  onChange,
  error,
  shakeKey,
}: {
  field: RegistrationField
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  error?: string
  shakeKey?: number
}) {
  const { t } = useLang()
  const label = t(field.labelKey)
  const prevShakeKey = useRef(shakeKey)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (shakeKey !== prevShakeKey.current && shakeKey && shakeKey > 0 && error) {
      const id = window.requestAnimationFrame(() => setShake(true))
      const timer = window.setTimeout(() => setShake(false), 400)
      prevShakeKey.current = shakeKey
      return () => {
        window.cancelAnimationFrame(id)
        window.clearTimeout(timer)
      }
    }
    prevShakeKey.current = shakeKey
  }, [shakeKey, error])

  const errorStyle: CSSProperties = error
    ? {
        borderColor: COLORS.danger,
        boxShadow: '0 0 0 3px rgba(192,57,43,.15)',
      }
    : {}
  const inputStyle = { ...Styles.input, ...errorStyle }
  const errorEl = error ? (
    <div
      className="field-error-msg"
      style={{
        color: COLORS.danger,
        fontSize: 11,
        marginTop: 5,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <span style={{ fontWeight: 700 }}>✕</span> {t(error)}
    </div>
  ) : null

  if (field.type === 'select' && field.options) {
    return (
      <div className={shake ? 'field-shake' : ''}>
        <label style={Styles.label}>
          {label}
          {field.required && (
            <span style={{ color: COLORS.danger }}> *</span>
          )}
        </label>
        <select style={inputStyle} value={value} onChange={onChange}>
          <option value="">
            {t('field.select')} {label.toLowerCase()}
          </option>
          {field.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {errorEl}
      </div>
    )
  }
  if (field.type === 'phone') {
    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value
      if (!val.startsWith('+996')) val = '+996'
      if (val.length > 13) val = val.slice(0, 13)
      const next = { ...e, target: { ...e.target, value: val } }
      onChange(next as ChangeEvent<HTMLInputElement>)
    }
    return (
      <div className={shake ? 'field-shake' : ''}>
        <label style={Styles.label}>
          {label}
          {field.required && (
            <span style={{ color: COLORS.danger }}> *</span>
          )}
        </label>
        <input
          style={inputStyle}
          type="tel"
          value={value}
          onChange={handlePhoneChange}
          maxLength={13}
        />
        {errorEl}
      </div>
    )
  }
  return (
    <div className={shake ? 'field-shake' : ''}>
      <label style={Styles.label}>
        {label}
        {field.required && <span style={{ color: COLORS.danger }}> *</span>}
      </label>
      <input
        style={inputStyle}
        type={field.type}
        placeholder={
          field.placeholderKey ? t(field.placeholderKey) : undefined
        }
        value={value}
        onChange={onChange}
      />
      {errorEl}
    </div>
  )
}

export function Toast({
  message,
  onClose,
}: {
  message: string
  onClose: () => void
}) {
  const [exiting, setExiting] = useState(false)
  useEffect(() => {
    const t1 = window.setTimeout(() => setExiting(true), 3200)
    const t2 = window.setTimeout(() => onClose(), 3600)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [onClose])
  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 9999,
        background: COLORS.danger,
        color: COLORS.white,
        padding: '14px 20px',
        borderRadius: 8,
        maxWidth: 320,
        boxShadow: '0 8px 32px rgba(192,57,43,.4)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        animation: exiting
          ? 'slideOutRight .4s ease both'
          : 'slideInRight .35s cubic-bezier(.34,1.56,.64,1) both',
      }}
    >
      <span style={{ fontSize: 20, lineHeight: 1 }}>⚠️</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>
          Validation Error
        </div>
        <div style={{ fontSize: 12, opacity: 0.9 }}>{message}</div>
      </div>
      <button
        type="button"
        onClick={() => {
          setExiting(true)
          window.setTimeout(onClose, 400)
        }}
        style={{
          marginLeft: 'auto',
          background: 'none',
          border: 'none',
          color: COLORS.white,
          cursor: 'pointer',
          fontSize: 16,
          lineHeight: 1,
          padding: 2,
          opacity: 0.8,
        }}
      >
        ✕
      </button>
    </div>
  )
}

export function InfoBanner({
  icon,
  text,
  bg,
  borderColor,
  color,
}: {
  icon: string
  text: string
  bg: string
  borderColor: string
  color: string
}) {
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${borderColor}`,
        borderRadius: 4,
        padding: '10px 14px',
        marginBottom: 22,
        fontSize: 12,
        color,
        display: 'flex',
        gap: 8,
        alignItems: 'center',
      }}
    >
      <span>{icon}</span> {text}
    </div>
  )
}
