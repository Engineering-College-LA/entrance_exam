import { useEffect } from 'react'
import { COLORS } from '../constants'
import {
  Breadcrumb,
  ScoreRing,
  StatBox,
  TopicBar,
} from '../components/primitives'
import { useLang } from '../context/LangContext'
import { useIsMobile } from '../hooks/examHooks'
import { recordPlacementCompletion } from '../lib/placementCache'
import { supabase } from '../lib/supabase'
import { GradingService, TimeService } from '../services/examServices'
import { Styles } from '../styles'
import type { ExamQuestion, ExamResult, ExamType } from '../types/exam'

export function Report({
  student,
  result,
  examType,
  questions,
  onHome,
}: {
  student: Record<string, string>
  result: ExamResult
  examType: ExamType
  questions: ExamQuestion[]
  onHome: () => void
}) {
  const { lang, t } = useLang()
  const isMobile = useIsMobile()
  const pct = GradingService.percentage(result.correct, result.total)
  const { mm, ss } = TimeService.format(result.elapsed)
  const { labelKey, color: gradeColor } = GradingService.grade(pct)
  const topics = GradingService.topicBreakdown(result.answers, questions)

  useEffect(() => {
    try {
      const record = {
        id: Date.now().toString(),
        firstName: student.firstName,
        lastName: student.lastName,
        phone: student.phone,
        grade: student.grade,
        score: pct,
        correct: result.correct,
        total: result.total,
        elapsed: result.elapsed,
        completedAt: new Date().toISOString(),
        lang,
        examType: examType || 'trial',
      }
      const existing = JSON.parse(
        localStorage.getItem('ec_applicants') || '[]',
      ) as unknown[]
      existing.push(record)
      localStorage.setItem('ec_applicants', JSON.stringify(existing))

      if (examType === 'placement') {
        recordPlacementCompletion(student, result)
      }

      void supabase
        ?.from('applicants')
        .insert({
          id: record.id,
          first_name: student.firstName,
          last_name: student.lastName,
          phone: student.phone,
          grade: student.grade,
          exam_type: examType || 'trial',
          score: pct,
          correct: result.correct,
          total: result.total,
          elapsed: result.elapsed,
          lang,
          completed_at: record.completedAt,
          topics: topics.map((tp) => ({ key: tp.nameKey, pct: tp.pct })),
          parent_phone: student.parentPhone || null,
          parent_name: student.parentName || null,
          attended: student.attended || null,
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase insert error:', error)
        })
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- record once on mount
  }, [])

  const savePrintData = () => {
    const printData = {
      student,
      result,
      lang,
      examType,
      topics: topics.map((tp) => ({ key: tp.nameKey, name: t(tp.nameKey), pct: tp.pct })),
    }
    sessionStorage.setItem('ec_print_report', JSON.stringify(printData))
  }

  const handlePrint = () => {
    savePrintData()
    window.open('/print_report.html', '_blank')
  }

  const handleDownload = () => {
    savePrintData()
    window.open('/print_report.html?download=1', '_blank')
  }

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 20px' }}>
      <Breadcrumb
        items={[
          { text: 'college.edu.kg' },
          { text: t('register.breadcrumb.exam') },
          {
            text: t('report.breadcrumb.step'),
            highlight: true,
            color: COLORS.success,
          },
        ]}
      />
      <div
        style={{
          background: `linear-gradient(135deg,${COLORS.navy} 0%,#0a2240 100%)`,
          borderRadius: 10,
          padding: isMobile ? '32px 20px' : '44px 40px',
          marginBottom: 24,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -100,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background:
              'radial-gradient(circle,rgba(27,140,94,.12) 0%,transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ fontSize: 36, marginBottom: 12 }}>
          {examType === 'placement' ? '📋' : '🎓'}
        </div>
        <h2
          style={{
            fontWeight: 800,
            fontSize: 26,
            color: COLORS.white,
            marginBottom: 6,
          }}
        >
          {examType === 'placement'
            ? t('report.completed.placement')
            : t('report.completed')}
        </h2>
        <p style={{ color: '#8fa3c0', fontSize: 14 }}>
          {t('report.desc')}{' '}
          <span style={{ color: COLORS.accent, fontWeight: 600 }}>
            {student.firstName} {student.lastName}
          </span>
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '28px 0 16px',
          }}
        >
          <ScoreRing pct={pct} color={gradeColor} />
        </div>
        <div
          style={{
            display: 'inline-block',
            background: `${gradeColor}22`,
            color: gradeColor,
            border: `1px solid ${gradeColor}44`,
            borderRadius: 3,
            padding: '4px 14px',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          {t(labelKey)}
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
          gap: 14,
          marginBottom: 24,
        }}
      >
        <StatBox
          value={result.correct}
          label={t('report.correct')}
          color={COLORS.success}
        />
        <StatBox
          value={result.total - result.correct}
          label={t('report.incorrect')}
          color={COLORS.danger}
        />
        <StatBox value={result.total} label={t('report.total')} color={COLORS.navy} />
        <StatBox
          value={`${mm}:${ss}`}
          label={t('report.timeused')}
          color={COLORS.blue}
        />
      </div>
      {examType === 'placement' && (
        <div
          style={{
            ...Styles.card,
            marginBottom: 24,
            overflow: 'hidden',
            boxShadow: 'none',
          }}
        >
          <div
            style={{
              padding: '14px 22px',
              background: '#f7f9fc',
              borderBottom: `1px solid ${COLORS.border}`,
              fontWeight: 700,
              fontSize: 13,
              color: COLORS.navy,
            }}
          >
            {t('report.parentInfo')}
          </div>
          <div
            style={{
              padding: '18px 22px',
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
                {t('field.parentName')}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>
                {student.parentName || '—'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
                {t('field.parentPhone')}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>
                {student.parentPhone || '—'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
                {t('field.attended')}
              </div>
              <div
                style={{
                  display: 'inline-block',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 3,
                  background: student.attended === 'attended' ? `${COLORS.success}18` : `${COLORS.danger}18`,
                  color: student.attended === 'attended' ? COLORS.success : COLORS.danger,
                  border: `1px solid ${student.attended === 'attended' ? COLORS.success : COLORS.danger}44`,
                }}
              >
                {student.attended
                  ? t(`field.attended.${student.attended}`)
                  : '—'}
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          ...Styles.card,
          marginBottom: 24,
          overflow: 'hidden',
          boxShadow: 'none',
        }}
      >
        <div
          style={{
            padding: '14px 22px',
            background: '#f7f9fc',
            borderBottom: `1px solid ${COLORS.border}`,
            fontWeight: 700,
            fontSize: 13,
            color: COLORS.navy,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>{t('report.topics')}</span>
          <span style={{ fontSize: 11, fontWeight: 400, color: COLORS.muted }}>
            {t('report.estimated')}
          </span>
        </div>
        {topics.map((tp) => (
          <TopicBar key={tp.nameKey} nameKey={tp.nameKey} pct={tp.pct} />
        ))}
      </div>
      <div
        style={{
          background: `linear-gradient(135deg,${COLORS.navy} 0%,${COLORS.navy2} 100%)`,
          borderRadius: 8,
          padding: '18px 22px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <span style={{ fontSize: 28, flexShrink: 0 }}>🎓</span>
        <p style={{ margin: 0, fontSize: 13, color: '#b0c8e8', lineHeight: 1.6 }}>
          {t('report.promo')}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        <a
          href="https://college.edu.kg/"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            borderRadius: 4,
            background: COLORS.navy,
            color: COLORS.white,
            fontWeight: 700,
            fontSize: 13,
            textDecoration: 'none',
          }}
        >
          {t('report.visit')}
        </a>
        <a
          href="https://www.instagram.com/engineering.college.la/"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            borderRadius: 4,
            background:
              'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
            color: COLORS.white,
            fontWeight: 700,
            fontSize: 13,
            textDecoration: 'none',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          Instagram
        </a>
        <a
          href="https://wa.me/996226142222"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            borderRadius: 4,
            background: '#25d366',
            color: COLORS.white,
            fontWeight: 700,
            fontSize: 13,
            textDecoration: 'none',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </a>
        <button
          type="button"
          onClick={onHome}
          style={{
            ...Styles.btnOutline,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: COLORS.text,
            fontWeight: 600,
          }}
        >
          {t('report.home')}
        </button>
        <button
          type="button"
          onClick={handlePrint}
          style={{
            ...Styles.btnOutline,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: COLORS.text,
            fontWeight: 600,
          }}
        >
          {t('report.print')}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          style={{
            ...Styles.btnOutline,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: COLORS.text,
            fontWeight: 600,
          }}
        >
          {t('report.download')}
        </button>
      </div>
    </div>
  )
}
