// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { getMinimumSpanningTree } from '@geoda/core';
import { OpenAssistantTool, OpenAssistantToolOptions, generateId } from '@openassistant/utils';
import { z } from 'zod';

import { isSpatialToolContext } from '../utils';

/**
 * ## MinimumSpanningTreeTool
 *
 * This tool generates the minimum spanning tree from a given dataset or geojson.
 *
 * ### Minimum Spanning Tree Generation
 *
 * It supports both direct geojson input and dataset names.
 *
 * :::note
 * For polygons, the centroids are used to generate the minimum spanning tree.
 * :::
 *
 * <img width="1040" src="https://github.com/user-attachments/assets/acdde378-05d2-4fce-9eba-c9e6eb3db662" />
 * 
 * Example user prompts:
 * - "Generate the minimum spanning tree for this dataset"
 *
 * ## Example Code
 *
 * ```typescript
 * import { MinimumSpanningTreeTool } from '@openassistant/geoda';
 * import { generateText } from 'ai';
 *
 * // Simple usage with defaults
 * const mstTool = new MinimumSpanningTreeTool();
 *
 * // Or with custom context
 * const mstTool = new MinimumSpanningTreeTool(
 *   undefined, // use default description
 *   undefined, // use default parameters
 *   {
 *     getGeometries: (datasetName) => {
 *       return getGeometries(datasetName);
 *     },
 *   }
 * );
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Generate the minimum spanning tree for this dataset',
 *   tools: { mst: mstTool.toVercelAiTool() },
 * });
 * ```
 *
 */
export const MinimumSpanningTreeArgs = z.object({
  datasetName: z.string().optional(),
  geojson: z
    .string()
    .optional()
    .describe(
      'GeoJSON string of the geometry to calculate area for. Important: it needs to be wrapped in a FeatureCollection object!'
    ),
});

export class MinimumSpanningTreeTool extends OpenAssistantTool<typeof MinimumSpanningTreeArgs> {
  protected getDefaultDescription(): string {
    return 'Generate the minimum spanning tree';
  }
  
  protected getDefaultParameters() {
    return MinimumSpanningTreeArgs;
  }

  constructor(options: OpenAssistantToolOptions<typeof MinimumSpanningTreeArgs> = {}) {
    super({
      ...options,
      context: options.context || {
        getGeometries: async () => null,
      },
    });
  }

  async execute(
    args: z.infer<typeof MinimumSpanningTreeArgs>,
    options?: { context?: Record<string, unknown> }
  ): Promise<{
    llmResult: MinimumSpanningTreeLlmResult;
    additionalData?: MinimumSpanningTreeAdditionalData;
  }> {
    if (!options?.context || !isSpatialToolContext(options.context)) {
      throw new Error(
        'Context is required and must implement SpatialToolContext'
      );
    }

    const { datasetName, geojson } = args;
    const { getGeometries } = options.context;
    let geometries;

    if (geojson) {
      const geojsonObject = JSON.parse(geojson);
      geometries = geojsonObject.features;
    } else if (datasetName && getGeometries) {
      geometries = await getGeometries(datasetName);
    } else {
      throw new Error('No geometries found');
    }

    if (!geometries) {
      throw new Error('No geometries found');
    }

    const mst = await getMinimumSpanningTree({
      geoms: geometries,
    });

    // create a GeoJSON feature collection from the minimum spanning tree
    const mstGeojson = {
      type: 'FeatureCollection',
      features: mst,
    };

    const outputDatasetName = `mst_${generateId()}`;

    return {
      llmResult: {
        success: true,
        result: `Minimum spanning tree generated successfully, and it has been saved in dataset: ${outputDatasetName}`,
      },
      additionalData: {
        datasetName: outputDatasetName,
        [outputDatasetName]: {
          type: 'geojson',
          content: mstGeojson,
        },
      },
    };
  }
}

export type MinimumSpanningTreeLlmResult = {
  success: boolean;
  result: string;
};

export type MinimumSpanningTreeAdditionalData = {
  datasetName: string;
  [key: string]: unknown;
};
