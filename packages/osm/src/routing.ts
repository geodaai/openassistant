import { z } from 'zod';
import { FeatureCollection } from 'geojson';
import { generateId, cacheData, tool } from '@openassistant/utils';
import { isOsmToolContext, OsmToolContext } from './register-tools';

type MapboxStep = {
  distance: number;
  duration: number;
  geometry: {
    coordinates: [number, number][];
  };
  name: string;
  mode: string;
  maneuver: {
    location: [number, number];
    bearing_before: number;
    bearing_after: number;
    type: string;
    modifier?: string;
  };
};

type MapboxLeg = {
  distance: number;
  duration: number;
  steps: MapboxStep[];
};

type MapboxRoute = {
  distance: number;
  duration: number;
  geometry: {
    coordinates: [number, number][];
  };
  legs: MapboxLeg[];
};

type MapboxResponse = {
  routes: MapboxRoute[];
  message?: string;
};

export type RoutingFunctionArgs = z.ZodObject<{
  origin: z.ZodObject<{
    longitude: z.ZodNumber;
    latitude: z.ZodNumber;
  }>;
  destination: z.ZodObject<{
    longitude: z.ZodNumber;
    latitude: z.ZodNumber;
  }>;
  mode: z.ZodOptional<z.ZodEnum<['driving', 'walking', 'cycling']>>;
}>;

export type RoutingLlmResult = {
  success: boolean;
  result?: {
    datasetName: string;
    distance: number;
    duration: number;
    geojson: GeoJSON.FeatureCollection;
    origin: GeoJSON.FeatureCollection;
    destination: GeoJSON.FeatureCollection;
    steps?: Array<{
      distance: number;
      duration: number;
      geometry: GeoJSON.LineString;
      name: string;
      mode: string;
      maneuver: {
        location: [number, number];
        bearing_before: number;
        bearing_after: number;
        type: string;
        modifier?: string;
      };
    }>;
  };
  error?: string;
};

export type RoutingAdditionalData = {
  origin: {
    longitude: number;
    latitude: number;
  };
  destination: {
    longitude: number;
    latitude: number;
  };
  mode: string;
  route: MapboxRoute;
  cacheId: string;
};

export type ExecuteRoutingResult = {
  llmResult: RoutingLlmResult;
  additionalData?: RoutingAdditionalData;
};

/**
 * Routing Tool
 *
 * This tool calculates routes between two points using Mapbox's Directions API.
 * It supports different transportation modes (driving, walking, cycling) and returns
 * detailed route information including distance, duration, and turn-by-turn directions.
 *
 * :::tip
 * If you don't know the coordinates of the origin or destination point, you can use the geocoding tool to get it.
 * :::
 *
 * Example user prompts:
 * - "Find the driving route from Times Square to Central Park"
 * - "How do I walk from the Eiffel Tower to the Louvre?"
 * - "Get cycling directions from my current location to the nearest coffee shop"
 *
 * Example code:
 * ```typescript
 * import { getOsmTool, OsmToolNames } from "@openassistant/osm";
 *
 * const geocodingTool = getOsmTool(OsmToolNames.geocoding);
 * const routingTool = getOsmTool(OsmToolNames.routing, {
 *   toolContext: {
 *     getMapboxToken: () => process.env.MAPBOX_TOKEN!,
 *   },
 * });
 *
 * streamText({
 *   model: openai('gpt-4o'),
 *   prompt: 'Find the driving route from Times Square to Central Park',
 *   tools: {
 *     geocoding: geocodingTool,
 *     routing: routingTool,
 *   },
 * });
 * ```
 *
 * For a more complete example, see the [OSM Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_osm_example).
 */
export const routing = tool<
  RoutingFunctionArgs,
  RoutingLlmResult,
  RoutingAdditionalData,
  OsmToolContext
>({
  description:
    'Get routing directions between two coordinates using Mapbox Directions API',
  parameters: z.object({
    origin: z.object({
      longitude: z.number().describe('The longitude of the origin point'),
      latitude: z.number().describe('The latitude of the origin point'),
    }),
    destination: z.object({
      longitude: z.number().describe('The longitude of the destination point'),
      latitude: z.number().describe('The latitude of the destination point'),
    }),
    mode: z
      .enum(['driving', 'walking', 'cycling'])
      .describe('The mode of the routing')
      .optional(),
  }),
  execute: async (args, options): Promise<ExecuteRoutingResult> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    try {
      const { origin, destination, mode = 'driving' } = args;
      const { longitude: originLon, latitude: originLat } = origin;
      const { longitude: destLon, latitude: destLat } = destination;

      // Generate cache key
      const cacheKey = generateId();
      if (!options?.context || !isOsmToolContext(options.context)) {
        throw new Error(
          'Context is required and must implement OsmToolContext'
        );
      }
      const mapboxAccessToken = options.context.getMapboxToken();

      // Using Mapbox Directions API
      const url = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${originLon},${originLat};${destLon},${destLat}?geometries=geojson&access_token=${mapboxAccessToken}`;

      // Call Mapbox API if not in cache
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      const data = (await response.json()) as MapboxResponse;

      if (data.message) {
        return {
          llmResult: {
            success: false,
            error:
              data.message || 'Failed to get routing information from Mapbox',
          },
        };
      }

      // Transform Mapbox response to match our expected format
      const route = {
        distance: data.routes[0].distance,
        duration: data.routes[0].duration,
        geometry: {
          type: 'LineString' as const,
          coordinates: data.routes[0].geometry.coordinates,
        },
        legs: data.routes[0].legs.map((leg: MapboxLeg) => ({
          distance: leg.distance,
          duration: leg.duration,
          steps: leg.steps.map((step: MapboxStep) => ({
            distance: step.distance,
            duration: step.duration,
            geometry: {
              type: 'LineString' as const,
              coordinates: step.geometry.coordinates,
            },
            name: step.name,
            mode: mode,
            maneuver: {
              location: step.maneuver.location,
              bearing_before: step.maneuver.bearing_before,
              bearing_after: step.maneuver.bearing_after,
              type: step.maneuver.type,
              modifier: step.maneuver.modifier,
            },
          })),
        })),
      };

      const geojson: FeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: route.geometry,
            properties: {},
          },
        ],
      };

      // Cache the route data
      cacheData(cacheKey, geojson);

      return {
        llmResult: {
          success: true,
          result: {
            datasetName: cacheKey,
            distance: route.distance,
            duration: route.duration,
            geojson,
            origin: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [originLon, originLat],
                  },
                  properties: {},
                },
              ],
            },
            destination: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [destLon, destLat],
                  },
                  properties: {},
                },
              ],
            },
          },
        },
        additionalData: {
          origin: origin,
          destination: destination,
          route,
          cacheId: cacheKey,
          mode,
        },
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          llmResult: {
            success: false,
            error: 'Routing request timeout',
          },
        };
      }
      throw error;
    }
  },
  context: {
    getMapboxToken: () => {
      throw new Error('getMapboxToken() not implemented.');
    },
  },
});

export type RoutingTool = typeof routing;

export type RoutingToolContext = {
  getMapboxToken: () => string;
};
