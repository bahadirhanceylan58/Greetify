'use client'

import { categories, Category } from '@/data/templates'
import { useLocale } from '@/context/LocaleContext'
import clsx from 'clsx'

interface Props {
  active: Category
  onChange: (cat: Category) => void
  counts: Record<string, number>
}

export default function CategoryFilter({ active, onChange, counts }: Props) {
  const { t } = useLocale()

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id as Category)}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200',
            active === cat.id
              ? 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-500/30 scale-105'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
          )}
        >
          <span>{cat.emoji}</span>
          <span>{t(`cat_${cat.id}`)}</span>
          <span className={clsx(
            'text-xs px-1.5 py-0.5 rounded-full',
            active === cat.id ? 'bg-amber-600/50 text-amber-100' : 'bg-gray-700 text-gray-400'
          )}>
            {counts[cat.id] ?? 0}
          </span>
        </button>
      ))}
    </div>
  )
}
