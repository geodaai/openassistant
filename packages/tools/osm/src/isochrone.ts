import { z } from 'zod';
import { generateId, extendedTool } from '@openassistant/utils';
import { FeatureCollection } from 'geojson';
import { isMapboxToolContext, MapboxToolContext } from './register-tools';
import { mapboxRateLimiter } from './utils/rateLimiter';

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

export type IsochroneFunctionArgs = z.ZodObject<{
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
}>;

export type IsochroneLlmResult = {
  success: boolean;
  datasetName?: string;
  timeLimit?: number;
  distanceLimit?: number;
  result?: string;
  origin?: {
    longitude: number;
    latitude: number;
  };
  error?: string;
};

export type IsochroneAdditionalData = {
  origin: {
    longitude: number;
    latitude: number;
  };
  timeLimit?: number;
  distanceLimit?: number;
  datasetName: string;
  [datasetName: string]: unknown;
};

export type ExecuteIsochroneResult = {
  llmResult: IsochroneLlmResult;
  additionalData?: IsochroneAdditionalData;
};

/**
 * Isochrone Tool
 *
 * This tool generates isochrone polygons showing reachable areas within a given time or distance limit
 * from a starting point using Mapbox's Isochrone API. It supports different transportation modes
 * and can return either polygons or linestrings.
 *
 * :::tip
 * If you don't know the coordinates of the origin point, you can use the geocoding tool to get it.
 * :::
 *
 * Example user prompts:
 * - "Show me all areas reachable within 15 minutes of Times Square by car"
 * - "What areas can I reach within 2km of the Eiffel Tower on foot?"
 * - "Generate isochrones for a 30-minute cycling radius from Central Park"
 *
 * @example
 * ```typescript
 * import { getOsmTool, OsmToolNames } from "@openassistant/osm";
 *
 * const geocodingTool = getOsmTool(OsmToolNames.geocoding);
 * const isochroneTool = getOsmTool(OsmToolNames.isochrone, {
 *   toolContext: {
 *     getMapboxToken: () => process.env.MAPBOX_TOKEN!,
 *   },
 * });
 *
 * streamText({
 *   model: openai('gpt-4o'),
 *   prompt: 'What areas can I reach within 2km of the Eiffel Tower on foot?',
 *   tools: {
 *     isochrone: isochroneTool,
 *   },
 * });
 * ```
 *
 * For a more complete example, see the [OSM Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_osm_example).
 */
export const isochrone = extendedTool<
  IsochroneFunctionArgs,
  IsochroneLlmResult,
  IsochroneAdditionalData,
  MapboxToolContext
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

      // Generate output dataset name
      const outputDatasetName = `isochrone_${generateId()}`;

      if (!options?.context || !isMapboxToolContext(options.context)) {
        throw new Error(
          'Context is required and must implement OsmToolContext'
        );
      }
      const mapboxAccessToken = options.context.getMapboxToken();

      // Use the global rate limiter before making the API call
      await mapboxRateLimiter.waitForNextCall();

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

      return {
        llmResult: {
          success: true,
          datasetName: outputDatasetName,
          origin: { longitude: originLon, latitude: originLat },
          ...(timeLimit && { timeLimit }),
          ...(distanceLimit && { distanceLimit }),
          result: `Successfully generated isochrone polygons for the origin point. The GeoJSON data has been saved with the dataset name: ${outputDatasetName}.`,
        },
        additionalData: {
          origin: origin,
          ...(timeLimit && { timeLimit }),
          ...(distanceLimit && { distanceLimit }),
          datasetName: outputDatasetName,
          [outputDatasetName]: isochroneGeojson,
        },
      };
    } catch (error) {
      clearTimeout(timeoutId);
      return {
        llmResult: {
          success: false,
          error: `Failed to generate isochrone polygons: ${error}`,
        },
      };
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
