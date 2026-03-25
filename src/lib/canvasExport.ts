export interface CardConfig {
  id: string
  name: string
  nameSize: number
  nameColor: string
  bgColor: string
  accentColor: string
  textColor: string
  emoji: string
  arabic?: string
  urdu?: string
  english: string
  pattern: string
  title: string
  photo?: string | null
  bgStyle: 'photo' | 'custom' | 'gradient'
  customBg?: string | null
  customMessage?: string
  fontFamily?: string
  overlayOpacity?: number   // 0–100, default 60
  cardSize?: '1:1' | '9:16'
}

// All photo IDs below are manually verified to show appropriate content
const MOSQUE   = 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1080&q=90' // Sheikh Zayed Grand Mosque
const MOSQUE2  = 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1080&q=90' // Sultanahmet / Blue Mosque Istanbul
const QURAN    = 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1080&q=90' // Quran book on dark blue
const NIGHT    = 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&w=1080&q=90' // Starry night sky
const MOON     = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1080&q=90' // Moon reflection on water
const XMAS     = 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1080&q=90' // Christmas pine on snow
const NEWYEAR  = 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=1080&q=90' // Sparkler / New Year

const BG_PHOTOS: Record<string, string> = {
  // Islamic
  'eid-ul-fitr':        MOSQUE,
  'eid-ul-adha':        MOSQUE,
  'ramadan-mubarak':    QURAN,
  'laylat-al-qadr':     NIGHT,
  'mawlid-nabi':        MOSQUE2,
  'isra-miraj':         NIGHT,
  'jumma-mubarak':      MOSQUE,
  'islamic-new-year':   MOON,
  'ashura':             NIGHT,
  // Christian / General
  'christmas':          XMAS,
  'easter':             XMAS,
  'good-friday':        XMAS,
  'new-year-blessing':  NEWYEAR,
  // Turkish Milli
  'cumhuriyet-bayrami': MOSQUE2,
  'cocuk-bayrami':      NEWYEAR,
  'zafer-bayrami':      MOSQUE2,
  'genclik-bayrami':    NIGHT,
  // Turkish Dini
  'ramazan-bayrami':    MOSQUE,
  'kurban-bayrami':     MOSQUE,
  'mevlid-kandili':     MOSQUE2,
  'regaip-kandili':     QURAN,
  'mirac-kandili':      NIGHT,
  'berat-kandili':      NIGHT,
  'kadir-gecesi':       NIGHT,
  // National
  'pakistan-independence': MOSQUE,
  'india-independence':    NEWYEAR,
  'bangladesh-victory':    NEWYEAR,
}

export async function generateCardCanvas(config: CardConfig): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas')
  const W = 1080
  const H = config.cardSize === '9:16' ? 1920 : 1080
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  const font = config.fontFamily || 'Arial'
  const opacity = (config.overlayOpacity ?? 60) / 100

  let bgLoaded = false
  if (config.bgStyle === 'custom' && config.customBg) {
    bgLoaded = await drawBgImage(ctx, config.customBg, W, H)
  } else if (config.bgStyle === 'photo') {
    const bgUrl = BG_PHOTOS[config.id]
    if (bgUrl) {
      bgLoaded = await drawBgImage(ctx, bgUrl, W, H)
    }
  }

  if (!bgLoaded) {
    const grd = ctx.createLinearGradient(0, 0, W, H)
    grd.addColorStop(0, config.bgColor)
    grd.addColorStop(1, darkenColor(config.bgColor, 40))
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, W, H)
    drawPattern(ctx, config.pattern, config.accentColor, W, H)
  } else {
    const o = opacity
    const overlay = ctx.createLinearGradient(0, 0, 0, H)
    overlay.addColorStop(0,   `rgba(0,0,0,${(o * 0.9).toFixed(2)})`)
    overlay.addColorStop(0.5, `rgba(0,0,0,${(o * 0.6).toFixed(2)})`)
    overlay.addColorStop(1,   `rgba(0,0,0,${Math.min(o * 1.25, 1).toFixed(2)})`)
    ctx.fillStyle = overlay
    ctx.fillRect(0, 0, W, H)
  }

  // Border frame
  ctx.strokeStyle = config.accentColor
  ctx.lineWidth = 8
  ctx.globalAlpha = 0.6
  ctx.strokeRect(40, 40, W - 80, H - 80)
  ctx.globalAlpha = 0.3
  ctx.strokeRect(60, 60, W - 120, H - 120)
  ctx.globalAlpha = 1

  // Scale factor for 9:16 — push elements down proportionally
  const yOff = H > 1080 ? Math.round((H - 1080) / 2) : 0

  if (config.photo) {
    // ── LAYOUT WITH PHOTO ──────────────────────────────
    await drawCircularPhoto(ctx, config.photo, 540, 270 + yOff, 150, config.accentColor)

    if (config.arabic) {
      ctx.fillStyle = config.accentColor
      ctx.textAlign = 'center'
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 10
      fillTextFit(ctx, config.arabic, 540, 480 + yOff, 900, 'bold 68px serif')
      ctx.shadowBlur = 0
    }

    ctx.fillStyle = config.textColor
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0,0,0,0.4)'
    ctx.shadowBlur = 8
    fillTextFit(ctx, config.english, 540, (config.arabic ? 560 : 500) + yOff, 900, `bold 50px ${font}`)
    ctx.shadowBlur = 0

    ctx.strokeStyle = config.accentColor
    ctx.lineWidth = 3
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.moveTo(200, 640 + yOff)
    ctx.lineTo(880, 640 + yOff)
    ctx.stroke()
    ctx.globalAlpha = 1

    const nameFontSize = Math.min(config.nameSize, calcNameFontSize(config.name))
    ctx.fillStyle = config.accentColor
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0,0,0,0.6)'
    ctx.shadowBlur = 15
    fillTextFit(ctx, config.name || 'Your Name', 540, 760 + yOff, 920, `bold ${nameFontSize}px ${font}`)
    ctx.shadowBlur = 0

    if (config.urdu) {
      ctx.font = '36px serif'
      ctx.fillStyle = config.textColor
      ctx.globalAlpha = 0.7
      ctx.textAlign = 'center'
      ctx.fillText(config.urdu, 540, 860 + yOff)
      ctx.globalAlpha = 1
    }

    if (config.customMessage) {
      ctx.fillStyle = config.textColor
      ctx.globalAlpha = 0.85
      ctx.textAlign = 'center'
      drawWrappedText(ctx, config.customMessage, 540, 940 + yOff, 880, `32px ${font}`, 44)
      ctx.globalAlpha = 1
    }

  } else {
    // ── LAYOUT WITHOUT PHOTO ───────────────────────────
    if (config.arabic) {
      ctx.fillStyle = config.accentColor
      ctx.textAlign = 'center'
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 12
      fillTextFit(ctx, config.arabic, 540, 360 + yOff, 920, 'bold 80px serif')
      ctx.shadowBlur = 0
    }

    ctx.fillStyle = config.textColor
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0,0,0,0.4)'
    ctx.shadowBlur = 8
    fillTextFit(ctx, config.english, 540, (config.arabic ? 460 : 400) + yOff, 920, `bold 56px ${font}`)
    ctx.shadowBlur = 0

    ctx.strokeStyle = config.accentColor
    ctx.lineWidth = 3
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.moveTo(200, 540 + yOff)
    ctx.lineTo(880, 540 + yOff)
    ctx.stroke()
    ctx.globalAlpha = 1

    const nameFontSize = Math.min(config.nameSize, calcNameFontSize(config.name))
    ctx.fillStyle = config.accentColor
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0,0,0,0.6)'
    ctx.shadowBlur = 15
    fillTextFit(ctx, config.name || 'Your Name', 540, 680 + yOff, 920, `bold ${nameFontSize}px ${font}`)
    ctx.shadowBlur = 0

    if (config.urdu) {
      ctx.font = '38px serif'
      ctx.fillStyle = config.textColor
      ctx.globalAlpha = 0.7
      ctx.textAlign = 'center'
      ctx.fillText(config.urdu, 540, 790 + yOff)
      ctx.globalAlpha = 1
    }

    if (config.customMessage) {
      ctx.fillStyle = config.textColor
      ctx.globalAlpha = 0.85
      ctx.textAlign = 'center'
      drawWrappedText(ctx, config.customMessage, 540, 880 + yOff, 880, `32px ${font}`, 44)
      ctx.globalAlpha = 1
    }
  }

  // Watermark
  ctx.font = `26px ${font}`
  ctx.fillStyle = config.accentColor
  ctx.globalAlpha = 0.4
  ctx.textAlign = 'center'
  ctx.fillText('Made with Greetify', 540, H - 30)
  ctx.globalAlpha = 1

  return canvas
}

async function drawBgImage(
  ctx: CanvasRenderingContext2D,
  src: string,
  w: number,
  h: number
): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h)
      resolve(true)
    }
    img.onerror = () => resolve(false)
    img.src = src
  })
}

async function drawCircularPhoto(
  ctx: CanvasRenderingContext2D,
  src: string,
  cx: number,
  cy: number,
  radius: number,
  borderColor: string
) {
  return new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = () => {
      ctx.save()
      // Outer glow rings
      ctx.globalAlpha = 0.25
      ctx.strokeStyle = borderColor
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.arc(cx, cy, radius + 18, 0, Math.PI * 2)
      ctx.stroke()
      ctx.globalAlpha = 0.6
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.arc(cx, cy, radius + 6, 0, Math.PI * 2)
      ctx.stroke()
      ctx.globalAlpha = 1

      // Clip circle and draw photo
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(img, cx - radius, cy - radius, radius * 2, radius * 2)
      ctx.restore()
      resolve()
    }
    img.onerror = () => resolve()
    img.src = src
  })
}

function calcNameFontSize(name: string): number {
  if (!name) return 90
  if (name.length <= 10) return 110
  if (name.length <= 20) return 85
  if (name.length <= 30) return 65
  return 50
}

// Draws text, auto-shrinking font until it fits within maxWidth
function fillTextFit(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontStyle: string // e.g. 'bold 56px Arial'
) {
  ctx.font = fontStyle
  const parts = fontStyle.split(' ')
  const familyIdx = parts.findIndex(p => !/^\d/.test(p) && p !== 'bold' && p !== 'italic')
  const family = parts.slice(familyIdx).join(' ')
  const isBold = fontStyle.includes('bold')

  // Extract initial size
  const sizeMatch = fontStyle.match(/(\d+)px/)
  if (!sizeMatch) { ctx.fillText(text, x, y, maxWidth); return }
  let size = parseInt(sizeMatch[1])

  while (size > 20) {
    ctx.font = `${isBold ? 'bold ' : ''}${size}px ${family}`
    if (ctx.measureText(text).width <= maxWidth) break
    size -= 2
  }
  ctx.fillText(text, x, y)
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontStyle: string,
  lineHeight: number
) {
  ctx.font = fontStyle
  const words = text.split(' ')
  let line = ''
  let curY = y
  for (const word of words) {
    const test = line ? line + ' ' + word : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, curY)
      line = word
      curY += lineHeight
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, curY)
}

function drawPattern(ctx: CanvasRenderingContext2D, pattern: string, color: string, W = 1080, H = 1080) {
  ctx.fillStyle = color
  ctx.globalAlpha = 0.06

  if (pattern === 'crescent' || pattern === 'stars') {
    const positions = [
      [100, 100], [980, 120], [50, 540], [1030, 500],
      [200, 950], [900, 970], [540, 80], [540, 1000],
      [150, 300], [930, 300], [150, 750], [930, 750],
    ]
    ctx.font = '60px serif'
    ctx.textAlign = 'center'
    positions.forEach(([x, y]) => ctx.fillText('★', x, y))
    if (pattern === 'crescent') {
      ctx.font = '120px serif'
      ctx.fillText('☽', 100, 200)
      ctx.fillText('☽', 980, 900)
    }
  }
  if (pattern === 'cross') {
    ctx.font = '80px serif'
    ctx.textAlign = 'center'
    ctx.fillText('✝', 100, 200)
    ctx.fillText('✝', 980, 900)
    ctx.fillText('✦', 980, 200)
    ctx.fillText('✦', 100, 900)
  }
  if (pattern === 'flowers') {
    ctx.font = '80px serif'
    ctx.textAlign = 'center'
    ctx.fillText('❀', 100, 200)
    ctx.fillText('❀', 980, 900)
    ctx.fillText('✿', 980, 200)
    ctx.fillText('✿', 100, 900)
  }
  ctx.globalAlpha = 1
}

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, (num >> 16) - amount)
  const g = Math.max(0, ((num >> 8) & 0xff) - amount)
  const b = Math.max(0, (num & 0xff) - amount)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png', 0.95)
  link.click()
}
