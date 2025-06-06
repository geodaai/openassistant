import { extendedTool, generateId } from '@openassistant/utils';
import {
  CheckGeometryType,
  SpatialGeometry,
  spatialJoin as spatialJoinFunc,
  SpatialJoinGeometryType,
} from '@geoda/core';
import { z } from 'zod';
import { binaryToGeojson } from '@loaders.gl/gis';

import { applyJoin } from './apply-join';
import { GetValues, GetGeometries } from '../types';

export type SpatialJoinFunctionArgs = z.ZodObject<{
  rightDatasetName: z.ZodString;
  leftDatasetName: z.ZodString;
  joinVariableNames: z.ZodArray<z.ZodString>;
  joinOperators: z.ZodArray<
    z.ZodEnum<['sum', 'mean', 'min', 'max', 'median', 'count']>
  >;
}>;

export type SpatialJoinLlmResult = {
  success: boolean;
  firstTwoRows?: {
    [x: string]: number[];
  }[];
  datasetName?: string;
  result?: string;
  joinStats?: {
    totalCount: number;
    minCount: number;
    maxCount: number;
    averageCount: number;
  };
  error?: string;
};

export type SpatialJoinAdditionalData = {
  rightDatasetName: string;
  leftDatasetName: string;
  joinVariableNames?: string[];
  joinOperators?: string[];
  datasetName: string;
  [datasetName: string]: unknown;
};

export type SpatialJoinFunctionContext = {
  getGeometries: GetGeometries;
  getValues?: GetValues;
  saveAsDataset?: (datasetName: string, data: Record<string, number[]>) => void;
};

/**
 * The spatial join tool is used to join geometries from one dataset with geometries from another dataset.
 *
 * The tool supports various join operations:
 * - sum: sum of values in overlapping geometries
 * - mean: average of values in overlapping geometries
 * - min: minimum value in overlapping geometries
 * - max: maximum value in overlapping geometries
 * - median: median value in overlapping geometries
 * - count: count of overlapping geometries
 *
 * When user prompts e.g. *can you join the population data with county boundaries?*
 *
 * 1. The LLM will execute the callback function of spatialJoinFunctionDefinition, and perform the spatial join using the geometries retrieved from `getGeometries` function.
 * 2. The result will include joined values and a new dataset with the joined geometries.
 * 3. The LLM will respond with the join results and details about the new dataset.
 *
 * ### For example
 * ```
 * User: can you join the population data with county boundaries?
 * LLM: I've performed a spatial join between the population data and county boundaries. The result shows the total population in each county...
 * ```
 *
 * ### Code example
 * ```typescript
 * import { getVercelAiTool } from '@openassistant/geoda';
 * import { generateText } from 'ai';
 *
 * const toolContext = {
 *   getGeometries: (datasetName) => {
 *     return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
 *   },
 *   getValues: (datasetName, variableName) => {
 *     return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *   },
 * };
 * const joinTool = getVercelAiTool('spatialJoin', toolContext, onToolCompleted);
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Can you join the population data with county boundaries?',
 *   tools: {spatialJoin: joinTool},
 * });
 * ```
 */
export const spatialJoin = extendedTool<
  SpatialJoinFunctionArgs,
  SpatialJoinLlmResult,
  SpatialJoinAdditionalData,
  SpatialJoinFunctionContext
>({
  description: `Spatial join geometries two geometric datasets. For example:
1. to get the number of points in polygons, "right dataset = points" and "left dataset = polygons"
2. to check which point belongs to which polygon, "right dataset = polygons" and "left dataset = points"
IMPORTANT:
1. left dataset and right dataset should be different.
2. joinOperators can NOT be empty and should have the same length as joinVariableNames.
3. joinVariables should comes from the right dataset.`,
  parameters: z.object({
    rightDatasetName: z.string(),
    leftDatasetName: z.string(),
    joinVariableNames: z.array(z.string()),
    joinOperators: z.array(
      z.enum(['sum', 'mean', 'min', 'max', 'median', 'count'])
    ),
  }),
  execute: executeSpatialJoin,
  context: {
    getGeometries: () => {
      throw new Error('getGeometries() of SpatialJoinTool is not implemented');
    },
    getValues: () => {
      throw new Error('getValues() of SpatialJoinTool is not implemented');
    },
    saveAsDataset: () => {
      throw new Error('saveAsDataset() of SpatialJoinTool is not implemented');
    },
  },
});

export type SpatialJoinTool = typeof spatialJoin;

type SpatialJoinArgs = {
  rightDatasetName: string;
  leftDatasetName: string;
  joinVariableNames: string[];
  joinOperators: string[];
};

function isSpatialJoinArgs(args: unknown): args is SpatialJoinArgs {
  return (
    typeof args === 'object' &&
    args !== null &&
    'rightDatasetName' in args &&
    'leftDatasetName' in args &&
    typeof args.rightDatasetName === 'string' &&
    typeof args.leftDatasetName === 'string'
  );
}

function isSpatialJoinContext(
  context: unknown
): context is SpatialJoinFunctionContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getGeometries' in context &&
    typeof context.getGeometries === 'function'
  );
}

async function executeSpatialJoin(
  args,
  options
): Promise<{
  llmResult: SpatialJoinLlmResult;
  additionalData?: SpatialJoinAdditionalData;
}> {
  if (!isSpatialJoinArgs(args)) {
    throw new Error('Invalid arguments for spatialJoin tool');
  }

  if (options.context && !isSpatialJoinContext(options.context)) {
    throw new Error('Invalid context for spatialJoin tool');
  }

  const {
    rightDatasetName,
    leftDatasetName,
    joinVariableNames,
    joinOperators,
  } = args;
  const { getGeometries, getValues } = options.context;

  return runSpatialJoin({
    rightDatasetName,
    leftDatasetName,
    previousExecutionOutput: options.previousExecutionOutput,
    joinVariableNames,
    joinOperators,
    getGeometries,
    getValues,
  });
}

export async function runSpatialJoin({
  rightDatasetName,
  leftDatasetName,
  joinVariableNames,
  joinOperators,
  getGeometries,
  getValues,
}: {
  rightDatasetName: string;
  leftDatasetName: string;
  previousExecutionOutput?: {
    data?: {
      geojson?: GeoJSON.FeatureCollection;
    };
  };
  joinVariableNames?: string[];
  joinOperators?: string[];
  getGeometries: GetGeometries;
  getValues: GetValues;
}) {
  try {
    // Get geometries from both datasets
    const rightGeometries = await getGeometries(rightDatasetName);
    const leftGeometries = await getGeometries(leftDatasetName);

    if (!rightGeometries || rightGeometries.length === 0) {
      throw new Error('First dataset geometries not found');
    }

    if (!leftGeometries || leftGeometries.length === 0) {
      throw new Error('Second dataset geometries not found');
    }

    const result = await spatialJoinFunc({
      leftGeometries,
      rightGeometries,
    });

    // get basic statistics of the result for LLM
    const basicStatistics = getBasicStatistics(result);

    const joinValues: Record<string, number[]> = {
      Count: result.map((row) => row.length),
    };

    // get the values of the left dataset if joinVariableNames is provided
    if (
      joinVariableNames &&
      joinOperators &&
      joinVariableNames.length > 0 &&
      joinOperators.length > 0
    ) {
      await Promise.all(
        joinVariableNames.map(async (variableName, index) => {
          try {
            const operator = joinOperators[index];
            const values = (await getValues(
              rightDatasetName,
              variableName
            )) as number[];
            try {
              // apply join to values in each row
              const joinedValues = result.map((row) =>
                applyJoin(
                  operator,
                  row.map((index) => values[index])
                )
              );
              joinValues[variableName] = joinedValues;
            } catch {
              // if the join operator is not supported, return an array with first value of the variable if exists
              joinValues[variableName] = values.length > 0 ? [values[0]] : [];
            }
          } catch (error) {
            throw new Error(
              `Error applying join operator to variable ${variableName}: ${error}`
            );
          }
        })
      );
    }

    // append joinValues to the left geometries
    const leftGeometriesWithJoinValues = appendJoinValuesToGeometries(
      leftGeometries,
      joinValues
    );

    // cache the joined dataset
    const outputDatasetName = `join_${generateId()}`;

    // joinValues is a record of variable names and their values
    // return the first 10 rows of each variable, including the variable name
    const columns = Object.keys(joinValues);
    const firstTwoRows = columns.map((column) => ({
      [column]: joinValues[column].slice(0, 2),
    }));

    return {
      llmResult: {
        success: true,
        firstTwoRows,
        datasetName: outputDatasetName,
        result: `Spatial count function executed successfully and the joined dataset is saved in DatasetName: ${outputDatasetName}.`,
        joinStats: basicStatistics,
      },
      additionalData: {
        joinResult: result,
        joinValues,
        rightDatasetName,
        leftDatasetName,
        joinVariableNames,
        joinOperators,
        datasetName: outputDatasetName,
        [outputDatasetName]: leftGeometriesWithJoinValues,
      },
    };
  } catch (error) {
    return {
      llmResult: {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
    };
  }
}

/**
 * Get basic statistics of the result
 * @param result - the result of the spatial join
 * @returns - the basic statistics of the result
 */
export function getBasicStatistics(result: number[][]) {
  const totalCount = result.length;
  let minCount = Infinity;
  let maxCount = -Infinity;
  let sumCount = 0;

  for (let i = 0; i < result.length; i++) {
    const rowLength = result[i].length;
    minCount = Math.min(minCount, rowLength);
    maxCount = Math.max(maxCount, rowLength);
    sumCount += rowLength;
  }

  return {
    totalCount,
    minCount,
    maxCount,
    averageCount: sumCount / totalCount,
  };
}

export function appendJoinValuesToGeometries(
  geometries: SpatialGeometry,
  joinValues: Record<string, number[]>
): GeoJSON.FeatureCollection | unknown[] {
  const geometryType = CheckGeometryType(geometries);
  const variableNames = Object.keys(joinValues);

  switch (geometryType) {
    case SpatialJoinGeometryType.BinaryFeatureCollection: {
      // convert binary to geojson and flatten the results
      const features: GeoJSON.Feature[] = geometries.flatMap((binary) => {
        const result = binaryToGeojson(binary);
        return Array.isArray(result) ? result : [result];
      });
      // create a geojson feature collection and append joinValues to the features
      const featureCollection: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: features.map((feature, index) => ({
          ...feature,
          properties: {
            ...feature.properties,
            ...Object.fromEntries(
              variableNames.map((name) => [name, joinValues[name][index]])
            ),
          },
        })),
      };
      return featureCollection;
    }
    case SpatialJoinGeometryType.GeoJsonFeature: {
      // append joinValues to the properties of the features
      const featuresWithJoinValues = geometries.map((feature, index) => ({
        ...feature,
        properties: {
          ...feature.properties,
          ...Object.fromEntries(
            variableNames.map((name) => [name, joinValues[name][index]])
          ),
        },
      }));
      return {
        type: 'FeatureCollection',
        features: featuresWithJoinValues,
      };
    }
    case SpatialJoinGeometryType.ArcLayerData: {
      // return a csv style array of features with joinValues
      const featuresWithJoinValues = geometries.map((feature, index) => [
        // feature is ArcLayerData: {source: [], target: [], index: number}
        feature,
        ...variableNames.map((name) => joinValues[name][index]),
      ]);
      // append the variable names to the first row
      featuresWithJoinValues.unshift(['geometry', ...variableNames]);
      return featuresWithJoinValues;
    }
    case SpatialJoinGeometryType.PointLayerData: {
      // return a csv style array of features with joinValues
      const featuresWithJoinValues = geometries.map((feature, index) => [
        // feature is PointLayerData: {position: [], index: number}
        feature,
        ...variableNames.map((name) => joinValues[name][index]),
      ]);
      // append the variable names to the first row
      featuresWithJoinValues.unshift(['geometry', ...variableNames]);

      // convert geometries to FeatureCollection
      const featureCollection: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: geometries.map((feature, index) => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: feature.position,
          },
          properties: Object.fromEntries(
            variableNames.map((name) => [name, joinValues[name][index]])
          ),
        })),
      };
      return featureCollection;
    }
    default:
      throw new Error('Unsupported geometry type');
  }
}
