import { getMinimumSpanningTree } from '@geoda/core';
import { extendedTool, generateId } from '@openassistant/utils';
import { z } from 'zod';

import { SpatialToolContext } from '../types';
import { isSpatialToolContext } from '../utils';

/**
 * Minimum Spanning Tree Tool
 *
 * This tool generates the minimum spanning tree from a given dataset or geojson.
 * It supports both direct geojson input and dataset names.
 *
 * :::note
 * For polygons, the centroids are used to generate the minimum spanning tree.
 * :::
 *
 * Example user prompts:
 * - "Generate the minimum spanning tree for this dataset"
 *
 * ## Example Code
 *
 * ```typescript
 * import { mst } from '@openassistant/geoda';
 * import { convertToVercelAiTool } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * const toolContext = {
 *   getGeometries: (datasetName) => {
 *     return getGeometries(datasetName);
 *   },
 * };
 *
 * const mstTool: MstTool = {
 *   ...mst,
 *   context: toolContext,
 * };
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Generate the minimum spanning tree for this dataset',
 *   tools: { mst: convertToVercelAiTool(mstTool) },
 * });
 * ```
 *
 */
export const minimumSpanningTree = extendedTool<
  MinimumSpanningTreeArgs,
  MinimumSpanningTreeLlmResult,
  MinimumSpanningTreeAdditionalData,
  SpatialToolContext
>({
  description: 'Generate the minimum spanning tree',
  parameters: z.object({
    datasetName: z.string().optional(),
    geojson: z
      .string()
      .optional()
      .describe(
        'GeoJSON string of the geometry to calculate area for. Important: it needs to be wrapped in a FeatureCollection object!'
      ),
  }),
  context: {
    getGeometries: async () => null,
  },
  execute: async (args, options) => {
    if (!options?.context || !isSpatialToolContext(options.context)) {
      throw new Error(
        'Context is required and must implement SpatialToolContext'
      );
    }

    const { datasetName, geojson } = args;
    const { getGeometries } = options.context;
    let geometries;

    if (geojson) {
      const geojsonObject = JSON.parse(geojson);
      geometries = geojsonObject.features;
    } else if (datasetName && getGeometries) {
      geometries = await getGeometries(datasetName);
    } else {
      throw new Error('No geometries found');
    }

    if (!geometries) {
      throw new Error('No geometries found');
    }

    const mst = await getMinimumSpanningTree({
      geoms: geometries,
    });

    // create a GeoJSON feature collection from the minimum spanning tree
    const mstGeojson = {
      type: 'FeatureCollection',
      features: mst,
    };

    const outputDatasetName = `mst_${generateId()}`;

    return {
      llmResult: {
        success: true,
        result: `Minimum spanning tree generated successfully, and it has been saved in dataset: ${outputDatasetName}`,
      },
      additionalData: {
        datasetName: outputDatasetName,
        [outputDatasetName]: mstGeojson,
      },
    };
  },
});

export type MinimumSpanningTreeArgs = z.ZodObject<{
  datasetName: z.ZodOptional<z.ZodString>;
  geojson: z.ZodOptional<z.ZodString>;
}>;

export type MinimumSpanningTreeLlmResult = {
  success: boolean;
  result: string;
};

export type MinimumSpanningTreeAdditionalData = {
  datasetName: string;
  [key: string]: unknown;
};

export type MinimumSpanningTreeTool = typeof minimumSpanningTree;
