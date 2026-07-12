'use client';
import { useEffect, useRef } from 'react';

export default function MapView({ listings }) {
  const ref = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !ref.current || mapRef.current) return;

      const map = L.map(ref.current).setView([39.875, 20.005], 13);
      mapRef.current = map;

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      const points = [];
      for (const l of listings) {
        if (!l.lat || !l.lng) continue;
        const marker = L.circleMarker([l.lat, l.lng], {
          radius: 9,
          fillColor: l.featured ? '#d68f3c' : '#1f86a3',
          fillOpacity: 0.9,
          color: '#ffffff',
          weight: 2
        }).addTo(map);
        marker.bindPopup(
          `<strong>${l.name}</strong><br/>${l.categories?.name || ''}<br/><a href="/listing/${l.slug}">View listing →</a>`
        );
        points.push([l.lat, l.lng]);
      }
      if (points.length > 1) map.fitBounds(points, { padding: [40, 40] });
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [listings]);

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={ref} className="h-[70vh] w-full rounded-2xl border border-slate-200" />
    </>
  );
}
