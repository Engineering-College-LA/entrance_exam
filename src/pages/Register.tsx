import { useState, type ChangeEvent } from 'react'
import { COLORS } from '../constants'
import {
  FormField,
  InfoBanner,
  StepBar,
  Toast,
  Breadcrumb,
} from '../components/primitives'
import { useLang } from '../context/LangContext'
import { useFormState, useIsMobile } from '../hooks/examHooks'
import {
  PLACEMENT_EXTRA_FIELDS,
  REGISTRATION_FIELDS,
} from '../data/questionsData'
import { ValidationService } from '../services/examServices'
import { Styles } from '../styles'
import type { ExamType } from '../types/exam'

export function Register({
  onSubmit,
  onBack,
  examType,
}: {
  onSubmit: (form: Record<string, string>) => void
  onBack: () => void
  examType: ExamType
}) {
  const { t } = useLang()
  const isMobile = useIsMobile()
  const isPlacement = examType === 'placement'
  const allFields = isPlacement
    ? [...REGISTRATION_FIELDS, ...PLACEMENT_EXTRA_FIELDS]
    : REGISTRATION_FIELDS
  const { form, set } = useFormState(allFields)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [shakeKey, setShakeKey] = useState(0)
  const [toast, setToast] = useState<string | null>(null)

  const handleChange = (key: string) => {
    const inner = set(key)
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      inner(e)
      if (errors[key])
        setErrors((prev) => {
          const n = { ...prev }
          delete n[key]
          return n
        })
    }
  }

  const handleSubmit = () => {
    const { valid, errs } = ValidationService.registration(form, examType)
    if (!valid) {
      setErrors(errs)
      setShakeKey((k) => k + 1)
      setToast(t('register.validation'))
      return
    }
    onSubmit(form)
  }

  const attendedOptions = ['attended', 'not_attended'].map((v) => ({
    value: v,
    label: t(`field.attended.${v}`),
  }))

  return (
    <div style={{ maxWidth: 660, margin: '0 auto', padding: '48px 20px' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <Breadcrumb
        items={[
          { text: 'college.edu.kg' },
          { text: t('register.breadcrumb.exam'), highlight: true },
          { text: t('register.breadcrumb.step') },
        ]}
      />
      <StepBar current="register" />
      <div style={{ ...Styles.card, overflow: 'hidden' }}>
        <div style={Styles.cardHeader}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 6,
              background: 'rgba(255,255,255,.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            📋
          </div>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 17,
                color: COLORS.white,
              }}
            >
              {t('register.header')}
            </div>
            <div style={{ color: '#8fa3c0', fontSize: 13, marginTop: 3 }}>
              {t('register.subheader')}
            </div>
          </div>
        </div>
        <div style={{ padding: 28 }}>
          <InfoBanner
            icon="ℹ"
            text={t('register.info')}
            bg="#f0f6ff"
            borderColor="#c5d9f5"
            color={COLORS.blue}
          />
          {[
            [0, 1],
            [2, 3],
          ].map((pair, ri) => (
            <div
              key={ri}
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 14,
                marginBottom: 14,
              }}
            >
              {pair.map((fi) => {
                const f = REGISTRATION_FIELDS[fi]!
                return (
                  <FormField
                    key={f.key}
                    field={f}
                    value={form[f.key] ?? ''}
                    onChange={handleChange(f.key)}
                    error={errors[f.key]}
                    shakeKey={errors[f.key] ? shakeKey : 0}
                  />
                )
              })}
            </div>
          ))}
          {isPlacement && (
            <div
              style={{
                borderTop: `1px solid ${COLORS.border}`,
                marginTop: 8,
                paddingTop: 20,
              }}
            >
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
                {t('field.parentPhone').startsWith('Parent')
                  ? 'Parent / Guardian Info'
                  : 'Информация о родителе'}
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: 14,
                  marginBottom: 14,
                }}
              >
                <FormField
                  field={PLACEMENT_EXTRA_FIELDS[0]!}
                  value={form.parentPhone ?? ''}
                  onChange={handleChange('parentPhone')}
                  error={errors.parentPhone}
                  shakeKey={errors.parentPhone ? shakeKey : 0}
                />
                <FormField
                  field={PLACEMENT_EXTRA_FIELDS[1]!}
                  value={form.parentName ?? ''}
                  onChange={handleChange('parentName')}
                  error={errors.parentName}
                  shakeKey={errors.parentName ? shakeKey : 0}
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={Styles.label}>{t('field.attended')}</label>
                <select
                  value={form.attended ?? ''}
                  onChange={handleChange('attended')}
                  style={{
                    ...Styles.input,
                    cursor: 'pointer',
                    borderColor: errors.attended ? COLORS.danger : COLORS.border,
                  }}
                >
                  <option value="">{t('field.select')}</option>
                  {attendedOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                {errors.attended && (
                  <div
                    style={{
                      fontSize: 12,
                      color: COLORS.danger,
                      marginTop: 4,
                    }}
                  >
                    {t(errors.attended)}
                  </div>
                )}
              </div>
            </div>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 24,
            }}
          >
            <button type="button" onClick={onBack} style={Styles.btnGhost}>
              {t('register.back')}
            </button>
            <button type="button" onClick={handleSubmit} style={Styles.btnPrimary()}>
              {t('register.continue')}
            </button>
          </div>
          <div
            style={{
              fontSize: 11,
              color: COLORS.muted,
              marginTop: 16,
              paddingTop: 14,
              borderTop: `1px solid ${COLORS.border}`,
              display: 'flex',
              gap: 6,
              alignItems: 'center',
            }}
          >
            {t('register.secure')}
          </div>
        </div>
      </div>
    </div>
  )
}
