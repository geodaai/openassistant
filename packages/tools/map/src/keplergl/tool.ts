// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { generateId, OpenAssistantTool } from '@openassistant/utils';
import { z } from 'zod';
import {
  FileCacheItem,
  processFileData,
  ProcessFileDataContent,
} from '@kepler.gl/processors';
import * as arrow from 'apache-arrow';
import { arrowSchemaToFields, sanitizeForJson } from './utils';
import { MapToolContext, isMapToolContext } from '../types';

const keplerGlParameters = z.object({
  datasetName: z.string(),
  geometryColumn: z.string().optional(),
  latitudeColumn: z.string().optional(),
  longitudeColumn: z.string().optional(),
  mapType: z
    .enum(['point', 'line', 'arc', 'geojson'])
    .describe(
      'The kepler.gl map type. Other map types like heatmap, hexbin, h3 are not supported yet.'
    ),
  colorBy: z.string().optional(),
  colorType: z.enum(['breaks', 'unique']).optional(),
  colorMap: z
    .array(
      z.object({
        value: z.union([z.string(), z.number(), z.null()]),
        color: z.string(),
        label: z.string().optional(),
      })
    )
    .optional(),
});

export type KeplerGlToolArgs = z.infer<typeof keplerGlParameters>;

/**
 * ## keplergl Tool
 *
 * This tool is used to create a map using Kepler.gl from a dataset.
 *
 * :::note
 * This tool should be used in Browser environment.
 * :::
 *
 * ### Example
 *
 * ```typescript
 * import { keplergl, KeplerglTool } from '@openassistant/map';
 * import { convertToVercelAiTool } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * const keplerglTool: KeplerglTool = {
 *   ...keplergl,
 *   context: {
 *     getDataset: async (datasetName: string) => {
 *       return YOUR_DATASET;
 *     },
 *   },
 * };
 *
 * generateText({
 *   model: openai('gpt-4.1', { apiKey: key }),
 *   prompt: 'Create a point map using the dataset "my_venues"',
 *   tools: {createMap: convertToVercelAiTool(keplerglTool)},
 * });
 * ```
 *
 * :::tip
 * You can use the `downloadMapData` tool with the `keplergl` tool to download a dataset from a geojson or csv from a url and use it to create a map.
 * :::
 *
 * ### Example
 * ```typescript
 * import { downloadMapData, isDownloadMapAdditionalData, keplergl, KeplerglTool } from '@openassistant/map';
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
 * const keplerglTool: KeplerglTool = {
 *   ...keplergl,
 *   context: {
 *     getDataset: async (datasetName: string) => {
 *       // find dataset based on datasetName
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
 * * generateText({
 *   model: openai('gpt-4.1', { apiKey: key }),
 *   prompt: 'Create a from https://geodacenter.github.io/data-and-lab//data/Chi_Carjackings.geojson',
 *   tools: {
 *     createMap: convertToVercelAiTool(keplerglTool),
 *     downloadMapData: convertToVercelAiTool(downloadMapTool),
 *   },
 * });
 * ```
 */
export const keplergl: OpenAssistantTool<
  typeof keplerGlParameters,
  KeplerGlToolLlmResult,
  KeplerGlToolAdditionalData,
  MapToolContext
> = {
  name: 'keplergl',
  description: `Create a map using kepler.gl. You can create basic maps without color styling, or enhanced maps with color visualization.

For basic maps:
- Simply use datasetName, geometryColumn (if needed), latitudeColumn/longitudeColumn (for point maps), and mapType
- Omit color-related parameters for simple visualization

For colored maps:
- If user requests color visualization, use available columns in the dataset
- Use dataClassify tool to classify data into bins or unique values when needed
- Generate colorBrewer colors automatically if user doesn't specify colors
- For colorType 'breaks': [{value: 3, color: '#f7fcb9'}, {value: 10, color: '#addd8e'}, {value: null, color: '#31a354'}]
- For colorType 'unique': [{value: 'a', color: '#f7fcb9'}, {value: 'b', color: '#addd8e'}, {value: 'c', color: '#31a354'}]

For geojson datasets:
- Use geometryColumn: '_geojson' and mapType: 'geojson' even for point collections

Proceed directly with map creation unless user specifically asks for guidance on variable selection.`,
  parameters: keplerGlParameters,
  execute: executeCreateMap,
  context: {},
};

/**
 * The type of the keplergl tool, which contains the following properties:
 *
 * - description: The description of the tool.
 * - parameters: The parameters of the tool.
 * - execute: The function that will be called when the tool is executed.
 * - context: The context of the tool.
 * - component: The component that will be used to render the tool.
 */
export type KeplerglTool = typeof keplergl;

export type KeplerGlToolLlmResult = {
  success: boolean;
  datasetId?: string;
  geometryColumn?: string;
  latitudeColumn?: string;
  longitudeColumn?: string;
  mapType?: string;
  layerConfig?: Record<string, unknown>;
  layerId?: string;
  details?: string;
  error?: string;
  instruction?: string;
};

/**
 * Function to fetch dataset from DuckDB or other data sources
 * Returns an Arrow Table that can be used directly by Kepler.gl
 */
export type GetDatasetFunction = (tableName: string) => Promise<unknown>;

export type KeplerGlToolAdditionalData = {
  datasetId: string;
  layerId: string;
  geometryColumn?: string;
  latitudeColumn?: string;
  longitudeColumn?: string;
  mapType?: string;
  /** Pre-fetched dataset for Kepler.gl (used for non-Arrow data) */
  datasetForKepler?: FileCacheItem[];
  /** Table name for lazy loading (used when data is an Arrow table) */
  tableName?: string;
  /** Function to fetch dataset lazily - will be injected by the tool user */
  getDataset?: GetDatasetFunction;
  layerConfig?: Record<string, unknown>;
  colorBy?: string;
  colorType?: 'breaks' | 'unique';
  colorMap?: { value: string | number | null; color: string; label?: string }[];
};

export type ExecuteCreateMapResult = {
  llmResult: KeplerGlToolLlmResult;
  additionalData?: KeplerGlToolAdditionalData;
};

export type KeplerglToolArgs = {
  datasetName: string;
  geometryColumn?: string;
  latitudeColumn?: string;
  longitudeColumn?: string;
  mapType?: string;
  colorBy?: string;
  colorType?: 'breaks' | 'unique';
  colorMap?: { value: string | number; color: string }[];
};

export function isKeplerglToolArgs(args: unknown): args is KeplerglToolArgs {
  return typeof args === 'object' && args !== null && 'datasetName' in args;
}

async function executeCreateMap(
  args,
  options
): Promise<ExecuteCreateMapResult> {
  try {
    if (!isMapToolContext(options.context)) {
      throw new Error('Invalid createMap function context.');
    }
    if (!isKeplerglToolArgs(args)) {
      throw new Error('Invalid createMap function args.');
    }
    const {
      datasetName,
      geometryColumn,
      latitudeColumn,
      longitudeColumn,
      mapType,
      colorBy,
      colorType,
      colorMap,
    } = args;
    const { getDataset, getGeometries } = options.context;

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
        `getDataset() or getGeometries() of keplergl tool is not implemented, and failed to get data from ${datasetName}`
      );
    }

    let datasetForKepler: FileCacheItem[] = [];
    let isArrowTable = false;

    // check if dataContent is an Arrow Table
    if (dataContent instanceof arrow.Table) {
      isArrowTable = true;
      // For Arrow tables, we use lazy loading in the component
      // The component will fetch the data directly from DuckDB to avoid serialization issues
      // We still need fields for layer config
      const fields = arrowSchemaToFields(dataContent.schema);

      // Create a minimal dataset info for layer configuration
      // The actual data will be fetched by the component using getDataset
      datasetForKepler = [
        {
          data: {
            fields,
            rows: [],
            cols: [],
            metadata: dataContent.schema.metadata,
          },
          info: {
            id: datasetName,
            label: datasetName,
            format: 'arrow',
          },
        },
      ];
    } else {
      // convert dataContent to ProcessFileDataContent for kepler.gl
      const processDataContent: ProcessFileDataContent = {
        data: dataContent,
        fileName: datasetName,
      };

      datasetForKepler = await processFileData({
        content: processDataContent,
        fileCache: [],
      });
    }

    if (!datasetForKepler || datasetForKepler.length === 0) {
      throw new Error('Dataset not processed correctly.');
    }

    // get fields from the dataset
    const fields = datasetForKepler[0].data.fields;

    const colorField = fields.find((field) => field.name === colorBy);

    // create a dataset id
    const datasetId = `${datasetName}`;

    // update dataId that will be created as kepler.gl's dataset
    datasetForKepler[0].info.id = datasetId;

    const format = datasetForKepler[0].info.format;

    // create a layer id
    const layerId = `layer_${generateId()}`;

    // layerConfig is a JSON object
    const layerConfig = {
      version: 'v1',
      config: {
        visState: {
          layers: [
            {
              id: layerId,
              type: mapType,
              config: {
                dataId: datasetId,
                label: datasetName,
                color: [211, 211, 211],
                columns: {
                  ...(latitudeColumn ? { lat: latitudeColumn } : {}),
                  ...(longitudeColumn ? { lng: longitudeColumn } : {}),
                  ...(geometryColumn && geometryColumn !== '_geojson'
                    ? { geometry: geometryColumn }
                    : {}),
                  ...(format === 'geojson' ? { geojson: '_geojson' } : {}),
                },
                isVisible: true,
                visConfig: {
                  radius: 10,
                  opacity: 0.8,
                  filled: true,
                },
              },
            },
          ],
        },
      },
    };

    if (colorBy) {
      // create kepler.gl's colorMap from uniqueValues and breaks
      const colorScale = colorType === 'breaks' ? 'custom' : 'customOrdinal';
      const colors = colorMap?.map((color) => color.color);
      const keplerColorMap = colorMap?.map((color) => [
        color.value,
        color.color,
      ]);

      layerConfig.config.visState.layers[0].config.visConfig['colorRange'] = {
        name: 'color.customPalette',
        type: 'custom',
        category: 'Custom',
        colors,
        colorMap: keplerColorMap,
      };
      layerConfig.config.visState.layers[0]['visualChannels'] = {
        colorField: {
          name: colorBy,
          type: colorField?.type,
        },
        colorScale,
      };
    }

    // For non-Arrow data, sanitize to convert BigInt values to Numbers
    // This is necessary because JSON.stringify (used by zustand middleware) cannot serialize BigInt
    // For Arrow data, we use lazy loading so no sanitization is needed
    const sanitizedDatasetForKepler = isArrowTable
      ? undefined
      : (sanitizeForJson(datasetForKepler) as FileCacheItem[]);

    return {
      llmResult: {
        success: true,
        datasetId,
        geometryColumn,
        latitudeColumn,
        longitudeColumn,
        mapType,
        layerId,
        details: `Map layer with id ${layerId} created successfully.`,
      },
      additionalData: {
        datasetId,
        geometryColumn,
        latitudeColumn,
        longitudeColumn,
        mapType,
        layerId,
        // For Arrow data, pass tableName for lazy loading
        // For non-Arrow data, pass the sanitized dataset
        ...(isArrowTable
          ? { tableName: datasetName }
          : { datasetForKepler: sanitizedDatasetForKepler }),
        layerConfig,
        colorBy,
        colorType,
        colorMap,
      },
    };
  } catch (error) {
    console.error('Error creating map:', error);
    return {
      llmResult: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        instruction:
          'Try to fix the error and create a map. If the error persists, pause the execution and ask the user to try with different prompt and context.',
      },
    };
  }
}
