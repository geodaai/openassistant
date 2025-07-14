// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { extendedTool, generateId } from '@openassistant/utils';
import { calculateRates } from '@geoda/core';
import { z } from 'zod';

import { GetValues } from '../types';
import { getWeights } from '../utils';

/**
 * ## rate Tool
 * 
 * This tool is used to calculate the rates from a base variable and an event variable using one of the following methods:
 * 
 * ### Rate Methods
 *
 * - Raw Rates
 * - Excess Risk
 * - Empirical Bayes
 * - Spatial Rates
 * - Spatial Empirical Bayes
 * - EB Rate Standardization
 *
 * ## Example
 * ```ts
 * import { rate, RateTool } from '@openassistant/geoda';
 * import { convertToVercelAiTool } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * const rateTool: RateTool = {
 *   ...rate,
 *   context: {
 *     getValues: (datasetName, variableName) => {
 *       return getValues(datasetName, variableName);
 *     },
 *   },
 * };
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Calculate the excess risk rates from the base variable "population" and the event variable "crimes"',
 *   tools: { rate: convertToVercelAiTool(rateTool) },
 * });
 * ```
 */
export const rate = extendedTool<
  RateFunctionArgs,
  RateLlmResult,
  RateAdditionalData,
  RateContext
>({
  description:
    'Calculate the rates from a base variable and an event variable.',
  parameters: z.object({
    datasetName: z.string(),
    baseVariableName: z.string(),
    eventVariableName: z.string(),
    rateMethod: z.enum([
      'Raw Rates',
      'Excess Risk',
      'Empirical Bayes',
      'Spatial Rates',
      'Spatial Empirical Bayes',
      'EB Rate Standardization',
    ]),
    saveData: z
      .boolean()
      .optional()
      .describe('Whether to save the rates data.'),
    outputRateVariableName: z
      .string()
      .optional()
      .describe('A name for the output rate variable based on the context.'),
    weightsID: z
      .string()
      .optional()
      .describe(
        'The weightsID of the spatial weights. Only required for spatial rates.'
      ),
  }),
  execute: async (args, options) => {
    try {
      const {
        datasetName,
        baseVariableName,
        eventVariableName,
        rateMethod,
        weightsID,
        saveData,
        outputRateVariableName,
      } = args;
      if (!options?.context || !isRateContext(options.context)) {
        throw new Error('Context is required and must implement RateContext');
      }

      const { getValues } = options.context;
      const baseValues = (await getValues(
        datasetName,
        baseVariableName
      )) as number[];

      const eventValues = (await getValues(
        datasetName,
        eventVariableName
      )) as number[];

      // Get weights if needed
      const { weights } = getWeights(weightsID);

      if (!weights && rateMethod.startsWith('Spatial')) {
        throw new Error('Weights are required for spatial rates');
      }

      const rates = calculateRates({
        eventValues,
        baseValues,
        method: rateMethod,
        neighbors: weights ?? undefined,
      });

      // create an output dataset name
      const outputDatasetName = `rates_${generateId()}`;

      // create an output variable name
      const outputVariableName =
        outputRateVariableName ?? `rate_${generateId()}`;

      return {
        llmResult: {
          success: true,
          result: `The rates created successfully. The result is stored in the column ${outputVariableName} of the dataset ${outputDatasetName}.`,
        },
        additionalData: {
          saveData: saveData ?? false,
          originalDatasetName: datasetName,
          datasetName: outputDatasetName,
          [outputDatasetName]: {
            type: 'columnData',
            content: {
              [outputVariableName]: rates,
            },
          },
        },
      };
    } catch (error: unknown) {
      return {
        llmResult: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  },
});

export type RateFunctionArgs = z.ZodObject<{
  datasetName: z.ZodString;
  baseVariableName: z.ZodString;
  eventVariableName: z.ZodString;
  rateMethod: z.ZodEnum<
    [
      'Raw Rates',
      'Excess Risk',
      'Empirical Bayes',
      'Spatial Rates',
      'Spatial Empirical Bayes',
      'EB Rate Standardization',
    ]
  >;
  weightsID: z.ZodOptional<z.ZodString>;
  saveData: z.ZodOptional<z.ZodBoolean>;
  outputRateVariableName: z.ZodOptional<z.ZodString>;
}>;

export type RateLlmResult = {
  success: boolean;
  error?: string;
  details?: string;
};

export type RateAdditionalData = {
  datasetName: string;
  variableName: string;
  [key: string]: unknown;
};

export type RateContext = {
  getValues: GetValues;
};

export function isRateContext(context: unknown): context is RateContext {
  return (
    typeof context === 'object' && context !== null && 'getValues' in context
  );
}

export type RateTool = typeof rate;
