// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { getCartogram } from '@geoda/core';
import { extendedTool, generateId } from '@openassistant/utils';
import { isSpatialToolContext } from '../utils';
import { z } from 'zod';
import { Feature } from 'geojson';
import { SpatialToolContext } from '../types';

/**
 * ## cartogram Tool
 *
 * This tool is used to create a dorling cartogram from a given geometries and a variable.
 *
 * ### Cartogram Creation
 *
 * A cartogram is a map type where the original layout of the areal unit is replaced by a geometric form (usually a circle, rectangle, or hexagon) that is proportional to the value of the variable for the location. This is in contrast to a standard choropleth map, where the size of the polygon corresponds to the area of the location in question. The cartogram has a long history and many variants have been suggested, some quite creative. In essence, the construction of a cartogram is an example of a nonlinear optimization problem, where the geometric forms have to be located such that they reflect the topology (spatial arrangement) of the locations as closely as possible (see Tobler 2004, for an extensive discussion of various aspects of the cartogram).
 *
 * <img width="1152" src="https://github.com/user-attachments/assets/eef1834e-e4c0-4ab1-84b1-50a8937b1a86" />
 *
 * ## Example
 * ```ts
 * import { cartogram, CartogramTool } from '@openassistant/geoda';
 * import { convertToVercelAiTool } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * const cartogramTool: CartogramTool = {
 *   ...cartogram,
 *   context: {
 *     getGeometries: (datasetName) => {
 *       return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
 *     },
 *     getValues: (datasetName, variableName) => {
 *       return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *     },
 *   },
 * });
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Create a dorling cartogram from the geometries and the variable "population"',
 *   tools: { cartogram: convertToVercelAiTool(cartogramTool) },
 * });
 * ```
 */
export const cartogram = extendedTool<
  CartogramFunctionArgs,
  CartogramLlmResult,
  CartogramAdditionalData,
  SpatialToolContext
>({
  description:
    'Create a dorling cartogram from a given geometries and a variable',
  parameters: z.object({
    datasetName: z.string(),
    variableName: z.string(),
    iterations: z.number().optional(),
  }),
  execute: async (args, options) => {
    const { datasetName, variableName, iterations } = args;
    if (!options?.context || !isSpatialToolContext(options.context)) {
      throw new Error(
        'Context is required and must implement SpatialToolContext'
      );
    }
    const { getGeometries, getValues } = options.context;

    let geometries;
    if (datasetName && getGeometries) {
      geometries = await getGeometries(datasetName);
    } else {
      throw new Error('No geometries found');
    }

    let values: number[] = [];
    if (datasetName && variableName && getValues) {
      values = (await getValues(datasetName, variableName)) as number[];
    } else {
      throw new Error('No values found');
    }

    const cartogram: Feature[] = await getCartogram(
      geometries,
      values,
      iterations || 100
    );

    // create a unique id for the cartogram result
    const outputDatasetName = `cartogram_${generateId()}`;

    const outputGeojson = {
      type: 'FeatureCollection',
      // append the values to the cartogram features
      features: cartogram.map((feature, index) => ({
        ...feature,
        properties: {
          ...feature.properties,
          [variableName]: values[index],
        },
      })),
    };

    return {
      llmResult: {
        success: true,
        result: `Cartogram created successfully, and it has been saved in dataset: ${outputDatasetName}`,
      },
      additionalData: {
        datasetName: outputDatasetName,
        [outputDatasetName]: {
          type: 'geojson',
          content: outputGeojson,
        },
      },
    };
  },
  context: {
    getGeometries: async () => null,
    getValues: async () => [],
  },
});

export type CartogramFunctionArgs = z.ZodObject<{
  datasetName: z.ZodString;
  variableName: z.ZodString;
  iterations: z.ZodOptional<z.ZodNumber>;
}>;

export type CartogramLlmResult = {
  success: boolean;
  result: string;
};

export type CartogramAdditionalData = {
  datasetName?: string;
  [outputDatasetName: string]: unknown;
};

export type CartogramTool = typeof cartogram;
