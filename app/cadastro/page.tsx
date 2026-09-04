'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatCPF, formatPhone, isValidCPF, isValidPhone } from '@/lib/validators';

export default function CadastroPage() {
  return (
    <Suspense fallback={null}>
      <CadastroForm />
    </Suspense>
  );
}

function CadastroForm() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/conta';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!isValidPhone(phone)) {
      setError('Digite um telefone válido, com DDD.');
      return;
    }
    if (!isValidCPF(cpf)) {
      setError('Digite um CPF válido.');
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, phone, cpf } },
    });

    setLoading(false);

    if (signUpError) {
      setError(
        signUpError.message.includes('already registered')
          ? 'Este e-mail já possui cadastro.'
          : 'Não foi possível criar sua conta. Verifique os dados e tente novamente.'
      );
      return;
    }

    if (data.session) {
      router.push(redirect);
      router.refresh();
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 sm:px-6 py-24 text-center">
        <h1 className="font-serif text-3xl mb-4">Confirme seu e-mail</h1>
        <p className="text-sm text-ink/60">
          Enviamos um link de confirmação para <strong>{email}</strong>. Depois de confirmar, é só entrar normalmente.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-24">
      <h1 className="font-serif text-3xl text-center mb-2">Criar conta</h1>
      <p className="text-sm text-ink/60 text-center mb-10">
        Leva menos de um minuto e você já pode comprar e avaliar peças.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs uppercase tracking-widest2 text-ink/50">Nome</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-ink/20 px-3 py-2 mt-1 text-sm bg-transparent outline-none focus:border-ink"
          />
        </div>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest2 text-ink/50">Telefone</label>
            <input
              required
              inputMode="numeric"
              placeholder="(11) 91234-5678"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              className="w-full border border-ink/20 px-3 py-2 mt-1 text-sm bg-transparent outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest2 text-ink/50">CPF</label>
            <input
              required
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(formatCPF(e.target.value))}
              className="w-full border border-ink/20 px-3 py-2 mt-1 text-sm bg-transparent outline-none focus:border-ink"
            />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest2 text-ink/50">Senha</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-ink/20 px-3 py-2 mt-1 text-sm bg-transparent outline-none focus:border-ink"
          />
        </div>

        {error && <p className="text-xs text-red-700">{error}</p>}

        <p className="text-[11px] text-ink/40 leading-relaxed">
          Ao criar sua conta, você concorda com nossos{' '}
          <Link href="/termos-de-uso" className="underline hover:no-underline">
            Termos de Uso
          </Link>{' '}
          e com nossa{' '}
          <Link href="/politica-de-privacidade" className="underline hover:no-underline">
            Política de Privacidade
          </Link>
          .
        </p>

        <button
          disabled={loading}
          className="w-full bg-ink text-cream py-3 text-xs uppercase tracking-widest2 hover:bg-ink/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Criando...' : 'Criar conta'}
        </button>
      </form>

      <p className="text-sm text-center text-ink/60 mt-6">
        Já tem conta?{' '}
        <Link href={`/entrar?redirect=${redirect}`} className="underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
