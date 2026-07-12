import { notFound, redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import ClaimForm from '../../../components/ClaimForm';

export const metadata = { title: 'Claim Your Listing' };
export const dynamic = 'force-dynamic';

export default async function ClaimPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(`/claim/${slug}`)}`);

  const { data: listing } = await supabase
    .from('listings')
    .select('id, name, slug, claimed, address')
    .eq('slug', slug)
    .single();
  if (!listing) notFound();

  const { data: existingClaim } = await supabase
    .from('claims')
    .select('status')
    .eq('listing_id', listing.id)
    .eq('user_id', user.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-3xl font-semibold text-slate-900">
        Claim “{listing.name}”
      </h1>
      {listing.claimed ? (
        <p className="mt-4 text-slate-600">
          This listing has already been claimed. If you believe this is a mistake, contact us.
        </p>
      ) : existingClaim ? (
        <p className="mt-4 text-slate-600">
          You've already submitted a claim for this listing — status:{' '}
          <strong>{existingClaim.status}</strong>. We'll email you once it's reviewed.
        </p>
      ) : (
        <>
          <p className="mt-3 text-sm text-slate-500">
            Tell us how you're connected to this business so we can verify your claim. Once
            approved, you'll pick a plan and take control of the page.
          </p>
          <div className="mt-8">
            <ClaimForm listingId={listing.id} userId={user.id} />
          </div>
        </>
      )}
    </div>
  );
}
