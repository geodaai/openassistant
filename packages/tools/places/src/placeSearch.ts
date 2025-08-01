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
  FoursquarePhotoExtended,
  FoursquareTipExtended,
  FoursquareContext,
} from './types';

interface FoursquarePlace extends FoursquarePlaceBase {
  photos?: FoursquarePhotoExtended[];
  related_places?: {
    parent?: FoursquarePlace;
    children?: FoursquarePlace[];
  };
  tips?: FoursquareTipExtended[];
}

interface FoursquarePlacesResponse {
  results: FoursquarePlace[];
  context: FoursquareContext;
}

export type PlaceSearchFunctionArgs = z.ZodObject<{
  query: z.ZodOptional<z.ZodString>;
  location: z.ZodOptional<
    z.ZodObject<{
      longitude: z.ZodNumber;
      latitude: z.ZodNumber;
      radius: z.ZodOptional<z.ZodNumber>;
    }>
  >;
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
  currentTimestamp: z.ZodOptional<z.ZodString>;
  ne: z.ZodOptional<
    z.ZodObject<{
      latitude: z.ZodNumber;
      longitude: z.ZodNumber;
    }>
  >;
  sw: z.ZodOptional<
    z.ZodObject<{
      latitude: z.ZodNumber;
      longitude: z.ZodNumber;
    }>
  >;
  polygonDatasetName: z.ZodOptional<z.ZodString>;
  limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
  sort: z.ZodOptional<
    z.ZodDefault<z.ZodEnum<['relevance', 'rating', 'distance']>>
  >;
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
 * This tool searches for places using the Foursquare Places API. It can search for places by name,
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
    'Search for places using the Foursquare Places API. You can search by name, category, or other criteria within a specified location or area.',
  parameters: z.object({
    query: z
      .string()
      .optional()
      .describe('The search query (e.g., "coffee", "restaurant", "hotel")'),
    location: z
      .object({
        longitude: z
          .number()
          .describe('The longitude of the search center point'),
        latitude: z
          .number()
          .describe('The latitude of the search center point'),
        radius: z
          .number()
          .describe('The search radius in meters (0-100000)')
          .optional(),
      })
      .describe('The location to search around')
      .optional(),
    near: z
      .string()
      .describe('A geocodable locality to search near (e.g., "New York, NY")')
      .optional(),
    categories: z
      .array(z.string())
      .describe(
        'Array of category IDs to filter by (5-integer style preferred)'
      )
      .optional(),
    chains: z
      .array(z.string())
      .describe('Array of chain IDs to filter by')
      .optional(),
    exclude_chains: z
      .array(z.string())
      .describe('Array of chain IDs to exclude')
      .optional(),
    exclude_all_chains: z
      .boolean()
      .describe('Exclude all chain locations')
      .optional(),
    fields: z
      .array(z.string())
      .describe('Specific fields to return in the response')
      .optional(),
    min_price: z
      .number()
      .min(1)
      .max(4)
      .describe('Minimum price range (1-4, 1=most affordable)')
      .optional(),
    max_price: z
      .number()
      .min(1)
      .max(4)
      .describe('Maximum price range (1-4, 4=most expensive)')
      .optional(),
    open_at: z
      .string()
      .describe(
        'Open at specific time (format: DOWTHHMM, e.g., "1T2130" for Monday 9:30 PM)'
      )
      .optional(),
    open_now: z
      .boolean()
      .describe('Only return places that are currently open')
      .optional(),
    currentTimestamp: z
      .string()
      .describe(
        'Current timestamp for the search request. If changed, the search will be re-run.'
      )
      .optional(),
    ne: z
      .object({
        latitude: z
          .number()
          .describe('North-east latitude for rectangular search'),
        longitude: z
          .number()
          .describe('North-east longitude for rectangular search'),
      })
      .describe('North-east corner for rectangular search bounds')
      .optional(),
    sw: z
      .object({
        latitude: z
          .number()
          .describe('South-west latitude for rectangular search'),
        longitude: z
          .number()
          .describe('South-west longitude for rectangular search'),
      })
      .describe('South-west corner for rectangular search bounds')
      .optional(),
    polygonDatasetName: z
      .string()
      .describe('Dataset name of the polygon GeoJSON to use for the search')
      .optional(),
    limit: z
      .number()
      .min(1)
      .max(50)
      .describe('Maximum number of results to return (1-50)')
      .default(10)
      .optional(),
    sort: z
      .enum(['relevance', 'rating', 'distance'])
      .describe('Sort order for results.')
      .default('relevance')
      .optional(),
    session_token: z
      .string()
      .describe('User-generated token for billing purposes')
      .optional(),
    super_venue_id: z
      .string()
      .describe('Foursquare Venue ID to use as search bounds')
      .optional(),
  }),
  execute: async (args, options): Promise<ExecutePlaceSearchResult> => {
    console.log(
      '🔍 placeSearch.execute called with args:',
      JSON.stringify(args, null, 2)
    );
    console.log('  - currentTimestamp:', args.currentTimestamp);

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
        currentTimestamp,
        ne,
        sw,
        polygonDatasetName,
        limit = 10,
        sort,
        session_token,
        super_venue_id,
      } = args;

      console.log('📋 Parsed arguments:');
      console.log('  - query:', query);
      console.log('  - location:', location);
      console.log('  - near:', near);
      console.log('  - categories:', categories);
      console.log('  - limit:', limit);
      console.log('  - sort:', sort);
      console.log('  - currentTimestamp:', currentTimestamp);
      console.log('  - polygonDatasetName:', polygonDatasetName);

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

      // Build Foursquare Places API URL
      const url = new URL('https://places-api.foursquare.com/places/search');
      console.log('🌐 Building Foursquare Places API URL...');

      // Add required query parameter
      if (query) {
        url.searchParams.set('query', query);
        console.log('  ✅ Added query parameter:', query);
      } else {
        console.log('  ⚠️  No query parameter provided');
      }

      // Add optional parameters
      if (limit) url.searchParams.set('limit', limit.toString());
      if (sort) url.searchParams.set('sort', sort);

      // Add location parameters using the new format
      if (location) {
        // Use the new ll parameter format: "latitude,longitude"
        url.searchParams.set(
          'll',
          `${location.latitude},${location.longitude}`
        );
        // Set default radius to 1000 meters if not provided
        const radius = location.radius ?? 1000;
        url.searchParams.set('radius', radius.toString());
        console.log('  📍 Added location parameters:');
        console.log('    - ll:', `${location.latitude},${location.longitude}`);
        console.log('    - radius:', radius);
      } else if (near) {
        url.searchParams.set('near', near);
        console.log('  📍 Added near parameter:', near);
      } else {
        console.log('  ⚠️  No location parameters provided');
      }

      // Add rectangular bounds
      if (ne && sw) {
        url.searchParams.set('ne', `${ne.latitude},${ne.longitude}`);
        url.searchParams.set('sw', `${sw.latitude},${sw.longitude}`);
      } else if (polygonDatasetName && 'getGeometries' in options.context) {
        // use the polygon to get ne and sw
        const { getGeometries } = options.context;
        const polygonGeoJSON = await getGeometries?.(polygonDatasetName);
        if (polygonGeoJSON) {
          let ne: { latitude: number; longitude: number } | undefined;
          let sw: { latitude: number; longitude: number } | undefined;
          for (const feature of polygonGeoJSON) {
            if (feature && feature.geometry) {
              // convert the polygonGeoJSON Feature to a polygon array
              if (
                feature.geometry.type === 'Polygon' ||
                feature.geometry.type === 'MultiPolygon'
              ) {
                const coordinates = feature.geometry.coordinates;
                coordinates.forEach((coordinate) => {
                  const [longitude, latitude] = coordinate;
                  if (latitude > (ne?.latitude ?? -Infinity)) {
                    ne = { latitude, longitude };
                  }
                  if (latitude < (sw?.latitude ?? Infinity)) {
                    sw = { latitude, longitude };
                  }
                });
              }
            }
            if (ne && sw) {
              url.searchParams.set('ne', `${ne.latitude},${ne.longitude}`);
              url.searchParams.set('sw', `${sw.latitude},${sw.longitude}`);
            }
          }
        }
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
      if (super_venue_id)
        url.searchParams.set('super_venue_id', super_venue_id);

      // Call Foursquare Places API with updated headers
      console.log('🚀 Making Foursquare Places API call to:', url.toString());
      console.log(
        '🔑 Using access token:',
        fsqAccessToken ? '***' + fsqAccessToken.slice(-4) : 'undefined'
      );

      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          'X-Places-Api-Version': '2025-06-17',
          Accept: 'application/json',
          Authorization: `Bearer ${fsqAccessToken}`,
        },
      });
      clearTimeout(timeoutId);

      console.log(
        '📡 API Response status:',
        response.status,
        response.statusText
      );

      if (!response.ok) {
        throw new Error(
          `Foursquare Places API error: ${response.status} ${response.statusText}`
        );
      }

      const data = (await response.json()) as FoursquarePlacesResponse;
      console.log('📊 API Response data:');
      console.log('  - Total results:', data.results?.length || 0);
      console.log(
        '  - Results:',
        data.results
          ?.slice(0, 2)
          .map((p) => ({ name: p.name, distance: p.distance })) || []
      );

      if (!data.results || data.results.length === 0) {
        console.log('❌ No places found in API response');
        return {
          llmResult: {
            success: false,
            error: 'No places found matching the search criteria',
          },
        };
      }

      console.log('✅ Found', data.results.length, 'places in API response');

      // Transform the results for better usability
      const placesData = data.results.map((place) => ({
        id: place.fsq_place_id,
        name: place.name,
        location: {
          latitude: place.latitude,
          longitude: place.longitude,
          address: place.location.formatted_address || place.location.address,
          city: place.location.locality,
          state: place.location.region,
          country: place.location.country,
          postalCode: place.location.postcode,
        },
        categories: place.categories.map((cat) => ({
          id: cat.fsq_category_id,
          name: cat.name,
          icon: `${cat.icon.prefix}32${cat.icon.suffix}`,
        })),
        ...(chains &&
          chains.length > 0 && {
            chains: place.chains?.map((chain) => ({
              id: chain.fsq_chain_id,
              name: chain.name,
              logo: chain.logo
                ? `${chain.logo.prefix}32${chain.logo.suffix}`
                : undefined,
            })),
          }),
        distance: place.distance,
        phone: place.tel,
        website: place.website,
        ...(place.rating && { rating: place.rating }),
        ...(place.price && { price: place.price }),
        ...(place.hours && { hours: place.hours }),
        ...(place.description && { description: place.description }),
        ...(place.email && { email: place.email }),
        ...(place.attributes && { attributes: place.attributes }),
        ...(place.photos && {
          photos: place.photos.map((photo) => ({
            id: photo.fsq_photo_id,
            url: `${photo.prefix}300x300${photo.suffix}`,
          })),
        }),
        ...(place.popularity && { popularity: place.popularity }),
        ...(place.verified && { verified: place.verified }),
        ...(place.social_media && { socialMedia: place.social_media }),
        ...(place.stats && { stats: place.stats }),
        ...(place.tastes && { tastes: place.tastes }),
        ...(place.tips && { tips: place.tips }),
        ...(place.date_created && { dateCreated: place.date_created }),
        ...(place.date_refreshed && { dateRefreshed: place.date_refreshed }),
        ...(place.date_closed && { dateClosed: place.date_closed }),
        ...(place.extended_location && {
          extendedLocation: place.extended_location,
        }),
        ...(place.hours_popular && { hoursPopular: place.hours_popular }),
        ...(place.link && { link: place.link }),
        ...(place.menu && { menu: place.menu }),
        ...(place.placemaker_url && { placemakerUrl: place.placemaker_url }),
        ...(place.store_id && { storeId: place.store_id }),
        ...(place.related_places && { relatedPlaces: place.related_places }),
      }));

      console.log('📋 Returning search results');
      console.log('  - Dataset name:', outputDatasetName);
      console.log('  - Query:', query);
      console.log('  - Places found:', placesData.length);

      return {
        llmResult: {
          success: true,
          datasetName: outputDatasetName,
          query,
          ...(location && { location }),
          ...(near && { near }),
          result: JSON.stringify(placesData, null, 2),
        },
        additionalData: {
          query: query || '',
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
      console.error('💥 Error in placeSearch.execute:', error);

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack =
        error instanceof Error ? error.stack : 'No stack trace available';

      console.error('  - Error message:', errorMessage);
      console.error('  - Error stack:', errorStack);

      return {
        llmResult: {
          success: false,
          error: `Failed to search for places: ${errorMessage}`,
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
