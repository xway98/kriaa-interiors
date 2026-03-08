import type { Metadata } from 'next';
import { Playfair_Display, Outfit } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'KRiAA Interiors | Luxury Interior Design Studio',
  description:
    'KRiAA Interiors — Bespoke interior design for residential and commercial spaces. Where craftsmanship meets aesthetics.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${playfair.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="antialiased" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>{children}</body>
    </html>
  );
}
