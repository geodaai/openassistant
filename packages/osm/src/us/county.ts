import { tool } from '@openassistant/core';
import { z } from 'zod';
import { cacheData, generateId, getCachedData } from '../utils';

export const getUsCountyGeojson = tool({
  description: 'Get the GeoJSON data of a United States county',
  parameters: z.object({
    fips: z.array(
      z
        .string()
        .describe(
          'The 5-digit FIPS code of a United States county (e.g., 01001 for Autauga County, Alabama)'
        )
    ),
  }),
  execute: async (args): Promise<ExecuteGetUsCountyGeojsonResult> => {
    try {
      const { fipsCodes } = args;
      const features: GeoJSON.Feature[] = [];

      for (const fips of fipsCodes) {
        let geojson = getCachedData(fips);
        if (!geojson) {
          const stateCode = fips.substring(0, 2);
          const response = await fetch(
            `https://raw.githubusercontent.com/hyperknot/country-levels-export/master/geojson/medium/fips/${stateCode}/${fips}.geojson`
          );

          // the above url return Feature directly, not FeatureCollection
          geojson = await response.json();
          if (geojson) {
            cacheData(fips, geojson);
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
          result: `Successfully fetched the GeoJSON data of the counties. The GeoJSON data has been cached with the id ${datasetId}.`,
        },
        additionalData: {
          fipsCodes,
          geojson: finalGeojson,
          datasetId,
        },
      };
    } catch (error) {
      return {
        llmResult: {
          success: false,
          error: `Failed to get the GeoJSON data of the county ${args}: ${error}`,
        },
      };
    }
  },
});

export type GetUsCountyGeojsonTool = typeof getUsCountyGeojson;

export type ExecuteGetUsCountyGeojsonResult = {
  llmResult: {
    success: boolean;
    datasetId?: string;
    result?: string;
    error?: string;
  };
  additionalData?: {
    fipsCodes: string[];
    datasetId: string;
    geojson: GeoJSON.FeatureCollection;
  };
};
