import { extendedTool, generateId } from '@openassistant/utils';
import { z } from 'zod';

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

export const standardizeVariable = extendedTool<
  StandardizeVariableToolArgs,
  StandardizeVariableToolLlmResult,
  StandardizeVariableToolAdditionalData,
  StandardizeVariableToolContext
>({
  description:
    'Standardize the data of a variable using one of the following methods: deviation from mean, standardize MAD, range adjust, range standardize, standardize (Z-score)',
  parameters: z.object({
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
  }),
  context: {
    getValues: () => {
      throw new Error(
        'getValues() of StandardizeVariableTool is not implemented'
      );
    },
  },
  execute: async (args, options): Promise<StandardizeVariableToolResult> => {
    try {
      const { datasetName, variableName, standardizationMethod, saveData } =
        args;
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
          type: 'variables',
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
  },
});

export type StandardizeVariableTool = typeof standardizeVariable;
