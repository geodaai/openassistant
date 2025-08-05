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
  PlaceSearchResult,
  PlaceSearchMetadata,
} from './types';

// GeoJSON types
interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

interface GeoJSONFeature {
  type: 'Feature';
  geometry: GeoJSONPoint;
  properties: Record<string, unknown>;
  id?: string;
}

interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
  properties?: Record<string, unknown>;
}

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
  >; // Coordinate type
  sw: z.ZodOptional<
    z.ZodObject<{
      latitude: z.ZodNumber;
      longitude: z.ZodNumber;
    }>
  >; // Coordinate type
  isochroneDatasetName: z.ZodOptional<z.ZodString>;
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
    latitude?: number;
    longitude?: number;
    radius?: number;
  };
  near?: string;
  result?: string;
  geojson?: string;
  error?: string;
};

export type PlaceSearchAdditionalData = {
  query: string;
  location?: {
    latitude?: number;
    longitude?: number;
    radius?: number;
  };
  near?: string;
  datasetName: string;
  geojson?: GeoJSONFeatureCollection;
  [datasetName: string]: unknown;
};

export type ExecutePlaceSearchResult = {
  llmResult: PlaceSearchLlmResult;
  additionalData?: PlaceSearchAdditionalData;
};

/**
 * Transforms place search results into GeoJSON format
 * @param places - Array of place objects from Foursquare API
 * @param searchMetadata - Optional metadata about the search
 * @returns GeoJSON FeatureCollection
 */
function transformPlacesToGeoJSON(
  places: PlaceSearchResult[],
  searchMetadata?: PlaceSearchMetadata
): GeoJSONFeatureCollection {
  const features: GeoJSONFeature[] = places.map((place) => ({
    type: 'Feature',
    id: place.id,
    geometry: {
      type: 'Point',
      coordinates: [place.location.longitude, place.location.latitude],
    },
    properties: {
      id: place.id,
      name: place.name,
      address: place.location.address,
      city: place.location.city,
      state: place.location.state,
      country: place.location.country,
      postalCode: place.location.postalCode,
      categories: place.categories,
      chains: place.chains,
      distance: place.distance,
      phone: place.phone,
      website: place.website,
      rating: place.rating,
      price: place.price,
      hours: place.hours,
      description: place.description,
      email: place.email,
      attributes: place.attributes,
      photos: place.photos,
      popularity: place.popularity,
      verified: place.verified,
      socialMedia: place.socialMedia,
      stats: place.stats,
      tastes: place.tastes,
      tips: place.tips,
      dateCreated: place.dateCreated,
      dateRefreshed: place.dateRefreshed,
      dateClosed: place.dateClosed,
      extendedLocation: place.extendedLocation,
      hoursPopular: place.hoursPopular,
      link: place.link,
      menu: place.menu,
      placemakerUrl: place.placemakerUrl,
      storeId: place.storeId,
      relatedPlaces: place.relatedPlaces,
    },
  }));

  return {
    type: 'FeatureCollection',
    features,
    properties: {
      searchMetadata,
      totalFeatures: features.length,
      generatedAt: new Date().toISOString(),
    },
  };
}

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
  description: 'Search for places using the Foursquare Places API.',
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
    isochroneDatasetName: z
      .string()
      .describe('Dataset name of the isochrone GeoJSON')
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
        isochroneDatasetName,
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
      console.log('  - isochroneDatasetName:', isochroneDatasetName);
      console.log('  - super_venue_id:', super_venue_id);

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

      // Check if rectangular bounds are provided
      const hasRectangularBounds = ne && sw;

      // Set limit based on search type
      const effectiveLimit = hasRectangularBounds ? 50 : limit || 10;
      url.searchParams.set('limit', effectiveLimit.toString());

      // Add sort parameter
      if (sort) url.searchParams.set('sort', sort);

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
      } 

      // Add location parameters based on search type
      if (hasRectangularBounds) {
        // When using rectangular bounds, don't pass latitude, longitude, and radius
        url.searchParams.set('ne', `${ne.latitude},${ne.longitude}`);
        url.searchParams.set('sw', `${sw.latitude},${sw.longitude}`);
      } else if (isochroneDatasetName && 'getGeometries' in options.context) {
        // Add rectangular bounds from polygon if no explicit bounds provided
        // use the polygon to get ne and sw
        const { getGeometries } = options.context;
        const polygonGeoJSON = await getGeometries?.(isochroneDatasetName);
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
                // Handle both Polygon and MultiPolygon coordinates
                const allCoordinates =
                  feature.geometry.type === 'Polygon'
                    ? coordinates
                    : coordinates.flat();

                allCoordinates.forEach((ring) => {
                  ring.forEach((coordinate) => {
                    const [longitude, latitude] = coordinate;
                    if (latitude > (ne?.latitude ?? -Infinity)) {
                      ne = { latitude, longitude };
                    }
                    if (latitude < (sw?.latitude ?? Infinity)) {
                      sw = { latitude, longitude };
                    }
                  });
                });
              }
            }
            if (ne && sw) {
              // url.searchParams.set('ne', `${ne.latitude},${ne.longitude}`);
              // url.searchParams.set('sw', `${sw.latitude},${sw.longitude}`);
              // Set limit to 50 for polygon-derived rectangular search
              url.searchParams.set('limit', '50');
              // set the radius to larger one so that all the places are included
              url.searchParams.set('radius', '10000');
              url.searchParams.set('order', 'distance');
            }
          }
        }
      }
      // else {
      //   // Default to latitude, longitude, and radius when no rectangular bounds
      //   if (location) {
      //     // Use the new ll parameter format: "latitude,longitude"
      //     url.searchParams.set(
      //       'll',
      //       `${location.latitude},${location.longitude}`
      //     );
      //     // Set default radius to 1000 meters if not provided
      //     const radius = location.radius ?? 1000;
      //     url.searchParams.set('radius', radius.toString());
      //     console.log('  📍 Added location parameters:');
      //     console.log(
      //       '    - ll:',
      //       `${location.latitude},${location.longitude}`
      //     );
      //     console.log('    - radius:', radius);
      //   } else if (near) {
      //     url.searchParams.set('near', near);
      //     console.log('  📍 Added near parameter:', near);
      //   } else {
      //     console.log('  ⚠️  No location parameters provided');
      //   }
      // }

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

      // Sort the data.results by distance
      data.results.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));

      if (!data.results || data.results.length === 0) {
        return {
          llmResult: {
            success: false,
            error: 'No places found matching the search criteria',
          },
        };
      }

      console.log('fsq_place_id: ', data.results[0].fsq_place_id);

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

      // Transform to GeoJSON format
      const geojsonData = transformPlacesToGeoJSON(placesData, {
        query,
        location,
        near,
        categories,
        chains,
        exclude_chains,
        exclude_all_chains,
        min_price,
        max_price,
        open_at,
        open_now,
        sort,
      });

      return {
        llmResult: {
          success: true,
          datasetName: outputDatasetName,
          query,
          ...(location && { location }),
          ...(near && { near }),
          result: `Successfully searched for places using the Foursquare Places API. The GeoJSON data has been saved with the dataset name: ${outputDatasetName}.`,
        },
        additionalData: {
          query: query || '',
          ...(location && { location }),
          ...(near && { near }),
          datasetName: outputDatasetName,
          [outputDatasetName]: {
            type: 'geojson',
            content: geojsonData,
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

// Export GeoJSON types and transformation function for use by other tools
export type { GeoJSONPoint, GeoJSONFeature, GeoJSONFeatureCollection };
export { transformPlacesToGeoJSON };
