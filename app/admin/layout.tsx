import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getCurrentProfile();
  if (!user) redirect('/entrar?redirect=/admin');
  if (!profile?.is_admin) redirect('/conta');

  return (
    <div>
      <div className="border-b border-ink/10 bg-sand/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex gap-6 h-12 items-center text-xs uppercase tracking-widest2 text-ink/70">
          <Link href="/admin" className="hover:text-ink transition-colors">
            Peças
          </Link>
          <Link href="/admin/pedidos" className="hover:text-ink transition-colors">
            Pedidos
          </Link>
          <Link href="/admin/vendas" className="hover:text-ink transition-colors">
            Vendas
          </Link>
          <Link href="/admin/clientes" className="hover:text-ink transition-colors">
            Clientes
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
