import { extendedTool } from '@openassistant/utils';
import { z } from 'zod';
import {
  LinearRegressionResult,
  SpatialErrorResult,
  SpatialLagResult,
} from '@geoda/regression';

import { GetValues, WeightsProps } from '../types';
import { printRegressionResult, runRegression } from './utils';
import { getWeights } from '../utils';

export type SpatialRegressionFunctionArgs = z.ZodObject<{
  datasetName: z.ZodString;
  dependentVariable: z.ZodString;
  independentVariables: z.ZodArray<z.ZodString>;
  modelType: z.ZodEnum<['classic', 'spatial-lag', 'spatial-error']>;
  weightsId: z.ZodOptional<z.ZodString>;
}>;

export type SpatialRegressionLlmResult = {
  success: boolean;
  result?: string;
  error?: string;
};

export type SpatialRegressionAdditionalData = {
  datasetName: string;
  report: LinearRegressionResult | SpatialLagResult | SpatialErrorResult | null;
};

export type SpatialRegressionFunctionContext = {
  getValues: GetValues;
  config?: {
    theme?: string;
  };
};

/**
 * The spatial regression tool is used to perform regression analysis with spatial data.
 *
 * The tool supports three types of regression models:
 * - Classic (OLS) regression
 * - Spatial lag model (accounting for spatial dependence in the dependent variable)
 * - Spatial error model (accounting for spatial dependence in the error term)
 *
 * When user prompts e.g. *can you run a spatial regression analysis on the housing data?*
 *
 * 1. The LLM will execute the callback function of spatialRegressionFunctionDefinition, and perform the regression analysis using the data retrieved from `getValues` function.
 * 2. The result will include regression coefficients, significance tests, and model diagnostics.
 * 3. The LLM will respond with the analysis results and suggestions for model improvement.
 *
 * ### For example
 * ```
 * User: can you run a spatial regression analysis on the housing data?
 * LLM: I've performed a spatial lag regression analysis on the housing data. The model shows significant spatial effects...
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
 * const regressionTool = getVercelAiTool('spatialRegression', toolContext, onToolCompleted);
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Can you run a spatial regression analysis of "revenue ~ population + income" on the data?',
 *   tools: {spatialRegression: regressionTool},
 * });
 * ```
 */
export const spatialRegression = extendedTool<
  SpatialRegressionFunctionArgs,
  SpatialRegressionLlmResult,
  SpatialRegressionAdditionalData,
  SpatialRegressionFunctionContext
>({
  description: `Apply spatial regression analysis.
Note:
- please only use the knowledge from Luc Anselin's GeoDa book and the GeoDa documentation to answer the question
- you can run spatial diagnostics with OLS model if you need to determine if spatial regression model is needed
- do NOT run global Moran's I with independent variables to determine if spatial regression model is needed
- you can run spatial models if you need to account for spatial effects in the model
- please provide suggestions for improving the model and the results
  `,
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

type SpatialRegressionArgs = {
  datasetName: string;
  dependentVariable: string;
  independentVariables: string[];
  modelType: string;
  weightsId?: string;
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
    'modelType' in args
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
): Promise<{
  llmResult: SpatialRegressionLlmResult;
  additionalData?: SpatialRegressionAdditionalData;
}> {
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
    const { getValues } = options.context;

    // Get the dependent variable values
    const yValues = await getValues(datasetName, dependentVariable);

    // Get the independent variables values
    const xValues = await Promise.all(
      independentVariables.map((varName) => getValues(datasetName, varName))
    );

    // Get weights if needed
    const { weights, weightsMeta } = getWeights(
      weightsId,
      options.previousExecutionOutput
    );

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
