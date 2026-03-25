export type InvitationCategory = 'wedding' | 'engagement' | 'birthday' | 'circumcision' | 'henna' | 'graduation' | 'opening' | 'baby'

export interface InvitationTemplate {
  id: string
  title: string
  category: InvitationCategory
  emoji: string
  gradient: string
  bgColor: string
  accentColor: string
  textColor: string
  headerText: string      // shown at top of card
  inviteText: string      // e.g. "sizi davet etmekten mutluluk duyarız"
  bgPhoto?: string        // verified Unsplash CDN URL
}

// Verified Unsplash photo IDs
const MOSQUE   = 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1080&q=90'
const MOSQUE2  = 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1080&q=90'
const NIGHT    = 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&w=1080&q=90'
const SPARKLER = 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=1080&q=90'
const XMAS     = 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1080&q=90'

export const invitationTemplates: InvitationTemplate[] = [
  {
    id: 'dugun-daveti',
    title: 'Düğün Davetiyesi',
    category: 'wedding',
    emoji: '💍',
    gradient: 'from-rose-900 via-pink-800 to-rose-700',
    bgColor: '#4a1942',
    accentColor: '#f9a8d4',
    textColor: '#ffffff',
    headerText: 'Düğün Davetiyesi',
    inviteText: 'Düğün törenimize sizi davet etmekten onur duyarız',
    bgPhoto: NIGHT,
  },
  {
    id: 'nisan-daveti',
    title: 'Nişan Davetiyesi',
    category: 'engagement',
    emoji: '💑',
    gradient: 'from-purple-900 via-violet-800 to-purple-700',
    bgColor: '#3b0764',
    accentColor: '#c4b5fd',
    textColor: '#ffffff',
    headerText: 'Nişan Davetiyesi',
    inviteText: 'Nişan törenimize teşriflerinizi bekleriz',
    bgPhoto: NIGHT,
  },
  {
    id: 'dogum-gunu',
    title: 'Doğum Günü Partisi',
    category: 'birthday',
    emoji: '🎂',
    gradient: 'from-amber-600 via-orange-500 to-yellow-400',
    bgColor: '#78350f',
    accentColor: '#fcd34d',
    textColor: '#ffffff',
    headerText: 'Doğum Günü Kutlaması',
    inviteText: 'Doğum günü kutlamamıza hoş geldiniz',
    bgPhoto: SPARKLER,
  },
  {
    id: 'sunnet-daveti',
    title: 'Sünnet Davetiyesi',
    category: 'circumcision',
    emoji: '🌙',
    gradient: 'from-emerald-900 via-teal-800 to-green-700',
    bgColor: '#064e3b',
    accentColor: '#6ee7b7',
    textColor: '#ffffff',
    headerText: 'Sünnet Merasimine Davet',
    inviteText: 'Sünnet törenimize sizi davet etmekten mutluluk duyarız',
    bgPhoto: MOSQUE,
  },
  {
    id: 'kina-daveti',
    title: 'Kına Gecesi Davetiyesi',
    category: 'henna',
    emoji: '🌸',
    gradient: 'from-red-900 via-rose-800 to-pink-700',
    bgColor: '#7f1d1d',
    accentColor: '#fca5a5',
    textColor: '#ffffff',
    headerText: 'Kına Gecesi Davetiyesi',
    inviteText: 'Kına gecerimize renginizi katmanızı isteriz',
    bgPhoto: SPARKLER,
  },
  {
    id: 'mezuniyet-daveti',
    title: 'Mezuniyet Töreni',
    category: 'graduation',
    emoji: '🎓',
    gradient: 'from-blue-900 via-indigo-800 to-blue-700',
    bgColor: '#1e3a5f',
    accentColor: '#93c5fd',
    textColor: '#ffffff',
    headerText: 'Mezuniyet Kutlaması',
    inviteText: 'Mezuniyet törenimizde sizinle olmak isteriz',
    bgPhoto: NIGHT,
  },
  {
    id: 'acilis-daveti',
    title: 'Açılış Töreni',
    category: 'opening',
    emoji: '🎊',
    gradient: 'from-yellow-700 via-amber-600 to-orange-500',
    bgColor: '#713f12',
    accentColor: '#fde68a',
    textColor: '#ffffff',
    headerText: 'Açılış Davetiyesi',
    inviteText: 'Büyük açılışımıza sizleri davet ediyoruz',
    bgPhoto: SPARKLER,
  },
  {
    id: 'bebek-sekeri',
    title: 'Bebek Şekeri',
    category: 'baby',
    emoji: '👶',
    gradient: 'from-sky-700 via-blue-600 to-cyan-500',
    bgColor: '#0c4a6e',
    accentColor: '#bae6fd',
    textColor: '#ffffff',
    headerText: 'Bebek Şekeri Davetiyesi',
    inviteText: 'Minik bebeğimizi tanıtmaktan büyük mutluluk duyarız',
    bgPhoto: NIGHT,
  },
  {
    id: 'islami-nikah',
    title: 'İslami Nikah',
    category: 'wedding',
    emoji: '🕌',
    gradient: 'from-emerald-900 via-green-800 to-teal-700',
    bgColor: '#064e3b',
    accentColor: '#fbbf24',
    textColor: '#ffffff',
    headerText: 'Nikah Davetiyesi',
    inviteText: 'Nikah törenimize katılımınızı bekleriz',
    bgPhoto: MOSQUE2,
  },
  {
    id: 'noel-daveti',
    title: 'Yılbaşı Kutlaması',
    category: 'opening',
    emoji: '🎄',
    gradient: 'from-green-900 via-emerald-800 to-green-700',
    bgColor: '#14532d',
    accentColor: '#fcd34d',
    textColor: '#ffffff',
    headerText: 'Yılbaşı Davetiyesi',
    inviteText: 'Yılbaşı kutlamamıza sizleri bekliyoruz',
    bgPhoto: XMAS,
  },
]
