import { extendedTool } from '@openassistant/utils';
import { z } from 'zod';
import { getPerimeter } from '@geoda/core';
import { SpatialToolContext } from '../types';
import { isSpatialToolContext } from '../utils';

export type PerimeterFunctionArgs = z.ZodObject<{
  geojson: z.ZodOptional<z.ZodString>;
  datasetName: z.ZodOptional<z.ZodString>;
  distanceUnit: z.ZodDefault<z.ZodEnum<['KM', 'Mile']>>;
}>;

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
 * Perimeter Tool
 *
 * This tool calculates the perimeter of geometries in a GeoJSON dataset.
 * It supports both direct GeoJSON input and dataset names, and can calculate
 * perimeters in either kilometers or miles.
 *
 * Example user prompts:
 * - "Calculate the perimeter of these polygons in kilometers"
 * - "What is the total perimeter of these boundaries in miles?"
 * - "Measure the perimeter of these land parcels"
 *
 * Example code:
 * ```typescript
 * import { getVercelAiTool } from '@openassistant/geoda';
 * import { generateText } from 'ai';
 *
 * const toolContext = {
 *   getGeometries: (datasetName) => {
 *     return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
 *   },
 * };
 * const perimeterTool = getVercelAiTool('perimeter', toolContext, onToolCompleted);
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Calculate the perimeter of these polygons in kilometers',
 *   tools: {perimeter: perimeterTool},
 * });
 * ```
 */
export const perimeter = extendedTool<
  PerimeterFunctionArgs,
  PerimeterLlmResult,
  PerimeterAdditionalData,
  SpatialToolContext
>({
  description: 'Calculate perimeter of geometries',
  parameters: z.object({
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
  }),
  execute: async (args, options) => {
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
  },
  context: {
    getGeometries: async () => null,
  },
});
