import { AuthProvider } from './contexts/AuthContext'
import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio Builder',
  description: 'Create and showcase your artwork portfolio',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

