import Link from 'next/link';
import { getCurrentProfile } from '@/lib/auth';
import CartIndicator from '@/components/CartIndicator';
import MobileNav from '@/components/MobileNav';

const NAV_LINKS = [
  { href: '/produtos', label: 'Catálogo' },
  { href: '/produtos?categoria=Brincos', label: 'Brincos' },
  { href: '/produtos?categoria=Colares', label: 'Colares' },
  { href: '/produtos?categoria=Pulseiras', label: 'Pulseiras' },
  { href: '/sobre', label: 'Como funciona' },
];

export default async function Header() {
  const { user, profile } = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-ink/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 sm:h-20">
          <div className="flex items-center">
            <MobileNav links={NAV_LINKS} />
          </div>

          <Link href="/" className="justify-self-center">
            <span className="font-serif font-normal uppercase text-xl sm:text-2xl tracking-widest2 text-ink whitespace-nowrap">
              Maisa Magri
            </span>
          </Link>

          <div className="flex items-center justify-end gap-4 text-xs uppercase tracking-widest2 whitespace-nowrap">
            {profile?.is_admin && (
              <Link href="/admin" className="hidden sm:inline hover:underline">
                Admin
              </Link>
            )}
            <Link href={user ? '/conta' : '/entrar'} className="hidden sm:inline hover:underline">
              {user ? 'Minha conta' : 'Entrar'}
            </Link>
            <Link href="/carrinho" className="relative hover:underline">
              Carrinho
              <CartIndicator />
            </Link>
          </div>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-8 text-xs uppercase tracking-wider text-ink/80 border-t border-ink/10 h-11">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap hover:text-ink transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
