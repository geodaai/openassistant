import { tool } from '@openassistant/utils';
import { z } from 'zod';
import { KeplerGlToolComponent } from './component/keplergl-component';
import {
  FileCacheItem,
  processFileData,
  ProcessFileDataContent,
} from '@kepler.gl/processors';
import * as arrow from 'apache-arrow';
import { arrowSchemaToFields } from './utils';
import { GetDataset, GetGeometries } from '../types';

export type KeplerGlToolArgs = z.ZodObject<{
  datasetName: z.ZodString;
  geometryColumn: z.ZodOptional<z.ZodString>;
  latitudeColumn: z.ZodOptional<z.ZodString>;
  longitudeColumn: z.ZodOptional<z.ZodString>;
  mapType: z.ZodOptional<
    z.ZodEnum<['point', 'line', 'arc', 'polygon', 'heatmap', 'hexbin', 'h3']>
  >;
}>;

/**
 * The createMap tool is used to create a map visualization using Kepler.gl.
 *
 * @example
 * ```typescript
 * import { getVercelAiTool } from '@openassistant/keplergl';
 * import { generateText } from 'ai';
 *
 * const toolContext = {
 *   getDataset: async (datasetName: string) => {
 *     return YOUR_DATASET;
 *   },
 * };
 *
 * const onToolCompleted = (toolCallId: string, additionalData?: unknown) => {
 *   console.log('Tool call completed:', toolCallId, additionalData);
 *   // render the map using <KeplerGlToolComponent props={additionalData} />
 * };
 *
 * const createMapTool = getVercelAiTool('keplergl', toolContext, onToolCompleted);
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Create a point map using the dataset "my_venues"',
 *   tools: {createMap: createMapTool},
 * });
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
export const keplergl = tool<
  KeplerGlToolArgs,
  KeplerGlToolLlmResult,
  KeplerGlToolAdditionalData,
  KeplerglToolContext
>({
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
    config: z
      .string()
      .optional()
      .describe(
        `The Kepler.gl layer configuration JSON object to style the map based on user prompt. Please follow the kepler.gl layer configuration schema.`
      ),
  }),
  execute: executeCreateMap,
  context: {
    config: {
      isDraggable: false,
    },
  },
  component: KeplerGlToolComponent,
});

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

export type KeplerglToolContext = {
  getDataset?: GetDataset;
  getGeometries?: GetGeometries;
  config?: { isDraggable?: boolean; theme?: string };
};

export type KeplerGlToolLlmResult = {
  success: boolean;
  datasetName?: string;
  geometryColumn?: string;
  latitudeColumn?: string;
  longitudeColumn?: string;
  mapType?: string;
  fields?: string;
  layerConfig?: string;
  details?: string;
  error?: string;
  instruction?: string;
};

export type KeplerGlToolAdditionalData = {
  datasetName: string;
  geometryColumn?: string;
  latitudeColumn?: string;
  longitudeColumn?: string;
  mapType?: string;
  datasetForKepler: FileCacheItem[];
  isDraggable: boolean;
  layerConfig?: string;
};

export type ExecuteCreateMapResult = {
  llmResult: KeplerGlToolLlmResult;
  additionalData?: KeplerGlToolAdditionalData;
};

export function isKeplerglToolContext(
  context: unknown
): context is KeplerglToolContext {
  return typeof context === 'object' && context !== null && 'config' in context;
}

export type KeplerglToolArgs = {
  datasetName: string;
  geometryColumn?: string;
  latitudeColumn?: string;
  longitudeColumn?: string;
  mapType?: string;
  config?: string;
};

export function isKeplerglToolArgs(args: unknown): args is KeplerglToolArgs {
  return typeof args === 'object' && args !== null && 'datasetName' in args;
}

async function executeCreateMap(
  args,
  options
): Promise<ExecuteCreateMapResult> {
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
      config: layerConfig,
    } = args;
    const { getDataset, getGeometries, config } = options.context;

    let dataContent;

    if (getDataset) {
      dataContent = await getDataset(datasetName);
    }

    if (!dataContent && getGeometries) {
      // get dataContent from previous tool call
      dataContent = await getGeometries(datasetName);
    }

    if (!dataContent) {
      throw new Error(
        'getDataset() or getGeometries() of CreateMapTool is not implemented'
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

    // update dataId with datasetName
    datasetForKepler[0].info.id = datasetName;

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
        layerConfig,
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
