// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { z } from 'zod';
import {
  cacheData,
  generateId,
  getCachedData,
  extendedTool,
} from '@openassistant/utils';
import { githubRateLimiter } from '../utils/rateLimiter';

export type GetUsCityGeojsonFunctionArgs = z.ZodObject<{
  cityNames: z.ZodArray<z.ZodString>;
}>;

export type GetUsCityGeojsonLlmResult = {
  success: boolean;
  result?: string;
  datasetName?: string;
  error?: string;
};

export type GetUsCityGeojsonAdditionalData = {
  cityNames: string[];
  datasetName: string;
  [datasetName: string]: unknown;
};

export type ExecuteGetUsCityGeojsonResult = {
  llmResult: GetUsCityGeojsonLlmResult;
  additionalData?: GetUsCityGeojsonAdditionalData;
};

/**
 * getUsCityGeojson Tool
 *
 * This tool can be used to get the GeoJSON data of one or more United States cities using the Github repository: https://github.com/generalpiston/geojson-us-city-boundaries
 *
 * :::note
 * to avoid overloading the Github API, we only fetch the GeoJSON data every 1 second.
 * :::
 *
 * **Example user prompts:**
 * - "Get the city boundaries for San Francisco, CA"
 * - "Get city data for Chandler, AZ"
 * - "What are the boundaries of Los Angeles?"
 *
 * :::tip
 * This tool can be mixed with other tools for more complex tasks. For example, if you have a point datasets, you can use this tool
 * to answer questions like "What are the total revenues in the cities of California?"
 * :::
 *
 * @example
 * ```typescript
 * import { getUsCityGeojson, GetUsCityGeojsonTool } from "@openassistant/osm";
 * import { convertToVercelAiTool, ToolCache } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * // you can use ToolCache to save the city geojson dataset for later use
 * const toolResultCache = ToolCache.getInstance();
 *
 * const cityTool: GetUsCityGeojsonTool = {
 *   ...getUsCityGeojson,
 *   onToolCompleted: (toolCallId, additionalData) => {
 *     toolResultCache.addDataset(toolCallId, additionalData);
 *   },
 * };
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'What are the boundaries of San Francisco?',
 *   tools: {
 *     city: convertToVercelAiTool(cityTool),
 *   },
 * });
 * ```
 */
export const getUsCityGeojson = extendedTool<
  GetUsCityGeojsonFunctionArgs,
  GetUsCityGeojsonLlmResult,
  GetUsCityGeojsonAdditionalData,
  object
>({
  description:
    'Get GeoJSON data for US cities by their state code and city name',
  parameters: z.object({
    cityNames: z.array(
      z
        .string()
        .describe(
          'The city name in the format "state-code/city-name.json" (e.g., "ca/san-francisco.json" for San Francisco, CA or "az/chandler.json" for Chandler, AZ)'
        )
    ),
  }),
  execute: async (args): Promise<ExecuteGetUsCityGeojsonResult> => {
    try {
      const { cityNames } = args;
      const features: GeoJSON.Feature[] = [];

      for (const cityName of cityNames) {
        // get cached city geojson if exists in openassistant/utils module
        let geojson = getCachedData(cityName);
        if (!geojson) {
          // Use the global rate limiter before making the API call
          await githubRateLimiter.waitForNextCall();

          const response = await fetch(
            `https://raw.githubusercontent.com/generalpiston/geojson-us-city-boundaries/master/cities/${cityName}`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch city data for ${cityName}: ${response.statusText}`);
          }

          // the above url return Feature directly, not FeatureCollection
          geojson = await response.json();
        }
        if (geojson) {
          // cache the city geojson to avoid overloading the Github API
          cacheData(cityName, geojson);
          features.push(geojson as unknown as GeoJSON.Feature);
        }
      }

      const finalGeojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features,
      };

      const outputDatasetName = `cities_${generateId()}`;

      return {
        llmResult: {
          success: true,
          datasetName: outputDatasetName,
          result: `Successfully fetched the GeoJSON data of the cities. The GeoJSON data has been cached with the dataset name: ${outputDatasetName}.`,
        },
        additionalData: {
          cityNames,
          datasetName: outputDatasetName,
          [outputDatasetName]: {
            type: 'geojson',
            content: finalGeojson,
          },
        },
      };
    } catch (error) {
      return {
        llmResult: {
          success: false,
          error: `Failed to get the GeoJSON data of the cities ${args}: ${error}`,
        },
      };
    }
  },
  context: {},
});

export type GetUsCityGeojsonTool = typeof getUsCityGeojson;
