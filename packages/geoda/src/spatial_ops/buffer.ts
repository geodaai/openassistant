import { tool } from '@openassistant/utils';
import { z } from 'zod';
import { getBuffers } from '@geoda/core';
import { generateId, isSpatialToolContext } from '../utils';
import { Feature } from 'geojson';
import { cacheData } from '../utils';
import { SpatialToolContext } from '../types';

export type BufferFunctionArgs = z.ZodObject<{
  geojson: z.ZodOptional<z.ZodString>;
  datasetName: z.ZodOptional<z.ZodString>;
  distance: z.ZodNumber;
  distanceUnit: z.ZodEnum<['KM', 'Mile']>;
  pointsPerCircle: z.ZodOptional<z.ZodNumber>;
}>;

export type BufferLlmResult = {
  success: boolean;
  datasetName: string;
  result: string;
};

export type BufferAdditionalData = {
  datasetName?: string;
  geojson?: string;
  distance: number;
  distanceUnit: 'KM' | 'Mile';
  pointsPerCircle: number;
  buffers: Feature[];
};

/**
 * The buffer tool is used to create buffer zones around geometries.
 *
 * The tool supports:
 * - Creating buffers from GeoJSON input
 * - Creating buffers from geometries in a dataset
 * - Buffer distances in kilometers (KM) or miles (Mile)
 * - Configurable buffer smoothness (points per circle)
 *
 * When user prompts e.g. *can you create a 5km buffer around these roads?*
 *
 * 1. The LLM will execute the callback function of bufferFunctionDefinition, and create buffers using the geometries retrieved from `getGeometries` function.
 * 2. The result will include the buffered geometries and a new dataset name for mapping.
 * 3. The LLM will respond with the buffer creation results and the new dataset name.
 *
 * ### For example
 * ```
 * User: can you create a 5km buffer around these roads?
 * LLM: I've created 5km buffers around the roads. The buffered geometries are saved in dataset "buffer_123"...
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
 * const bufferTool = getVercelAiTool('buffer', toolContext, onToolCompleted);
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Can you create a 5km buffer around these roads?',
 *   tools: {buffer: bufferTool},
 * });
 * ```
 *
 * You can also use this tool with other tools, e.g. geocoding, so you don't need to provide the `getGeometries` function.
 * The geometries from geocoding tool will be used as the input for this tool.
 */
export const buffer = tool<
  BufferFunctionArgs,
  BufferLlmResult,
  BufferAdditionalData,
  SpatialToolContext
>({
  description: 'Buffer geometries',
  parameters: z.object({
    geojson: z
      .string()
      .optional()
      .describe(
        'GeoJSON string of the geometry to be buffered. Important: it needs to be wrapped in a FeatureCollection object!'
      ),
    datasetName: z
      .string()
      .optional()
      .describe('Name of the dataset with geometries to be buffered'),
    distance: z.number(),
    distanceUnit: z.enum(['KM', 'Mile']),
    pointsPerCircle: z
      .number()
      .optional()
      .describe(
        'Smoothness of the buffer: 20 points per circle is smooth, 10 points per circle is rough'
      ),
  }),
  execute: async (args, options) => {
    const {
      datasetName,
      geojson,
      distance,
      distanceUnit = 'KM',
      pointsPerCircle = 10,
    } = args;
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
    } else {
      throw new Error('No geometries found');
    }

    const buffers: Feature[] = await getBuffers({
      geoms: geometries,
      bufferDistance: distance,
      distanceUnit,
      pointsPerCircle,
    });

    // create a unique id for the buffer result
    const bufferId = generateId();
    cacheData(bufferId, {
      type: 'FeatureCollection',
      features: buffers,
    });

    return {
      llmResult: {
        success: true,
        datasetName: bufferId,
        result:
          'Buffers created successfully, and it can be used as a dataset for mapping. The dataset name is: ' +
          bufferId,
      },
      additionalData: {
        datasetName: datasetName || undefined,
        geojson,
        distance,
        distanceUnit,
        pointsPerCircle,
        buffers,
      },
    };
  },
  context: {
    getGeometries: () => null,
  },
});

export type BufferTool = typeof buffer;
