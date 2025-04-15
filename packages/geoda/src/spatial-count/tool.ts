import { tool } from '@openassistant/core';
import {
  SpatialJoinGeometries,
  spatialJoin as spatialJoinFunc,
} from '@geoda/core';
import { z } from 'zod';
import { applyJoin } from './apply-join';
import { SpatialJoinToolComponent } from './component/spatial-count-component';
import { GetValues } from '../types';

export const spatialJoin = tool<
  // parameters of the tool
  z.ZodObject<{
    firstDatasetName: z.ZodString;
    secondDatasetName: z.ZodString;
    joinVariableNames: z.ZodArray<z.ZodString>;
    joinOperators: z.ZodArray<z.ZodString>;
  }>,
  // return type of the tool
  ExecuteSpatialJoinResult['llmResult'],
  // additional data of the tool
  ExecuteSpatialJoinResult['additionalData'],
  // type of the context
  SpatialCountFunctionContext
>({
  description:
    'spatial join geometries from the first dataset with geometries from the second dataset.',
  parameters: z.object({
    firstDatasetName: z
      .string()
      .describe(
        'The name of the first or right dataset, which will be joined.'
      ),
    secondDatasetName: z
      .string()
      .describe('The name of the second or left dataset.'),
    joinVariableNames: z
      .array(z.string())
      .describe(
        'The array of variable names from the first dataset to be joined.'
      ),
    joinOperators: z
      .array(z.string())
      .describe(
        'The array of operator to join each variable. The possible operators are: sum, mean, min, max, median'
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
  getGeometries: (datasetName: string) => SpatialJoinGeometries;
  getValues: GetValues;
  saveAsDataset?: (datasetName: string, data: Record<string, number[]>) => void;
};

export type ExecuteSpatialJoinResult = {
  llmResult: {
    success: boolean;
    result?: {
      firstDatasetName: string;
      secondDatasetName: string;
      joinVariableNames?: string[];
      joinOperators?: string[];
      details: string;
    };
    error?: string;
  };
  additionalData?: {
    firstDatasetName: string;
    secondDatasetName: string;
    joinVariableNames?: string[];
    joinOperators?: string[];
    joinResult: number[][];
    joinValues: Record<string, number[]>;
  };
};

type SpatialJoinArgs = {
  firstDatasetName: string;
  secondDatasetName: string;
  joinVariableNames: string[];
  joinOperators: string[];
};

function isSpatialJoinArgs(args: unknown): args is SpatialJoinArgs {
  return (
    typeof args === 'object' &&
    args !== null &&
    'firstDatasetName' in args &&
    typeof args.firstDatasetName === 'string' &&
    'secondDatasetName' in args &&
    typeof args.secondDatasetName === 'string' &&
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

  const {
    firstDatasetName,
    secondDatasetName,
    joinVariableNames,
    joinOperators,
  } = args;
  const { getGeometries, getValues } = options.context;

  return runSpatialJoin({
    firstDatasetName,
    secondDatasetName,
    joinVariableNames,
    joinOperators,
    getGeometries,
    getValues,
  });
}

export async function runSpatialJoin({
  firstDatasetName,
  secondDatasetName,
  joinVariableNames,
  joinOperators,
  getGeometries,
  getValues,
}: {
  firstDatasetName: string;
  secondDatasetName: string;
  joinVariableNames?: string[];
  joinOperators?: string[];
  getGeometries: (datasetName: string) => SpatialJoinGeometries;
  getValues: GetValues;
}) {
  try {
    // Get geometries from both datasets
    const firstGeometries = getGeometries(firstDatasetName);
    const secondGeometries = getGeometries(secondDatasetName);

    const result = await spatialJoinFunc({
      leftGeometries: secondGeometries,
      rightGeometries: firstGeometries,
    });

    // get basic statistics of the result
    const basicStatistics = getBasicStatistics(result);

    const joinValues: Record<string, number[]> = {
      Count: result.map((row) => row.length),
    };

    // get the values of the left dataset if joinVariableNames is provided
    if (joinVariableNames && joinOperators) {
      joinVariableNames.forEach(async (variableName, index) => {
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
      });
    }

    return {
      llmResult: {
        success: true,
        result: {
          firstDatasetName,
          secondDatasetName,
          joinVariableNames,
          joinOperators,
          details: `Spatial count function executed successfully. ${JSON.stringify(basicStatistics)}`,
        },
      },
      additionalData: {
        firstDatasetName,
        secondDatasetName,
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
