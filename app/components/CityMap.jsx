'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// ─── Category config ─────────────────────────────────────────────────────────
// Each place you add gets one of these categories.
// Color is used for the map marker dot; emoji appears in the info card.
export const CATEGORY = {
  food:     { label: 'Food',     emoji: '🍴', color: '#f43f5e', ring: '#fecdd3' },
  coffee:   { label: 'Coffee',   emoji: '☕', color: '#d97706', ring: '#fde68a' },
  outdoors: { label: 'Outdoors', emoji: '🌿', color: '#16a34a', ring: '#bbf7d0' },
  culture:  { label: 'Culture',  emoji: '🎨', color: '#7c3aed', ring: '#ddd6fe' },
  other:    { label: 'Other',    emoji: '📍', color: '#64748b', ring: '#e2e8f0' },
};

// ─── Warm map style ───────────────────────────────────────────────────────────
// Desaturated, parchment-toned — matches the rose/warm aesthetic of the site.
const WARM_STYLE = [
  { elementType: 'geometry',           stylers: [{ color: '#f5f0e8' }] },
  { elementType: 'labels.text.fill',   stylers: [{ color: '#8b7355' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#faf7f2' }] },
  { featureType: 'water',              elementType: 'geometry', stylers: [{ color: '#d4e4ee' }] },
  { featureType: 'water',              elementType: 'labels.text.fill', stylers: [{ color: '#8eafc2' }] },
  { featureType: 'road',               elementType: 'geometry', stylers: [{ color: '#ede8de' }] },
  { featureType: 'road.arterial',      elementType: 'geometry', stylers: [{ color: '#e5ddd0' }] },
  { featureType: 'road.highway',       elementType: 'geometry', stylers: [{ color: '#ddd5c5' }] },
  { featureType: 'road.highway',       elementType: 'geometry.stroke', stylers: [{ color: '#c9beae' }] },
  { featureType: 'landscape.natural',  elementType: 'geometry', stylers: [{ color: '#eae5d8' }] },
  { featureType: 'poi.park',           elementType: 'geometry', stylers: [{ color: '#d8e8cc' }] },
  { featureType: 'poi.park',           elementType: 'labels.text.fill', stylers: [{ color: '#7a9e6a' }] },
  { featureType: 'poi',                elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit',            elementType: 'geometry', stylers: [{ color: '#e0d8cc' }] },
  { featureType: 'transit',            elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative',     elementType: 'geometry.stroke', stylers: [{ color: '#c9beae' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels', stylers: [{ visibility: 'off' }] },
];

// ─── SVG marker factory ───────────────────────────────────────────────────────
// Returns a data-URL SVG so each category gets its own colored dot.
function markerIcon(color, isSelected = false) {
  const size = isSelected ? 18 : 12;
  const stroke = isSelected ? 3 : 2;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size * 3}" height="${size * 3}" viewBox="0 0 ${size * 3} ${size * 3}">
      <circle cx="${size * 1.5}" cy="${size * 1.5}" r="${size - stroke}" fill="${color}" stroke="white" stroke-width="${stroke}"/>
    </svg>`;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: { width: size * 3, height: size * 3 },
    anchor: { x: (size * 3) / 2, y: (size * 3) / 2 },
  };
}

// ─── CityMap ─────────────────────────────────────────────────────────────────
export default function CityMap({ places = [], center, zoom = 13 }) {
  const containerRef  = useRef(null);
  const mapRef        = useRef(null);       // google.maps.Map instance
  const markersRef    = useRef([]);         // active marker objects
  const loaderRef     = useRef(null);
  const [selected, setSelected] = useState(null);
  const [mapReady, setMapReady]  = useState(false);
  const [error, setError]        = useState(null);

  // ── Load the Google Maps API once ──────────────────────────────────────────
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) {
      setError('Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local to enable the map.');
      return;
    }

    loaderRef.current = new Loader({ apiKey: key, version: 'weekly', libraries: ['maps'] });

    loaderRef.current.load().then(() => {
      if (!containerRef.current) return;
      mapRef.current = new window.google.maps.Map(containerRef.current, {
        center,
        zoom,
        styles: WARM_STYLE,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_BOTTOM },
        gestureHandling: 'cooperative',
      });
      setMapReady(true);
    }).catch(() => setError('Could not load Google Maps. Check your API key.'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Re-center when city changes ────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.panTo(center);
    mapRef.current.setZoom(zoom);
    setSelected(null);
  }, [center, zoom]);

  // ── Re-draw markers when places or map changes ─────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    setSelected(null);

    places.forEach((place) => {
      const cat = CATEGORY[place.category] ?? CATEGORY.other;
      const marker = new window.google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map: mapRef.current,
        title: place.name,
        icon: markerIcon(cat.color),
      });

      marker.addListener('click', () => {
        // Swap selected marker to larger icon, reset previous
        markersRef.current.forEach((m) => {
          const c = CATEGORY[m._placeData?.category] ?? CATEGORY.other;
          m.setIcon(markerIcon(c.color, false));
        });
        marker.setIcon(markerIcon(cat.color, true));
        setSelected(place);
        mapRef.current.panTo({ lat: place.lat, lng: place.lng });
      });

      marker._placeData = place; // store for icon reset
      markersRef.current.push(marker);
    });
  }, [mapReady, places]);

  // ── Dismiss card when clicking the map background ─────────────────────────
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const listener = mapRef.current.addListener('click', () => {
      markersRef.current.forEach((m) => {
        const c = CATEGORY[m._placeData?.category] ?? CATEGORY.other;
        m.setIcon(markerIcon(c.color, false));
      });
      setSelected(null);
    });
    return () => window.google.maps.event.removeListener(listener);
  }, [mapReady]);

  // ── Category legend items ──────────────────────────────────────────────────
  const usedCategories = [...new Set(places.map((p) => p.category))];

  return (
    <div className="relative w-full">
      {/* Map canvas */}
      <div
        ref={containerRef}
        className="w-full rounded-2xl overflow-hidden"
        style={{ height: 'clamp(280px, 45vw, 480px)' }}
      />

      {/* Error state (no API key yet) */}
      {error && (
        <div className="absolute inset-0 rounded-2xl bg-rose-50 border border-rose-100 flex flex-col items-center justify-center gap-2 p-6 text-center">
          <span className="text-4xl">🗺️</span>
          <p className="text-rose-700 text-sm font-medium">Map not connected yet</p>
          <p className="text-rose-400 text-xs max-w-xs">{error}</p>
        </div>
      )}

      {/* Category legend */}
      {!error && usedCategories.length > 0 && (
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {usedCategories.map((key) => {
            const cat = CATEGORY[key] ?? CATEGORY.other;
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm shadow-sm"
                style={{ color: cat.color }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: cat.color }}
                />
                {cat.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Selected place card */}
      {selected && (() => {
        const cat = CATEGORY[selected.category] ?? CATEGORY.other;
        return (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-64">
            <div
              className="bg-white rounded-2xl shadow-lg border p-4"
              style={{ borderColor: cat.ring }}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: cat.ring }}
                  >
                    {cat.emoji}
                  </span>
                  <p className="font-semibold text-stone-800 text-sm leading-tight truncate">
                    {selected.name}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-stone-300 hover:text-stone-500 flex-shrink-0 transition-colors text-lg leading-none"
                >
                  ×
                </button>
              </div>
              {selected.note && (
                <p className="text-stone-500 text-xs leading-relaxed mt-1 pl-9">
                  {selected.note}
                </p>
              )}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.name)}&query_place_id=${selected.placeId ?? ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 pl-9 block text-xs font-medium transition-colors"
                style={{ color: cat.color }}
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
