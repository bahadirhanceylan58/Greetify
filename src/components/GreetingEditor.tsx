'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Template } from '@/data/templates'
import { generateCardCanvas, downloadCanvas } from '@/lib/canvasExport'
import Link from 'next/link'

interface Props {
  template: Template
}

const NAME_COLORS = [
  { label: 'Gold', value: '#fbbf24' },
  { label: 'White', value: '#ffffff' },
  { label: 'Silver', value: '#e2e8f0' },
  { label: 'Sky', value: '#7dd3fc' },
  { label: 'Rose', value: '#fda4af' },
  { label: 'Lime', value: '#a3e635' },
]

export default function GreetingEditor({ template }: Props) {
  const [name, setName] = useState('')
  const [nameColor, setNameColor] = useState('#fbbf24')
  const [nameSize, setNameSize] = useState(90)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)
  const [aiMessage, setAiMessage] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiCopied, setAiCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
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
        name: name || 'Your Name',
        nameSize,
        nameColor,
        bgColor: template.bgColor,
        accentColor: nameColor,
        textColor: template.textColor,
        emoji: template.emoji,
        arabic: template.arabic,
        urdu: template.urdu,
        english: template.english,
        pattern: template.pattern,
        title: template.title,
        photo,
      })
      canvasRef.current = canvas
      setPreviewUrl(canvas.toDataURL('image/png', 0.8))
    } finally {
      setIsGenerating(false)
    }
  }, [name, nameSize, nameColor, template, photo])

  // Debounced regeneration
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(generate, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [generate])

  const handleDownload = () => {
    if (!canvasRef.current) return
    const filename = `greetify-${template.id}-${name || 'card'}.png`
    downloadCanvas(canvasRef.current, filename)
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
    // First download, then open WhatsApp
    handleDownload()
    setTimeout(() => {
      window.open('https://wa.me/?text=' + encodeURIComponent(
        `${template.english}!\n\nSent with love from ${name || 'me'} 🌙\n\nCreate yours at Greetify`
      ), '_blank')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top Nav */}
      <nav className="flex items-center gap-3 px-4 py-4 border-b border-gray-800">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          ← Back
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <span className="text-white font-semibold">{template.title}</span>
        <span className="ml-auto text-2xl">{template.emoji}</span>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8">
        {/* Left: Preview */}
        <div className="flex-1">
          <h2 className="text-gray-400 text-sm font-medium mb-3 uppercase tracking-wide">Preview</h2>
          <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-square shadow-2xl">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Card preview"
                className={`w-full h-full object-cover transition-opacity duration-300 ${isGenerating ? 'opacity-50' : 'opacity-100'}`}
              />
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

          {/* Download buttons */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-900 font-bold py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {downloaded ? '✓ Downloaded!' : '⬇ Download PNG'}
            </button>
            <button
              onClick={handleWhatsApp}
              disabled={isGenerating}
              className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              📲 Share on WhatsApp
            </button>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="lg:w-80 space-y-6">
          <div>
            <h2 className="text-gray-400 text-sm font-medium mb-3 uppercase tracking-wide">Customize</h2>

            {/* Name Input */}
            <div className="bg-gray-900 rounded-2xl p-5 space-y-5">
              <div>
                <label className="block text-white font-medium mb-2 text-sm">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ahmed Ali, Sarah Khan..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                  className="w-full bg-gray-800 border border-gray-700 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors text-base"
                />
                <p className="text-gray-600 text-xs mt-1">{name.length}/40 characters</p>
              </div>

              {/* Name Color */}
              <div>
                <label className="block text-white font-medium mb-2 text-sm">
                  Name Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {NAME_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setNameColor(c.value)}
                      title={c.label}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        nameColor === c.value ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                  <label className="w-9 h-9 rounded-full border-2 border-gray-600 cursor-pointer flex items-center justify-center text-gray-400 hover:border-gray-400 overflow-hidden" title="Custom color">
                    <span className="text-xs">+</span>
                    <input
                      type="color"
                      value={nameColor}
                      onChange={(e) => setNameColor(e.target.value)}
                      className="opacity-0 absolute w-1 h-1"
                    />
                  </label>
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-white font-medium mb-2 text-sm">
                  Your Photo <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <div className="flex items-center gap-3">
                  {photo ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo} alt="preview" className="w-12 h-12 rounded-full object-cover border-2 border-amber-500" />
                      <button
                        onClick={() => setPhoto(null)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        ✕ Remove
                      </button>
                    </>
                  ) : (
                    <label className="flex-1 flex items-center justify-center gap-2 bg-gray-800 border border-dashed border-gray-600 hover:border-amber-500 rounded-xl py-3 cursor-pointer transition-colors text-sm text-gray-400 hover:text-white">
                      📷 Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Text Size */}
              <div>
                <label className="block text-white font-medium mb-2 text-sm">
                  Name Size: <span className="text-amber-400">{nameSize}px</span>
                </label>
                <input
                  type="range"
                  min={40}
                  max={130}
                  value={nameSize}
                  onChange={(e) => setNameSize(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Card Info */}
          <div className="bg-gray-900 rounded-2xl p-5">
            <h3 className="text-white font-medium mb-3 text-sm">Card Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Occasion</span>
                <span className="text-gray-300">{template.occasion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Category</span>
                <span className="text-gray-300 capitalize">{template.category}</span>
              </div>
              {template.arabic && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Arabic</span>
                  <span className="text-gray-300 arabic-text">{template.arabic}</span>
                </div>
              )}
              {template.urdu && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Urdu</span>
                  <span className="text-gray-300 urdu-text">{template.urdu}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-800 text-xs text-gray-600">
                Size: 1080×1080px (Instagram/WhatsApp ready)
              </div>
            </div>
          </div>

          {/* AI Message Generator */}
          <div className="bg-gray-900 rounded-2xl p-5 space-y-3">
            <h3 className="text-white font-medium text-sm flex items-center gap-2">
              ✨ AI Greeting Message
            </h3>
            <p className="text-gray-500 text-xs">Enter your name above, then generate a personalized message.</p>
            <button
              onClick={handleGenerateAI}
              disabled={!name || isAiLoading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              {isAiLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : '✨ Generate with AI'}
            </button>
            {aiMessage && (
              <div className="bg-gray-800 rounded-xl p-3 space-y-2">
                <p className="text-gray-200 text-sm leading-relaxed">{aiMessage}</p>
                <button
                  onClick={handleCopyAI}
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {aiCopied ? '✓ Copied!' : '📋 Copy message'}
                </button>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-gray-900/50 rounded-2xl p-4 border border-gray-800">
            <p className="text-amber-400 text-xs font-medium mb-1">💡 Pro Tips</p>
            <ul className="text-gray-500 text-xs space-y-1">
              <li>• Download then share directly to WhatsApp</li>
              <li>• Perfect for Instagram Stories (1:1 format)</li>
              <li>• Works in all languages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
