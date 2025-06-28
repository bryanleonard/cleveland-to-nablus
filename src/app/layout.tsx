import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cleveland ↔ Nablus Time Converter',
  description: 'Coordinate meetings between Cleveland, OH and Nablus, Palestine with automatic timezone conversion',
  keywords: ['timezone', 'converter', 'Cleveland', 'Nablus', 'Palestine', 'meeting', 'time'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}