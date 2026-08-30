import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Vaidya — Clinical Intelligence Platform',
  description: 'Pre-consultation clinical intelligence for Indian hospitals. SIH26047.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
