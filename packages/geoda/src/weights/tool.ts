import { tool } from '@openassistant/core';
import { z } from 'zod';
import { BinaryGeometryType, WeightsMeta } from '@geoda/core';
import { BinaryFeatureCollection } from '@loaders.gl/schema';
import { runSpatialWeights } from './utils';
import { WeightsProps } from '../types';

export const spatialWeights = tool<
  z.ZodObject<{
    datasetName: z.ZodString;
    type: z.ZodEnum<['knn', 'queen', 'rook', 'distance', 'kernel']>;
    k: z.ZodOptional<z.ZodNumber>;
    orderOfContiguity: z.ZodOptional<z.ZodNumber>;
    includeLowerOrder: z.ZodOptional<z.ZodBoolean>;
    precisionThreshold: z.ZodOptional<z.ZodNumber>;
    distanceThreshold: z.ZodOptional<z.ZodNumber>;
    isMile: z.ZodOptional<z.ZodBoolean>;
  }>,
  ExecuteSpatialWeightsResult['llmResult'],
  ExecuteSpatialWeightsResult['additionalData'],
  SpatialWeightsFunctionContext
>({
  description:
    'Create a spatial weights, which could be k nearest neighbor (knn) weights, queen contiguity weights, rook contiguity weights, distance based weights or kernel weights.',
  parameters: z.object({
    datasetName: z.string(),
    type: z.enum(['knn', 'queen', 'rook', 'distance', 'kernel']),
    k: z
      .number()
      .optional()
      .describe('Only for k nearest neighbor (knn) weights'),
    orderOfContiguity: z.number().optional(),
    includeLowerOrder: z.boolean().optional(),
    precisionThreshold: z
      .number()
      .optional()
      .describe(
        'Only for queen or rook weights. It represnts the precision threshold that allow for an exact match of coordinates, so we can use it to determine which polygons are neighbors that sharing the proximate coordinates or edges. The default value is 0.'
      ),
    distanceThreshold: z
      .number()
      .optional()
      .describe(
        'Only for distance based weights. It represents the distance threshold used to search nearby neighbors for each geometry. The unit should be either kilometer (KM) or mile.'
      ),
    isMile: z
      .boolean()
      .optional()
      .describe(
        'Only for distance based weights. It represents whether the distance threshold is in mile or not. The default value is False.'
      ),
  }),
  execute: executeSpatialWeights,
  context: {
    getExistingWeights: () => {
      throw new Error(
        'getExistingWeights() of SpatialWeightsTool is not implemented'
      );
    },
    getGeometries: () => {
      throw new Error(
        'getGeometries() of SpatialWeightsTool is not implemented'
      );
    },
  },
});

export type GetExistingWeights = (datasetName: string) => WeightsProps[];

export type GetGeometries = (datasetName: string) => {
  binaryGeometryType: BinaryGeometryType;
  binaryGeometries: BinaryFeatureCollection[];
};

export type SpatialWeightsFunctionContext = {
  getExistingWeights: GetExistingWeights;
  getGeometries: GetGeometries;
};

export type GetWeights = (
  datasetName: string,
  type: 'knn' | 'queen' | 'rook' | 'distance' | 'kernel',
  options: {
    k?: number;
    orderOfContiguity?: number;
    includeLowerOrder?: boolean;
    precisionThreshold?: number;
    distanceThreshold?: number;
    isMile?: boolean;
  }
) => Promise<{
  weights: number[][];
  weightsMeta: WeightsMeta;
}>;

export type ExecuteSpatialWeightsResult = {
  llmResult: {
    success: boolean;
    result?: {
      datasetName: string;
      weightsMeta: WeightsMeta;
      details?: string;
    };
    error?: string;
  };
  additionalData?: {
    datasetName: string;
    weights: number[][];
    weightsMeta: WeightsMeta;
  };
};

type SpatialWeightsArgs = {
  datasetName: string;
  type: 'knn' | 'queen' | 'rook' | 'distance' | 'kernel';
  k?: number;
  orderOfContiguity?: number;
  includeLowerOrder?: boolean;
  precisionThreshold?: number;
  distanceThreshold?: number;
  isMile?: boolean;
};

function isSpatialWeightsArgs(args: unknown): args is SpatialWeightsArgs {
  return (
    typeof args === 'object' &&
    args !== null &&
    'datasetName' in args &&
    typeof args.datasetName === 'string' &&
    'type' in args &&
    typeof args.type === 'string' &&
    ['knn', 'queen', 'rook', 'distance', 'kernel'].includes(args.type)
  );
}

function isSpatialWeightsContext(
  context: unknown
): context is SpatialWeightsFunctionContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getExistingWeights' in context &&
    typeof context.getExistingWeights === 'function'
  );
}

async function executeSpatialWeights(
  args,
  options
): Promise<ExecuteSpatialWeightsResult> {
  if (!isSpatialWeightsArgs(args)) {
    throw new Error('Invalid arguments for spatialWeights tool');
  }

  if (!isSpatialWeightsContext(options.context)) {
    throw new Error('Invalid context for spatialWeights tool');
  }

  const {
    datasetName,
    type,
    k,
    orderOfContiguity,
    includeLowerOrder,
    precisionThreshold,
    distanceThreshold,
    isMile,
  } = args;
  const { getExistingWeights, getGeometries } = options.context;

  return runSpatialWeights({
    existingWeights: getExistingWeights(datasetName),
    datasetName,
    type,
    k,
    orderOfContiguity,
    includeLowerOrder,
    precisionThreshold,
    distanceThreshold,
    isMile,
    getGeometries,
  });
}
