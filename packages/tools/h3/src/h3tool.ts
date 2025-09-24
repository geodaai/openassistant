import { ToolExecutionOptions } from '@openassistant/utils';
import {
  cellToChildren,
  getResolution,
  latLngToCell,
  polygonToCells,
} from 'h3-js';
import z from 'zod';
import { FeatureCollection } from 'geojson';

export type OpenAssistantTool = {
  description: string;
  parameters: z.ZodTypeAny;
  execute: (
    args: Record<string, unknown>,
    options: ToolExecutionOptions & { context?: unknown }
  ) => Promise<{
    llmResult: unknown;
    additionalData?: unknown;
  }>;
  context?: unknown;
  component?: React.ElementType;
  onToolCompleted?: (toolCallId: string, additionalData?: unknown) => void;
};

// A generic, typed variant of OpenAssistantTool that narrows parameters, context and return types
export type TypedOpenAssistantTool<
  PARAMETERS extends z.ZodTypeAny,
  RETURN_TYPE,
  ADDITIONAL_DATA = unknown,
  CONTEXT = unknown,
> = Omit<OpenAssistantTool, 'parameters' | 'execute' | 'context'> & {
  parameters: PARAMETERS;
  execute: (
    args: z.infer<PARAMETERS>,
    options: ToolExecutionOptions & { context?: CONTEXT }
  ) => Promise<{
    llmResult: RETURN_TYPE;
    additionalData?: ADDITIONAL_DATA;
  }>;
  context?: CONTEXT;
};

// Schema strictly guarding the allowed parameters for the h3Cell tool
const h3CellParameters = z
  .object({
    latitude: z.number(),
    longitude: z.number(),
    resolution: z.number(),
  })
  .strict();

type H3CellParams = z.infer<typeof h3CellParameters>;
type H3CellReturn = string;
type H3CellAdditionalData = { cell: string };


export const h3Cell: TypedOpenAssistantTool<
  typeof h3CellParameters,
  H3CellReturn,
  H3CellAdditionalData
> = {
  description: 'Get the H3 cell for a given latitude, longitude and resolution',
  parameters: h3CellParameters,
  execute: async (args: H3CellParams, _options) => {
    void _options;
    const { latitude, longitude, resolution } = args;
    const cell = latLngToCell(latitude, longitude, resolution);
    return {
      llmResult: cell,
      additionalData: {
        cell,
      },
    };
  },
};

export const h3CellToChildren: OpenAssistantTool = {
  description: 'Get the children of a given H3 cell',
  parameters: z.object({
    cell: z.string(),
  }),
  execute: async (args) => {
    const { cell } = args as { cell: string };
    // get current resolution of given cell
    const resolution = getResolution(cell);
    // get children at resolution + 1
    const children = cellToChildren(cell, resolution + 1);

    return {
      llmResult: children,
      additionalData: {
        children,
      },
    };
  },
};

export const h3CellsFromPolygon: OpenAssistantTool = {
  description:
    'Get the H3 cells for a given polygon geojson at a given resolution',
  parameters: z.object({
    polygonDatasetName: z.string(),
    resolution: z.number(),
  }),
  execute: async (args, options) => {
    try {
      const { polygonDatasetName, resolution } = args as {
        polygonDatasetName: string;
        resolution: number;
      };
      const { getGeometries } = options.context as {
        getGeometries: (datasetName: string) => Promise<FeatureCollection[]>;
      };
      const featureCollections = await getGeometries(polygonDatasetName);

      if (!featureCollections) {
        return {
          llmResult: {
            success: false,
            result: `No geometries found in ${polygonDatasetName}`,
          },
        };
      }
      const cells: string[] = [];
      for (const featureCollection of featureCollections) {
        const features = featureCollection.features;
        for (const feature of features) {
          // Build an array of polygon coordinate sets (supports Polygon and MultiPolygon)
          let coordsParts: number[][][][] = [];
          if (feature.geometry.type === 'Polygon') {
            coordsParts = [feature.geometry.coordinates as number[][][]];
          } else if (feature.geometry.type === 'MultiPolygon') {
            coordsParts = feature.geometry.coordinates as number[][][][];
          }
          for (const part of coordsParts) {
            const isGeoJson = true;
            // part is a single polygon: number[][][] in GeoJSON order
            const cellsForFeature = polygonToCells(part, resolution, isGeoJson);
            cells.push(...cellsForFeature);
          }
        }
      }

      return {
        llmResult: cells,
        additionalData: { cells },
      };
    } catch (error) {
      return {
        llmResult: {
          success: false,
          result: `Error getting H3 cells from polygon: ${error}`,
        },
      };
    }
  },
};
