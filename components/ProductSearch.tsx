'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';

type SearchResult = {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string | null;
};

export default function ProductSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.products ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/produtos?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <form onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Buscar brinco, colar..."
          className="w-full border border-ink/20 px-3 py-1.5 text-sm bg-transparent outline-none focus:border-ink"
        />
      </form>

      {open && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 mt-1 bg-cream border border-ink/15 shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading && <p className="px-3 py-3 text-xs text-ink/50">Buscando...</p>}

          {!loading && results.length === 0 && (
            <p className="px-3 py-3 text-xs text-ink/50">Nenhuma peça encontrada com esse nome.</p>
          )}

          {!loading &&
            results.map((product) => (
              <Link
                key={product.id}
                href={`/produto/${product.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-sand/60 transition-colors"
              >
                <div className="relative h-12 w-10 shrink-0 bg-sand">
                  {product.image_url && (
                    <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm truncate">{product.name}</p>
                  <p className="text-xs text-ink/50">
                    {product.category} · {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}

          {!loading && results.length > 0 && (
            <button
              onClick={handleSubmit}
              className="w-full text-left px-3 py-2 text-xs uppercase tracking-widest2 border-t border-ink/10 hover:bg-sand/60 transition-colors"
            >
              Ver todos os resultados para &quot;{query}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
