import { tool } from '@openassistant/utils';
import { z } from 'zod';
import { getCentroids, SpatialGeometry } from '@geoda/core';
import { isSpatialToolContext } from '../utils';
import { Feature, Geometry } from 'geojson';
import { generateId } from '@openassistant/utils';
import { SpatialToolContext } from '../types';

export type CentroidFunctionArgs = z.ZodObject<{
  geojson: z.ZodOptional<z.ZodString>;
  datasetName: z.ZodOptional<z.ZodString>;
}>;

export type CentroidLlmResult = {
  success: boolean;
  datasetName: string;
  result: string;
};

export type CentroidAdditionalData = {
  datasetName?: string;
  [outputDatasetName: string]: unknown;
};

/**
 * The centroid tool is used to calculate the centroids (geometric centers) of geometries.
 *
 * The tool supports:
 * - Calculating centroids from GeoJSON input
 * - Calculating centroids from geometries in a dataset
 * - Returns centroids as points that can be used for mapping
 *
 * When user prompts e.g. *can you find the center points of these counties?*
 *
 * 1. The LLM will execute the callback function of centroidFunctionDefinition, and calculate the centroids using the geometries retrieved from `getGeometries` function.
 * 2. The result will include the centroid points and a new dataset name for mapping.
 * 3. The LLM will respond with the centroid calculation results and the new dataset name.
 *
 * ### For example
 * ```
 * User: can you find the center points of these counties?
 * LLM: I've calculated the centroids of the counties. The centroid points are saved in dataset "centroid_123"...
 * ```
 *
 * ### Code example
 * ```typescript
 * import { getVercelAiTool } from '@openassistant/geoda';
 * import { generateText } from 'ai';
 *
 * const toolContext = {
 *   getGeometries: (datasetName) => {
 *     return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
 *   },
 * };
 * const centroidTool = getVercelAiTool('centroid', toolContext, onToolCompleted);
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Can you find the center points of these counties?',
 *   tools: {centroid: centroidTool},
 * });
 * ```
 */
export const centroid = tool<
  CentroidFunctionArgs,
  CentroidLlmResult,
  CentroidAdditionalData,
  SpatialToolContext
>({
  description: 'Calculate centroids of geometries',
  parameters: z.object({
    geojson: z
      .string()
      .optional()
      .describe(
        'GeoJSON string of the geometry to calculate centroids from. Important: it needs to be wrapped in a FeatureCollection object!'
      ),
    datasetName: z
      .string()
      .optional()
      .describe(
        'Name of the dataset with geometries to calculate centroids from'
      ),
  }),
  execute: async (args, options) => {
    const { datasetName, geojson } = args;
    if (!options?.context || !isSpatialToolContext(options.context)) {
      throw new Error(
        'Context is required and must implement SpatialToolContext'
      );
    }
    const { getGeometries } = options.context;

    let geometries: SpatialGeometry | null = null;

    if (geojson) {
      const geojsonObject = JSON.parse(geojson);
      geometries = geojsonObject.features;
    } else if (datasetName && getGeometries) {
      geometries = await getGeometries(datasetName);
    }

    if (!geometries) {
      throw new Error('No geometries found');
    }

    const centroids: Array<number[] | null> = await getCentroids(geometries);

    // create a unique id for the centroid result
    const outputDatasetName = `centroid_${generateId()}`;
    const outputGeojson = {
      type: 'FeatureCollection',
      features: centroids
        .filter((centroid) => centroid !== null)
        .map(
          (centroid) =>
            ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: centroid,
              },
              properties: {},
            }) as Feature<Geometry, GeoJSON.GeoJsonProperties>
        ),
    };

    return {
      llmResult: {
        success: true,
        datasetName: outputDatasetName,
        result: `Centroids calculated successfully, and it can be used as a dataset for mapping. The dataset name is: ${outputDatasetName}`,
      },
      additionalData: {
        datasetName,
        [outputDatasetName]: outputGeojson,
      },
    };
  },
  context: {
    getGeometries: async () => null,
  },
});

export type CentroidTool = typeof centroid;
