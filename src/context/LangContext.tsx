import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { TRANSLATIONS } from '../i18n/translations'

export type Lang = 'en' | 'ru'

type LangContextValue = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ru')

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback(
    (key: string, vars: Record<string, string | number> = {}) => {
      const table = TRANSLATIONS[lang] as Record<string, string>
      const val =
        (table && table[key]) ||
        (TRANSLATIONS.en as Record<string, string>)[key] ||
        key
      if (Object.keys(vars).length > 0) {
        return val.replace(
          /\{(\w+)\}/g,
          (_, k: string) =>
            vars[k] !== undefined ? String(vars[k]) : `{${k}}`,
        )
      }
      return val
    },
    [lang],
  )

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- paired hook with LangProvider
export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
