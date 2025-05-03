import { tool } from '@openassistant/utils';
import { z } from 'zod';
import { getBuffers } from '@geoda/core';
import { generateId, isSpatialToolContext } from '../utils';
import { Feature } from 'geojson';
import { cacheData } from '../utils';
import { SpatialToolContext } from '../types';

export type ExecuteBufferResult = {
  llmResult: {
    success: boolean;
    datasetName: string;
    result: string;
  };
  additionalData?: {
    datasetName?: string;
    geojson?: string;
    distance: number;
    distanceUnit: 'KM' | 'Mile';
    pointsPerCircle: number;
    buffers: Feature[];
  };
};

export const buffer = tool<
  // tool parameters
  z.ZodObject<{
    geojson: z.ZodOptional<z.ZodString>;
    datasetName: z.ZodOptional<z.ZodString>;
    distance: z.ZodNumber;
    distanceUnit: z.ZodEnum<['KM', 'Mile']>;
    pointsPerCircle: z.ZodOptional<z.ZodNumber>;
  }>,
  // llm result
  ExecuteBufferResult['llmResult'],
  // additional data
  ExecuteBufferResult['additionalData'],
  // context
  SpatialToolContext
>({
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
    } else {
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
        datasetName: datasetName || undefined,
        geojson,
        distance,
        distanceUnit,
        pointsPerCircle,
        buffers,
      },
    };
  },
  context: {
    getGeometries: () => null,
  },
});
