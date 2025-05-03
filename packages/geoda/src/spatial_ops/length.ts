import { tool } from '@openassistant/utils';
import { z } from 'zod';
import { getLength } from '@geoda/core';
import { isSpatialToolContext } from '../utils';

export const length = tool({
  description: 'Calculate length of geometries',
  parameters: z.object({
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
    } else if (datasetName) {
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
  },
  context: {
    getGeometries: () => {},
  },
});
