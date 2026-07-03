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

  // Extract query parameters if page is opened via QR scan link
  const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const qId = queryParams?.get('id') || '';
  const qFirstName = queryParams?.get('firstName') || '';
  const qLastName = queryParams?.get('lastName') || '';
  const qPhone = queryParams?.get('phone') || '';
  const qGrade = queryParams?.get('grade') || '';
  const qEvent = queryParams?.get('event') || '';
  const qEventDate = queryParams?.get('eventDate') || '';
  const qEventTime = queryParams?.get('eventTime') || '';

  const firstName = student?.firstName || qFirstName || ''
  const lastName = student?.lastName || qLastName || ''
  const phone = student?.phone || qPhone || ''
  const grade = student?.grade || qGrade || ''
  const regId = student?.id || qId || String(Date.now())

  const eventTitle = selectedEvent
    ? (isEn ? selectedEvent.title_en : selectedEvent.title_ru)
    : qEvent || t('openDoor.thanks.title')

  const eventDate = selectedEvent
    ? (isEn ? selectedEvent.date_en : selectedEvent.date_ru)
    : qEventDate || t('landing.openDoor.date.val')

  const eventTime = selectedEvent
    ? (isEn ? selectedEvent.time_en : selectedEvent.time_ru)
    : qEventTime || t('landing.openDoor.time.val')

  // Generate a URL to open this exact ticket page with details prefilled
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://college.edu.kg';
  const qrData = `${origin}/open_doors/thanks?id=${regId}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&phone=${encodeURIComponent(phone)}&grade=${encodeURIComponent(grade)}&event=${encodeURIComponent(eventTitle)}&eventDate=${encodeURIComponent(eventDate)}&eventTime=${encodeURIComponent(eventTime)}`

  const downloadQrCode = async () => {
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`
      const response = await fetch(qrUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ticket-${regId}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download QR code directly, opening in new tab', error)
      window.open(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`, '_blank')
    }
  }

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
              {selectedEvent
                ? (isEn ? 'Engineering College' : 'Инженерный колледж')
                : t('openDoor.thanks.sub')}
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
            {selectedEvent
              ? (isEn
                  ? `Thank you! We have saved your details and are waiting for you at "${eventTitle}".`
                  : `Спасибо! Мы сохранили ваши данные и ждём вас на "${eventTitle}".`)
              : t('openDoor.thanks.body')}
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16, alignItems: 'center' }}>
            <button type="button" onClick={downloadQrCode} style={{ ...Styles.btnPrimary(), width: '100%' }}>
              {isEn ? 'Download QR Code' : 'Скачать QR-код'}
            </button>
            <button type="button" onClick={onHome} style={{ ...Styles.btnGhost, justifyContent: 'center', padding: '8px 16px' }}>
              <span>←</span> {t('openDoor.thanks.home')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
