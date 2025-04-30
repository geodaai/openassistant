import { tool } from '@openassistant/core';
import { z } from 'zod';
import zips from 'zip3';

import { cacheData, generateId, getCachedData } from '../utils';

// Add delay function to prevent rate limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getUsZipcodeGeojson = tool<
  z.ZodObject<{
    zipcodes: z.ZodArray<z.ZodString>;
  }>,
  ExecuteGetUsZipcodeGeojsonResult['llmResult'],
  ExecuteGetUsZipcodeGeojsonResult['additionalData']
>({
  description: 'Get the GeoJSON data of one or more United States zipcodes',
  parameters: z.object({
    zipcodes: z.array(
      z.string().describe('The 5-digit zipcode of a United States')
    ),
  }),
  execute: async (args): Promise<ExecuteGetUsZipcodeGeojsonResult> => {
    try {
      const zipcodes = args.zipcodes;
      const features: GeoJSON.Feature[] = [];

      for (const zipcode of zipcodes) {
        let geojson = getCachedData(zipcode);
        if (!geojson) {
          // Add a delay between requests (1000ms) to avoid rate limiting
          await delay(1000);

          // get state code from zipcode
          const prefix = zipcode.slice(0, 3);
          const stateCode = zips[prefix].state;

          const response = await fetch(
            `https://raw.githubusercontent.com/greencoder/us-zipcode-to-geojson/refs/heads/master/data/${stateCode}/${zipcode}.geojson`
          );

          // Check for rate limiting
          if (response.status === 429) {
            // If rate limited, wait longer and retry
            await delay(2000);
            const retryResponse = await fetch(
              `https://raw.githubusercontent.com/greencoder/us-zipcode-to-geojson/refs/heads/master/data/${stateCode}/${zipcode}.geojson`
            );
            if (retryResponse.status === 429) {
              throw new Error('Rate limit exceeded after retry');
            }
            geojson = await retryResponse.json();
          } else {
            geojson = await response.json();
          }

          if (geojson && 'features' in geojson) {
            // remove the first feature (centroid) from the geojson
            geojson.features.shift();
            cacheData(zipcode, geojson);
            features.push(...geojson.features);
          }
        }
      }

      const finalGeojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features,
      };

      const datasetId = generateId();

      cacheData(datasetId, finalGeojson);

      return {
        llmResult: {
          success: true,
          datasetId,
          result: `Successfully fetched the GeoJSON data of the zipcodes. The GeoJSON data has been cached with the id ${datasetId}.`,
        },
        additionalData: {
          zipcodes,
          geojson: finalGeojson,
          datasetId,
        },
      };
    } catch (error) {
      return {
        llmResult: {
          success: false,
          error: `Failed to get the GeoJSON data of the zipcodes ${args}: ${error}`,
        },
      };
    }
  },
});

export type GetUsZipcodeGeojsonTool = typeof getUsZipcodeGeojson;

export type ExecuteGetUsZipcodeGeojsonResult = {
  llmResult: {
    success: boolean;
    datasetId?: string;
    result?: string;
    error?: string;
  };
  additionalData?: {
    zipcodes: string[];
    datasetId: string;
    geojson: GeoJSON.FeatureCollection;
  };
};
