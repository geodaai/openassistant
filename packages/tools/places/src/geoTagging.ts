// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { z } from 'zod';
import { generateId, extendedTool } from '@openassistant/utils';
import {
  isFoursquareToolContext,
  FoursquareToolContext,
} from './register-tools';
import { foursquareRateLimiter } from './utils/rateLimiter';
import {
  FoursquarePlaceBase,
  FoursquarePhoto,
  FoursquareTip,
  FoursquareContextOptional,
  FoursquareHours,
  FoursquareAttributes,
  FoursquareSocialMedia,
  FoursquareStats,
} from './types';

interface FoursquareGeotaggingCandidate extends FoursquarePlaceBase {
  photos?: FoursquarePhoto[];
  tips?: FoursquareTip[];
}

interface FoursquareGeotaggingResponse {
  candidates: FoursquareGeotaggingCandidate[];
  context: FoursquareContextOptional;
}

/**
 * Transformed geotagging candidate data with user-friendly structure
 */
export interface GeotaggingCandidateData {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  categories: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
  chains?: Array<{
    id: string;
    name: string;
    logo?: string;
  }>;
  distance?: number;
  phone?: string;
  website?: string;
  rating?: number;
  price?: number;
  hours?: FoursquareHours;
  description?: string;
  email?: string;
  attributes?: FoursquareAttributes;
  photos?: Array<{
    id: string;
    url: string;
  }>;
  popularity?: number;
  verified?: boolean;
  socialMedia?: FoursquareSocialMedia;
  stats?: FoursquareStats;
  tastes?: string[];
  tips?: FoursquareTip[];
}

export type GeotaggingFunctionArgs = z.ZodObject<{
  ll: z.ZodOptional<z.ZodString>;
  fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
  hacc: z.ZodOptional<z.ZodNumber>;
  altitude: z.ZodOptional<z.ZodNumber>;
  query: z.ZodOptional<z.ZodString>;
  limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}>;

export type GeotaggingLlmResult = {
  success: boolean;
  datasetName?: string;
  location?: string;
  result?: string;
  error?: string;
};

export type GeotaggingAdditionalData = {
  location?: string;
  datasetName: string;
  [datasetName: string]: unknown;
};

export type ExecuteGeotaggingResult = {
  llmResult: GeotaggingLlmResult;
  additionalData?: GeotaggingAdditionalData;
};

/**
 * ## Geotagging Candidates Tool
 *
 * This tool uses Foursquare's Snap to Place technology to detect where your user's device is and what is around them.
 * It returns geotagging candidates based on the provided location coordinates.
 *
 * :::tip
 * This endpoint intentionally returns lower quality results not found in Place Search. It is not intended to replace
 * Place Search as the primary way to search for top, recommended POIs.
 * :::
 *
 * Example user prompts:
 * - "Find places near my current location at 40.7589,-73.9851"
 * - "What's around me at these coordinates?"
 * - "Find nearby businesses at latitude 34.0522, longitude -118.2437"
 * - "Get geotagging candidates for this location"
 * - "Find places matching 'coffee' near me"
 *
 * @example
 * ```typescript
 * import { geotagging, GeotaggingTool } from "@openassistant/places";
 * import { convertToVercelAiTool, ToolCache } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * // you can use ToolCache to save the geotagging dataset for later use
 * const toolResultCache = ToolCache.getInstance();
 *
 * const geotaggingTool: GeotaggingTool = {
 *   ...geotagging,
 *   toolContext: {
 *     getFsqToken: () => process.env.FSQ_TOKEN!,
 *   },
 *   onToolCompleted: (toolCallId, additionalData) => {
 *     toolResultCache.addDataset(toolCallId, additionalData);
 *   },
 * };
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Find places near my current location at 40.7589,-73.9851',
 *   tools: {
 *     geotagging: convertToVercelAiTool(geotaggingTool),
 *   },
 * });
 * ```
 *
 * For a more complete example, see the [Places Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_places_example).
 */
export const geotagging = extendedTool<
  GeotaggingFunctionArgs,
  GeotaggingLlmResult,
  GeotaggingAdditionalData,
  FoursquareToolContext
>({
  description:
    "Use Foursquare's Snap-to-Place or Check-in technology to detect where your user's device is and what is around them. Returns geotagging candidates based on location coordinates.",
  parameters: z.object({
    ll: z
      .string()
      .describe(
        'The latitude and longitude of the location (format: "latitude,longitude"). If not specified, the server will attempt to geolocate the IP address from the request.'
      )
      .optional(),
    fields: z
      .array(z.string())
      .describe(
        'Indicate which fields to return in the response, separated by commas. If no fields are specified, all Pro Fields are returned by default.'
      )
      .optional(),
    hacc: z
      .number()
      .describe(
        "The estimated horizontal accuracy radius in meters of the user's location at the 68th percentile confidence level as returned by the user's cell phone OS."
      )
      .optional(),
    altitude: z
      .number()
      .describe(
        "The altitude of the user's location in meters above the World Geodetic System 1984 (WGS84) reference ellipsoid as returned by the user's cell phone OS."
      )
      .optional(),
    query: z
      .string()
      .describe('A string to be matched against place name for candidates.')
      .optional(),
    limit: z
      .number()
      .min(1)
      .max(50)
      .describe('The number of results to return, up to 50. Defaults to 10.')
      .default(10)
      .optional(),
  }),
  execute: async (args, options): Promise<ExecuteGeotaggingResult> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      const { ll, fields, hacc, altitude, query, limit = 10 } = args;

      // Generate output dataset name
      const outputDatasetName = `geotagging_${generateId()}`;

      if (!options?.context || !isFoursquareToolContext(options.context)) {
        throw new Error(
          'Context is required and must implement FoursquareToolContext'
        );
      }
      const fsqAccessToken = options.context.getFsqToken();

      // Use the global rate limiter before making the API call
      await foursquareRateLimiter.waitForNextCall();

      // Build Foursquare Geotagging API URL
      const url = new URL(
        'https://places-api.foursquare.com/geotagging/candidates'
      );

      // Add optional parameters
      if (ll) url.searchParams.set('ll', ll);
      if (limit) url.searchParams.set('limit', limit.toString());
      if (hacc) url.searchParams.set('hacc', hacc.toString());
      if (altitude) url.searchParams.set('altitude', altitude.toString());
      if (query) url.searchParams.set('query', query);

      // Add fields if specified
      if (fields && fields.length > 0) {
        url.searchParams.set('fields', fields.join(','));
      }

      // Call Foursquare Geotagging API
      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          'X-Places-Api-Version': '2025-06-17',
          Accept: 'application/json',
          Authorization: `Bearer ${fsqAccessToken}`,
        },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `Foursquare Geotagging API error: ${response.status} ${response.statusText}`
        );
      }

      const data = (await response.json()) as FoursquareGeotaggingResponse;

      if (!data.candidates || data.candidates.length === 0) {
        return {
          llmResult: {
            success: false,
            error: 'No geotagging candidates found for the specified location',
          },
        };
      }

      // Transform the results for better usability
      const candidatesData: GeotaggingCandidateData[] = data.candidates.map((candidate) => ({
        id: candidate.fsq_place_id,
        name: candidate.name,
        location: {
          latitude: candidate.latitude,
          longitude: candidate.longitude,
          address:
            candidate.location.formatted_address || candidate.location.address,
          city: candidate.location.locality,
          state: candidate.location.region,
          country: candidate.location.country,
          postalCode: candidate.location.postcode,
        },
        categories: candidate.categories.map((cat) => ({
          id: cat.fsq_category_id,
          name: cat.name,
          icon: `${cat.icon.prefix}32${cat.icon.suffix}`,
        })),
        chains: candidate.chains?.map((chain) => ({
          id: chain.fsq_chain_id,
          name: chain.name,
          logo: chain.logo
            ? `${chain.logo.prefix}32${chain.logo.suffix}`
            : undefined,
        })),
        distance: candidate.distance,
        phone: candidate.tel,
        website: candidate.website,
        rating: candidate.rating,
        price: candidate.price,
        hours: candidate.hours,
        description: candidate.description,
        email: candidate.email,
        attributes: candidate.attributes,
        photos: candidate.photos?.map((photo) => ({
          id: photo.id,
          url: `${photo.prefix}300x300${photo.suffix}`,
        })),
        popularity: candidate.popularity,
        verified: candidate.verified,
        socialMedia: candidate.social_media,
        stats: candidate.stats,
        tastes: candidate.tastes,
        tips: candidate.tips,
      }));

      // find the closest place from the candidatesData
      const closestPlace = candidatesData.sort((a, b) => (a.distance || 0) - (b.distance || 0))[0];

      return {
        llmResult: {
          success: true,
          datasetName: outputDatasetName,
          ...(ll && { location: ll }),
          ...(closestPlace && { closestPlace }),
          result: JSON.stringify(candidatesData, null, 2),
        },
        additionalData: {
          ...(ll && { location: ll }),
          datasetName: outputDatasetName,
          [outputDatasetName]: {
            type: 'geotagging_candidates',
            content: candidatesData,
            metadata: {
              totalResults: candidatesData.length,
              location: ll,
              hacc,
              altitude,
              query,
              fields,
            },
          },
        },
      };
    } catch (error) {
      clearTimeout(timeoutId);
      return {
        llmResult: {
          success: false,
          error: `Failed to get geotagging candidates: ${error}`,
        },
      };
    }
  },
  context: {
    getFsqToken: () => {
      throw new Error('getFsqToken not implemented.');
    },
  },
});

export type GeotaggingTool = typeof geotagging;

export type GeotaggingToolContext = {
  getFsqToken: () => string;
};
