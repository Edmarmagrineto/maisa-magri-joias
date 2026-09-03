'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <button onClick={handleLogout} className="text-xs uppercase tracking-widest2 underline">
      Sair da conta
    </button>
  );
}
