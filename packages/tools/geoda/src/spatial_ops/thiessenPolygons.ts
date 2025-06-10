import { getThiessenPolygons } from '@geoda/core';
import { extendedTool, generateId } from '@openassistant/utils';
import { z } from 'zod';

import { SpatialToolContext } from '../types';
import { isSpatialToolContext } from '../utils';

/**
 * Thiessen Polygons Tool
 *
 * This tool generates thiessen polygons or voronoi diagrams from a given dataset or geojson.
 * It supports both direct geojson input and dataset names.
 *
 * Example user prompts:
 * - "Generate thiessen polygons for this dataset"
 *
 * ## Example Code
 *
 * ```typescript
 * import { thiessenPolygons } from '@openassistant/geoda';
 * import { convertToVercelAiTool } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * const toolContext = {
 *   getGeometries: (datasetName) => {
 *     return getGeometries(datasetName);
 *   },
 * };
 *
 * const thiessenPolygonsTool: ThiessenPolygonsTool = {
 *   ...thiessenPolygons,
 *   context: toolContext,
 * };
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Generate thiessen polygons for this dataset',
 *   tools: { thiessenPolygons: convertToVercelAiTool(thiessenPolygonsTool) },
 * });
 * ```
 *
 */
export const thiessenPolygons = extendedTool<
  ThiessenPolygonsArgs,
  ThiessenPolygonsLlmResult,
  ThiessenPolygonsAdditionalData,
  SpatialToolContext
>({
  description: 'Generate thiessen polygons or voronoi diagrams',
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

    const thiessenPolygons = await getThiessenPolygons({ geoms: geometries });

    // create a GeoJSON feature collection from the thiessen polygons
    const thiessenPolygonsGeojson = {
      type: 'FeatureCollection',
      features: thiessenPolygons,
    };

    const outputDatasetName = `thiessen_polygons_${generateId()}`;

    return {
      llmResult: {
        success: true,
        result: `Thiessen polygons generated successfully, and it has been saved in dataset: ${outputDatasetName}`,
      },
      additionalData: {
        datasetName: outputDatasetName,
        [outputDatasetName]: thiessenPolygonsGeojson,
      },
    };
  },
});

export type ThiessenPolygonsArgs = z.ZodObject<{
  datasetName: z.ZodOptional<z.ZodString>;
  geojson: z.ZodOptional<z.ZodString>;
}>;

export type ThiessenPolygonsLlmResult = {
  success: boolean;
  result: string;
};

export type ThiessenPolygonsAdditionalData = {
  datasetName: string;
  [key: string]: unknown;
};

export type ThiessenPolygonsTool = typeof thiessenPolygons;
