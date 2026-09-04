'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/format';
import type { RealShippingQuote } from '@/lib/melhorenvio';

export default function ShippingCalculator({ price }: { price: number }) {
  const [cep, setCep] = useState('');
  const [quotes, setQuotes] = useState<RealShippingQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setQuotes([]);
    setLoading(true);

    try {
      const res = await fetch('/api/shipping/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep, items: [{ quantity: 1 }], subtotal: price }),
      });
      const data = await res.json();

      if (!res.ok || !data.quotes) {
        setError(data.error || 'Não foi possível calcular o frete.');
        return;
      }

      setQuotes(data.quotes);
    } catch {
      setError('Não foi possível calcular o frete. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-ink/15 p-4">
      <p className="text-xs uppercase tracking-widest2 text-ink/50 mb-3">Calcular frete e prazo</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          placeholder="00000-000"
          maxLength={9}
          className="flex-1 border border-ink/20 px-3 py-2 text-sm bg-transparent outline-none focus:border-ink"
        />
        <button
          disabled={loading}
          className="border border-ink px-4 py-2 text-xs uppercase tracking-widest2 hover:bg-ink hover:text-cream transition-colors disabled:opacity-50"
        >
          {loading ? 'Calculando...' : 'Calcular'}
        </button>
      </form>
      {error && <p className="text-xs text-red-700 mt-2">{error}</p>}
      {quotes.length > 0 && (
        <div className="mt-3 space-y-1 text-sm">
          {quotes.map((q) => (
            <p key={q.id}>
              {q.service || 'Transportadora'}: {formatPrice(q.price)}
              {q.minDays > 0 && <span className="text-ink/70"> · {q.minDays} dias úteis</span>}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
