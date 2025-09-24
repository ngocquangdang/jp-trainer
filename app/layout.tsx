export const metadata = { title: 'Hiragana Trainer', description: 'N5 Vocabulary Trainer' }
import './globals.css'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}
