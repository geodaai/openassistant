// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { extendedTool, getBoundsFromGeoJSON } from '@openassistant/utils';
import { z } from 'zod';

import { isMapToolContext, MapToolContext } from '../register-tools';

export type LeafletToolLlmResult = {
  success: boolean;
  error?: string;
  details?: string;
};

export type LeafletToolAdditionalData = {
  datasetName: string;
  colorBy?: string;
  colorType?: 'breaks' | 'unique';
  breaks?: number[];
  colors?: string[];
  valueColorMap?: Record<string | number, string>;
  geoJsonData: GeoJSON.FeatureCollection;
  mapBounds: [[number, number], [number, number]];
  zoom: number;
};

export type LeafletToolArgs = z.ZodObject<{
  datasetName: z.ZodString;
  colorBy: z.ZodOptional<z.ZodString>;
  colorType: z.ZodOptional<z.ZodEnum<['breaks', 'unique']>>;
  breaks: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
  uniqueValues: z.ZodOptional<
    z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>>
  >;
  colors: z.ZodOptional<z.ZodArray<z.ZodString>>;
}>;

/**
 * The leaflet tool is used to create a leaflet map from GeoJSON data.
 *
 * :::note
 * This tool should be used in Browser environment.
 * :::
 *
 * ### Example
 * ```ts
 * import { leaflet, LeafletTool } from '@openassistant/map';
 * import { convertToVercelAiTool, ToolCache } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * const leafletTool: LeafletTool = {
 *   ...leaflet,
 *   context: {
 *     getDataset: async (datasetName) => {
 *       return YOUR_DATASET;
 *     },
 *   },
 * };
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Create a leaflet map using the dataset "my_venues"',
 *   tools: {createMap: convertToVercelAiTool(leafletTool)},
 * });
 * ```
 *
 * :::tip
 * You can use the `downloadMapData` tool with the `leaflet` tool to download a dataset from a geojson from a url and use it to create a map.
 * :::
 *
 * ### Example
 * ```ts
 * import { downloadMapData, isDownloadMapAdditionalData, leaflet, LeafletTool } from '@openassistant/map';
 * import { convertToVercelAiTool, ToolCache } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * const toolResultCache = ToolCache.getInstance();
 *
 * const downloadMapTool = {
 *   ...downloadMapData,
 *   onToolCompleted: (toolCallId: string, additionalData?: unknown) => {
 *     toolResultCache.addDataset(toolCallId, additionalData);
 *   },
 * };
 *
 * const leafletTool: LeafletTool = {
 *   ...leaflet,
 *   context: {
 *     getDataset: async (datasetName) => {
 *       // find dataset based on datasetName first
 *       // return MYDATASETS[datasetName];
 *
 *       // if no dataset is found, check if dataset is in toolResultCache
 *       if (toolResultCache.hasDataset(datasetName)) {
 *         return toolResultCache.getDataset(datasetName);
 *       }
 *       throw new Error(`Dataset ${datasetName} not found`);
 *     },
 *   },
 * };
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Create a leaflet map using the dataset "my_venues"',
 *   tools: {createMap: convertToVercelAiTool(leafletTool), downloadMapData: convertToVercelAiTool(downloadMapTool)},
 * });
 * ```
 */
export const leaflet = extendedTool<
  LeafletToolArgs,
  LeafletToolLlmResult,
  LeafletToolAdditionalData,
  MapToolContext
>({
  description: `Create a leaflet map from GeoJSON data. For basic map visualization, you can omit color related parameters.
- When creating a map for a variable, please use dataClassify tool to classify the data into bins or unique values first.
- Colors are required when colorBy is provided (e.g. ['#f7fcb9', '#addd8e', '#31a354'].
- For colorType 'breaks', the number of colors must equal to the number of breaks + 1.
- For colorType 'unique', the number of colors must equal to the number of unique values. Please try to use colorbrewer divergent colors (e.g. BrBG).
- Please use colorBrewer colors (e.g. YlGn) if user does not provide colors.
`,
  parameters: z.object({
    datasetName: z.string(),
    colorBy: z.string().optional(),
    colorType: z.enum(['breaks', 'unique']).optional(),
    breaks: z.array(z.number()).optional(),
    uniqueValues: z.array(z.union([z.string(), z.number()])).optional(),
    colors: z.array(z.string()).optional(),
  }),
  execute: async (
    { datasetName, colorBy, colorType, breaks, uniqueValues, colors },
    options
  ) => {
    try {
      const context = options?.context;
      if (!isMapToolContext(context)) {
        throw new Error('Tool context is required');
      }
      const { getGeometries, getDataset } = context;

      let dataContent;

      if (getDataset) {
        const dataset = await getDataset(datasetName);
        // in case the dataset is from the ToolCache
        if (
          typeof dataset === 'object' &&
          dataset !== null &&
          'type' in dataset &&
          'content' in dataset
        ) {
          dataContent = dataset.content;
        } else {
          dataContent = dataset;
        }
      }

      if (!dataContent && getGeometries) {
        // get dataContent from previous tool call
        dataContent = await getGeometries(datasetName);
      }

      if (!dataContent) {
        throw new Error(
          'getDataset() or getGeometries() of leaflet tool is not implemented'
        );
      }

      // check if dataContent is GeoJSON
      if (
        dataContent.type !== 'FeatureCollection' &&
        dataContent.type !== 'Feature'
      ) {
        // check if dataContent is an array of GeoJSON features
        if (
          Array.isArray(dataContent) &&
          dataContent.every((feature) => feature.type === 'Feature')
        ) {
          dataContent = {
            type: 'FeatureCollection',
            features: dataContent,
          };
        } else {
          throw new Error('Data is not GeoJSON');
        }
      }

      const geoJsonData = dataContent as GeoJSON.FeatureCollection;

      // get mapBounds (LatLngTuple for southWest and northEast) from geoJsonData
      const { bounds, zoom } = getBoundsFromGeoJSON(geoJsonData);

      // TODO: Add GeoJSON layer with styling based on getColor function

      return {
        llmResult: {
          success: true,
          details: `Map created successfully with dataset: ${datasetName}`,
        },
        additionalData: {
          datasetName,
          colorBy,
          colorType,
          breaks,
          colors,
          uniqueValues,
          geoJsonData,
          mapBounds: bounds,
          zoom,
        },
      };
    } catch (error) {
      return {
        llmResult: {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },
  context: {},
});
