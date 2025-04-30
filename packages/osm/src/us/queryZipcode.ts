import { tool } from '@openassistant/core';
import { z } from 'zod';
import { cacheData, getCachedData } from '../utils';

export const queryUSZipcodes = tool<
  z.ZodObject<{
    mapBounds: z.ZodObject<{
      northwest: z.ZodObject<{
        longitude: z.ZodNumber;
        latitude: z.ZodNumber;
      }>;
      southeast: z.ZodObject<{
        longitude: z.ZodNumber;
        latitude: z.ZodNumber;
      }>;
    }>;
  }>,
  ExecuteQueryUSZipcodesResult['llmResult'],
  ExecuteQueryUSZipcodesResult['additionalData']
>({
  description: 'Query US zipcodes within a given map bounds',
  parameters: z.object({
    mapBounds: z.object({
      northwest: z
        .object({
          longitude: z.number(),
          latitude: z.number(),
        })
        .describe('Northwest coordinates [longitude, latitude]'),
      southeast: z
        .object({
          longitude: z.number(),
          latitude: z.number(),
        })
        .describe('Southeast coordinates [longitude, latitude]'),
    }),
  }),
  execute: async (args) => {
    try {
      const { northwest, southeast } = args.mapBounds;
      const cacheKey = 'us_zipcodes_centroids';

      let geojson = getCachedData(cacheKey);
      if (!geojson) {
        const response = await fetch(
          'https://raw.githubusercontent.com/GeoDaCenter/data-and-lab/refs/heads/gh-pages/data/us_zipcodes_centroids.geojson'
        );
        geojson = await response.json();
        if (geojson) {
          cacheData(cacheKey, geojson);
        }
      }

      if (!geojson || !('features' in geojson)) {
        throw new Error('Failed to fetch zipcode centroids data');
      }

      // Filter zipcodes within bounds
      const zipcodes = geojson.features
        .filter((feature) => {
          const coordinates = (feature.geometry as GeoJSON.Point).coordinates;
          const [longitude, latitude] = coordinates;
          return (
            longitude >= northwest.longitude &&
            longitude <= southeast.longitude &&
            latitude <= northwest.latitude &&
            latitude >= southeast.latitude
          );
        })
        .map((feature) => {
          const properties = feature.properties;
          if (!properties || !properties.ZCTA5CE10) {
            return null;
          }
          return properties.ZCTA5CE10;
        });

      return {
        llmResult: {
          success: true,
          result: `Found ${zipcodes.length} zipcodes within the specified bounds`,
          zipcodes,
        },
        additionalData: {
          zipcodes,
        },
      };
    } catch (error) {
      return {
        llmResult: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  },
});

export type QueryUSZipcodesTool = typeof queryUSZipcodes;

export type ExecuteQueryUSZipcodesResult = {
  llmResult: {
    success: boolean;
    result?: string;
    error?: string;
  };
  additionalData?: {
    zipcodes: string[];
  };
};
