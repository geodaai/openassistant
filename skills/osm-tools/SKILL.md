---
name: osm-tools
description: Use @openassistant/osm tools (geocoding, reverse geocoding, routing, isochrones, roads, and US boundary helpers) in TypeScript/JavaScript apps; includes required API keys and context wiring.
---

# OSM tools (@openassistant/osm)

Use this skill when you need to turn addresses into coordinates, compute routes/isochrones, fetch roads, or download US administrative boundary GeoJSON.

## Quick start

```ts
import { geocoding, routing } from '@openassistant/osm';
import { convertToVercelAiTool } from '@openassistant/utils';

const tools = {
  geocoding: convertToVercelAiTool(geocoding), // no API key (Nominatim)
  routing: convertToVercelAiTool({
    ...routing,
    context: { getMapboxToken: () => process.env.MAPBOX_TOKEN! },
  }),
};
```

## What needs API keys / context

- `geocoding`, `reverseGeocoding`: OpenStreetMap Nominatim (no key; be mindful of rate limits).
- `routing`, `isochrone`: Mapbox APIs (requires `context.getMapboxToken()`; typically from `process.env.MAPBOX_TOKEN`).
- `roads`: Overpass API; optionally accepts `datasetName` and uses `context.getGeometries(datasetName)` to derive bounds.
- US boundary helpers: `getUsStateGeojson`, `getUsCountyGeojson`, `getUsCityGeojson`, `getUsZipcodeGeojson`, `queryZipcode` (fetch/cached from public sources; no key).

## Tool map

- `geocoding`: Address → point GeoJSON (dataset cached with generated name).
- `reverseGeocoding`: Coordinate → best-matching address/place name.
- `routing`: Route between two coordinates (returns LineString + distance/duration; Mapbox).
- `isochrone`: Travel-time polygon(s) from an origin point (Mapbox).
- `roads`: Fetch road network lines within bounds or around an existing dataset (Overpass).
- US helpers: Download GeoJSON for states/counties/cities/zipcodes and basic zipcode queries.

## Notes

- These tools perform network fetches; use timeouts/rate limits appropriately in your runtime.
- For routing/isochrone, if you only have addresses, call `geocoding` first to obtain coordinates.

