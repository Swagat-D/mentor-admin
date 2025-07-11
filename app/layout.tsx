import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MentorMatch Admin Dashboard',
  description: 'Administrative dashboard for managing mentors, students, and platform operations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-montserrat">
        {children}
      </body>
    </html>
  )
}