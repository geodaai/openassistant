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

export type DataClassifyFunctionArgs = z.ZodObject<{
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
}>;

export type DataClassifyLlmResult = {
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

export type DataClassifyAdditionalData = {
  datasetName: string;
  variableName: string;
  method: string;
  k: number;
  hinge?: number;
  breaks: number[];
};

export type DataClassifyFunctionContext = {
  getValues: GetValues;
};

/**
 * The data classify tool is used to classify the data into k bins or classes.
 *
 * The classification method can be one of the following types:
 * - quantile
 * - natural breaks
 * - equal interval
 * - percentile
 * - box
 * - standard deviation
 * - unique values.
 *
 * **Example user prompts:**
 * - "Can you classify the data of population into 5 classes?"
 *
 * @example
 * ```typescript
 * import { getGeoDaTool, GeoDaToolNames } from "@openassistant/geoda";
 *
 * const classifyTool = getGeoDaTool(GeoDaToolNames.dataClassify, {
 *   toolContext: {
 *     getValues: async (datasetName: string, variableName: string) => {
 *       return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *     },
 *   },
 *   onToolCompleted: (toolCallId, additionalData) => {
 *     console.log(toolCallId, additionalData);
 *   },
 *   isExecutable: true,
 * });
 *
 *
 * const result = await generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Can you classify the data of population into 5 classes?',
 *   tools: {dataClassify: classifyTool},
 * });
 *
 * console.log(result);
 * ```
 *
 * For a more complete example, see the [Geoda Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_geoda_example).
 */
export const dataClassify = tool<
  DataClassifyFunctionArgs,
  DataClassifyLlmResult,
  DataClassifyAdditionalData,
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

export type DataClassifyTool = typeof dataClassify;

type DataClassifyToolArgs = {
  datasetName: string;
  variableName: string;
  method: string;
  k: number;
  hinge?: number;
};

function isDataClassifyToolArgs(args: unknown): args is DataClassifyToolArgs {
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

export type ExecuteDataClassifyResult = {
  llmResult: DataClassifyLlmResult;
  additionalData?: DataClassifyAdditionalData;
};

async function executeDataClassify(
  args,
  options
): Promise<ExecuteDataClassifyResult> {
  try {
    if (!isDataClassifyToolArgs(args)) {
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
