import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';
import SignOutButton from '../../components/SignOutButton';

export const metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in?next=/dashboard');

  const [{ data: profile }, { data: listings }, { data: subs }, { data: claims }] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('listings').select('*, categories(name)').eq('owner_id', user.id).order('created_at', { ascending: false }),
      supabase.from('subscriptions').select('*').eq('user_id', user.id),
      supabase.from('claims').select('*, listings(name, slug)').eq('user_id', user.id).order('created_at', { ascending: false })
    ]);

  const activeStatuses = ['active', 'on_trial', 'past_due', 'cancelled'];
  const subFor = (listingId) =>
    subs?.find((s) => s.listing_id === listingId && activeStatuses.includes(s.status));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-slate-900">
            Hi{profile?.full_name ? `, ${profile.full_name}` : ''} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">Manage your listings and subscription.</p>
        </div>
        <div className="flex items-center gap-3">
          {profile?.role === 'admin' && (
            <Link href="/admin" className="btn-secondary !px-4 !py-2">Admin panel</Link>
          )}
          <Link href="/dashboard/new-listing" className="btn-primary !px-4 !py-2">+ New listing</Link>
          <SignOutButton />
        </div>
      </div>

      {/* Listings */}
      <h2 className="mt-12 font-display text-xl font-semibold text-slate-900">Your listings</h2>
      {listings?.length ? (
        <div className="mt-4 space-y-4">
          {listings.map((l) => {
            const sub = subFor(l.id);
            return (
              <div key={l.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold text-slate-900">{l.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {l.categories?.name || 'No category'} ·{' '}
                    <span className={l.status === 'published' ? 'text-green-600' : 'text-amber-600'}>
                      {l.status === 'published' ? 'Live' : 'Pending approval'}
                    </span>
                    {sub ? ` · ${sub.plan} plan` : ' · no active subscription'}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!sub && (
                    <Link href={`/dashboard/subscribe/${l.id}`} className="btn-primary !px-4 !py-2">
                      Activate subscription
                    </Link>
                  )}
                  <Link href={`/dashboard/edit/${l.id}`} className="btn-secondary !px-4 !py-2">
                    Edit
                  </Link>
                  {l.status === 'published' && (
                    <Link href={`/listing/${l.slug}`} className="btn-secondary !px-4 !py-2">
                      View
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          No listings yet.{' '}
          <Link href="/dashboard/new-listing" className="text-sea-700 underline">Add your first listing</Link>{' '}
          or <Link href="/listings" className="text-sea-700 underline">claim an existing one</Link>.
        </p>
      )}

      {/* Claims */}
      {claims?.length > 0 && (
        <>
          <h2 className="mt-12 font-display text-xl font-semibold text-slate-900">Your claims</h2>
          <div className="mt-4 space-y-3">
            {claims.map((c) => (
              <div key={c.id} className="card flex items-center justify-between p-4 text-sm">
                <span className="font-medium text-slate-900">{c.listings?.name}</span>
                <span
                  className={
                    c.status === 'approved'
                      ? 'text-green-600'
                      : c.status === 'rejected'
                        ? 'text-red-600'
                        : 'text-amber-600'
                  }
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
