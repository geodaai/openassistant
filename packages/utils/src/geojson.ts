import { Feature, FeatureCollection } from 'geojson';

/**
 * Extracts values for a specific property from a GeoJSON Feature or FeatureCollection
 * @param geojson - The GeoJSON data (Feature or FeatureCollection)
 * @param propertyName - The name of the property to extract values from
 * @returns Array of values for the specified property
 */
export function getValuesFromGeoJSON(
  geojson: Feature | FeatureCollection,
  propertyName: string
): unknown[] {
  if (!geojson) {
    return [];
  }

  // Handle single Feature
  if (geojson.type === 'Feature') {
    const value = geojson.properties?.[propertyName];
    return value !== undefined ? [value] : [];
  }

  // Handle FeatureCollection
  if (geojson.type === 'FeatureCollection') {
    return geojson.features
      .map((feature) => feature.properties?.[propertyName])
      .filter((value) => value !== undefined);
  }

  return [];
}

/**
 * Get bounds and zoom level from GeoJSON data that encompasses all geometries
 * @param geoJsonData GeoJSON FeatureCollection or Feature
 * @returns Object containing bounds [[minLat, minLng], [maxLat, maxLng]] and zoom level
 */
export function getBoundsFromGeoJSON(
  geoJsonData: GeoJSON.FeatureCollection | GeoJSON.Feature
): { bounds: [[number, number], [number, number]]; zoom: number } {
  let minLat = Infinity;
  let minLng = Infinity;
  let maxLat = -Infinity;
  let maxLng = -Infinity;

  const processCoordinates = (coordinates: number[][]) => {
    coordinates.forEach(([lng, lat]) => {
      minLat = Math.min(minLat, lat);
      minLng = Math.min(minLng, lng);
      maxLat = Math.max(maxLat, lat);
      maxLng = Math.max(maxLng, lng);
    });
  };

  const processGeometry = (geometry: GeoJSON.Geometry) => {
    switch (geometry.type) {
      case 'Point': {
        const [lng, lat] = geometry.coordinates;
        minLat = Math.min(minLat, lat);
        minLng = Math.min(minLng, lng);
        maxLat = Math.max(maxLat, lat);
        maxLng = Math.max(maxLng, lng);
        break;
      }
      case 'MultiPoint':
        processCoordinates(geometry.coordinates);
        break;
      case 'LineString':
        processCoordinates(geometry.coordinates);
        break;
      case 'MultiLineString':
        geometry.coordinates.forEach(processCoordinates);
        break;
      case 'Polygon':
        geometry.coordinates.forEach(processCoordinates);
        break;
      case 'MultiPolygon':
        geometry.coordinates.forEach((polygon) => {
          polygon.forEach(processCoordinates);
        });
        break;
    }
  };

  if ('features' in geoJsonData) {
    // FeatureCollection
    geoJsonData.features.forEach((feature) => {
      processGeometry(feature.geometry);
    });
  } else {
    // Single Feature
    processGeometry(geoJsonData.geometry);
  }

  // Calculate zoom level based on bounds
  const latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;
  const maxDiff = Math.max(latDiff, lngDiff);

  // Calculate zoom level using a simple formula
  // This is a basic implementation - you might want to adjust the formula based on your needs
  const zoom = Math.floor(12 - Math.log2(maxDiff));

  return {
    bounds: [
      [minLat, minLng],
      [maxLat, maxLng],
    ],
    zoom: Math.max(1, Math.min(18, zoom)), // Clamp zoom between 1 and 18
  };
}
