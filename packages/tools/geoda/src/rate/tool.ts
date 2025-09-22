// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistantTool, OpenAssistantToolOptions, generateId } from '@openassistant/utils';
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
export class RateTool extends OpenAssistantTool<typeof RateArgs> {
  protected getDefaultDescription(): string {
    return 'Calculate the rates from a base variable and an event variable.';
  }
  
  protected getDefaultParameters() {
    return RateArgs;
  }

  constructor(options: OpenAssistantToolOptions<typeof RateArgs> = {}) {
    super({
      ...options,
      context: options.context || {
        getValues: () => {
          throw new Error('getValues not implemented.');
        },
      },
    });
  }

  async execute(
    args: z.infer<typeof RateArgs>,
    options?: { context?: Record<string, unknown> }
  ): Promise<{
    llmResult: RateLlmResult;
    additionalData?: RateAdditionalData;
  }> {
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
  }
}

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
