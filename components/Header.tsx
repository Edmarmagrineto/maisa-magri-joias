import Link from 'next/link';
import Image from 'next/image';
import { getCurrentProfile } from '@/lib/auth';
import CartIndicator from '@/components/CartIndicator';
import MobileNav from '@/components/MobileNav';

const NAV_LINKS = [
  { href: '/produtos', label: 'Todas as peças' },
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
        <div className="flex items-center justify-between h-20">
          <MobileNav links={NAV_LINKS} />

          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image src="/logo.png" alt="Maisa Magri" width={140} height={44} priority className="invert-0" />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-widest2 text-ink/80">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-ink transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 text-xs uppercase tracking-widest2">
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
      </div>
    </header>
  );
}
