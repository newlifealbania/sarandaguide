'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '../../lib/supabase/client';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';

  const [mode, setMode] = useState('sign-in'); // 'sign-in' | 'sign-up'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    const supabase = createClient();

    if (mode === 'sign-up') {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (err) setError(err.message);
      else setMessage('Check your email to confirm your account, then sign in.');
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError(err.message);
      else {
        router.push(next);
        router.refresh();
      }
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-center font-display text-3xl font-semibold text-slate-900">
        {mode === 'sign-in' ? 'Welcome back' : 'Create your account'}
      </h1>
      <p className="mt-2 text-center text-sm text-slate-500">
        {mode === 'sign-in'
          ? 'Sign in to manage your listings.'
          : 'Sign up to add or claim your business.'}
      </p>

      <form onSubmit={submit} className="card mt-8 space-y-4 p-6">
        {mode === 'sign-up' && (
          <div>
            <label className="label">Your name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" required />
          </div>
        )}
        <div>
          <label className="label">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" minLength={8} required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        {mode === 'sign-in' ? (
          <>No account?{' '}
            <button onClick={() => setMode('sign-up')} className="text-sea-700 underline">Sign up</button>
          </>
        ) : (
          <>Already have an account?{' '}
            <button onClick={() => setMode('sign-in')} className="text-sea-700 underline">Sign in</button>
          </>
        )}
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
