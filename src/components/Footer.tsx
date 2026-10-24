import { COLORS } from '../constants'
import { useLang } from '../context/LangContext'

const linkStyle = {
  color: COLORS.muted,
  textDecoration: 'none',
  fontSize: 13,
}

const titleStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: COLORS.muted,
  textTransform: 'uppercase' as const,
  letterSpacing: 1,
  marginBottom: 12,
}

export function Footer() {
  const { t } = useLang()

  return (
    <footer
      style={{
        borderTop: `1px solid ${COLORS.border}`,
        marginTop: 48,
        padding: '36px 28px 24px',
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 28,
        }}
      >
        <div>
          <div style={titleStyle}>{t('footer.about.title')}</div>
          <a href="https://college.edu.kg/" target="_blank" rel="noreferrer" style={linkStyle}>
            {t('footer.about.college')}
          </a>
        </div>

        <div>
          <div style={titleStyle}>{t('footer.partners.title')}</div>
          <a href="https://aprd.kg/" target="_blank" rel="noreferrer" style={linkStyle}>
            APRD
          </a>
        </div>

        <div>
          <div style={titleStyle}>{t('footer.contacts.title')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <a href="tel:+996226142222" style={linkStyle}>
              +996 226 14 22 22
            </a>
            <a
              href="https://www.instagram.com/engineering.college.la/"
              target="_blank"
              rel="noreferrer"
              style={linkStyle}
            >
              {t('footer.contacts.instagram')}
            </a>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 960,
          margin: '28px auto 0',
          paddingTop: 20,
          borderTop: `1px solid ${COLORS.border}`,
          fontSize: 12,
          color: COLORS.muted,
          textAlign: 'center',
        }}
      >
        {t('footer.rights', { year: new Date().getFullYear() })}
      </div>
    </footer>
  )
}
