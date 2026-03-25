import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl mb-4">🌙</p>
      <h1 className="text-2xl font-bold text-white mb-2">Template Not Found</h1>
      <p className="text-gray-400 mb-6">This greeting card template does not exist.</p>
      <Link
        href="/"
        className="bg-amber-500 text-gray-900 font-bold px-6 py-3 rounded-full hover:bg-amber-400 transition-colors"
      >
        ← Back to Gallery
      </Link>
    </div>
  )
}
