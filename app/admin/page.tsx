import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/format';
import { isMelhorEnvioConnected } from '@/lib/melhorenvio';
import type { Product } from '@/lib/types';

export const revalidate = 0;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { melhorenvio?: string };
}) {
  const { user, profile } = await getCurrentProfile();
  if (!user) redirect('/entrar?redirect=/admin');
  if (!profile?.is_admin) redirect('/conta');

  const supabase = createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const shippingConnected = await isMelhorEnvioConnected();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
      {searchParams.melhorenvio === 'conectado' && (
        <p className="mb-6 border border-ink/15 bg-sand/40 px-4 py-3 text-sm">
          Frete real conectado com sucesso.
        </p>
      )}
      {searchParams.melhorenvio === 'erro' && (
        <p className="mb-6 border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-700">
          Não foi possível conectar o cálculo de frete real. Tente novamente.
        </p>
      )}

      <div className="mb-6 border border-ink/15 px-4 py-3 flex items-center justify-between text-sm">
        <span>
          Cálculo de frete real (Melhor Envio):{' '}
          {shippingConnected ? (
            <strong>conectado</strong>
          ) : (
            <strong className="text-red-700">não conectado</strong>
          )}
        </span>
        {!shippingConnected && (
          <a href="/api/melhorenvio/connect" className="underline hover:no-underline">
            Conectar agora
          </a>
        )}
      </div>

      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-widest2 text-ink/50">Área administrativa</p>
          <h1 className="font-serif text-3xl mt-2">Gerenciar peças</h1>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="bg-ink text-cream px-5 py-3 text-xs uppercase tracking-widest2 hover:bg-ink/90 transition-colors"
        >
          + Nova peça
        </Link>
      </div>

      <div className="divide-y divide-ink/10 border-t border-b border-ink/10">
        {(products as Product[] | null)?.map((product) => (
          <Link
            key={product.id}
            href={`/admin/produtos/${product.id}`}
            className="flex items-center gap-4 py-4 hover:bg-sand/40 px-2 transition-colors"
          >
            <div className="relative h-16 w-14 shrink-0 bg-sand">
              {product.image_url && (
                <Image src={product.image_url} alt={product.name} fill className="object-cover" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-serif">{product.name}</p>
              <p className="text-xs text-ink/50">
                {product.category} · Estoque: {product.stock}
              </p>
            </div>
            <p className="text-sm">{formatPrice(product.price)}</p>
          </Link>
        ))}
        {(!products || products.length === 0) && (
          <p className="py-10 text-center text-ink/50">Nenhuma peça cadastrada ainda.</p>
        )}
      </div>
    </div>
  );
}
