import { tool } from '@openassistant/core';
import { z } from 'zod';
import { spatialDissolve } from '@geoda/core';
import { generateId } from '../utils';
import { cacheData } from '../utils';

export const dissolve = tool({
  description: 'Dissolve geometries by merging them into a single geometry',
  parameters: z.object({
    geojson: z
      .string()
      .optional()
      .describe(
        'GeoJSON string of the geometry to be dissolved. Important: it needs to be wrapped in a FeatureCollection object!'
      ),
    datasetName: z
      .string()
      .optional()
      .describe('Name of the dataset with geometries to be dissolved'),
  }),
  execute: async (args, options) => {
    const { datasetName, geojson } = args;
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

    const dissolved = await spatialDissolve(geometries);

    // create a unique id for the dissolve result
    const dissolveId = generateId();
    cacheData(dissolveId, {
      type: 'FeatureCollection',
      features: [dissolved],
    });

    return {
      llmResult: {
        success: true,
        datasetName: dissolveId,
        result:
          'Geometries dissolved successfully, and it can be used as a dataset for mapping. The dataset name is: ' +
          dissolveId,
      },
      additionalData: {
        datasetName,
        geojson,
        dissolved,
      },
    };
  },
  context: {
    getGeometries: () => {},
  },
});
