import { notFound, redirect } from 'next/navigation';
import { createClient } from '../../../../lib/supabase/server';
import ListingForm from '../../../../components/ListingForm';

export const metadata = { title: 'Edit Listing' };
export const dynamic = 'force-dynamic';

export default async function EditListingPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in?next=/dashboard');

  const { data: listing } = await supabase.from('listings').select('*').eq('id', id).single();
  if (!listing || listing.owner_id !== user.id) notFound();

  const { data: categories } = await supabase.from('categories').select('*').order('sort_order');

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-semibold text-slate-900">Edit {listing.name}</h1>
      <div className="mt-8">
        <ListingForm categories={categories || []} listing={listing} userId={user.id} />
      </div>
    </div>
  );
}
