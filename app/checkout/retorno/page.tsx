import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0;

const STATUS_COPY: Record<string, { title: string; text: string }> = {
  pago: {
    title: 'Pagamento confirmado!',
    text: 'Recebemos seu pagamento. Acompanhe o pedido na sua área de cliente.',
  },
  pendente: {
    title: 'Pagamento em processamento',
    text: 'Assim que o pagamento for confirmado (Pix costuma ser na hora, boleto pode levar até 2 dias úteis), o status do pedido atualiza sozinho.',
  },
  cancelado: {
    title: 'Pagamento não aprovado',
    text: 'Não foi possível confirmar o pagamento desse pedido. Você pode tentar novamente pelo carrinho.',
  },
};

export default async function CheckoutRetornoPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const supabase = createClient();
  const orderId = searchParams.order;

  const { data: order } = orderId
    ? await supabase.from('orders').select('id, status').eq('id', orderId).single()
    : { data: null };

  const status = order?.status && STATUS_COPY[order.status] ? order.status : 'pendente';
  const copy = STATUS_COPY[status];

  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 py-24 text-center">
      <h1 className="font-serif text-3xl mb-4">{copy.title}</h1>
      <p className="text-ink/60 mb-8">{copy.text}</p>
      <Link href="/conta" className="inline-block bg-ink text-cream px-8 py-3 text-xs uppercase tracking-widest2">
        Ver meus pedidos
      </Link>
    </div>
  );
}
