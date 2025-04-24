import { tool } from '@openassistant/core';
import { spatialJoin as spatialJoinFunc } from '@geoda/core';
import { z } from 'zod';
import { applyJoin } from './apply-join';
import { SpatialJoinToolComponent } from './component/spatial-count-component';
import { GetValues, GetGeometries } from '../types';
import { getCachedGeojson } from '../utils';

export const spatialJoin = tool<
  // parameters of the tool
  z.ZodObject<{
    firstDatasetName: z.ZodString;
    secondDataset: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString>]>;
    joinVariableNames: z.ZodArray<z.ZodString>;
    joinOperators: z.ZodArray<
      z.ZodEnum<['sum', 'mean', 'min', 'max', 'median', 'count']>
    >;
  }>,
  // return type of the tool
  ExecuteSpatialJoinResult['llmResult'],
  // additional data of the tool
  ExecuteSpatialJoinResult['additionalData'],
  // type of the context
  SpatialCountFunctionContext
>({
  description: `Spatial join geometries from the first dataset with geometries from the second dataset.
  For secondDataset, you MUST use array format when joining with:
  - Zipcodes (e.g. ["10014", "10024"])
  - Counties (e.g. ["06001"] for San Francisco County)
  - States (e.g. ["CA"] for California, ["NY"] for New York)
  
  For other datasets, you can use either a string (dataset name) or array format.
  `,
  parameters: z.object({
    firstDatasetName: z.string(),
    secondDataset: z.union([
      z
        .string()
        .describe(
          'The name of an existing dataset to use as the second dataset.'
        ),
      z
        .array(z.string())
        .describe(
          'For state queries, ALWAYS use the state code in array format (e.g. ["CA"] for California, ["NY"] for New York). For zipcodes, use ["90210"]. For counties, use FIPS code in array format (e.g. ["06001"] for San Francisco County).'
        ),
    ]),
    joinVariableNames: z
      .array(z.string())
      .describe(
        'The array of variable names from the first dataset to be joined.'
      ),
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
  component: SpatialJoinToolComponent,
});

export type SpatialJoinTool = typeof spatialJoin;

/**
 * The context for the spatial count function
 * @param getGeometries - the function to get the geometries from the dataset: (datasetName: string) => SpatialJoinGeometries
 * @returns the geometries from the dataset
 */
export type SpatialCountFunctionContext = {
  getGeometries: GetGeometries;
  getValues: GetValues;
  saveAsDataset?: (datasetName: string, data: Record<string, number[]>) => void;
};

export type ExecuteSpatialJoinResult = {
  llmResult: {
    success: boolean;
    result?: {
      firstDatasetName: string;
      secondDatasetName?: string;
      secondDataset?: string[];
      joinVariableNames?: string[];
      joinOperators?: string[];
      firstTenRows?: number[][];
      details: string;
    };
    error?: string;
  };
  additionalData?: {
    firstDatasetName: string;
    secondDatasetName?: string;
    secondDataset?: string[];
    joinVariableNames?: string[];
    joinOperators?: string[];
    joinResult: number[][];
    joinValues: Record<string, number[]>;
  };
};

type SpatialJoinArgs = {
  firstDatasetName: string;
  secondDataset: string | string[];
  joinVariableNames: string[];
  joinOperators: string[];
};

function isSpatialJoinArgs(args: unknown): args is SpatialJoinArgs {
  return (
    typeof args === 'object' &&
    args !== null &&
    'firstDatasetName' in args &&
    typeof args.firstDatasetName === 'string' &&
    'joinVariableNames' in args &&
    Array.isArray(args.joinVariableNames) &&
    'joinOperators' in args &&
    Array.isArray(args.joinOperators)
  );
}

function isSpatialJoinContext(
  context: unknown
): context is SpatialCountFunctionContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getGeometries' in context &&
    typeof context.getGeometries === 'function' &&
    'getValues' in context &&
    typeof context.getValues === 'function'
  );
}

async function executeSpatialJoin(
  args,
  options
): Promise<ExecuteSpatialJoinResult> {
  if (!isSpatialJoinArgs(args)) {
    throw new Error('Invalid arguments for spatialJoin tool');
  }

  if (options.context && !isSpatialJoinContext(options.context)) {
    throw new Error('Invalid context for spatialJoin tool');
  }

  const { firstDatasetName, secondDataset, joinVariableNames, joinOperators } =
    args;
  const { getGeometries, getValues } = options.context;

  return runSpatialJoin({
    firstDatasetName,
    secondDataset,
    previousExecutionOutput: options.previousExecutionOutput,
    joinVariableNames,
    joinOperators,
    getGeometries,
    getValues,
  });
}

export async function runSpatialJoin({
  firstDatasetName,
  secondDataset,
  previousExecutionOutput,
  joinVariableNames,
  joinOperators,
  getGeometries,
  getValues,
}: {
  firstDatasetName: string;
  secondDataset: string | string[];
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
    const firstGeometries = await getGeometries(firstDatasetName);
    let secondGeometries;

    if (typeof secondDataset === 'string') {
      secondGeometries = await getGeometries(secondDataset);
    } else if (Array.isArray(secondDataset)) {
      // get the geometries (states or zipcodes) from the previous tools
      if (previousExecutionOutput?.data?.geojson) {
        secondGeometries = previousExecutionOutput.data.geojson.features;
      } else {
        secondDataset.forEach(async (item) => {
          const features = getCachedGeojson(item);
          if (features.length > 0) {
            if (!secondGeometries) {
              secondGeometries = [];
            }
            secondGeometries = [...secondGeometries, ...features];
          }
        });
      }
    }

    if (!secondGeometries) {
      throw new Error('Second dataset geometries not found');
    }

    const result = await spatialJoinFunc({
      leftGeometries: secondGeometries,
      rightGeometries: firstGeometries,
    });

    // get basic statistics of the result for LLM
    const basicStatistics = getBasicStatistics(result);

    const joinValues: Record<string, number[]> = {
      Count: result.map((row) => row.length),
    };

    // get the values of the left dataset if joinVariableNames is provided
    if (joinVariableNames && joinOperators) {
      await Promise.all(
        joinVariableNames.map(async (variableName, index) => {
          try {
            const operator = joinOperators[index];
            const values = await getValues(firstDatasetName, variableName);
            // apply join to values in each row
            const joinedValues = result.map((row) =>
              applyJoin(
                operator,
                row.map((index) => values[index])
              )
            );
            joinValues[variableName] = joinedValues;
          } catch (error) {
            throw new Error(
              `Error applying join operator to variable ${variableName}: ${error}`
            );
          }
        })
      );
    }

    // joinValues is a record of variable names and their values
    // return the first 10 rows of each variable, including the variable name
    const columns = Object.keys(joinValues);
    const firstTwoRows = columns.map((column) => ({
      [column]: joinValues[column].slice(0, 2),
    }));

    return {
      llmResult: {
        success: true,
        result: {
          firstDatasetName,
          joinVariableNames,
          joinOperators,
          firstTwoRows,
          details: `Spatial count function executed successfully. ${JSON.stringify(basicStatistics)}`,
        },
      },
      additionalData: {
        firstDatasetName,
        joinVariableNames,
        joinOperators,
        joinResult: result,
        joinValues,
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
  return {
    totalCount,
    minCount: Math.min(...result.map((row) => row.length)),
    maxCount: Math.max(...result.map((row) => row.length)),
    averageCount:
      result.reduce((sum, row) => sum + row.length, 0) / result.length,
  };
}
