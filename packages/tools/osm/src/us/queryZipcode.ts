import { z } from 'zod';
import { cacheData, getCachedData, extendedTool } from '@openassistant/utils';
import { githubRateLimiter } from '../utils/rateLimiter';

export type QueryZipcodeFunctionArgs = z.ZodObject<{
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
}>;

export type QueryZipcodeLlmResult = {
  success: boolean;
  zipcodes?: string[];
  result?: string;
  error?: string;
};

export type QueryZipcodeAdditionalData = {
  zipcodes: string[];
};

export type ExecuteQueryUSZipcodesResult = {
  llmResult: QueryZipcodeLlmResult;
  additionalData?: QueryZipcodeAdditionalData;
};

/**
 * Query US Zipcodes Tool
 *
 * This tool can be used to query US zipcodes within a given map bounds using the zipcode centroids geojson data from the Github repository: https://github.com/GeoDaCenter/data-and-lab
 *
 * :::tip
 * This tool can be mixed with other tools for more complex tasks. For example, if you have a point datasets, you can use this tool
 * to answer questions like "What are the total revenus in the zipcodes in current map view?"
 * :::
 *
 * Example user prompts:
 * - "Find all zipcodes in current map view"
 * - "What zipcodes are in the Los Angeles county?"
 * - "Get zipcodes within this map view"
 *
 * @example
 * ```typescript
 * import { getOsmTool, OsmToolNames } from "@openassistant/osm";
 *
 * const queryZipcodeTool = getOsmTool(OsmToolNames.queryUSZipcodes);
 *
 * streamText({
 *   model: openai('gpt-4o'),
 *   prompt: 'what are the zipcodes in Los Angeles county?',
 *   tools: {
 *     queryZipcode: queryZipcodeTool,
 *   },
 * });
 * ```
 *
 * For a more complete example, see the [OSM Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_osm_example).
 */
export const queryUSZipcodes = extendedTool<
  QueryZipcodeFunctionArgs,
  QueryZipcodeLlmResult,
  QueryZipcodeAdditionalData
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
  execute: async (args): Promise<ExecuteQueryUSZipcodesResult> => {
    try {
      const { mapBounds } = args;
      const { northwest, southeast } = mapBounds;
      const zipcodeCentroidsDatasetName = 'us_zipcodes_centroids';

      // get cached zipcode centroids geojson if exists
      let geojson = getCachedData(zipcodeCentroidsDatasetName);
      if (!geojson) {
        // Use the global rate limiter before making the API call
        await githubRateLimiter.waitForNextCall();

        const response = await fetch(
          'https://raw.githubusercontent.com/GeoDaCenter/data-and-lab/refs/heads/gh-pages/data/us_zipcodes_centroids.geojson'
        );
        geojson = await response.json();
        if (geojson) {
          cacheData(zipcodeCentroidsDatasetName, geojson);
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
