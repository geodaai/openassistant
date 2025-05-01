import { tool } from '@openassistant/core';
import { z } from 'zod';
import { generateId, cacheData } from './utils';
import { FeatureCollection } from 'geojson';

interface MapboxIsochroneResponse {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: {
      contour: number;
      color: string;
      opacity: number;
      fill: string;
      'fill-opacity': number;
      fillColor: string;
      fillOpacity: number;
      metric: 'time' | 'distance';
    };
    geometry: {
      type: 'Polygon' | 'LineString';
      coordinates: number[][][];
    };
  }>;
}

export const isochrone = tool<
  // tool parameters
  z.ZodObject<{
    origin: z.ZodObject<{
      longitude: z.ZodNumber;
      latitude: z.ZodNumber;
    }>;
    timeLimit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    distanceLimit: z.ZodOptional<z.ZodNumber>;
    profile: z.ZodOptional<
      z.ZodDefault<z.ZodEnum<['driving', 'walking', 'cycling']>>
    >;
    polygons: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
  }>,
  // llm result
  ExecuteIsochroneResult['llmResult'],
  // additional data
  ExecuteIsochroneResult['additionalData'],
  // context
  IsochroneToolContext
>({
  description:
    'Get isochrone polygons showing reachable areas within a given time limit from a starting point using Mapbox Isochrone API',
  parameters: z.object({
    origin: z.object({
      longitude: z.number().describe('The longitude of the origin point'),
      latitude: z.number().describe('The latitude of the origin point'),
    }),
    timeLimit: z
      .number()
      .describe('The time limit in minutes for the isochrone')
      .default(10)
      .optional(),
    distanceLimit: z
      .number()
      .describe('The distance limit in meters for the isochrone')
      .optional(),
    profile: z
      .enum(['driving', 'walking', 'cycling'])
      .describe('The routing profile to use')
      .default('driving')
      .optional(),
    polygons: z
      .boolean()
      .describe('Whether to return the contours as polygons or linestrings')
      .default(true)
      .optional(),
  }),
  execute: async (args, options): Promise<ExecuteIsochroneResult> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    try {
      const {
        origin,
        timeLimit = 10,
        distanceLimit,
        profile = 'driving',
        polygons = true,
      } = args;
      const { longitude: originLon, latitude: originLat } = origin;

      // Generate cache key
      const cacheKey = generateId();
      const mapboxAccessToken = options.context.getMapboxToken();

      // Build Mapbox API URL
      let url = `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${originLon},${originLat}?`;

      if (timeLimit) {
        url += `contours_minutes=${timeLimit}`;
      } else if (distanceLimit) {
        url += `contours_meters=${distanceLimit}`;
      }

      url += `&polygons=${polygons}&access_token=${mapboxAccessToken}`;

      // Call Mapbox API if not in cache
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      const data = (await response.json()) as MapboxIsochroneResponse;

      if (!data.features || data.features.length === 0) {
        return {
          llmResult: {
            success: false,
            error: 'Failed to get isochrone information from Mapbox',
          },
        };
      }

      // Transform Mapbox response to match our expected format
      const isochroneData = {
        polygons: data.features.map((feature) => ({
          time: feature.properties.contour,
          distance: feature.properties.contour,
          geometry: {
            type: 'Polygon' as const,
            coordinates: feature.geometry.coordinates,
          },
        })),
      };

      const isochroneGeojson: FeatureCollection = {
        type: 'FeatureCollection',
        features: isochroneData.polygons.map((polygon) => ({
          type: 'Feature',
          geometry: polygon.geometry,
          properties: {},
        })),
      };

      // Cache the isochrone data
      cacheData(cacheKey, isochroneGeojson);

      return {
        llmResult: {
          success: true,
          result: {
            datasetName: cacheKey,
            polygons: isochroneData.polygons,
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
          },
        },
        additionalData: {
          origin: origin,
          isochrone: isochroneData,
          cacheId: cacheKey,
        },
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          llmResult: {
            success: false,
            error: 'Isochrone request timeout',
          },
        };
      }
      throw error;
    }
  },
  context: {
    getMapboxToken: () => {
      throw new Error('getMapboxToken not implemented.');
    },
  },
});

export type IsochroneTool = typeof isochrone;

export type IsochroneToolContext = {
  getMapboxToken: () => string;
};

type ExecuteIsochroneResult = {
  llmResult: {
    success: boolean;
    result?: {
      datasetName: string;
      polygons: Array<{
        time: number;
        distance: number;
        geometry: GeoJSON.Polygon;
      }>;
      origin: GeoJSON.FeatureCollection;
    };
    error?: string;
  };
  additionalData?: {
    origin: {
      longitude: number;
      latitude: number;
    };
    isochrone: {
      polygons: Array<{
        time: number;
        distance: number;
        geometry: GeoJSON.Polygon;
      }>;
    };
    cacheId: string;
  };
};
