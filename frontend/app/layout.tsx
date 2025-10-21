import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'World-Wide Wonders',
  description: 'Guess as many countries as you can before the timer runs out!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}