import '../styles/globals.css'

export const metadata = {
  title: 'Mailflow — Your inbox, supercharged',
  description: 'A faster, smarter way to manage Gmail and Google Calendar.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-[#0f0f0f]">  {/* ← no overflow-hidden here */}
        {children}
      </body>
    </html>
  )
}