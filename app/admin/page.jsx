import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';
import AdminPanel from '../../components/AdminPanel';

export const metadata = { title: 'Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in?next=/admin');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/dashboard');

  const [
    { data: pendingListings },
    { data: pendingClaims },
    { data: posts },
    { data: allListings },
    { data: messages },
    { count: subscriberCount }
  ] = await Promise.all([
      supabase
        .from('listings')
        .select('*, categories(name), profiles(email, full_name)')
        .eq('status', 'pending')
        .order('created_at'),
      supabase
        .from('claims')
        .select('*, listings(name, slug), profiles(email, full_name)')
        .eq('status', 'pending')
        .order('created_at'),
      supabase.from('posts').select('*').order('created_at', { ascending: false }),
      supabase
        .from('listings')
        .select('id, name, slug, status, claimed, featured, categories(name)')
        .order('created_at', { ascending: false }),
      supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('subscribers').select('*', { count: 'exact', head: true })
    ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-slate-900">Admin panel</h1>
        <Link href="/dashboard" className="text-sm text-sea-700 hover:underline">← Dashboard</Link>
      </div>
      <AdminPanel
        pendingListings={pendingListings || []}
        pendingClaims={pendingClaims || []}
        posts={posts || []}
        allListings={allListings || []}
        messages={messages || []}
        subscriberCount={subscriberCount || 0}
      />
    </div>
  );
}
