// ─── /api/places ─────────────────────────────────────────────────────────────
// Fetches your public Google My Maps as KML, parses it into city/places JSON,
// and returns it to the client.  Cache is revalidated every hour so updates
// you make in My Maps show up on the site within 60 minutes.
//
// My Maps convention:
//   • One layer  per city  (layer name = city name shown on the site)
//   • One pin    per place (pin name = place name)
//   • Pin description = optional [category] followed by your personal note
//     e.g.  [food] best morning bun in SF
//     Categories: food | coffee | outdoors | culture | other
//     If no category tag is given, defaults to "other"

export const revalidate = 3600; // 1 hour

// Well-known city centres — used to set the initial map viewport.
// If your city isn't listed, the centre is auto-computed from the average
// of your pins, which works fine for most cases.
const CITY_CENTRES = {
  'San Francisco': { lat: 37.7749, lng: -122.4194, zoom: 13 },
  'New York':      { lat: 40.7580, lng: -73.9855,  zoom: 12 },
  'Seattle':       { lat: 47.6062, lng: -122.3321,  zoom: 13 },
  'Los Angeles':   { lat: 34.0522, lng: -118.2437,  zoom: 12 },
  'Chicago':       { lat: 41.8781, lng: -87.6298,   zoom: 12 },
  'Boston':        { lat: 42.3601, lng: -71.0589,   zoom: 13 },
  'Portland':      { lat: 45.5051, lng: -122.6750,  zoom: 13 },
  'Austin':        { lat: 30.2672, lng: -97.7431,   zoom: 13 },
  'Washington DC': { lat: 38.9072, lng: -77.0369,   zoom: 12 },
  'London':        { lat: 51.5074, lng: -0.1278,    zoom: 12 },
  'Paris':         { lat: 48.8566, lng:  2.3522,    zoom: 13 },
  'Tokyo':         { lat: 35.6762, lng: 139.6503,   zoom: 12 },
};

export async function GET() {
  const mapId = process.env.GOOGLE_MYMAPS_ID;

  if (!mapId) {
    return Response.json(
      { error: 'GOOGLE_MYMAPS_ID is not set. Add it to your .env.local and Vercel env vars.' },
      { status: 500 }
    );
  }

  let kml;
  try {
    const res = await fetch(
      `https://www.google.com/maps/d/kml?forcekml=1&mid=${mapId}`,
      { next: { revalidate } }
    );
    if (!res.ok) throw new Error(`KML fetch returned ${res.status}`);
    kml = await res.text();
  } catch (err) {
    return Response.json({ error: `Could not fetch My Maps KML: ${err.message}` }, { status: 502 });
  }

  try {
    const cities = parseKML(kml);
    return Response.json(cities);
  } catch (err) {
    return Response.json({ error: `KML parse error: ${err.message}` }, { status: 500 });
  }
}

// ─── KML parser ───────────────────────────────────────────────────────────────

function parseKML(kml) {
  const result = {};

  // Each My Maps layer becomes a <Folder> in the KML
  const folderRegex = /<Folder>([\s\S]*?)<\/Folder>/g;
  let folderMatch;

  while ((folderMatch = folderRegex.exec(kml)) !== null) {
    const folderContent = folderMatch[1];

    // Folder name = city name
    const cityName = folderContent.match(/<name>(.*?)<\/name>/)?.[1]?.trim();
    if (!cityName) continue;

    const places = [];
    const placemarkRegex = /<Placemark>([\s\S]*?)<\/Placemark>/g;
    let pmMatch;

    while ((pmMatch = placemarkRegex.exec(folderContent)) !== null) {
      const pm = pmMatch[1];

      const name = pm.match(/<name>(.*?)<\/name>/)?.[1]?.trim();
      const coords = pm.match(/<coordinates>\s*(.*?)\s*<\/coordinates>/)?.[1]?.trim();

      // Description may be wrapped in CDATA or plain text
      const rawDesc =
        pm.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1]?.trim() ??
        pm.match(/<description>(.*?)<\/description>/)?.[1]?.trim() ??
        '';

      if (!name || !coords) continue;

      // Coordinates in KML are  lng,lat,altitude
      const [lngStr, latStr] = coords.split(',');
      const lng = parseFloat(lngStr);
      const lat = parseFloat(latStr);
      if (isNaN(lat) || isNaN(lng)) continue;

      // Optional category tag at the start of the description
      // e.g.  [food] the morning bun is worth it
      let category = 'other';
      let note = rawDesc;
      const catMatch = rawDesc.match(/^\[(food|coffee|outdoors|culture|other)\]\s*/i);
      if (catMatch) {
        category = catMatch[1].toLowerCase();
        note = rawDesc.slice(catMatch[0].length).trim();
      }

      places.push({
        id: `${cityName.toLowerCase().replace(/\s+/g, '-')}-${places.length + 1}`,
        name,
        lat,
        lng,
        category,
        note: note || null,
      });
    }

    if (places.length === 0) continue;

    const known = CITY_CENTRES[cityName];
    const center = known
      ? { lat: known.lat, lng: known.lng }
      : {
          lat: places.reduce((s, p) => s + p.lat, 0) / places.length,
          lng: places.reduce((s, p) => s + p.lng, 0) / places.length,
        };

    result[cityName] = {
      center,
      zoom: known?.zoom ?? 13,
      places,
    };
  }

  return result;
}
