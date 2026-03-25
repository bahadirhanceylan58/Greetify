'use client'

import Link from 'next/link'
import { Template } from '@/data/templates'
import { useState } from 'react'
import { useLocale } from '@/context/LocaleContext'

interface Props {
  template: Template
}

const Q = '?auto=format&fit=crop&w=600&q=80'
const MOSQUE   = `https://images.unsplash.com/photo-1584551246679-0daf3d275d0f${Q}`
const MOSQUE2  = `https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b${Q}`
const QURAN    = `https://images.unsplash.com/photo-1542816417-0983c9c9ad53${Q}`
const NIGHT    = `https://images.unsplash.com/photo-1475274047050-1d0c0975c63e${Q}`
const MOON     = `https://images.unsplash.com/photo-1534447677768-be436bb09401${Q}`
const XMAS     = `https://images.unsplash.com/photo-1512389142860-9c449e58a543${Q}`
const NEWYEAR  = `https://images.unsplash.com/photo-1467810563316-b5476525c0f9${Q}`
// New religion photos
const DIWALI   = `https://images.unsplash.com/photo-1605538032404-d7d7c50a5a34${Q}` // Diwali diyas/lamps
const HOLI     = `https://images.unsplash.com/photo-1523050854058-8df90110c9f1${Q}` // Holi colors
const TEMPLE   = `https://images.unsplash.com/photo-1555952517-2e8e729e0b44${Q}` // Hindu temple
const MENORAH  = `https://images.unsplash.com/photo-1576532115-b0d2af4b6b88${Q}` // Hanukkah menorah

const PHOTOS: Record<string, string> = {
  'eid-ul-fitr':           MOSQUE,
  'eid-ul-adha':           MOSQUE,
  'ramadan-mubarak':       QURAN,
  'laylat-al-qadr':        NIGHT,
  'mawlid-nabi':           MOSQUE2,
  'isra-miraj':            NIGHT,
  'jumma-mubarak':         MOSQUE,
  'islamic-new-year':      MOON,
  'ashura':                NIGHT,
  'christmas':             XMAS,
  'easter':                XMAS,
  'good-friday':           XMAS,
  'new-year-blessing':     NEWYEAR,
  'cumhuriyet-bayrami':    MOSQUE2,
  'cocuk-bayrami':         NEWYEAR,
  'zafer-bayrami':         MOSQUE2,
  'genclik-bayrami':       NIGHT,
  'ramazan-bayrami':       MOSQUE,
  'kurban-bayrami':        MOSQUE,
  'mevlid-kandili':        MOSQUE2,
  'regaip-kandili':        QURAN,
  'mirac-kandili':         NIGHT,
  'berat-kandili':         NIGHT,
  'kadir-gecesi':          NIGHT,
  'pakistan-independence': MOSQUE,
  'india-independence':    NEWYEAR,
  'bangladesh-victory':    NEWYEAR,
  // Hindu
  'diwali':                DIWALI,
  'holi':                  HOLI,
  'navratri':              TEMPLE,
  'dussehra':              TEMPLE,
  'ganesh-chaturthi':      TEMPLE,
  'janmashtami':           NIGHT,
  // Jewish
  'hanukkah':              MENORAH,
  'rosh-hashanah':         NIGHT,
  'yom-kippur':            NIGHT,
  'passover':              NIGHT,
  'purim':                 NEWYEAR,
  // Buddhist
  'vesak':                 NIGHT,
  'losar':                 NIGHT,
  // Sikh
  'vaisakhi':              NEWYEAR,
  'guru-nanak-jayanti':    NIGHT,
  // Election
  'muhtar-adayi':          MOSQUE2,
  'bagimsiz-aday':         MOSQUE2,
  'meclis-uyesi':          MOSQUE2,
  'cumhurbaskanligi-aday': MOSQUE2,
  'genclik-adayi':         NIGHT,
  'kadin-adayi':           NIGHT,
  'hizmet-sloganı':        MOSQUE2,
  'mahalle-dernegi':       MOSQUE2,
}

export default function TemplateCard({ template }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const { t } = useLocale()
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
              {t('add_name')}
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
