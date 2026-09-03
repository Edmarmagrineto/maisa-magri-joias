import { formatPrice } from '@/lib/format';

type OrderItemSummary = { product_name: string; quantity: number; unit_price: number };

type OrderSummary = {
  id: string;
  total: number;
  payment_method: string;
  shipping_cep: string | null;
  items: OrderItemSummary[];
};

function itemsRows(items: OrderItemSummary[]) {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;">${item.quantity}x ${item.product_name}</td>
          <td style="padding:8px 0; text-align:right;">${formatPrice(item.unit_price * item.quantity)}</td>
        </tr>`
    )
    .join('');
}

export function adminNewOrderEmail(order: OrderSummary, customerName: string) {
  return `
    <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #111;">
      <h1 style="font-size: 20px;">Novo pedido pago 🎉</h1>
      <p>Cliente: <strong>${customerName}</strong></p>
      <p>Pedido #${order.id.slice(0, 8)} — pagamento via ${order.payment_method}</p>
      <table style="width:100%; border-collapse:collapse; margin-top:12px;">
        ${itemsRows(order.items)}
      </table>
      <p style="margin-top:16px; font-size:18px;"><strong>Total: ${formatPrice(order.total)}</strong></p>
      <p style="font-size:13px; color:#666;">CEP de entrega: ${order.shipping_cep ?? '—'}</p>
    </div>
  `;
}

export function customerOrderConfirmationEmail(order: OrderSummary, customerName: string) {
  return `
    <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #111;">
      <h1 style="font-size: 20px;">Obrigada pela compra, ${customerName}!</h1>
      <p>Recebemos seu pagamento e já estamos preparando seu pedido #${order.id.slice(0, 8)}.</p>
      <table style="width:100%; border-collapse:collapse; margin-top:12px;">
        ${itemsRows(order.items)}
      </table>
      <p style="margin-top:16px; font-size:18px;"><strong>Total: ${formatPrice(order.total)}</strong></p>
      <p style="font-size:13px; color:#666;">Pagamento: ${order.payment_method}</p>
      <p style="margin-top:20px; font-size:13px; color:#666;">
        Acompanhe o status do seu pedido a qualquer momento na sua conta do site Maisa Magri.
      </p>
    </div>
  `;
}
