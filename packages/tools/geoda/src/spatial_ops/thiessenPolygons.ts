// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { getThiessenPolygons } from '@geoda/core';
import { OpenAssistantTool, OpenAssistantToolOptions, generateId } from '@openassistant/utils';
import { z } from 'zod';

import { SpatialToolContext } from '../types';
import { isSpatialToolContext } from '../utils';

/**
 * ## ThiessenPolygonsTool
 *
 * This tool generates thiessen polygons or voronoi diagrams from a given dataset or geojson.
 *
 * ### Thiessen Polygons Generation
 *
 * It supports both direct geojson input and dataset names.
 *
 * Example user prompts:
 * - "Generate thiessen polygons for this dataset"
 *
 * ## Example Code
 *
 * ```typescript
 * import { ThiessenPolygonsTool } from '@openassistant/geoda';
 * import { generateText } from 'ai';
 *
 * // Simple usage with defaults
 * const thiessenPolygonsTool = new ThiessenPolygonsTool();
 *
 * // Or with custom context and callbacks
 * const thiessenPolygonsTool = new ThiessenPolygonsTool(
 *   undefined, // use default description
 *   undefined, // use default parameters
 *   {
 *     getGeometries: (datasetName) => {
 *       return getGeometries(datasetName);
 *     },
 *   },
 *   undefined, // component
 *   (toolCallId, additionalData) => {
 *     console.log(toolCallId, additionalData);
 *     // do something like save the thiessen polygons result in additionalData
 *   }
 * );
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Generate thiessen polygons for this dataset',
 *   tools: { thiessenPolygons: thiessenPolygonsTool.toVercelAiTool() },
 * });
 * ```
 *
 */
export const ThiessenPolygonsArgs = z.object({
  datasetName: z.string().optional(),
  geojson: z
    .string()
    .optional()
    .describe(
      'GeoJSON string of the geometry to calculate area for. Important: it needs to be wrapped in a FeatureCollection object!'
    ),
});

export class ThiessenPolygonsTool extends OpenAssistantTool<typeof ThiessenPolygonsArgs> {
  protected readonly defaultDescription = 'Generate thiessen polygons or voronoi diagrams';
  protected readonly defaultParameters = ThiessenPolygonsArgs;

  constructor(options: OpenAssistantToolOptions<typeof ThiessenPolygonsArgs> = {}) {
    super({
      ...options,
      context: options.context || {
        getGeometries: async () => null,
      },
    });
  }

  async execute(
    args: z.infer<typeof ThiessenPolygonsArgs>,
    options?: { context?: Record<string, unknown> }
  ): Promise<{
    llmResult: ThiessenPolygonsLlmResult;
    additionalData?: ThiessenPolygonsAdditionalData;
  }> {
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
        [outputDatasetName]: {
          type: 'geojson',
          content: thiessenPolygonsGeojson,
        },
      },
    };
  }
}

export type ThiessenPolygonsLlmResult = {
  success: boolean;
  result: string;
};

export type ThiessenPolygonsAdditionalData = {
  datasetName: string;
  [key: string]: unknown;
};
