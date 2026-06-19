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
  student,
  onLogout,
}: {
  page: PageId
  onLogoClick: () => void
  student?: Record<string, string> | null
  onLogout?: () => void
}) {
  const { lang, setLang, t } = useLang()
  const { theme, toggleTheme } = useTheme()
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
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
            className="site-badge"
            style={{
              ...Styles.badge,
              textDecoration: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              transition: 'all 0.25s ease',
            }}
          >
            <span>{t(PAGES[page]?.labelKey)}</span>
            <span className="site-arrow" style={{
              display: 'inline-block',
              transition: 'transform 0.25s ease, opacity 0.25s ease, width 0.25s ease',
              opacity: 0,
              transform: 'translate(-4px, 4px)',
              fontSize: 10,
              width: 0,
              overflow: 'hidden'
            }}>
              ↗
            </span>
          </a>
        ) : (
          <span style={Styles.badge}>{t(PAGES[page]?.labelKey)}</span>
        )}

        {/* Profile Dropdown Trigger */}
        <div style={{ position: 'relative', display: 'inline-block' }} ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="avatar-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: profileOpen ? 'color-mix(in srgb, var(--t-text) 12%, transparent)' : 'color-mix(in srgb, var(--t-text) 8%, transparent)',
              border: '1px solid color-mix(in srgb, var(--t-text) 12%, transparent)',
              color: 'var(--t-muted)',
              cursor: 'pointer',
              flexShrink: 0,
              marginLeft: 4,
              transition: 'all 0.25s ease',
              outline: 'none',
            }}
            title="Profile / Профиль"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--c-accent)" />
                  <stop offset="100%" stopColor="var(--c-blue)" />
                </linearGradient>
              </defs>
              {/* Avatar Head */}
              <circle cx="12" cy="7.2" r="4.8" fill="url(#avatarGrad)" className="avatar-head" style={{ transformOrigin: '12px 7.2px' }} />
              {/* Avatar Body */}
              <path d="M12 14.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" fill="url(#avatarGrad)" className="avatar-body" style={{ transformOrigin: '12px 18px' }} />
            </svg>
          </button>

          {profileOpen && (
            <div
              style={{
                position: 'absolute',
                top: 38,
                right: 0,
                background: 'var(--t-card-bg)',
                border: '1px solid var(--t-border)',
                borderRadius: 8,
                boxShadow: 'var(--t-shadow)',
                padding: '16px 18px',
                width: 220,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                zIndex: 1000,
                animation: 'fadeInDown 0.15s ease both',
              }}
            >
              {/* Student Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--t-text)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {student?.firstName || student?.lastName
                    ? `${student.firstName ?? ''} ${student.lastName ?? ''}`.trim()
                    : (lang === 'ru' ? 'Абитуриент' : 'Applicant')}
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    color: 'var(--t-muted)',
                  }}
                >
                  ID: {student?.phone ? `2026-${student.phone.slice(-4)}` : (lang === 'ru' ? 'Временный' : 'Temporary')}
                </span>
              </div>

              {/* Moderation Status */}
              <div
                style={{
                  background: 'color-mix(in srgb, var(--t-text) 4%, transparent)',
                  border: '1px solid var(--t-border)',
                  borderRadius: 6,
                  padding: '8px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: 'var(--t-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {lang === 'ru' ? 'Документы' : 'Documents'}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: student?.firstName ? 'var(--c-success)' : 'var(--c-danger)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: student?.firstName ? 'var(--c-success)' : 'var(--c-danger)',
                      display: 'inline-block',
                    }}
                  />
                  {student?.firstName
                    ? (lang === 'ru' ? 'На проверке' : 'Under review')
                    : (lang === 'ru' ? 'Не загружены' : 'Not uploaded')}
                </span>
              </div>

              <div style={{ height: 1, background: 'var(--t-border)' }} />

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {student?.firstName && onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      onLogout()
                      setProfileOpen(false)
                    }}
                    style={{
                      background: 'color-mix(in srgb, var(--c-danger) 10%, transparent)',
                      color: 'var(--c-danger)',
                      border: '1px solid color-mix(in srgb, var(--c-danger) 20%, transparent)',
                      padding: '6px 12px',
                      fontSize: 12,
                      fontWeight: 700,
                      borderRadius: 4,
                      textAlign: 'center',
                      width: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--c-danger) 16%, transparent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--c-danger) 10%, transparent)'
                    }}
                  >
                    {lang === 'ru' ? 'Выйти из системы' : 'Sign Out'}
                  </button>
                )}
                
                <a
                  href="/pages/admin/login.html"
                  onClick={() => setProfileOpen(false)}
                  style={{
                    fontSize: 11,
                    color: 'var(--t-muted)',
                    textDecoration: 'none',
                    textAlign: 'center',
                    padding: '4px 0',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--t-text)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--t-muted)'}
                >
                  ⚙ {lang === 'ru' ? 'Панель администратора' : 'Admin Dashboard'}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Three-dots settings dropdown trigger */}
        <div style={{ position: 'relative', display: 'inline-block' }} ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="dots-btn"
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
              transition: 'all 0.25s ease',
              outline: 'none',
            }}
            title="Settings / Настройки"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
              <circle cx="12" cy="5" r="1.5" fill="currentColor" className="dot-top" style={{ transformOrigin: '12px 5px' }} />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" className="dot-middle" style={{ transformOrigin: '12px 12px' }} />
              <circle cx="12" cy="19" r="1.5" fill="currentColor" className="dot-bottom" style={{ transformOrigin: '12px 19px' }} />
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
