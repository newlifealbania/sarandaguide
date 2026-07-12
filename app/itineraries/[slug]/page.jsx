import Link from 'next/link';
import { notFound } from 'next/navigation';
import { itineraries } from '../../../lib/itineraries';

export function generateStaticParams() {
  return Object.keys(itineraries).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const it = itineraries[slug];
  return it ? { title: it.title, description: it.description } : { title: 'Itinerary' };
}

export default async function ItineraryPage({ params }) {
  const { slug } = await params;
  const it = itineraries[slug];
  if (!it) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <nav className="text-sm text-slate-500">
        <Link href="/itineraries" className="hover:text-sea-700">Itineraries</Link>
      </nav>
      <h1 className="mt-3 font-display text-4xl font-semibold text-slate-900">{it.title}</h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={it.image} alt="" className="mt-8 w-full rounded-2xl object-cover" />
      <p className="mt-8 leading-relaxed text-slate-700">{it.intro}</p>

      <div className="mt-10 space-y-8">
        {it.days.map((day) => (
          <section key={day.name}>
            <h2 className="font-display text-2xl font-semibold text-sea-700">{day.name}</h2>
            <ul className="mt-3 space-y-2">
              {day.items.map((item, i) => (
                <li key={i} className="flex gap-3 leading-relaxed text-slate-700">
                  <span className="mt-1 text-sand-500">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-3xl bg-sea-50 p-8 text-center">
        <h2 className="font-display text-xl font-semibold text-slate-900">
          Want the full guide in your pocket?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          Beaches, food, phrases and practical tips, all in our free PDF travel guide.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a href="/saranda-travel-guide.pdf" download className="btn-primary">
            Download the free guide
          </a>
          <Link href="/listings" className="btn-secondary">
            Browse places
          </Link>
        </div>
      </div>
    </article>
  );
}
