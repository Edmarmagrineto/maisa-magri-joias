'use client';

import { useState } from 'react';
import { calculateShipping, type ShippingQuote } from '@/lib/shipping';
import { formatPrice } from '@/lib/format';

export default function ShippingCalculator() {
  const [cep, setCep] = useState('');
  const [quote, setQuote] = useState<ShippingQuote | null>(null);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = calculateShipping(cep);
    if (!result) {
      setError('Digite um CEP válido com 8 dígitos.');
      setQuote(null);
      return;
    }
    setError('');
    setQuote(result);
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
        <button className="border border-ink px-4 py-2 text-xs uppercase tracking-widest2 hover:bg-ink hover:text-cream transition-colors">
          Calcular
        </button>
      </form>
      {error && <p className="text-xs text-red-700 mt-2">{error}</p>}
      {quote && (
        <div className="mt-3 text-sm">
          <p>
            Entrega para <strong>{quote.region}</strong>
          </p>
          <p className="text-ink/70">
            {formatPrice(quote.price)} · {quote.minDays} a {quote.maxDays} dias úteis
          </p>
        </div>
      )}
    </div>
  );
}
