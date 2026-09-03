'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function EntrarPage() {
  return (
    <Suspense fallback={null}>
      <EntrarForm />
    </Suspense>
  );
}

function EntrarForm() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/conta';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (signInError) {
      setError('E-mail ou senha incorretos.');
      return;
    }
    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-24">
      <h1 className="font-serif text-3xl text-center mb-2">Entrar</h1>
      <p className="text-sm text-ink/60 text-center mb-10">Acesse sua conta para acompanhar pedidos e avaliações.</p>

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
        <div>
          <label className="text-xs uppercase tracking-widest2 text-ink/50">Senha</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-ink/20 px-3 py-2 mt-1 text-sm bg-transparent outline-none focus:border-ink"
          />
        </div>

        {error && <p className="text-xs text-red-700">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-ink text-cream py-3 text-xs uppercase tracking-widest2 hover:bg-ink/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="text-sm text-center text-ink/60 mt-6">
        Ainda não tem conta?{' '}
        <Link href={`/cadastro?redirect=${redirect}`} className="underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
