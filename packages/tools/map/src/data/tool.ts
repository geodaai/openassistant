import { extendedTool, generateId } from '@openassistant/utils';
import { MapToolContext } from '../register-tools';
import { z } from 'zod';

export type DownloadMapDataArgs = z.ZodObject<{
  url: z.ZodString;
}>;

export type DownloadMapLlmResult = z.ZodObject<{
  success: z.ZodBoolean;
  datasetName?: z.ZodString;
  fields?: z.ZodArray<z.ZodString>;
  result?: z.ZodString;
  instructions?: z.ZodString;
  error?: z.ZodString;
}>;

export type DownloadMapAdditionalData = {
  datasetName: string;
  [datasetName: string]: unknown;
};

/**
 * The downloadMapData tool is used to download map data (GeoJson or CSV) from a url.
 *
 * :::tip
 * Use this tool to download map data, you can cache the dataset in `onToolCompleted()` 
 * callback. Other tools e.g. `keplergl` can use the downloaded dataset to create a map,
 * or query the downloaded dataset using `localQuery` tool.
 * :::
 * 
 * ### Example
 * ```typescript
 * import { downloadMapData, isDownloadMapAdditionalData, keplergl, KeplerglTool } from '@openassistant/map';
 * import { convertToVercelAiTool } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * const toolResultCache = new Map<string, unknown>();
 * 
 * const downloadMapTool = {
 *   ...downloadMapData,
 *   onToolCompleted: (toolCallId: string, additionalData?: unknown) => {
 *     if (isDownloadMapAdditionalData(additionalData)) {
 *       const datasetName = additionalData.datasetName;
 *       const dataset = additionalData[datasetName];
 *       toolResultCache.set(datasetName, dataset);
 *     }
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
 *       if (toolResultCache.has(datasetName)) {
 *         return toolResultCache.get(datasetName);
 *       }
 *       throw new Error(`Dataset ${datasetName} not found`);
 *     },
 *   },
 * };
 * 
 * * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Create a from https://geodacenter.github.io/data-and-lab//data/Chi_Carjackings.geojson',
 *   tools: {
 *     createMap: convertToVercelAiTool(keplerglTool),
 *     downloadMapData: convertToVercelAiTool(downloadMapTool),
 *   },
 * }); 
 */
export const downloadMapData = extendedTool<
  DownloadMapDataArgs,
  DownloadMapLlmResult,
  DownloadMapAdditionalData,
  MapToolContext
>({
  description: 'Download map data from a url',
  parameters: z.object({
    url: z.string(),
  }),
  execute: async (args) => {
    const { url } = args;
    try {
      // download the url, which could be
      // - a geojson file
      // - a csv file

      const rawData = await fetch(url);

      let data;
      let fields;

      const contentType = rawData.headers.get('content-type');
      if (contentType?.includes('json')) {
        data = await rawData.json();
        // get the fields from the geojson file
        fields = Object.keys(data.features[0].properties);
      } else if (contentType?.includes('csv')) {
        data = await rawData.text();
        // first line is the header
        fields = data.split('\n')[0].split(',');
      } else {
        throw new Error('Unsupported file type, only geojson and csv are supported.');
      }

      if (!data) {
        throw new Error('Unsupported file type, only geojson is supported.');
      }

      // create a unique datasetName
      const datasetName = `map-data-${generateId()}`;

      return {
        llmResult: {
          success: true,
          datasetName,
          fields,
          result: `Successfully downloaded map data from ${url} as datasetName: ${datasetName}`,
          instructions: `Please remember this datasetName ${datasetName} and its fields for later use.`,
        },
        additionalData: {
          datasetName,
          [datasetName]: data,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        llmResult: {
          success: false,
          error: `Failed to download map data from ${url}: ${error}`,
        },
      };
    }
  },
  context: {},
});

export function isDownloadMapAdditionalData(
  data: unknown
): data is DownloadMapAdditionalData {
  if (typeof data === 'object' && data !== null && 'datasetName' in data) {
    const datasetName = data.datasetName;
    if (typeof datasetName === 'string' && data[datasetName] !== undefined) {
      return true;
    }
  }
  return false;
}
