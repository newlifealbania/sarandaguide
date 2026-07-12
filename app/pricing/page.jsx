import Link from 'next/link';

export const metadata = { title: 'List Your Business' };

const plans = [
  {
    name: 'Standard',
    plan: 'standard',
    price: '€9.99',
    tagline: 'Get your business in front of travelers.',
    features: [
      'Your own listing page with photos',
      'Contact details, website link & map',
      'Appear in search and category pages',
      'Edit your listing anytime',
      'Collect reviews from visitors'
    ]
  },
  {
    name: 'Featured',
    plan: 'featured',
    price: '€19.99',
    tagline: 'Stand out and get more clicks.',
    highlight: true,
    features: [
      'Everything in Standard',
      '“Featured” badge on your listing',
      'Priority placement at the top of results',
      'Showcased on the homepage',
      'Up to 10 photos'
    ]
  }
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-center font-display text-4xl font-semibold text-slate-900">
        Get discovered by thousands of travelers
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
        Add your business to Saranda's local guide, or claim a listing that's already here.
        Cancel anytime.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {plans.map((p) => (
          <div
            key={p.plan}
            className={`card p-8 ${p.highlight ? 'border-2 border-sand-400 shadow-lg' : ''}`}
          >
            {p.highlight && (
              <span className="rounded-full bg-sand-100 px-3 py-1 text-xs font-semibold text-sand-500">
                Most popular
              </span>
            )}
            <h2 className="mt-3 font-display text-2xl font-semibold text-slate-900">{p.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{p.tagline}</p>
            <p className="mt-4 text-4xl font-bold text-slate-900">
              {p.price}
              <span className="text-base font-normal text-slate-500">/month</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-sea-600">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href={`/dashboard/new-listing?plan=${p.plan}`}
              className={`mt-8 w-full ${p.highlight ? 'btn-primary !bg-sand-400 hover:!bg-sand-500' : 'btn-primary'}`}
            >
              Get started
            </Link>
          </div>
        ))}
      </div>

      <div className="card mt-10 p-8 text-center">
        <h3 className="font-display text-xl font-semibold text-slate-900">
          Is your business already listed?
        </h3>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
          Find your listing and click "Claim it" — once approved, you choose a plan and take
          control of your page.
        </p>
        <Link href="/listings" className="btn-secondary mt-5">
          Find my business
        </Link>
      </div>
    </div>
  );
}
