'use client'

import { useLocale } from '@/context/LocaleContext'
import { LOCALE_META, Locale } from '@/lib/i18n'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="flex justify-center gap-2 flex-wrap">
      {(Object.keys(LOCALE_META) as Locale[]).map((code) => {
        const meta = LOCALE_META[code]
        const active = locale === code
        return (
          <button
            key={code}
            onClick={() => setLocale(code)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              active
                ? 'bg-amber-500 border-amber-500 text-gray-900 scale-105'
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-amber-500/50 hover:text-white'
            }`}
          >
            <span>{meta.flag}</span>
            <span>{meta.label}</span>
          </button>
        )
      })}
    </div>
  )
}
