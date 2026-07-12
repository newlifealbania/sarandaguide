import { notFound } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import ListingCard from '../../../components/ListingCard';

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: cat } = await supabase.from('categories').select('name, description').eq('slug', slug).single();
  return cat
    ? { title: `${cat.name} in Saranda`, description: cat.description }
    : { title: 'Category' };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase.from('categories').select('*').eq('slug', slug).single();
  if (!category) notFound();

  const { data: listings } = await supabase
    .from('listings')
    .select('*, categories(name, slug)')
    .eq('status', 'published')
    .eq('category_id', category.id)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl font-semibold text-slate-900">{category.name}</h1>
      {category.description && <p className="mt-3 max-w-2xl text-slate-600">{category.description}</p>}
      {listings?.length ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-slate-500">No listings in this category yet.</p>
      )}
    </div>
  );
}
