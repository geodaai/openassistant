// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistantTool, OpenAssistantToolOptions, z } from '@openassistant/utils';
import { getArea } from '@geoda/core';
import { SpatialToolContext } from '../types';
import { isSpatialToolContext } from '../utils';

export type AreaFunctionArgs = z.ZodObject<{
  geojson: z.ZodOptional<z.ZodString>;
  datasetName: z.ZodOptional<z.ZodString>;
  distanceUnit: z.ZodDefault<z.ZodEnum<['KM', 'Mile']>>;
}>;

export type AreaLlmResult = {
  success: boolean;
  result: string;
  areas: number[];
  distanceUnit: 'KM' | 'Mile';
};

export type AreaAdditionalData = {
  datasetName?: string;
  geojson?: string;
  distanceUnit: 'KM' | 'Mile';
  areas: number[];
};

/**
 * ## AreaTool Class
 *
 * The AreaTool class calculates the area of geometries in a GeoJSON dataset.
 * This tool extends OpenAssistantTool and provides a class-based approach for
 * spatial area calculations.
 *
 * ### Area Calculation
 *
 * It supports both direct GeoJSON input and dataset names, and can calculate
 * areas in either square kilometers or square miles.
 *
 * Example user prompts:
 * - "Calculate the area of these counties in square kilometers"
 * - "What is the total area of these land parcels in square miles?"
 * - "Measure the area of these polygons"
 *
 * Example code:
 * ```typescript
 * import { AreaTool } from '@openassistant/geoda';
 * import { generateText } from 'ai';
 * 
 * // Simple usage with defaults
 * const areaTool = new AreaTool();
 *
 * // Or with custom context
 * const areaTool = new AreaTool(
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
 *   prompt: 'Calculate the area of these counties in square kilometers',
 *   tools: {area: areaTool.toVercelAiTool()},
 * });
 * ```
 *
 * You can also use this tool with other tools, e.g. geocoding, so you don't need to provide the `getGeometries` function.
 * The geometries from geocoding tool will be used as the input for this tool.
 */
export const AreaArgs = z.object({
  geojson: z
    .string()
    .optional()
    .describe(
      'GeoJSON string of the geometry to calculate area for. Important: it needs to be wrapped in a FeatureCollection object!'
    ),
  datasetName: z
    .string()
    .optional()
    .describe('Name of the dataset with geometries to calculate area for'),
  distanceUnit: z.enum(['KM', 'Mile']).default('KM'),
});

export class AreaTool extends OpenAssistantTool<typeof AreaArgs> {
  protected readonly defaultDescription = 'Calculate area of geometries in a GeoJSON dataset';
  protected readonly defaultParameters = AreaArgs;

  constructor(options: OpenAssistantToolOptions<typeof AreaArgs> = {}) {
    super({
      ...options,
      context: options.context || {
        getGeometries: async () => null,
      },
    });
  }

  async execute(
    args: z.infer<typeof AreaArgs>,
    options?: { context?: Record<string, unknown> }
  ): Promise<{
    llmResult: AreaLlmResult;
    additionalData?: AreaAdditionalData;
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
    } else {
      throw new Error('No geometries found');
    }

    if (!geometries) {
      throw new Error('No geometries found');
    }

    const areas = await getArea(geometries, distanceUnit);

    return {
      llmResult: {
        success: true,
        result: 'Areas calculated successfully',
        areas,
        distanceUnit,
      },
      additionalData: {
        datasetName,
        geojson,
        distanceUnit,
        areas,
      },
    };
  }
}
