import { COLORS, PAGES } from '../constants'
import { useLang } from '../context/LangContext'
import { useTheme } from '../context/ThemeContext'
import { useIsMobile } from '../hooks/examHooks'
import { Styles } from '../styles'
import type { PageId } from '../types/exam'

const LOGO_SRC = '/assets/app_logo.png'

export function Header({
  page,
  onLogoClick,
}: {
  page: PageId
  onLogoClick: () => void
}) {
  const { lang, setLang, t } = useLang()
  const { theme, toggleTheme } = useTheme()
  const isMobile = useIsMobile()
  return (
    <div
      style={{
        ...Styles.header,
        padding: isMobile ? '0 14px' : '0 28px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          cursor: 'pointer',
        }}
        onClick={onLogoClick}
        onKeyDown={(e) => e.key === 'Enter' && onLogoClick()}
        role="button"
        tabIndex={0}
      >
        <img
          src={LOGO_SRC}
          alt="E|C"
          style={{
            height: 44,
            width: 'auto',
            marginRight: 8,
            alignSelf: 'flex-start',
            filter: 'var(--t-logo-filter)',
          }}
        />
        {!isMobile && (
          <span style={{ ...Styles.logoText, alignSelf: 'center', color: 'var(--t-muted)' }}>
            Engineering College
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {page === 'landing' ? (
          <a
            href="https://college.edu.kg/"
            target="_blank"
            rel="noreferrer"
            style={{
              ...Styles.badge,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            {t(PAGES[page]?.labelKey)}
          </a>
        ) : (
          <span style={Styles.badge}>{t(PAGES[page]?.labelKey)}</span>
        )}
        <div style={{ display: 'flex', gap: 3 }}>
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              ...Styles.langBtn,
              background: 'color-mix(in srgb, var(--t-text) 8%, transparent)',
              color: 'var(--t-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              padding: 0,
              fontSize: 14,
            }}
            title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            type="button"
            onClick={() => setLang('ru')}
            style={{
              ...Styles.langBtn,
              background: lang === 'ru' ? COLORS.blue : 'color-mix(in srgb, var(--t-text) 8%, transparent)',
              color: lang === 'ru' ? 'var(--c-white)' : 'var(--t-muted)',
            }}
          >
            RU
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            style={{
              ...Styles.langBtn,
              background: lang === 'en' ? COLORS.blue : 'color-mix(in srgb, var(--t-text) 8%, transparent)',
              color: lang === 'en' ? 'var(--c-white)' : 'var(--t-muted)',
            }}
          >
            EN
          </button>
        </div>
        <a
          href="/pages/admin/login.html"
          title="Admin"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'color-mix(in srgb, var(--t-text) 8%, transparent)',
            border: '1px solid color-mix(in srgb, var(--t-text) 12%, transparent)',
            color: 'var(--t-muted)',
            textDecoration: 'none',
            flexShrink: 0,
            marginLeft: 4,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </a>
      </div>
    </div>
  )
}
