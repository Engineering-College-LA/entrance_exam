import { useEffect, useState } from 'react'
import { COLORS } from '../constants'
import { useLang } from '../context/LangContext'

function diffParts(targetMs: number) {
  const ms = Math.max(0, targetMs - Date.now())
  const totalSec = Math.floor(ms / 1000)
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    done: ms <= 0,
  }
}

export function Countdown({ targetDate }: { targetDate: string }) {
  const { t } = useLang()
  const targetMs = new Date(targetDate).getTime()
  const [parts, setParts] = useState(() => diffParts(targetMs))

  useEffect(() => {
    const id = window.setInterval(() => setParts(diffParts(targetMs)), 1000)
    return () => window.clearInterval(id)
  }, [targetMs])

  if (Number.isNaN(targetMs)) return null

  const unit = (value: number, labelKey: string) => (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: COLORS.white,
          fontFamily: 'monospace',
          lineHeight: 1,
        }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: '#9fb2cc',
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          marginTop: 4,
        }}
      >
        {t(labelKey)}
      </div>
    </div>
  )

  return (
    <div
      style={{
        background: `linear-gradient(135deg,${COLORS.navy} 0%,${COLORS.navy2} 100%)`,
        borderRadius: 8,
        padding: '20px 24px',
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: '#c2d2e8', marginBottom: 14 }}>
        {parts.done ? t('profile.countdown.done') : t('profile.countdown.title')}
      </div>
      {!parts.done && (
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
          {unit(parts.days, 'profile.countdown.days')}
          {unit(parts.hours, 'profile.countdown.hours')}
          {unit(parts.minutes, 'profile.countdown.minutes')}
          {unit(parts.seconds, 'profile.countdown.seconds')}
        </div>
      )}
    </div>
  )
}
