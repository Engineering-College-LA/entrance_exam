import { COLORS } from '../constants'
import { LETTERS } from '../constants'
import { NavDot, OptionCard } from '../components/primitives'
import { useLang } from '../context/LangContext'
import { useExamState, useIsMobile, useTimer } from '../hooks/examHooks'
import { GradingService } from '../services/examServices'
import { Styles } from '../styles'
import type { ExamQuestion, ExamResult } from '../types/exam'

export function Exam({
  questions,
  timeLimitSec,
  onFinish,
}: {
  questions: ExamQuestion[]
  timeLimitSec: number
  onFinish: (r: ExamResult) => void
}) {
  const { lang, t } = useLang()
  const isMobile = useIsMobile()
  const exam = useExamState(questions)

  function submitExam(auto = false) {
    if (!auto && exam.answeredCount < questions.length) {
      const msg = t('exam.confirm', {
        n: questions.length - exam.answeredCount,
      })
      if (!window.confirm(msg)) return
    }
    const correct = GradingService.score(exam.answers, questions)
    onFinish({
      correct,
      total: questions.length,
      elapsed: exam.elapsed(),
      answers: exam.answers,
    })
  }

  const timer = useTimer(timeLimitSec, () => submitExam(true))

  const q = exam.question
  if (!q) return null
  const qText = lang === 'ru' && q.textRu ? q.textRu : q.text
  const qOpts = lang === 'ru' && q.optsRu ? q.optsRu : q.opts
  const topicLabel = t(q.topicKey ?? 'topic.algebra')

  return (
    <div
      style={{
        maxWidth: 1060,
        margin: '0 auto',
        padding: isMobile ? '16px 14px' : '28px 20px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 280px',
        gap: 20,
        alignItems: 'start',
      }}
    >
      <div>
        <div
          style={{
            background: COLORS.navy,
            borderRadius: 8,
            padding: '14px 22px',
            marginBottom: 20,
            boxShadow: '0 4px 20px rgba(0,0,0,.15)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 12,
                color: '#8fa3c0',
              }}
            >
              {t('exam.question')}{' '}
              <strong style={{ color: COLORS.white }}>{exam.current + 1}</strong>{' '}
              {t('exam.of')}{' '}
              <strong style={{ color: COLORS.white }}>{questions.length}</strong>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                fontFamily: 'monospace',
                fontSize: 16,
                fontWeight: 500,
                color: timer.isWarning ? '#ff7043' : COLORS.white,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: timer.isWarning ? '#ff7043' : COLORS.accent,
                  display: 'inline-block',
                }}
              />
              {timer.mm}:{timer.ss}
            </div>
          </div>
          <div
            style={{
              height: 4,
              background: 'rgba(255,255,255,.1)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: COLORS.accent,
                borderRadius: 2,
                width: `${(exam.answeredCount / questions.length) * 100}%`,
                transition: 'width .3s',
              }}
            />
          </div>
        </div>
        <div
          style={{
            ...Styles.card,
            padding: 28,
            boxShadow: '0 2px 12px rgba(0,0,0,.04)',
          }}
        >
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 11,
              color: COLORS.muted,
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            {t('exam.question')} {exam.current + 1} — {topicLabel}
          </div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 17,
              color: COLORS.navy,
              lineHeight: 1.5,
              marginBottom: 24,
            }}
          >
            {qText}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {qOpts.map((opt, i) => (
              <OptionCard
                key={i}
                letter={LETTERS[i] ?? String(i)}
                text={opt}
                selected={exam.answers[exam.current] === i}
                onClick={() => exam.select(i)}
              />
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 22,
            }}
          >
            <button
              type="button"
              onClick={exam.prev}
              disabled={exam.isFirst}
              style={{
                ...Styles.btnOutline,
                color: exam.isFirst ? COLORS.border : COLORS.text,
                cursor: exam.isFirst ? 'not-allowed' : 'pointer',
              }}
            >
              {t('exam.prev')}
            </button>
            {!exam.isLast && (
              <button type="button" onClick={exam.next} style={Styles.btnPrimary()}>
                {t('exam.next')}
              </button>
            )}
          </div>
        </div>
      </div>
      <div>
        <div
          style={{
            ...Styles.card,
            padding: 18,
            marginBottom: 14,
            boxShadow: 'none',
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: COLORS.navy,
              marginBottom: 12,
            }}
          >
            {t('exam.navigator')}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {questions.map((_, i) => (
              <NavDot
                key={i}
                index={i}
                isCurrent={i === exam.current}
                isAnswered={exam.answers[i] !== undefined}
                onClick={() => exam.goTo(i)}
              />
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {[
              ['exam.legend.answered', COLORS.navy],
              ['exam.legend.current', COLORS.blue],
              ['exam.legend.unanswered', COLORS.border],
            ].map(([lk, c]) => (
              <div
                key={lk}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 11,
                  color: COLORS.muted,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    background: c,
                    flexShrink: 0,
                  }}
                />
                {t(lk)}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            ...Styles.card,
            padding: '12px 16px',
            marginBottom: 14,
            fontSize: 12,
            color: COLORS.muted,
            textAlign: 'center',
            boxShadow: 'none',
          }}
        >
          <span style={{ fontWeight: 700, color: COLORS.navy, fontSize: 15 }}>
            {exam.answeredCount}
          </span>{' '}
          / {questions.length} {t('exam.answered')}
        </div>
        <button
          type="button"
          onClick={() => submitExam()}
          style={{
            width: '100%',
            ...Styles.btnPrimary(COLORS.danger),
            padding: 13,
          }}
        >
          {t('exam.submit')}
        </button>
      </div>
    </div>
  )
}
