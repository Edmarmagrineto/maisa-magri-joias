import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Rota admin-only: inicia o fluxo OAuth2 do Melhor Envio (autorizacao unica pra
// conectar a conta da loja e permitir calculo de frete real).
export async function GET(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.redirect(new URL('/entrar?redirect=/admin', request.url));

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: 'not admin' }, { status: 403 });

  const clientId = process.env.MELHORENVIO_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: 'MELHORENVIO_CLIENT_ID não configurado.' }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const redirectUri = process.env.MELHORENVIO_REDIRECT_URI || `${siteUrl}/api/melhorenvio/callback`;

  const authorizeUrl = new URL('https://melhorenvio.com.br/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('state', crypto.randomUUID());
  authorizeUrl.searchParams.set('scope', 'shipping-calculate');

  return NextResponse.redirect(authorizeUrl.toString());
}
