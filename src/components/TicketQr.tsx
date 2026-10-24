import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { COLORS } from '../constants'
import { useLang } from '../context/LangContext'

const TICKET_W = 640
const TICKET_H = 920
const BRAND_NAVY = '#0b1f3a'
const BRAND_BLUE = '#1565c0'
const BRAND_BORDER = '#dde3ed'
const BRAND_MUTED = '#6b7a95'

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('QR image failed to load'))
    img.src = src
  })
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function wrapCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ')
  let line = ''
  let curY = y
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, curY)
      line = word
      curY += lineHeight
    } else {
      line = testLine
    }
  }
  if (line) ctx.fillText(line, x, curY)
  return curY
}

async function buildTicketImage(opts: {
  qrDataUrl: string
  fullName: string
  ticketId: string
  gradeSchoolLine: string
  footerText: string
  subtitle: string
  title: string
}): Promise<Blob | null> {
  const qrImg = await loadImage(opts.qrDataUrl)
  const canvas = document.createElement('canvas')
  canvas.width = TICKET_W
  canvas.height = TICKET_H
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.save()
  roundRectPath(ctx, 0, 0, TICKET_W, TICKET_H, 28)
  ctx.clip()

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, TICKET_W, TICKET_H)

  const headerH = 230
  const grad = ctx.createLinearGradient(0, 0, TICKET_W, headerH)
  grad.addColorStop(0, BRAND_NAVY)
  grad.addColorStop(1, BRAND_BLUE)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, TICKET_W, headerH)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 20px sans-serif'
  ctx.fillText('E | C  ENGINEERING COLLEGE', TICKET_W / 2, 58)

  ctx.font = '600 13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.78)'
  ctx.fillText(opts.subtitle.toUpperCase(), TICKET_W / 2, 92)

  ctx.font = '800 34px sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(opts.title, TICKET_W / 2, 150)

  // Punch true-transparent perforation notches through the card edges.
  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  ctx.arc(0, headerH, 20, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(TICKET_W, headerH, 20, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  const dashedDivider = (y: number) => {
    ctx.strokeStyle = BRAND_BORDER
    ctx.lineWidth = 2
    ctx.setLineDash([10, 8])
    ctx.beginPath()
    ctx.moveTo(40, y)
    ctx.lineTo(TICKET_W - 40, y)
    ctx.stroke()
    ctx.setLineDash([])
  }
  dashedDivider(headerH)

  const qrBoxSize = 300
  const qrBoxX = (TICKET_W - qrBoxSize) / 2
  const qrBoxY = 270
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = BRAND_BORDER
  ctx.lineWidth = 1.5
  roundRectPath(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 20)
  ctx.fill()
  ctx.stroke()
  const qrInset = 24
  ctx.drawImage(
    qrImg,
    qrBoxX + qrInset,
    qrBoxY + qrInset,
    qrBoxSize - qrInset * 2,
    qrBoxSize - qrInset * 2,
  )

  ctx.fillStyle = BRAND_NAVY
  ctx.font = '800 27px sans-serif'
  ctx.fillText(opts.fullName, TICKET_W / 2, qrBoxY + qrBoxSize + 52)

  if (opts.gradeSchoolLine) {
    ctx.fillStyle = BRAND_MUTED
    ctx.font = '600 16px sans-serif'
    ctx.fillText(opts.gradeSchoolLine, TICKET_W / 2, qrBoxY + qrBoxSize + 82)
  }

  ctx.fillStyle = BRAND_MUTED
  ctx.font = '600 13px monospace'
  ctx.fillText(opts.ticketId, TICKET_W / 2, qrBoxY + qrBoxSize + 115)

  const footerDividerY = TICKET_H - 115
  dashedDivider(footerDividerY)

  ctx.fillStyle = BRAND_BLUE
  ctx.font = '700 15px sans-serif'
  wrapCenteredText(ctx, opts.footerText, TICKET_W / 2, footerDividerY + 36, TICKET_W - 120, 20)

  ctx.fillStyle = BRAND_MUTED
  ctx.font = '500 12px sans-serif'
  ctx.fillText('Engineering College · college.edu.kg', TICKET_W / 2, TICKET_H - 28)

  ctx.restore()

  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/png'))
}

type Status = 'loading' | 'ready' | 'error'

export function TicketQr({
  ticketId,
  fullName,
  grade,
  school,
}: {
  ticketId: string
  fullName: string
  grade?: string
  school?: string
}) {
  const { t } = useLang()
  const [status, setStatus] = useState<Status>('loading')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const blobRef = useRef<Blob | null>(null)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    blobRef.current = null

    const payload = ['EC Olympiad Ticket', `ID: ${ticketId}`, `Name: ${fullName}`].join('\n')
    const gradeSchoolLine = [grade ? `${t('field.grade')} ${grade}` : '', school ?? '']
      .filter(Boolean)
      .join(' · ')

    QRCode.toDataURL(payload, {
      width: 480,
      margin: 1,
      color: { dark: BRAND_NAVY, light: '#ffffff' },
    })
      .then((dataUrl) => {
        if (cancelled) return undefined
        setQrDataUrl(dataUrl)
        return buildTicketImage({
          qrDataUrl: dataUrl,
          fullName,
          ticketId,
          gradeSchoolLine,
          footerText: t('profile.ticket.footer'),
          subtitle: t('profile.ticket.subtitle'),
          title: t('profile.ticket.title'),
        })
      })
      .then((blob) => {
        if (cancelled || !blob) {
          if (!cancelled) setStatus('error')
          return
        }
        blobRef.current = blob
        setPreviewUrl(URL.createObjectURL(blob))
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- t() is stable per language
  }, [ticketId, fullName, grade, school])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  // Always available, deterministic: a plain anchor download. Kept independent
  // of the Web Share branch below so a share sheet that never settles (seen on
  // some in-app/WebView browsers) can never block the actual file save.
  const handleDownload = () => {
    const blob = blobRef.current
    if (!blob) return
    const filename = `ec-olympiad-ticket-${ticketId}.png`
    try {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(url), 10000)
    } catch {
      if (previewUrl) window.open(previewUrl, '_blank', 'noopener')
    }
  }

  const canUseShare =
    typeof navigator.share === 'function' && typeof navigator.canShare === 'function'

  const handleShare = async () => {
    const blob = blobRef.current
    if (!blob) return
    const filename = `ec-olympiad-ticket-${ticketId}.png`
    const file = new File([blob], filename, { type: 'image/png' })
    if (!navigator.canShare({ files: [file] })) return
    try {
      await navigator.share({ files: [file], title: filename })
    } catch {
      // User cancelled, or sharing isn't actually supported here — no-op.
      // The primary Download button above is unaffected either way.
    }
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
          maxWidth: 320,
          margin: '0 auto',
          borderRadius: 18,
          overflow: 'hidden',
          background: 'var(--t-card-bg)',
          border: `1px solid ${COLORS.border}`,
          boxShadow: '0 8px 28px rgba(0,0,0,.08)',
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${BRAND_NAVY} 0%, ${BRAND_BLUE} 100%)`,
            padding: '16px 18px 20px',
            color: '#fff',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, opacity: 0.8 }}>
            {t('profile.ticket.subtitle').toUpperCase()}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>
            {t('profile.ticket.title')}
          </div>
        </div>

        <div
          style={{
            borderTop: `2px dashed ${COLORS.border}`,
            padding: '22px 20px 20px',
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              margin: '0 auto',
              background: '#fff',
              borderRadius: 14,
              border: `1px solid ${COLORS.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {status === 'loading' && (
              <span style={{ fontSize: 12, color: COLORS.muted }}>…</span>
            )}
            {status === 'error' && (
              <span style={{ fontSize: 24 }}>⚠️</span>
            )}
            {status === 'ready' && qrDataUrl && (
              <img src={qrDataUrl} alt="" width={176} height={176} style={{ display: 'block' }} />
            )}
          </div>

          <div style={{ marginTop: 14, fontSize: 15, fontWeight: 700, color: COLORS.text }}>
            {fullName}
          </div>
          {(grade || school) && (
            <div style={{ marginTop: 2, fontSize: 12, color: COLORS.muted, fontWeight: 600 }}>
              {[grade ? `${t('field.grade')} ${grade}` : '', school].filter(Boolean).join(' · ')}
            </div>
          )}
          <div
            style={{
              marginTop: 10,
              fontSize: 11,
              color: COLORS.muted,
              fontFamily: 'monospace',
              letterSpacing: 0.3,
            }}
          >
            {ticketId}
          </div>
        </div>

        <div
          style={{
            borderTop: `1px solid ${COLORS.border}`,
            padding: '10px 20px',
            fontSize: 11,
            color: COLORS.muted,
            background: 'color-mix(in srgb, var(--t-text) 3%, transparent)',
          }}
        >
          {t('profile.ticket.footer')}
        </div>
      </div>

      {status === 'error' && (
        <div style={{ marginTop: 10, fontSize: 12, color: COLORS.danger }}>
          {t('profile.ticket.error')}
        </div>
      )}

      <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button
          type="button"
          onClick={handleDownload}
          disabled={status !== 'ready'}
          style={{
            background: 'transparent',
            border: `1px solid ${COLORS.border}`,
            borderRadius: 6,
            padding: '10px 20px',
            fontWeight: 600,
            fontSize: 13,
            color: COLORS.text,
            cursor: status === 'ready' ? 'pointer' : 'not-allowed',
            opacity: status === 'ready' ? 1 : 0.5,
          }}
        >
          ⬇ {t('profile.ticket.download')}
        </button>
        {canUseShare && (
          <button
            type="button"
            onClick={handleShare}
            disabled={status !== 'ready'}
            title={t('profile.ticket.share')}
            style={{
              background: 'transparent',
              border: `1px solid ${COLORS.border}`,
              borderRadius: 6,
              padding: '10px 14px',
              fontWeight: 600,
              fontSize: 13,
              color: COLORS.text,
              cursor: status === 'ready' ? 'pointer' : 'not-allowed',
              opacity: status === 'ready' ? 1 : 0.5,
            }}
          >
            ↗
          </button>
        )}
      </div>
    </div>
  )
}
