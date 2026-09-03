import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createPreference } from '@/lib/mercadopago';

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'É preciso estar logada para finalizar a compra.' }, { status: 401 });
  }

  const body = await request.json();
  const items: { productId: string; quantity: number }[] = body.items ?? [];
  const paymentMethod: string = body.paymentMethod ?? 'A definir';
  const shippingCep: string | null = body.shippingCep ?? null;
  const shippingCost: number = Number(body.shippingCost) || 0;

  if (items.length === 0) {
    return NextResponse.json({ error: 'Carrinho vazio.' }, { status: 400 });
  }

  // busca o preço real no banco — nunca confia no preço vindo do navegador
  const productIds = items.map((i) => i.productId);
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, price')
    .in('id', productIds);

  if (productsError || !products || products.length === 0) {
    return NextResponse.json({ error: 'Não foi possível validar os itens do carrinho.' }, { status: 400 });
  }

  const orderItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new Error('Produto não encontrado.');
    return {
      product_id: product.id,
      product_name: product.name,
      unit_price: product.price,
      quantity: item.quantity,
    };
  });

  const subtotal = orderItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  const total = subtotal + shippingCost;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      payment_method: paymentMethod,
      shipping_cep: shippingCep,
      shipping_cost: shippingCost,
      total,
      status: 'pendente',
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: 'Não foi possível criar o pedido.' }, { status: 500 });
  }

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems.map((item) => ({ ...item, order_id: order.id })));

  if (itemsError) {
    return NextResponse.json({ error: 'Não foi possível salvar os itens do pedido.' }, { status: 500 });
  }

  const preferenceItems = orderItems.map((item) => ({
    title: item.product_name,
    quantity: item.quantity,
    unit_price: item.unit_price,
  }));
  if (shippingCost > 0) {
    preferenceItems.push({ title: 'Frete', quantity: 1, unit_price: shippingCost });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  try {
    const preference = await createPreference({
      orderId: order.id,
      items: preferenceItems,
      payerEmail: user.email!,
      siteUrl,
    });

    // atualiza com a service role: o cliente ainda não tem permissão de UPDATE em orders
    // (de propósito — evita que alguém altere status/total do próprio pedido direto pela API)
    const admin = createAdminClient();
    await admin.from('orders').update({ mp_preference_id: preference.id }).eq('id', order.id);

    return NextResponse.json({ url: preference.init_point, orderId: order.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Falha ao iniciar o pagamento.' },
      { status: 502 }
    );
  }
}
