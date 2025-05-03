import { WeightsMeta } from '@geoda/core';
import { FeatureCollection } from 'geojson';

import { getCachedWeightsById } from './weights/tool';
import { SpatialToolContext } from './types';

export function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

export function isSpatialToolContext(
  context: unknown
): context is SpatialToolContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getGeometries' in context
  );
}

export type PreviousExecutionOutput = {
  data?: {
    weights?: number[][];
    weightsMeta?: WeightsMeta;
  };
}[];

export function getWeights(
  weightsId: string | undefined,
  previousExecutionOutput?: PreviousExecutionOutput
): { weights: number[][] | null; weightsMeta: WeightsMeta | null } {
  let weights: number[][] | null = null;
  let weightsMeta: WeightsMeta | null = null;

  if (!weightsId && previousExecutionOutput) {
    // Try to get weights from previous execution
    previousExecutionOutput.forEach((output) => {
      if (
        output.data &&
        'weights' in output.data &&
        'weightsMeta' in output.data &&
        output.data.weights &&
        output.data.weightsMeta
      ) {
        weights = output.data.weights;
        weightsMeta = output.data.weightsMeta;
      }
    });
  }

  if (!weights && weightsId) {
    // Try to get weights from cache
    const existingWeights = getCachedWeightsById(weightsId);
    if (existingWeights) {
      weights = existingWeights.weights;
      weightsMeta = existingWeights.weightsMeta;
    }
  }

  return { weights, weightsMeta };
}

// Declare the type for our global cache
declare global {
  interface Window {
    /**
     * Cache for geoda tools. The value can be a FeatureCollection or CSV style array.
     * @type {Record<string, FeatureCollection | unknown[]>}
     */
    __geodaCache?: Record<string, FeatureCollection | unknown[]>;
  }
}

// Initialize the cache on window if it doesn't exist
if (typeof window !== 'undefined' && !window.__geodaCache) {
  window.__geodaCache = {};
}

// Interface to cache data
export function cacheData(key: string, data: FeatureCollection | unknown[]) {
  if (typeof window !== 'undefined' && window.__geodaCache) {
    window.__geodaCache[key] = data;
  }
}

export function getGeoDaCachedData(
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
