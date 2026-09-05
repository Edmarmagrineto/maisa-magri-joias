'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function RedefinirSenhaPage() {
  const supabase = createClient();
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let hasSession = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        hasSession = true;
        setReady(true);
      }
    });

    // caso o evento ja tenha disparado antes do listener ser registrado
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        hasSession = true;
        setReady(true);
      }
    });

    const timeout = setTimeout(() => {
      if (!hasSession) setInvalid(true);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError('Não foi possível salvar a nova senha. Tente pedir o link novamente.');
      return;
    }
    setDone(true);
    setTimeout(() => router.push('/conta'), 1500);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 sm:px-6 py-24 text-center">
        <h1 className="font-serif text-3xl mb-4">Senha redefinida!</h1>
        <p className="text-sm text-ink/60">Levando você para sua conta...</p>
      </div>
    );
  }

  if (invalid) {
    return (
      <div className="mx-auto max-w-md px-4 sm:px-6 py-24 text-center">
        <h1 className="font-serif text-3xl mb-4">Link inválido ou expirado</h1>
        <p className="text-sm text-ink/60">
          Peça um novo link de redefinição na página{' '}
          <a href="/esqueci-senha" className="underline">
            esqueci minha senha
          </a>
          .
        </p>
      </div>
    );
  }

  if (!ready) return null;

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-24">
      <h1 className="font-serif text-3xl text-center mb-2">Criar nova senha</h1>
      <p className="text-sm text-ink/60 text-center mb-10">Escolha uma nova senha para sua conta.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs uppercase tracking-widest2 text-ink/50">Nova senha</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-ink/20 px-3 py-2 mt-1 text-sm bg-transparent outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest2 text-ink/50">Confirmar senha</label>
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-ink/20 px-3 py-2 mt-1 text-sm bg-transparent outline-none focus:border-ink"
          />
        </div>

        {error && <p className="text-xs text-red-700">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-ink text-cream py-3 text-xs uppercase tracking-widest2 hover:bg-ink/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar nova senha'}
        </button>
      </form>
    </div>
  );
}
