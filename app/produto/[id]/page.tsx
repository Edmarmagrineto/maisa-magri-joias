import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/format';
import AddToCartButton from '@/components/AddToCartButton';
import ShippingCalculator from '@/components/ShippingCalculator';
import ReviewsSection from '@/components/ReviewsSection';
import ProductGallery from '@/components/ProductGallery';
import type { Product } from '@/lib/types';

export const revalidate = 0;

export default async function ProdutoPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!product) notFound();

  const p = product as Product;
  const gallery = [p.image_url, ...(p.images ?? [])].filter((url): url is string => Boolean(url));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <div className="grid gap-12 lg:grid-cols-2">
        <ProductGallery images={gallery} alt={p.name} />

        <div>
          <p className="text-xs uppercase tracking-widest2 text-ink/50">{p.category}</p>
          <h1 className="font-serif text-3xl sm:text-4xl mt-2">{p.name}</h1>
          <p className="text-2xl mt-4">{formatPrice(p.price)}</p>

          {p.description && (
            <p className="text-sm text-ink/70 leading-relaxed mt-5">{p.description}</p>
          )}

          <p className="text-xs text-ink/50 mt-4">
            {p.stock > 0 ? `${p.stock} peças disponíveis` : 'Fora de estoque no momento'}
          </p>

          <div className="mt-6">
            <AddToCartButton product={p} />
          </div>

          <div className="mt-8">
            <ShippingCalculator price={p.price} />
          </div>
        </div>
      </div>

      <ReviewsSection productId={p.id} />
    </div>
  );
}
