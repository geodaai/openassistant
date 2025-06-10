import { extendedTool } from '@openassistant/utils';
import { z } from 'zod';
import { WeightsMeta } from '@geoda/core';
import { spatialLag } from '@geoda/lisa';
import {
  simpleLinearRegression,
  SimpleLinearRegressionResult,
} from '@openassistant/plots';

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
  globalMoranI?: number;
  result?: string;
  error?: string;
};

export type MoranScatterPlotAdditionalData = {
  datasetName: string;
  variableName: string;
  values: number[];
  lagValues: number[];
  regression: SimpleLinearRegressionResult;
  slope: number;
  isDraggable?: boolean;
  isExpanded?: boolean;
  theme?: string;
};

export type MoranScatterPlotFunctionContext = {
  getValues: GetValues;
};

/**
 * The Global Moran's I tool is used to calculate Global Moran's I for a given variable to check if the variable is spatially clustered or dispersed.
 *
 * **Example user prompts:**
 * - "Is the population data spatially clustered or dispersed?"
 * - "Is there a spatial autocorrelation in the population data?"
 * - "What is the Global Moran's I for the population data?"
 *
 * :::note
 * The global Moran's I tool should always be used with the spatialWeights tool. The LLM models know how to use the spatialWeights tool for the Moran scatterplot analysis.
 * :::
 *
 * @example
 * ```typescript
 * import { globalMoran, GlobalMoranTool, spatialWeights, SpatialWeightsTool } from "@openassistant/geoda";
 * import { convertToVercelAiTool } from "@openassistant/utils";
 *
 * const spatialWeightsTool: SpatialWeightsTool = {
 *   ...spatialWeights,
 *   context: {
 *     getGeometries: async (datasetName) => {
 *       return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
 *     },
 *   },
 * });
 *
 * const moranTool: GlobalMoranTool = {
 *   ...globalMoran,
 *   context: {
 *     getValues: async (datasetName, variableName) => {
 *       return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *     },
 *   },
 * });
 *
 * const result = await generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Can you calculate the Global Moran\'s I for the population data?',
 *   tools: {
 *     globalMoran: convertToVercelAiTool(moranTool),
 *     spatialWeights: convertToVercelAiTool(spatialWeightsTool),
 *   },
 * });
 * ```
 *
 * :::tip
 * You can use the `MoranScatterPlotToolComponent` React component from the `@openassistant/components` package to visualize the Moran scatterplot using
 * the `additionalData` object returned by the tool.
 * :::
 *
 * For a more complete example, see the [Geoda Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_geoda_example).
 */
export const globalMoran = extendedTool<
  MoranScatterPlotFunctionArgs,
  MoranScatterPlotLlmResult,
  MoranScatterPlotAdditionalData,
  MoranScatterPlotFunctionContext
>({
  description: "Calculate Global Moran's I for a given variable",
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
  execute: executeGlobalMoran,
  context: {
    getValues: () => {
      throw new Error('getValues not implemented.');
    },
  },
});

export type GlobalMoranTool = typeof globalMoran;

type GlobalMoranArgs = {
  datasetName: string;
  variableName: string;
  weightsId?: string;
};

export function isGlobalMoranArgs(args: unknown): args is GlobalMoranArgs {
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

export type GlobalMoranFunctionContext = {
  getValues: GetValues;
};

function isGlobalMoranContext(
  context: unknown
): context is GlobalMoranFunctionContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getValues' in context &&
    typeof context.getValues === 'function'
  );
}

async function executeGlobalMoran(
  args,
  options
): Promise<{
  llmResult: MoranScatterPlotLlmResult;
  additionalData?: MoranScatterPlotAdditionalData;
}> {
  try {
    if (!isGlobalMoranArgs(args)) {
      throw new Error('Invalid arguments for globalMoran tool');
    }

    if (options.context && !isGlobalMoranContext(options.context)) {
      throw new Error('Invalid context for globalMoran tool');
    }

    const { datasetName, variableName, weightsId } = args;
    const { getValues } = options.context;

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
      // get weights from cache inside openassistant/geoda module
      const existingWeights = getCachedWeightsById(weightsId);
      if (existingWeights) {
        weights = existingWeights.weights;
        weightsMeta = existingWeights.weightsMeta;
      }
    }

    if (!weights || !weightsMeta || !weightsId) {
      throw new Error(
        "Weights can not be found or created. Can not calculate Global Moran's I without weights."
      );
    }

    const lagValues = await spatialLag(values, weights);
    const regression = await simpleLinearRegression(values, lagValues);
    const slope = regression.slope;

    return {
      llmResult: {
        success: true,
        globalMoranI: slope,
        result: `Global Moran's I is ${slope} for ${variableName} with ${weightsMeta.type} weights ${weightsId}.`,
      },
      additionalData: {
        datasetName,
        variableName,
        values,
        lagValues,
        regression,
        slope,
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
