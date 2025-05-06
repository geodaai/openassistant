import { tool } from '@openassistant/utils';
import { z } from 'zod';
import { cacheData, generateId, getCachedData } from '../utils';

export type GetUsStateGeojsonFunctionArgs = z.ZodObject<{
  states: z.ZodArray<z.ZodString>;
}>;

export type GetUsStateGeojsonLlmResult = {
  success: boolean;
  datasetId?: string;
  result?: string;
  error?: string;
};

export type GetUsStateGeojsonAdditionalData = {
  states: string[];
  datasetId: string;
  geojson: GeoJSON.FeatureCollection;
};

export type ExecuteGetUsStateGeojsonResult = {
  llmResult: GetUsStateGeojsonLlmResult;
  additionalData?: GetUsStateGeojsonAdditionalData;
};

/**
 * Get US State GeoJSON Tool
 * 
 * This tool retrieves the GeoJSON data for a US state by its state code.
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
    states: z.array(
      z.string().describe('The two-letter postal abbreviations of a state')
    ),
  }),
  execute: async (args): Promise<ExecuteGetUsStateGeojsonResult> => {
    try {
      const { states } = args;
      const features: GeoJSON.Feature[] = [];

      for (const state of states) {
        let geojson = getCachedData(state);
        if (!geojson) {
          // get the Geojson file from the following url:
          // https://www.ncei.noaa.gov/pub/data/nidis/geojson/state/geostates/AK.geojson
          const response = await fetch(
            `https://www.ncei.noaa.gov/pub/data/nidis/geojson/state/geostates/${state}.geojson`
          );
          geojson = await response.json();
          if (geojson && 'features' in geojson) {
            cacheData(state, geojson);
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
          result: `Successfully fetched the GeoJSON data of the states. The GeoJSON data has been cached with the id ${datasetId}.`,
        },
        additionalData: { states, geojson: finalGeojson, datasetId },
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
