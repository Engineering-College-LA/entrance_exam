import { useEffect, useState, type ChangeEvent } from 'react'
import { COLORS } from '../constants'
import { Breadcrumb, FormField, InfoBanner, Toast } from '../components/primitives'
import { useLang } from '../context/LangContext'
import { useFormState, useIsMobile } from '../hooks/examHooks'
import { COURSE_GRADE_FIELD, COURSE_PARENT_FIELDS, REGISTRATION_FIELDS } from '../data/questionsData'
import { courseText, fetchActiveCourses, startCoursePayment, type Course } from '../lib/courseRegistration'
import { ValidationService } from '../services/examServices'
import { Styles } from '../styles'

const STUDENT_FIELDS = [REGISTRATION_FIELDS[0]!, REGISTRATION_FIELDS[1]!, REGISTRATION_FIELDS[2]!, COURSE_GRADE_FIELD]
const ALL_FIELDS = [...STUDENT_FIELDS, ...COURSE_PARENT_FIELDS, { key: 'courseId', labelKey: 'field.course', type: 'select' }]

export function Courses({ onBack }: { onBack: () => void }) {
  const { lang, t } = useLang()
  const isMobile = useIsMobile()
  const [courses, setCourses] = useState<Course[] | null>(null)
  const [loadError, setLoadError] = useState(false)
  const { form, set } = useFormState(ALL_FIELDS)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [shakeKey, setShakeKey] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const selectCourse = (id: string) => {
    set('courseId')({ target: { value: id } } as ChangeEvent<HTMLSelectElement>)
    setErrors((prev) => {
      const n = { ...prev }
      delete n.courseId
      return n
    })
  }

  useEffect(() => {
    let cancelled = false
    void fetchActiveCourses().then((res) => {
      if (cancelled) return
      if ('error' in res) {
        setLoadError(true)
        setCourses([])
        return
      }
      setCourses(res.courses)
      // ?course=<id> lets a specific course be linked directly.
      const fromUrl = new URLSearchParams(window.location.search).get('course')
      const preselect = res.courses.find((c) => c.id === fromUrl) ?? (res.courses.length === 1 ? res.courses[0] : null)
      if (preselect) selectCourse(preselect.id)
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once
  }, [])

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

  const selected = courses?.find((c) => c.id === form.courseId) ?? null

  const handleSubmit = async () => {
    if (submitting) return
    const { valid, errs } = ValidationService.registration(form, 'course')
    if (!valid) {
      setErrors(errs)
      setShakeKey((k) => k + 1)
      setToast(t('register.validation'))
      return
    }
    setSubmitting(true)
    const result = await startCoursePayment(form, lang, form.courseId!)
    if ('error' in result) {
      setSubmitting(false)
      window.alert(`${t('courses.error')}\n\n${result.error.message}`)
      return
    }
    window.location.href = result.redirectUrl
  }

  const sectionTitle = (text: string) => (
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
      {text}
    </div>
  )

  const grid = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: 14,
    marginBottom: 14,
  } as const

  const field = (f: (typeof ALL_FIELDS)[number]) => (
    <FormField
      key={f.key}
      field={f}
      value={form[f.key] ?? ''}
      onChange={handleChange(f.key)}
      error={errors[f.key]}
      shakeKey={errors[f.key] ? shakeKey : 0}
    />
  )

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 20px' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <Breadcrumb
        items={[
          { text: 'college.edu.kg' },
          { text: t('courses.breadcrumb'), highlight: true },
          { text: t('register.olympiad.step') },
        ]}
      />
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
            🎓
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: COLORS.white }}>{t('courses.header')}</div>
            <div style={{ color: '#8fa3c0', fontSize: 13, marginTop: 3 }}>{t('courses.subheader')}</div>
          </div>
        </div>
        <div style={{ padding: isMobile ? 20 : 28 }}>
          <InfoBanner
            icon="ℹ"
            text={t('courses.info')}
            bg="color-mix(in srgb, var(--c-blue) 10%, transparent)"
            borderColor="color-mix(in srgb, var(--c-blue) 30%, transparent)"
            color="var(--c-blueLight)"
          />

          {sectionTitle(t('courses.choose'))}
          {courses === null && <div style={{ color: COLORS.muted, fontSize: 13, marginBottom: 20 }}>{t('courses.loading')}</div>}
          {courses !== null && courses.length === 0 && (
            <InfoBanner
              icon="⚠"
              text={loadError ? t('courses.loadError') : t('courses.empty')}
              bg="#fff8e6"
              borderColor="#f0dba0"
              color={COLORS.accent}
            />
          )}
          {courses !== null && courses.length > 0 && (
            <div
              role="radiogroup"
              aria-label={t('courses.choose')}
              className={errors.courseId ? 'field-shake' : ''}
              key={errors.courseId ? shakeKey : 0}
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 12,
                marginBottom: errors.courseId ? 6 : 22,
              }}
            >
              {courses.map((c) => {
                const active = c.id === form.courseId
                const desc = courseText(c, 'description', lang)
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => selectCourse(c.id)}
                    style={{
                      textAlign: 'left',
                      cursor: 'pointer',
                      padding: 16,
                      borderRadius: 8,
                      background: active ? 'color-mix(in srgb, var(--c-accent) 10%, transparent)' : 'transparent',
                      border: `2px solid ${active ? COLORS.accent : errors.courseId ? COLORS.danger : COLORS.border}`,
                      color: COLORS.text,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      font: 'inherit',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{courseText(c, 'title', lang)}</span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: COLORS.accent, whiteSpace: 'nowrap' }}>
                        {c.fee_kgs} {t('courses.currency')}
                      </span>
                    </div>
                    {desc && <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.45 }}>{desc}</div>}
                  </button>
                )
              })}
            </div>
          )}
          {errors.courseId && (
            <div style={{ color: COLORS.danger, fontSize: 11, marginBottom: 22 }}>
              <span style={{ fontWeight: 700 }}>✕</span> {t(errors.courseId)}
            </div>
          )}

          <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 20 }}>
            {sectionTitle(t('courses.studentInfo'))}
            <div style={grid}>
              {field(STUDENT_FIELDS[0]!)}
              {field(STUDENT_FIELDS[1]!)}
            </div>
            <div style={grid}>
              {field(STUDENT_FIELDS[2]!)}
              {field(STUDENT_FIELDS[3]!)}
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${COLORS.border}`, marginTop: 8, paddingTop: 20 }}>
            {sectionTitle(t('register.parentInfo'))}
            <div style={grid}>
              {field(COURSE_PARENT_FIELDS[0]!)}
              {field(COURSE_PARENT_FIELDS[1]!)}
            </div>
          </div>

          {selected && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                marginTop: 8,
                borderRadius: 6,
                border: `1px solid ${COLORS.border}`,
                fontSize: 14,
              }}
            >
              <span style={{ color: COLORS.muted }}>{t('courses.total')}</span>
              <span style={{ fontWeight: 700, color: COLORS.text }}>
                {courseText(selected, 'title', lang)} — {selected.fee_kgs} {t('courses.currency')}
              </span>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 24,
              gap: 12,
            }}
          >
            <button type="button" onClick={onBack} style={Styles.btnGhost}>
              {t('register.back')}
            </button>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={submitting || !courses?.length}
              style={{ ...Styles.btnPrimary(), opacity: submitting || !courses?.length ? 0.6 : 1 }}
            >
              {submitting ? t('courses.submitting') : t('register.olympiad.submit')}
            </button>
          </div>
          <div
            style={{
              fontSize: 11,
              color: COLORS.muted,
              marginTop: 16,
              paddingTop: 14,
              borderTop: `1px solid ${COLORS.border}`,
            }}
          >
            {t('register.secure')}
          </div>
        </div>
      </div>
    </div>
  )
}
