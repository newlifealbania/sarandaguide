import Link from 'next/link';
import { itineraries } from '../../lib/itineraries';

export const metadata = {
  title: 'Saranda Itineraries',
  description: 'Ready-made 3-day and 7-day itineraries for Saranda and the Albanian Riviera.'
};

export default function ItinerariesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl font-semibold text-slate-900">Itineraries</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Ready-made plans, built by locals. Follow them as-is or steal the best bits.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {Object.entries(itineraries).map(([slug, it]) => (
          <Link key={slug} href={`/itineraries/${slug}`} className="card group block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.image} alt="" className="h-52 w-full object-cover" />
            <div className="p-6">
              <h2 className="font-display text-2xl font-semibold text-slate-900 group-hover:text-sea-700">
                {it.title}
              </h2>
              <p className="mt-2 text-sm text-slate-500">{it.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
