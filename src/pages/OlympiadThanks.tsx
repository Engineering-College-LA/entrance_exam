import { useEffect, useState } from 'react'
import { COLORS, DEFAULT_COUNTDOWN_AT, WHATSAPP_CHANNEL_URL } from '../constants'
import { Styles } from '../styles'
import { useLang } from '../context/LangContext'
import { SuccessOverlay } from '../components/SuccessOverlay'
import { Countdown } from '../components/Countdown'
import { TicketQr } from '../components/TicketQr'
import { getSetting } from '../lib/settings'

function initials(firstName: string, lastName: string) {
  return `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase()
}

export function OlympiadThanks({
  onHome,
  student,
}: {
  onHome: () => void
  student: Record<string, string>
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
  const hasParent = !!(student.parentName || student.parentPhone)
  const hasTeacher = !!(student.teacherName || student.teacherPhone)

  const detailRow = (label: string, value: string) => (
    <div>
      <div
        style={{
          fontSize: 11,
          color: COLORS.muted,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>
        {value || '—'}
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '56px 20px' }}>
      <SuccessOverlay title={t('olympiad.thanks.title')} subtitle={t('olympiad.thanks.sub')} />

      <div style={{ ...Styles.card, overflow: 'hidden', animation: 'fadeInUp 0.4s ease both' }}>
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
              {fullName || t('olympiad.profile.header')}
            </div>
            <div style={{ color: '#8fa3c0', fontSize: 13, marginTop: 4 }}>
              {t('olympiad.profile.registered')}
            </div>
          </div>
        </div>
        <div style={{ padding: 28 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 6,
              padding: '12px 16px',
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: COLORS.muted,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                  marginBottom: 4,
                }}
              >
                {t('field.phone')}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: COLORS.text,
                  fontFamily: 'monospace',
                }}
              >
                {student.phone || '—'}
              </div>
            </div>
            <div
              style={{
                fontSize: 11,
                color: COLORS.accent,
                fontWeight: 600,
                maxWidth: 170,
                textAlign: 'right',
                lineHeight: 1.4,
              }}
            >
              {t('olympiad.profile.phoneHint')}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: hasParent || hasTeacher ? 20 : 0,
            }}
          >
            {detailRow(t('field.grade'), student.grade)}
            {detailRow(t('field.school'), student.school)}
            {detailRow(
              t('field.region'),
              student.region ? t(`field.region.${student.region}`) : '',
            )}
            {detailRow(
              t('field.classType'),
              student.classType ? t(`field.classType.${student.classType}`) : '',
            )}
          </div>

          {hasParent && (
            <div
              style={{
                borderTop: `1px solid ${COLORS.border}`,
                paddingTop: 16,
                marginBottom: hasTeacher ? 16 : 0,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: COLORS.muted,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 12,
                }}
              >
                {t('register.parentInfo')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {detailRow(t('field.parentName'), student.parentName)}
                {detailRow(t('field.parentPhone'), student.parentPhone)}
              </div>
            </div>
          )}

          {hasTeacher && (
            <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: COLORS.muted,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 12,
                }}
              >
                {t('register.teacherInfo')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {detailRow(t('field.teacherName'), student.teacherName)}
                {detailRow(t('field.teacherPhone'), student.teacherPhone)}
              </div>
            </div>
          )}

          <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 20, marginTop: 20 }}>
            <Countdown
              targetDate={countdownAt}
              titleKey="olympiad.countdown.title"
              doneKey="olympiad.countdown.done"
            />
          </div>

          {student.id && (
            <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 20, marginTop: 20 }}>
              <TicketQr ticketId={student.id} fullName={fullName} phone={student.phone ?? ''} />
            </div>
          )}

          <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 20, marginTop: 20 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: COLORS.muted,
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: 10,
              }}
            >
              {t('profile.whatsapp.title')}
            </div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 12 }}>
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
          </div>

          <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 20, marginTop: 20 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: COLORS.muted,
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: 10,
              }}
            >
              {t('olympiad.profile.examLink.title')}
            </div>
            <div style={{ fontSize: 13, color: COLORS.muted }}>
              {t('olympiad.profile.examLink.body')}
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 20, marginTop: 20 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: COLORS.muted,
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: 10,
              }}
            >
              {t('olympiad.profile.report.title')}
            </div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 12 }}>
              {t('olympiad.profile.report.sub')}
            </div>
            <button type="button" disabled style={{ ...Styles.btnOutline, opacity: 0.5, cursor: 'not-allowed' }}>
              {t('olympiad.profile.report.cta')}
            </button>
          </div>

          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <button type="button" onClick={onHome} style={Styles.btnPrimary()}>
              {t('olympiad.thanks.home')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
