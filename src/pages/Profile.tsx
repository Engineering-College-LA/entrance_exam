import { useEffect, useState } from 'react'
import { COLORS, DEFAULT_COUNTDOWN_AT, WHATSAPP_CHANNEL_URL } from '../constants'
import { Breadcrumb } from '../components/primitives'
import { Countdown } from '../components/Countdown'
import { TicketQr } from '../components/TicketQr'
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
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 20px' }}>
      <Breadcrumb
        items={[
          { text: 'college.edu.kg' },
          { text: t('page.profile'), highlight: true },
        ]}
      />

      <div style={{ ...Styles.card, overflow: 'hidden' }}>
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

        <div style={{ padding: 28 }}>
          {(student.grade || student.school || student.region || student.classType) && (
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
          )}

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
            <Countdown targetDate={countdownAt} />
          </div>

          {student.id && (
            <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 20, marginTop: 20 }}>
              <TicketQr
                ticketId={student.id}
                fullName={fullName}
                grade={student.grade}
                school={student.school}
              />
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
              {t('profile.examLink.title')}
            </div>
            <div style={{ fontSize: 13, color: COLORS.muted }}>{t('profile.examLink.body')}</div>
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
              {t('profile.report.title')}
            </div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 12 }}>
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
          </div>
        </div>
      </div>
    </div>
  )
}
