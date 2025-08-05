// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { z } from 'zod';
import { extendedTool, generateId } from '@openassistant/utils';
import { RateLimiter } from './utils/rateLimiter';

// Create a single instance to be shared across all calls
const nominatimRateLimiter = new RateLimiter(1000);

export type GeocodingFunctionArgs = z.ZodObject<{
  address: z.ZodString;
}>;

export type GeocodingLlmResult = {
  success: boolean;
  datasetName?: string;
  geojson?: GeoJSON.FeatureCollection;
  result?: string;
  error?: string;
};

export type GeocodingAdditionalData = {
  address: string;
  datasetName: string;
  [datasetName: string]: unknown;
};

/**
 * ## Geocoding Tool
 *
 * This tool converts addresses into geographic coordinates (latitude and longitude) using OpenStreetMap's Nominatim service.
 *
 * Example user prompts:
 * - "Find the coordinates for 123 Main Street, New York"
 * - "What are the coordinates of the Eiffel Tower?"
 * - "Get the location of Central Park"
 *
 * @example
 * ```typescript
 * import { geocoding, GeocodingTool } from "@openassistant/osm";
 * import { convertToVercelAiTool } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'What are the coordinates of the Eiffel Tower?',
 *   tools: {
 *     geocoding: convertToVercelAiTool(geocoding),
 *   },
 * });
 * ```
 */
export const geocoding = extendedTool<
  GeocodingFunctionArgs,
  GeocodingLlmResult,
  GeocodingAdditionalData,
  GeocodingToolContext
>({
  description:
    'Geocode an address to get the latitude and longitude of the address',
  parameters: z.object({
    address: z.string().describe('The address to geocode'),
  }),
  execute: async (
    args
  ): Promise<{
    llmResult: GeocodingLlmResult;
    additionalData?: GeocodingAdditionalData;
  }> => {
    try {
      const { address } = args;

      // Use the global rate limiter before making the API call
      await nominatimRateLimiter.waitForNextCall();

      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;
      console.log('geocoding url: ', url);

      // Retry mechanism for better reliability
      let data;
      let lastError;
      
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'OpenAssistant/1.0 (https://github.com/openassistant/openassistant)',
              'Accept': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error(`Expected JSON response but got: ${contentType}. Response: ${text.substring(0, 200)}...`);
          }

          data = await response.json();
          break; // Success, exit retry loop
        } catch (error) {
          lastError = error;
          if (attempt < 3) {
            console.log(`Attempt ${attempt} failed, retrying in ${attempt * 1000}ms...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
            await nominatimRateLimiter.waitForNextCall(); // Rate limit between retries
          }
        }
      }

      if (!data) {
        throw lastError || new Error('Failed to fetch data after 3 attempts');
      }

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No geocoding results found for the given address');
      }

      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [data[0].lon, data[0].lat],
            },
            properties: {
              name: data[0].display_name,
            },
          },
        ],
      };

      const outputDatasetName = `geocoding_${generateId()}`;

      return {
        llmResult: {
          success: true,
          datasetName: outputDatasetName,
          geojson,
          result: `Successfully geocoded address: ${address}. The GeoJSON data has been cached with the dataset name: ${outputDatasetName}.`,
        },
        additionalData: {
          address,
          datasetName: outputDatasetName,
          [outputDatasetName]: geojson,
        },
      };
    } catch (error) {
      return {
        llmResult: {
          success: false,
          error: `Failed to geocode address: ${error}`,
        },
      };
    }
  },
  context: {},
});

export type GeocodingTool = typeof geocoding;

export type ExecuteGeocodingResult = {
  llmResult: {
    success: boolean;
    result?: GeoJSON.FeatureCollection;
    error?: string;
  };
  additionalData?: {
    address: string;
    geojson: GeoJSON.FeatureCollection;
  };
};

export type GeocodingToolContext = object;
