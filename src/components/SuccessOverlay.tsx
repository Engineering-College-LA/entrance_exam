import { useEffect, useState } from 'react'
import { COLORS } from '../constants'

const OVERLAY_CONFETTI = [
  { left: '4%', delay: '0s', color: COLORS.accent },
  { left: '14%', delay: '0.12s', color: COLORS.blue },
  { left: '24%', delay: '0.3s', color: COLORS.success },
  { left: '34%', delay: '0.05s', color: COLORS.blueLight },
  { left: '44%', delay: '0.22s', color: COLORS.accent },
  { left: '54%', delay: '0.4s', color: COLORS.blue },
  { left: '64%', delay: '0.08s', color: COLORS.success },
  { left: '74%', delay: '0.3s', color: COLORS.blueLight },
  { left: '84%', delay: '0.15s', color: COLORS.accent },
  { left: '94%', delay: '0.35s', color: COLORS.blue },
]

const CELEBRATION_MS = 2200

export function SuccessOverlay({
  title,
  subtitle,
  onDone,
}: {
  title: string
  subtitle: string
  onDone?: () => void
}) {
  const [show, setShow] = useState(true)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => setClosing(true), CELEBRATION_MS)
    return () => window.clearTimeout(id)
  }, [])

  if (!show) return null

  return (
    <div
      onClick={() => setClosing(true)}
      onAnimationEnd={() => {
        if (closing) {
          setShow(false)
          onDone?.()
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(11,31,58,.82)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: 'pointer',
        animation: closing
          ? 'overlayFadeOut 0.45s ease both'
          : 'overlayFadeIn 0.3s ease both',
      }}
    >
      {OVERLAY_CONFETTI.map((c, i) => (
        <span
          key={i}
          className="overlay-confetti"
          style={{
            left: c.left,
            width: 9,
            height: 9,
            background: c.color,
            animationDelay: c.delay,
          }}
        />
      ))}
      <div style={{ textAlign: 'center', padding: '0 24px' }}>
        <div
          style={{
            position: 'relative',
            width: 120,
            height: 120,
            margin: '0 auto 24px',
          }}
        >
          <span className="success-ring" />
          <span className="success-ring" style={{ animationDelay: '0.4s' }} />
          <svg
            viewBox="0 0 84 84"
            width={120}
            height={120}
            style={{
              position: 'relative',
              animation: 'successPop 0.5s cubic-bezier(.34,1.56,.64,1) both',
            }}
          >
            <circle
              cx="42"
              cy="42"
              r="40"
              fill="color-mix(in srgb, var(--c-success) 16%, transparent)"
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
        <div
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: COLORS.white,
            marginBottom: 8,
            animation: 'fadeInUp 0.4s ease 0.15s both',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 14,
            color: '#c2d2e8',
            animation: 'fadeInUp 0.4s ease 0.25s both',
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  )
}
