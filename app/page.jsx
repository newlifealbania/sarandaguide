import Link from 'next/link';
import { createClient } from '../lib/supabase/server';
import ListingCard from '../components/ListingCard';
import SearchBar from '../components/SearchBar';

export const revalidate = 300;

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: listings }, { data: posts }] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order').limit(8),
    supabase
      .from('listings')
      .select('*, categories(name, slug)')
      .eq('status', 'published')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('posts')
      .select('title, slug, excerpt, cover_image, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3)
  ]);

  return (
    <>
      {/* 1. Hero, search front and center */}
      <section
        className="relative bg-sea-800 bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/promenade.jpg')" }}
      >
        <div className="absolute inset-0 bg-sea-900/55" />
        <div className="relative mx-auto max-w-6xl px-4 py-28 text-center">
          <p className="mb-3 text-lg font-medium text-sand-200">
            Mirë se vini në Sarandë! 🇦🇱
          </p>
          <h1 className="font-display text-4xl font-semibold md:text-6xl">
            Discover the best of Saranda
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-sea-100">
            Restaurants, beaches, hotels and things to do on the Albanian Riviera,
            curated by locals.
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* 2. Categories, the fastest path to what visitors want */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-3xl font-semibold text-slate-900">Browse by category</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {(categories || []).map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="card group relative block h-40 overflow-hidden"
            >
              {cat.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-sea-100" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-sea-900/80 via-sea-900/20 to-transparent" />
              <h3 className="absolute bottom-3 left-4 font-semibold text-white">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Latest listings, fresh content, featured first */}
      <section className="bg-sea-50/60">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Latest places</h2>
            <Link href="/listings" className="text-sm font-semibold text-sea-700 hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(listings || []).map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Free travel guide, capture interest while it's hot */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-sea-700 px-8 py-12 text-center text-white md:flex-row md:text-left">
          <div className="text-6xl">📖</div>
          <div className="flex-1">
            <h2 className="font-display text-3xl font-semibold">The free Saranda travel guide</h2>
            <p className="mt-2 max-w-xl text-sea-100">
              Beaches, day trips, food, local phrases and insider tips, everything for your trip
              in one free PDF. No email required.
            </p>
          </div>
          <a
            href="/saranda-travel-guide.pdf"
            download
            className="btn-primary !bg-sand-400 hover:!bg-sand-500"
          >
            Download free guide
          </a>
        </div>
      </section>

      {/* 5. Blog, depth for planners, great for SEO */}
      {posts?.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-16">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Travel guide</h2>
            <Link href="/blog" className="text-sm font-semibold text-sea-700 hover:underline">
              All articles →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card group block">
                {post.cover_image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.cover_image} alt="" className="h-44 w-full object-cover" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 group-hover:text-sea-700">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 6. Speak like a local, charm before the goodbye */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="rounded-3xl border border-sand-200 bg-sand-50 px-8 py-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-sand-500">
            🇦🇱 Speak like a local
          </p>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { sq: 'Përshëndetje!', en: 'Hello!' },
              { sq: 'Faleminderit', en: 'Thank you' },
              { sq: 'Sa kushton?', en: 'How much is it?' },
              { sq: 'Gëzuar!', en: 'Cheers!' }
            ].map((p) => (
              <div key={p.sq}>
                <p className="font-display text-xl font-semibold text-slate-900">{p.sq}</p>
                <p className="mt-1 text-sm text-slate-500">{p.en}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-400">
            Tip: locals nod "no" and shake their head for "yes", don't let it confuse you!
          </p>
        </div>
      </section>

      {/* 7. Business CTA, last, aimed at owners */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div
          className="relative overflow-hidden rounded-3xl bg-sea-800 bg-cover bg-center px-8 py-14 text-center text-white"
          style={{ backgroundImage: "url('/images/sunset.png')" }}
        >
          <div className="absolute inset-0 bg-sea-900/60" />
          <div className="relative">
            <h2 className="font-display text-3xl font-semibold">Own a business in Saranda?</h2>
            <p className="mx-auto mt-3 max-w-lg text-sea-100">
              Get discovered by thousands of travelers. Claim your listing or add a new one in minutes.
            </p>
            <Link href="/pricing" className="btn-primary mt-6 !bg-sand-400 hover:!bg-sand-500">
              List your business
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
