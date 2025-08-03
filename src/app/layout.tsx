import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/layout/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Homeschool Management Platform',
  description: 'A comprehensive digital solution for homeschool families using The Good and the Beautiful curriculum. Features Tennessee compliance tracking, lesson planning, and multi-child management.',
  keywords: ['homeschool', 'education', 'Tennessee', 'TGTB', 'curriculum', 'compliance'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}