import { createClient } from '../../lib/supabase/server';
import MapView from '../../components/MapView';

export const metadata = {
  title: 'Map of Saranda',
  description: 'Explore restaurants, hotels, beaches and things to do in Saranda on an interactive map.'
};
export const revalidate = 300;

export default async function MapPage() {
  const supabase = await createClient();
  const { data: listings } = await supabase
    .from('listings')
    .select('name, slug, lat, lng, featured, categories(name)')
    .eq('status', 'published')
    .not('lat', 'is', null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl font-semibold text-slate-900">Explore the map</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Every place on SarandaGuide, pinned. Gold pins are featured partners. Click any pin for
        details.
      </p>
      <div className="mt-8">
        <MapView listings={listings || []} />
      </div>
    </div>
  );
}
