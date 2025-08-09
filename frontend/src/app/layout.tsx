import './globals.css'

export const metadata = {
  title: 'Generative UI - Runtime Interface Generation',
  description: 'Explore AI Agent-driven dynamic interface generation technology for runtime generative user interfaces',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body className="min-h-screen bg-slate-50">{children}</body>
    </html>
  )
}
