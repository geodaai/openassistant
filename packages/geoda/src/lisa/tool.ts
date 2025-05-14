import { tool } from '@openassistant/utils';
import { z } from 'zod';
import {
  localMoran,
  localGeary,
  localG,
  localGStar,
  quantileLisa,
  LocalMoranResult,
} from '@geoda/lisa';
import { GetValues } from '../types';
import { getWeights } from '../utils';
import { generateId } from '@openassistant/utils';

export type LisaFunctionArgs = z.ZodObject<{
  method: z.ZodEnum<
    ['localMoran', 'localGeary', 'localG', 'localGStar', 'quantileLisa']
  >;
  weightsID: z.ZodOptional<z.ZodString>;
  variableName: z.ZodString;
  multiVariableNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
  biVariableNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
  permutation: z.ZodOptional<z.ZodNumber>;
  significanceThreshold: z.ZodOptional<z.ZodNumber>;
  datasetName: z.ZodString;
  k?: z.ZodOptional<z.ZodNumber>;
  quantile?: z.ZodOptional<z.ZodNumber>;
  mapBounds?: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
}>;

export type LisaLlmResult = {
  success: boolean;
  result?: {
    mapBounds?: number[];
    lisaMethod: string;
    datasetId: string;
    significanceThreshold: number;
    variableName: string;
    permutations: number;
    globalMoranI?: number;
    clusters: Array<{
      label: string;
      color: string;
      numberOfObservations: number;
    }>;
  };
  error?: string;
  instructions?: string;
};

export type LisaAdditionalData = LocalMoranResult & {
  datasetName: string;
  significanceThreshold: number;
  lisaDatasetName: string;
};

export type LisaFunctionContext = {
  getValues: GetValues;
};

/**
 * The LISA tool is used to apply local indicators of spatial association (LISA) statistics
 * to identify local clusters and spatial outliers.
 *
 * The LISA method can be one of the following types: localMoran, localGeary, localG, localGStar, quantileLisa.
 *
 * When user prompts e.g. *can you perform a LISA analysis on the population data?*
 *
 * 1. The LLM will execute the callback function of lisaFunctionDefinition, and apply LISA analysis using the data retrieved from `getValues` function.
 * 2. The result will include clusters, significance values, and other spatial statistics.
 * 3. The LLM will respond with the analysis results to the user.
 *
 * ### For example
 * ```
 * User: can you perform a LISA analysis on the population data?
 * LLM: I've performed a Local Moran's I analysis on the population data. The results show several significant clusters...
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
 * const lisaTool = getVercelAiTool('lisa', toolContext, onToolCompleted);
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Can you perform a LISA analysis on the population data?',
 *   tools: {lisa: lisaTool},
 * });
 * ```
 */
export const lisa = tool<
  LisaFunctionArgs,
  LisaLlmResult,
  LisaAdditionalData,
  LisaFunctionContext
>({
  description:
    'Apply local indicators of spatial association (LISA) statistics to identify local clusters and spatial outliers.',
  parameters: z.object({
    method: z
      .enum([
        'localMoran',
        'localGeary',
        'localG',
        'localGStar',
        'quantileLisa',
      ])
      .describe('The name of the LISA method'),
    weightsID: z
      .string()
      .optional()
      .describe('The weightsID of the spatial weights'),
    variableName: z.string(),
    multiVariableNames: z
      .array(z.string())
      .optional()
      .describe('A list of variable names for localGeary and quantileLisa'),
    biVariableNames: z
      .array(z.string())
      .optional()
      .describe('A list of two variable names for bivariateLocalMoran'),
    permutation: z
      .number()
      .optional()
      .describe('The number of permutations used in LISA computation'),
    significanceThreshold: z
      .number()
      .optional()
      .describe(
        'The significance threshold used to filter out insignificant clusters'
      ),
    datasetName: z.string(),
    k: z
      .number()
      .optional()
      .describe('The number of quantiles for quantile LISA'),
    quantile: z
      .number()
      .optional()
      .describe('The quantile value for quantile LISA'),
    mapBounds: z.array(z.number()).optional(),
  }),
  execute: executeLisa,
  context: {
    getValues: () => {
      throw new Error('getValues() of LisaTool is not implemented');
    },
  },
});

export type LisaTool = typeof lisa;

type LisaArgs = {
  method: string;
  weightsID: string;
  variableName: string;
  multiVariableNames?: string[];
  biVariableNames?: string[];
  permutation?: number;
  significanceThreshold?: number;
  datasetName: string;
  k?: number;
  quantile?: number;
  mapBounds?: number[];
};

function isLisaArgs(args: unknown): args is LisaArgs {
  return (
    typeof args === 'object' &&
    args !== null &&
    'method' in args &&
    typeof args.method === 'string' &&
    'variableName' in args &&
    typeof args.variableName === 'string' &&
    'datasetName' in args &&
    typeof args.datasetName === 'string'
  );
}

function isLisaContext(context: unknown): context is LisaFunctionContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getValues' in context &&
    typeof context.getValues === 'function'
  );
}

async function executeLisa(
  args,
  options
): Promise<{
  llmResult: LisaLlmResult;
  additionalData?: LisaAdditionalData;
}> {
  try {
    if (!isLisaArgs(args)) {
      throw new Error('Invalid arguments for lisa tool');
    }

    if (options.context && !isLisaContext(options.context)) {
      throw new Error('Invalid context for lisa tool');
    }

    const {
      method,
      weightsID,
      variableName,
      permutation = 999,
      significanceThreshold = 0.05,
      datasetName,
      k,
      quantile,
      mapBounds,
    } = args;
    const { getValues } = options.context;

    // Get weights if needed
    const { weights } = getWeights(weightsID, options.previousExecutionOutput);

    if (!weights) {
      throw new Error('Weights are required for LISA analysis');
    }

    const values = await getValues(datasetName, variableName);

    let lisaFunction = localMoran;
    let globalMoranI: number | null = null;

    if (method === 'localMoran') {
      lisaFunction = localMoran;
    } else if (method === 'localGeary') {
      lisaFunction = localGeary;
    } else if (method === 'localG') {
      lisaFunction = localG;
    } else if (method === 'localGStar') {
      lisaFunction = localGStar;
    } else if (method === 'quantileLisa') {
      if (!k || !quantile) {
        throw new Error('k and quantile are required for quantile LISA');
      }
      lisaFunction = (params) => quantileLisa({ ...params, k, quantile });
    } else {
      throw new Error('Invalid method for lisa tool');
    }

    // run LISA analysis
    const lm = await lisaFunction({
      data: values,
      neighbors: weights,
      permutation,
      significanceCutoff: significanceThreshold,
    });

    // calculate global Moran's I
    if (method === 'localMoran') {
      globalMoranI =
        lm.lisaValues.reduce((a, b) => a + b, 0) / lm.lisaValues.length;
    }

    // get meta data for each cluster
    const metaDataOfClusters = lm.labels.map((label, i) => {
      return {
        label,
        color: lm.colors[i],
        numberOfObservations: lm.clusters.filter((c) => c === i).length,
      };
    });

    // create a lisa dataset name
    const lisaDatasetName = `${datasetName}_${method}_${variableName}_${generateId()}`;

    const result = {
      lisaMethod: method,
      datasetId: datasetName,
      significanceThreshold,
      variableName,
      permutations: permutation,
      clusters: metaDataOfClusters,
      ...(globalMoranI ? { globalMoranI } : {}),
    };

    return {
      llmResult: {
        success: true,
        ...(mapBounds ? { mapBounds } : {}),
        result,
        instructions: `Important: When performing LISA analysis, visualization is handled manually. Do not ask about visualization - the map should be created manually after the analysis.`,
      },
      additionalData: {
        ...lm,
        datasetName,
        significanceThreshold,
        lisaDatasetName,
      },
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
