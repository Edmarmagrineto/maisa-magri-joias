import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/components/CartProvider';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maisamagri.com.br';
const description = 'Semijoias selecionadas para durar — brincos, colares e pulseiras. Desde 2003.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Maisa Magri | Semijoias',
  description,
  openGraph: {
    title: 'Maisa Magri | Semijoias',
    description,
    url: siteUrl,
    siteName: 'Maisa Magri',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Maisa Magri Semijoias' }],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maisa Magri | Semijoias',
    description,
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased flex min-h-screen flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
