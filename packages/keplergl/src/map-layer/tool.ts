import { tool } from '@openassistant/core';
import { z } from 'zod';
import { KeplerGlToolComponent } from './component/keplergl-component';
import {
  FileCacheItem,
  processFileData,
  ProcessFileDataContent,
} from '@kepler.gl/processors';
import * as arrow from 'apache-arrow';
import { arrowSchemaToFields } from './callback-function';

/**
 * The createMap tool is used to create a map visualization using Kepler.gl.
 *
 * @example
 * ```typescript
 * import { createMap } from '@openassistant/keplergl';
 *
 * const createMapTool = {
 *   ...createMap,
 *   context: {
 *     ...createMap.context,
 *     getDataset: async (datasetName: string) => {
 *       // get the dataset from your data source
 *       return YOUR_DATASET;
 *     },
 *   },
 * }
 * ```
 *
 * ### getDataset()
 *
 * User implements this function to get the dataset for visualization.
 *
 * ### config
 *
 * User can configure the map visualization with options like:
 * - isDraggable: Whether the map is draggable
 * - theme: The theme of the map
 */
export const keplergl = tool({
  description: 'create a map',
  parameters: z.object({
    datasetName: z.string().describe('The name of the dataset for mapping.'),
    geometryColumn: z
      .string()
      .optional()
      .describe('The name of the geometry column.'),
    latitudeColumn: z
      .string()
      .optional()
      .describe('The name of the latitude column.'),
    longitudeColumn: z
      .string()
      .optional()
      .describe('The name of the longitude column.'),
    mapType: z
      .enum(['point', 'line', 'arc', 'polygon', 'heatmap', 'hexbin', 'h3'])
      .optional()
      .describe('The type of the map. The default is "point".'),
  }),
  execute: executeCreateMap,
  context: {
    getDataset: async () => {
      throw new Error('getDataset() of CreateMapTool is not implemented');
    },
    config: {
      isDraggable: false,
    },
  },
  component: KeplerGlToolComponent,
});

export type KeplerglToolContext = {
  getDataset: (args: { datasetName: string }) => Promise<any>;
  config: { isDraggable?: boolean; theme?: string };
};

export type KeplerglToolResult = {
  llmResult: {
    success: boolean;
    datasetName?: string;
    geometryColumn?: string;
    latitudeColumn?: string;
    longitudeColumn?: string;
    mapType?: string;
    fields?: string;
    details?: string;
    error?: string;
    instruction?: string;
  };
  additionalData?: {
    datasetName: string;
    geometryColumn?: string;
    latitudeColumn?: string;
    longitudeColumn?: string;
    mapType?: string;
    datasetForKepler: FileCacheItem[];
    isDraggable: boolean;
  };
};

export function isKeplerglToolContext(
  context: unknown
): context is KeplerglToolContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getDataset' in context &&
    'config' in context
  );
}

export type KeplerglToolArgs = {
  datasetName: string;
  geometryColumn?: string;
  latitudeColumn?: string;
  longitudeColumn?: string;
  mapType?: string;
};

export function isKeplerglToolArgs(args: unknown): args is KeplerglToolArgs {
  return typeof args === 'object' && args !== null && 'datasetName' in args;
}

async function executeCreateMap(args, options): Promise<KeplerglToolResult> {
  try {
    if (!isKeplerglToolContext(options.context)) {
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
    } = args;
    const { getDataset, config } = options.context;

    const dataContent = await getDataset({ datasetName });

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
      throw new Error('Dataset not not processed correctly.');
    }

    // get fields from the dataset
    const fields = datasetForKepler[0].data.fields;

    return {
      llmResult: {
        success: true,
        datasetName,
        geometryColumn,
        latitudeColumn,
        longitudeColumn,
        mapType,
        fields: JSON.stringify(fields),
        details: 'Map created successfully.',
      },
      additionalData: {
        datasetName,
        geometryColumn,
        latitudeColumn,
        longitudeColumn,
        mapType,
        datasetForKepler,
        isDraggable: Boolean(config?.isDraggable),
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
