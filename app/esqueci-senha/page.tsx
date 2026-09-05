'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function EsqueciSenhaPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/redefinir-senha`,
    });

    setLoading(false);

    if (resetError) {
      setError('Não foi possível enviar o e-mail. Verifique o endereço e tente novamente.');
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-md px-4 sm:px-6 py-24 text-center">
        <h1 className="font-serif text-3xl mb-4">Confira seu e-mail</h1>
        <p className="text-sm text-ink/60">
          Se <strong>{email}</strong> tiver uma conta cadastrada, enviamos um link para redefinir a
          senha. Ele vale por algumas horas.
        </p>
        <Link href="/entrar" className="inline-block mt-8 text-sm underline">
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-24">
      <h1 className="font-serif text-3xl text-center mb-2">Esqueceu a senha?</h1>
      <p className="text-sm text-ink/60 text-center mb-10">
        Digite seu e-mail e enviamos um link para você criar uma senha nova.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs uppercase tracking-widest2 text-ink/50">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-ink/20 px-3 py-2 mt-1 text-sm bg-transparent outline-none focus:border-ink"
          />
        </div>

        {error && <p className="text-xs text-red-700">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-ink text-cream py-3 text-xs uppercase tracking-widest2 hover:bg-ink/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar link de redefinição'}
        </button>
      </form>

      <p className="text-sm text-center text-ink/60 mt-6">
        <Link href="/entrar" className="underline">
          Voltar para o login
        </Link>
      </p>
    </div>
  );
}
