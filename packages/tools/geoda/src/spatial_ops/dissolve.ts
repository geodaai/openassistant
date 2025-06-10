import { extendedTool, generateId } from '@openassistant/utils';
import { z } from 'zod';
import { spatialDissolve } from '@geoda/core';
import { Feature, Geometry } from 'geojson';

import { isSpatialToolContext } from '../utils';
import { SpatialToolContext } from '../types';

export type DissolveFunctionArgs = z.ZodObject<{
  geojson: z.ZodOptional<z.ZodString>;
  datasetName: z.ZodOptional<z.ZodString>;
}>;

export type DissolveLlmResult = {
  success: boolean;
  datasetName: string;
  result: string;
};

export type DissolveAdditionalData = {
  datasetName?: string;
  geojson?: string;
  dissolved: Feature<Geometry, GeoJSON.GeoJsonProperties>;
};

/**
 * The dissolve tool is used to merge multiple geometries into a single geometry.
 *
 * The tool supports:
 * - Dissolving geometries from GeoJSON input
 * - Dissolving geometries from a dataset
 * - Returns a single merged geometry that can be used for mapping
 *
 * When user prompts e.g. *can you merge these counties into a single region?*
 *
 * 1. The LLM will execute the callback function of dissolveFunctionDefinition, and merge the geometries using the data retrieved from `getGeometries` function.
 * 2. The result will include the merged geometry and a new dataset name for mapping.
 * 3. The LLM will respond with the dissolve results and the new dataset name.
 *
 * ### For example
 * ```
 * User: can you merge these counties into a single region?
 * ```
 *
 * ### Code example
 * ```typescript
 * import { dissolve, DissolveTool } from '@openassistant/geoda';
 * import { convertToVercelAiTool } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * const dissolveTool: DissolveTool = {
 *   ...dissolve,
 *   context: {
 *     getGeometries: (datasetName) => {
 *       return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
 *     },
 *   },
 *   onToolCompleted: (toolCallId, additionalData) => {
 *     console.log(toolCallId, additionalData);
 *     // do something like save the dissolve result in additionalData
 *   },
 * };
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Can you merge these counties into a single region?',
 *   tools: {dissolve: convertToVercelAiTool(dissolveTool)},
 * });
 * ```
 */
export const dissolve = extendedTool<
  DissolveFunctionArgs,
  DissolveLlmResult,
  DissolveAdditionalData,
  SpatialToolContext
>({
  description: 'Dissolve geometries by merging them into a single geometry',
  parameters: z.object({
    geojson: z
      .string()
      .optional()
      .describe(
        'GeoJSON string of the geometry to be dissolved. Important: it needs to be wrapped in a FeatureCollection object!'
      ),
    datasetName: z
      .string()
      .optional()
      .describe('Name of the dataset with geometries to be dissolved'),
  }),
  execute: async (args, options) => {
    const { datasetName, geojson } = args;
    if (!options?.context || !isSpatialToolContext(options.context)) {
      throw new Error(
        'Context is required and must implement SpatialToolContext'
      );
    }
    const { getGeometries } = options.context;

    let geometries;

    if (geojson) {
      const geojsonObject = JSON.parse(geojson);
      geometries = geojsonObject.features;
    } else if (datasetName && getGeometries) {
      geometries = await getGeometries(datasetName);
    }

    if (!geometries) {
      throw new Error('No geometries found');
    }

    const dissolved = await spatialDissolve(geometries);

    // create a unique id for the dissolve result
    const outputDatasetName = `dissolve_${generateId()}`;
    const outputGeojson = {
      type: 'FeatureCollection',
      features: [dissolved],
    };

    return {
      llmResult: {
        success: true,
        result: `Geometries dissolved successfully, and it has been saved in dataset: ${outputDatasetName}`,
      },
      additionalData: {
        datasetName: outputDatasetName,
        [outputDatasetName]: {
          type: 'geojson',
          content: outputGeojson,
        },
      },
    };
  },
  context: {
    getGeometries: async () => null,
  },
});

export type DissolveTool = typeof dissolve;
