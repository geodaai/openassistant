import { tool } from '@openassistant/utils';
import { z } from 'zod';
import {
  equalIntervalBreaks,
  hinge15Breaks,
  hinge30Breaks,
  naturalBreaks,
  percentileBreaks,
  quantileBreaks,
  standardDeviationBreaks,
} from '@geoda/core';
import { GetValues } from '../types';

export const dataClassify = tool<
  // parameters of the tool
  z.ZodObject<{
    datasetName: z.ZodString;
    variableName: z.ZodString;
    method: z.ZodEnum<
      [
        'quantile',
        'natural breaks',
        'equal interval',
        'percentile',
        'box',
        'standard deviation',
        'unique values',
      ]
    >;
    k: z.ZodNumber;
    hinge: z.ZodOptional<z.ZodNumber>;
  }>,
  // return type of the tool
  ExecuteDataClassifyResult['llmResult'],
  // additional data of the tool
  ExecuteDataClassifyResult['additionalData'],
  // type of the context
  DataClassifyFunctionContext
>({
  description: 'Classify the data into k bins or classes',
  parameters: z.object({
    datasetName: z.string(),
    variableName: z.string(),
    method: z
      .enum([
        'quantile',
        'natural breaks',
        'equal interval',
        'percentile',
        'box',
        'standard deviation',
        'unique values',
      ])
      .describe('The classification method.'),
    k: z.number().describe('The number of bins or classes'),
    hinge: z
      .number()
      .optional()
      .describe('The hinge value when box classification is used'),
  }),
  execute: executeDataClassify,
  context: {
    getValues: () => {
      throw new Error('getValues() of DataClassifyTool is not implemented');
    },
  },
});

/**
 * The context of the data classify function.
 * @param getValues - Get the values of a variable from the dataset. See {@link GetValues} for more details.
 */
export type DataClassifyFunctionContext = {
  getValues: GetValues;
};

/**
 * The type of the data classify tool.
 *
 * The function tool can be used to classify the data into k bins or classes.
 * The classification method can be one of the following types: quantile, natural breaks, equal interval, percentile, box, standard deviation, unique values.
 *
 * When user prompts e.g. *can you classify the data of population into 5 classes?*
 *
 * 1. The LLM will execute the callback function of dataClassifyFunctionDefinition, and apply data classification using the data retrived from `getValues` function.
 * 2. The result will be an array of break points, which can be used to classify the data into k bins or classes.
 * 3. The LLM will respond with the break points to the user.
 *
 * ### For example
 * ```
 * User: can you classify the data of population into 5 classes?
 * LLM:  Yes, I've used the quantile method to classify the data of population into 5 classes. The break points are [10000, 20000, 30000, 40000, 50000].
 * ```
 *
 * ### Code example
 * ```typescript
 * import { AiAssistant, dataClassify, DataClassifyTool } from "ai-assistant";
 *
 * const classifyTool: DataClassifyTool = {
 *   ...dataClassify,
 *   context: {
 *     ...dataClassify.context,
 *     getValues: (datasetName, variableName) => {
 *       // return the values of the variable from the dataset
 *       return [];
 *     }
 *   }
 * };
 *
 * <AiAssistant
 *   modelProvider="openai",
 *   modelName="gpt-4o",
 *   apiKey="your-api-key",
 *   tool={classifyTool}
 * />
 * ```
 */
export type DataClassifyTool = typeof dataClassify;

export type ExecuteDataClassifyResult = {
  llmResult: {
    success: boolean;
    result?: {
      datasetName: string;
      variableName: string;
      method: string;
      k: number;
      hinge?: number;
      breaks: number[];
    };
    error?: string;
    instruction?: string;
  };
  additionalData?: {
    datasetName: string;
    variableName: string;
    method: string;
    k: number;
    hinge?: number;
    breaks: number[];
  };
};

type DataClassifyArgs = {
  datasetName: string;
  variableName: string;
  method: string;
  k: number;
  hinge?: number;
};

function isDataClassifyArgs(args: unknown): args is DataClassifyArgs {
  return (
    typeof args === 'object' &&
    args !== null &&
    'datasetName' in args &&
    typeof args.datasetName === 'string' &&
    'variableName' in args &&
    typeof args.variableName === 'string' &&
    'method' in args &&
    typeof args.method === 'string' &&
    'k' in args &&
    typeof args.k === 'number'
  );
}

function isDataClassifyContext(
  context: unknown
): context is DataClassifyFunctionContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getValues' in context &&
    typeof context.getValues === 'function'
  );
}

async function executeDataClassify(
  args,
  options
): Promise<ExecuteDataClassifyResult> {
  try {
    if (!isDataClassifyArgs(args)) {
      throw new Error('Invalid arguments for dataClassify tool');
    }

    if (!options.context || !isDataClassifyContext(options.context)) {
      throw new Error('Invalid context for dataClassify tool');
    }

    const { datasetName, variableName, method, k, hinge } = args;
    const { getValues } = options.context;

    return runDataClassify({
      datasetName,
      variableName,
      method,
      k,
      hinge,
      getValues,
    });
  } catch (error) {
    console.error('Error executing dataClassify tool:', error);
    return {
      llmResult: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        instruction:
          'Please explain the error and give a plan to fix the error. Then try again with a different query.',
      },
    };
  }
}

export async function runDataClassify({
  datasetName,
  variableName,
  method,
  k,
  hinge,
  getValues,
}: {
  datasetName: string;
  variableName: string;
  method: string;
  k: number;
  hinge?: number;
  getValues: GetValues;
}) {
  try {
    const values = await getValues(datasetName, variableName);

    let breaks;

    switch (method) {
      case 'quantile':
        breaks = await quantileBreaks(k, values);
        break;
      case 'natural breaks':
        breaks = await naturalBreaks(k, values);
        break;
      case 'equal interval':
        breaks = await equalIntervalBreaks(k, values);
        break;
      case 'percentile':
        breaks = await percentileBreaks(values);
        break;
      case 'box':
        breaks =
          hinge === 1.5
            ? await hinge15Breaks(values)
            : await hinge30Breaks(values);
        break;
      case 'standard deviation':
        breaks = await standardDeviationBreaks(values);
        break;
      default:
        breaks = await quantileBreaks(k, values);
        break;
    }

    const result = {
      datasetName,
      variableName,
      method,
      k,
      ...(hinge && { hinge }),
      breaks,
    };
    return {
      llmResult: {
        success: true,
        result,
      },
      additionalData: result,
    };
  } catch (error) {
    return {
      llmResult: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
}
