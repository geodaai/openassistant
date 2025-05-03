import { tool } from '@openassistant/utils';
import { z } from 'zod';
import { generateId, cacheData } from './utils';

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

export function isRoutingToolContext(context: unknown): context is RoutingToolContext {
  return typeof context === 'object' && context !== null && 'getMapboxToken' in context;
}

export const routing = tool<
  // tool parameters
  z.ZodObject<{
    origin: z.ZodObject<{
      longitude: z.ZodNumber;
      latitude: z.ZodNumber;
    }>;
    destination: z.ZodObject<{
      longitude: z.ZodNumber;
      latitude: z.ZodNumber;
    }>;
    mode: z.ZodOptional<z.ZodEnum<['driving', 'walking', 'cycling']>>;
  }>,
  // llm result
  ExecuteRoutingResult['llmResult'],
  // additional data
  ExecuteRoutingResult['additionalData'],
  // context
  RoutingToolContext
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
      if (!options?.context || !isRoutingToolContext(options.context)) {
        throw new Error('Context is required and must implement RoutingToolContext');
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

      // Cache the route data
      cacheData(cacheKey, {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: route.geometry,
            properties: {},
          },
        ],
      });

      return {
        llmResult: {
          success: true,
          result: {
            datasetName: cacheKey,
            distance: route.distance,
            duration: route.duration,
            geometry: route.geometry,
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

type ExecuteRoutingResult = {
  llmResult: {
    success: boolean;
    result?: {
      datasetName: string;
      distance: number;
      duration: number;
      geometry: GeoJSON.LineString;
      origin: GeoJSON.FeatureCollection;
      destination: GeoJSON.FeatureCollection;
    };
    error?: string;
  };
  additionalData?: {
    origin: {
      longitude: number;
      latitude: number;
    };
    destination: {
      longitude: number;
      latitude: number;
    };
    route: {
      distance: number;
      duration: number;
      geometry: GeoJSON.LineString;
      legs: Array<MapboxLeg>;
    };
    cacheId: string;
  };
};
