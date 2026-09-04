import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/format';
import OrderStatusSelect from '@/components/OrderStatusSelect';
import type { Order, OrderItem, Profile } from '@/lib/types';

export const revalidate = 0;

type OrderWithItems = Order & { order_items: OrderItem[] };

export default async function AdminPedidosPage() {
  const supabase = createClient();

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  const list = (orders as OrderWithItems[] | null) ?? [];

  const userIds = Array.from(new Set(list.map((o) => o.user_id)));
  const { data: profiles } = userIds.length
    ? await supabase.from('profiles').select('id, full_name, email').in('id', userIds)
    : { data: [] as Profile[] };

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
      <p className="text-xs uppercase tracking-widest2 text-ink/50">Área administrativa</p>
      <h1 className="font-serif text-3xl mt-2 mb-10">Pedidos</h1>

      {list.length === 0 && <p className="text-sm text-ink/50">Nenhum pedido ainda.</p>}

      <div className="space-y-4">
        {list.map((order) => {
          const customer = profileById.get(order.user_id);
          const isPickup = order.shipping_cep === 'RETIRADA';

          return (
            <div key={order.id} className="border border-ink/15 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm mb-2">
                <span>
                  Pedido #{order.id.slice(0, 8)} ·{' '}
                  {new Date(order.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <OrderStatusSelect orderId={order.id} status={order.status} />
              </div>

              <p className="text-sm text-ink/70 mb-2">
                {customer?.full_name || 'Cliente'} · {customer?.email || '—'}
              </p>

              <ul className="text-sm text-ink/60 space-y-1 mb-2">
                {order.order_items?.map((item) => (
                  <li key={item.id}>
                    {item.quantity}x {item.product_name} — {formatPrice(item.unit_price * item.quantity)}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-2 text-sm border-t border-ink/10 pt-2">
                <span className="text-ink/60">
                  {order.payment_method} ·{' '}
                  {isPickup ? 'Retirada na loja' : `Entrega no CEP ${order.shipping_cep ?? '—'}`}
                </span>
                <strong>{formatPrice(order.total)}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
