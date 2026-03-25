// Run: node scripts/gen-icons.mjs
// Generates PWA icons using pure Node.js (no canvas dependency)
import { writeFileSync, mkdirSync } from 'fs'

// Minimal PNG encoder
function createPNG(size, bgColor, fgColor) {
  // We'll create an SVG and encode it as a data URL instead
  // This returns an SVG file for the icons
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="${bgColor}"/>
  <text x="50%" y="55%" font-size="${size * 0.55}" text-anchor="middle" dominant-baseline="middle" fill="${fgColor}">🌙</text>
</svg>`
  return svg
}

mkdirSync('public/icons', { recursive: true })
writeFileSync('public/icons/icon-192.svg', createPNG(192, '#0a0a14', '#f59e0b'))
writeFileSync('public/icons/icon-512.svg', createPNG(512, '#0a0a14', '#f59e0b'))
console.log('SVG icons created')
