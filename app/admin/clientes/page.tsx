import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/types';

export const revalidate = 0;

export default async function AdminClientesPage() {
  const supabase = createClient();
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  const customers = (profiles as Profile[] | null) ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
      <p className="text-xs uppercase tracking-widest2 text-ink/50">Área administrativa</p>
      <h1 className="font-serif text-3xl mt-2 mb-10">Clientes cadastrados</h1>

      <div className="overflow-x-auto border border-ink/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 bg-sand/40 text-left text-xs uppercase tracking-widest2 text-ink/50">
              <th className="px-4 py-3 font-normal">Nome</th>
              <th className="px-4 py-3 font-normal">E-mail</th>
              <th className="px-4 py-3 font-normal">Telefone</th>
              <th className="px-4 py-3 font-normal">CPF</th>
              <th className="px-4 py-3 font-normal">Cadastro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-4 py-3">
                  {customer.full_name || '—'}
                  {customer.is_admin && (
                    <span className="ml-2 text-[10px] uppercase tracking-widest2 text-ink/40">
                      Admin
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{customer.email || '—'}</td>
                <td className="px-4 py-3">{customer.phone || '—'}</td>
                <td className="px-4 py-3">{customer.cpf || '—'}</td>
                <td className="px-4 py-3 text-ink/60">
                  {new Date(customer.created_at).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink/50">
                  Nenhum cliente cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
