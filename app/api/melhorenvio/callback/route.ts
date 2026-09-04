import { NextResponse } from 'next/server';
import { saveToken } from '@/lib/melhorenvio';

// Callback do OAuth2 do Melhor Envio: troca o "code" recebido por um access_token
// e refresh_token, e guarda os dois no banco pra ser usado no calculo de frete.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || url.origin;

  if (!code) {
    return NextResponse.redirect(`${siteUrl}/admin?melhorenvio=erro`);
  }

  const clientId = process.env.MELHORENVIO_CLIENT_ID;
  const clientSecret = process.env.MELHORENVIO_CLIENT_SECRET;
  const redirectUri = process.env.MELHORENVIO_REDIRECT_URI || `${siteUrl}/api/melhorenvio/callback`;
  const contact = process.env.ORDER_NOTIFICATION_EMAIL || 'contato@maisamagri.com.br';

  try {
    const res = await fetch('https://melhorenvio.com.br/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': `Maisa Magri (${contact})`,
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      }),
    });

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    await saveToken(data);

    return NextResponse.redirect(`${siteUrl}/admin?melhorenvio=conectado`);
  } catch (err) {
    console.error('Erro ao trocar codigo por token do Melhor Envio:', err);
    return NextResponse.redirect(`${siteUrl}/admin?melhorenvio=erro`);
  }
}
