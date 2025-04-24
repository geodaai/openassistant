import { tool } from '@openassistant/core';
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

export const lisa = tool<
  // parameters of the tool
  z.ZodObject<{
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
  }>,
  // return type of the tool
  ExecuteLisaResult['llmResult'],
  // additional data of the tool
  ExecuteLisaResult['additionalData'],
  // type of the context
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
  }),
  execute: executeLisa,
  context: {
    getValues: () => {
      throw new Error('getValues() of LisaTool is not implemented');
    },
  },
});

/**
 * The context of the LISA function.
 */
export type LisaFunctionContext = {
  getValues: GetValues;
};

/**
 * The type of the LISA tool.
 */
export type LisaTool = typeof lisa;

export type ExecuteLisaResult = {
  llmResult: {
    success: boolean;
    result?: {
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
  };
  additionalData?: LocalMoranResult & {
    datasetName: string;
    significanceThreshold: number;
  };
};

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

async function executeLisa(args, options): Promise<ExecuteLisaResult> {
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
        result,
      },
      additionalData: { ...lm, datasetName, significanceThreshold },
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
