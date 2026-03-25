import { InvitationTemplate } from '@/data/invitationTemplates'

export interface InvitationConfig {
  template: InvitationTemplate
  hostName: string           // "Ahmet & Fatma"
  eventDate: string          // "15 Nisan 2026 Çarşamba"
  eventTime: string          // "19:00"
  venue: string              // "Hilton İstanbul"
  address?: string           // "Harbiye, İstanbul"
  message?: string           // custom note
  fontFamily?: string
  accentColor?: string       // override template accent
  bgStyle: 'photo' | 'custom' | 'gradient'
  customBg?: string | null
  overlayOpacity?: number
  cardSize?: '1:1' | '9:16'
}

export async function generateInvitationCanvas(config: InvitationConfig): Promise<HTMLCanvasElement> {
  const W = 1080
  const H = config.cardSize === '9:16' ? 1920 : 1080
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  const font = config.fontFamily || 'Georgia'
  const accent = config.accentColor || config.template.accentColor
  const text = config.template.textColor
  const opacity = (config.overlayOpacity ?? 65) / 100
  const yOff = H > 1080 ? Math.round((H - 1080) / 2) : 0

  // ── BACKGROUND ────────────────────────────────────────
  let bgLoaded = false
  if (config.bgStyle === 'custom' && config.customBg) {
    bgLoaded = await loadBg(ctx, config.customBg, W, H)
  } else if (config.bgStyle === 'photo' && config.template.bgPhoto) {
    bgLoaded = await loadBg(ctx, config.template.bgPhoto, W, H)
  }

  if (!bgLoaded) {
    const grd = ctx.createLinearGradient(0, 0, W, H)
    grd.addColorStop(0, config.template.bgColor)
    grd.addColorStop(1, darken(config.template.bgColor, 40))
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, W, H)
  } else {
    const o = opacity
    const ov = ctx.createLinearGradient(0, 0, 0, H)
    ov.addColorStop(0,   `rgba(0,0,0,${(o * 0.95).toFixed(2)})`)
    ov.addColorStop(0.4, `rgba(0,0,0,${(o * 0.7).toFixed(2)})`)
    ov.addColorStop(1,   `rgba(0,0,0,${Math.min(o * 1.3, 1).toFixed(2)})`)
    ctx.fillStyle = ov
    ctx.fillRect(0, 0, W, H)
  }

  // ── BORDERS ───────────────────────────────────────────
  ctx.strokeStyle = accent
  ctx.lineWidth = 6
  ctx.globalAlpha = 0.7
  ctx.strokeRect(30, 30, W - 60, H - 60)
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.35
  ctx.strokeRect(48, 48, W - 96, H - 96)
  ctx.globalAlpha = 1

  // ── DECORATIVE CORNERS ────────────────────────────────
  drawCornerOrnament(ctx, accent, 30, 30, 80)
  drawCornerOrnament(ctx, accent, W - 30, 30, 80, true)
  drawCornerOrnament(ctx, accent, 30, H - 30, 80, false, true)
  drawCornerOrnament(ctx, accent, W - 30, H - 30, 80, true, true)

  const cx = W / 2

  // ── EMOJI / TOP DECORATION ─────────────────────────────
  ctx.font = '80px serif'
  ctx.textAlign = 'center'
  ctx.globalAlpha = 0.9
  ctx.fillText(config.template.emoji, cx, 160 + yOff)
  ctx.globalAlpha = 1

  // ── HEADER (event type) ────────────────────────────────
  ctx.fillStyle = accent
  ctx.textAlign = 'center'
  ctx.shadowColor = 'rgba(0,0,0,0.6)'
  ctx.shadowBlur = 12
  fitText(ctx, config.template.headerText, cx, 250 + yOff, 880, `bold 62px ${font}`)
  ctx.shadowBlur = 0

  // ── DIVIDER ───────────────────────────────────────────
  drawDivider(ctx, accent, cx, 285 + yOff, 340)

  // ── HOST NAME ─────────────────────────────────────────
  ctx.fillStyle = text
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 10
  fitText(ctx, config.hostName || 'Ad Soyad', cx, 370 + yOff, 860, `bold 72px ${font}`)
  ctx.shadowBlur = 0

  // ── INVITE TEXT ───────────────────────────────────────
  ctx.fillStyle = text
  ctx.globalAlpha = 0.75
  fitText(ctx, config.template.inviteText, cx, 430 + yOff, 820, `italic 28px ${font}`)
  ctx.globalAlpha = 1

  // ── DIVIDER 2 ─────────────────────────────────────────
  drawDivider(ctx, accent, cx, 460 + yOff, 280)

  // ── DATE & TIME ───────────────────────────────────────
  if (config.eventDate) {
    ctx.fillStyle = accent
    ctx.shadowColor = 'rgba(0,0,0,0.5)'
    ctx.shadowBlur = 8
    fitText(ctx, config.eventDate, cx, 530 + yOff, 820, `bold 44px ${font}`)
    ctx.shadowBlur = 0
  }
  if (config.eventTime) {
    ctx.fillStyle = text
    ctx.globalAlpha = 0.85
    fitText(ctx, `Saat: ${config.eventTime}`, cx, 590 + yOff, 600, `38px ${font}`)
    ctx.globalAlpha = 1
  }

  // ── VENUE ─────────────────────────────────────────────
  if (config.venue) {
    ctx.fillStyle = accent
    ctx.shadowColor = 'rgba(0,0,0,0.4)'
    ctx.shadowBlur = 6
    fitText(ctx, config.venue, cx, 660 + yOff, 840, `bold 40px ${font}`)
    ctx.shadowBlur = 0
  }
  if (config.address) {
    ctx.fillStyle = text
    ctx.globalAlpha = 0.7
    fitText(ctx, config.address, cx, 710 + yOff, 820, `32px ${font}`)
    ctx.globalAlpha = 1
  }

  // ── CUSTOM MESSAGE ────────────────────────────────────
  if (config.message) {
    drawDivider(ctx, accent, cx, 760 + yOff, 200)
    ctx.fillStyle = text
    ctx.globalAlpha = 0.8
    wrapText(ctx, config.message, cx, 810 + yOff, 840, `italic 30px ${font}`, 42)
    ctx.globalAlpha = 1
  }

  // ── WATERMARK ─────────────────────────────────────────
  ctx.font = `22px ${font}`
  ctx.fillStyle = accent
  ctx.globalAlpha = 0.35
  ctx.textAlign = 'center'
  ctx.fillText('Made with Greetify', cx, H - 28)
  ctx.globalAlpha = 1

  return canvas
}

// ── HELPERS ───────────────────────────────────────────────

async function loadBg(ctx: CanvasRenderingContext2D, src: string, w: number, h: number): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => { ctx.drawImage(img, 0, 0, w, h); resolve(true) }
    img.onerror = () => resolve(false)
    img.src = src
  })
}

function fitText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, style: string) {
  ctx.font = style
  const bold = style.includes('bold')
  const italic = style.includes('italic')
  const prefix = [bold ? 'bold' : '', italic ? 'italic' : ''].filter(Boolean).join(' ')
  const sizeMatch = style.match(/(\d+)px/)
  const family = style.replace(/^(bold\s+)?(italic\s+)?[\d.]+px\s+/, '')
  let size = sizeMatch ? parseInt(sizeMatch[1]) : 40
  while (size > 18) {
    ctx.font = `${prefix} ${size}px ${family}`.trim()
    if (ctx.measureText(text).width <= maxW) break
    size -= 2
  }
  ctx.fillText(text, x, y)
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, style: string, lineH: number) {
  ctx.font = style
  const words = text.split(' ')
  let line = ''
  let curY = y
  for (const word of words) {
    const test = line ? line + ' ' + word : word
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, curY)
      line = word
      curY += lineH
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, curY)
}

function drawDivider(ctx: CanvasRenderingContext2D, color: string, cx: number, y: number, halfW: number) {
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.5

  ctx.beginPath()
  ctx.moveTo(cx - halfW, y)
  ctx.lineTo(cx - 20, y)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(cx + 20, y)
  ctx.lineTo(cx + halfW, y)
  ctx.stroke()

  // center diamond
  ctx.fillStyle = color
  ctx.globalAlpha = 0.8
  ctx.beginPath()
  ctx.moveTo(cx, y - 6)
  ctx.lineTo(cx + 8, y)
  ctx.lineTo(cx, y + 6)
  ctx.lineTo(cx - 8, y)
  ctx.closePath()
  ctx.fill()
  ctx.globalAlpha = 1
}

function drawCornerOrnament(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, size: number, flipX = false, flipY = false) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1)
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.45

  ctx.beginPath()
  ctx.moveTo(10, size)
  ctx.lineTo(10, 10)
  ctx.lineTo(size, 10)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(22, size - 10)
  ctx.lineTo(22, 22)
  ctx.lineTo(size - 10, 22)
  ctx.stroke()

  ctx.globalAlpha = 1
  ctx.restore()
}

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, (num >> 16) - amount)
  const g = Math.max(0, ((num >> 8) & 0xff) - amount)
  const b = Math.max(0, (num & 0xff) - amount)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

export function downloadInvitationCanvas(canvas: HTMLCanvasElement, name: string) {
  const link = document.createElement('a')
  link.download = `greetify-invite-${name}.png`
  link.href = canvas.toDataURL('image/png', 0.95)
  link.click()
}
