'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActive(index);
  }

  function scrollToIndex(index: number) {
    const el = containerRef.current;
    if (!el) return;
    // 'smooth' scrollTo pode nao completar em alguns navegadores com scroll-snap —
    // 'instant' garante que o clique sempre funcione (o gesto de arrastar continua suave)
    el.scrollTo({ left: index * el.clientWidth, behavior: 'instant' });
    setActive(index);
  }

  if (images.length === 0) {
    return <div className="relative aspect-[4/5] bg-sand" />;
  }

  return (
    <div>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
      >
        {images.map((src, i) => (
          <div key={src + i} className="relative aspect-[4/5] w-full shrink-0 snap-center bg-sand">
            <Image
              src={src}
              alt={`${alt} — foto ${i + 1}`}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-1 mt-3">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
              className="p-2.5 -m-1"
            >
              <span
                className={`block h-1.5 rounded-full transition-all ${
                  i === active ? 'w-6 bg-ink' : 'w-1.5 bg-ink/20'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
