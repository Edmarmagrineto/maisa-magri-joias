const MP_API = 'https://api.mercadopago.com';

function getAccessToken() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurado.');
  return token;
}

export type PreferenceItem = {
  title: string;
  quantity: number;
  unit_price: number;
};

export async function createPreference(params: {
  orderId: string;
  items: PreferenceItem[];
  payerEmail: string;
  siteUrl: string;
}) {
  const res = await fetch(`${MP_API}/checkout/preferences`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: params.items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: 'BRL',
      })),
      external_reference: params.orderId,
      payer: { email: params.payerEmail },
      back_urls: {
        success: `${params.siteUrl}/checkout/retorno?order=${params.orderId}`,
        pending: `${params.siteUrl}/checkout/retorno?order=${params.orderId}`,
        failure: `${params.siteUrl}/checkout/retorno?order=${params.orderId}`,
      },
      auto_return: 'approved',
      notification_url: `${params.siteUrl}/api/mercadopago/webhook`,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Mercado Pago recusou a criação da preferência: ${res.status} ${body}`);
  }

  return res.json() as Promise<{ id: string; init_point: string; sandbox_init_point: string }>;
}

export async function getPayment(paymentId: string) {
  const res = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Falha ao consultar pagamento no Mercado Pago: ${res.status} ${body}`);
  }

  return res.json() as Promise<{
    id: number;
    status: string;
    external_reference: string;
    payment_type_id: string;
    transaction_amount: number;
  }>;
}

export function mapPaymentStatus(mpStatus: string): 'pago' | 'pendente' | 'cancelado' {
  if (mpStatus === 'approved' || mpStatus === 'authorized') return 'pago';
  if (mpStatus === 'rejected' || mpStatus === 'cancelled' || mpStatus === 'refunded' || mpStatus === 'charged_back') {
    return 'cancelado';
  }
  return 'pendente';
}

export function mapPaymentMethodLabel(paymentTypeId: string) {
  const labels: Record<string, string> = {
    credit_card: 'Cartão de crédito',
    debit_card: 'Cartão de débito',
    bank_transfer: 'Pix',
    ticket: 'Boleto bancário',
    account_money: 'Saldo Mercado Pago',
  };
  return labels[paymentTypeId] ?? paymentTypeId;
}
