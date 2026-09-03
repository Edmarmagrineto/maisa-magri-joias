import { createClient } from '@/lib/supabase/server';
import ProductGrid from '@/components/ProductGrid';
import type { Product } from '@/lib/types';
import Link from 'next/link';

export const revalidate = 0;

const CATEGORIES = ['Todas', 'Brincos', 'Colares', 'Pulseiras', 'Anéis'];

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: { categoria?: string };
}) {
  const categoria = searchParams.categoria ?? 'Todas';
  const supabase = createClient();

  let query = supabase.from('products').select('*').eq('is_active', true);
  if (categoria !== 'Todas') query = query.eq('category', categoria);

  const { data: products } = await query.order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-widest2 text-ink/50">Catálogo completo</p>
        <h1 className="font-serif text-4xl mt-2">Todas as peças</h1>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {CATEGORIES.map((cat) => {
          const href = cat === 'Todas' ? '/produtos' : `/produtos?categoria=${cat}`;
          const active = cat === categoria;
          return (
            <Link
              key={cat}
              href={href}
              className={`px-4 py-2 text-xs uppercase tracking-widest2 border transition-colors ${
                active ? 'bg-ink text-cream border-ink' : 'border-ink/20 hover:border-ink'
              }`}
            >
              {cat}
            </Link>
          );
        })}
      </div>

      <ProductGrid products={(products as Product[]) ?? []} />
    </div>
  );
}
