import { COLORS } from '../constants'
import { Styles } from '../styles'
import { useLang } from '../context/LangContext'

export function OlympiadThanks({ onHome }: { onHome: () => void }) {
  const { t } = useLang()
  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '56px 20px' }}>
      <div style={{ ...Styles.card, overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ ...Styles.cardHeader, justifyContent: 'center' }}>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: COLORS.white }}>
              {t('olympiad.thanks.title')}
            </div>
            <div style={{ color: '#8fa3c0', fontSize: 13, marginTop: 4 }}>
              {t('olympiad.thanks.sub')}
            </div>
          </div>
        </div>
        <div style={{ padding: '36px 28px 32px' }}>
          <div style={{ fontSize: 42, marginBottom: 16 }}>🧮</div>
          <p
            style={{
              fontSize: 15,
              color: COLORS.muted,
              lineHeight: 1.65,
              marginBottom: 28,
            }}
          >
            {t('olympiad.thanks.body')}
          </p>
          <button type="button" onClick={onHome} style={Styles.btnPrimary()}>
            {t('olympiad.thanks.home')}
          </button>
        </div>
      </div>
    </div>
  )
}
