// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistantTool, OpenAssistantToolOptions } from '@openassistant/utils';
import { z } from 'zod';
import { getLength } from '@geoda/core';
import { isSpatialToolContext } from '../utils';
import { SpatialToolContext } from '../types';

export const LengthArgs = z.object({
  geojson: z
    .string()
    .optional()
    .describe(
      'GeoJSON string of the geometry to calculate length for. Important: it needs to be wrapped in a FeatureCollection object!'
    ),
  datasetName: z
    .string()
    .optional()
    .describe('Name of the dataset with geometries to calculate length for'),
  distanceUnit: z.enum(['KM', 'Mile']).default('KM'),
});

export type LengthLlmResult = {
  success: boolean;
  result: string;
  lengths: number[];
  distanceUnit: 'KM' | 'Mile';
};

export type LengthAdditionalData = {
  datasetName?: string;
  geojson?: string;
  lengths: number[];
  distanceUnit: 'KM' | 'Mile';
};

/**
 * ## LengthTool
 *
 * This tool calculates the length of geometries in a GeoJSON dataset.
 *
 * ### Length Calculation
 *
 * It supports both direct GeoJSON input and dataset names, and can calculate
 * lengths in either kilometers or miles.
 *
 * Example user prompts:
 * - "Calculate the length of these roads in kilometers"
 * - "What is the total length of the river network in miles?"
 * - "Measure the length of these boundaries"
 *
 * Example code:
 * ```typescript
 * import { LengthTool } from '@openassistant/geoda';
 * import { generateText } from 'ai';
 *
 * // Simple usage with defaults
 * const lengthTool = new LengthTool();
 *
 * // Or with custom context
 * const lengthTool = new LengthTool(
 *   undefined, // use default description
 *   undefined, // use default parameters
 *   {
 *     getGeometries: (datasetName) => {
 *       return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
 *     },
 *   }
 * );
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Calculate the length of these roads in kilometers',
 *   tools: {length: lengthTool.toVercelAiTool()},
 * });
 * ```
 */
export class LengthTool extends OpenAssistantTool<typeof LengthArgs> {
  protected readonly defaultDescription = 'Calculate length of geometries';
  protected readonly defaultParameters = LengthArgs;

  constructor(options: OpenAssistantToolOptions<typeof LengthArgs> = {}) {
    super({
      ...options,
      context: options.context || {
        getGeometries: async () => null,
      },
    });
  }

  async execute(
    args: z.infer<typeof LengthArgs>,
    options?: { context?: Record<string, unknown> }
  ): Promise<{
    llmResult: LengthLlmResult;
    additionalData?: LengthAdditionalData;
  }> {
    const { datasetName, geojson, distanceUnit = 'KM' } = args;
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

    const lengths = await getLength(geometries, distanceUnit);

    return {
      llmResult: {
        success: true,
        result: 'Lengths calculated successfully',
        lengths,
        distanceUnit,
      },
    };
  }
}
