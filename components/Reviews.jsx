'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabase/client';

export default function Reviews({ listingId, reviews, user }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { error: err } = await supabase.from('reviews').upsert(
      { listing_id: listingId, user_id: user.id, rating, comment },
      { onConflict: 'listing_id,user_id' }
    );
    setSaving(false);
    if (err) setError(err.message);
    else {
      setComment('');
      router.refresh();
    }
  }

  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-semibold text-slate-900">
        Reviews ({reviews.length})
      </h2>

      {user ? (
        <form onSubmit={submit} className="card mt-6 space-y-4 p-6">
          <div>
            <label className="label">Your rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`text-2xl ${n <= rating ? '' : 'grayscale opacity-40'}`}
                  aria-label={`${n} stars`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Your review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="input"
              placeholder="Share your experience…"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Posting…' : 'Post review'}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          <a href="/sign-in" className="text-sea-700 underline">Sign in</a> to leave a review.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-900">{r.profiles?.full_name || 'Traveler'}</p>
              <span className="text-sm">{'⭐'.repeat(r.rating)}</span>
            </div>
            {r.comment && <p className="mt-2 text-sm text-slate-600">{r.comment}</p>}
            <p className="mt-2 text-xs text-slate-400">
              {new Date(r.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
