'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartProvider';
import { formatPrice } from '@/lib/format';

export default function CarrinhoPage() {
  const { items, setQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center">
        <h1 className="font-serif text-3xl mb-4">Seu carrinho está vazio</h1>
        <p className="text-ink/60 mb-8">Explore o catálogo e encontre a próxima peça favorita.</p>
        <Link
          href="/produtos"
          className="inline-block bg-ink text-cream px-8 py-3 text-xs uppercase tracking-widest2"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
      <h1 className="font-serif text-3xl mb-10">Seu carrinho</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-4 border-b border-ink/10 pb-6">
            <div className="relative h-24 w-20 shrink-0 bg-sand">
              {item.imageUrl && (
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-serif text-lg">{item.name}</p>
              <p className="text-sm text-ink/60">{formatPrice(item.price)}</p>
              <div className="flex items-center gap-3 mt-3">
                <select
                  value={item.quantity}
                  onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
                  className="border border-ink/20 px-2 py-1 text-sm bg-transparent"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-xs uppercase tracking-widest2 text-ink/50 hover:text-ink"
                >
                  Remover
                </button>
              </div>
            </div>
            <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest2 text-ink/50">Subtotal</p>
        <p className="text-xl">{formatPrice(total)}</p>
      </div>
      <p className="text-xs text-ink/50 mt-1">Frete calculado na próxima etapa.</p>

      <Link
        href="/checkout"
        className="mt-8 block text-center bg-ink text-cream py-3 text-xs uppercase tracking-widest2 hover:bg-ink/90 transition-colors"
      >
        Finalizar compra
      </Link>
    </div>
  );
}
