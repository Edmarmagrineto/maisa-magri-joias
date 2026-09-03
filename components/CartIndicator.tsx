'use client';

import { useCart } from '@/components/CartProvider';

export default function CartIndicator() {
  const { count } = useCart();
  if (count === 0) return null;
  return (
    <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-sans normal-case tracking-normal text-cream">
      {count}
    </span>
  );
}
