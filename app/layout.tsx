/* eslint-disable react-refresh/only-export-components */
import './globals.css'
import Link from 'next/link'
import { ActiveTimeProvider } from './components/ActiveTimeContext'
import { ActiveTimeBar } from './components/ActiveTimeBar'
export const metadata = { title: 'Hiragana Trainer', description: 'N5 Vocabulary Trainer' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-gray-50">
        <ActiveTimeProvider>
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200">
            <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
              <Link href="/" className="text-sm font-semibold tracking-wide text-gray-900">Hiragana Trainer</Link>
              <div className="flex items-center gap-3">
                <nav className="flex items-center gap-2 text-sm">
                  <Link href="/" className="rounded-lg px-3 py-1.5 hover:bg-gray-100 text-gray-700">Practice</Link>
                  <Link href="/test" className="rounded-lg px-3 py-1.5 hover:bg-gray-100 text-gray-700">Test</Link>
                  <Link href="/vocab" className="rounded-lg px-3 py-1.5 hover:bg-gray-100 text-gray-700">Vocab</Link>
                  <Link href="/vocab-test" className="rounded-lg px-3 py-1.5 hover:bg-gray-100 text-gray-700">Vocab Test</Link>
                </nav>
                <ActiveTimeBar />
              </div>
            </div>
          </header>
          {children}
        </ActiveTimeProvider>
      </body>
    </html>
  )
}
