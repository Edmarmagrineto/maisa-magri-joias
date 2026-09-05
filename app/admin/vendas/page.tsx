import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/format';

export const revalidate = 0;

type PaidOrder = { id: string; total: number; created_at: string };
type PaidOrderItem = {
  product_name: string;
  quantity: number;
  unit_price: number;
  orders: { status: string } | { status: string }[] | null;
};

// pedidos que ja foram pagos, mesmo que tenham avancado pra enviado/entregue depois
const PAID_STATUSES = ['pago', 'enviado', 'entregue'];

export default async function AdminVendasPage() {
  const supabase = createClient();

  const { data: orders } = await supabase
    .from('orders')
    .select('id, total, created_at')
    .in('status', PAID_STATUSES);

  const paidOrders = (orders as PaidOrder[] | null) ?? [];

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const monthRevenue = paidOrders
    .filter((o) => new Date(o.created_at) >= startOfMonth)
    .reduce((sum, o) => sum + o.total, 0);
  const paidCount = paidOrders.length;
  const avgOrderValue = paidCount > 0 ? totalRevenue / paidCount : 0;

  const { data: items } = await supabase
    .from('order_items')
    .select('product_name, quantity, unit_price, orders!inner(status)')
    .in('orders.status', PAID_STATUSES);

  const itemList = (items as unknown as PaidOrderItem[] | null) ?? [];

  const byProduct = new Map<string, { quantity: number; revenue: number }>();
  for (const item of itemList) {
    const current = byProduct.get(item.product_name) ?? { quantity: 0, revenue: 0 };
    current.quantity += item.quantity;
    current.revenue += item.quantity * item.unit_price;
    byProduct.set(item.product_name, current);
  }

  const topProducts = Array.from(byProduct.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const cards = [
    { label: 'Faturado no total', value: formatPrice(totalRevenue) },
    { label: 'Faturado neste mês', value: formatPrice(monthRevenue) },
    { label: 'Pedidos pagos', value: String(paidCount) },
    { label: 'Ticket médio', value: formatPrice(avgOrderValue) },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
      <p className="text-xs uppercase tracking-widest2 text-ink/50">Área administrativa</p>
      <h1 className="font-serif text-3xl mt-2 mb-10">Vendas</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {cards.map((card) => (
          <div key={card.label} className="border border-ink/15 p-5">
            <p className="text-xs uppercase tracking-widest2 text-ink/50 mb-2">{card.label}</p>
            <p className="font-serif text-2xl">{card.value}</p>
          </div>
        ))}
      </div>

      <h2 className="font-serif text-xl mb-4">Peças mais vendidas</h2>

      {topProducts.length === 0 ? (
        <p className="text-sm text-ink/50">Nenhuma venda paga registrada ainda.</p>
      ) : (
        <div className="border border-ink/10 divide-y divide-ink/10">
          {topProducts.map((product, i) => (
            <div key={product.name} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="flex items-center gap-3">
                <span className="text-ink/40 w-4">{i + 1}</span>
                {product.name}
              </span>
              <span className="flex items-center gap-6 text-ink/70">
                <span>{product.quantity} vendida{product.quantity > 1 ? 's' : ''}</span>
                <strong className="text-ink">{formatPrice(product.revenue)}</strong>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
