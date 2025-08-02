# Places Tools

This package provides tools for searching places using the Foursquare Places API, with support for GeoJSON output.

## Features

- **Place Search**: Search for places by name, category, or other criteria
- **GeoJSON Output**: Transform search results into GeoJSON format for use with mapping tools
- **Rich Metadata**: Includes detailed place information like ratings, photos, hours, etc.

## GeoJSON Support

The place search tool now includes GeoJSON output that can be consumed by other mapping and geospatial tools. The GeoJSON output follows the standard FeatureCollection format with Point geometries.

### GeoJSON Structure

```typescript
interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
  properties?: {
    searchMetadata?: {
      query?: string;
      location?: { longitude: number; latitude: number; radius?: number };
      near?: string;
      categories?: string[];
      // ... other search parameters
    };
    totalFeatures: number;
    generatedAt: string;
  };
}
```

### Example Usage

```typescript
import { placeSearch, transformPlacesToGeoJSON } from '@openassistant/places';

// Search for coffee shops
const result = await placeSearch.execute({
  query: 'coffee',
  location: { latitude: 40.7589, longitude: -73.9851, radius: 1000 },
});

// Access the GeoJSON output
if (result.llmResult.success && result.llmResult.geojson) {
  const geojson = JSON.parse(result.llmResult.geojson);
  console.log('GeoJSON features:', geojson.features.length);
  
  // Use with mapping libraries like Leaflet, Mapbox, etc.
  // geojson can be directly consumed by most mapping tools
}

// Or access the structured GeoJSON from additionalData
if (result.additionalData?.geojson) {
  const geojson = result.additionalData.geojson;
  // Use geojson.features for mapping
}
```

### Integration with Mapping Tools

The GeoJSON output can be used with various mapping and geospatial tools:

#### Leaflet.js
```javascript
import L from 'leaflet';

// Add GeoJSON to a Leaflet map
L.geoJSON(geojsonData).addTo(map);
```

#### Mapbox GL JS
```javascript
import mapboxgl from 'mapbox-gl';

// Add GeoJSON source to Mapbox
map.addSource('places', {
  type: 'geojson',
  data: geojsonData
});
```

#### QGIS
The GeoJSON can be imported directly into QGIS for spatial analysis.

#### Python (GeoPandas)
```python
import geopandas as gpd

# Load GeoJSON into GeoPandas
gdf = gpd.read_file('places.geojson')
```

## API Reference

### `transformPlacesToGeoJSON(places, searchMetadata?)`

Transforms place search results into GeoJSON format.

**Parameters:**
- `places`: Array of place objects from Foursquare API
- `searchMetadata`: Optional metadata about the search parameters

**Returns:** `GeoJSONFeatureCollection`

### Types

- `GeoJSONPoint`: Point geometry with coordinates
- `GeoJSONFeature`: Individual place feature with geometry and properties
- `GeoJSONFeatureCollection`: Collection of features with metadata

## License

MIT 