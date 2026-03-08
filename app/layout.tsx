import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KRiAA Interiors | Luxury Interior Design Studio',
  description:
    'KRiAA Interiors — Bespoke interior design for residential and commercial spaces. Where craftsmanship meets aesthetics.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Google Fonts loaded via standard link — no build-time network dependency */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased"
        style={{
          background: 'var(--bg)',
          color: 'var(--text-primary)',
          fontFamily: "'Outfit', 'Inter', sans-serif",
        }}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
