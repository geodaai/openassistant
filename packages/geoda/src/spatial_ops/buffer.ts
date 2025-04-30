import { tool } from '@openassistant/core';
import { z } from 'zod';
import { getBuffers } from '@geoda/core';
import { generateId } from '../utils';
import { Feature } from 'geojson';
import { cacheData } from '../utils';

export const buffer = tool({
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
        datasetName,
        geojson,
        distance,
        distanceUnit,
        pointsPerCircle,
        buffers,
      },
    };
  },
  context: {
    getGeometries: () => {},
  },
});
