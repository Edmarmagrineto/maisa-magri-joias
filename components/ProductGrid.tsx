import type { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="text-center text-ink/50 py-16">
        Nenhuma peça encontrada por aqui ainda.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
