import { useState, useEffect, useRef } from 'react'
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
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
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

        {/* Three-dots settings dropdown trigger */}
        <div style={{ position: 'relative', display: 'inline-block' }} ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: menuOpen ? 'color-mix(in srgb, var(--t-text) 12%, transparent)' : 'color-mix(in srgb, var(--t-text) 8%, transparent)',
              border: '1px solid color-mix(in srgb, var(--t-text) 12%, transparent)',
              color: 'var(--t-muted)',
              cursor: 'pointer',
              transition: 'background .15s, color .15s',
              outline: 'none',
            }}
            title="Settings / Настройки"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
            </svg>
          </button>

          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 38,
                right: 0,
                background: 'var(--t-card-bg)',
                border: '1px solid var(--t-border)',
                borderRadius: 8,
                boxShadow: 'var(--t-shadow)',
                padding: '12px 14px',
                width: 170,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                zIndex: 1000,
                animation: 'fadeInDown 0.15s ease both',
              }}
            >
              {/* Language Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: 'var(--t-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {lang === 'ru' ? 'Язык' : 'Language'}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setLang('ru')
                    }}
                    style={{
                      ...Styles.langBtn,
                      flex: 1,
                      textAlign: 'center',
                      background: lang === 'ru' ? COLORS.blue : 'color-mix(in srgb, var(--t-text) 6%, transparent)',
                      color: lang === 'ru' ? 'var(--c-white)' : 'var(--t-muted)',
                      border: '1px solid color-mix(in srgb, var(--t-text) 10%, transparent)',
                      padding: '5px 0',
                    }}
                  >
                    RU
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLang('en')
                    }}
                    style={{
                      ...Styles.langBtn,
                      flex: 1,
                      textAlign: 'center',
                      background: lang === 'en' ? COLORS.blue : 'color-mix(in srgb, var(--t-text) 6%, transparent)',
                      color: lang === 'en' ? 'var(--c-white)' : 'var(--t-muted)',
                      border: '1px solid color-mix(in srgb, var(--t-text) 10%, transparent)',
                      padding: '5px 0',
                    }}
                  >
                    EN
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'var(--t-border)' }} />

              {/* Theme Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: 'var(--t-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {lang === 'ru' ? 'Тема' : 'Theme'}
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  style={{
                    ...Styles.langBtn,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 8,
                    background: 'color-mix(in srgb, var(--t-text) 6%, transparent)',
                    color: 'var(--t-text)',
                    border: '1px solid color-mix(in srgb, var(--t-text) 10%, transparent)',
                    padding: '6px 10px',
                    fontSize: 12,
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  {theme === 'light' ? '🌙' : '☀️'}{' '}
                  {theme === 'light'
                    ? lang === 'ru' ? 'Тёмная' : 'Dark'
                    : lang === 'ru' ? 'Светлая' : 'Light'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
