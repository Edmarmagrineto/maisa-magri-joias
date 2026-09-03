'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import type { Product } from '@/lib/types';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        onClick={handleAdd}
        disabled={outOfStock}
        className="flex-1 bg-ink text-cream py-3 text-xs uppercase tracking-widest2 hover:bg-ink/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {outOfStock ? 'Esgotado' : added ? 'Adicionado ✓' : 'Adicionar ao carrinho'}
      </button>
      <button
        onClick={() => {
          handleAdd();
          router.push('/carrinho');
        }}
        disabled={outOfStock}
        className="flex-1 border border-ink py-3 text-xs uppercase tracking-widest2 hover:bg-ink hover:text-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Comprar agora
      </button>
    </div>
  );
}
