'use client';
import { useState } from 'react';

const plans = [
  { id: 'standard', name: 'Standard', price: '€9.99/mo', blurb: 'Listing page, photos, search visibility.' },
  { id: 'featured', name: 'Featured', price: '€19.99/mo', blurb: 'Everything in Standard + top placement & homepage.' }
];

export default function PlanPicker({ listingId, preselect }) {
  const [plan, setPlan] = useState(preselect || 'standard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function checkout() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, plan })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error || 'Something went wrong.');
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      {plans.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => setPlan(p.id)}
          className={`card w-full p-5 text-left ${plan === p.id ? 'border-2 border-sea-600' : ''}`}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900">{p.name}</span>
            <span className="font-bold text-sea-700">{p.price}</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{p.blurb}</p>
        </button>
      ))}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button onClick={checkout} disabled={loading} className="btn-primary w-full">
        {loading ? 'Redirecting to payment…' : 'Continue to payment'}
      </button>
      <p className="text-center text-xs text-slate-400">
        Secure payment via Lemon Squeezy. Cancel anytime.
      </p>
    </div>
  );
}
