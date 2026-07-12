'use client';
import { useState } from 'react';
import { createClient } from '../lib/supabase/client';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | saving | done | error

  async function submit(e) {
    e.preventDefault();
    setState('saving');
    const supabase = createClient();
    const { error } = await supabase.from('subscribers').insert({ email });
    if (error && !error.message.includes('duplicate')) setState('error');
    else setState('done');
  }

  if (state === 'done') {
    return <p className="text-sm text-sea-200">Faleminderit! You're on the list. 🇦🇱</p>;
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full rounded-lg border border-sea-700 bg-sea-800 px-3 py-2 text-sm text-white placeholder:text-sea-400 focus:border-sand-400 focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === 'saving'}
        className="shrink-0 rounded-lg bg-sand-400 px-4 py-2 text-sm font-semibold text-white hover:bg-sand-500"
      >
        {state === 'saving' ? '…' : 'Join'}
      </button>
      {state === 'error' && <p className="text-xs text-red-300">Something went wrong, try again.</p>}
    </form>
  );
}
