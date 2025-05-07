import { tool } from '@openassistant/utils';
import { z } from 'zod';
import zips from 'zip3';

import { cacheData, generateId, getCachedData } from '../utils';

// Add delay function to prevent rate limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type GetUsZipcodeGeojsonFunctionArgs = z.ZodObject<{
  zipcodes: z.ZodArray<z.ZodString>;
}>;

export type GetUsZipcodeGeojsonLlmResult = {
  success: boolean;
  datasetId?: string;
  result?: string;
  error?: string;
};

export type GetUsZipcodeGeojsonAdditionalData = {
  zipcodes: string[];
  datasetId: string;
  geojson: GeoJSON.FeatureCollection;
};

export type ExecuteGetUsZipcodeGeojsonResult = {
  llmResult: GetUsZipcodeGeojsonLlmResult;
  additionalData?: GetUsZipcodeGeojsonAdditionalData;
};

/**
 * Get US Zipcode GeoJSON Tool from the Github repository: https://github.com/greencoder/us-zipcode-to-geojson
 * Note: to avoid overloading the Github API, we only fetch the GeoJSON data every 1 second.
 *  
 * This tool retrieves the GeoJSON data for all zipcodes in a US state by its state code.
 * It returns the zipcodes' boundary geometries and properties.
 *
 * Example user prompts:
 * - "Get all zipcodes in California"
 * - "Show me the zipcode boundaries of New York state"
 * - "What are the zipcodes in Texas?"
 *
 * Example code:
 * ```typescript
 * import { getUsZipcodeGeojson, GetUsZipcodeGeojsonTool } from "@openassistant/osm";
 *
 * const zipcodeTool: GetUsZipcodeGeojsonTool = {
 *   ...getUsZipcodeGeojson,
 *   context: {}
 * };
 * ```
 */
export const getUsZipcodeGeojson = tool<
  GetUsZipcodeGeojsonFunctionArgs,
  GetUsZipcodeGeojsonLlmResult,
  GetUsZipcodeGeojsonAdditionalData,
  object
>({
  description: 'Get the GeoJSON data of one or more United States zipcodes',
  parameters: z.object({
    zipcodes: z.array(
      z.string().describe('The 5-digit zipcode of a United States')
    ),
  }),
  execute: async (args): Promise<ExecuteGetUsZipcodeGeojsonResult> => {
    try {
      const { zipcodes } = args;
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

          // the above url return FeatureCollection
          geojson = await response.json();
          if (geojson && 'features' in geojson) {
            // remove the first feature (which is the centroid) from the geojson
            geojson.features.shift();
          }
        }
        if (geojson && 'features' in geojson) {
          cacheData(zipcode, geojson);
          features.push(...geojson.features);
        }
      }

      const finalGeojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features,
      };

      const datasetId = `zipcode_${generateId()}`;

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
