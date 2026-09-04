export type ShippingQuote = {
  cep: string;
  price: number;
  minDays: number;
  maxDays: number;
  region: string;
};

// usado quando a cliente escolhe retirar o pedido pessoalmente em vez de receber por entrega
export const PICKUP_QUOTE: ShippingQuote = {
  cep: 'RETIRADA',
  price: 0,
  minDays: 0,
  maxDays: 0,
  region: 'Retirada na loja',
};

const REGIONS: { test: RegExp; name: string; base: number; days: [number, number] }[] = [
  { test: /^0[1-9]|^1[01]/, name: 'São Paulo (capital e região)', base: 14.9, days: [1, 3] },
  { test: /^[23]\d/, name: 'Sudeste / Sul', base: 19.9, days: [2, 5] },
  { test: /^[45]\d/, name: 'Sul / Centro-Oeste', base: 24.9, days: [3, 6] },
  { test: /^[67]\d/, name: 'Norte / Centro-Oeste', base: 29.9, days: [5, 9] },
  { test: /^[89]\d/, name: 'Nordeste / Norte', base: 27.9, days: [4, 8] },
];

// Estimativa simplificada por faixa de CEP — não usa uma API dos Correios,
// apenas dá uma noção realista de prazo e valor para o cliente no checkout.
export function calculateShipping(rawCep: string): ShippingQuote | null {
  const cep = rawCep.replace(/\D/g, '');
  if (cep.length !== 8) return null;

  const prefix = cep.slice(0, 2);
  const region = REGIONS.find((r) => r.test.test(prefix)) ?? REGIONS[1];

  // pequena variação determinística a partir do CEP, só para não ficar sempre igual
  const variance = (parseInt(cep.slice(-3), 10) % 12) - 6;
  const price = Math.max(9.9, region.base + variance * 0.4);

  return {
    cep,
    price: Math.round(price * 100) / 100,
    minDays: region.days[0],
    maxDays: region.days[1],
    region: region.name,
  };
}
