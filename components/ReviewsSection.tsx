import { createClient } from '@/lib/supabase/server';
import { getCurrentProfile } from '@/lib/auth';
import StarRating from '@/components/StarRating';
import ReviewForm from '@/components/ReviewForm';

export default async function ReviewsSection({ productId }: { productId: string }) {
  const supabase = createClient();
  const { user, profile } = await getCurrentProfile();

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  const list = reviews ?? [];
  const average =
    list.length > 0 ? list.reduce((sum, r) => sum + r.rating, 0) / list.length : 0;

  return (
    <section className="mt-20">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="font-serif text-2xl">Avaliações</h2>
        {list.length > 0 && (
          <>
            <StarRating rating={average} />
            <span className="text-sm text-ink/60">
              {average.toFixed(1)} · {list.length} avaliação{list.length > 1 ? 'ões' : ''}
            </span>
          </>
        )}
      </div>

      <div className="grid gap-8 sm:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {list.length === 0 && (
            <p className="text-sm text-ink/50">Esta peça ainda não tem avaliações. Seja a primeira pessoa a avaliar!</p>
          )}
          {list.map((review) => (
            <div key={review.id} className="border-b border-ink/10 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <StarRating rating={review.rating} />
                <span className="text-xs uppercase tracking-widest2 text-ink/50">
                  {review.author_name}
                </span>
              </div>
              {review.comment && <p className="text-sm text-ink/70">{review.comment}</p>}
            </div>
          ))}
        </div>

        <ReviewForm
          productId={productId}
          userId={user?.id ?? null}
          authorName={profile?.full_name || user?.email || 'Cliente'}
        />
      </div>
    </section>
  );
}
