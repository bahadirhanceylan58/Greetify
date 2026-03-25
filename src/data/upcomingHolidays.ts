export interface UpcomingHoliday {
  id: string
  title: string
  emoji: string
  date: Date
}

// Fixed dates for 2026 — update annually
export const upcomingHolidays: UpcomingHoliday[] = [
  { id: 'cocuk-bayrami',      title: '23 Nisan Çocuk Bayramı',   emoji: '🎈', date: new Date('2026-04-23') },
  { id: 'genclik-bayrami',    title: '19 Mayıs Gençlik Bayramı', emoji: '⚽', date: new Date('2026-05-19') },
  { id: 'kurban-bayrami',     title: 'Kurban Bayramı',           emoji: '🌙', date: new Date('2026-05-27') },
  { id: 'zafer-bayrami',      title: '30 Ağustos Zafer Bayramı', emoji: '🏆', date: new Date('2026-08-30') },
  { id: 'cumhuriyet-bayrami', title: '29 Ekim Cumhuriyet',       emoji: '🇹🇷', date: new Date('2026-10-29') },
  { id: 'christmas',          title: 'Christmas',                emoji: '🎄', date: new Date('2026-12-25') },
  { id: 'eid-ul-fitr',        title: 'Eid al-Fitr',              emoji: '🌙', date: new Date('2027-03-10') },
]

export function getUpcoming(days = 90): UpcomingHoliday[] {
  const now = new Date()
  const limit = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
  return upcomingHolidays
    .filter(h => h.date >= now && h.date <= limit)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
}

export function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}
