'use client'

import Link from 'next/link'
import { Template } from '@/data/templates'

interface Props {
  template: Template
}

export default function TemplateCard({ template }: Props) {
  return (
    <Link href={`/create/${template.id}`}>
      <div className="group cursor-pointer rounded-2xl overflow-hidden card-glow transition-all duration-300 hover:scale-105 hover:-translate-y-1">
        {/* Card Visual */}
        <div className={`relative h-48 bg-gradient-to-br ${template.gradient} flex flex-col items-center justify-center p-4 overflow-hidden`}>
          {/* Background Pattern */}
          <PatternOverlay pattern={template.pattern} />

          {/* Emoji */}
          <span className="text-5xl mb-2 relative z-10 drop-shadow-lg">{template.emoji}</span>

          {/* Arabic / Main text */}
          {template.arabic && (
            <p className="arabic-text text-lg font-bold text-center relative z-10 drop-shadow"
               style={{ color: template.accentColor, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              {template.arabic}
            </p>
          )}
          <p className="text-sm font-semibold text-center relative z-10 mt-1"
             style={{ color: template.textColor, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
            {template.english}
          </p>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center z-20">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-gray-900 font-bold px-4 py-2 rounded-full text-sm shadow-xl">
              + Add Your Name
            </span>
          </div>
        </div>

        {/* Card Info */}
        <div className="bg-gray-900 px-4 py-3 border-t border-gray-700/50">
          <h3 className="font-semibold text-white text-sm">{template.title}</h3>
          <p className="text-gray-400 text-xs mt-0.5">{template.occasion}</p>
        </div>
      </div>
    </Link>
  )
}

function PatternOverlay({ pattern }: { pattern: Template['pattern'] }) {
  if (pattern === 'crescent') {
    return (
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-2 right-4 text-7xl">☽</div>
        <div className="absolute bottom-2 left-4 text-4xl">★</div>
        <div className="absolute top-1/2 left-2 text-3xl">★</div>
        <div className="absolute top-3 left-1/3 text-5xl">✦</div>
      </div>
    )
  }
  if (pattern === 'stars') {
    return (
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        {['top-2 left-4', 'top-4 right-8', 'bottom-4 left-6', 'bottom-2 right-4', 'top-1/2 right-2', 'top-1/3 left-1/2'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} text-2xl`}>★</div>
        ))}
      </div>
    )
  }
  if (pattern === 'cross') {
    return (
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute top-2 right-4 text-6xl">✝</div>
        <div className="absolute bottom-3 left-3 text-3xl">✦</div>
      </div>
    )
  }
  if (pattern === 'flowers') {
    return (
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute top-2 right-4 text-5xl">❀</div>
        <div className="absolute bottom-3 left-3 text-4xl">❀</div>
        <div className="absolute top-1/2 left-1/4 text-3xl">✿</div>
      </div>
    )
  }
  return null
}
