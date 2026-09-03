import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/components/CartProvider';

export const metadata: Metadata = {
  title: 'Maisa Magri | Semijoias',
  description: 'Semijoias selecionadas para durar — brincos, colares e pulseiras.',
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
