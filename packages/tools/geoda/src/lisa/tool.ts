import { tool, generateId } from '@openassistant/utils';
import { z } from 'zod';
import {
  localMoran,
  localGeary,
  localG,
  localGStar,
  quantileLisa,
  LocalMoranResult,
} from '@geoda/lisa';

import { GetGeometries, GetValues } from '../types';
import { getWeights } from '../utils';
import { appendJoinValuesToGeometries } from '../spatial_join/tool';

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
  globalMoranI?: number;
  clusterColorAndLabels?: Array<{
    value: number;
    label: string;
    color: string;
    numberOfObservations: number;
  }>;
  error?: string;
  instructions?: string;
  datasetName?: string;
};

export type LisaAdditionalData = Partial<LocalMoranResult> & {
  datasetName: string;
  originalDatasetName: string;
  significanceThreshold: number;
};

export type LisaFunctionContext = {
  getValues: GetValues;
  getGeometries?: GetGeometries;
};

/**
 * The LISA tool is used to apply local indicators of spatial association (LISA) statistics
 * to identify local clusters and spatial outliers.
 *
 * The LISA method can be one of the following types: localMoran, localGeary, localG, localGStar, quantileLisa.
 *
 * **Example user prompts:**
 * - "Are young population clustering over the zipcode areas?"
 * - "Can you perform a local Moran's I analysis on the population data?"
 * - "What are the local clusters in the population data?"
 * - "How many significant clusters are there in the population data?"
 *
 * :::note
 * The LISA tool should always be used with the spatialWeights tool. The LLM models know how to use the spatialWeights tool for the LISA analysis.
 * :::
 *
 * @example
 * ```typescript
 * import { getGeoDaTool, GeoDaToolNames } from "@openassistant/geoda";
 *
 * const spatialWeightsTool = getGeoDaTool(GeoDaToolNames.spatialWeights, {
 *   toolContext: {
 *     getGeometries: (datasetName) => {
 *       return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
 *     },
 *   },
 *   onToolCompleted: (toolCallId, additionalData) => {
 *     console.log(toolCallId, additionalData);
 *   },
 *   isExecutable: true,
 * });
 *
 * const lisaTool = getGeoDaTool(GeoDaToolNames.lisa, {
 *   toolContext: {
 *     getValues: (datasetName, variableName) => {
 *       return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *     },
 *   },
 *   onToolCompleted: (toolCallId, additionalData) => {
 *     console.log(toolCallId, additionalData);
 *   },
 *   isExecutable: true,
 * });
 *
 * const result = await generateText({
 *   model: openai('gpt-4o'),
 *   prompt: 'Can you perform a local Moran analysis on the population data?',
 *   tools: {lisa: lisaTool, spatialWeights: spatialWeightsTool},
 * });
 *
 * console.log(result);
 * ```
 *
 * For a more complete example, see the [Geoda Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_geoda_example).
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
    const { getValues, getGeometries } = options.context;

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

    // color and label for each cluster
    const clusterColorAndLabels = lm.labels.map((label, i) => {
      return {
        value: i,
        label,
        color: lm.colors[i],
        numberOfObservations: lm.clusters.filter((c) => c === i).length,
      };
    });

    // create a lisa dataset name
    const lisaDatasetName = `${method}_${generateId()}`;
    let lisaGeoJson: GeoJSON.FeatureCollection | null = null;

    const additionalData: LisaAdditionalData = {
      originalDatasetName: datasetName,
      significanceThreshold,
      datasetName: lisaDatasetName,
    };

    // no need to create a new dataset if getGeometries() is not provided
    if (getGeometries) {
      // create lisa result by appending lm to geometries
      const geometries = await getGeometries(datasetName);
      // create Record<string, number[]> from lm
      const featureValues = {
        [variableName]: values,
        lisa: lm.lisaValues,
        sigCategories: lm.sigCategories,
        clusters: lm.clusters,
        pValues: lm.pValues,
        lagValues: lm.lagValues,
        nn: lm.nn,
      };
      lisaGeoJson = appendJoinValuesToGeometries(
        geometries,
        featureValues
      ) as GeoJSON.FeatureCollection;
      // append lisaGeoJson to additionalData
      additionalData[lisaDatasetName] = lisaGeoJson;
    }

    return {
      llmResult: {
        success: true,
        ...(mapBounds ? { mapBounds } : {}),
        ...(globalMoranI ? { globalMoranI } : {}),
        datasetName: lisaDatasetName,
        clusterColorAndLabels,
        instructions: `When creating a unique value map for LISA analysis:
- Please use 'clusters' as the color field
- Please use the colors from result.clusters.colors
IMPORTANT: please use dataClassify tool to get unique values for the color field
`,
      },
      additionalData,
    };
  } catch (error) {
    console.error('Error in lisa tool', error);
    return {
      llmResult: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
}
