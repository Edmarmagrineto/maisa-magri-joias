import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') ?? '').trim();

  if (q.length < 2) {
    return NextResponse.json({ products: [] });
  }

  const supabase = createClient();
  const { data: products } = await supabase
    .from('products')
    .select('id, name, category, price, image_url')
    .eq('is_active', true)
    .ilike('name', `%${q}%`)
    .order('name', { ascending: true })
    .limit(8);

  return NextResponse.json({ products: products ?? [] });
}
