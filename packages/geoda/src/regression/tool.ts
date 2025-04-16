import { tool } from '@openassistant/core';
import { z } from 'zod';
import { WeightsMeta } from '@geoda/core';
import { GetValues, WeightsProps } from '../types';
import { printRegressionResult, runRegression } from './utils';
import {
  LinearRegressionResult,
  SpatialErrorResult,
  SpatialLagResult,
} from '@geoda/regression';

export const spatialRegression = tool<
  // parameters of the tool
  z.ZodObject<{
    datasetName: z.ZodString;
    dependentVariable: z.ZodString;
    independentVariables: z.ZodArray<z.ZodString>;
    modelType: z.ZodEnum<['classic', 'spatial-lag', 'spatial-error']>;
    weightsId: z.ZodOptional<z.ZodString>;
  }>,
  // return type of the tool
  ExecuteSpatialRegressionResult['llmResult'],
  // additional data of the tool
  ExecuteSpatialRegressionResult['additionalData'],
  // type of the context
  SpatialRegressionFunctionContext
>({
  description: 'Apply spatial regression analysis.',
  parameters: z.object({
    datasetName: z.string(),
    dependentVariable: z.string(),
    independentVariables: z.array(z.string()),
    modelType: z.enum(['classic', 'spatial-lag', 'spatial-error']),
    weightsId: z
      .string()
      .optional()
      .describe(
        'The id of the spatial weights for spatial diagnostics in classic model or spatial models'
      ),
  }),
  execute: executeSpatialRegression,
});

export type SpatialRegressionTool = typeof spatialRegression;

export type ExecuteSpatialRegressionResult = {
  llmResult: {
    success: boolean;
    result?: string;
    error?: string;
  };
  additionalData?: {
    datasetName: string;
    report:
      | LinearRegressionResult
      | SpatialLagResult
      | SpatialErrorResult
      | null;
  };
};

export type SpatialRegressionFunctionContext = {
  getValues: GetValues;
  config?: {
    theme?: string;
  };
};

type SpatialRegressionArgs = {
  datasetName: string;
  dependentVariable: string;
  independentVariables: string[];
  modelType: string;
  weightsId: string;
};

export function isSpatialRegressionArgs(
  args: unknown
): args is SpatialRegressionArgs {
  return (
    typeof args === 'object' &&
    args !== null &&
    'datasetName' in args &&
    'dependentVariable' in args &&
    'independentVariables' in args &&
    'modelType' in args &&
    'weightsId' in args
  );
}

function isSpatialRegressionContext(
  context: unknown
): context is SpatialRegressionFunctionContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getValues' in context &&
    typeof context.getValues === 'function'
  );
}

async function executeSpatialRegression(
  args,
  options
): Promise<ExecuteSpatialRegressionResult> {
  try {
    if (!isSpatialRegressionArgs(args)) {
      throw new Error('Invalid arguments for spatialRegression tool');
    }

    if (options.context && !isSpatialRegressionContext(options.context)) {
      throw new Error('Invalid context for spatialRegression tool');
    }

    const {
      datasetName,
      dependentVariable,
      independentVariables,
      modelType,
      weightsId,
    } = args;
    const { getValues, getExistingWeights } = options.context;

    // Get the dependent variable values
    const yValues = await getValues(datasetName, dependentVariable);

    // Get the independent variables values
    const xValues = await Promise.all(
      independentVariables.map((varName) => getValues(datasetName, varName))
    );

    // Get weights if needed
    let weights: number[][] | null = null;
    let weightsMeta: WeightsMeta | null = null;

    if (modelType !== 'classic' || !weightsId) {
      if (options.previousExecutionOutput) {
        // Try to get weights from previous execution
        options.previousExecutionOutput.forEach((output) => {
          if (
            output.data &&
            'weights' in output.data &&
            'weightsMeta' in output.data
          ) {
            if (output.data.weightsMeta.id === weightsId) {
              weights = output.data.weights;
              weightsMeta = output.data.weightsMeta;
            }
          }
        });
      }

      if (!weights && getExistingWeights) {
        const existingWeights = getExistingWeights(datasetName);
        const weightsResult = existingWeights.find(
          (weight) => weight.weightsMeta.id === weightsId
        );
        if (weightsResult) {
          weights = weightsResult.weights;
          weightsMeta = weightsResult.weightsMeta;
        }
      }
    }

    if (
      !weights &&
      (modelType === 'spatial-lag' || modelType === 'spatial-error')
    ) {
      throw new Error(
        'Weights are required for spatial-lag or spatial-error models'
      );
    }

    const weightsProps: WeightsProps | undefined =
      weights && weightsMeta
        ? {
            datasetId: datasetName,
            weightsMeta: weightsMeta,
            weights: weights,
          }
        : undefined;

    const regression = await runRegression({
      datasetName,
      model: modelType || 'classic',
      x: xValues,
      y: yValues,
      xNames: independentVariables,
      yName: dependentVariable,
      weights: weightsProps,
    });

    const report = regression.result;
    const regressionReport = printRegressionResult(report);

    return {
      llmResult: {
        success: true,
        result: regressionReport,
      },
      additionalData: {
        datasetName,
        report,
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
