import { useState } from 'react'
import { COLORS } from '../constants'
import { useLang } from '../context/LangContext'
import { supabase } from '../lib/supabase'
import { Styles } from '../styles'

// Kyrgyzstan numbers are entered without the country code (e.g. "0700 123 456").
// Normalize to E.164 so Supabase's SMS provider can deliver the OTP.
function toE164(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '')
  if (rawPhone.trim().startsWith('+')) return `+${digits}`
  if (digits.startsWith('996')) return `+${digits}`
  if (digits.startsWith('0')) return `+996${digits.slice(1)}`
  return `+996${digits}`
}

type Step = 'phone' | 'otp'

export function LoginModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: (phone: string) => void
}) {
  const { lang } = useLang()
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const tr = (ru: string, ky: string, en: string) =>
    lang === 'ru' ? ru : lang === 'ky' ? ky : en

  const handleSendCode = async () => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 9) {
      setError(tr('Введите корректный номер телефона', 'Телефон номерин туура киргизиңиз', 'Enter a valid phone number'))
      return
    }
    if (!supabase) {
      setError(tr('Сервис авторизации не настроен', 'Авторизация кызматы такталган эмес', 'Auth service is not configured'))
      return
    }
    setError('')
    setSending(true)
    const { error: sendError } = await supabase.auth.signInWithOtp({ phone: toE164(phone) })
    setSending(false)
    if (sendError) {
      setError(tr('Не удалось отправить код. Попробуйте снова', 'Код жөнөтүлбөй калды. Кайра аракет кылыңыз', 'Could not send the code. Please try again'))
      return
    }
    setStep('otp')
  }

  const handleVerify = async () => {
    if (!supabase) {
      setError(tr('Сервис авторизации не настроен', 'Авторизация кызматы такталган эмес', 'Auth service is not configured'))
      return
    }
    setError('')
    setVerifying(true)
    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: toE164(phone),
      token: code.trim(),
      type: 'sms',
    })
    setVerifying(false)
    if (verifyError) {
      setError(tr('Неверный код', 'Код туура эмес', 'Wrong code'))
      return
    }
    onSuccess(phone)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1500,
        background: 'rgba(11,31,58,.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          ...Styles.card,
          position: 'relative',
          width: '100%',
          maxWidth: 380,
          padding: 28,
          animation: 'fadeInUp 0.25s ease both',
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.text, marginBottom: 4 }}>
          {step === 'phone'
            ? tr('Вход в личный кабинет', 'Жеке кабинетке кирүү', 'Log in')
            : tr('Введите код из SMS', 'SMSтен келген кодду киргизиңиз', 'Enter the SMS code')}
        </div>
        <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 20 }}>
          {step === 'phone'
            ? tr('Мы отправим код подтверждения по SMS', 'Ырастоо коду SMS аркылуу жөнөтүлөт', "We'll send a verification code by SMS")
            : tr(`Код отправлен на ${phone}`, `Код ${phone} номерине жөнөтүлдү`, `Code sent to ${phone}`)}
        </div>

        {step === 'phone' ? (
          <>
            <label style={Styles.label}>{tr('Номер телефона', 'Телефон номери', 'Phone number')}</label>
            <input
              type="tel"
              autoFocus
              placeholder="0700 123 456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendCode()}
              style={{ ...Styles.input, marginBottom: error ? 8 : 20 }}
            />
            {error && (
              <div style={{ fontSize: 12, color: COLORS.danger, marginBottom: 12 }}>{error}</div>
            )}
            <button
              type="button"
              onClick={handleSendCode}
              disabled={sending}
              style={{ ...Styles.btnPrimary(), width: '100%', opacity: sending ? 0.7 : 1 }}
            >
              {sending
                ? tr('Отправка…', 'Жөнөтүлүүдө…', 'Sending…')
                : tr('Получить код', 'Код алуу', 'Send code')}
            </button>
          </>
        ) : (
          <>
            <label style={Styles.label}>{tr('Код из SMS', 'SMS коду', 'SMS code')}</label>
            <input
              type="text"
              inputMode="numeric"
              autoFocus
              maxLength={6}
              placeholder="••••••"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              style={{ ...Styles.input, marginBottom: error ? 8 : 20, letterSpacing: 4, textAlign: 'center' as const }}
            />
            {error && (
              <div style={{ fontSize: 12, color: COLORS.danger, marginBottom: 12 }}>{error}</div>
            )}
            <button
              type="button"
              onClick={handleVerify}
              disabled={verifying}
              style={{ ...Styles.btnPrimary(), width: '100%', opacity: verifying ? 0.7 : 1 }}
            >
              {verifying
                ? tr('Проверка…', 'Текшерилүүдө…', 'Verifying…')
                : tr('Подтвердить', 'Ырастоо', 'Verify')}
            </button>
            <button
              type="button"
              onClick={() => setStep('phone')}
              style={{ ...Styles.btnGhost, width: '100%', justifyContent: 'center', marginTop: 10 }}
            >
              {tr('← Изменить номер', '← Номерди өзгөртүү', '← Change number')}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            color: COLORS.muted,
            fontSize: 18,
            cursor: 'pointer',
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  )
}
