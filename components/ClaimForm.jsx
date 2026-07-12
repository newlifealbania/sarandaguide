'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabase/client';

export default function ClaimForm({ listingId, userId }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { error: err } = await supabase
      .from('claims')
      .insert({ listing_id: listingId, user_id: userId, message });
    setSaving(false);
    if (err) setError(err.message);
    else {
      setDone(true);
      router.refresh();
    }
  }

  if (done) {
    return (
      <p className="card p-6 text-slate-700">
        ✅ Claim submitted! We'll review it and email you. You can check the status anytime in
        your <a href="/dashboard" className="text-sea-700 underline">dashboard</a>.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      <div>
        <label className="label">How are you connected to this business? *</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="input"
          placeholder="e.g. I'm the owner, you can verify by calling the number on our website…"
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving ? 'Submitting…' : 'Submit claim'}
      </button>
    </form>
  );
}
