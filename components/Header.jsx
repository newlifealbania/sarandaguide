import Link from 'next/link';
import { createClient } from '../lib/supabase/server';

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-2xl font-semibold text-sea-800">
          <span aria-hidden="true">🇦🇱</span>
          <span>
            Saranda<span className="text-sand-500">Guide</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/listings" className="hover:text-sea-700">Explore</Link>
          <Link href="/categories" className="hover:text-sea-700">Categories</Link>
          <Link href="/blog" className="hover:text-sea-700">Travel Guide</Link>
          <Link href="/pricing" className="hover:text-sea-700">For Businesses</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className="btn-primary !px-4 !py-2">Dashboard</Link>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm font-medium text-slate-600 hover:text-sea-700">
                Sign in
              </Link>
              <Link href="/pricing" className="btn-primary !px-4 !py-2">
                Add your business
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
