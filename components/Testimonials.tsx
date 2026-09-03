import { createClient } from '@/lib/supabase/server';
import StarRating from '@/components/StarRating';

export default async function Testimonials() {
  const supabase = createClient();
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .is('product_id', null)
    .order('created_at', { ascending: false })
    .limit(3);

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="bg-sand/60 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest2 text-ink/50">Quem já comprou</p>
          <h2 className="font-serif text-3xl sm:text-4xl mt-2">Avaliações de clientes</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 text-center">
              <div className="flex justify-center mb-3">
                <StarRating rating={review.rating} />
              </div>
              {review.comment && (
                <p className="text-sm text-ink/70 italic leading-relaxed">“{review.comment}”</p>
              )}
              <p className="mt-4 text-xs uppercase tracking-widest2 text-ink/50">
                {review.author_name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
