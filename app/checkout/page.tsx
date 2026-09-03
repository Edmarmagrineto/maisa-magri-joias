'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/components/CartProvider';
import { calculateShipping, type ShippingQuote } from '@/lib/shipping';
import { formatPrice } from '@/lib/format';
import PaymentMethods from '@/components/PaymentMethods';

const PAYMENT_OPTIONS = ['Pix', 'Cartão de crédito', 'Cartão de débito', 'Boleto bancário'];

export default function CheckoutPage() {
  const supabase = createClient();
  const router = useRouter();
  const { items, total, clear } = useCart();

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [cep, setCep] = useState('');
  const [quote, setQuote] = useState<ShippingQuote | null>(null);
  const [payment, setPayment] = useState(PAYMENT_OPTIONS[0]);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);

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

  async function handleConfirm() {
    if (!user) return;
    if (!quote) {
      setError('Calcule o frete antes de continuar.');
      return;
    }
    setPlacing(true);
    setError('');

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        payment_method: payment,
        shipping_cep: quote.cep,
        shipping_cost: quote.price,
        total: total + quote.price,
        status: 'pendente',
      })
      .select()
      .single();

    if (orderError || !order) {
      setError('Não foi possível criar o pedido. Tente novamente.');
      setPlacing(false);
      return;
    }

    const { error: itemsError } = await supabase.from('order_items').insert(
      items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
      }))
    );

    setPlacing(false);

    if (itemsError) {
      setError('Pedido criado, mas houve um erro ao salvar os itens.');
      return;
    }

    setOrderId(order.id);
    clear();
  }

  if (orderId) {
    return (
      <div className="mx-auto max-w-xl px-4 sm:px-6 py-24 text-center">
        <h1 className="font-serif text-3xl mb-4">Pedido recebido!</h1>
        <p className="text-ink/60 mb-2">
          Pagamento via <strong>{payment}</strong>. Acompanhe o status na sua área de cliente.
        </p>
        <p className="text-xs text-ink/40 mb-8">Pedido #{orderId.slice(0, 8)}</p>
        <Link href="/conta" className="inline-block bg-ink text-cream px-8 py-3 text-xs uppercase tracking-widest2">
          Ver meus pedidos
        </Link>
      </div>
    );
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
            <p className="text-xs uppercase tracking-widest2 text-ink/50 mb-3">Endereço de entrega</p>
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
            {quote && (
              <p className="text-sm text-ink/70 mt-3">
                Entrega para {quote.region}: {formatPrice(quote.price)} ({quote.minDays} a {quote.maxDays} dias úteis)
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
              <span>{quote ? formatPrice(quote.price) : '—'}</span>
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
            {placing ? 'Confirmando...' : 'Confirmar pedido'}
          </button>
        </div>
      </div>
    </div>
  );
}
