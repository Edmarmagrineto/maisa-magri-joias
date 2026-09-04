import { NextResponse } from 'next/server';
import { calculateRealShipping } from '@/lib/melhorenvio';

export async function POST(request: Request) {
  const body = await request.json();
  const cep = String(body.cep ?? '').replace(/\D/g, '');
  const itemCount: number = Array.isArray(body.items)
    ? body.items.reduce((sum: number, i: { quantity?: number }) => sum + (i.quantity || 1), 0)
    : 1;
  const subtotal = Number(body.subtotal) || 0;

  if (cep.length !== 8) {
    return NextResponse.json({ error: 'Digite um CEP válido com 8 dígitos.' }, { status: 400 });
  }

  try {
    const quotes = await calculateRealShipping({ toCep: cep, itemCount, subtotal });
    if (quotes.length === 0) {
      return NextResponse.json({ error: 'Nenhuma opção de frete disponível para esse CEP.' }, { status: 422 });
    }
    return NextResponse.json({ quotes });
  } catch (err) {
    console.error('Erro ao calcular frete real:', err);
    return NextResponse.json(
      { error: 'Não foi possível calcular o frete agora. Tente novamente em instantes.' },
      { status: 502 }
    );
  }
}
