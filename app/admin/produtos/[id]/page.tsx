import { notFound, redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import AdminProductForm from '@/components/AdminProductForm';
import type { Product } from '@/lib/types';

export default async function EditarPecaPage({ params }: { params: { id: string } }) {
  const { user, profile } = await getCurrentProfile();
  if (!user) redirect(`/entrar?redirect=/admin/produtos/${params.id}`);
  if (!profile?.is_admin) redirect('/conta');

  const supabase = createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <p className="text-xs uppercase tracking-widest2 text-ink/50">Área administrativa</p>
      <h1 className="font-serif text-3xl mt-2 mb-10">Editar peça</h1>
      <AdminProductForm product={product as Product} />
    </div>
  );
}
