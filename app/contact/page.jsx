'use client';
import { useState } from 'react';
import { createClient } from '../../lib/supabase/client';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [state, setState] = useState('idle');

  async function submit(e) {
    e.preventDefault();
    setState('saving');
    const supabase = createClient();
    const { error } = await supabase.from('messages').insert(form);
    setState(error ? 'error' : 'done');
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-4xl font-semibold text-slate-900">Contact us</h1>
      <p className="mt-3 text-slate-600">
        Questions about a listing, advertising, or the site? Send us a note and we'll get back to
        you.
      </p>

      {state === 'done' ? (
        <p className="card mt-8 p-6 text-slate-700">
          ✅ Message sent, faleminderit! We'll reply to your email soon.
        </p>
      ) : (
        <form onSubmit={submit} className="card mt-8 space-y-4 p-6">
          <div>
            <label className="label">Your name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="label">Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="label">Message *</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="input"
            />
          </div>
          {state === 'error' && (
            <p className="text-sm text-red-600">Something went wrong, please try again.</p>
          )}
          <button type="submit" disabled={state === 'saving'} className="btn-primary w-full">
            {state === 'saving' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}
    </div>
  );
}
