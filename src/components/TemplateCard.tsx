'use client'

import Link from 'next/link'
import { Template } from '@/data/templates'
import { useState } from 'react'

interface Props {
  template: Template
}

export default function TemplateCard({ template }: Props) {
  const [imgError, setImgError] = useState(false)

  return (
    <Link href={`/create/${template.id}`}>
      <div className="group cursor-pointer rounded-2xl overflow-hidden card-glow transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg">
        {/* Card Visual */}
        <div className="relative h-52 overflow-hidden">
          {/* Background Image */}
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={template.bgImage}
              alt={template.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${template.gradient}`} />
          )}

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all duration-300" />

          {/* Pattern overlay */}
          <PatternOverlay pattern={template.pattern} />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 z-10">
            <span className="text-4xl mb-1 drop-shadow-lg">{template.emoji}</span>
            {template.arabic && (
              <p
                className="arabic-text text-base font-bold text-center drop-shadow-lg mb-0.5"
                style={{ color: template.accentColor, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
              >
                {template.arabic}
              </p>
            )}
            <p
              className="text-xs font-semibold text-center drop-shadow-lg"
              style={{ color: '#ffffff', textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}
            >
              {template.english}
            </p>
          </div>

          {/* Hover CTA */}
          <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-white/95 text-gray-900 font-bold px-4 py-2 rounded-full text-sm shadow-xl">
              + Add Your Name
            </span>
          </div>
        </div>

        {/* Card Info */}
        <div className="bg-gray-900 px-3 py-2.5 border-t border-gray-700/50">
          <h3 className="font-semibold text-white text-sm truncate">{template.title}</h3>
          <p className="text-gray-400 text-xs mt-0.5">{template.occasion}</p>
        </div>
      </div>
    </Link>
  )
}

function PatternOverlay({ pattern }: { pattern: Template['pattern'] }) {
  if (pattern === 'crescent') {
    return (
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-2 right-3 text-5xl">☽</div>
        <div className="absolute bottom-8 left-3 text-2xl">★</div>
        <div className="absolute top-1/2 left-2 text-xl">★</div>
      </div>
    )
  }
  if (pattern === 'stars') {
    return (
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        {['top-2 left-3', 'top-3 right-6', 'bottom-8 left-4', 'bottom-6 right-3', 'top-1/2 right-2'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} text-xl`}>★</div>
        ))}
      </div>
    )
  }
  if (pattern === 'cross') {
    return (
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        <div className="absolute top-2 right-3 text-4xl">✝</div>
        <div className="absolute bottom-8 left-3 text-2xl">✦</div>
      </div>
    )
  }
  if (pattern === 'flowers') {
    return (
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        <div className="absolute top-2 right-3 text-4xl">❀</div>
        <div className="absolute bottom-8 left-3 text-3xl">❀</div>
      </div>
    )
  }
  return null
}
