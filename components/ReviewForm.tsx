'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ReviewForm({
  productId,
  userId,
  authorName,
}: {
  productId: string | null;
  userId: string | null;
  authorName: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!userId) {
    return (
      <p className="text-sm text-ink/60">
        <a href="/entrar" className="underline">
          Entre na sua conta
        </a>{' '}
        para deixar uma avaliação.
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: insertError } = await supabase.from('reviews').insert({
      product_id: productId,
      user_id: userId,
      author_name: authorName,
      rating,
      comment: comment.trim() || null,
    });

    setLoading(false);
    if (insertError) {
      setError('Não foi possível enviar sua avaliação. Tente novamente.');
      return;
    }
    setComment('');
    setRating(5);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="border border-ink/15 p-4 space-y-3">
      <p className="text-xs uppercase tracking-widest2 text-ink/50">Deixe sua avaliação</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} estrelas`}>
            <svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill={n <= rating ? '#111111' : 'none'}
              stroke="#111111"
              strokeWidth={1}
            >
              <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6L1.3 7.7l6.1-.6z" />
            </svg>
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Conte como foi sua experiência com a peça..."
        rows={3}
        className="w-full border border-ink/20 px-3 py-2 text-sm bg-transparent outline-none focus:border-ink"
      />
      {error && <p className="text-xs text-red-700">{error}</p>}
      <button
        disabled={loading}
        className="bg-ink text-cream px-6 py-2 text-xs uppercase tracking-widest2 hover:bg-ink/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Enviar avaliação'}
      </button>
    </form>
  );
}
