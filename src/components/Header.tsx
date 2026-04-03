import { COLORS, PAGES } from '../constants'
import { useLang } from '../context/LangContext'
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
          }}
        />
        {!isMobile && (
          <span style={{ ...Styles.logoText, alignSelf: 'center' }}>
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
            background: 'rgba(255,255,255,.08)',
            border: '1px solid rgba(255,255,255,.12)',
            color: '#8fa3c0',
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
