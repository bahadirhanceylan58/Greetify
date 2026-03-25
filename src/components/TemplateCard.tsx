'use client'

import Link from 'next/link'
import { Template } from '@/data/templates'
import { useState } from 'react'

interface Props {
  template: Template
}

// Curated reliable Unsplash photos per template id
const PHOTOS: Record<string, string> = {
  // Islamic
  'eid-ul-fitr':        'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=600&q=80',
  'eid-ul-adha':        'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=600&q=80',
  'ramadan-mubarak':    'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&w=600&q=80',
  'laylat-al-qadr':     'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&w=600&q=80',
  'mawlid-nabi':        'https://images.unsplash.com/photo-1519817914152-22d216bb9170?auto=format&fit=crop&w=600&q=80',
  'isra-miraj':         'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
  'jumma-mubarak':      'https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?auto=format&fit=crop&w=600&q=80',
  'islamic-new-year':   'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80',
  'ashura':             'https://images.unsplash.com/photo-1545459720-aac8509eb02d?auto=format&fit=crop&w=600&q=80',
  // Christian
  'christmas':          'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=600&q=80',
  'easter':             'https://images.unsplash.com/photo-1521334726092-b509a19597c5?auto=format&fit=crop&w=600&q=80',
  'good-friday':        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
  'new-year-blessing':  'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=600&q=80',
  // Turkish Milli
  'cumhuriyet-bayrami': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=600&q=80',
  'cocuk-bayrami':      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80',
  'zafer-bayrami':      'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=600&q=80',
  'genclik-bayrami':    'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80',
  // Turkish Dini
  'ramazan-bayrami':    'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=600&q=80',
  'kurban-bayrami':     'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=600&q=80',
  'mevlid-kandili':     'https://images.unsplash.com/photo-1519817914152-22d216bb9170?auto=format&fit=crop&w=600&q=80',
  'regaip-kandili':     'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&w=600&q=80',
  'mirac-kandili':      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
  'berat-kandili':      'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&w=600&q=80',
  'kadir-gecesi':       'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&w=600&q=80',
  // National
  'pakistan-independence': 'https://images.unsplash.com/photo-1542621334-a254cf47733d?auto=format&fit=crop&w=600&q=80',
  'india-independence':    'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=600&q=80',
  'bangladesh-victory':    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
}

export default function TemplateCard({ template }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const photoUrl = PHOTOS[template.id]

  return (
    <Link href={`/create/${template.id}`}>
      <div className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-1"
           style={{ boxShadow: `0 8px 32px rgba(0,0,0,0.4)` }}>

        {/* Card Visual */}
        <div className="relative h-52 overflow-hidden">

          {/* Gradient fallback (always rendered behind) */}
          <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient}`} />

          {/* Real photo */}
          {photoUrl && !error && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt={template.title}
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1"
               style={{ background: template.accentColor }} />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-3 z-10">
            {template.arabic && (
              <p className="arabic-text text-lg font-bold mb-0.5"
                 style={{ color: template.accentColor, textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
                {template.arabic}
              </p>
            )}
            <p className="text-white font-bold text-sm leading-tight"
               style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}>
              {template.english}
            </p>
          </div>

          {/* Hover CTA */}
          <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <span className="bg-white text-gray-900 font-bold px-5 py-2 rounded-full text-sm shadow-2xl">
              + İsim Ekle
            </span>
          </div>
        </div>

        {/* Card Info */}
        <div className="px-3 py-2.5 bg-gray-900 border-t"
             style={{ borderColor: `${template.accentColor}30` }}>
          <div className="flex items-center gap-1.5">
            <span className="text-base">{template.emoji}</span>
            <h3 className="font-semibold text-white text-sm truncate">{template.title}</h3>
          </div>
          <p className="text-xs mt-0.5 ml-6" style={{ color: template.accentColor + '99' }}>
            {template.occasion}
          </p>
        </div>
      </div>
    </Link>
  )
}
