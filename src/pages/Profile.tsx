import { useEffect, useState } from 'react'
import { COLORS, DEFAULT_COUNTDOWN_AT, WHATSAPP_CHANNEL_URL } from '../constants'
import { Breadcrumb } from '../components/primitives'
import { Countdown } from '../components/Countdown'
import { useLang } from '../context/LangContext'
import { getSetting } from '../lib/settings'
import { Styles } from '../styles'

function initials(firstName: string, lastName: string) {
  const a = firstName.trim().charAt(0)
  const b = lastName.trim().charAt(0)
  return `${a}${b}`.toUpperCase()
}

export function Profile({
  student,
  accountPhone,
}: {
  student: Record<string, string>
  accountPhone?: string | null
}) {
  const { t } = useLang()
  const [countdownAt, setCountdownAt] = useState(DEFAULT_COUNTDOWN_AT)

  useEffect(() => {
    let cancelled = false
    void getSetting('exam_countdown_at').then((value) => {
      if (!cancelled && value) setCountdownAt(value)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const fullName = `${student.firstName ?? ''} ${student.lastName ?? ''}`.trim()
  const phone = student.phone || accountPhone || ''

  const sectionCard = (children: React.ReactNode) => (
    <div style={{ ...Styles.card, padding: 24, marginBottom: 16 }}>{children}</div>
  )

  const sectionTitle = (text: string) => (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: COLORS.muted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 14,
      }}
    >
      {text}
    </div>
  )

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 20px' }}>
      <Breadcrumb
        items={[
          { text: 'college.edu.kg' },
          { text: t('page.profile'), highlight: true },
        ]}
      />

      <div style={{ ...Styles.card, overflow: 'hidden', marginBottom: 16 }}>
        <div style={Styles.cardHeader}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(255,255,255,.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 800,
              color: COLORS.white,
              flexShrink: 0,
            }}
          >
            {initials(student.firstName ?? '', student.lastName ?? '') || '🎓'}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: COLORS.white }}>
              {fullName || t('profile.guest')}
            </div>
            <div style={{ color: '#8fa3c0', fontSize: 13, marginTop: 4, fontFamily: 'monospace' }}>
              {phone || t('profile.noPhone')}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Countdown targetDate={countdownAt} />
      </div>

      {sectionCard(
        <>
          {sectionTitle(t('profile.whatsapp.title'))}
          <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 14 }}>
            {t('profile.whatsapp.sub')}
          </div>
          <a
            href={WHATSAPP_CHANNEL_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              ...Styles.btnPrimary('#25D366'),
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
            }}
          >
            <span>💬</span>
            {t('profile.whatsapp.cta')}
          </a>
        </>,
      )}

      {sectionCard(
        <>
          {sectionTitle(t('profile.examInfo.title'))}
          <div style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.6 }}>
            {t('profile.examInfo.body')}
          </div>
        </>,
      )}

      {sectionCard(
        <>
          {sectionTitle(t('profile.report.title'))}
          <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 14 }}>
            {t('profile.report.sub')}
          </div>
          <button
            type="button"
            disabled
            style={{
              ...Styles.btnOutline,
              opacity: 0.5,
              cursor: 'not-allowed',
            }}
          >
            {t('profile.report.cta')}
          </button>
        </>,
      )}
    </div>
  )
}
