import { tool } from '@openassistant/core';
import { z } from 'zod';
import { getArea } from '@geoda/core';

export const area = tool({
  description: 'Calculate area of geometries',
  parameters: z.object({
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
  }),
  execute: async (args, options) => {
    const { datasetName, geojson, distanceUnit = 'KM' } = args;
    const { getGeometries } = options.context;

    let geometries;

    if (geojson) {
      const geojsonObject = JSON.parse(geojson);
      geometries = geojsonObject.features;
    } else {
      geometries = await getGeometries({ datasetName });
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
    };
  },
  context: {
    getGeometries: () => {},
  },
});
