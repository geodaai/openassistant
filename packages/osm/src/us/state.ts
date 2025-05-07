import { tool } from '@openassistant/utils';
import { z } from 'zod';
import { cacheData, generateId, getCachedData } from '../utils';

export type GetUsStateGeojsonFunctionArgs = z.ZodObject<{
  stateNames: z.ZodArray<z.ZodString>;
}>;

export type GetUsStateGeojsonLlmResult = {
  success: boolean;
  datasetId?: string;
  result?: string;
  error?: string;
};

export type GetUsStateGeojsonAdditionalData = {
  stateNames: string[];
  datasetId: string;
  geojson: GeoJSON.FeatureCollection;
};

export type ExecuteGetUsStateGeojsonResult = {
  llmResult: GetUsStateGeojsonLlmResult;
  additionalData?: GetUsStateGeojsonAdditionalData;
};

// Add delay function to prevent rate limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get US State GeoJSON Tool from the Github repository: https://github.com/glynnbird/usstatesgeojson
 * Note: to avoid overloading the Github API, we only fetch the GeoJSON data every 1 second.
 *
 * This tool retrieves the GeoJSON data for a US state by its state name.
 * It returns the state's boundary geometry and properties.
 *
 * Example user prompts:
 * - "Get the GeoJSON for California"
 * - "Show me the boundary of New York state"
 * - "What's the geometry of Texas?"
 *
 * Example code:
 * ```typescript
 * import { getUsStateGeojson, GetUsStateGeojsonTool } from "@openassistant/osm";
 *
 * const stateTool: GetUsStateGeojsonTool = {
 *   ...getUsStateGeojson,
 *   context: {}
 * };
 * ```
 */
export const getUsStateGeojson = tool<
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
          // Add a delay between requests (1000ms) to avoid rate limiting
          await delay(1000);

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

      const datasetId = generateId();

      cacheData(datasetId, finalGeojson);

      return {
        llmResult: {
          success: true,
          datasetId,
          result: `Successfully fetched the GeoJSON data of the states. The GeoJSON data has been cached with the id ${datasetId}.`,
        },
        additionalData: { stateNames, geojson: finalGeojson, datasetId },
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
});

export type GetUsStateGeojsonTool = typeof getUsStateGeojson;
