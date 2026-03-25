'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { Locale, LOCALE_META, translations } from '@/lib/i18n'

interface LocaleCtx {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string, vars?: Record<string, string | number>) => string
  dir: 'ltr' | 'rtl'
}

const LocaleContext = createContext<LocaleCtx>({
  locale: 'en',
  setLocale: () => {},
  t: (k) => k,
  dir: 'ltr',
})

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('greetify-locale') as Locale | null
    if (saved && saved in LOCALE_META) {
      setLocaleState(saved)
      applyDir(saved)
    }
  }, [])

  const applyDir = (l: Locale) => {
    const dir = LOCALE_META[l].dir
    document.documentElement.dir = dir
    document.documentElement.lang = l
  }

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('greetify-locale', l)
    applyDir(l)
  }

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let text = translations[locale]?.[key] ?? translations['en']?.[key] ?? key
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, String(v))
        })
      }
      return text
    },
    [locale]
  )

  const dir = LOCALE_META[locale].dir

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LocaleContext.Provider>
  )
}

export const useLocale = () => useContext(LocaleContext)
