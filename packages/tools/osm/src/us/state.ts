import { z } from 'zod';
import {
  cacheData,
  generateId,
  getCachedData,
  extendedTool,
} from '@openassistant/utils';
import { githubRateLimiter } from '../utils/rateLimiter';

export type GetUsStateGeojsonFunctionArgs = z.ZodObject<{
  stateNames: z.ZodArray<z.ZodString>;
}>;

export type GetUsStateGeojsonLlmResult = {
  success: boolean;
  datasetName?: string;
  result?: string;
  error?: string;
};

export type GetUsStateGeojsonAdditionalData = {
  stateNames: string[];
  datasetName: string;
  [datasetName: string]: unknown;
};

export type ExecuteGetUsStateGeojsonResult = {
  llmResult: GetUsStateGeojsonLlmResult;
  additionalData?: GetUsStateGeojsonAdditionalData;
};

/**
 * Get US State GeoJSON Tool
 *
 * This tool can be used to get the GeoJSON data of one or more United States states using the Github repository: https://github.com/glynnbird/usstatesgeojson
 *
 * Example user prompts:
 * - "Get the GeoJSON for California"
 * - "Show me the boundary of New York state"
 * - "What's the geometry of Texas?"
 *
 * :::tip
 * This tool can be mixed with other tools for more complex tasks. For example, if you have a point datasets, you can use this tool
 * to answer questions like "What are the total revenus in the state of California?"
 * :::
 *
 * :::note
 * to avoid overloading the Github API, we only fetch the GeoJSON data every 1 second.
 * :::
 *
 * @example
 * ```typescript
 * import { getOsmTool, OsmToolNames } from "@openassistant/osm";
 *
 * const stateTool = getOsmTool(OsmToolNames.getUsStateGeojson);
 *
 * streamText({
 *   model: openai('gpt-4o'),
 *   prompt: 'Get the GeoJSON for California',
 *   tools: {
 *     state: stateTool,
 *   },
 * });
 * ```
 *
 * For a more complete example, see the [OSM Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_osm_example).
 */
export const getUsStateGeojson = extendedTool<
  GetUsStateGeojsonFunctionArgs,
  GetUsStateGeojsonLlmResult,
  GetUsStateGeojsonAdditionalData,
  object
>({
  description: 'Get the GeoJSON data of one or more United States states',
  parameters: z.object({
    stateNames: z.array(
      z
        .string()
        .describe(
          'The name of a United States state in lowercase (e.g., "north dakota")'
        )
    ),
  }),
  execute: async (args): Promise<ExecuteGetUsStateGeojsonResult> => {
    try {
      const { stateNames } = args;
      const features: GeoJSON.Feature[] = [];

      for (const stateName of stateNames) {
        let geojson = getCachedData(stateName);
        if (!geojson) {
          // Use the global rate limiter before making the API call
          await githubRateLimiter.waitForNextCall();

          // get the Geojson file from the following url:
          // https://raw.githubusercontent.com/glynnbird/usstatesgeojson/master/arizona.geojson
          const response = await fetch(
            `https://raw.githubusercontent.com/glynnbird/usstatesgeojson/master/${stateName}.geojson`
          );

          // the above url return Feature directly, not FeatureCollection
          geojson = await response.json();
        }
        if (geojson) {
          cacheData(stateName, geojson);
          features.push(geojson as unknown as GeoJSON.Feature);
        }
      }

      const finalGeojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features,
      };

      const outputDatasetName = `states_${generateId()}`;

      return {
        llmResult: {
          success: true,
          datasetName: outputDatasetName,
          result: `Successfully fetched the GeoJSON data of the states. The GeoJSON data has been cached with the dataset name: ${outputDatasetName}.`,
        },
        additionalData: {
          stateNames,
          datasetName: outputDatasetName,
          [outputDatasetName]: finalGeojson
        },
      };
    } catch (error) {
      return {
        llmResult: {
          success: false,
          error: `Failed to get the GeoJSON data of the state ${args}: ${error}`,
        },
      };
    }
  },
  context: {},
});

export type GetUsStateGeojsonTool = typeof getUsStateGeojson;
