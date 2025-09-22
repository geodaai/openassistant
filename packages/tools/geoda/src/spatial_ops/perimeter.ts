// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistantTool, OpenAssistantToolOptions } from '@openassistant/utils';
import { z } from 'zod';
import { getPerimeter } from '@geoda/core';
import { isSpatialToolContext } from '../utils';

export const PerimeterArgs = z.object({
  geojson: z
    .string()
    .optional()
    .describe(
      'GeoJSON string of the geometry to calculate perimeter for. Important: it needs to be wrapped in a FeatureCollection object!'
    ),
  datasetName: z
    .string()
    .optional()
    .describe(
      'Name of the dataset with geometries to calculate perimeter for'
    ),
  distanceUnit: z.enum(['KM', 'Mile']).default('KM'),
});

export type PerimeterLlmResult = {
  success: boolean;
  result: string;
  perimeters: number[];
  distanceUnit: 'KM' | 'Mile';
};

export type PerimeterAdditionalData = {
  datasetName?: string;
  geojson?: string;
  distanceUnit: 'KM' | 'Mile';
  perimeters: number[];
};

/**
 * ## PerimeterTool
 *
 * This tool calculates the perimeter of geometries in a GeoJSON dataset.
 *
 * ### Perimeter Calculation
 *
 * It supports both direct GeoJSON input and dataset names, and can calculate
 * perimeters in either kilometers or miles.
 *
 * Example user prompts:
 * - "Calculate the perimeter of these polygons in kilometers"
 * - "What is the total perimeter of these boundaries in miles?"
 * - "Measure the perimeter of these land parcels"
 *
 * ### Example
 * 
 * ```typescript
 * import { PerimeterTool } from '@openassistant/geoda';
 * import { generateText } from 'ai';
 *
 * // Simple usage with defaults
 * const perimeterTool = new PerimeterTool();
 *
 * // Or with custom context
 * const perimeterTool = new PerimeterTool(
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
 *   prompt: 'Calculate the perimeter of these polygons in kilometers',
 *   tools: { perimeter: perimeterTool.toVercelAiTool() },
 * });
 * ```
 */
export class PerimeterTool extends OpenAssistantTool<typeof PerimeterArgs> {
  protected getDefaultDescription(): string {
    return 'Calculate perimeter of geometries';
  }
  
  protected getDefaultParameters() {
    return PerimeterArgs;
  }

  constructor(options: OpenAssistantToolOptions<typeof PerimeterArgs> = {}) {
    super({
      ...options,
      context: options.context || {
        getGeometries: async () => null,
      },
    });
  }

  async execute(
    args: z.infer<typeof PerimeterArgs>,
    options?: { context?: Record<string, unknown> }
  ): Promise<{
    llmResult: PerimeterLlmResult;
    additionalData?: PerimeterAdditionalData;
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

    const perimeters = await getPerimeter(geometries, distanceUnit);

    return {
      llmResult: {
        success: true,
        result: 'Perimeters calculated successfully',
        perimeters,
        distanceUnit,
      },
    };
  }
}
