// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistantTool, OpenAssistantToolOptions, generateId } from '@openassistant/utils';
import { z } from 'zod';

export const DownloadMapDataArgs = z.object({
  url: z.string(),
});

export type DownloadMapLlmResult = {
  success: boolean;
  datasetName?: string;
  fields?: string[];
  result?: string;
  instructions?: string;
  error?: string;
};

export type DownloadMapAdditionalData = {
  datasetName: string;
  [datasetName: string]: unknown;
};

/**
 * DownloadMapDataTool
 *
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
 * import { DownloadMapDataTool, KeplerglTool } from '@openassistant/map';
 * import { ToolCache } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * const toolResultCache = ToolCache.getInstance();
 *
 * // Simple usage with defaults
 * const downloadMapTool = new DownloadMapDataTool();
 *
 * // Or with custom callbacks
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
 *   prompt: 'Create a from https://geodacenter.github.io/data-and-lab//data/Chi_Carjackings.geojson',
 *   tools: {
 *     createMap: keplerglTool.toVercelAiTool(),
 *     downloadMapData: downloadMapTool.toVercelAiTool(),
 *   },
 * });
 */
export class DownloadMapDataTool extends OpenAssistantTool<typeof DownloadMapDataArgs> {
  protected getDefaultDescription(): string {
    return 'Download map data from a url';
  }
  
  protected getDefaultParameters() {
    return DownloadMapDataArgs;
  }

  constructor(options: OpenAssistantToolOptions<typeof DownloadMapDataArgs> = {}) {
    super({
      ...options,
      context: options.context || {},
    });
  }

  async execute(
    args: z.infer<typeof DownloadMapDataArgs>
  ): Promise<{
    llmResult: DownloadMapLlmResult;
    additionalData?: DownloadMapAdditionalData;
  }> {
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
  }
}

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
