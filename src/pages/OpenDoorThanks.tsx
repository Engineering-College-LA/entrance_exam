import { COLORS } from '../constants'
import { Styles } from '../styles'
import { useLang } from '../context/LangContext'

interface OpenDoorThanksProps {
  student?: Record<string, string>
  selectedEvent?: any
  onHome: () => void
}

export function OpenDoorThanks({ student, selectedEvent, onHome }: OpenDoorThanksProps) {
  const { t } = useLang()
  const isEn = t('landing.title1') === 'Mathematics'

  const firstName = student?.firstName || ''
  const lastName = student?.lastName || ''
  const phone = student?.phone || ''
  const grade = student?.grade || ''
  const regId = student?.id || String(Date.now())

  const eventTitle = selectedEvent
    ? (isEn ? selectedEvent.title_en : selectedEvent.title_ru)
    : t('openDoor.thanks.title')

  const eventDate = selectedEvent
    ? (isEn ? selectedEvent.date_en : selectedEvent.date_ru)
    : t('landing.openDoor.date.val')

  const eventTime = selectedEvent
    ? (isEn ? selectedEvent.time_en : selectedEvent.time_ru)
    : t('landing.openDoor.time.val')

  // Encode student info in QR code
  const qrData = `REG_ID: ${regId}\nName: ${firstName} ${lastName}\nPhone: ${phone}\nGrade: ${grade}\nEvent: ${eventTitle}`

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ ...Styles.card, overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ ...Styles.cardHeader, justifyContent: 'center' }}>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: COLORS.white,
              }}
            >
              {t('openDoor.thanks.title')}
            </div>
            <div style={{ color: '#8fa3c0', fontSize: 13, marginTop: 4 }}>
              {t('openDoor.thanks.sub')}
            </div>
          </div>
        </div>
        <div style={{ padding: '32px 24px' }}>
          <p
            style={{
              fontSize: 15,
              color: COLORS.muted,
              lineHeight: 1.65,
              marginBottom: 20,
            }}
          >
            {t('openDoor.thanks.body')}
          </p>

          {/* Ticket Container */}
          <div
            style={{
              border: `2px dashed ${COLORS.border}`,
              borderRadius: 12,
              padding: '24px 16px',
              background: COLORS.off,
              marginBottom: 28,
              textAlign: 'center',
              position: 'relative',
            }}
          >
            {/* Ticket Header */}
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              {isEn ? 'ENTRANCE PASS' : 'ПРОПУСК НА МЕРОПРИЯТИЕ'}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.text, marginBottom: 16 }}>
              {eventTitle}
            </div>

            {/* QR Code */}
            <div style={{ background: '#ffffff', padding: 12, borderRadius: 8, display: 'inline-block', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 16 }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}`}
                alt="Ticket QR Code"
                style={{ width: 180, height: 180, display: 'block' }}
              />
            </div>

            {/* Ticket Info Details */}
            <div style={{ borderTop: `1px dashed ${COLORS.border}`, paddingTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 8px', fontSize: 13, textAlign: 'left', maxWidth: 320, margin: '0 auto' }}>
              <div>
                <span style={{ color: '#8fa3c0', display: 'block', fontSize: 11 }}>{isEn ? 'Participant' : 'Участник'}</span>
                <span style={{ fontWeight: 600, color: COLORS.text }}>{firstName} {lastName}</span>
              </div>
              <div>
                <span style={{ color: '#8fa3c0', display: 'block', fontSize: 11 }}>{isEn ? 'Phone' : 'Телефон'}</span>
                <span style={{ fontWeight: 600, color: COLORS.text }}>{phone}</span>
              </div>
              <div>
                <span style={{ color: '#8fa3c0', display: 'block', fontSize: 11 }}>{isEn ? 'Date & Time' : 'Дата и Время'}</span>
                <span style={{ fontWeight: 600, color: COLORS.text }}>{eventDate}, {eventTime}</span>
              </div>
              <div>
                <span style={{ color: '#8fa3c0', display: 'block', fontSize: 11 }}>{isEn ? 'Grade' : 'Класс'}</span>
                <span style={{ fontWeight: 600, color: COLORS.text }}>{grade}</span>
              </div>
            </div>

            <div style={{ fontSize: 11, color: '#8fa3c0', marginTop: 16, fontStyle: 'italic' }}>
              {isEn ? 'Please screenshot and show this code at the entrance' : 'Пожалуйста, сделайте скриншот и покажите код на входе'}
            </div>
          </div>

          <button type="button" onClick={onHome} style={Styles.btnPrimary()}>
            {t('openDoor.thanks.home')}
          </button>
        </div>
      </div>
    </div>
  )
}
