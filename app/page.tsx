import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import ProductGrid from '@/components/ProductGrid';
import Testimonials from '@/components/Testimonials';
import type { Product } from '@/lib/types';

export const revalidate = 0;

export default async function HomePage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8);

  return (
    <>
      <Hero />
      <HowItWorks />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest2 text-ink/50">Recém-chegadas</p>
            <h2 className="font-serif text-3xl sm:text-4xl mt-2">Peças em destaque</h2>
          </div>
          <Link href="/produtos" className="text-xs uppercase tracking-widest2 hover:underline">
            Ver tudo
          </Link>
        </div>
        <ProductGrid products={(products as Product[]) ?? []} />
      </section>

      <Testimonials />
    </>
  );
}
