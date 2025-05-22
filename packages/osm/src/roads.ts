import { z } from 'zod';
import { tool, generateId, getBoundsFromGeoJSON } from '@openassistant/utils';
import { RateLimiter } from './utils/rateLimiter';
import { cacheData } from './utils';

export type RoadsToolContext = {
  getGeometries: (datasetName: string) => Promise<unknown>;
};

export function isOsmToolContext(context: unknown): context is RoadsToolContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getGeometries' in context
  );
}

// Create a single instance to be shared across all calls
const overpassRateLimiter = new RateLimiter(1000);

// OSM data types
interface OsmNode {
  type: 'node';
  id: number;
  lat: number;
  lon: number;
}

interface OsmWay {
  type: 'way';
  id: number;
  nodes: number[];
  tags: {
    highway?: string;
    name?: string;
    [key: string]: string | undefined;
  };
}

type OsmElement = OsmNode | OsmWay;

interface OsmResponse {
  elements: OsmElement[];
}

export type RoadsFunctionArgs = z.ZodObject<{
  mapBounds: z.ZodOptional<
    z.ZodObject<{
      northwest: z.ZodObject<{
        longitude: z.ZodNumber;
        latitude: z.ZodNumber;
      }>;
      southeast: z.ZodObject<{
        longitude: z.ZodNumber;
        latitude: z.ZodNumber;
      }>;
    }>
  >;
  datasetName: z.ZodOptional<z.ZodString>;
}>;

export type RoadsLlmResult = {
  success: boolean;
  datasetName?: string;
  geojson?: GeoJSON.FeatureCollection;
  result?: string;
  error?: string;
};

export type RoadsAdditionalData = {
  datasetName: string;
  [datasetName: string]: unknown;
};

/**
 * Roads Tool
 *
 * This tool queries OpenStreetMap's Overpass API to fetch road networks based on a boundary and road type.
 * The boundary can be specified as a bounding box (south,west,north,east) or a named area.
 * Road types can be: highway, pedestrian, residential, etc.
 *
 * Example user prompts:
 * - "Get all highways in New York City"
 * - "Find pedestrian paths in Central Park"
 * - "Show me residential roads in San Francisco"
 *
 * @example
 * ```typescript
 * import { getOsmTool, OsmToolNames } from "@openassistant/osm";
 *
 * const roadsTool = getOsmTool(OsmToolNames.roads);
 *
 * streamText({
 *   model: openai('gpt-4'),
 *   prompt: 'Show me all highways in New York City',
 *   tools: {
 *     roads: roadsTool,
 *   },
 * });
 * ```
 */
export const roads = tool<
  RoadsFunctionArgs,
  RoadsLlmResult,
  RoadsAdditionalData,
  RoadsToolContext
>({
  description:
    'Query road networks from OpenStreetMap based on boundary and road type',
  parameters: z.object({
    mapBounds: z
      .object({
        northwest: z
          .object({
            longitude: z.number(),
            latitude: z.number(),
          })
          .describe('Northwest coordinates [longitude, latitude]'),
        southeast: z
          .object({
            longitude: z.number(),
            latitude: z.number(),
          })
          .describe('Southeast coordinates [longitude, latitude]'),
      })
      .optional(),
    datasetName: z
      .string()
      .optional()
      .describe(
        'The name of an existing dataset whose boundary will be used to fetch roads. If provided, this takes precedence over mapBounds.'
      ),
  }),
  execute: async (
    args,
    options
  ): Promise<{
    llmResult: RoadsLlmResult;
    additionalData?: RoadsAdditionalData;
  }> => {
    try {
      const { mapBounds, datasetName } = args;

      let south = mapBounds?.southeast.latitude || 0;
      let east = mapBounds?.southeast.longitude || 0;
      let north = mapBounds?.northwest.latitude || 0;
      let west = mapBounds?.northwest.longitude || 0;

      if (options?.context && isOsmToolContext(options.context)) {
        const context = options.context as RoadsToolContext;
        if (datasetName && context.getGeometries) {
          const geometries = await context.getGeometries(datasetName);
          if (!geometries) {
            throw new Error(`Dataset ${datasetName} not found`);
          }
          // get the boundary of the GeoJSON dataset: [[minLat, minLng], [maxLat, maxLng]]
          const { bounds } = getBoundsFromGeoJSON({
            type: 'FeatureCollection',
            features: geometries as GeoJSON.Feature[],
          });
          const [[minLat, minLng], [maxLat, maxLng]] = bounds;
          // Fix coordinate order for Overpass API (south, west, north, east)
          south = minLat;
          west = minLng;
          north = maxLat;
          east = maxLng;
        }
      }

      // Construct Overpass QL query
      const query = `
        [out:json][timeout:25];
        (
          way[highway~"^(motorway|trunk|primary|secondary|tertiary|unclassified|residential|service|living_street|path|track|road)$"](${south},${west},${north},${east});
        );
        out body;
        >;
        out skel qt;
      `;

      // Use the global rate limiter before making the API call
      await overpassRateLimiter.waitForNextCall();

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
      });

      if (!response.ok) {
        throw new Error(`Overpass API request failed: ${response.statusText}`);
      }

      const data = (await response.json()) as OsmResponse;

      // Create a node lookup map and collect ways in a single pass
      const nodeMap = new Map<number, OsmNode>();
      const ways: OsmWay[] = [];
      
      data.elements.forEach((element) => {
        if (element.type === 'node') {
          nodeMap.set(element.id, element);
        } else if (element.type === 'way') {
          ways.push(element);
        }
      });

      // Convert OSM data to GeoJSON
      const features: GeoJSON.Feature[] = [];
      
      // Process ways in chunks to avoid memory issues
      const CHUNK_SIZE = 1000;
      
      for (let i = 0; i < ways.length; i += CHUNK_SIZE) {
        const end = Math.min(i + CHUNK_SIZE, ways.length);
        const chunkFeatures: GeoJSON.Feature[] = [];
        
        for (let j = i; j < end; j++) {
          const way = ways[j];
          const coordinates = way.nodes.map((nodeId) => {
            const node = nodeMap.get(nodeId);
            if (!node) throw new Error(`Node ${nodeId} not found`);
            return [node.lon, node.lat];
          });

          chunkFeatures.push({
            type: 'Feature' as const,
            geometry: {
              type: 'LineString' as const,
              coordinates,
            },
            properties: {
              id: way.id,
              highway: way.tags.highway,
              name: way.tags.name || 'Unnamed Road',
            },
          });
        }
        features.push(...chunkFeatures);
      }

      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features,
      };

      const outputDatasetName = `roads_${generateId()}`;

      // cache the roads data
      cacheData(outputDatasetName, geojson);

      return {
        llmResult: {
          success: true,
          datasetName: outputDatasetName,
          result: `Successfully retrieved ${features.length} roads. The GeoJSON data has been cached with the dataset name: ${outputDatasetName}.`,
        },
        additionalData: {
          datasetName: outputDatasetName,
        },
      };
    } catch (error) {
      return {
        llmResult: {
          success: false,
          error: `Failed to fetch roads: ${error}`,
        },
      };
    }
  },
});

export type RoadsTool = typeof roads;

export type ExecuteRoadsResult = {
  llmResult: {
    success: boolean;
    result?: GeoJSON.FeatureCollection;
    error?: string;
  };
  additionalData?: {
    boundary: string;
    roadType: string;
    geojson: GeoJSON.FeatureCollection;
  };
};
