import { tool } from '@openassistant/utils';
import { z } from 'zod';
import { createWeights, WeightsMeta, CreateWeightsProps } from '@geoda/core';
import { WeightsProps, GetGeometries } from '../types';

// global variable to store the created weights, which will be shared across tool calls e.g. lisa, spatial regression 
/**
 * @internal
 */
export const globalWeightsData: Record<string, WeightsProps> = {};

export type SpatialWeightsFunctionArgs = z.ZodObject<{
  datasetName: z.ZodString;
  type: z.ZodEnum<['knn', 'queen', 'rook', 'threshold']>;
  k: z.ZodOptional<z.ZodNumber>;
  orderOfContiguity: z.ZodOptional<z.ZodNumber>;
  includeLowerOrder: z.ZodOptional<z.ZodBoolean>;
  precisionThreshold: z.ZodOptional<z.ZodNumber>;
  distanceThreshold: z.ZodOptional<z.ZodNumber>;
  isMile: z.ZodOptional<z.ZodBoolean>;
  useCentroids: z.ZodOptional<z.ZodBoolean>;
  mapBounds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
}>;

export type SpatialWeightsLlmResult = {
  success: boolean;
  result?: {
    datasetName: string;
    weightsId: string;
    weightsMeta: WeightsMeta;
    mapBounds?: number[];
    details?: string;
  };
  error?: string;
};

export type SpatialWeightsAdditionalData = {
  datasetName: string;
  weights: number[][];
  weightsMeta: WeightsMeta;
};

/**
 * Spatial Weights Tool
 *
 * This tool creates spatial weights matrices for spatial analysis. It supports multiple types of weights:
 * - K-Nearest Neighbors (knn)
 * - Queen Contiguity
 * - Rook Contiguity
 * - Distance-based Threshold
 *
 * The weights are cached in memory using a unique ID generated from the input parameters.
 *
 * Example user prompts:
 * - "Create a queen contiguity weights matrix for these counties"
 * - "Generate k-nearest neighbor weights with k=5 for these points"
 * - "Calculate distance-based weights with a 10km threshold"
 *
 * Example code:
 * ```typescript
 * import { getVercelAiTool } from '@openassistant/geoda';
 * import { generateText } from 'ai';
 *
 * const toolContext = {
 *   getGeometries: (datasetName) => {
 *     return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
 *   },
 * };
 * const weightsTool = getVercelAiTool('spatialWeights', toolContext, onToolCompleted);
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Create a queen contiguity weights matrix for these counties',
 *   tools: {spatialWeights: weightsTool},
 * });
 * ```
 */
export const spatialWeights = tool<
  SpatialWeightsFunctionArgs,
  SpatialWeightsLlmResult,
  SpatialWeightsAdditionalData,
  SpatialWeightsFunctionContext
>({
  description: 'Create a spatial weights.',
  parameters: z.object({
    datasetName: z.string(),
    type: z.enum(['knn', 'queen', 'rook', 'threshold']),
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
        'For queen/rook weights: precision threshold for matching coordinates to determine neighboring polygons. Default: 0.'
      ),
    distanceThreshold: z
      .number()
      .optional()
      .describe(
        'Only for distance based weights. It represents the distance threshold used to search nearby neighbors.'
      ),
    useCentroids: z
      .boolean()
      .optional()
      .describe(
        'Whether to use centroids for neighbor calculations. The default value is False.'
      ),
    isMile: z.boolean().optional().describe('Only for distance based weights.'),
    mapBounds: z.array(z.number()).optional(),
  }),
  execute: executeSpatialWeights,
  context: {
    getGeometries: () => {
      throw new Error(
        'getGeometries() of SpatialWeightsTool is not implemented'
      );
    },
  },
});

export type SpatialWeightsTool = typeof spatialWeights;

export type SpatialWeightsFunctionContext = {
  getGeometries: GetGeometries;
};

export type GetWeights = (
  datasetName: string,
  type: 'knn' | 'queen' | 'rook' | 'threshold',
  options: {
    k?: number;
    orderOfContiguity?: number;
    includeLowerOrder?: boolean;
    precisionThreshold?: number;
    distanceThreshold?: number;
    isMile?: boolean;
    useCentroids?: boolean;
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
      weightsId: string;
      weightsMeta: WeightsMeta;
      mapBounds?: number[];
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
  type: 'knn' | 'queen' | 'rook' | 'threshold';
  k?: number;
  orderOfContiguity?: number;
  includeLowerOrder?: boolean;
  precisionThreshold?: number;
  distanceThreshold?: number;
  isMile?: boolean;
  useCentroids?: boolean;
  mapBounds?: number[];
};

function isSpatialWeightsArgs(args: unknown): args is SpatialWeightsArgs {
  return (
    typeof args === 'object' &&
    args !== null &&
    'datasetName' in args &&
    typeof args.datasetName === 'string' &&
    'type' in args &&
    typeof args.type === 'string' &&
    ['knn', 'queen', 'rook', 'threshold'].includes(args.type)
  );
}

function isSpatialWeightsContext(
  context: unknown
): context is SpatialWeightsFunctionContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getGeometries' in context &&
    typeof context.getGeometries === 'function'
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
    useCentroids,
    mapBounds,
  } = args;
  const { getGeometries } = options.context;
  const geometries = await getGeometries(datasetName);

  if (!geometries) {
    throw new Error(
      `Error: geometries are empty. Please implement the getGeometries() context function.`
    );
  }

  const weightsProps: CreateWeightsProps = {
    weightsType: type,
    k,
    isQueen: type === 'queen',
    distanceThreshold,
    isMile,
    useCentroids,
    precisionThreshold,
    orderOfContiguity,
    includeLowerOrder,
    geometries,
  };

  const id = getWeightsId(datasetName, weightsProps, mapBounds);

  let w: { weightsMeta: WeightsMeta; weights: number[][] } | null = null;

  // check if the weights already exist in the global variable
  const existingWeightData = globalWeightsData[id];
  if (existingWeightData) {
    w = {
      weightsMeta: existingWeightData.weightsMeta,
      weights: existingWeightData.weights,
    };
  } else {
    // create the weights if it does not exist
    const result = await createWeights(weightsProps);
    w = {
      weightsMeta: result.weightsMeta,
      weights: result.weights,
    };
  }
  // set the id to the weights meta
  w.weightsMeta.id = id;

  // save the weights to the global variable
  globalWeightsData[id] = {
    datasetId: datasetName,
    ...w,
  };

  return {
    llmResult: {
      success: true,
      result: {
        datasetName,
        weightsId: id,
        weightsMeta: w.weightsMeta,
        ...(mapBounds ? { mapBounds } : {}),
        details: `Weights created successfully.`,
      },
    },
    additionalData: {
      datasetName,
      weights: w.weights,
      weightsMeta: w.weightsMeta,
    },
  };
}

export function getWeightsId(
  datasetId: string,
  weightsProps: CreateWeightsProps,
  mapBounds?: number[]
): string {
  const parts = [
    'w', // prefix
    datasetId,
    weightsProps.weightsType,
  ];

  if (
    weightsProps.weightsType === 'queen' ||
    weightsProps.weightsType === 'rook'
  ) {
    parts.push(
      String(weightsProps.orderOfContiguity || 1),
      weightsProps.includeLowerOrder ? 'lower' : '',
      String(weightsProps.precisionThreshold || 0)
    );
  } else if (weightsProps.weightsType === 'knn') {
    parts.push(String(weightsProps.k));
  } else if (weightsProps.weightsType === 'threshold') {
    const distanceThresholdString = weightsProps.distanceThreshold
      ? weightsProps.distanceThreshold.toFixed(1)
      : '0';
    parts.push(distanceThresholdString, weightsProps.isMile ? 'mile' : 'km');
  }

  if (mapBounds) {
    parts.push(mapBounds[0].toString());
  }

  return parts.filter(Boolean).join('-');
}

export function getCachedWeights(
  datasetId: string,
  createWeightsProps: CreateWeightsProps
) {
  const id = getWeightsId(datasetId, createWeightsProps);
  const existingWeightData = globalWeightsData[id];
  if (existingWeightData) {
    return {
      weightsMeta: existingWeightData.weightsMeta,
      weights: existingWeightData.weights,
    };
  }
  return null;
}

export function getCachedWeightsById(weightsId: string) {
  const existingWeightData = globalWeightsData[weightsId];
  if (existingWeightData) {
    return existingWeightData;
  }
  return null;
}
