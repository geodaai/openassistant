import { tool } from '@openassistant/utils';
import { z } from 'zod';
import { WeightsMeta } from '@geoda/core';
import { spatialLag } from '@geoda/lisa';
import {
  simpleLinearRegression,
  SimpleLinearRegressionResult,
} from '@openassistant/echarts';

import { GetValues } from '../types';
import { getCachedWeightsById } from '../weights/tool';

export type SpatialWeights = {
  weights: number[][];
  weightsMeta: WeightsMeta;
};

export type MoranScatterPlotFunctionArgs = z.ZodObject<{
  datasetName: z.ZodString;
  variableName: z.ZodString;
  weightsId: z.ZodOptional<z.ZodString>;
}>;

export type MoranScatterPlotLlmResult = {
  success: boolean;
  result?: {
    datasetName: string;
    variableName: string;
    weightsId: string;
    globalMoranI: number;
    details: string;
  };
  error?: string;
};

export type MoranScatterPlotAdditionalData = {
  datasetName: string;
  variableName: string;
  weightsId: string;
  weights: number[][];
  weightsMeta: WeightsMeta;
  values: number[];
  lagValues: number[];
  regression: SimpleLinearRegressionResult;
  slope: number;
  isDraggable?: boolean;
  isExpanded?: boolean;
  theme?: string;
};

export type MoranScatterPlotFunctionContext = {
  /** Get the values of variable from the dataset. */
  getValues: GetValues;
  /** The configuration of the scatterplot. */
  config?: {
    isDraggable?: boolean;
    isExpanded?: boolean;
    theme?: string;
  };
};

/**
 * The Moran scatterplot tool is used to create a scatterplot of spatial data and calculate Global Moran's I.
 *
 * The tool creates a scatterplot where:
 * - X-axis represents the original variable values
 * - Y-axis represents the spatial lag values
 * - The slope of the regression line represents Global Moran's I
 *
 * When user prompts e.g. *can you create a Moran scatterplot for the population data?*
 *
 * 1. The LLM will execute the callback function of moranScatterPlotFunctionDefinition, and create the scatterplot using the data retrieved from `getValues` function.
 * 2. The result will include the Global Moran's I value and a scatterplot visualization.
 * 3. The LLM will respond with the analysis results to the user.
 *
 * ### For example
 * ```
 * User: can you create a Moran scatterplot for the population data?
 * LLM: I've created a Moran scatterplot for the population data. The Global Moran's I is 0.75, indicating strong positive spatial autocorrelation...
 * ```
 *
 * ### Code example
 * ```typescript
 * import { getVercelAiTool } from '@openassistant/geoda';
 * import { generateText } from 'ai';
 *
 * const toolContext = {
 *   getValues: (datasetName, variableName) => {
 *     return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *   },
 * };
 *
 * const moranTool = getVercelAiTool('globalMoran', toolContext, onToolCompleted);
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Can you create a Moran scatterplot for the population data?',
 *   tools: {globalMoran: moranTool},
 * });
 * ```
 */
export const globalMoran = tool<
  MoranScatterPlotFunctionArgs,
  MoranScatterPlotLlmResult,
  MoranScatterPlotAdditionalData,
  MoranScatterPlotFunctionContext
>({
  description: 'Create a Moran scatterplot',
  parameters: z.object({
    datasetName: z.string(),
    variableName: z.string(),
    weightsId: z
      .string()
      .optional()
      .describe(
        'The id of a spatial weights. It can be created using function tool "spatialWeights". If not provided, please try to create a weights first.'
      ),
  }),
  execute: executeMoranScatterPlot,
});

export type GlobalMoranTool = typeof globalMoran;

type MoranScatterPlotArgs = {
  datasetName: string;
  variableName: string;
  weightsId?: string;
};

export function isMoranScatterPlotArgs(
  args: unknown
): args is MoranScatterPlotArgs {
  return (
    typeof args === 'object' &&
    args !== null &&
    'datasetName' in args &&
    'variableName' in args
  );
}

export function isWeightsOutputData(data: unknown): data is SpatialWeights {
  return (
    typeof data === 'object' &&
    data !== null &&
    'weights' in data &&
    'weightsMeta' in data
  );
}

function isMoranScatterPlotContext(
  context: unknown
): context is MoranScatterPlotFunctionContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getValues' in context &&
    typeof context.getValues === 'function'
  );
}

async function executeMoranScatterPlot(
  args,
  options
): Promise<{
  llmResult: MoranScatterPlotLlmResult;
  additionalData?: MoranScatterPlotAdditionalData;
}> {
  try {
    if (!isMoranScatterPlotArgs(args)) {
      throw new Error('Invalid arguments for moranScatterPlot tool');
    }

    if (options.context && !isMoranScatterPlotContext(options.context)) {
      throw new Error('Invalid context for moranScatterPlot tool');
    }

    const { datasetName, variableName, weightsId } = args;
    const { getValues, config } = options.context;

    // get the values of the variable
    const values = await getValues(datasetName, variableName);

    // get the weights
    let weights: number[][] | null = null;
    let weightsMeta: WeightsMeta | null = null;

    if (options.previousExecutionOutput) {
      // check if weightsId can be retrived from previousExecutionOutput
      options.previousExecutionOutput.forEach((output) => {
        if (isWeightsOutputData(output.data)) {
          weights = output.data.weights;
          weightsMeta = output.data.weightsMeta;
        }
      });
    }

    if (!weights && weightsId) {
      const existingWeights = getCachedWeightsById(weightsId);
      if (existingWeights) {
        weights = existingWeights.weights;
        weightsMeta = existingWeights.weightsMeta;
      }
    }

    if (!weights || !weightsMeta || !weightsId) {
      throw new Error(
        'Weights can not be found or created. Can not create Moran scatterplot without weights.'
      );
    }

    const lagValues = await spatialLag(values, weights);
    const regression = await simpleLinearRegression(values, lagValues);
    const slope = regression.slope;

    return {
      llmResult: {
        success: true,
        result: {
          datasetName,
          variableName,
          weightsId,
          globalMoranI: slope,
          details: `Global Moran's I is ${slope} for ${variableName} with ${weightsMeta.type} weights ${weightsId}.`,
        },
      },
      additionalData: {
        datasetName,
        variableName,
        weightsId,
        weights,
        weightsMeta,
        values,
        lagValues,
        regression,
        slope,
        isDraggable: config?.isDraggable || false,
        isExpanded: config?.isExpanded || false,
        theme: config?.theme || 'light',
      },
    };
  } catch (error) {
    console.error(error);
    return {
      llmResult: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
}
