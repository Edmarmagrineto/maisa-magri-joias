import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/produto/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="absolute top-3 left-3 bg-ink text-cream text-[10px] uppercase tracking-widest2 px-2 py-1">
            Últimas peças
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 bg-ink/70 text-cream text-[10px] uppercase tracking-widest2 px-2 py-1">
            Esgotado
          </span>
        )}
      </div>
      <div className="pt-3 text-center">
        <p className="text-[11px] uppercase tracking-widest2 text-ink/50">{product.category}</p>
        <h3 className="font-serif text-lg mt-1">{product.name}</h3>
        <p className="text-sm mt-1">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
