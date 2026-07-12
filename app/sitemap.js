import { createClient } from '../lib/supabase/server';

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://sarandaguide.com';
  const supabase = await createClient();

  const [{ data: listings }, { data: categories }, { data: posts }] = await Promise.all([
    supabase.from('listings').select('slug, updated_at').eq('status', 'published'),
    supabase.from('categories').select('slug'),
    supabase.from('posts').select('slug, created_at').eq('published', true)
  ]);

  const staticPages = [
    '', '/listings', '/categories', '/blog', '/pricing', '/map',
    '/itineraries', '/itineraries/3-days-in-saranda', '/itineraries/7-days-in-saranda',
    '/privacy', '/disclaimer'
  ].map((path) => ({ url: `${base}${path}`, changeFrequency: 'weekly', priority: path === '' ? 1 : 0.7 }));

  return [
    ...staticPages,
    ...(listings || []).map((l) => ({
      url: `${base}/listing/${l.slug}`,
      lastModified: l.updated_at,
      changeFrequency: 'weekly',
      priority: 0.8
    })),
    ...(categories || []).map((c) => ({
      url: `${base}/category/${c.slug}`,
      changeFrequency: 'weekly',
      priority: 0.8
    })),
    ...(posts || []).map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.created_at,
      changeFrequency: 'monthly',
      priority: 0.6
    }))
  ];
}
