'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/components/CartProvider';
import { calculateShipping, PICKUP_QUOTE, type ShippingQuote } from '@/lib/shipping';
import { formatPrice } from '@/lib/format';
import PaymentMethods from '@/components/PaymentMethods';

const PAYMENT_OPTIONS = ['Pix', 'Cartão de crédito', 'Cartão de débito', 'Boleto bancário'];

export default function CheckoutPage() {
  const supabase = createClient();
  const router = useRouter();
  const { items, total, clear } = useCart();

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [deliveryMethod, setDeliveryMethod] = useState<'entrega' | 'retirada'>('entrega');
  const [cep, setCep] = useState('');
  const [quote, setQuote] = useState<ShippingQuote | null>(null);
  const [payment, setPayment] = useState(PAYMENT_OPTIONS[0]);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setCheckingAuth(false);
    });
  }, [supabase]);

  function handleCalcShipping(e: React.FormEvent) {
    e.preventDefault();
    setQuote(calculateShipping(cep));
  }

  function handleSelectDeliveryMethod(method: 'entrega' | 'retirada') {
    setDeliveryMethod(method);
    setError('');
    setQuote(method === 'retirada' ? PICKUP_QUOTE : null);
  }

  async function handleConfirm() {
    if (!user) return;
    if (!quote) {
      setError('Calcule o frete antes de continuar.');
      return;
    }
    setPlacing(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
          paymentMethod: payment,
          deliveryMethod,
          shippingCep: quote.cep,
          shippingCost: quote.price,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error || 'Não foi possível iniciar o pagamento. Tente novamente.');
        setPlacing(false);
        return;
      }

      clear();
      window.location.href = data.url;
    } catch {
      setError('Não foi possível iniciar o pagamento. Tente novamente.');
      setPlacing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 sm:px-6 py-24 text-center">
        <h1 className="font-serif text-3xl mb-4">Seu carrinho está vazio</h1>
        <Link href="/produtos" className="inline-block bg-ink text-cream px-8 py-3 text-xs uppercase tracking-widest2">
          Ver catálogo
        </Link>
      </div>
    );
  }

  if (checkingAuth) return null;

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 sm:px-6 py-24 text-center">
        <h1 className="font-serif text-3xl mb-4">Entre para finalizar</h1>
        <p className="text-ink/60 mb-8">
          Você precisa estar logada para concluir a compra e acompanhar o pedido.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/entrar?redirect=/checkout" className="bg-ink text-cream px-8 py-3 text-xs uppercase tracking-widest2">
            Entrar
          </Link>
          <Link href="/cadastro?redirect=/checkout" className="border border-ink px-8 py-3 text-xs uppercase tracking-widest2">
            Criar conta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
      <h1 className="font-serif text-3xl mb-10">Finalizar compra</h1>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-10">
          <div>
            <p className="text-xs uppercase tracking-widest2 text-ink/50 mb-3">Entrega ou retirada</p>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => handleSelectDeliveryMethod('entrega')}
                className={`flex-1 border px-4 py-2 text-xs uppercase tracking-widest2 transition-colors ${
                  deliveryMethod === 'entrega' ? 'bg-ink text-cream border-ink' : 'border-ink/20 hover:border-ink'
                }`}
              >
                Receber em casa
              </button>
              <button
                type="button"
                onClick={() => handleSelectDeliveryMethod('retirada')}
                className={`flex-1 border px-4 py-2 text-xs uppercase tracking-widest2 transition-colors ${
                  deliveryMethod === 'retirada' ? 'bg-ink text-cream border-ink' : 'border-ink/20 hover:border-ink'
                }`}
              >
                Retirar pessoalmente
              </button>
            </div>

            {deliveryMethod === 'entrega' ? (
              <>
                <form onSubmit={handleCalcShipping} className="flex gap-2">
                  <input
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="CEP (00000-000)"
                    className="flex-1 border border-ink/20 px-3 py-2 text-sm bg-transparent outline-none focus:border-ink"
                  />
                  <button className="border border-ink px-4 py-2 text-xs uppercase tracking-widest2 hover:bg-ink hover:text-cream transition-colors">
                    Calcular frete
                  </button>
                </form>
                {quote && quote.cep !== 'RETIRADA' && (
                  <p className="text-sm text-ink/70 mt-3">
                    Entrega para {quote.region}: {formatPrice(quote.price)} ({quote.minDays} a {quote.maxDays} dias úteis)
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-ink/70">
                Sem custo de frete. Combinamos o local e o horário para você retirar o pedido assim que o
                pagamento for confirmado.
              </p>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest2 text-ink/50 mb-3">Forma de pagamento</p>
            <PaymentMethods />
            <div className="mt-4 space-y-2">
              {PAYMENT_OPTIONS.map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === option}
                    onChange={() => setPayment(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-ink/15 p-6 h-fit">
          <p className="text-xs uppercase tracking-widest2 text-ink/50 mb-4">Resumo do pedido</p>
          <ul className="space-y-2 text-sm mb-4">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-ink/10 pt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Frete</span>
              <span>
                {!quote ? '—' : quote.cep === 'RETIRADA' ? 'Grátis (retirada)' : formatPrice(quote.price)}
              </span>
            </div>
            <div className="flex justify-between text-base pt-2">
              <strong>Total</strong>
              <strong>{formatPrice(total + (quote?.price ?? 0))}</strong>
            </div>
          </div>

          {error && <p className="text-xs text-red-700 mt-3">{error}</p>}

          <button
            onClick={handleConfirm}
            disabled={placing}
            className="mt-6 w-full bg-ink text-cream py-3 text-xs uppercase tracking-widest2 hover:bg-ink/90 transition-colors disabled:opacity-50"
          >
            {placing ? 'Redirecionando...' : 'Ir para pagamento'}
          </button>
          <p className="text-[11px] text-ink/40 mt-3 text-center">
            Você vai ser redirecionada para o ambiente seguro do Mercado Pago para concluir o pagamento.
          </p>
        </div>
      </div>
    </div>
  );
}
