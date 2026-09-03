const RESEND_API = 'https://api.resend.com/emails';

// Enquanto o domínio maisamagri.com.br não estiver verificado no Resend,
// use o remetente de testes deles (onboarding@resend.dev) — funciona sem configuração extra.
const DEFAULT_FROM = 'Maisa Magri <onboarding@resend.dev>';

export async function sendEmail(params: { to: string | string[]; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY não configurado — e-mail não enviado.');
    return;
  }

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Falha ao enviar e-mail via Resend: ${res.status} ${body}`);
  }
}
