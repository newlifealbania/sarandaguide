import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import ListingForm from '../../../components/ListingForm';

export const metadata = { title: 'Add Your Business' };
export const dynamic = 'force-dynamic';

export default async function NewListingPage({ searchParams }) {
  const params = await searchParams;
  const plan = params?.plan === 'featured' ? 'featured' : 'standard';

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(`/dashboard/new-listing?plan=${plan}`)}`);

  const { data: categories } = await supabase.from('categories').select('*').order('sort_order');

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-semibold text-slate-900">Add your business</h1>
      <p className="mt-2 text-sm text-slate-500">
        Step 1 of 2 — tell us about your business. You'll choose your plan next.
      </p>
      <div className="mt-8">
        <ListingForm
          categories={categories || []}
          userId={user.id}
          redirectTo={`/dashboard/subscribe/{id}?plan=${plan}`}
        />
      </div>
    </div>
  );
}
