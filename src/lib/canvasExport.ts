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
  canvas.width = 1080
  canvas.height = 1080
  const ctx = canvas.getContext('2d')!

  let bgLoaded = false
  if (config.bgStyle === 'custom' && config.customBg) {
    bgLoaded = await drawBgImage(ctx, config.customBg, 1080, 1080)
  } else if (config.bgStyle === 'photo') {
    const bgUrl = BG_PHOTOS[config.id]
    if (bgUrl) {
      bgLoaded = await drawBgImage(ctx, bgUrl, 1080, 1080)
    }
  }

  if (!bgLoaded) {
    // Gradient background
    const grd = ctx.createLinearGradient(0, 0, 1080, 1080)
    grd.addColorStop(0, config.bgColor)
    grd.addColorStop(1, darkenColor(config.bgColor, 40))
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, 1080, 1080)
    drawPattern(ctx, config.pattern, config.accentColor)
  } else {
    // Dark overlay on top of photo
    const overlay = ctx.createLinearGradient(0, 0, 0, 1080)
    overlay.addColorStop(0, 'rgba(0,0,0,0.55)')
    overlay.addColorStop(0.5, 'rgba(0,0,0,0.35)')
    overlay.addColorStop(1, 'rgba(0,0,0,0.75)')
    ctx.fillStyle = overlay
    ctx.fillRect(0, 0, 1080, 1080)
  }

  // Border frame
  ctx.strokeStyle = config.accentColor
  ctx.lineWidth = 8
  ctx.globalAlpha = 0.6
  ctx.strokeRect(40, 40, 1000, 1000)
  ctx.globalAlpha = 0.3
  ctx.strokeRect(60, 60, 960, 960)
  ctx.globalAlpha = 1

  if (config.photo) {
    // ── LAYOUT WITH PHOTO ──────────────────────────────
    // Photo at top center (where emoji was)
    await drawCircularPhoto(ctx, config.photo, 540, 270, 150, config.accentColor)

    // Arabic greeting
    if (config.arabic) {
      ctx.font = 'bold 68px serif'
      ctx.fillStyle = config.accentColor
      ctx.textAlign = 'center'
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 10
      ctx.fillText(config.arabic, 540, 480)
      ctx.shadowBlur = 0
    }

    // English greeting
    ctx.fillStyle = config.textColor
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0,0,0,0.4)'
    ctx.shadowBlur = 8
    fillTextFit(ctx, config.english, 540, config.arabic ? 560 : 500, 900, 'bold 50px Arial')
    ctx.shadowBlur = 0

    // Divider
    ctx.strokeStyle = config.accentColor
    ctx.lineWidth = 3
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.moveTo(200, 640)
    ctx.lineTo(880, 640)
    ctx.stroke()
    ctx.globalAlpha = 1

    // "With warm wishes from"
    ctx.font = '34px Arial'
    ctx.fillStyle = config.textColor
    ctx.globalAlpha = 0.7
    ctx.textAlign = 'center'
    ctx.fillText('With warm wishes from', 540, 710)
    ctx.globalAlpha = 1

    // Name
    const nameFontSize = Math.min(config.nameSize, calcNameFontSize(config.name))
    ctx.font = `bold ${nameFontSize}px Arial`
    ctx.fillStyle = config.accentColor
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0,0,0,0.6)'
    ctx.shadowBlur = 15
    ctx.fillText(config.name || 'Your Name', 540, 820)
    ctx.shadowBlur = 0

    // Urdu
    if (config.urdu) {
      ctx.font = '36px serif'
      ctx.fillStyle = config.textColor
      ctx.globalAlpha = 0.7
      ctx.textAlign = 'center'
      ctx.fillText(config.urdu, 540, 900)
      ctx.globalAlpha = 1
    }

  } else {
    // ── LAYOUT WITHOUT PHOTO ───────────────────────────
    // Arabic greeting
    if (config.arabic) {
      ctx.fillStyle = config.accentColor
      ctx.textAlign = 'center'
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 12
      fillTextFit(ctx, config.arabic, 540, 360, 920, 'bold 80px serif')
      ctx.shadowBlur = 0
    }

    // English greeting
    ctx.fillStyle = config.textColor
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0,0,0,0.4)'
    ctx.shadowBlur = 8
    fillTextFit(ctx, config.english, 540, config.arabic ? 460 : 400, 920, 'bold 56px Arial')
    ctx.shadowBlur = 0

    // Divider
    ctx.strokeStyle = config.accentColor
    ctx.lineWidth = 3
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.moveTo(200, 540)
    ctx.lineTo(880, 540)
    ctx.stroke()
    ctx.globalAlpha = 1

    // "With warm wishes from"
    ctx.font = '36px Arial'
    ctx.fillStyle = config.textColor
    ctx.globalAlpha = 0.7
    ctx.textAlign = 'center'
    ctx.fillText('With warm wishes from', 540, 620)
    ctx.globalAlpha = 1

    // Name
    const nameFontSize = Math.min(config.nameSize, calcNameFontSize(config.name))
    ctx.font = `bold ${nameFontSize}px Arial`
    ctx.fillStyle = config.accentColor
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0,0,0,0.6)'
    ctx.shadowBlur = 15
    ctx.fillText(config.name || 'Your Name', 540, 730)
    ctx.shadowBlur = 0

    // Urdu
    if (config.urdu) {
      ctx.font = '38px serif'
      ctx.fillStyle = config.textColor
      ctx.globalAlpha = 0.7
      ctx.textAlign = 'center'
      ctx.fillText(config.urdu, 540, 820)
      ctx.globalAlpha = 1
    }
  }

  // Watermark
  ctx.font = '28px Arial'
  ctx.fillStyle = config.accentColor
  ctx.globalAlpha = 0.4
  ctx.textAlign = 'center'
  ctx.fillText('Made with Greetify', 540, 990)
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

function drawPattern(ctx: CanvasRenderingContext2D, pattern: string, color: string) {
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
