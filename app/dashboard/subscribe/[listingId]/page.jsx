import { notFound, redirect } from 'next/navigation';
import { createClient } from '../../../../lib/supabase/server';
import PlanPicker from '../../../../components/PlanPicker';

export const metadata = { title: 'Choose Your Plan' };
export const dynamic = 'force-dynamic';

export default async function SubscribePage({ params, searchParams }) {
  const { listingId } = await params;
  const sp = await searchParams;
  const preselect = sp?.plan === 'featured' ? 'featured' : 'standard';

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in?next=/dashboard');

  const { data: listing } = await supabase
    .from('listings')
    .select('id, name, owner_id')
    .eq('id', listingId)
    .single();
  if (!listing || listing.owner_id !== user.id) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-3xl font-semibold text-slate-900">
        Choose a plan for {listing.name}
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Step 2 of 2 — your listing goes live once payment is complete and it's approved.
      </p>
      <div className="mt-8">
        <PlanPicker listingId={listing.id} preselect={preselect} />
      </div>
    </div>
  );
}
