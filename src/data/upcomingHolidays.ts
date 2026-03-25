export interface UpcomingHoliday {
  id: string
  title: string
  emoji: string
  date: Date
}

// For fixed-date holidays (same day every year), return next occurrence
function nextFixed(month: number, day: number, year?: number): Date {
  const now = new Date()
  const y = year ?? now.getFullYear()
  const d = new Date(y, month - 1, day)
  if (d > now) return d
  return new Date(y + 1, month - 1, day)
}

// Islamic holidays follow the lunar (Hijri) calendar — dates shift ~11 days earlier each year.
// Approximate Gregorian dates for 2025–2030:
const ISLAMIC_DATES: Record<string, Date[]> = {
  'eid-ul-fitr': [
    new Date('2025-03-30'),
    new Date('2026-03-20'),
    new Date('2027-03-09'),
    new Date('2028-02-27'),
    new Date('2029-02-15'),
    new Date('2030-02-05'),
  ],
  'ramadan-mubarak': [
    new Date('2025-03-01'),
    new Date('2026-02-18'),
    new Date('2027-02-08'),
    new Date('2028-01-28'),
    new Date('2029-01-16'),
    new Date('2030-01-06'),
  ],
  'eid-ul-adha': [
    new Date('2025-06-06'),
    new Date('2026-05-27'),
    new Date('2027-05-16'),
    new Date('2028-05-05'),
    new Date('2029-04-24'),
    new Date('2030-04-13'),
  ],
  'laylat-al-qadr': [
    new Date('2025-03-27'),
    new Date('2026-03-17'),
    new Date('2027-03-06'),
    new Date('2028-02-24'),
    new Date('2029-02-13'),
    new Date('2030-02-02'),
  ],
  'mawlid-nabi': [
    new Date('2025-09-04'),
    new Date('2026-08-25'),
    new Date('2027-08-14'),
    new Date('2028-08-02'),
    new Date('2029-07-23'),
    new Date('2030-07-12'),
  ],
  'kadir-gecesi': [
    new Date('2025-03-27'),
    new Date('2026-03-17'),
    new Date('2027-03-06'),
    new Date('2028-02-24'),
  ],
  'mirac-kandili': [
    new Date('2025-01-27'),
    new Date('2026-01-16'),
    new Date('2027-01-06'),
    new Date('2027-12-26'),
    new Date('2028-12-14'),
  ],
  'berat-kandili': [
    new Date('2025-02-13'),
    new Date('2026-02-03'),
    new Date('2027-01-23'),
    new Date('2028-01-12'),
  ],
}

// Hindu holidays (lunar/solar — pre-calculated Gregorian dates)
const HINDU_DATES: Record<string, Date[]> = {
  'diwali': [
    new Date('2025-10-20'),
    new Date('2026-11-08'),
    new Date('2027-10-29'),
    new Date('2028-10-17'),
    new Date('2029-11-05'),
  ],
  'holi': [
    new Date('2025-03-14'),
    new Date('2026-03-03'),
    new Date('2027-03-22'),
    new Date('2028-03-11'),
    new Date('2029-03-01'),
  ],
  'navratri': [
    new Date('2025-09-29'),
    new Date('2026-10-19'),
    new Date('2027-10-08'),
    new Date('2028-09-26'),
  ],
  'janmashtami': [
    new Date('2025-08-16'),
    new Date('2026-09-05'),
    new Date('2027-08-25'),
    new Date('2028-08-14'),
  ],
  'ganesh-chaturthi': [
    new Date('2025-08-27'),
    new Date('2026-09-14'),
    new Date('2027-09-04'),
    new Date('2028-08-24'),
  ],
}

// Jewish holidays (pre-calculated Gregorian dates)
const JEWISH_DATES: Record<string, Date[]> = {
  'hanukkah': [
    new Date('2025-12-14'),
    new Date('2026-12-04'),
    new Date('2027-11-23'),
    new Date('2028-12-12'),
  ],
  'rosh-hashanah': [
    new Date('2025-09-22'),
    new Date('2026-09-11'),
    new Date('2027-10-01'),
    new Date('2028-09-20'),
  ],
  'passover': [
    new Date('2025-04-12'),
    new Date('2026-04-01'),
    new Date('2027-04-21'),
    new Date('2028-04-09'),
  ],
}

// Buddhist / Sikh holidays
const BUDDHIST_DATES: Record<string, Date[]> = {
  'vesak': [
    new Date('2025-05-12'),
    new Date('2026-05-31'),
    new Date('2027-05-20'),
    new Date('2028-05-09'),
  ],
}

const SIKH_DATES: Record<string, Date[]> = {
  'guru-nanak-jayanti': [
    new Date('2025-11-05'),
    new Date('2026-10-26'),
    new Date('2027-11-14'),
    new Date('2028-11-03'),
  ],
}

function nextLunarDate(id: string, map: Record<string, Date[]>): Date | null {
  const dates = map[id]
  if (!dates) return null
  const now = new Date()
  return dates.find(d => d > now) ?? null
}

// Easter (western) calculation
function easterDate(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

function nextEaster(): Date {
  const now = new Date()
  let e = easterDate(now.getFullYear())
  if (e <= now) e = easterDate(now.getFullYear() + 1)
  return e
}

function nextIslamicDate(id: string): Date | null {
  const dates = ISLAMIC_DATES[id]
  if (!dates) return null
  const now = new Date()
  return dates.find(d => d > now) ?? null
}

function buildList(): UpcomingHoliday[] {
  const list: UpcomingHoliday[] = [
    // Islamic (lunar)
    { id: 'ramadan-mubarak',    title: 'Ramazan Başlangıcı',        emoji: '🌙', date: nextIslamicDate('ramadan-mubarak')! },
    { id: 'laylat-al-qadr',    title: 'Kadir Gecesi',               emoji: '✨', date: nextIslamicDate('laylat-al-qadr')! },
    { id: 'eid-ul-fitr',       title: 'Eid al-Fitr / Ramazan Bayramı', emoji: '🌙', date: nextIslamicDate('eid-ul-fitr')! },
    { id: 'eid-ul-adha',       title: 'Eid al-Adha / Kurban Bayramı',  emoji: '🕌', date: nextIslamicDate('eid-ul-adha')! },
    { id: 'mawlid-nabi',       title: 'Mevlid Kandili',             emoji: '📿', date: nextIslamicDate('mawlid-nabi')! },
    { id: 'mirac-kandili',     title: 'Miraç Kandili',              emoji: '🌟', date: nextIslamicDate('mirac-kandili')! },
    { id: 'berat-kandili',     title: 'Berat Kandili',              emoji: '🕯️', date: nextIslamicDate('berat-kandili')! },
    // Turkish national (fixed)
    { id: 'cocuk-bayrami',      title: '23 Nisan Çocuk Bayramı',    emoji: '🎈', date: nextFixed(4, 23) },
    { id: 'genclik-bayrami',    title: '19 Mayıs Gençlik Bayramı',  emoji: '⚽', date: nextFixed(5, 19) },
    { id: 'zafer-bayrami',      title: '30 Ağustos Zafer Bayramı',  emoji: '🏆', date: nextFixed(8, 30) },
    { id: 'cumhuriyet-bayrami', title: '29 Ekim Cumhuriyet',        emoji: '🇹🇷', date: nextFixed(10, 29) },
    // Christian
    { id: 'christmas',          title: 'Christmas',                 emoji: '🎄', date: nextFixed(12, 25) },
    { id: 'easter',             title: 'Easter',                    emoji: '🐣', date: nextEaster() },
    // National
    { id: 'pakistan-independence', title: 'Pakistan Independence',  emoji: '🇵🇰', date: nextFixed(8, 14) },
    { id: 'india-independence',    title: 'India Independence',     emoji: '🇮🇳', date: nextFixed(8, 15) },
    { id: 'bangladesh-victory',    title: 'Bangladesh Victory Day', emoji: '🇧🇩', date: nextFixed(12, 16) },
    // Hindu
    { id: 'diwali',              title: 'Diwali — Festival of Lights',  emoji: '🪔', date: nextLunarDate('diwali', HINDU_DATES)! },
    { id: 'holi',                title: 'Holi — Festival of Colors',    emoji: '🌈', date: nextLunarDate('holi', HINDU_DATES)! },
    { id: 'navratri',            title: 'Navratri',                     emoji: '🪷', date: nextLunarDate('navratri', HINDU_DATES)! },
    { id: 'janmashtami',         title: 'Janmashtami',                  emoji: '🦚', date: nextLunarDate('janmashtami', HINDU_DATES)! },
    { id: 'ganesh-chaturthi',    title: 'Ganesh Chaturthi',             emoji: '🐘', date: nextLunarDate('ganesh-chaturthi', HINDU_DATES)! },
    // Jewish
    { id: 'hanukkah',            title: 'Hanukkah',                     emoji: '🕎', date: nextLunarDate('hanukkah', JEWISH_DATES)! },
    { id: 'rosh-hashanah',       title: 'Rosh Hashanah',                emoji: '🍎', date: nextLunarDate('rosh-hashanah', JEWISH_DATES)! },
    { id: 'passover',            title: 'Passover — Pesach',            emoji: '🫓', date: nextLunarDate('passover', JEWISH_DATES)! },
    // Buddhist
    { id: 'vesak',               title: 'Vesak — Buddha Purnima',       emoji: '🪷', date: nextLunarDate('vesak', BUDDHIST_DATES)! },
    // Sikh
    { id: 'vaisakhi',            title: 'Vaisakhi',                     emoji: '🌾', date: nextFixed(4, 14) },
    { id: 'guru-nanak-jayanti',  title: 'Guru Nanak Jayanti',           emoji: '🙏', date: nextLunarDate('guru-nanak-jayanti', SIKH_DATES)! },
  ]
  return list.filter(h => h.date != null)
}

const ALL_HOLIDAYS = buildList()

export function getUpcoming(days = 90): UpcomingHoliday[] {
  const now = new Date()
  const limit = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
  return ALL_HOLIDAYS
    .filter(h => h.date >= now && h.date <= limit)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
}

export function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}
