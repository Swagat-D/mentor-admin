import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MentorMatch Admin',
  description: 'Administrative dashboard for managing mentors, students, and platform operations',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="h-full font-montserrat antialiased bg-gray-50">
        <div className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  )
}