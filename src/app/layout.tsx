import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Greetify — Islamic, Christian & National Greeting Cards',
  description: 'Create personalized greeting cards for Eid, Ramadan, Christmas, Independence Day and more. Add your name and share instantly!',
  keywords: 'eid mubarak, ramadan, greeting card, islamic, christmas, pakistan, india, personalized',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Greetify',
  },
  openGraph: {
    title: 'Greetify — Create Personalized Greeting Cards',
    description: 'Eid, Ramadan, Christmas, Independence Day greetings with your name',
    type: 'website',
  },
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#f59e0b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>{children}</body>
    </html>
  )
}
