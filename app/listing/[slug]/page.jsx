import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import Reviews from '../../../components/Reviews';

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('listings').select('name, description').eq('slug', slug).single();
  return data
    ? { title: data.name, description: data.description?.slice(0, 155) }
    : { title: 'Listing' };
}

export default async function ListingPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from('listings')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (!listing) notFound();

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, profiles(full_name)')
    .eq('listing_id', listing.id)
    .order('created_at', { ascending: false });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const avg =
    reviews?.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const images = listing.images || [];

  // Structured data so Google can show rich results for this business
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: listing.name,
    description: listing.description?.slice(0, 300),
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sarandaguide.com'}/listing/${listing.slug}`,
    ...(listing.address && { address: { '@type': 'PostalAddress', streetAddress: listing.address, addressLocality: 'Sarandë', addressCountry: 'AL' } }),
    ...(listing.phone && { telephone: listing.phone }),
    ...(images[0] && { image: images[0] }),
    ...(listing.price_range && { priceRange: listing.price_range }),
    ...(avg && {
      aggregateRating: { '@type': 'AggregateRating', ratingValue: avg, reviewCount: reviews.length }
    })
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500">
        <Link href="/listings" className="hover:text-sea-700">Listings</Link>
        {listing.categories && (
          <>
            {' / '}
            <Link href={`/category/${listing.categories.slug}`} className="hover:text-sea-700">
              {listing.categories.name}
            </Link>
          </>
        )}
      </nav>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold text-slate-900">{listing.name}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-slate-600">
            {avg && <span>⭐ {avg} ({reviews.length})</span>}
            {listing.price_range && <span>{listing.price_range}</span>}
            {listing.featured && (
              <span className="rounded-full bg-sand-100 px-3 py-0.5 text-xs font-semibold text-sand-500">
                Featured
              </span>
            )}
          </div>
        </div>
        {!listing.claimed && (
          <Link href={`/claim/${listing.slug}`} className="btn-secondary">
            Own this business? Claim it
          </Link>
        )}
      </div>

      {/* Gallery */}
      {images.length > 0 && (
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {images.slice(0, 6).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={`${listing.name} photo ${i + 1}`}
              className={`h-56 w-full rounded-2xl object-cover ${i === 0 ? 'md:col-span-2 md:h-full md:row-span-2' : ''}`}
            />
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl font-semibold text-slate-900">About</h2>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-700">
            {listing.description}
          </p>

          <Reviews listingId={listing.id} reviews={reviews || []} user={user} />
        </div>

        {/* Info sidebar */}
        <aside className="card h-fit p-6">
          <h3 className="font-semibold text-slate-900">Details</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {listing.address && <li>📍 {listing.address}</li>}
            {listing.phone && (
              <li>
                📞 <a href={`tel:${listing.phone}`} className="text-sea-700 hover:underline">{listing.phone}</a>
              </li>
            )}
            {listing.website && (
              <li>
                🔗{' '}
                <a href={listing.website} target="_blank" rel="noopener noreferrer" className="text-sea-700 hover:underline">
                  Website
                </a>
              </li>
            )}
            {listing.opening_hours && <li>🕐 {listing.opening_hours}</li>}
          </ul>
          {listing.lat && listing.lng && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${listing.lat},${listing.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6 w-full"
            >
              Open in Google Maps
            </a>
          )}
        </aside>
      </div>
    </div>
  );
}
