// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { extendedTool, generateId } from '@openassistant/utils';
import { z } from 'zod';
import {
  Feature,
  Polygon,
  FeatureCollection,
  GeoJsonProperties,
} from 'geojson';
import {
  SpatialGeometry,
  CheckGeometryType,
  SpatialJoinGeometryType,
} from '@geoda/core';
import { bbox } from '@turf/bbox';
import { polygon } from '@turf/helpers';
import { binaryToGeojson } from '@loaders.gl/gis';

import { isSpatialToolContext } from '../utils';
import { SpatialToolContext } from '../types';

export type GridFunctionArgs = z.ZodObject<{
  datasetName: z.ZodOptional<z.ZodString>;
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
  rows: z.ZodNumber;
  columns: z.ZodNumber;
}>;

export type GridLlmResult = {
  success: boolean;
  datasetName: string;
  result: string;
  gridInfo: {
    rows: number;
    columns: number;
    totalCells: number;
    bounds: {
      minX: number;
      minY: number;
      maxX: number;
      maxY: number;
    };
  };
};

export type GridAdditionalData = {
  datasetName?: string;
  mapBounds?: {
    northwest: { longitude: number; latitude: number };
    southeast: { longitude: number; latitude: number };
  };
  [outputDatasetName: string]: unknown;
};

/**
 * Convert SpatialGeometry to GeoJSON FeatureCollection
 */
function spatialGeometryToGeoJSON(
  geometries: SpatialGeometry
): FeatureCollection {
  const geometryType = CheckGeometryType(geometries);

  switch (geometryType) {
    case SpatialJoinGeometryType.BinaryFeatureCollection: {
      // convert binary to geojson and flatten the results
      const features: Feature[] = geometries.flatMap((binary) => {
        const result = binaryToGeojson(binary);
        return Array.isArray(result) ? result : [result];
      });
      return {
        type: 'FeatureCollection',
        features,
      };
    }
    case SpatialJoinGeometryType.GeoJsonFeature: {
      return {
        type: 'FeatureCollection',
        features: geometries as Feature[],
      };
    }
    case SpatialJoinGeometryType.ArcLayerData: {
      // convert {source: [], target: [], index: number} to Feature
      const features: Feature[] = geometries.map((feature) => {
        return {
          type: 'Feature' as const,
          geometry: {
            type: 'LineString' as const,
            coordinates: [feature.source, feature.target],
          },
        } as Feature;
      });
      return {
        type: 'FeatureCollection',
        features,
      };
    }
    case SpatialJoinGeometryType.PointLayerData: {
      const features: Feature[] = geometries.map((feature) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: feature.position,
        },
        properties: {} as GeoJsonProperties,
      }));
      return {
        type: 'FeatureCollection',
        features,
      };
    }
    default:
      throw new Error('Unsupported geometry type for grid generation');
  }
}

/**
 * ## grid Tool
 *
 * This tool creates a grid of polygons that divides a given area into N rows and M columns.
 *
 * ### Grid Creation
 *
 * This tool creates a grid of polygons that divides a given area into
 * N rows and M columns. The grid can be created either from the boundary
 * of a dataset by providing a datasetName, or from the mapBounds of the
 * current map view. It's useful for spatial analysis, creating regular
 * grids for sampling, or dividing areas into equal sections.
 *
 * The tool supports:
 * - Creating grids from the boundary of geometries in a dataset
 * - Creating grids from the current map view bounds (mapBounds)
 * - Customizable number of rows and columns
 * - Returns grid as polygons that can be used for mapping
 *
 * Example user prompts:
 * - "Create a 5x5 grid over this area"
 * - "Divide this region into a 10 by 8 grid"
 * - "Generate a grid with 6 rows and 4 columns for this boundary"
 * - "Create a 3x3 grid for the current map view"
 * - "Make a grid over the counties dataset with 4 rows and 5 columns"
 *
 * Example code:
 * ```typescript
 * import { grid, GridTool } from '@openassistant/geoda';
 * import { convertToVercelAiTool } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * const gridTool: GridTool = {
 *   ...grid,
 *   context: {
 *   getGeometries: (datasetName) => {
 *     return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
 *   },
 *   },
 * },
 *   onToolCompleted: (toolCallId, additionalData) => {
 *     console.log(toolCallId, additionalData);
 *     // do something like save the grid result in additionalData
 *   },
 * };
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Create a 5x5 grid over this area',
 *   tools: {grid: convertToVercelAiTool(gridTool)},
 * });
 * ```
 */
export const grid = extendedTool<
  GridFunctionArgs,
  GridLlmResult,
  GridAdditionalData,
  SpatialToolContext
>({
  description:
    'Create a grid of polygons that divides a map boundary into rows and columns. The map boundary can be the boundary of a given dataset or the current map view bounds.',
  parameters: z.object({
    datasetName: z
      .string()
      .optional()
      .describe(
        'Name of the dataset with boundary geometry to create grid within'
      ),
    mapBounds: z
      .object({
        northwest: z.object({
          longitude: z.number().describe('Longitude of northwest corner'),
          latitude: z.number().describe('Latitude of northwest corner'),
        }),
        southeast: z.object({
          longitude: z.number().describe('Longitude of southeast corner'),
          latitude: z.number().describe('Latitude of southeast corner'),
        }),
      })
      .optional()
      .describe('Map bounds defined by northwest and southeast coordinates'),
    rows: z.number().positive().describe('Number of rows in the grid (N)'),
    columns: z
      .number()
      .positive()
      .describe('Number of columns in the grid (M)'),
  }),
  execute: async (args, options) => {
    const { datasetName, mapBounds, rows, columns } = args;

    if (!options?.context || !isSpatialToolContext(options.context)) {
      throw new Error(
        'Context is required and must implement SpatialToolContext'
      );
    }
    const { getGeometries } = options.context;

    let minX: number, minY: number, maxX: number, maxY: number;

    if (mapBounds) {
      // Use explicit map bounds
      minX = mapBounds.northwest.longitude;
      maxX = mapBounds.southeast.longitude;
      minY = mapBounds.southeast.latitude;
      maxY = mapBounds.northwest.latitude;

      // Ensure proper ordering (in case northwest/southeast are swapped)
      if (minX > maxX) [minX, maxX] = [maxX, minX];
      if (minY > maxY) [minY, maxY] = [maxY, minY];
    } else if (datasetName && getGeometries) {
      // Use dataset bounds
      const geometries = await getGeometries(datasetName);
      if (!geometries) {
        throw new Error('No boundary geometry found');
      }
      const featureCollection = spatialGeometryToGeoJSON(geometries);
      [minX, minY, maxX, maxY] = bbox(featureCollection);
    } else {
      throw new Error(
        'No boundary geometry or map bounds provided. Please provide either datasetName or mapBounds.'
      );
    }

    // Calculate grid cell dimensions
    const cellWidth = (maxX - minX) / columns;
    const cellHeight = (maxY - minY) / rows;

    // Create grid cells
    const gridFeatures: Feature<Polygon>[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const x1 = minX + col * cellWidth;
        const y1 = minY + row * cellHeight;
        const x2 = x1 + cellWidth;
        const y2 = y1 + cellHeight;

        const cellPolygon = polygon(
          [
            [
              [x1, y1],
              [x2, y1],
              [x2, y2],
              [x1, y2],
              [x1, y1],
            ],
          ],
          {
            row: row,
            column: col,
            gridId: `${row}_${col}`,
            bounds: {
              minX: x1,
              minY: y1,
              maxX: x2,
              maxY: y2,
            },
          }
        );

        gridFeatures.push(cellPolygon);
      }
    }

    // Create output dataset
    const outputDatasetName = `grid_${generateId()}`;
    const outputGeojson: FeatureCollection = {
      type: 'FeatureCollection',
      features: gridFeatures,
    };

    const totalCells = rows * columns;
    const bounds = { minX, minY, maxX, maxY };

    return {
      llmResult: {
        success: true,
        result: `Grid created successfully with ${rows} rows and ${columns} columns (${totalCells} total cells). It has been saved in dataset: ${outputDatasetName}`,
        gridInfo: {
          rows,
          columns,
          totalCells,
          bounds,
        },
      },
      additionalData: {
        datasetName: outputDatasetName,
        mapBounds,
        [outputDatasetName]: {
          type: 'geojson',
          content: outputGeojson,
        },
      },
    };
  },
  context: {
    getGeometries: async () => null,
  },
});

export type GridTool = typeof grid;
