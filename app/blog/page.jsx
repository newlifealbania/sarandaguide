import Link from 'next/link';
import { createClient } from '../../lib/supabase/server';

export const metadata = { title: 'Saranda Travel Guide' };
export const revalidate = 300;

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from('posts')
    .select('title, slug, excerpt, cover_image, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl font-semibold text-slate-900">Travel guide</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Local tips, area guides and everything you need to plan your trip to Saranda.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {(posts || []).map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="card group block">
            {post.cover_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.cover_image} alt="" className="h-44 w-full object-cover" />
            )}
            <div className="p-4">
              <p className="text-xs text-slate-400">
                {new Date(post.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
              <h2 className="mt-1 font-semibold text-slate-900 group-hover:text-sea-700">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-slate-500">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
      {!posts?.length && (
        <p className="mt-16 text-center text-slate-500">Articles coming soon.</p>
      )}
    </div>
  );
}
