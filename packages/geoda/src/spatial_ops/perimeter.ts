import { tool } from '@openassistant/utils';
import { z } from 'zod';
import { getPerimeter } from '@geoda/core';
import { SpatialToolContext } from '../types';
import { isSpatialToolContext } from '../utils';

type ExecutePerimeterResult = {
  llmResult: {
    success: boolean;
    result: string;
    perimeters: number[];
    distanceUnit: 'KM' | 'Mile';
  };
  additionalData?: {
    datasetName?: string;
    geojson?: string;
    distanceUnit: 'KM' | 'Mile';
    perimeters: number[];
  };
};

export const perimeter = tool<
  // tool parameters
  z.ZodObject<{
    geojson: z.ZodOptional<z.ZodString>;
    datasetName: z.ZodOptional<z.ZodString>;
    distanceUnit: z.ZodDefault<z.ZodEnum<['KM', 'Mile']>>;
  }>,
  // llm result
  ExecutePerimeterResult['llmResult'],
  // additional data
  ExecutePerimeterResult['additionalData'],
  // context
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
    getGeometries: () => null,
  },
});
