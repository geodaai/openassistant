import { z } from 'zod';
import { tool } from '@openassistant/utils';

export type GeocodingFunctionArgs = z.ZodObject<{
  address: z.ZodString;
}>;

export type GeocodingLlmResult = {
  success: boolean;
  result?: GeoJSON.FeatureCollection;
  error?: string;
};

export type GeocodingAdditionalData = {
  address: string;
  geojson: GeoJSON.FeatureCollection;
};

/**
 * Geocoding Tool
 * 
 * This tool converts addresses into geographic coordinates (latitude and longitude) using OpenStreetMap's Nominatim service.
 * 
 * Example user prompts:
 * - "Find the coordinates for 123 Main Street, New York"
 * - "What are the coordinates of the Eiffel Tower?"
 * - "Get the location of Central Park"
 * 
 * Example code:
 * ```typescript
 * import { getVercelAiTool } from "@openassistant/osm";
 *
 * const geocodingTool = getVercelAiTool('geocoding');
 * 
 * generateText({
 *   model: 'gpt-4o-mini',
 *   prompt: 'What are the coordinates of the Eiffel Tower?',
 *   tools: {geocoding: geocodingTool},
 * });
 * ```
 */
export const geocoding = tool<
  GeocodingFunctionArgs,
  GeocodingLlmResult,
  GeocodingAdditionalData
>({
  description: 'Geocode an address to get the latitude and longitude of the address',
  parameters: z.object({
    address: z.string().describe('The address to geocode'),
  }),
  execute: async (args): Promise<{
    llmResult: GeocodingLlmResult;
    additionalData?: GeocodingAdditionalData;
  }> => {
    try {
      const { address } = args;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${address}&format=json`
      );
      const data = await response.json();

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

      return {
        llmResult: {
          success: true,
          result: geojson,
        },
        additionalData: {
          address,
          geojson,
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
