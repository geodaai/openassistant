import { WeightsMeta } from '@geoda/core';

import { getCachedWeightsById } from './weights/tool';
import { SpatialToolContext } from './types';

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
