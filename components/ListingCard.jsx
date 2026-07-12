import Link from 'next/link';

export default function ListingCard({ listing }) {
  const image = listing.images?.[0];
  return (
    <Link href={`/listing/${listing.slug}`} className="card group block">
      <div className="relative h-48 w-full overflow-hidden bg-sea-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={listing.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">🌊</div>
        )}
        {listing.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-sand-400 px-3 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-slate-900 group-hover:text-sea-700">{listing.name}</h3>
          {listing.price_range && (
            <span className="shrink-0 text-xs text-slate-500">{listing.price_range}</span>
          )}
        </div>
        {listing.categories?.name && (
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-sea-600">
            {listing.categories.name}
          </p>
        )}
        {listing.address && (
          <p className="mt-2 line-clamp-1 text-sm text-slate-500">📍 {listing.address}</p>
        )}
      </div>
    </Link>
  );
}
