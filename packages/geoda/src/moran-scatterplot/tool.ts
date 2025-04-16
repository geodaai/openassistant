import { tool } from '@openassistant/core';
import { z } from 'zod';
import { WeightsMeta } from '@geoda/core';
import { spatialLag } from '@geoda/lisa';
import {
  simpleLinearRegression,
  SimpleLinearRegressionResult,
} from '@openassistant/echarts';

import { GetValues } from '../types';
import { SpatialWeights } from './callback-function';
import { MoranScatterPlotToolComponent } from './component/moran-scatter-component';
import { getCachedWeightsById } from '../weights/tool';

export const globalMoran = tool<
  // parameters of the tool
  z.ZodObject<{
    datasetName: z.ZodString;
    variableName: z.ZodString;
    weightsId: z.ZodOptional<z.ZodString>;
  }>,
  // return type of the tool
  ExecuteMoranScatterPlotResult['llmResult'],
  // additional data of the tool
  ExecuteMoranScatterPlotResult['additionalData'],
  // type of the context
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
  component: MoranScatterPlotToolComponent,
});

export type GlobalMoranTool = typeof globalMoran;

export type ExecuteMoranScatterPlotResult = {
  llmResult: {
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
  additionalData?: {
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
};

/**
 * The context of the scatterplot function. The context will be used by the function calling to create the scatterplot.
 */
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
): Promise<ExecuteMoranScatterPlotResult> {
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
          if (output.data.weightsMeta.id === weightsId) {
            weights = output.data.weights;
            weightsMeta = output.data.weightsMeta;
          }
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
