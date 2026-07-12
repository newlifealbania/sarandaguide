import { createClient } from '../../lib/supabase/server';
import ListingCard from '../../components/ListingCard';
import Link from 'next/link';

export const metadata = { title: 'All Listings' };
export const dynamic = 'force-dynamic';

export default async function ListingsPage({ searchParams }) {
  const params = await searchParams;
  const q = params?.q || '';
  const categorySlug = params?.category || '';
  const supabase = await createClient();

  const { data: categories } = await supabase.from('categories').select('*').order('sort_order');

  let query = supabase
    .from('listings')
    .select('*, categories(name, slug)')
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (q) query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%,address.ilike.%${q}%`);
  if (categorySlug) {
    const cat = categories?.find((c) => c.slug === categorySlug);
    if (cat) query = query.eq('category_id', cat.id);
  }

  const { data: listings } = await query;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl font-semibold text-slate-900">
        {q ? `Results for “${q}”` : 'Explore Saranda'}
      </h1>

      {/* Category filter pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/listings"
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            !categorySlug ? 'bg-sea-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All
        </Link>
        {(categories || []).map((cat) => (
          <Link
            key={cat.id}
            href={`/listings?category=${cat.slug}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              categorySlug === cat.slug
                ? 'bg-sea-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {listings?.length ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-slate-500">
          No places found. Try a different search or category.
        </p>
      )}
    </div>
  );
}
