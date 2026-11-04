import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MovieVault — Ultimate Movie & Web Series Catalogue',
  description: 'Explore the latest Tamil, Telugu, Malayalam, Kannada, Hindi and English movies and web series. Clean catalogue with quick downloads.',
  keywords: ['movies', 'catalogue', 'tamil movies', 'telugu movies', 'web series', 'movie downloads'],
  openGraph: {
    title: 'MovieVault — Movie Catalogue',
    description: 'Explore latest movies and web series across all languages.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark antialiased`}>
      <body className="min-h-screen bg-[#0b0e14] text-[#e2e8f0] flex flex-col font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
