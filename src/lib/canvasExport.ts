export interface CardConfig {
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
}

export async function generateCardCanvas(config: CardConfig): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1080
  const ctx = canvas.getContext('2d')!

  // Background gradient
  const grd = ctx.createLinearGradient(0, 0, 1080, 1080)
  grd.addColorStop(0, config.bgColor)
  grd.addColorStop(1, darkenColor(config.bgColor, 40))
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, 1080, 1080)

  // Decorative pattern
  drawPattern(ctx, config.pattern, config.accentColor)

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
    ctx.font = 'bold 50px Arial'
    ctx.fillStyle = config.textColor
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0,0,0,0.4)'
    ctx.shadowBlur = 8
    ctx.fillText(config.english, 540, config.arabic ? 560 : 500)
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
    // Emoji at top
    ctx.font = '180px serif'
    ctx.textAlign = 'center'
    ctx.fillText(config.emoji, 540, 300)

    // Arabic greeting
    if (config.arabic) {
      ctx.font = 'bold 72px serif'
      ctx.fillStyle = config.accentColor
      ctx.textAlign = 'center'
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 10
      ctx.fillText(config.arabic, 540, 420)
      ctx.shadowBlur = 0
    }

    // English greeting
    ctx.font = 'bold 52px Arial'
    ctx.fillStyle = config.textColor
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0,0,0,0.4)'
    ctx.shadowBlur = 8
    ctx.fillText(config.english, 540, config.arabic ? 500 : 440)
    ctx.shadowBlur = 0

    // Divider
    ctx.strokeStyle = config.accentColor
    ctx.lineWidth = 3
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.moveTo(200, 580)
    ctx.lineTo(880, 580)
    ctx.stroke()
    ctx.globalAlpha = 1

    // "With warm wishes from"
    ctx.font = '36px Arial'
    ctx.fillStyle = config.textColor
    ctx.globalAlpha = 0.7
    ctx.textAlign = 'center'
    ctx.fillText('With warm wishes from', 540, 650)
    ctx.globalAlpha = 1

    // Name
    const nameFontSize = Math.min(config.nameSize, calcNameFontSize(config.name))
    ctx.font = `bold ${nameFontSize}px Arial`
    ctx.fillStyle = config.accentColor
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0,0,0,0.6)'
    ctx.shadowBlur = 15
    ctx.fillText(config.name || 'Your Name', 540, 760)
    ctx.shadowBlur = 0

    // Urdu
    if (config.urdu) {
      ctx.font = '38px serif'
      ctx.fillStyle = config.textColor
      ctx.globalAlpha = 0.7
      ctx.textAlign = 'center'
      ctx.fillText(config.urdu, 540, 840)
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
