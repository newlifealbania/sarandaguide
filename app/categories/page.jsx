import Link from 'next/link';
import { createClient } from '../../lib/supabase/server';

export const metadata = { title: 'Categories' };
export const revalidate = 300;

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order');

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl font-semibold text-slate-900">Categories</h1>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(categories || []).map((cat) => (
          <Link key={cat.id} href={`/category/${cat.slug}`} className="card group block overflow-hidden">
            {cat.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cat.image_url}
                alt={cat.name}
                className="h-40 w-full object-cover transition duration-300 group-hover:scale-105"
              />
            )}
            <div className="p-6">
              <h2 className="font-display text-xl font-semibold text-slate-900">{cat.name}</h2>
              <p className="mt-2 text-sm text-slate-500">{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
