import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const VALID_STATUSES = ['pendente', 'pago', 'enviado', 'entregue', 'cancelado'];

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'not authenticated' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: 'not admin' }, { status: 403 });

  const body = await request.json();
  const status = body.status;

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Status inválido.' }, { status: 400 });
  }

  // usa a service role: nao existe policy de UPDATE em orders pra evitar
  // que clientes alterem status/total do proprio pedido direto pela API
  const admin = createAdminClient();
  const { error } = await admin.from('orders').update({ status }).eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: 'Não foi possível atualizar o pedido.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
