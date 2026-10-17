import { useState, type ReactNode } from 'react'
import { COLORS } from '../constants'
import { Styles } from '../styles'
import { LangProvider, useLang } from '../context/LangContext'

/**
 * MO-Reg UI prototype — built from the pasted SRS draft v0.1 (student/parent/
 * trainer/review/payment steps). Deliberately isolated from the real app:
 * mounted at its own route in main.tsx, no shared state, no Supabase writes,
 * no real payment. Purely for the committee to click through and review the
 * field set and flow before anything gets built for real. Delete this folder
 * + the routing check in main.tsx to remove it entirely.
 */

const PHONE_RE = /^\+996\d{9}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Step = 1 | 2 | 3 | 4 | 5 | 'confirm'

type StudentData = {
  lastName: string
  firstName: string
  patronymic: string
  dob: string
  gender: string
  grade: string
  school: string
  region: string
  district: string
  phone: string
  email: string
}

type ParentData = {
  fullName: string
  relationship: string
  phone: string
  email: string
  address: string
  hasSecond: boolean
  secondFullName: string
  secondPhone: string
}

type TrainerData = {
  none: boolean
  fullName: string
  org: string
  position: string
  phone: string
  email: string
}

const emptyStudent: StudentData = {
  lastName: '',
  firstName: '',
  patronymic: '',
  dob: '',
  gender: '',
  grade: '9',
  school: '',
  region: '',
  district: '',
  phone: '',
  email: '',
}

const emptyParent: ParentData = {
  fullName: '',
  relationship: '',
  phone: '+996',
  email: '',
  address: '',
  hasSecond: false,
  secondFullName: '',
  secondPhone: '+996',
}

const emptyTrainer: TrainerData = {
  none: false,
  fullName: '',
  org: '',
  position: '',
  phone: '',
  email: '',
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: ReactNode
}) {
  const { t } = useLang()
  return (
    <div>
      <label style={Styles.label}>
        {label}
        {required && <span style={{ color: COLORS.danger }}> *</span>}
      </label>
      {children}
      {error && (
        <div style={{ fontSize: 11, color: COLORS.danger, marginTop: 4 }}>
          {t(error)}
        </div>
      )}
    </div>
  )
}

function inputStyle(hasError?: boolean) {
  return { ...Styles.input, ...(hasError ? { borderColor: COLORS.danger } : {}) }
}

function Grid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 14,
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  )
}

function StepIndicator({ current }: { current: Exclude<Step, 'confirm'> }) {
  const { t } = useLang()
  const labels = [
    t('moReg.step.student'),
    t('moReg.step.parent'),
    t('moReg.step.trainer'),
    t('moReg.step.review'),
    t('moReg.step.payment'),
  ]
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 24,
        flexWrap: 'wrap',
      }}
    >
      {labels.map((label, i) => {
        const n = i + 1
        const active = n === current
        const done = n < current
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                background: active ? COLORS.blue : done ? COLORS.success : COLORS.off,
                color: active || done ? COLORS.white : COLORS.muted,
                border: `1px solid ${active ? COLORS.blue : done ? COLORS.success : COLORS.border}`,
                flexShrink: 0,
              }}
            >
              {done ? '✓' : n}
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                color: active ? COLORS.text : COLORS.muted,
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
            {n < 5 && (
              <div style={{ width: 20, height: 1, background: COLORS.border, margin: '0 2px' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function MoRegInner() {
  const { lang, setLang, t } = useLang()
  const [step, setStep] = useState<Step>(1)
  const [student, setStudent] = useState<StudentData>(emptyStudent)
  const [parent, setParent] = useState<ParentData>(emptyParent)
  const [trainer, setTrainer] = useState<TrainerData>(emptyTrainer)
  const [acceptRules, setAcceptRules] = useState(false)
  const [consent, setConsent] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'qr'>('card')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [registrationId] = useState(
    () => `MO26-${String(Math.floor(Math.random() * 900000) + 100000)}`,
  )

  const validateStudent = () => {
    const e: Record<string, string> = {}
    if (!student.lastName.trim()) e.lastName = 'error.required'
    if (!student.firstName.trim()) e.firstName = 'error.required'
    if (!student.dob) e.dob = 'error.required'
    if (!student.gender) e.gender = 'error.required'
    if (!student.grade.trim()) e.grade = 'error.required'
    if (!student.school.trim()) e.school = 'error.required'
    if (!student.region.trim()) e.region = 'error.required'
    if (!student.district.trim()) e.district = 'error.required'
    if (student.email && !EMAIL_RE.test(student.email)) e.email = 'error.email'
    return e
  }

  const validateParent = () => {
    const e: Record<string, string> = {}
    if (!parent.fullName.trim()) e.fullName = 'error.required'
    if (!parent.relationship) e.relationship = 'error.required'
    if (!PHONE_RE.test(parent.phone)) e.phone = 'error.phone'
    if (!EMAIL_RE.test(parent.email)) e.email = 'error.email'
    if (parent.hasSecond) {
      if (!parent.secondFullName.trim()) e.secondFullName = 'error.required'
      if (!PHONE_RE.test(parent.secondPhone)) e.secondPhone = 'error.phone'
    }
    return e
  }

  const validateTrainer = () => {
    if (trainer.none) return {}
    const e: Record<string, string> = {}
    if (!trainer.fullName.trim()) e.fullName = 'error.required'
    if (!trainer.org.trim()) e.org = 'error.required'
    if (!trainer.position.trim()) e.position = 'error.required'
    if (!PHONE_RE.test(trainer.phone)) e.phone = 'error.phone'
    if (!EMAIL_RE.test(trainer.email)) e.email = 'error.email'
    return e
  }

  const goNext = () => {
    let e: Record<string, string> = {}
    if (step === 1) e = validateStudent()
    else if (step === 2) e = validateParent()
    else if (step === 3) e = validateTrainer()
    else if (step === 4) {
      if (!acceptRules) e.acceptRules = 'error.required'
      if (!consent) e.consent = 'error.required'
    }
    setErrors(e)
    if (Object.keys(e).length > 0) return
    if (step === 5) {
      setStep('confirm')
      return
    }
    if (step !== 'confirm') setStep((s) => (s as number) + 1 as Step)
  }

  const goBack = () => {
    setErrors({})
    if (step !== 1 && step !== 'confirm') setStep((s) => (s as number) - 1 as Step)
  }

  const restart = () => {
    setStudent(emptyStudent)
    setParent(emptyParent)
    setTrainer(emptyTrainer)
    setAcceptRules(false)
    setConsent(false)
    setPaymentMethod('card')
    setErrors({})
    setStep(1)
  }

  return (
    <div style={Styles.page}>
      <div
        style={{
          ...Styles.header,
          background: COLORS.navy,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={Styles.logoMark}>MO</span>
          <span style={Styles.logoText}>{t('moReg.title')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={Styles.badge}>{t('moReg.badge')}</span>
          <div style={{ display: 'flex', gap: 3 }}>
            <button
              type="button"
              onClick={() => setLang('ru')}
              style={{
                ...Styles.langBtn,
                background: lang === 'ru' ? COLORS.blue : 'rgba(255,255,255,.08)',
                color: lang === 'ru' ? COLORS.white : '#8fa3c0',
              }}
            >
              RU
            </button>
            <button
              type="button"
              onClick={() => setLang('ky')}
              style={{
                ...Styles.langBtn,
                background: lang === 'ky' ? COLORS.blue : 'rgba(255,255,255,.08)',
                color: lang === 'ky' ? COLORS.white : '#8fa3c0',
              }}
            >
              KY
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              style={{
                ...Styles.langBtn,
                background: lang === 'en' ? COLORS.blue : 'rgba(255,255,255,.08)',
                color: lang === 'en' ? COLORS.white : '#8fa3c0',
              }}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px' }}>
        <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 24 }}>
          {t('moReg.subtitle')}
        </p>

        {step !== 'confirm' && <StepIndicator current={step} />}

        <div style={{ ...Styles.card, padding: 28 }}>
          {step === 1 && (
            <>
              <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>
                {t('moReg.student.title')}
              </h2>
              <Grid>
                <Field label={t('moReg.field.lastName')} required error={errors.lastName}>
                  <input
                    style={inputStyle(!!errors.lastName)}
                    value={student.lastName}
                    onChange={(e) => setStudent({ ...student, lastName: e.target.value })}
                  />
                </Field>
                <Field label={t('moReg.field.firstName')} required error={errors.firstName}>
                  <input
                    style={inputStyle(!!errors.firstName)}
                    value={student.firstName}
                    onChange={(e) => setStudent({ ...student, firstName: e.target.value })}
                  />
                </Field>
                <Field label={t('moReg.field.patronymic')}>
                  <input
                    style={inputStyle()}
                    value={student.patronymic}
                    onChange={(e) => setStudent({ ...student, patronymic: e.target.value })}
                  />
                </Field>
                <Field label={t('moReg.field.dob')} required error={errors.dob}>
                  <input
                    type="date"
                    style={inputStyle(!!errors.dob)}
                    value={student.dob}
                    onChange={(e) => setStudent({ ...student, dob: e.target.value })}
                  />
                </Field>
                <Field label={t('moReg.field.gender')} required error={errors.gender}>
                  <select
                    style={{ ...inputStyle(!!errors.gender), cursor: 'pointer' }}
                    value={student.gender}
                    onChange={(e) => setStudent({ ...student, gender: e.target.value })}
                  >
                    <option value="">—</option>
                    <option value="male">{t('moReg.field.gender.male')}</option>
                    <option value="female">{t('moReg.field.gender.female')}</option>
                  </select>
                </Field>
                <Field label={t('moReg.field.grade')} required error={errors.grade}>
                  <select
                    style={{ ...inputStyle(!!errors.grade), cursor: 'pointer' }}
                    value={student.grade}
                    onChange={(e) => setStudent({ ...student, grade: e.target.value })}
                  >
                    <option value="9">9</option>
                  </select>
                </Field>
                <Field label={t('moReg.field.school')} required error={errors.school}>
                  <input
                    style={inputStyle(!!errors.school)}
                    value={student.school}
                    onChange={(e) => setStudent({ ...student, school: e.target.value })}
                  />
                </Field>
                <Field label={t('moReg.field.region')} required error={errors.region}>
                  <input
                    style={inputStyle(!!errors.region)}
                    value={student.region}
                    onChange={(e) => setStudent({ ...student, region: e.target.value })}
                  />
                </Field>
                <Field label={t('moReg.field.district')} required error={errors.district}>
                  <input
                    style={inputStyle(!!errors.district)}
                    value={student.district}
                    onChange={(e) => setStudent({ ...student, district: e.target.value })}
                  />
                </Field>
                <Field label={t('moReg.field.studentPhone')}>
                  <input
                    style={inputStyle()}
                    value={student.phone}
                    onChange={(e) => setStudent({ ...student, phone: e.target.value })}
                  />
                </Field>
                <Field label={t('moReg.field.studentEmail')} error={errors.email}>
                  <input
                    style={inputStyle(!!errors.email)}
                    value={student.email}
                    onChange={(e) => setStudent({ ...student, email: e.target.value })}
                  />
                </Field>
              </Grid>
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>
                {t('moReg.parent.title')}
              </h2>
              <Grid>
                <Field label={t('moReg.field.parentFullName')} required error={errors.fullName}>
                  <input
                    style={inputStyle(!!errors.fullName)}
                    value={parent.fullName}
                    onChange={(e) => setParent({ ...parent, fullName: e.target.value })}
                  />
                </Field>
                <Field label={t('moReg.field.relationship')} required error={errors.relationship}>
                  <select
                    style={{ ...inputStyle(!!errors.relationship), cursor: 'pointer' }}
                    value={parent.relationship}
                    onChange={(e) => setParent({ ...parent, relationship: e.target.value })}
                  >
                    <option value="">—</option>
                    <option value="parent">{t('moReg.field.relationship.parent')}</option>
                    <option value="guardian">{t('moReg.field.relationship.guardian')}</option>
                    <option value="other">{t('moReg.field.relationship.other')}</option>
                  </select>
                </Field>
                <Field label={t('moReg.field.parentPhone')} required error={errors.phone}>
                  <input
                    style={inputStyle(!!errors.phone)}
                    value={parent.phone}
                    onChange={(e) => setParent({ ...parent, phone: e.target.value })}
                  />
                </Field>
                <Field label={t('moReg.field.parentEmail')} required error={errors.email}>
                  <input
                    style={inputStyle(!!errors.email)}
                    value={parent.email}
                    onChange={(e) => setParent({ ...parent, email: e.target.value })}
                  />
                </Field>
                <Field label={t('moReg.field.address')}>
                  <input
                    style={inputStyle()}
                    value={parent.address}
                    onChange={(e) => setParent({ ...parent, address: e.target.value })}
                  />
                </Field>
              </Grid>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  marginTop: 8,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={parent.hasSecond}
                  onChange={(e) => setParent({ ...parent, hasSecond: e.target.checked })}
                />
                {t('moReg.parent.addSecond')}
              </label>
              {parent.hasSecond && (
                <div
                  style={{
                    borderTop: `1px solid ${COLORS.border}`,
                    marginTop: 14,
                    paddingTop: 14,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', marginBottom: 10 }}>
                    {t('moReg.parent.second')}
                  </div>
                  <Grid>
                    <Field label={t('moReg.field.parentFullName')} required error={errors.secondFullName}>
                      <input
                        style={inputStyle(!!errors.secondFullName)}
                        value={parent.secondFullName}
                        onChange={(e) => setParent({ ...parent, secondFullName: e.target.value })}
                      />
                    </Field>
                    <Field label={t('moReg.field.parentPhone')} required error={errors.secondPhone}>
                      <input
                        style={inputStyle(!!errors.secondPhone)}
                        value={parent.secondPhone}
                        onChange={(e) => setParent({ ...parent, secondPhone: e.target.value })}
                      />
                    </Field>
                  </Grid>
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>
                {t('moReg.trainer.title')}
              </h2>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  marginBottom: 18,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={trainer.none}
                  onChange={(e) => setTrainer({ ...trainer, none: e.target.checked })}
                />
                {t('moReg.trainer.none')}
              </label>
              {!trainer.none && (
                <Grid>
                  <Field label={t('moReg.field.trainerName')} required error={errors.fullName}>
                    <input
                      style={inputStyle(!!errors.fullName)}
                      value={trainer.fullName}
                      onChange={(e) => setTrainer({ ...trainer, fullName: e.target.value })}
                    />
                  </Field>
                  <Field label={t('moReg.field.trainerOrg')} required error={errors.org}>
                    <input
                      style={inputStyle(!!errors.org)}
                      value={trainer.org}
                      onChange={(e) => setTrainer({ ...trainer, org: e.target.value })}
                    />
                  </Field>
                  <Field label={t('moReg.field.trainerPosition')} required error={errors.position}>
                    <input
                      style={inputStyle(!!errors.position)}
                      value={trainer.position}
                      onChange={(e) => setTrainer({ ...trainer, position: e.target.value })}
                    />
                  </Field>
                  <Field label={t('moReg.field.trainerPhone')} required error={errors.phone}>
                    <input
                      style={inputStyle(!!errors.phone)}
                      value={trainer.phone}
                      onChange={(e) => setTrainer({ ...trainer, phone: e.target.value })}
                    />
                  </Field>
                  <Field label={t('moReg.field.trainerEmail')} required error={errors.email}>
                    <input
                      style={inputStyle(!!errors.email)}
                      value={trainer.email}
                      onChange={(e) => setTrainer({ ...trainer, email: e.target.value })}
                    />
                  </Field>
                </Grid>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>
                {t('moReg.review.title')}
              </h2>
              <ReviewBlock title={t('moReg.review.student')}>
                {student.lastName} {student.firstName} {student.patronymic} · {student.dob} ·{' '}
                {student.school} · {t('moReg.field.grade')} {student.grade} · {student.region},{' '}
                {student.district}
              </ReviewBlock>
              <ReviewBlock title={t('moReg.review.parent')}>
                {parent.fullName} ({parent.relationship}) · {parent.phone} · {parent.email}
                {parent.hasSecond && ` · +${parent.secondFullName}, ${parent.secondPhone}`}
              </ReviewBlock>
              <ReviewBlock title={t('moReg.review.trainer')}>
                {trainer.none
                  ? t('moReg.review.trainer.none')
                  : `${trainer.fullName} · ${trainer.org} · ${trainer.position} · ${trainer.phone}`}
              </ReviewBlock>
              <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={acceptRules}
                    onChange={(e) => setAcceptRules(e.target.checked)}
                    style={{ marginTop: 2 }}
                  />
                  <span>{t('moReg.review.acceptRules')}</span>
                </label>
                {errors.acceptRules && (
                  <div style={{ fontSize: 11, color: COLORS.danger }}>{t(errors.acceptRules)}</div>
                )}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    style={{ marginTop: 2 }}
                  />
                  <span>{t('moReg.review.consent')}</span>
                </label>
                {errors.consent && (
                  <div style={{ fontSize: 11, color: COLORS.danger }}>{t(errors.consent)}</div>
                )}
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
                {t('moReg.payment.title')}
              </h2>
              <div
                style={{
                  background: '#fff8e6',
                  border: '1px solid #f0dba0',
                  borderRadius: 4,
                  padding: '10px 14px',
                  marginBottom: 18,
                  fontSize: 12,
                  color: COLORS.accent,
                }}
              >
                {t('moReg.payment.notice')}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '14px 0',
                  borderTop: `1px solid ${COLORS.border}`,
                  borderBottom: `1px solid ${COLORS.border}`,
                  marginBottom: 18,
                  fontWeight: 700,
                }}
              >
                <span>{t('moReg.payment.fee')}</span>
                <span>500 KGS</span>
              </div>
              <label style={Styles.label}>{t('moReg.payment.method')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
                {(['card', 'qr'] as const).map((m) => (
                  <label
                    key={m}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      border: `1.5px solid ${paymentMethod === m ? COLORS.blue : COLORS.border}`,
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 13,
                    }}
                  >
                    <input
                      type="radio"
                      checked={paymentMethod === m}
                      onChange={() => setPaymentMethod(m)}
                    />
                    {t(`moReg.payment.method.${m}`)}
                  </label>
                ))}
              </div>
            </>
          )}

          {step === 'confirm' && (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: 42, marginBottom: 16 }}>🏆</div>
              <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 10 }}>
                {t('moReg.confirm.title')}
              </h2>
              <p style={{ fontSize: 14, color: COLORS.muted, marginBottom: 20, lineHeight: 1.6 }}>
                {t('moReg.confirm.body')}
              </p>
              <div
                style={{
                  display: 'inline-block',
                  background: COLORS.off,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 6,
                  padding: '12px 24px',
                  marginBottom: 24,
                }}
              >
                <div style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', fontWeight: 700 }}>
                  {t('moReg.confirm.id')}
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'monospace', color: COLORS.text }}>
                  {registrationId}
                </div>
              </div>
              <div>
                <button type="button" onClick={restart} style={Styles.btnOutline}>
                  {t('moReg.confirm.restart')}
                </button>
              </div>
            </div>
          )}

          {step !== 'confirm' && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 24,
                paddingTop: 20,
                borderTop: `1px solid ${COLORS.border}`,
              }}
            >
              <button
                type="button"
                onClick={goBack}
                disabled={step === 1}
                style={{ ...Styles.btnGhost, opacity: step === 1 ? 0.4 : 1 }}
              >
                {t('moReg.back')}
              </button>
              <button type="button" onClick={goNext} style={Styles.btnPrimary()}>
                {step === 5 ? t('moReg.payment.pay') : t('moReg.next')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ReviewBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      style={{
        background: COLORS.off,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 6,
        padding: '12px 16px',
        marginBottom: 10,
        fontSize: 13,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', marginBottom: 4 }}>
        {title}
      </div>
      <div style={{ color: COLORS.text }}>{children}</div>
    </div>
  )
}

export function MoRegPrototype() {
  return (
    <LangProvider>
      <MoRegInner />
    </LangProvider>
  )
}
