import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth';
import AdminProductForm from '@/components/AdminProductForm';

export default async function NovaPecaPage() {
  const { user, profile } = await getCurrentProfile();
  if (!user) redirect('/entrar?redirect=/admin/produtos/novo');
  if (!profile?.is_admin) redirect('/conta');

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <p className="text-xs uppercase tracking-widest2 text-ink/50">Área administrativa</p>
      <h1 className="font-serif text-3xl mt-2 mb-10">Adicionar nova peça</h1>
      <AdminProductForm />
    </div>
  );
}
