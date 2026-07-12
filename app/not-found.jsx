import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-6xl">🌊</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-500">Looks like you drifted off course.</p>
      <Link href="/" className="btn-primary mt-8">Back to home</Link>
    </div>
  );
}
