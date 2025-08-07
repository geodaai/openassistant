# Places Tool Example with GeoJSON Support

This example demonstrates how to use the OpenAssistant Places tools with GeoJSON output for mapping and geospatial applications.

## Features

- **Place Search**: Search for places using Foursquare Places API
- **Geotagging**: Find places near specific coordinates
- **GeoJSON Output**: Transform search results into GeoJSON format for mapping tools
- **Interactive Maps**: Visualize results using Kepler.gl
- **Geospatial Analysis**: Buffer analysis and spatial operations

## GeoJSON Support

The place search tool now includes GeoJSON output that can be consumed by various mapping and geospatial tools:

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
// Search for coffee shops
const result = await placeSearch.execute({
  query: 'coffee',
  location: { latitude: 40.7589, longitude: -73.9851, radius: 1000 },
});

// Access GeoJSON output
if (result.llmResult.success && result.llmResult.geojson) {
  const geojson = JSON.parse(result.llmResult.geojson);
  console.log('Found', geojson.features.length, 'places');
  
  // Use with mapping libraries
  // geojson can be directly consumed by Leaflet, Mapbox, etc.
}
```

### Integration Examples

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

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file with:
   ```
   FSQ_TOKEN=your_foursquare_token
   MAPBOX_TOKEN=your_mapbox_token
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## Example Queries

Try these example queries to test the GeoJSON functionality:

- "Find coffee shops near Times Square and show them on a map"
- "Search for restaurants within 2km of the Eiffel Tower"
- "Find gas stations near me and create a buffer around them"
- "What are the best rated hotels in San Francisco?"

## Tools Available

- **placeSearch**: Search for places with GeoJSON output
- **geotagging**: Find places near coordinates
- **geocoding**: Convert addresses to coordinates
- **routing**: Find routes between points
- **isochrone**: Get reachable areas within time limits
- **buffer**: Create buffer zones around geometries
- **keplergl**: Visualize data on interactive maps

## GeoJSON Benefits

1. **Standard Format**: GeoJSON is widely supported by mapping libraries
2. **Rich Metadata**: Includes all place information in feature properties
3. **Spatial Analysis**: Can be used with GIS tools for analysis
4. **Visualization**: Easy to display on maps and charts
5. **Interoperability**: Works with most geospatial tools and platforms

## License

MIT 