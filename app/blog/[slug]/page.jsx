import { notFound } from 'next/navigation';
import { marked } from 'marked';
import { createClient } from '../../../lib/supabase/server';

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('posts').select('title, excerpt').eq('slug', slug).single();
  return data ? { title: data.title, description: data.excerpt } : { title: 'Article' };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  if (!post) notFound();

  const html = marked.parse(post.content || '');

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm text-slate-400">
        {new Date(post.created_at).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'long', year: 'numeric'
        })}
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-slate-900">{post.title}</h1>
      {post.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover_image} alt="" className="mt-8 w-full rounded-2xl object-cover" />
      )}
      <div
        className="prose-custom mt-8 space-y-4 leading-relaxed text-slate-700 [&_a]:text-sea-700 [&_a]:underline [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_li]:ml-5 [&_ul]:list-disc [&_ol]:list-decimal"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
