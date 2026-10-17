import { useEffect, useRef, useState } from 'react'
import { COLORS } from '../constants'
import { Breadcrumb, InfoBanner } from '../components/primitives'
import { SuccessOverlay } from '../components/SuccessOverlay'
import { useLang } from '../context/LangContext'
import { readCachedPaidExamStudent } from '../lib/paidExamPayment'
import { supabase } from '../lib/supabase'
import { Styles } from '../styles'

type PaymentType = 'exam' | 'olympiad'

type PaymentRow = {
  id: string
  exam_id?: string | null
  first_name: string
  last_name: string
  phone: string
  grade: string
  parent_phone?: string | null
  parent_name?: string | null
  school?: string | null
  region?: string | null
  class_type?: string | null
  teacher_name?: string | null
  teacher_phone?: string | null
  amount: number | null
  currency: string | null
  payment_status: 'pending' | 'paid' | 'failed'
}

const TABLE_BY_TYPE: Record<PaymentType, 'paid_exam_registrations' | 'olympiad_registrations'> = {
  exam: 'paid_exam_registrations',
  olympiad: 'olympiad_registrations',
}

const SELECT_BY_TYPE: Record<PaymentType, string> = {
  exam: 'id, exam_id, first_name, last_name, phone, grade, parent_phone, parent_name, amount, currency, payment_status',
  olympiad:
    'id, first_name, last_name, phone, grade, school, region, class_type, parent_name, parent_phone, teacher_name, teacher_phone, amount, currency, payment_status',
}

type Status =
  | 'loading'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'not_found'
  | 'invalid'
  | 'network_error'

const AUTO_POLL_INTERVAL_MS = 5000
const AUTO_POLL_MAX_ATTEMPTS = 24 // ~2 minutes of fallback polling

function rowToStudent(row: PaymentRow): Record<string, string> {
  return {
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    grade: row.grade,
    parentPhone: row.parent_phone ?? '',
    parentName: row.parent_name ?? '',
    school: row.school ?? '',
  }
}

function olympiadRowToStudent(row: PaymentRow): Record<string, string> {
  return {
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    grade: row.grade,
    school: row.school ?? '',
    region: row.region ?? '',
    classType: row.class_type ?? '',
    parentName: row.parent_name ?? '',
    parentPhone: row.parent_phone ?? '',
    teacherName: row.teacher_name ?? '',
    teacherPhone: row.teacher_phone ?? '',
  }
}

export function PaymentResult({
  onStartExam,
  onOlympiadConfirmed,
  onHome,
}: {
  onStartExam: (examId: string, student: Record<string, string>) => void
  onOlympiadConfirmed: (student: Record<string, string>) => void
  onHome: () => void
}) {
  const { t } = useLang()
  // We set these query params ourselves when creating the payment (Finik's
  // own redirect params aren't publicly documented, and can't be trusted as
  // proof of payment anyway) — see supabase/functions/finik-create-payment's
  // RedirectUrl.
  const [paymentId] = useState(
    () => new URLSearchParams(window.location.search).get('paymentId') ?? '',
  )
  // Prefer the id's own prefix ("pe_"/"oly_", set server-side when the row
  // is created) over the separate ?type= param — Finik's redirect doesn't
  // reliably preserve every query param, and a dropped `type` used to send
  // this query to the wrong (empty) table, showing "payment not found" for
  // a payment that actually succeeded.
  const [paymentType] = useState<PaymentType>(() => {
    if (paymentId.startsWith('oly_')) return 'olympiad'
    if (paymentId.startsWith('pe_')) return 'exam'
    const t = new URLSearchParams(window.location.search).get('type')
    return t === 'olympiad' ? 'olympiad' : 'exam'
  })
  const table = TABLE_BY_TYPE[paymentType]
  const [status, setStatus] = useState<Status>(paymentId ? 'loading' : 'invalid')
  const [row, setRow] = useState<PaymentRow | null>(null)
  const pollAttempts = useRef(0)
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false)
  const celebrated = useRef(false)

  useEffect(() => {
    if (status === 'paid' && paymentType === 'exam' && !celebrated.current) {
      celebrated.current = true
      setShowSuccessOverlay(true)
    }
  }, [status, paymentType])

  const fetchStatus = async () => {
    if (!paymentId || !supabase) {
      setStatus(paymentId ? 'network_error' : 'invalid')
      return
    }
    try {
      const { data, error } = await supabase
        .from(table)
        .select(SELECT_BY_TYPE[paymentType])
        .eq('id', paymentId)
        .maybeSingle()
      if (error) {
        setStatus('network_error')
        return
      }
      if (!data) {
        setStatus('not_found')
        return
      }
      setRow(data as unknown as PaymentRow)
      setStatus((data as unknown as PaymentRow).payment_status)
    } catch {
      setStatus('network_error')
    }
  }

  // Realtime is the primary signal (instant). Bounded polling is a fallback
  // in case the realtime channel can't connect (e.g. websockets blocked).
  useEffect(() => {
    if (!paymentId || !supabase) return
    const channel = supabase
      .channel(`payment-${paymentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table,
          filter: `id=eq.${paymentId}`,
        },
        (payload) => {
          const next = payload.new as PaymentRow
          setRow(next)
          setStatus(next.payment_status)
        },
      )
      .subscribe(() => {
        void fetchStatus()
      })
    return () => {
      void supabase?.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once for this paymentId
  }, [paymentId])

  // Olympiad has nothing left for the user to decide once paid (unlike the
  // exam flow, where "Continue" starts a timed exam) — jump straight to the
  // animated confirmation screen instead of waiting for a manual click.
  useEffect(() => {
    if (status === 'paid' && paymentType === 'olympiad' && row) {
      onOlympiadConfirmed(olympiadRowToStudent(row))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onOlympiadConfirmed is a stable nav action, not a dep to re-run on
  }, [status, paymentType, row])

  useEffect(() => {
    if (status !== 'pending') {
      pollAttempts.current = 0
      return
    }
    if (pollAttempts.current >= AUTO_POLL_MAX_ATTEMPTS) return
    const id = window.setTimeout(() => {
      pollAttempts.current += 1
      void fetchStatus()
    }, AUTO_POLL_INTERVAL_MS)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-arm on every pending tick
  }, [status, paymentId])

  const handleStart = () => {
    if (paymentType === 'olympiad') {
      onOlympiadConfirmed(row ? olympiadRowToStudent(row) : {})
      return
    }
    if (!row?.exam_id) return
    const cached = readCachedPaidExamStudent(paymentId)
    onStartExam(row.exam_id, cached ?? rowToStudent(row))
  }

  const fieldLabel = (text: string) => (
    <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
      {text}
    </div>
  )

  // Olympiad registration has no "start exam" step after this, so its
  // pending/paid states skip the order-id/amount ticket in favor of a
  // plain animated congratulation.
  const showTicket = paymentType !== 'olympiad'

  // Doubles as the student's registration ticket/receipt once paid — the
  // saved paid_exam_registrations row is the record of truth, this is just
  // its on-screen presentation.
  const ticketDetails = (row || paymentId) && (
    <div
      style={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: 6,
        padding: 16,
        margin: '18px 0',
        textAlign: 'left',
      }}
    >
      {row && (
        <div style={{ marginBottom: 12 }}>
          {fieldLabel(t('payment.result.student'))}
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>
            {row.first_name} {row.last_name}
          </div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          {fieldLabel(t('payment.result.orderId'))}
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, fontFamily: 'monospace' }}>
            {paymentId || '—'}
          </div>
        </div>
        <div>
          {fieldLabel(t('payment.result.amount'))}
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>
            {row?.amount != null ? `${row.amount} ${row.currency ?? 'KGS'}` : '—'}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '48px 20px' }}>
      <Breadcrumb
        items={[
          { text: 'college.edu.kg' },
          { text: t('payment.result.breadcrumb') },
          { text: t('payment.result.step'), highlight: true },
        ]}
      />
      <div style={{ ...Styles.card, padding: 28, textAlign: 'center' }}>
        {status === 'loading' && (
          <InfoBanner
            icon="⏳"
            text={t('payment.result.checking')}
            bg="#f0f6ff"
            borderColor="#c5d9f5"
            color={COLORS.blue}
          />
        )}
        {status === 'pending' && (
          <div style={{ animation: 'fadeInUp 0.35s ease both' }}>
            {showTicket && ticketDetails}
            {!showTicket && (
              <div
                style={{
                  width: 56,
                  height: 56,
                  margin: '0 auto 16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  background: 'color-mix(in srgb, var(--c-accent) 12%, transparent)',
                }}
                className="live-pulse"
              >
                ⏳
              </div>
            )}
            <InfoBanner
              icon="⏳"
              text={t('payment.result.processing')}
              bg="#fff8e6"
              borderColor="#f0dba0"
              color={COLORS.accent}
            />
            <button
              type="button"
              onClick={() => void fetchStatus()}
              style={Styles.btnOutline}
            >
              {t('payment.result.refresh')}
            </button>
          </div>
        )}
        {status === 'paid' && (
          <div style={{ animation: 'fadeInUp 0.35s ease both' }}>
            {showSuccessOverlay && (
              <SuccessOverlay
                title={t('payment.result.successTitle')}
                subtitle={t('payment.result.paid')}
                onDone={() => setShowSuccessOverlay(false)}
              />
            )}
            {showTicket && ticketDetails}
            <InfoBanner
              icon="✅"
              text={
                paymentType === 'olympiad'
                  ? t('payment.result.olympiadPaid')
                  : t('payment.result.paid')
              }
              bg="#eafaf1"
              borderColor="#aee3c8"
              color={COLORS.success}
            />
            <button type="button" onClick={handleStart} style={Styles.btnPrimary()}>
              {paymentType === 'olympiad'
                ? t('payment.result.olympiadContinue')
                : t('payment.result.start')}
            </button>
          </div>
        )}
        {status === 'failed' && (
          <>
            {ticketDetails}
            <InfoBanner
              icon="⚠"
              text={t('payment.result.failed')}
              bg="#fdecea"
              borderColor="#f3b7b2"
              color={COLORS.danger}
            />
            <a
              href="/"
              style={{
                ...Styles.btnOutline,
                display: 'inline-block',
                textDecoration: 'none',
                color: COLORS.text,
              }}
            >
              {t('payment.result.tryAgain')}
            </a>
          </>
        )}
        {(status === 'not_found' || status === 'invalid') && (
          <>
            <InfoBanner
              icon="⚠"
              text={
                status === 'invalid'
                  ? t('payment.result.invalid')
                  : t('payment.result.notFound')
              }
              bg="#fdecea"
              borderColor="#f3b7b2"
              color={COLORS.danger}
            />
            <a
              href="/"
              style={{
                ...Styles.btnOutline,
                display: 'inline-block',
                textDecoration: 'none',
                color: COLORS.text,
              }}
            >
              {t('payment.result.retry')}
            </a>
          </>
        )}
        {status === 'network_error' && (
          <>
            <InfoBanner
              icon="⚠"
              text={t('payment.result.networkError')}
              bg="#fdecea"
              borderColor="#f3b7b2"
              color={COLORS.danger}
            />
            <button
              type="button"
              onClick={() => void fetchStatus()}
              style={Styles.btnOutline}
            >
              {t('payment.result.refresh')}
            </button>
          </>
        )}
        <div style={{ marginTop: 16 }}>
          <button type="button" onClick={onHome} style={Styles.btnGhost}>
            {t('report.home')}
          </button>
        </div>
      </div>
    </div>
  )
}
