import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/format';
import LogoutButton from '@/components/LogoutButton';

export const revalidate = 0;

const STATUS_LABEL: Record<string, string> = {
  pendente: 'Pendente',
  pago: 'Pago',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

export default async function ContaPage() {
  const { user, profile } = await getCurrentProfile();
  if (!user) redirect('/entrar?redirect=/conta');

  const supabase = createClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-widest2 text-ink/50">Minha conta</p>
          <h1 className="font-serif text-3xl mt-2">
            Olá, {profile?.full_name || user.email}
          </h1>
        </div>
        <LogoutButton />
      </div>

      {profile?.is_admin && (
        <Link
          href="/admin"
          className="block mb-8 border border-ink px-4 py-3 text-xs uppercase tracking-widest2 hover:bg-ink hover:text-cream transition-colors w-fit"
        >
          Ir para área administrativa
        </Link>
      )}

      <h2 className="font-serif text-xl mb-4">Meus pedidos</h2>

      {(!orders || orders.length === 0) && (
        <p className="text-sm text-ink/50">Você ainda não fez nenhum pedido.</p>
      )}

      <div className="space-y-4">
        {orders?.map((order: any) => (
          <div key={order.id} className="border border-ink/15 p-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Pedido #{order.id.slice(0, 8)}</span>
              <span>{STATUS_LABEL[order.status] ?? order.status}</span>
            </div>
            <ul className="text-sm text-ink/60 space-y-1 mb-2">
              {order.order_items?.map((item: any) => (
                <li key={item.id}>
                  {item.quantity}x {item.product_name}
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-sm border-t border-ink/10 pt-2">
              <span>{order.payment_method}</span>
              <strong>{formatPrice(order.total)}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
