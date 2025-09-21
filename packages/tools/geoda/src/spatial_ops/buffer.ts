// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistantTool, OpenAssistantToolOptions, generateId } from '@openassistant/utils';
import { z } from 'zod';
import { getBuffers } from '@geoda/core';
import { Feature } from 'geojson';

import { isSpatialToolContext } from '../utils';

export const BufferArgs = z.object({
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
});

export type BufferLlmResult = {
  success: boolean;
  datasetName: string;
  result: string;
};

export type BufferAdditionalData = {
  datasetName?: string;
  [outputDatasetName: string]: unknown;
  distance: number;
  distanceUnit: 'KM' | 'Mile';
  pointsPerCircle: number;
};

/**
 * ## BufferTool
 *
 * This tool is used to create buffer zones around geometries.
 *
 * ### Buffer Creation
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
 * import { BufferTool } from '@openassistant/geoda';
 * import { generateText } from 'ai';
 *
 * // Simple usage with defaults
 * const bufferTool = new BufferTool();
 *
 * // Or with custom context and callbacks
 * const bufferTool = new BufferTool(
 *   undefined, // use default description
 *   undefined, // use default parameters
 *   {
 *     getGeometries: (datasetName) => {
 *       return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
 *     },
 *   },
 *   undefined, // component
 *   (toolCallId, additionalData) => {
 *     console.log(toolCallId, additionalData);
 *     // do something like save the buffer result in additionalData
 *   }
 * );
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Can you create a 5km buffer around these roads?',
 *   tools: {buffer: bufferTool.toVercelAiTool()},
 * });
 * ```
 *
 * You can also use this tool with other tools, e.g. geocoding, so you don't need to provide the `getGeometries` function.
 * The geometries from geocoding tool will be used as the input for this tool.
 */
export class BufferTool extends OpenAssistantTool<typeof BufferArgs> {
  protected readonly defaultDescription = 'Buffer geometries. Please convert the distance to the unit of the distanceUnit. For example, if user provides distance is 1 meter and the distanceUnit is KM, the distance should be converted to 0.001.';
  protected readonly defaultParameters = BufferArgs;

  constructor(options: OpenAssistantToolOptions<typeof BufferArgs> = {}) {
    super({
      ...options,
      context: options.context || {
        getGeometries: async () => null,
      },
    });
  }

  async execute(
    args: z.infer<typeof BufferArgs>,
    options?: { context?: Record<string, unknown> }
  ): Promise<{
    llmResult: BufferLlmResult;
    additionalData?: BufferAdditionalData;
  }> {
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
      // in case that LLM can use a simple geojson object like the geocoding result
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
    const outputDatasetName = `buffer_${generateId()}`;

    const outputGeojson = {
      type: 'FeatureCollection',
      // append original properties to the buffer features
      features: buffers.map((feature, index) => ({
        ...feature,
        properties: {
          ...feature.properties,
          ...(geometries[index]?.properties || {}),
        },
      })),
    };

    return {
      llmResult: {
        success: true,
        result: `Buffers created successfully, and it has been saved in dataset: ${outputDatasetName}`,
      },
      additionalData: {
        datasetName: outputDatasetName,
        [outputDatasetName]: {
          type: 'geojson',
          content: outputGeojson,
        },
        distance,
        distanceUnit,
        pointsPerCircle,
      },
    };
  }
}
