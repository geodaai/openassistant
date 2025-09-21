// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { generateId, OpenAssistantTool, OpenAssistantToolOptions } from '@openassistant/utils';
import { z } from 'zod';
import {
  FileCacheItem,
  processFileData,
  ProcessFileDataContent,
} from '@kepler.gl/processors';
import * as arrow from 'apache-arrow';
import { arrowSchemaToFields } from './utils';
import { isMapToolContext } from '../register-tools';

export const KeplerGlArgs = z.object({
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

/**
 * ## KeplerglTool
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
 * import { KeplerglTool } from '@openassistant/map';
 * import { generateText } from 'ai';
 *
 * // Simple usage with defaults
 * const keplerglTool = new KeplerglTool();
 *
 * // Or with custom context
 * const keplerglTool = new KeplerglTool(
 *   undefined, // use default description
 *   undefined, // use default parameters
 *   {
 *     getDataset: async (datasetName: string) => {
 *       return YOUR_DATASET;
 *     },
 *   }
 * );
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Create a point map using the dataset "my_venues"',
 *   tools: {createMap: keplerglTool.toVercelAiTool()},
 * });
 * ```
 *
 * :::tip
 * You can use the `downloadMapData` tool with the `keplergl` tool to download a dataset from a geojson or csv from a url and use it to create a map.
 * :::
 *
 * ### Example
 * ```typescript
 * import { DownloadMapDataTool, KeplerglTool } from '@openassistant/map';
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
 * const keplerglTool = new KeplerglTool(
 *   undefined, // use default description
 *   undefined, // use default parameters
 *   {
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
 *   }
 * );
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Create a from https://geodacenter.github.io/data-and-lab//data/Chi_Carjackings.geojson',
 *   tools: {
 *     createMap: keplerglTool.toVercelAiTool(),
 *     downloadMapData: downloadMapTool.toVercelAiTool(),
 *   },
 * });
 * ```
 */
export class KeplerglTool extends OpenAssistantTool<typeof KeplerGlArgs> {
  protected readonly defaultDescription = `Create a map using kepler.gl. You can create basic maps without color styling, or enhanced maps with color visualization.

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

Proceed directly with map creation unless user specifically asks for guidance on variable selection.`;
  protected readonly defaultParameters = KeplerGlArgs;

  constructor(options: OpenAssistantToolOptions<typeof KeplerGlArgs> = {}) {
    super({
      ...options,
      context: options.context || {},
    });
  }

  async execute(
    args: z.infer<typeof KeplerGlArgs>,
    options?: { context?: Record<string, unknown> }
  ): Promise<ExecuteCreateMapResult> {
    return executeCreateMap(args, options);
  }
}

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

export type KeplerGlToolAdditionalData = {
  datasetId: string;
  layerId: string;
  geometryColumn?: string;
  latitudeColumn?: string;
  longitudeColumn?: string;
  mapType?: string;
  datasetForKepler: FileCacheItem[];
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

    // check if dataContent is an Arrow Table
    if (dataContent instanceof arrow.Table) {
      const fields = arrowSchemaToFields(dataContent.schema);

      const cols = [...Array(dataContent.numCols).keys()].map((i) =>
        dataContent.getChildAt(i)
      );

      const result = {
        fields,
        rows: [],
        cols,
        metadata: dataContent.schema.metadata,
      };

      // return empty rows and use raw arrow table to construct column-wise data container
      datasetForKepler = [
        {
          data: result,
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
        datasetForKepler,
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
