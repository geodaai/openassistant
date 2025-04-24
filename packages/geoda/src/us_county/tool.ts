import { tool } from '@openassistant/core';
import { z } from 'zod';

// global variable to cache the GeoJSON data of a United States county
const countyGeojsonCache = new Map<string, GeoJSON.Feature>();

export const getUsCountyGeojson = tool<
  z.ZodObject<{
    fips: z.ZodString;
  }>,
  ExecuteGetUsCountyGeojsonResult['llmResult'],
  ExecuteGetUsCountyGeojsonResult['additionalData']
>({
  description: 'Get the GeoJSON data of a United States county',
  parameters: z.object({
    fips: z.string().describe('The 5-digit FIPS code of a United States county (e.g., 01001 for Autauga County, Alabama)'),
  }),
  execute: async (args) => {
    const fips = args.fips;

    if (countyGeojsonCache.has(fips)) {
      const geojson = countyGeojsonCache.get(fips);
      return {
        llmResult: {
          success: true,
          result: `Successfully fetched the GeoJSON data of the county with FIPS code ${fips}`,
        },
        additionalData: { fips, geojson },
      };
    }

    const stateCode = fips.substring(0, 2);
    const response = await fetch(
      `https://raw.githubusercontent.com/hyperknot/country-levels-export/master/geojson/medium/fips/${stateCode}/${fips}.geojson`
    );

    // the above url return Feature directly, not FeatureCollection
    const geojson = await response.json();
    countyGeojsonCache.set(fips, geojson);

    return {
      llmResult: {
        success: true,
        result: `Successfully fetched the GeoJSON data of the county with FIPS code ${fips}`,
      },
      additionalData: {
        fips,
        geojson,
      },
    };
  },
});

export type GetUsCountyGeojsonTool = typeof getUsCountyGeojson;

export type ExecuteGetUsCountyGeojsonResult = {
  llmResult: {
    success: boolean;
    result?: {
      fips: string;
    };
    error?: string;
  };
  additionalData?: {
    fips: string;
    geojson: GeoJSON.FeatureCollection;
  };
};

export function getCachedUsCounties(fips: string) {
  return countyGeojsonCache.get(fips);
} 