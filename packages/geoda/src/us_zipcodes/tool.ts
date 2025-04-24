import { tool } from '@openassistant/core';
import { z } from 'zod';

// global variable to cache the GeoJSON data of a United States zipcode
const zipcodeGeojsonCache = new Map<string, GeoJSON.FeatureCollection>();

export const getUsZipcodeGeojson = tool<
  z.ZodObject<{
    zipcode: z.ZodString;
    stateCode: z.ZodString;
  }>,
  ExecuteGetUsZipcodeGeojsonResult['llmResult'],
  ExecuteGetUsZipcodeGeojsonResult['additionalData']
>({
  description: 'Get the GeoJSON data of a United States zipcode',
  parameters: z.object({
    zipcode: z.string().describe('The 5-digit zipcode of a United States'),
    stateCode: z
      .string()
      .describe(
        'The 2-letter state code of a United States state that the zipcode belongs to'
      ),
  }),
  execute: async (args) => {
    const zipcode = args.zipcode;
    const stateCode = args.stateCode;
    if (zipcodeGeojsonCache.has(zipcode)) {
      const geojson = zipcodeGeojsonCache.get(zipcode);
      return {
        llmResult: {
          success: true,
          result: `Successfully fetched the GeoJSON data of the zipcode ${zipcode}`,
        },
        additionalData: { zipcode, geojson },
      };
    }

    const response = await fetch(
      `https://raw.githubusercontent.com/greencoder/us-zipcode-to-geojson/refs/heads/master/data/${stateCode}/${zipcode}.geojson`
    );
    const geojson = await response.json();

    // remove the first feature from the geojson
    geojson.features.shift();
    
    zipcodeGeojsonCache.set(zipcode, geojson);

    return {
      llmResult: {
        success: true,
        result: `Successfully fetched the GeoJSON data of the zipcode ${zipcode}`,
      },
      additionalData: {
        zipcode,
        geojson,
      },
    };
  },
});

export type GetUsZipcodeGeojsonTool = typeof getUsZipcodeGeojson;

export type ExecuteGetUsZipcodeGeojsonResult = {
  llmResult: {
    success: boolean;
    result?: {
      zipcode: string;
    };
    error?: string;
  };
  additionalData?: {
    zipcode: string;
    geojson: GeoJSON.FeatureCollection;
  };
};

export function getCachedUsZipcodes(zipcode: string) {
  return zipcodeGeojsonCache.get(zipcode);
}
