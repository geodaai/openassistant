import {
  cacheData,
  generateId,
  getCachedData,
  extendedTool,
} from '@openassistant/utils';
import { z } from 'zod';
import zips from 'zip3';
import { githubRateLimiter } from '../utils/rateLimiter';

export type GetUsZipcodeGeojsonFunctionArgs = z.ZodObject<{
  zipcodes: z.ZodArray<z.ZodString>;
}>;

export type GetUsZipcodeGeojsonLlmResult = {
  success: boolean;
  datasetName?: string;
  result?: string;
  error?: string;
};

export type GetUsZipcodeGeojsonAdditionalData = {
  zipcodes: string[];
  datasetName: string;
  [datasetName: string]: unknown;
};

export type ExecuteGetUsZipcodeGeojsonResult = {
  llmResult: GetUsZipcodeGeojsonLlmResult;
  additionalData?: GetUsZipcodeGeojsonAdditionalData;
};

/**
 * Get US Zipcode GeoJSON Tool
 *
 * This tool can be used to get the GeoJSON data of one or more United States zipcodes from the Github repository: https://github.com/greencoder/us-zipcode-to-geojson*
 *
 * :::tip
 * This tool can be mixed with other tools for more complex tasks. For example, if you have a point datasets, you can use this tool
 * to answer questions like "What are the total revenus in the zipcode of 10001, 10002, 10003?"
 * :::
 *
 * Example user prompts:
 * - "Get all zipcodes in California"
 * - "Show me the zipcode boundaries of New York state"
 * - "What are the zipcodes in Texas?"
 *
 * :::note
 * Note: to avoid overloading the Github API, we only fetch the GeoJSON data every 1 second.
 * :::
 *
 * @example
 * ```typescript
 * import { getOsmTool, OsmToolNames } from "@openassistant/osm";
 *
 * const zipcodeTool = getOsmTool(OsmToolNames.getUsZipcodeGeojson);
 *
 * streamText({
 *   model: openai('gpt-4o'),
 *   prompt: 'Get all zipcodes in California',
 *   tools: {
 *     zipcode: zipcodeTool,
 *   },
 * });
 * ```
 *
 * For a more complete example, see the [OSM Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_osm_example).
 */
export const getUsZipcodeGeojson = extendedTool<
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
          // Use the global rate limiter before making the API call
          await githubRateLimiter.waitForNextCall();

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

      const outputDatasetName = `zipcodes_${generateId()}`;

      return {
        llmResult: {
          success: true,
          datasetName: outputDatasetName,
          result: `Successfully fetched the GeoJSON data of the zipcodes. The GeoJSON data has been cached with the dataset name: ${outputDatasetName}.`,
        },
        additionalData: {
          zipcodes,
          datasetName: outputDatasetName,
          [outputDatasetName]: finalGeojson,
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
