import { tool } from '@openassistant/utils';
import { z } from 'zod';
import { getCentroids, SpatialGeometry } from '@geoda/core';
import { generateId, isSpatialToolContext } from '../utils';
import { Feature, Geometry } from 'geojson';
import { cacheData } from '../utils';

export const centroid = tool({
  description: 'Calculate centroids of geometries',
  parameters: z.object({
    geojson: z
      .string()
      .optional()
      .describe(
        'GeoJSON string of the geometry to calculate centroids from. Important: it needs to be wrapped in a FeatureCollection object!'
      ),
    datasetName: z
      .string()
      .optional()
      .describe(
        'Name of the dataset with geometries to calculate centroids from'
      ),
  }),
  execute: async (args, options) => {
    const { datasetName, geojson } = args;
    if (!options?.context || !isSpatialToolContext(options.context)) {
      throw new Error('Context is required and must implement SpatialToolContext');
    }
    const { getGeometries } = options.context;

    let geometries: SpatialGeometry | null = null;

    if (geojson) {
      const geojsonObject = JSON.parse(geojson);
      geometries = geojsonObject.features;
    } else if (datasetName && getGeometries) {
      geometries = await getGeometries(datasetName);
    }
    
    if (!geometries) {
      throw new Error('No geometries found');
    }

    const centroids: Array<number[] | null> = await getCentroids(geometries);

    // create a unique id for the centroid result
    const centroidId = generateId();
    cacheData(centroidId, {
      type: 'FeatureCollection',
      features: centroids
        .filter((centroid) => centroid !== null)
        .map(
          (centroid) =>
            ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: centroid,
              },
              properties: {},
            }) as Feature<Geometry, GeoJSON.GeoJsonProperties>
        ),
    });

    return {
      llmResult: {
        success: true,
        datasetName: centroidId,
        result:
          'Centroids calculated successfully, and it can be used as a dataset for mapping. The dataset name is: ' +
          centroidId,
      },
      additionalData: {
        datasetName,
        geojson,
        centroids,
      },
    };
  },
  context: {
    getGeometries: () => {},
  },
});
