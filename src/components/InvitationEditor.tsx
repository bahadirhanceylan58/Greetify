'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { InvitationTemplate } from '@/data/invitationTemplates'
import { generateInvitationCanvas, downloadInvitationCanvas } from '@/lib/invitationCanvas'
import { useLocale } from '@/context/LocaleContext'

interface Props {
  template: InvitationTemplate
}

const ACCENT_COLORS = [
  { label: 'Gold',     value: '#fbbf24' },
  { label: 'Rose',     value: '#f9a8d4' },
  { label: 'Lavender', value: '#c4b5fd' },
  { label: 'Sky',      value: '#7dd3fc' },
  { label: 'Mint',     value: '#6ee7b7' },
  { label: 'White',    value: '#ffffff' },
]

export default function InvitationEditor({ template }: Props) {
  const { t } = useLocale()
  const [hostName,       setHostName]       = useState('')
  const [eventDate,      setEventDate]      = useState('')
  const [eventTime,      setEventTime]      = useState('')
  const [venue,          setVenue]          = useState('')
  const [address,        setAddress]        = useState('')
  const [message,        setMessage]        = useState('')
  const [fontFamily,     setFontFamily]     = useState('Georgia')
  const [accentColor,    setAccentColor]    = useState(template.accentColor)
  const [overlayOpacity, setOverlayOpacity] = useState(65)
  const [cardSize,       setCardSize]       = useState<'1:1' | '9:16'>('1:1')
  const [bgStyle,        setBgStyle]        = useState<'photo' | 'custom' | 'gradient'>('photo')
  const [customBg,       setCustomBg]       = useState<string | null>(null)
  const [previewUrl,     setPreviewUrl]     = useState<string | null>(null)
  const [isGenerating,   setIsGenerating]   = useState(false)
  const [downloaded,     setDownloaded]     = useState(false)
  const canvasRef   = useRef<HTMLCanvasElement | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const generate = useCallback(async () => {
    setIsGenerating(true)
    try {
      const canvas = await generateInvitationCanvas({
        template, hostName: hostName || t('inv_name_ph'),
        eventDate, eventTime, venue, address, message,
        fontFamily, accentColor, overlayOpacity, cardSize, bgStyle, customBg,
      })
      canvasRef.current = canvas
      setPreviewUrl(canvas.toDataURL('image/png', 0.8))
    } finally {
      setIsGenerating(false)
    }
  }, [template, hostName, eventDate, eventTime, venue, address, message, fontFamily, accentColor, overlayOpacity, cardSize, bgStyle, customBg, t])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(generate, 350)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [generate])

  const handleDownload = () => {
    if (!canvasRef.current) return
    downloadInvitationCanvas(canvasRef.current, hostName || 'davet')
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 3000)
  }

  const handleWhatsApp = () => {
    handleDownload()
    setTimeout(() => {
      window.open('https://wa.me/?text=' + encodeURIComponent(
        `${template.headerText}\n\n${hostName || ''}\n📅 ${eventDate} ${eventTime}\n📍 ${venue}\n\nGreetify ile oluşturuldu`
      ), '_blank')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="flex items-center gap-3 px-4 py-4 border-b border-gray-800">
        <Link href="/invite" className="text-gray-400 hover:text-white transition-colors">{t('inv_nav_back')}</Link>
        <div className="w-px h-5 bg-gray-700" />
        <span className="text-white font-semibold">{template.title}</span>
        <span className="ml-auto text-2xl">{template.emoji}</span>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8">
        {/* Preview */}
        <div className="flex-1">
          <h2 className="text-gray-400 text-sm font-medium mb-3 uppercase tracking-wide">{t('inv_preview')}</h2>
          <div className={`relative rounded-2xl overflow-hidden bg-gray-900 shadow-2xl ${cardSize === '9:16' ? 'aspect-[9/16]' : 'aspect-square'}`}>
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="preview"
                className={`w-full h-full object-cover transition-opacity duration-300 ${isGenerating ? 'opacity-50' : 'opacity-100'}`} />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${template.gradient} flex items-center justify-center`}>
                <span className="text-8xl">{template.emoji}</span>
              </div>
            )}
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={handleDownload} disabled={isGenerating}
              className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-900 font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20">
              {downloaded ? t('inv_downloaded') : t('inv_download')}
            </button>
            <button onClick={handleWhatsApp} disabled={isGenerating}
              className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
              {t('inv_wa')}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:w-80 space-y-4">
          <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wide">{t('inv_customize')}</h2>

          {/* Event Info */}
          <div className="bg-gray-900 rounded-2xl p-5 space-y-4">
            <p className="text-white font-medium text-sm">{t('inv_event')}</p>

            <div>
              <label className="text-gray-400 text-xs mb-1 block">{t('inv_name')}</label>
              <input type="text" placeholder={t('inv_name_ph')} value={hostName}
                onChange={(e) => setHostName(e.target.value)} maxLength={50}
                className="w-full bg-gray-800 border border-gray-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">{t('inv_date')}</label>
                <input type="date" value={eventDate}
                  onChange={(e) => {
                    const d = new Date(e.target.value)
                    setEventDate(d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' }))
                  }}
                  className="w-full bg-gray-800 border border-gray-700 focus:border-amber-500 rounded-xl px-3 py-2.5 text-white outline-none text-xs" />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">{t('inv_time')}</label>
                <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 focus:border-amber-500 rounded-xl px-3 py-2.5 text-white outline-none text-xs" />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1 block">{t('inv_venue')}</label>
              <input type="text" placeholder={t('inv_venue_ph')} value={venue}
                onChange={(e) => setVenue(e.target.value)} maxLength={60}
                className="w-full bg-gray-800 border border-gray-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none text-sm" />
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1 block">{t('inv_address')}</label>
              <input type="text" placeholder={t('inv_address_ph')} value={address}
                onChange={(e) => setAddress(e.target.value)} maxLength={80}
                className="w-full bg-gray-800 border border-gray-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none text-sm" />
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1 block">{t('inv_note')}</label>
              <textarea placeholder={t('inv_note_ph')} value={message}
                onChange={(e) => setMessage(e.target.value)} maxLength={100} rows={2}
                className="w-full bg-gray-800 border border-gray-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none text-sm resize-none" />
            </div>
          </div>

          {/* Design */}
          <div className="bg-gray-900 rounded-2xl p-5 space-y-4">
            <p className="text-white font-medium text-sm">{t('inv_design')}</p>

            <div>
              <label className="text-gray-400 text-xs mb-2 block">{t('inv_accent')}</label>
              <div className="flex gap-2 flex-wrap">
                {ACCENT_COLORS.map((c) => (
                  <button key={c.value} onClick={() => setAccentColor(c.value)} title={c.label}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${accentColor === c.value ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c.value }} />
                ))}
                <label className="w-8 h-8 rounded-full border-2 border-gray-600 cursor-pointer flex items-center justify-center text-gray-400 overflow-hidden">
                  <span className="text-xs">+</span>
                  <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="opacity-0 absolute w-1 h-1" />
                </label>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-2 block">{t('inv_font')}</label>
              <div className="grid grid-cols-2 gap-2">
                {['Georgia', 'Arial', 'Trebuchet MS', 'Impact'].map((f) => (
                  <button key={f} onClick={() => setFontFamily(f)} style={{ fontFamily: f }}
                    className={`py-2 rounded-xl text-sm transition-all border ${fontFamily === f ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-gray-700 bg-gray-800 text-gray-300'}`}>
                    {f === 'Trebuchet MS' ? 'Trebuchet' : f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-2 block">{t('inv_card_size')}</label>
              <div className="flex gap-2">
                {(['1:1', '9:16'] as const).map((s) => (
                  <button key={s} onClick={() => setCardSize(s)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${cardSize === s ? 'bg-amber-500 text-gray-900' : 'bg-gray-800 text-gray-400'}`}>
                    {s === '1:1' ? '■ 1:1' : '▬ 9:16 Story'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-2 block">{t('inv_bg')}</label>
              <div className="flex gap-2 mb-2">
                {(['photo', 'custom', 'gradient'] as const).map((s) => (
                  <button key={s} onClick={() => setBgStyle(s)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${bgStyle === s ? 'bg-amber-500 text-gray-900' : 'bg-gray-800 text-gray-400'}`}>
                    {s === 'photo' ? '📸' : s === 'custom' ? '🖼️' : '🎨'}
                  </button>
                ))}
              </div>
              {bgStyle === 'custom' && (
                customBg ? (
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={customBg} alt="bg" className="w-12 h-12 rounded-lg object-cover border border-amber-500" />
                    <button onClick={() => setCustomBg(null)} className="text-xs text-red-400">{t('inv_remove_bg')}</button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 bg-gray-800 border border-dashed border-amber-500 rounded-xl py-2.5 cursor-pointer text-xs text-amber-400">
                    {t('inv_upload_bg')}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0]; if (!f) return
                        const r = new FileReader()
                        r.onload = (ev) => setCustomBg(ev.target?.result as string)
                        r.readAsDataURL(f)
                      }} />
                  </label>
                )
              )}
              {bgStyle !== 'gradient' && (
                <div className="mt-2">
                  <label className="text-gray-400 text-xs mb-1 block">
                    {t('inv_overlay', { n: overlayOpacity })}
                  </label>
                  <input type="range" min={10} max={90} value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                    className="w-full accent-amber-500" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
