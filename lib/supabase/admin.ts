import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Cliente com a service role key — ignora RLS. Nunca importar em código de cliente (browser).
// Usado apenas em rotas de servidor de confiança, como o webhook do Mercado Pago.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurado.');

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
