import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { COLORS } from '../constants'
import { useLang } from '../context/LangContext'

export function TicketQr({
  ticketId,
  fullName,
  phone,
}: {
  ticketId: string
  fullName: string
  phone: string
}) {
  const { t } = useLang()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dataUrl, setDataUrl] = useState<string>('')

  useEffect(() => {
    const payload = [
      'EC Olympiad Ticket',
      `ID: ${ticketId}`,
      `Name: ${fullName}`,
      `Phone: ${phone}`,
    ].join('\n')

    const canvas = canvasRef.current
    if (!canvas) return
    void QRCode.toCanvas(canvas, payload, { width: 220, margin: 1 }).then(() => {
      setDataUrl(canvas.toDataURL('image/png'))
    })
  }, [ticketId, fullName, phone])

  const handleDownload = () => {
    if (!dataUrl) return
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `ec-olympiad-ticket-${ticketId}.png`
    link.click()
  }

  if (!ticketId) return null

  return (
    <div style={{ textAlign: 'center' }}>
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
        {t('profile.ticket.title')}
      </div>
      <div
        style={{
          display: 'inline-block',
          background: '#fff',
          padding: 12,
          borderRadius: 8,
        }}
      >
        <canvas ref={canvasRef} style={{ display: 'block' }} />
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: 12,
          color: COLORS.muted,
          fontFamily: 'monospace',
        }}
      >
        {ticketId}
      </div>
      <div style={{ marginTop: 14 }}>
        <button
          type="button"
          onClick={handleDownload}
          disabled={!dataUrl}
          style={{
            background: 'transparent',
            border: `1px solid ${COLORS.border}`,
            borderRadius: 6,
            padding: '10px 20px',
            fontWeight: 600,
            fontSize: 13,
            color: COLORS.text,
            cursor: dataUrl ? 'pointer' : 'not-allowed',
            opacity: dataUrl ? 1 : 0.5,
          }}
        >
          {t('profile.ticket.download')}
        </button>
      </div>
    </div>
  )
}
