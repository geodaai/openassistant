// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { z } from 'zod';
import { generateId, extendedTool } from '@openassistant/utils';
import { isFoursquareToolContext, FoursquareToolContext } from './register-tools';
import { foursquareRateLimiter } from './utils/rateLimiter';

interface FoursquarePlace {
  fsq_id: string;
  name: string;
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    };
  };
  location: {
    address?: string;
    locality?: string;
    region?: string;
    country?: string;
    postcode?: string;
    formatted_address?: string;
  };
  categories: Array<{
    id: number;
    name: string;
    icon: {
      prefix: string;
      suffix: string;
    };
  }>;
  distance?: number;
  tel?: string;
  website?: string;
  rating?: number;
  price?: number;
  hours?: {
    open: Array<{
      day: number;
      start: string;
      end: string;
    }>;
  };
}

interface FoursquarePlacesResponse {
  results: FoursquarePlace[];
  context: {
    geo_bounds: {
      circle: {
        center: {
          latitude: number;
          longitude: number;
        };
        radius: number;
      };
    };
  };
}

export type PlaceSearchFunctionArgs = z.ZodObject<{
  query: z.ZodString;
  location: z.ZodOptional<z.ZodObject<{
    longitude: z.ZodNumber;
    latitude: z.ZodNumber;
    radius: z.ZodOptional<z.ZodNumber>;
  }>>;
  near: z.ZodOptional<z.ZodString>;
  categories: z.ZodOptional<z.ZodArray<z.ZodString>>;
  chains: z.ZodOptional<z.ZodArray<z.ZodString>>;
  exclude_chains: z.ZodOptional<z.ZodArray<z.ZodString>>;
  exclude_all_chains: z.ZodOptional<z.ZodBoolean>;
  fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
  min_price: z.ZodOptional<z.ZodNumber>;
  max_price: z.ZodOptional<z.ZodNumber>;
  open_at: z.ZodOptional<z.ZodString>;
  open_now: z.ZodOptional<z.ZodBoolean>;
  ne: z.ZodOptional<z.ZodObject<{
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
  }>>;
  sw: z.ZodOptional<z.ZodObject<{
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
  }>>;
  polygon: z.ZodOptional<z.ZodArray<z.ZodObject<{
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
  }>>>;
  limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
  sort: z.ZodOptional<z.ZodDefault<z.ZodEnum<['relevance', 'rating', 'distance']>>>;
  session_token: z.ZodOptional<z.ZodString>;
  super_venue_id: z.ZodOptional<z.ZodString>;
}>;

export type PlaceSearchLlmResult = {
  success: boolean;
  datasetName?: string;
  query?: string;
  location?: {
    longitude: number;
    latitude: number;
    radius?: number;
  };
  near?: string;
  result?: string;
  error?: string;
};

export type PlaceSearchAdditionalData = {
  query: string;
  location?: {
    longitude: number;
    latitude: number;
    radius?: number;
  };
  near?: string;
  datasetName: string;
  [datasetName: string]: unknown;
};

export type ExecutePlaceSearchResult = {
  llmResult: PlaceSearchLlmResult;
  additionalData?: PlaceSearchAdditionalData;
};

/**
 * ## Place Search Tool
 * 
 * This tool searches for places using the Foursquare Places API v3. It can search for places by name,
 * category, or other criteria within a specified location or area.
 *
 * :::tip
 * If you don't know the coordinates of the location, you can use the geocoding tool to get it.
 * :::
 *
 * Example user prompts:
 * - "Find coffee shops near Times Square"
 * - "Search for restaurants within 2km of the Eiffel Tower"
 * - "What are the best rated hotels in San Francisco?"
 * - "Find gas stations near me"
 * - "Find open restaurants now"
 * - "Find expensive restaurants in Manhattan"
 *
 * @example
 * ```typescript
 * import { placeSearch, PlaceSearchTool } from "@openassistant/places";
 * import { convertToVercelAiTool, ToolCache } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * // you can use ToolCache to save the place search dataset for later use
 * const toolResultCache = ToolCache.getInstance();
 *
 * const placeSearchTool: PlaceSearchTool = {
 *   ...placeSearch,
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
 *   prompt: 'Find coffee shops near Times Square',
 *   tools: {
 *     placeSearch: convertToVercelAiTool(placeSearchTool),
 *   },
 * });
 * ```
 *
 * For a more complete example, see the [Places Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_places_example).
 */
export const placeSearch = extendedTool<
  PlaceSearchFunctionArgs,
  PlaceSearchLlmResult,
  PlaceSearchAdditionalData,
  FoursquareToolContext
>({
  description:
    'Search for places using the Foursquare Places API v3. You can search by name, category, or other criteria within a specified location or area.',
  parameters: z.object({
    query: z.string().describe('The search query (e.g., "coffee", "restaurant", "hotel")'),
    location: z.object({
      longitude: z.number().describe('The longitude of the search center point'),
      latitude: z.number().describe('The latitude of the search center point'),
      radius: z.number().describe('The search radius in meters (0-100000)').optional(),
    }).describe('The location to search around').optional(),
    near: z.string().describe('A geocodable locality to search near (e.g., "New York, NY")').optional(),
    categories: z.array(z.string()).describe('Array of category IDs to filter by (5-integer style preferred)').optional(),
    chains: z.array(z.string()).describe('Array of chain IDs to filter by').optional(),
    exclude_chains: z.array(z.string()).describe('Array of chain IDs to exclude').optional(),
    exclude_all_chains: z.boolean().describe('Exclude all chain locations').optional(),
    fields: z.array(z.string()).describe('Specific fields to return in the response').optional(),
    min_price: z.number().min(1).max(4).describe('Minimum price range (1-4, 1=most affordable)').optional(),
    max_price: z.number().min(1).max(4).describe('Maximum price range (1-4, 4=most expensive)').optional(),
    open_at: z.string().describe('Open at specific time (format: DOWTHHMM, e.g., "1T2130" for Monday 9:30 PM)').optional(),
    open_now: z.boolean().describe('Only return places that are currently open').optional(),
    ne: z.object({
      latitude: z.number().describe('North-east latitude for rectangular search'),
      longitude: z.number().describe('North-east longitude for rectangular search'),
    }).describe('North-east corner for rectangular search bounds').optional(),
    sw: z.object({
      latitude: z.number().describe('South-west latitude for rectangular search'),
      longitude: z.number().describe('South-west longitude for rectangular search'),
    }).describe('South-west corner for rectangular search bounds').optional(),
    polygon: z.array(z.object({
      latitude: z.number().describe('Polygon point latitude'),
      longitude: z.number().describe('Polygon point longitude'),
    })).describe('Array of coordinate pairs defining a polygon search area').optional(),
    limit: z.number().min(1).max(50).describe('Maximum number of results to return (1-50)').default(10).optional(),
    sort: z.enum(['relevance', 'rating', 'distance']).describe('Sort order for results').default('relevance').optional(),
    session_token: z.string().describe('User-generated token for billing purposes').optional(),
    super_venue_id: z.string().describe('Foursquare Venue ID to use as search bounds').optional(),
  }),
  execute: async (args, options): Promise<ExecutePlaceSearchResult> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      const {
        query,
        location,
        near,
        categories,
        chains,
        exclude_chains,
        exclude_all_chains,
        fields,
        min_price,
        max_price,
        open_at,
        open_now,
        ne,
        sw,
        polygon,
        limit = 10,
        sort = 'relevance',
        session_token,
        super_venue_id,
      } = args;

      // Generate output dataset name
      const outputDatasetName = `places_${generateId()}`;

      if (!options?.context || !isFoursquareToolContext(options.context)) {
        throw new Error(
          'Context is required and must implement FoursquareToolContext'
        );
      }
      const fsqAccessToken = options.context.getFsqToken();

      // Use the global rate limiter before making the API call
      await foursquareRateLimiter.waitForNextCall();

      // Build Foursquare API v3 URL
      const url = new URL('https://api.foursquare.com/v3/places/search');
      
      // Add required query parameter
      url.searchParams.set('query', query);
      
      // Add optional parameters
      if (limit) url.searchParams.set('limit', limit.toString());
      if (sort) url.searchParams.set('sort', sort);
      
      // Add location parameters
      if (location) {
        url.searchParams.set('ll', `${location.latitude},${location.longitude}`);
        if (location.radius) {
          url.searchParams.set('radius', location.radius.toString());
        }
      } else if (near) {
        url.searchParams.set('near', near);
      }

      // Add rectangular bounds
      if (ne && sw) {
        url.searchParams.set('ne', `${ne.latitude},${ne.longitude}`);
        url.searchParams.set('sw', `${sw.latitude},${sw.longitude}`);
      }

      // Add polygon bounds
      if (polygon && polygon.length >= 4) {
        const polygonString = polygon.map(point => `${point.latitude},${point.longitude}`).join('~');
        url.searchParams.set('polygon', polygonString);
      }

      // Add categories if specified
      if (categories && categories.length > 0) {
        url.searchParams.set('categories', categories.join(','));
      }

      // Add chain parameters
      if (chains && chains.length > 0) {
        url.searchParams.set('chains', chains.join(','));
      }
      if (exclude_chains && exclude_chains.length > 0) {
        url.searchParams.set('exclude_chains', exclude_chains.join(','));
      }
      if (exclude_all_chains) {
        url.searchParams.set('exclude_all_chains', 'true');
      }

      // Add fields if specified
      if (fields && fields.length > 0) {
        url.searchParams.set('fields', fields.join(','));
      }

      // Add price range
      if (min_price) url.searchParams.set('min_price', min_price.toString());
      if (max_price) url.searchParams.set('max_price', max_price.toString());

      // Add opening hours parameters
      if (open_at) url.searchParams.set('open_at', open_at);
      if (open_now) url.searchParams.set('open_now', 'true');

      // Add session token and super venue ID
      if (session_token) url.searchParams.set('session_token', session_token);
      if (super_venue_id) url.searchParams.set('super_venue_id', super_venue_id);

      // Call Foursquare API v3
      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${fsqAccessToken}`,
          'Accept': 'application/json',
        },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Foursquare API error: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as FoursquarePlacesResponse;

      if (!data.results || data.results.length === 0) {
        return {
          llmResult: {
            success: false,
            error: 'No places found matching the search criteria',
          },
        };
      }

      // Transform the results for better usability
      const placesData = data.results.map(place => ({
        id: place.fsq_id,
        name: place.name,
        location: {
          latitude: place.geocodes.main.latitude,
          longitude: place.geocodes.main.longitude,
          address: place.location.formatted_address || place.location.address,
          city: place.location.locality,
          state: place.location.region,
          country: place.location.country,
          postalCode: place.location.postcode,
        },
        categories: place.categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          icon: `${cat.icon.prefix}32${cat.icon.suffix}`,
        })),
        distance: place.distance,
        phone: place.tel,
        website: place.website,
        rating: place.rating,
        price: place.price,
        hours: place.hours,
      }));

      return {
        llmResult: {
          success: true,
          datasetName: outputDatasetName,
          query,
          ...(location && { location }),
          ...(near && { near }),
          result: `Found ${placesData.length} places matching "${query}". The place data has been saved with the dataset name: ${outputDatasetName}.`,
        },
        additionalData: {
          query,
          ...(location && { location }),
          ...(near && { near }),
          datasetName: outputDatasetName,
          [outputDatasetName]: {
            type: 'places',
            content: placesData,
            metadata: {
              totalResults: placesData.length,
              searchQuery: query,
              location: location || near,
              categories,
              chains,
              exclude_chains,
              exclude_all_chains,
              min_price,
              max_price,
              open_at,
              open_now,
              sort,
            },
          },
        },
      };
    } catch (error) {
      clearTimeout(timeoutId);
      return {
        llmResult: {
          success: false,
          error: `Failed to search for places: ${error}`,
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

export type PlaceSearchTool = typeof placeSearch;

export type PlaceSearchToolContext = {
  getFsqToken: () => string;
}; 