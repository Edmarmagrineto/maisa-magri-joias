import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/resend';
import { adminNewOrderEmail, customerOrderConfirmationEmail } from '@/lib/email-templates';

// Rota temporária só para confirmar que o envio de e-mail está funcionando —
// remover depois do teste.
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'not authenticated' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, full_name, email')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) return NextResponse.json({ error: 'not admin' }, { status: 403 });

  const orderSummary = {
    id: 'teste-0000-0000-0000-000000000000',
    total: 189.9,
    payment_method: 'Pix',
    shipping_cep: '01310-100',
    items: [{ product_name: 'Brinco Esmeralda Imperial', unit_price: 189.9, quantity: 1 }],
  };

  const adminTo = Array.from(
    new Set([process.env.ORDER_NOTIFICATION_EMAIL, profile.email].filter(Boolean) as string[])
  );

  const results: Record<string, unknown> = {};

  if (adminTo.length > 0) {
    await sendEmail({
      to: adminTo,
      subject: '[TESTE] Novo pedido pago — Cliente Teste',
      html: adminNewOrderEmail(orderSummary, 'Cliente Teste'),
    });
    results.adminEmailSentTo = adminTo;
  }

  if (profile.email) {
    await sendEmail({
      to: profile.email,
      subject: '[TESTE] Recebemos seu pagamento — Maisa Magri',
      html: customerOrderConfirmationEmail(orderSummary, profile.full_name || 'Cliente'),
    });
    results.customerEmailSentTo = profile.email;
  }

  return NextResponse.json({ ok: true, ...results });
}
