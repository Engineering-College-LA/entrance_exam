import { COLORS } from '../constants'
import { useLang, type Lang } from '../context/LangContext'
import { Styles } from '../styles'

const LANGS: { code: Lang; flag: string; native: string }[] = [
  { code: 'ru', flag: '🇷🇺', native: 'Русский' },
  { code: 'ky', flag: '🇰🇬', native: 'Кыргызча' },
  { code: 'en', flag: '🇬🇧', native: 'English' },
]

// Shown once, before we know the visitor's language — so the prompt itself
// is written in all three rather than picked via t().
export function LanguagePrompt() {
  const { hasChosenLang, setLang } = useLang()
  if (hasChosenLang) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(11,31,58,.82)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'overlayFadeIn 0.3s ease both',
      }}
    >
      <div
        style={{
          ...Styles.card,
          width: '100%',
          maxWidth: 380,
          padding: '32px 28px',
          textAlign: 'center',
          animation: 'successPop 0.4s cubic-bezier(.34,1.56,.64,1) both',
        }}
      >
        <div style={{ fontSize: 30, marginBottom: 14 }}>🌐</div>
        <div style={{ fontSize: 17, fontWeight: 800, color: COLORS.text, marginBottom: 4 }}>
          Выберите язык
        </div>
        <div style={{ fontSize: 17, fontWeight: 800, color: COLORS.text, marginBottom: 4 }}>
          Тилди тандаңыз
        </div>
        <div style={{ fontSize: 17, fontWeight: 800, color: COLORS.text, marginBottom: 22 }}>
          Choose your language
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLang(l.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 6,
                border: `1.5px solid ${COLORS.border}`,
                background: 'var(--t-card-bg)',
                color: COLORS.text,
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = COLORS.blue
                e.currentTarget.style.background =
                  'color-mix(in srgb, var(--c-blue) 8%, transparent)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = COLORS.border
                e.currentTarget.style.background = 'var(--t-card-bg)'
              }}
            >
              <span style={{ fontSize: 22 }}>{l.flag}</span>
              <span>{l.native}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
