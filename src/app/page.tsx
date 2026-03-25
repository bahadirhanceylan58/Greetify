'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { templates, Category } from '@/data/templates'
import TemplateCard from '@/components/TemplateCard'
import CategoryFilter from '@/components/CategoryFilter'
import { getUpcoming, daysUntil } from '@/data/upcomingHolidays'

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [search, setSearch] = useState('')
  const upcoming = useMemo(() => getUpcoming(90), [])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: templates.length }
    templates.forEach((t) => {
      c[t.category] = (c[t.category] ?? 0) + 1
    })
    return c
  }, [])

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchCat = activeCategory === 'all' || t.category === activeCategory
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.occasion.toLowerCase().includes(search.toLowerCase()) ||
        t.english.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [activeCategory, search])

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-transparent pt-10 pb-6 px-4">
        <div className="absolute inset-0 pointer-events-none">
          {['top-4 left-10', 'top-8 right-20', 'top-16 left-1/3', 'top-6 right-1/3'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} text-amber-400/20 text-2xl`}>★</div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-3">
            <span className="text-amber-400 text-sm font-medium">🌙 Greetify</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 leading-tight">
            Personalized
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Greeting Cards
            </span>
          </h1>

          <p className="text-gray-400 text-sm md:text-lg max-w-xl mx-auto mb-4">
            Add your name to beautiful cards. Download &amp; share on WhatsApp!
          </p>

          {/* Language badges */}
          <div className="flex justify-center gap-2 mb-5 flex-wrap">
            {['English', 'اردو', 'العربية', 'हिन्दी'].map((lang) => (
              <span key={lang} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs border border-gray-700">
                {lang}
              </span>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input
              type="text"
              placeholder="Eid, Christmas, Ramadan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-full pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 pb-24">
        {/* Category Filter */}
        <div className="mb-4">
          <CategoryFilter
            active={activeCategory}
            onChange={setActiveCategory}
            counts={counts}
          />
        </div>

        {/* Upcoming Holidays */}
        {upcoming.length > 0 && (
          <div className="mb-5">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-2">⏰ Yaklaşan Bayramlar</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {upcoming.map((h) => {
                const d = daysUntil(h.date)
                return (
                  <Link key={h.id} href={`/create/${h.id}`}
                    className="flex-shrink-0 flex items-center gap-2 bg-gray-900 border border-gray-800 hover:border-amber-500/50 rounded-xl px-3 py-2 transition-colors"
                  >
                    <span className="text-lg">{h.emoji}</span>
                    <div>
                      <p className="text-white text-xs font-medium whitespace-nowrap">{h.title}</p>
                      <p className="text-amber-400 text-xs">{d === 0 ? 'Bugün!' : d === 1 ? 'Yarın!' : `${d} gün`}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Results count */}
        <p className="text-gray-500 text-xs mb-3">
          {filtered.length} template{filtered.length !== 1 ? 's' : ''} found
          {search && <span> for &quot;<span className="text-amber-400">{search}</span>&quot;</span>}
        </p>

        {/* Grid — 2 cols on mobile, 3 on sm, 4 on lg */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-400">No templates found.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 inset-x-0 border-t border-gray-800 bg-gray-950/90 backdrop-blur py-3 text-center text-gray-600 text-xs">
        Greetify — Islamic · Christian · National 🌍
      </footer>
    </main>
  )
}
