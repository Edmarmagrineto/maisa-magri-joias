import { NextResponse } from 'next/server';
import { getPayment, mapPaymentStatus, mapPaymentMethodLabel } from '@/lib/mercadopago';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const url = new URL(request.url);
  let paymentId = url.searchParams.get('data.id') || url.searchParams.get('id');

  if (!paymentId) {
    try {
      const body = await request.json();
      paymentId = body?.data?.id ?? null;
    } catch {
      // sem corpo JSON — segue com o que veio na query string
    }
  }

  if (!paymentId) {
    // Mercado Pago também envia notificações de outros tipos (ex: merchant_order) — ignoramos sem erro
    return NextResponse.json({ received: true });
  }

  try {
    const payment = await getPayment(paymentId);
    const orderId = payment.external_reference;
    if (!orderId) return NextResponse.json({ received: true });

    const admin = createAdminClient();
    const status = mapPaymentStatus(payment.status);

    const update: Record<string, unknown> = {
      status,
      mp_payment_id: String(payment.id),
    };
    if (status === 'pago') {
      update.payment_method = mapPaymentMethodLabel(payment.payment_type_id);
    }

    const { data: existing } = await admin
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .single();

    await admin.from('orders').update(update).eq('id', orderId);

    // só baixa o estoque na primeira confirmação de pagamento — evita descontar duas vezes
    // quando o Mercado Pago reenvia a mesma notificação (comportamento normal do webhook deles)
    if (status === 'pago' && existing?.status !== 'pago') {
      const { data: items } = await admin
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', orderId);

      for (const item of items ?? []) {
        if (!item.product_id) continue;
        await admin.rpc('decrement_product_stock', {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Erro no webhook do Mercado Pago:', err);
    // responde 200 mesmo em erro para o Mercado Pago não ficar reenviando indefinidamente;
    // o erro já fica registrado nos logs da função para investigação
    return NextResponse.json({ received: true });
  }
}
