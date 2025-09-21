// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistantTool, OpenAssistantToolOptions, generateId, z } from '@openassistant/utils';

import {
  deviationFromMean,
  standardizeMAD,
  rangeAdjust,
  rangeStandardize,
  standardize,
} from '@geoda/core';
import { GetValues } from '@openassistant/plots';

export type StandardizeVariableToolArgs = z.ZodObject<{
  datasetName: z.ZodString;
  variableName: z.ZodString;
  standardizationMethod: z.ZodEnum<
    [
      'deviationFromMean',
      'standardizeMAD',
      'rangeAdjust',
      'rangeStandardize',
      'standardize',
    ]
  >;
  saveData: z.ZodOptional<z.ZodBoolean>;
}>;

export type StandardizeVariableToolLlmResult = {
  success: boolean;
  details?: string;
  error?: string;
  instruction?: string;
};

export type StandardizeVariableToolAdditionalData = {
  saveData: boolean;
  datasetName: string;
  [key: string]:
    | {
        type: string;
        content: Record<string, number[]>;
      }
    | unknown;
};

export type StandardizeVariableToolResult = {
  llmResult: StandardizeVariableToolLlmResult;
  additionalData?: StandardizeVariableToolAdditionalData;
};

export type StandardizeVariableToolContext = {
  getValues: GetValues;
};

/**
 * ## StandardizeVariableTool Class
 * 
 * The StandardizeVariableTool class standardizes data variables using various statistical methods.
 * This tool extends OpenAssistantTool and provides a class-based approach for data standardization.
 *
 * ### Standardization Methods
 *
 * - deviation from mean
 * - standardize MAD
 * - range adjust
 * - range standardize
 * - standardize (Z-score)
 *
 * ## Example Code
 * ```ts
 * import { StandardizeVariableTool } from '@openassistant/geoda';
 * import { generateText } from 'ai';
 *
 * // Simple usage with defaults
 * const standardizeVariableTool = new StandardizeVariableTool();
 *
 * // Or with custom context
 * const standardizeVariableTool = new StandardizeVariableTool(
 *   undefined, // use default description
 *   undefined, // use default parameters
 *   {
 *     getValues: (datasetName, variableName) => {
 *       return getValues(datasetName, variableName);
 *     },
 *   }
 * );
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Standardize the data of the variable "income" of the dataset "income_data" using the deviation from mean method',
 *   tools: { standardizeVariable: standardizeVariableTool.toVercelAiTool() },
 * });
 * ```
 */
export const StandardizeVariableArgs = z.object({
  datasetName: z.string(),
  variableName: z.string(),
  standardizationMethod: z.enum([
    'deviationFromMean',
    'standardizeMAD',
    'rangeAdjust',
    'rangeStandardize',
    'standardize',
  ]),
  saveData: z.boolean().optional(),
});

export class StandardizeVariableTool extends OpenAssistantTool<typeof StandardizeVariableArgs> {
  protected readonly defaultDescription = 'Standardize the data of a variable using one of the following methods: deviation from mean, standardize MAD, range adjust, range standardize, standardize (Z-score)';
  protected readonly defaultParameters = StandardizeVariableArgs;

  constructor(options: OpenAssistantToolOptions<typeof StandardizeVariableArgs> = {}) {
    super({
      ...options,
      context: options.context || {
        getValues: () => {
          throw new Error(
            'getValues() of StandardizeVariableTool is not implemented'
          );
        },
      },
    });
  }

  async execute(
    args: z.infer<typeof StandardizeVariableArgs>,
    options?: { context?: Record<string, unknown> }
  ): Promise<StandardizeVariableToolResult> {
    try {
      const { datasetName, variableName, standardizationMethod, saveData } = args;
      const { getValues } = options?.context as StandardizeVariableToolContext;

      const values = await getValues(datasetName, variableName);

      let standardizedValues: number[] | undefined;

      switch (standardizationMethod) {
        case 'deviationFromMean':
          standardizedValues = await deviationFromMean(values);
          break;
        case 'standardizeMAD':
          standardizedValues = await standardizeMAD(values);
          break;
        case 'rangeAdjust':
          standardizedValues = await rangeAdjust(values);
          break;
        case 'rangeStandardize':
          standardizedValues = await rangeStandardize(values);
          break;
        case 'standardize':
          standardizedValues = await standardize(values);
          break;
        default:
          throw new Error(
            `Invalid standardization method: ${standardizationMethod}`
          );
      }

      if (!standardizedValues) {
        throw new Error(
          `Failed to standardize the variable ${variableName} of dataset ${datasetName} using the ${standardizationMethod} method.`
        );
      }

      // create an output dataset name
      const outputDatasetName = `${standardizationMethod}_${generateId()}`;

      const outputVariableName = `${variableName}_${standardizationMethod}`;

      // create an output variable type
      const additionalData = {
        saveData: saveData ?? false,
        datasetName: outputDatasetName,
        originalDatasetName: datasetName,
        [outputDatasetName]: {
          type: 'columnData',
          content: {
            [outputVariableName]: values,
          },
        },
      };

      const llmResult = {
        success: true,
        details: `Standardized the variable ${variableName} of dataset ${datasetName} using the ${standardizationMethod} method. The result is stored in the dataset ${outputDatasetName}.`,
      };

      return {
        llmResult,
        additionalData,
      };
    } catch (error) {
      console.error('Error executing standardizeVariable tool:', error);
      return {
        llmResult: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }
}
