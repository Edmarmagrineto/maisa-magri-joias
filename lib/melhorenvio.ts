import { createAdminClient } from '@/lib/supabase/admin';

const BASE_URL = 'https://melhorenvio.com.br';
const TOKEN_URL = `${BASE_URL}/oauth/token`;
const CALCULATE_URL = `${BASE_URL}/api/v2/me/shipment/calculate`;

function getUserAgent() {
  const contact = process.env.ORDER_NOTIFICATION_EMAIL || 'contato@maisamagri.com.br';
  return `Maisa Magri (${contact})`;
}

type StoredToken = {
  access_token: string;
  refresh_token: string;
  expires_at: string;
};

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

async function getStoredToken(): Promise<StoredToken | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from('melhorenvio_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('id', 1)
    .maybeSingle();
  return (data as StoredToken | null) ?? null;
}

export async function saveToken(token: TokenResponse) {
  const admin = createAdminClient();
  const expiresAt = new Date(Date.now() + token.expires_in * 1000).toISOString();
  await admin.from('melhorenvio_tokens').upsert({
    id: 1,
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    expires_at: expiresAt,
    updated_at: new Date().toISOString(),
  });
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': getUserAgent() },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      client_id: process.env.MELHORENVIO_CLIENT_ID,
      client_secret: process.env.MELHORENVIO_CLIENT_SECRET,
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    throw new Error(`Falha ao renovar token do Melhor Envio: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as TokenResponse;
  await saveToken(data);
  return data.access_token;
}

async function getValidAccessToken(): Promise<string> {
  const stored = await getStoredToken();
  if (!stored) throw new Error('MELHORENVIO_NOT_CONNECTED');

  const expiresAt = new Date(stored.expires_at).getTime();
  const fiveMinutes = 5 * 60 * 1000;
  if (Date.now() > expiresAt - fiveMinutes) {
    return refreshAccessToken(stored.refresh_token);
  }
  return stored.access_token;
}

export async function isMelhorEnvioConnected(): Promise<boolean> {
  const stored = await getStoredToken();
  return stored !== null;
}

export type RealShippingQuote = {
  id: string;
  service: string;
  price: number;
  minDays: number;
  maxDays: number;
};

// caixa/envelope padrao usado pra despachar semijoias — ajustavel via env se o tamanho real mudar
const PACKAGE_WEIGHT_PER_ITEM_KG = Number(process.env.MELHORENVIO_PACKAGE_WEIGHT_KG) || 0.06;
const PACKAGE_WIDTH_CM = Number(process.env.MELHORENVIO_PACKAGE_WIDTH_CM) || 11;
const PACKAGE_HEIGHT_CM = Number(process.env.MELHORENVIO_PACKAGE_HEIGHT_CM) || 2;
const PACKAGE_LENGTH_CM = Number(process.env.MELHORENVIO_PACKAGE_LENGTH_CM) || 16;

type MelhorEnvioQuoteResponse = {
  id: number | string;
  name?: string;
  price?: string | number;
  custom_price?: string | number;
  delivery_time?: number;
  custom_delivery_time?: number;
  company?: { name?: string };
  error?: string;
};

export async function calculateRealShipping(params: {
  toCep: string;
  itemCount: number;
  subtotal: number;
}): Promise<RealShippingQuote[]> {
  const originCep = process.env.MELHORENVIO_ORIGIN_CEP;
  if (!originCep) throw new Error('MELHORENVIO_ORIGIN_CEP não configurado.');

  const accessToken = await getValidAccessToken();

  const res = await fetch(CALCULATE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': getUserAgent(),
    },
    body: JSON.stringify({
      from: { postal_code: originCep.replace(/\D/g, '') },
      to: { postal_code: params.toCep },
      volumes: [
        {
          width: PACKAGE_WIDTH_CM,
          height: PACKAGE_HEIGHT_CM,
          length: PACKAGE_LENGTH_CM,
          weight: Math.max(0.05, PACKAGE_WEIGHT_PER_ITEM_KG * Math.max(1, params.itemCount)),
          insurance: Math.max(1, params.subtotal),
        },
      ],
      options: { receipt: false, own_hand: false },
    }),
  });

  if (!res.ok) {
    throw new Error(`Falha ao consultar frete no Melhor Envio: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as MelhorEnvioQuoteResponse[];
  if (!Array.isArray(data)) throw new Error('Resposta inesperada do Melhor Envio.');

  return data
    .filter((item) => !item.error && (item.custom_price || item.price))
    .map((item) => {
      const price = Number(item.custom_price ?? item.price);
      const days = Number(item.custom_delivery_time ?? item.delivery_time ?? 0);
      return {
        id: String(item.id),
        service: `${item.company?.name ?? ''} ${item.name ?? ''}`.trim(),
        price,
        minDays: days,
        maxDays: days,
      };
    })
    .filter((q) => Number.isFinite(q.price) && q.price > 0)
    .sort((a, b) => a.price - b.price);
}
