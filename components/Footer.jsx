import Link from 'next/link';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  return (
    <footer className="mt-16 bg-sea-900 text-sea-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl font-semibold text-white">
            Saranda<span className="text-sand-400">Guide</span>
          </p>
          <p className="mt-3 max-w-sm text-sm text-sea-200">
            The local guide to Saranda and the Albanian Riviera, made for Saranda lovers.
            Find your next favorite place today.
          </p>
          <p className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-sea-300">
            Saranda tips in your inbox
          </p>
          <div className="max-w-sm">
            <NewsletterForm />
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-sea-300">Explore</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/listings" className="hover:text-white">All listings</Link></li>
            <li><Link href="/map" className="hover:text-white">Map</Link></li>
            <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
            <li><Link href="/blog" className="hover:text-white">Travel guide</Link></li>
            <li><Link href="/itineraries" className="hover:text-white">Itineraries</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-sea-300">Businesses</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/pricing" className="hover:text-white">Add your business</Link></li>
            <li><Link href="/sign-in" className="hover:text-white">Sign in</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact us</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy policy</Link></li>
            <li><Link href="/disclaimer" className="hover:text-white">Disclaimer</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sea-800 py-5 text-center text-xs text-sea-300">
        <p>Faleminderit për vizitën, thanks for visiting! 🇦🇱</p>
        <p className="mt-1">© {new Date().getFullYear()} SarandaGuide.com. All rights reserved.</p>
      </div>
    </footer>
  );
}
