// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

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

      let content;
      let fields;

      const contentType = rawData.headers.get('content-type');
      if (contentType?.includes('json')) {
        const data = await rawData.json();
        content = {
          type: 'geojson',
          content: data,
        };
        // get the fields from the geojson file
        fields = Object.keys(data.features[0].properties);
      } else if (contentType?.includes('csv')) {
        const data = await rawData.text();
        content = {
          type: 'rowObjects',
          content: data.split('\n').map((line) => line.split(',')),
        };
        // first line is the header
        fields = data.split('\n')[0].split(',');
      } else {
        throw new Error(
          'Unsupported file type, only geojson and csv are supported.'
        );
      }

      if (!content) {
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
          [datasetName]: content,
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

export type DownloadMapDataTool = typeof downloadMapData;
