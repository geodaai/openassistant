// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { z } from 'zod';
import {
  OpenAssistantTool,
  OpenAssistantToolOptions,
  cacheData,
  generateId,
  getCachedData,
} from '@openassistant/utils';
import { githubRateLimiter } from '../utils/rateLimiter';

export const GetUsCountyGeojsonArgs = z.object({
  fipsCodes: z.array(
    z
      .string()
      .describe(
        'The 5-digit FIPS code of a United States county (e.g., 01001 for Autauga County, Alabama)'
      )
  ),
});

export type GetUsCountyGeojsonLlmResult = {
  success: boolean;
  result?: string;
  datasetName?: string;
  error?: string;
};

export type GetUsCountyGeojsonAdditionalData = {
  fipsCodes: string[];
  datasetName: string;
  [datasetName: string]: unknown;
};

export type ExecuteGetUsCountyGeojsonResult = {
  llmResult: GetUsCountyGeojsonLlmResult;
  additionalData?: GetUsCountyGeojsonAdditionalData;
};

/**
 * GetUsCountyGeojsonTool
 *
 * This tool can be used to get the GeoJSON data of one or more United States counties using the Github repository: https://github.com/hyperknot/country-levels-export
 *
 * :::note
 * to avoid overloading the Github API, we only fetch the GeoJSON data every 1 second.
 * :::
 *
 * **Example user prompts:**
 * - "Get all counties in California"
 * - "Get all counties in current map view"
 * - "What are the counties in Texas?"
 *
 * :::tip
 * This tool can be mixed with other tools for more complex tasks. For example, if you have a point datasets, you can use this tool
 * to answer questions like "What are the total revenus in the counties of California?"
 * :::
 *
 * @example
 * ```typescript
 * import { GetUsCountyGeojsonTool } from "@openassistant/osm";
 * import { ToolCache } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * // Simple usage with defaults
 * const countyTool = new GetUsCountyGeojsonTool();
 *
 * // Or with custom callbacks
 * const toolResultCache = ToolCache.getInstance();
 * const countyTool = new GetUsCountyGeojsonTool(
 *   undefined, // use default description
 *   undefined, // use default parameters
 *   {}, // context
 *   undefined, // component
 *   (toolCallId, additionalData) => {
 *     toolResultCache.addDataset(toolCallId, additionalData);
 *   }
 * );
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'What are the counties in Texas?',
 *   tools: {
 *     county: countyTool.toVercelAiTool(),
 *   },
 * });
 * ```
 */
export class GetUsCountyGeojsonTool extends OpenAssistantTool<typeof GetUsCountyGeojsonArgs> {
  protected readonly defaultDescription = 'Get GeoJSON data for all counties in a US state by its state code';
  protected readonly defaultParameters = GetUsCountyGeojsonArgs;

  constructor(options: OpenAssistantToolOptions<typeof GetUsCountyGeojsonArgs> = {}) {
    super({
      ...options,
      context: options.context || {},
    });
  }

  async execute(
    args: z.infer<typeof GetUsCountyGeojsonArgs>,
    options?: { context?: Record<string, unknown> }
  ): Promise<ExecuteGetUsCountyGeojsonResult> {
    try {
      const { fipsCodes } = args;
      const features: GeoJSON.Feature[] = [];

      for (const fips of fipsCodes) {
        // get cached county geojson if exists in openassistant/utils module
        let geojson = getCachedData(fips);
        if (!geojson) {
          // Use the global rate limiter before making the API call
          await githubRateLimiter.waitForNextCall();

          const stateCode = fips.substring(0, 2);
          const response = await fetch(
            `https://raw.githubusercontent.com/hyperknot/country-levels-export/master/geojson/medium/fips/${stateCode}/${fips}.geojson`
          );

          // the above url return Feature directly, not FeatureCollection
          geojson = await response.json();
        }
        if (geojson) {
          // cache the county geojson to avoid overloading the Github API
          cacheData(fips, geojson);
          features.push(geojson as unknown as GeoJSON.Feature);
        }
      }

      const finalGeojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features,
      };

      const outputDatasetName = `counties_${generateId()}`;

      return {
        llmResult: {
          success: true,
          datasetName: outputDatasetName,
          result: `Successfully fetched the GeoJSON data of the counties. The GeoJSON data has been cached with the dataset name: ${outputDatasetName}.`,
        },
        additionalData: {
          fipsCodes,
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
          error: `Failed to get the GeoJSON data of the county ${args}: ${error}`,
        },
      };
    }
  }
}
