import { FeatureCollection } from 'geojson';

// Create a unique key for our cache on the global object
const CACHE_KEY = '__openassistant_cache__';

// Get the global object (Node.js or browser)
const globalObj = (() => {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof global !== 'undefined') return global;
  if (typeof window !== 'undefined') return window;
  throw new Error('Unable to locate global object');
})();

// Initialize cache on global object if it doesn't exist
if (!globalObj[CACHE_KEY]) {
  globalObj[CACHE_KEY] = {
    data: {} as Record<string, FeatureCollection | unknown[]>,
    get(key: string) {
      return this.data[key];
    },
    set(key: string, value: FeatureCollection | unknown[]) {
      this.data[key] = value;
    },
    delete(key: string) {
      delete this.data[key];
    }
  };
}

const cache = globalObj[CACHE_KEY];

export function cacheData(key: string, data: FeatureCollection | unknown[]) {
  cache.set(key, data);
}

export function getCachedData(
  key: string
): FeatureCollection | unknown[] | null {
  return cache.get(key) || null;
}

// remove the cached data by key
export function removeCachedData(key: string) {
  cache.delete(key);
}
