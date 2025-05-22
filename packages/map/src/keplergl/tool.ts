import { generateId, tool } from '@openassistant/utils';
import { z } from 'zod';
import {
  FileCacheItem,
  processFileData,
  ProcessFileDataContent,
} from '@kepler.gl/processors';
import * as arrow from 'apache-arrow';
import { arrowSchemaToFields } from './utils';
import { MapToolContext, isMapToolContext } from '../register-tools';

export type KeplerGlToolArgs = z.ZodObject<{
  datasetName: z.ZodString;
  geometryColumn: z.ZodOptional<z.ZodString>;
  latitudeColumn: z.ZodOptional<z.ZodString>;
  longitudeColumn: z.ZodOptional<z.ZodString>;
  mapType: z.ZodOptional<
    z.ZodEnum<['point', 'line', 'arc', 'geojson', 'heatmap', 'hexbin', 'h3']>
  >;
  colorBy: z.ZodOptional<z.ZodString>;
  colorType: z.ZodOptional<z.ZodEnum<['breaks', 'unique']>>;
  colorMap: z.ZodOptional<
    z.ZodArray<
      z.ZodObject<{
        value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNull]>;
        color: z.ZodString;
      }>
    >
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
  MapToolContext
>({
  description: `Create a map using kepler.gl. For basic map visualization, you can omit color related parameters.
- When creating a map for a variable, please use dataClassify tool to classify the data into bins or unique values first.
- Please generate colorBrewer colors if user does not provide colors.
- For colorType 'breaks', the colorMap should be format like: [{value: 3, color: '#f7fcb9'}, {value: 10, color: '#addd8e'}, {value: null, color: '#31a354'}]
- For colorType 'unique', the colorMap should be format like: [{value: 'a', color: '#f7fcb9'}, {value: 'b', color: '#addd8e'}, {value: 'c', color: '#31a354'}]
- For geojson dataset, geometryColumn should be '_geojson'.
`,
  parameters: z.object({
    datasetName: z.string(),
    geometryColumn: z.string().optional(),
    latitudeColumn: z.string().optional(),
    longitudeColumn: z.string().optional(),
    mapType: z
      .enum(['point', 'line', 'arc', 'geojson', 'heatmap', 'hexbin', 'h3'])
      .optional()
      .describe('The type of the map. The default is "point".'),
    colorBy: z.string().optional(),
    colorType: z.enum(['breaks', 'unique']).optional(),
    colorMap: z
      .array(
        z.object({
          value: z.union([z.string(), z.number(), z.null()]),
          color: z.string(),
        })
      )
      .optional(),
  }),
  execute: executeCreateMap,
  context: {
    config: {
      isDraggable: false,
    },
  },
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
  isDraggable: boolean;
  layerConfig?: Record<string, unknown>;
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

    console.log('format', format);
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

    console.log('layerConfig', layerConfig);

    return {
      llmResult: {
        success: true,
        datasetId,
        geometryColumn,
        latitudeColumn,
        longitudeColumn,
        mapType,
        layerId,
        details: 'Map layer created successfully.',
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
