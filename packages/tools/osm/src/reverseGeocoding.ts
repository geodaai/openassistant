// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { z } from 'zod';
import { extendedTool, generateId } from '@openassistant/utils';
import { RateLimiter } from './utils/rateLimiter';

// Create a single instance to be shared across all calls
// Nominatim requires 1 second between requests
const nominatimRateLimiter = new RateLimiter(1000);

export type ReverseGeocodingFunctionArgs = z.ZodObject<{
  latitude: z.ZodNumber;
  longitude: z.ZodNumber;
}>;

export type ReverseGeocodingLlmResult = {
  success: boolean;
  datasetName?: string;
  geojson?: GeoJSON.FeatureCollection;
  result?: string;
  error?: string;
};

export type ReverseGeocodingAdditionalData = {
  latitude: number;
  longitude: number;
  datasetName: string;
  [datasetName: string]: unknown;
};

/**
 * ## Reverse Geocoding Tool
 *
 * This tool converts geographic coordinates (latitude and longitude) into human-readable addresses using OpenStreetMap's Nominatim service.
 *
 * Example user prompts:
 * - "What's the address at coordinates 40.7128, -74.0060?"
 * - "Find the address for latitude 48.8584 and longitude 2.2945"
 * - "What location is at 51.5074, -0.1278?"
 *
 * @example
 * ```typescript
 * import { reverseGeocoding, ReverseGeocodingTool } from "@openassistant/osm";
 * import { convertToVercelAiTool } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'What is the address at coordinates 40.7128, -74.0060?',
 *   tools: {
 *     reverseGeocoding: convertToVercelAiTool(reverseGeocoding),
 *   },
 * });
 * ```
 */
export const reverseGeocoding = extendedTool<
  ReverseGeocodingFunctionArgs,
  ReverseGeocodingLlmResult,
  ReverseGeocodingAdditionalData,
  ReverseGeocodingToolContext
>({
  description:
    'Reverse geocode coordinates to get the address and location information for a given latitude and longitude',
  parameters: z.object({
    latitude: z.number().describe('The latitude coordinate (decimal degrees)'),
    longitude: z
      .number()
      .describe('The longitude coordinate (decimal degrees)'),
  }),
  execute: async (
    args
  ): Promise<{
    llmResult: ReverseGeocodingLlmResult;
    additionalData?: ReverseGeocodingAdditionalData;
  }> => {
    try {
      const { latitude, longitude } = args;

      // Validate coordinates
      if (latitude < -90 || latitude > 90) {
        throw new Error('Latitude must be between -90 and 90 degrees');
      }
      if (longitude < -180 || longitude > 180) {
        throw new Error('Longitude must be between -180 and 180 degrees');
      }

      // Use the global rate limiter before making the API call
      await nominatimRateLimiter.waitForNextCall();

      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
      console.log('reverseGeocoding url: ', url);

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

      console.log('reverseGeocoding data: ', data);

      if (data.error) {
        throw new Error(data.error);
      }

      console.log('reverseGeocoding data: ', data);

      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            properties: {
              name: data.display_name,
              address: data.address,
              type: data.type,
              class: data.class,
              place_id: data.place_id,
              osm_id: data.osm_id,
              osm_type: data.osm_type,
            },
          },
        ],
      };

      const outputDatasetName = `reverse_geocoding_${generateId()}`;

      return {
        llmResult: {
          success: true,
          datasetName: outputDatasetName,
          geojson,
          result: `Successfully reverse geocoded coordinates (${latitude}, ${longitude}). The address is: ${data.display_name}. The GeoJSON data has been cached with the dataset name: ${outputDatasetName}.`,
        },
        additionalData: {
          latitude,
          longitude,
          datasetName: outputDatasetName,
          [outputDatasetName]: geojson,
        },
      };
    } catch (error) {
      console.error('reverseGeocoding error: ', error);
      return {
        llmResult: {
          success: false,
          error: `Failed to reverse geocode coordinates: ${error}`,
        },
      };
    }
  },
  context: {},
});

export type ReverseGeocodingTool = typeof reverseGeocoding;

export type ExecuteReverseGeocodingResult = {
  llmResult: {
    success: boolean;
    result?: GeoJSON.FeatureCollection;
    error?: string;
  };
  additionalData?: {
    latitude: number;
    longitude: number;
    geojson: GeoJSON.FeatureCollection;
  };
};

export type ReverseGeocodingToolContext = object;
