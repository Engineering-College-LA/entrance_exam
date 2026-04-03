import { useState } from 'react'
import { COLORS } from '../constants'
import { Breadcrumb, RuleCard, StepBar } from '../components/primitives'
import { EXAM_RULES } from '../data/questionsData'
import { useLang } from '../context/LangContext'
import { Styles } from '../styles'

export function Instructions({
  student,
  onStart,
  totalQuestions,
  timeLimitSec,
}: {
  student: Record<string, string>
  onStart: () => void
  totalQuestions: number
  timeLimitSec: number
}) {
  const { t } = useLang()
  const [agreed, setAgreed] = useState(false)
  const mm = String(Math.floor(timeLimitSec / 60)).padStart(2, '0')
  const ss = String(timeLimitSec % 60).padStart(2, '0')
  return (
    <div style={{ maxWidth: 740, margin: '0 auto', padding: '48px 20px' }}>
      <Breadcrumb
        items={[
          { text: 'college.edu.kg' },
          { text: t('register.breadcrumb.exam'), highlight: true },
          { text: t('intro.breadcrumb.step') },
        ]}
      />
      <StepBar current="intro" />
      <div
        style={{
          background: `linear-gradient(135deg,${COLORS.navy} 0%,#0e2d54 100%)`,
          borderRadius: 10,
          padding: '40px 40px 36px',
          marginBottom: 24,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -20,
            top: -30,
            fontSize: 180,
            fontWeight: 800,
            color: 'rgba(255,255,255,.04)',
            lineHeight: 1,
            pointerEvents: 'none',
          }}
        >
          ∫
        </div>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 11,
            color: COLORS.accent,
            letterSpacing: 2,
            marginBottom: 10,
            textTransform: 'uppercase',
          }}
        >
          {t('intro.ready')}
        </div>
        <h2
          style={{
            fontWeight: 800,
            fontSize: 26,
            color: COLORS.white,
            marginBottom: 8,
          }}
        >
          {t('intro.welcome')}{' '}
          <span style={{ color: COLORS.accent }}>
            {student.firstName} {student.lastName}
          </span>
        </h2>
        <p style={{ color: '#8fa3c0', fontSize: 14, lineHeight: 1.7 }}>
          {t('intro.desc')}
        </p>
      </div>
      <div
        style={{
          ...Styles.card,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '18px 24px',
          marginBottom: 22,
          flexWrap: 'wrap',
          gap: 16,
          boxShadow: 'none',
        }}
      >
        {[
          [String(totalQuestions), 'intro.stat.questions'],
          [`${mm}:${ss}`, 'intro.stat.timelimit'],
          ['1×', 'intro.stat.attempts'],
        ].map(([v, lk]) => (
          <div key={lk} style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: 22, color: COLORS.navy }}>
              {v}
            </div>
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>
              {t(lk)}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          marginBottom: 24,
        }}
      >
        {EXAM_RULES.map((r) => (
          <RuleCard key={r.titleKey} {...r} />
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 13,
            color: COLORS.muted,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: COLORS.blue }}
          />
          {t('intro.checkbox')}
        </label>
        <button
          type="button"
          onClick={onStart}
          disabled={!agreed}
          style={{
            ...Styles.btnPrimary(agreed ? COLORS.success : '#ccc'),
            cursor: agreed ? 'pointer' : 'not-allowed',
            boxShadow: agreed ? '0 6px 20px rgba(27,140,94,.3)' : 'none',
            transition: 'all .2s',
          }}
        >
          {t('intro.start')}
        </button>
      </div>
    </div>
  )
}
