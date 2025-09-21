// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistantTool, OpenAssistantToolOptions, getBoundsFromGeoJSON } from '@openassistant/utils';
import { z } from 'zod';

import { isMapToolContext } from '../register-tools';

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

export const LeafletToolArgs = z.object({
  datasetName: z.string(),
  colorBy: z.string().optional(),
  colorType: z.enum(['breaks', 'unique']).optional(),
  breaks: z.array(z.number()).optional(),
  uniqueValues: z.array(z.union([z.string(), z.number()])).optional(),
  colors: z.array(z.string()).optional(),
});

/**
 * LeafletTool
 *
 * The leaflet tool is used to create a leaflet map from GeoJSON data.
 *
 * :::note
 * This tool should be used in Browser environment.
 * :::
 *
 * ### Example
 * ```ts
 * import { LeafletTool } from '@openassistant/map';
 * import { generateText } from 'ai';
 *
 * // Simple usage with defaults
 * const leafletTool = new LeafletTool();
 *
 * // Or with custom context
 * const leafletTool = new LeafletTool(
 *   undefined, // use default description
 *   undefined, // use default parameters
 *   {
 *     getDataset: async (datasetName) => {
 *       return YOUR_DATASET;
 *     },
 *   }
 * );
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Create a leaflet map using the dataset "my_venues"',
 *   tools: {createMap: leafletTool.toVercelAiTool()},
 * });
 * ```
 *
 * :::tip
 * You can use the `downloadMapData` tool with the `leaflet` tool to download a dataset from a geojson from a url and use it to create a map.
 * :::
 *
 * ### Example
 * ```ts
 * import { DownloadMapDataTool, LeafletTool } from '@openassistant/map';
 * import { ToolCache } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * const toolResultCache = ToolCache.getInstance();
 *
 * const downloadMapTool = new DownloadMapDataTool(
 *   undefined, // use default description
 *   undefined, // use default parameters
 *   {}, // context
 *   undefined, // component
 *   (toolCallId: string, additionalData?: unknown) => {
 *     toolResultCache.addDataset(toolCallId, additionalData);
 *   }
 * );
 *
 * const leafletTool = new LeafletTool(
 *   undefined, // use default description
 *   undefined, // use default parameters
 *   {
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
 *   }
 * );
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Create a leaflet map using the dataset "my_venues"',
 *   tools: {createMap: leafletTool.toVercelAiTool(), downloadMapData: downloadMapTool.toVercelAiTool()},
 * });
 * ```
 */
export class LeafletTool extends OpenAssistantTool<typeof LeafletToolArgs> {
  protected readonly defaultDescription = `Create a leaflet map from GeoJSON data. For basic map visualization, you can omit color related parameters.
- When creating a map for a variable, please use dataClassify tool to classify the data into bins or unique values first.
- Colors are required when colorBy is provided (e.g. ['#f7fcb9', '#addd8e', '#31a354'].
- For colorType 'breaks', the number of colors must equal to the number of breaks + 1.
- For colorType 'unique', the number of colors must equal to the number of unique values. Please try to use colorbrewer divergent colors (e.g. BrBG).
- Please use colorBrewer colors (e.g. YlGn) if user does not provide colors.
`;
  protected readonly defaultParameters = LeafletToolArgs;

  constructor(options: OpenAssistantToolOptions<typeof LeafletToolArgs> = {}) {
    super({
      ...options,
      context: options.context || {},
    });
  }

  async execute(
    args: z.infer<typeof LeafletToolArgs>,
    options?: { context?: Record<string, unknown> }
  ): Promise<{
    llmResult: LeafletToolLlmResult;
    additionalData?: LeafletToolAdditionalData;
  }> {
    const { datasetName, colorBy, colorType, breaks, uniqueValues, colors } = args;
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
  }
}
