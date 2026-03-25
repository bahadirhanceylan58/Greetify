'use client'

import Link from 'next/link'
import { Template } from '@/data/templates'

interface Props {
  template: Template
}

export default function TemplateCard({ template }: Props) {
  return (
    <Link href={`/create/${template.id}`}>
      <div className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-1"
           style={{ boxShadow: `0 4px 24px ${template.accentColor}25` }}>

        {/* Card Visual */}
        <div className="relative h-52 overflow-hidden"
             style={{ background: getCardBg(template) }}>

          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
               style={{ background: template.accentColor }} />
          <div className="absolute -bottom-10 -left-6 w-36 h-36 rounded-full opacity-10"
               style={{ background: template.accentColor }} />
          <div className="absolute top-1/2 right-4 w-16 h-16 rounded-full opacity-10"
               style={{ background: template.accentColor }} />

          {/* Pattern SVG */}
          <PatternSVG pattern={template.pattern} color={template.accentColor} />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 z-10">
            <div className="text-5xl mb-2 drop-shadow-2xl" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}>
              {template.emoji}
            </div>
            {template.arabic && (
              <p className="arabic-text text-lg font-bold text-center mb-1"
                 style={{ color: template.accentColor, textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                {template.arabic}
              </p>
            )}
            <p className="text-xs font-bold text-center px-2 leading-tight"
               style={{ color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
              {template.english}
            </p>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 z-20 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 font-bold px-4 py-2 rounded-full text-sm shadow-xl">
              + Add Your Name
            </span>
          </div>

          {/* Shimmer line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-40"
               style={{ background: `linear-gradient(to right, transparent, ${template.accentColor}, transparent)` }} />
        </div>

        {/* Card Info */}
        <div className="px-3 py-2.5 border-t"
             style={{ background: '#111827', borderColor: `${template.accentColor}20` }}>
          <h3 className="font-semibold text-white text-sm truncate">{template.title}</h3>
          <p className="text-xs mt-0.5" style={{ color: template.accentColor + 'aa' }}>{template.occasion}</p>
        </div>
      </div>
    </Link>
  )
}

function getCardBg(template: Template): string {
  const c = template.bgColor
  const a = template.accentColor
  const dark = darken(c, 30)
  return `radial-gradient(ellipse at top right, ${a}22 0%, transparent 60%), linear-gradient(135deg, ${c} 0%, ${dark} 100%)`
}

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, (num >> 16) - amount)
  const g = Math.max(0, ((num >> 8) & 0xff) - amount)
  const b = Math.max(0, (num & 0xff) - amount)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

function PatternSVG({ pattern, color }: { pattern: Template['pattern']; color: string }) {
  const opacity = '0.08'
  if (pattern === 'crescent' || pattern === 'stars') {
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
        {pattern === 'crescent' && (
          <>
            <text x="150" y="60" fontSize="50" fill={color} opacity={opacity} textAnchor="middle">☽</text>
            <text x="30" y="170" fontSize="30" fill={color} opacity={opacity} textAnchor="middle">☽</text>
          </>
        )}
        <text x="20" y="30" fontSize="18" fill={color} opacity={opacity}>★</text>
        <text x="170" y="50" fontSize="12" fill={color} opacity={opacity}>★</text>
        <text x="10" y="120" fontSize="14" fill={color} opacity={opacity}>★</text>
        <text x="160" y="150" fontSize="20" fill={color} opacity={opacity}>★</text>
        <text x="80" y="20" fontSize="10" fill={color} opacity={opacity}>✦</text>
        <text x="140" y="180" fontSize="14" fill={color} opacity={opacity}>✦</text>
        <text x="50" y="185" fontSize="10" fill={color} opacity={opacity}>★</text>
      </svg>
    )
  }
  if (pattern === 'cross') {
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
        <text x="160" y="55" fontSize="40" fill={color} opacity={opacity} textAnchor="middle">✝</text>
        <text x="35" y="170" fontSize="25" fill={color} opacity={opacity} textAnchor="middle">✝</text>
        <text x="20" y="40" fontSize="14" fill={color} opacity={opacity}>✦</text>
        <text x="170" y="170" fontSize="14" fill={color} opacity={opacity}>✦</text>
      </svg>
    )
  }
  if (pattern === 'flowers') {
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
        <text x="160" y="55" fontSize="40" fill={color} opacity={opacity} textAnchor="middle">❀</text>
        <text x="35" y="170" fontSize="30" fill={color} opacity={opacity} textAnchor="middle">✿</text>
        <text x="20" y="35" fontSize="16" fill={color} opacity={opacity}>✿</text>
        <text x="165" y="170" fontSize="18" fill={color} opacity={opacity}>❀</text>
      </svg>
    )
  }
  return null
}
