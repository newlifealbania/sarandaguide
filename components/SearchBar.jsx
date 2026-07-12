'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/listings?q=${encodeURIComponent(q)}`);
      }}
      className="flex overflow-hidden rounded-full bg-white p-1.5 shadow-lg"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search restaurants, hotels, beaches…"
        className="flex-1 bg-transparent px-5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
      />
      <button type="submit" className="btn-primary !px-6 !py-2.5">
        Search
      </button>
    </form>
  );
}
