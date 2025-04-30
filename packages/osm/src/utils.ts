import { FeatureCollection } from 'geojson';

export function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

// Declare the type for our global cache
declare global {
  interface Window {
    /**
     * Cache for osm tools. The value can be a FeatureCollection or CSV style array.
     * @type {Record<string, FeatureCollection | unknown[]>}
     */
    __geodaCache?: Record<string, FeatureCollection | unknown[]>;
  }
}

// Initialize the cache on window if it doesn't exist
if (typeof window !== 'undefined' && !window.__geodaCache) {
  window.__geodaCache = {};
}

export function cacheData(key: string, data: FeatureCollection | unknown[]) {
  if (typeof window !== 'undefined' && window.__geodaCache) {
    window.__geodaCache[key] = data;
  }
}

export function getCachedData(
  key: string
): FeatureCollection | unknown[] | null {
  if (typeof window !== 'undefined' && window.__geodaCache) {
    return window.__geodaCache[key] || null;
  }
  return null;
}

// remove the cached data by key
export function removeCachedData(key: string) {
  if (typeof window !== 'undefined' && window.__geodaCache) {
    delete window.__geodaCache[key];
  }
}
