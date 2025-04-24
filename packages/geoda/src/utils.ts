import { WeightsMeta } from '@geoda/core';
import { Feature } from 'geojson';

import { getCachedWeightsById } from './weights/tool';
import { getCachedUsStates } from './us_states/tool';
import { getCachedUsZipcodes } from './us_zipcodes/tool';
import { getCachedUsCounties } from './us_county/tool';

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

export function getCachedGeojson(item: string) {
  const result: Feature[] = [];
  const state = getCachedUsStates(item);
  if (state) {
    result.push(...state.features);
  }
  const zipcode = getCachedUsZipcodes(item);
  if (zipcode) {
    result.push(...zipcode.features);
  }
  const county = getCachedUsCounties(item);
  if (county) {
    result.push(county);
  }
  return result;
}
