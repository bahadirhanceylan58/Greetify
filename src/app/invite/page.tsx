'use client'

import Link from 'next/link'
import { invitationTemplates, InvitationCategory } from '@/data/invitationTemplates'
import { useState, useMemo } from 'react'
import { useLocale } from '@/context/LocaleContext'

const CAT_IDS: (InvitationCategory | 'all')[] = [
  'all','wedding','engagement','birthday','circumcision','henna','graduation','baby','opening',
]
const CAT_EMOJI: Record<string, string> = {
  all: '✨', wedding: '💍', engagement: '💑', birthday: '🎂',
  circumcision: '🌙', henna: '🌸', graduation: '🎓', baby: '👶', opening: '🎊',
}

export default function InvitePage() {
  const { t } = useLocale()
  const [active, setActive] = useState<InvitationCategory | 'all'>('all')

  const filtered = useMemo(() =>
    active === 'all' ? invitationTemplates : invitationTemplates.filter(tmpl => tmpl.category === active),
    [active]
  )

  return (
    <main className="min-h-screen">
      <header className="bg-gradient-to-b from-gray-900 to-transparent pt-10 pb-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/" className="inline-block text-gray-500 hover:text-gray-300 text-sm mb-4 transition-colors">
            {t('inv_back')}
          </Link>
          <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-full px-4 py-1.5 mb-3">
            <span className="text-rose-400 text-sm font-medium">💌 Davetiye</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">
            {t('inv_title1')}
            <br />
            <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
              {t('inv_title2')}
            </span>
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">{t('inv_sub')}</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 pb-24">
        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {CAT_IDS.map((id) => (
            <button key={id} onClick={() => setActive(id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                active === id ? 'bg-rose-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}>
              <span>{CAT_EMOJI[id]}</span> {t(`inv_cat_${id}`)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((template) => (
            <Link key={template.id} href={`/invite/create/${template.id}`}>
              <div className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                <div className="relative h-52 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ background: template.accentColor }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
                    <span className="text-5xl">{template.emoji}</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <span className="bg-white text-gray-900 font-bold px-4 py-2 rounded-full text-sm shadow-2xl">{t('inv_create')}</span>
                  </div>
                </div>
                <div className="px-3 py-2.5 bg-gray-900 border-t" style={{ borderColor: `${template.accentColor}30` }}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{template.emoji}</span>
                    <h3 className="font-semibold text-white text-sm truncate">{template.title}</h3>
                  </div>
                  <p className="text-xs mt-0.5 ml-6" style={{ color: template.accentColor + '99' }}>
                    {template.inviteText.slice(0, 30)}…
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="fixed bottom-0 inset-x-0 border-t border-gray-800 bg-gray-950/90 backdrop-blur py-3 text-center text-gray-600 text-xs">
        Greetify — Davetiye & Tebrik Kartları 💌
      </footer>
    </main>
  )
}
