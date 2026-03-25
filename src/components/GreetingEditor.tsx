'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Template } from '@/data/templates'
import { generateCardCanvas, downloadCanvas } from '@/lib/canvasExport'
import Link from 'next/link'
import { useLocale } from '@/context/LocaleContext'

interface Props {
  template: Template
}

const NAME_COLORS = [
  { label: 'Gold',   value: '#fbbf24' },
  { label: 'White',  value: '#ffffff' },
  { label: 'Silver', value: '#e2e8f0' },
  { label: 'Sky',    value: '#7dd3fc' },
  { label: 'Rose',   value: '#fda4af' },
  { label: 'Lime',   value: '#a3e635' },
]

export default function GreetingEditor({ template }: Props) {
  const { t } = useLocale()
  const [name,           setName]           = useState('')
  const [nameColor,      setNameColor]      = useState('#fbbf24')
  const [nameSize,       setNameSize]       = useState(90)
  const [bgStyle,        setBgStyle]        = useState<'photo' | 'custom' | 'gradient'>('photo')
  const [customBg,       setCustomBg]       = useState<string | null>(null)
  const [customMessage,  setCustomMessage]  = useState('')
  const [fontFamily,     setFontFamily]     = useState('Arial')
  const [overlayOpacity, setOverlayOpacity] = useState(60)
  const [cardSize,       setCardSize]       = useState<'1:1' | '9:16'>('1:1')
  const [previewUrl,     setPreviewUrl]     = useState<string | null>(null)
  const [isGenerating,   setIsGenerating]   = useState(false)
  const [downloaded,     setDownloaded]     = useState(false)
  const [photo,          setPhoto]          = useState<string | null>(null)
  const [aiMessage,      setAiMessage]      = useState('')
  const [isAiLoading,    setIsAiLoading]    = useState(false)
  const [aiCopied,       setAiCopied]       = useState(false)
  const canvasRef   = useRef<HTMLCanvasElement | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhoto(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const generate = useCallback(async () => {
    setIsGenerating(true)
    try {
      const canvas = await generateCardCanvas({
        id: template.id,
        name: name || t('your_name'),
        nameSize, nameColor,
        bgColor: template.bgColor,
        accentColor: nameColor,
        textColor: template.textColor,
        emoji: template.emoji,
        arabic: template.arabic,
        urdu: template.urdu,
        english: template.english,
        pattern: template.pattern,
        title: template.title,
        photo, bgStyle, customBg, customMessage, fontFamily, overlayOpacity, cardSize,
      })
      canvasRef.current = canvas
      setPreviewUrl(canvas.toDataURL('image/png', 0.8))
    } finally {
      setIsGenerating(false)
    }
  }, [name, nameSize, nameColor, bgStyle, customBg, customMessage, fontFamily, overlayOpacity, cardSize, template, photo, t])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(generate, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [generate])

  const handleDownload = () => {
    if (!canvasRef.current) return
    downloadCanvas(canvasRef.current, `greetify-${template.id}-${name || 'card'}.png`)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 3000)
  }

  const handleGenerateAI = async () => {
    if (!name) return
    setIsAiLoading(true)
    setAiMessage('')
    try {
      const res = await fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, occasion: template.occasion, category: template.category }),
      })
      const data = await res.json()
      if (data.message) setAiMessage(data.message)
    } finally {
      setIsAiLoading(false)
    }
  }

  const handleCopyAI = () => {
    if (!aiMessage) return
    navigator.clipboard.writeText(aiMessage)
    setAiCopied(true)
    setTimeout(() => setAiCopied(false), 2000)
  }

  const handleWhatsApp = () => {
    if (!canvasRef.current) return
    handleDownload()
    setTimeout(() => {
      window.open('https://wa.me/?text=' + encodeURIComponent(
        `${template.english}!\n\nSent with love from ${name || 'me'} 🌙\n\nCreate yours at Greetify`
      ), '_blank')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Nav */}
      <nav className="flex items-center gap-3 px-4 py-4 border-b border-gray-800">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">{t('back')}</Link>
        <div className="w-px h-5 bg-gray-700" />
        <span className="text-white font-semibold">{template.title}</span>
        <span className="ml-auto text-2xl">{template.emoji}</span>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8">
        {/* Preview */}
        <div className="flex-1">
          <h2 className="text-gray-400 text-sm font-medium mb-3 uppercase tracking-wide">{t('preview')}</h2>
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
              {downloaded ? t('downloaded') : t('download')}
            </button>
            <button onClick={handleWhatsApp} disabled={isGenerating}
              className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
              {t('wa')}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:w-80 space-y-4">
          <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wide">{t('customize')}</h2>

          {/* Background */}
          <div className="bg-gray-900 rounded-2xl p-5 space-y-3">
            <p className="text-white font-medium text-sm">{t('bg_label')}</p>
            <div className="flex gap-2">
              {(['photo', 'custom', 'gradient'] as const).map((s) => (
                <button key={s} onClick={() => setBgStyle(s)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${bgStyle === s ? 'bg-amber-500 text-gray-900' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {t(`bg_${s === 'photo' ? 'photo' : s === 'custom' ? 'upload' : 'gradient'}`)}
                </button>
              ))}
            </div>

            {bgStyle !== 'gradient' && (
              <div>
                <label className="block text-white font-medium mb-1 text-sm">
                  {t('overlay', { n: overlayOpacity })}
                </label>
                <input type="range" min={10} max={90} value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                  className="w-full accent-amber-500" />
              </div>
            )}

            {bgStyle === 'custom' && (
              customBg ? (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={customBg} alt="bg" className="w-14 h-14 rounded-lg object-cover border border-amber-500" />
                  <button onClick={() => setCustomBg(null)} className="text-xs text-red-400">{t('remove_bg')}</button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 bg-gray-800 border border-dashed border-amber-500 rounded-xl py-3 cursor-pointer text-sm text-amber-400">
                  {t('upload_bg')}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]; if (!file) return
                      const r = new FileReader()
                      r.onload = (ev) => setCustomBg(ev.target?.result as string)
                      r.readAsDataURL(file)
                    }} />
                </label>
              )
            )}
          </div>

          {/* Name & Photo */}
          <div className="bg-gray-900 rounded-2xl p-5 space-y-4">
            <div>
              <label className="block text-white font-medium mb-2 text-sm">{t('your_name')}</label>
              <input type="text" placeholder={t('name_ph')} value={name}
                onChange={(e) => setName(e.target.value)} maxLength={40}
                className="w-full bg-gray-800 border border-gray-700 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none text-base" />
              <p className="text-gray-600 text-xs mt-1">{name.length}/40 {t('chars')}</p>
            </div>

            <div>
              <label className="block text-white font-medium mb-2 text-sm">{t('name_color')}</label>
              <div className="flex gap-2 flex-wrap">
                {NAME_COLORS.map((c) => (
                  <button key={c.value} onClick={() => setNameColor(c.value)} title={c.label}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${nameColor === c.value ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                    style={{ backgroundColor: c.value }} />
                ))}
                <label className="w-9 h-9 rounded-full border-2 border-gray-600 cursor-pointer flex items-center justify-center text-gray-400 overflow-hidden">
                  <span className="text-xs">+</span>
                  <input type="color" value={nameColor} onChange={(e) => setNameColor(e.target.value)} className="opacity-0 absolute w-1 h-1" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2 text-sm">
                {t('your_photo')} <span className="text-gray-500 font-normal">{t('optional')}</span>
              </label>
              <div className="flex items-center gap-3">
                {photo ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo} alt="preview" className="w-12 h-12 rounded-full object-cover border-2 border-amber-500" />
                    <button onClick={() => setPhoto(null)} className="text-xs text-red-400">{t('remove_photo')}</button>
                  </>
                ) : (
                  <label className="flex-1 flex items-center justify-center gap-2 bg-gray-800 border border-dashed border-gray-600 hover:border-amber-500 rounded-xl py-3 cursor-pointer text-sm text-gray-400 hover:text-white">
                    {t('upload_photo')}
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2 text-sm">
                {t('name_size', { n: nameSize })}
              </label>
              <input type="range" min={40} max={130} value={nameSize}
                onChange={(e) => setNameSize(Number(e.target.value))}
                className="w-full accent-amber-500" />
            </div>

            <div>
              <label className="block text-white font-medium mb-2 text-sm">{t('font_label')}</label>
              <div className="grid grid-cols-2 gap-2">
                {['Arial', 'Georgia', 'Trebuchet MS', 'Impact'].map((f) => (
                  <button key={f} onClick={() => setFontFamily(f)} style={{ fontFamily: f }}
                    className={`py-2 rounded-xl text-sm transition-all border ${fontFamily === f ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-gray-700 bg-gray-800 text-gray-300'}`}>
                    {f === 'Trebuchet MS' ? 'Trebuchet' : f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2 text-sm">{t('card_size')}</label>
              <div className="flex gap-2">
                {(['1:1', '9:16'] as const).map((s) => (
                  <button key={s} onClick={() => setCardSize(s)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${cardSize === s ? 'bg-amber-500 text-gray-900' : 'bg-gray-800 text-gray-400'}`}>
                    {s === '1:1' ? '■ 1:1 Instagram' : '▬ 9:16 Story'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2 text-sm">
                {t('custom_msg')} <span className="text-gray-500 font-normal">{t('msg_opt')}</span>
              </label>
              <textarea placeholder={t('msg_ph')} value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)} maxLength={120} rows={3}
                className="w-full bg-gray-800 border border-gray-700 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none text-sm resize-none" />
              <p className="text-gray-600 text-xs mt-1">{customMessage.length}/120</p>
            </div>
          </div>

          {/* Card Details */}
          <div className="bg-gray-900 rounded-2xl p-5">
            <h3 className="text-white font-medium mb-3 text-sm">{t('card_details')}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{t('occasion')}</span>
                <span className="text-gray-300">{template.occasion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t('category')}</span>
                <span className="text-gray-300 capitalize">{template.category}</span>
              </div>
              {template.arabic && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Arabic</span>
                  <span className="text-gray-300 arabic-text">{template.arabic}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-800 text-xs text-gray-600">
                {cardSize === '9:16' ? '1080×1920px (Story/Reels)' : '1080×1080px (Instagram/WhatsApp)'}
              </div>
            </div>
          </div>

          {/* AI */}
          <div className="bg-gray-900 rounded-2xl p-5 space-y-3">
            <h3 className="text-white font-medium text-sm">{t('ai_title')}</h3>
            <p className="text-gray-500 text-xs">{t('ai_hint')}</p>
            <button onClick={handleGenerateAI} disabled={!name || isAiLoading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
              {isAiLoading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{t('ai_loading')}</>
              ) : t('ai_btn')}
            </button>
            {aiMessage && (
              <div className="bg-gray-800 rounded-xl p-3 space-y-2">
                <p className="text-gray-200 text-sm leading-relaxed">{aiMessage}</p>
                <button onClick={handleCopyAI} className="text-xs text-purple-400 hover:text-purple-300">
                  {aiCopied ? t('ai_copied') : t('ai_copy')}
                </button>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-gray-900/50 rounded-2xl p-4 border border-gray-800">
            <p className="text-amber-400 text-xs font-medium mb-1">{t('tips')}</p>
            <ul className="text-gray-500 text-xs space-y-1">
              <li>• {t('tip1')}</li>
              <li>• {t('tip2')}</li>
              <li>• {t('tip3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
